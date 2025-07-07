import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: number;
  email: string;
  full_name: string;
  contact: string;
  role: string;
  avatar?: string;
};

type RegistrationData = Omit<User, "id" | "role"> & {
  confirm_password?: string;
};

type ErrorResponse = {
  detail?: string;
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
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegistrationData, role: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokensAndUser: (response: {
    user: User;
    access: string;
    refresh: string;
  }) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          // Mock login for demo
          const mockUser = {
            id: 1,
            email,
            full_name: "John Doe",
            contact: "1234567890",
            role: "user"
          };
          
          const mockTokens = {
            access: "mock-access-token",
            refresh: "mock-refresh-token"
          };

          localStorage.setItem("access", mockTokens.access);
          localStorage.setItem("refresh", mockTokens.refresh);
          localStorage.setItem("user", JSON.stringify(mockUser));

          set({
            user: mockUser,
            access: mockTokens.access,
            refresh: mockTokens.refresh,
            loading: false,
            error: null,
          });
        } catch (err: unknown) {
          const error = err as ErrorResponse;
          set({ error: error.detail || "Login failed", loading: false });
        }
      },

      register: async (userData: RegistrationData, role: string) => {
        set({ loading: true, error: null });
        try {
          // Mock registration
          console.log("Registering user:", userData, role);
          set({ loading: false });
        } catch (err: unknown) {
          const error = err as ErrorResponse;
          set({
            error:
              typeof error === "object" && error !== null
                ? JSON.stringify(error)
                : "Registration failed",
            loading: false,
          });
        }
      },

      logout: async () => {
        // Clear local state immediately
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
      },

      setTokensAndUser: (response) => {
        localStorage.setItem("access", response.access);
        localStorage.setItem("refresh", response.refresh);
        localStorage.setItem("user", JSON.stringify(response.user));

        set({
          user: response.user,
          access: response.access,
          refresh: response.refresh,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
