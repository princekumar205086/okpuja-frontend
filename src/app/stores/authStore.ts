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
  first_name?: string;
  last_name?: string;
  phone?: string;
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
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
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
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  resendOTP: (email: string) => Promise<boolean>;
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
        set({ loading: true });
        try {
          // Check if we're in the browser
          if (typeof window === 'undefined') {
            set({ loading: false });
            return;
          }

          // Add listeners for cross-tab synchronization
          const handleTokenUpdate = (event: CustomEvent) => {
            const { access, refresh } = event.detail;
            set({ access, refresh });
          };

          const handleLogout = () => {
            set({
              user: null,
              access: null,
              refresh: null,
              loading: false,
              error: null,
            });
          };

          window.addEventListener('token-updated', handleTokenUpdate as EventListener);
          window.addEventListener('logout', handleLogout);

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
          } else {
            // Clear any partial data
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

          const { refresh, access, id, role, account_status, email_verified, full_name, first_name, last_name, phone, avatar } = response.data;

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
            full_name,
            first_name,
            last_name,
            phone,
            avatar,
          };

          // Store in localStorage
          localStorage.setItem("access", access);
          localStorage.setItem("refresh", refresh);
          localStorage.setItem("user", JSON.stringify(user));

          // Notify other tabs about token update
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('token-updated', { 
              detail: { access, refresh } 
            }));
          }

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

      verifyOTP: async (email: string, otp: string): Promise<boolean> => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiClient.post('/auth/verify-otp/', {
            email,
            otp,
          });

          const { access, refresh } = response.data;

          // Update localStorage
          localStorage.setItem("access", access);
          localStorage.setItem("refresh", refresh);

          // Notify other tabs about token update
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('token-updated', { 
              detail: { access, refresh } 
            }));
          }

          // Update store
          set({
            access,
            refresh,
            loading: false,
            error: null,
          });

          toast.success("OTP verified successfully!");
          return true;

        } catch (err: any) {
          console.error("OTP verification error:", err);
          let errorMessage = "OTP verification failed. Please try again.";
          
          if (err.response?.status === 400) {
            errorMessage = "Invalid OTP. Please check the code and try again.";
          } else if (err.response?.status === 404) {
            errorMessage = "Email not found. Please register first.";
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

      resendOTP: async (email: string): Promise<boolean> => {
        set({ loading: true, error: null });
        
        try {
          await apiClient.post('/auth/resend-otp/', { email });
          set({ loading: false });
          toast.success("OTP resent successfully! Please check your email.");
          return true;

        } catch (err: any) {
          console.error("Resend OTP error:", err);
          let errorMessage = "Failed to resend OTP. Please try again.";
          
          if (err.response?.status === 404) {
            errorMessage = "Email not found. Please register first.";
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
        
        // Notify other tabs about logout
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('logout'));
        }
        
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
          const response = await apiClient.post('/auth/refresh/', {
            refresh,
          });

          const { access, refresh: newRefresh } = response.data;
          localStorage.setItem("access", access);
          
          // Handle token rotation - update refresh token if provided
          if (newRefresh) {
            localStorage.setItem("refresh", newRefresh);
            set({ access, refresh: newRefresh });
            
            // Notify other tabs about token update
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('token-updated', { 
                detail: { access, refresh: newRefresh } 
              }));
            }
          } else {
            set({ access });
            
            // Notify other tabs about token update
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('token-updated', { 
                detail: { access, refresh } 
              }));
            }
          }
          
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
          
          // Notify other tabs about logout
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('logout'));
          }
          
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      // Disable persistence for tokens - handle manually to avoid conflicts
      partialize: (state) => ({
        // Only persist user data, not tokens
        user: state.user,
      }),
      // Custom storage handling
      merge: (persistedState: any, currentState: any) => {
        // Merge persisted state but get tokens fresh from localStorage
        const access = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
        const refresh = typeof window !== 'undefined' ? localStorage.getItem('refresh') : null;
        
        return {
          ...currentState,
          ...persistedState,
          access,
          refresh,
        };
      },
    }
  )
);
