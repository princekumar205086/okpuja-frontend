import api from "@/lib/api/client";
import { setTokens, clearTokens } from "@/lib/auth/token";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshRequest,
  RefreshResponse,
  UserProfile,
  CheckRoleResponse,
} from "@/types";

export const authService = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/api/auth/login/", data),

  register: (data: RegisterRequest) =>
    api.post("/api/auth/register/", data),

  refresh: (data: RefreshRequest) =>
    api.post<RefreshResponse>("/api/auth/refresh/", data),

  logout: () => {
    clearTokens();
    return api.post("/api/auth/logout/");
  },

  getProfile: () => api.get<UserProfile>("/api/auth/profile/"),

  updateProfile: (data: Partial<UserProfile>) =>
    api.patch<UserProfile>("/api/auth/profile/", data),

  checkRole: () => api.get<CheckRoleResponse>("/api/auth/check-role/"),

  /** Helper: login + persist tokens */
  async loginAndStore(data: LoginRequest): Promise<LoginResponse> {
    const res = await this.login(data);
    setTokens(res.data.access, res.data.refresh);
    return res.data;
  },
};
