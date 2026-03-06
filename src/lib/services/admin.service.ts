import api from "@/lib/api/client";
import type { ContactInquiry, Promo, User, Booking, PaginatedResponse } from "@/types";

export const adminService = {
  // --- Dashboard ---
  getBookingDashboard: (params?: { days?: number }) =>
    api.get("/api/booking/admin/dashboard/", { params }),

  getPujaDashboard: () =>
    api.get("/api/puja/admin/dashboard/"),

  getAstrologyDashboard: () =>
    api.get("/api/astrology/admin/dashboard/"),

  // --- Bookings ---
  listBookings: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Booking>>("/api/booking/admin/bookings/", { params }),

  getBooking: (id: number) =>
    api.get<Booking>(`/api/booking/admin/bookings/${id}/`),

  updateBooking: (id: number, data: Record<string, unknown>) =>
    api.patch(`/api/booking/admin/bookings/${id}/`, data),

  assignBooking: (id: number, employeeId: number) =>
    api.post(`/api/booking/admin/bookings/${id}/assign/`, {
      employee_id: employeeId,
    }),

  updateBookingStatus: (id: number, status: string, reason?: string) =>
    api.post(`/api/booking/admin/bookings/${id}/status/`, { status, reason }),

  bulkAction: (
    action: string,
    bookingIds: number[],
    extra?: Record<string, unknown>
  ) =>
    api.post("/api/booking/admin/bookings/bulk-action/", {
      action,
      booking_ids: bookingIds,
      ...extra,
    }),

  // --- Employees ---
  listEmployees: () =>
    api.get("/api/booking/admin/bookings/employees/"),

  // --- Reports ---
  getReport: (params: { report_type: string; start_date?: string; end_date?: string }) =>
    api.get("/api/booking/admin/reports/", { params }),

  // --- Users ---
  listUsers: (params?: Record<string, unknown>) =>
    api.get<User[]>("/api/auth/users/", { params }),

  getUser: (id: number) =>
    api.get<User>(`/api/auth/users/${id}/`),

  updateUser: (id: number, data: Partial<User>) =>
    api.patch<User>(`/api/auth/users/${id}/`, data),

  deleteUser: (id: number) =>
    api.delete(`/api/auth/users/${id}/`),

  // --- Contact inquiries ---
  listContacts: (params?: { status?: string; subject?: string }) =>
    api.get<ContactInquiry[]>("/api/misc/admin/contact/", { params }),

  getContact: (id: number) =>
    api.get<ContactInquiry>(`/api/misc/admin/contact/${id}/`),

  markContactReplied: (id: number) =>
    api.post(`/api/misc/admin/contact/${id}/replied/`),

  markContactClosed: (id: number) =>
    api.post(`/api/misc/admin/contact/${id}/closed/`),

  // --- Promos ---
  listPromos: () =>
    api.get<Promo[]>("/api/promo/admin/promos/"),

  // --- Jobs ---
  listJobs: () =>
    api.get("/api/misc/jobs/"),

  getActiveJobs: () =>
    api.get("/api/misc/jobs/active/"),

  getJob: (slug: string) =>
    api.get(`/api/misc/jobs/${slug}/`),
};
