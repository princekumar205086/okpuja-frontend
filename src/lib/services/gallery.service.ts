import api from "@/lib/api/client";
import type { GalleryCategory, GalleryItem, GalleryItemDetail } from "@/types";

export const galleryService = {
  getCategories: () =>
    api.get<GalleryCategory[]>("/api/gallery/categories/"),

  getCategory: (slug: string) =>
    api.get<GalleryCategory>(`/api/gallery/categories/${slug}/`),

  getCategoryItems: (slug: string) =>
    api.get<GalleryItem[]>(`/api/gallery/categories/${slug}/items/`),

  getItems: (params?: { category?: string; page?: number }) =>
    api.get<GalleryItem[]>("/api/gallery/items/", { params }),

  getFeaturedItems: () =>
    api.get<GalleryItem[]>("/api/gallery/items/featured/"),

  getItem: (id: number) =>
    api.get<GalleryItemDetail>(`/api/gallery/items/${id}/`),

  // --- Admin ---
  adminListItems: () =>
    api.get<GalleryItem[]>("/api/gallery/admin/items/"),

  adminUpload: (formData: FormData) =>
    api.post("/api/gallery/admin/items/upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  adminGetItem: (id: number) =>
    api.get<GalleryItemDetail>(`/api/gallery/admin/items/${id}/`),

  adminUpdateItem: (id: number, data: Partial<GalleryItem>) =>
    api.patch(`/api/gallery/admin/items/${id}/`, data),

  adminDeleteItem: (id: number) =>
    api.delete(`/api/gallery/admin/items/${id}/`),
};
