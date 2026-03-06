export type UserRole = "USER" | "EMPLOYEE" | "ADMIN";
export type AccountStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";

export interface User {
  id: number;
  email: string;
  username: string;
  phone: string | null;
  role: UserRole;
  account_status: AccountStatus;
  is_active: boolean;
  date_joined: string;
}

export interface UserProfile {
  first_name: string;
  last_name: string;
  dob: string | null;
  profile_picture: string | null;
  profile_thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  id: number;
  email: string;
  username: string;
  role: UserRole;
}

export interface RegisterRequest {
  email: string;
  username?: string;
  password: string;
  password2: string;
  phone?: string;
  role?: UserRole;
}

export interface RefreshRequest {
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  refresh?: string;
}

export interface CheckRoleResponse {
  is_admin: boolean;
  is_employee: boolean;
  is_public_user: boolean;
}
