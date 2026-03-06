import api from "@/lib/api/client";
import type { Booking, BookingListParams, PaginatedResponse } from "@/types";

export const bookingService = {
  list: (params?: BookingListParams) =>
    api.get<PaginatedResponse<Booking>>("/api/booking/bookings/", { params }),

  get: (id: number) =>
    api.get<Booking>(`/api/booking/bookings/${id}/`),

  getByBookId: (bookId: string) =>
    api.get<Booking>(`/api/booking/bookings/by-id/${bookId}/`),

  getLatest: () =>
    api.get<Booking>("/api/booking/bookings/latest/"),

  updateStatus: (id: number, status: string) =>
    api.post(`/api/booking/bookings/${id}/status/`, { status }),

  uploadAttachment: (id: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post(`/api/booking/bookings/${id}/upload_attachment/`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getInvoice: (bookId: string) =>
    api.get(`/api/booking/invoice/${bookId}/`),

  getInvoiceHtml: (bookId: string) =>
    api.get<string>(`/api/booking/invoice/html/${bookId}/`),
};
