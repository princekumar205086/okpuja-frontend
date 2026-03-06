import { useState, useCallback } from "react";
import { galleryService } from "@/lib/services";
import { handleApiError } from "@/lib/api/errorHandler";
import type { GalleryCategory, GalleryItem, GalleryItemDetail } from "@/types";

export function useGalleryCategories() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await galleryService.getCategories();
      setCategories(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { categories, loading, fetch };
}

export function useGalleryItems() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (params?: Record<string, string | number>) => {
    setLoading(true);
    try {
      const { data } = await galleryService.getItems(params);
      setItems(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, loading, fetch };
}

export function useFeaturedGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await galleryService.getFeaturedItems();
      setItems(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, loading, fetch };
}

export function useGalleryItem() {
  const [item, setItem] = useState<GalleryItemDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const { data } = await galleryService.getItem(id);
      setItem(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { item, loading, fetch };
}
