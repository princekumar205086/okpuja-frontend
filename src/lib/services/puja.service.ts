import api from "@/lib/api/client";
import type { PujaCategory, PujaService, PujaPackage, Booking } from "@/types";

export const pujaService = {
  getCategories: () =>
    api.get<PujaCategory[]>("/api/puja/categories/"),

  getServices: (params?: { category?: number; search?: string }) =>
    api.get<PujaService[]>("/api/puja/services/", { params }),

  getPackages: () =>
    api.get<PujaPackage[]>("/api/puja/packages/"),

  createBooking: (data: Record<string, unknown>) =>
    api.post("/api/puja/bookings/create/", data),

  getBookings: (params?: { status?: string; page?: number }) =>
    api.get<Booking[]>("/api/puja/bookings/", { params }),

  getBooking: (id: number) =>
    api.get<Booking>(`/api/puja/bookings/${id}/`),
};
