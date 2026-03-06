import api from "@/lib/api/client";
import type { Event, EventStats } from "@/types";

export const eventService = {
  // --- Public ---
  list: (params?: { show_past?: boolean }) =>
    api.get<Event[]>("/api/misc/events/", { params }),

  getFeatured: () =>
    api.get<Event[]>("/api/misc/events/featured/"),

  getBySlug: (slug: string) =>
    api.get<Event>(`/api/misc/events/${slug}/`),

  // --- Admin ---
  adminList: () =>
    api.get<Event[]>("/api/misc/admin/events/"),

  adminGet: (id: number) =>
    api.get<Event>(`/api/misc/admin/events/${id}/`),

  adminCreate: (data: FormData | Record<string, unknown>) =>
    api.post("/api/misc/admin/events/", data, {
      headers:
        data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    }),

  adminUpdate: (id: number, data: Partial<Event> | FormData) =>
    api.patch(`/api/misc/admin/events/${id}/`, data, {
      headers:
        data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    }),

  adminDelete: (id: number) =>
    api.delete(`/api/misc/admin/events/${id}/`),

  adminToggleFeatured: (id: number) =>
    api.post(`/api/misc/admin/events/${id}/toggle-featured/`),

  adminChangeStatus: (id: number, status: string) =>
    api.post(`/api/misc/admin/events/${id}/change-status/`, { status }),

  adminGetStats: () =>
    api.get<EventStats>("/api/misc/admin/events/stats/"),
};
