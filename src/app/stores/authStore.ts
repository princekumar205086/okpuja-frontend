import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../apiService/globalApiconfig";
import { toast } from "react-hot-toast";

type User = {
  id: number;
  email: string;
  role: string;
  account_status: string;
  email_verified: boolean;
  full_name?: string;
  avatar?: string;
};

type RegistrationData = {
  email: string;
  password: string;
  confirm_password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
};

type LoginResponse = {
  refresh: string;
  access: string;
  id: number;
  email: string;
  role: string;
  account_status: string;
  email_verified: boolean;
};

type ErrorResponse = {
  detail?: string;
  message?: string;
  [key: string]: unknown;
};

type AuthState = {
  user: User | null;
  access: string | null;
  refresh: string | null;
  loading: boolean;
  error: string | null;

  // Initialize auth from localStorage
  initAuth: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshToken: () => Promise<boolean>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      access: null,
      refresh: null,
      loading: false,
      error: null,

      // Initialize auth state from localStorage
      initAuth: () => {
        try {
          const access = localStorage.getItem("access");
          const refresh = localStorage.getItem("refresh");
          const userStr = localStorage.getItem("user");
          
          if (access && refresh && userStr) {
            const user = JSON.parse(userStr);
            
            set({
              user,
              access,
              refresh,
              loading: false,
              error: null,
            });
          }
        } catch (err) {
          console.error("Error initializing auth:", err);
          // Clear any invalid data in storage
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");
          set({
            user: null,
            access: null,
            refresh: null,
            loading: false,
            error: null,
          });
        }
      },

      login: async (email: string, password: string): Promise<boolean> => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiClient.post<LoginResponse>('/auth/login/', {
            email,
            password,
          });

          const { refresh, access, id, role, account_status, email_verified } = response.data;

          // Check account status
          if (account_status !== 'ACTIVE') {
            let errorMessage = '';
            switch (account_status) {
              case 'PENDING':
                errorMessage = 'Please verify your email before logging in.';
                break;
              case 'SUSPENDED':
                errorMessage = 'Your account has been suspended. Please contact support.';
                break;
              case 'DEACTIVATED':
                errorMessage = 'Your account has been deactivated. Please contact support.';
                break;
              default:
                errorMessage = 'Login failed. Unknown account status.';
            }
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            return false;
          }

          // Create user object
          const user: User = {
            id,
            email,
            role,
            account_status,
            email_verified,
          };

          // Store in localStorage
          localStorage.setItem("access", access);
          localStorage.setItem("refresh", refresh);
          localStorage.setItem("user", JSON.stringify(user));

          // Update store
          set({
            user,
            access,
            refresh,
            loading: false,
            error: null,
          });

          toast.success("Login successful!");
          return true;

        } catch (err: any) {
          console.error("Login error:", err, err.response?.data);
          let errorMessage = "Login failed. Please try again.";
          
          if (err.response?.status === 401 || err.response?.status === 400) {
            errorMessage = "Invalid email or password.";
          } else if (err.response?.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (err.code === 'NETWORK_ERROR' || !err.response) {
            errorMessage = "Network error. Please check your connection.";
          }

          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      register: async (userData: RegistrationData) => {
        set({ loading: true, error: null });
        try {
          await apiClient.post('/auth/register/', userData);
          toast.success("Registration successful! Please check your email for verification.");
          set({ loading: false });
        } catch (err: any) {
          console.error("Registration error:", err);
          let errorMessage = "Registration failed. Please try again.";
          
          if (err.response?.data) {
            if (typeof err.response.data === 'object') {
              // Handle field-specific errors
              const errors = err.response.data;
              if (errors.email) {
                errorMessage = `Email: ${errors.email[0] || errors.email}`;
              } else if (errors.password) {
                errorMessage = `Password: ${errors.password[0] || errors.password}`;
              } else if (errors.detail || errors.message) {
                errorMessage = errors.detail || errors.message;
              }
            }
          }

          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },

      logout: async () => {
        const { refresh } = get();
        
        // Try to logout on server
        try {
          if (refresh) {
            await apiClient.post('/auth/logout/', { refresh });
            toast.success("Logged out successfully from server");
          }
        } catch (err) {
          console.error("Logout error:", err);
          // Continue with local logout even if server logout fails
        }

        // Clear local state
        set({
          user: null,
          access: null,
          refresh: null,
          loading: false,
          error: null,
        });
        
        // Clear localStorage
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        
        toast.success("Logged out successfully");
      },

      clearError: () => {
        set({ error: null });
      },

      refreshToken: async (): Promise<boolean> => {
        const { refresh } = get();
        
        if (!refresh) {
          return false;
        }

        try {
          const response = await apiClient.post('/auth/token/refresh/', {
            refresh,
          });

          const { access } = response.data;
          localStorage.setItem("access", access);
          set({ access });
          return true;
        } catch (err) {
          console.error("Token refresh failed:", err);
          // Clear auth state
          set({
            user: null,
            access: null,
            refresh: null,
            error: "Session expired. Please login again.",
          });
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        access: state.access,
        refresh: state.refresh,
      }),
    }
  )
);
