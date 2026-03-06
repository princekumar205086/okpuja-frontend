import apiClient from "./globalApiconfig";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: number;
  email: string;
  username: string;
  phone: string | null;
  role: "ADMIN" | "USER" | "EMPLOYEE";
  account_status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  is_active: boolean;
  date_joined: string;
}

export interface DashboardOverview {
  total_bookings: number;
  confirmed_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  pending_bookings: number;
  rejected_bookings: number;
  failed_bookings: number;
  total_revenue: string;
  average_booking_value: string;
  bookings_this_period: number;
  assigned_bookings: number;
  unassigned_bookings: number;
  active_employees: number;
  today_bookings: number;
  overdue_bookings: number;
}

export interface RecentBooking {
  id: number;
  book_id: string;
  user: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  cart: number | null;
  cart_items_count: number;
  selected_date: string;
  selected_time: string;
  status: string;
  status_display?: string;
  assigned_to: number | null;
  assigned_to_name: string | null;
  total_amount: number;
  booking_age: string;
  time_until_service: string;
  is_overdue: boolean;
  payment_order_id?: string | null;
  address?: number | null;
  address_full?: string | null;
  cancellation_reason?: string | null;
  failure_reason?: string | null;
  rejection_reason?: string | null;
  created_at?: string;
  updated_at?: string;
  payment_info?: {
    payment_id: string;
    status: string;
    method: string;
    transaction_id: string;
  };
}

export interface DashboardData {
  overview: DashboardOverview;
  recent_bookings: RecentBooking[];
}

export interface Employee {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface ReportData {
  success: boolean;
  report_type: string;
  date_range: { start_date: string; end_date: string };
  data: Record<string, unknown>;
}

// ─── Admin User Management ────────────────────────────────────────────────────

export const adminUserApi = {
  list: () => apiClient.get<ApiUser[]>("/auth/users/"),
  get: (id: number) => apiClient.get<ApiUser>(`/auth/users/${id}/`),
  update: (id: number, data: Partial<ApiUser>) => apiClient.patch<ApiUser>(`/auth/users/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/auth/users/${id}/`),
};

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export const adminDashboardApi = {
  get: (days = 30) =>
    apiClient.get<{ success: boolean; data: DashboardData }>(
      `/booking/admin/dashboard/`,
      { params: { days } }
    ),
};

// ─── Admin Bookings ───────────────────────────────────────────────────────────

export const adminBookingApi = {
  list: (params?: { status?: string }) =>
    apiClient.get<RecentBooking[]>("/booking/admin/bookings/", { params }),
  get: (id: number) => apiClient.get<RecentBooking>(`/booking/admin/bookings/${id}/`),
  update: (id: number, data: Record<string, unknown>) =>
    apiClient.patch(`/booking/admin/bookings/${id}/`, data),
  assign: (id: number, employeeId: number) =>
    apiClient.post(`/booking/admin/bookings/${id}/assign/`, { assigned_to_id: employeeId }),
  updateStatus: (id: number, status: string, reason?: string) =>
    apiClient.post(`/booking/admin/bookings/${id}/status/`, {
      status,
      ...(status === "CANCELLED" && reason ? { cancellation_reason: reason } : {}),
    }),
  reschedule: (id: number, date: string, time: string, reason?: string) =>
    apiClient.post(`/booking/admin/bookings/${id}/reschedule/`, {
      selected_date: date,
      selected_time: time,
      ...(reason ? { reason } : {}),
    }),
  bulkAction: (action: string, bookingIds: number[], extra?: Record<string, unknown>) =>
    apiClient.post("/booking/admin/bookings/bulk-actions/", {
      action,
      booking_ids: bookingIds,
      ...extra,
    }),
};

// ─── Employees ────────────────────────────────────────────────────────────────

export const adminEmployeeApi = {
  list: () => apiClient.get<Employee[]>("/booking/admin/bookings/employees/"),
};

// ─── Reports ──────────────────────────────────────────────────────────────────

export const adminReportApi = {
  get: (params?: { report_type?: string; start_date?: string; end_date?: string }) =>
    apiClient.get<ReportData>("/booking/admin/reports/", { params }),
};
