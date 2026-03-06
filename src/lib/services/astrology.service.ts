import api from "@/lib/api/client";
import type { AstrologyService } from "@/types";

export const astrologyService = {
  getServices: () =>
    api.get<AstrologyService[]>("/api/astrology/services/"),

  createBooking: (data: Record<string, unknown>) =>
    api.post("/api/astrology/bookings/create/", data),

  getBookings: (params?: { status?: string; page?: number }) =>
    api.get("/api/astrology/bookings/", { params }),
};
