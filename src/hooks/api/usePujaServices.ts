import { useState, useCallback } from "react";
import { pujaService } from "@/lib/services";
import { handleApiError } from "@/lib/api/errorHandler";
import type { PujaCategory, PujaService, PujaPackage } from "@/types";

export function usePujaCategories() {
  const [categories, setCategories] = useState<PujaCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await pujaService.getCategories();
      setCategories(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { categories, loading, fetch };
}

export function usePujaServices() {
  const [services, setServices] = useState<PujaService[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(
    async (params?: { category?: number; search?: string }) => {
      setLoading(true);
      try {
        const { data } = await pujaService.getServices(params);
        setServices(data);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { services, loading, fetch };
}

export function usePujaPackages() {
  const [packages, setPackages] = useState<PujaPackage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await pujaService.getPackages();
      setPackages(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { packages, loading, fetch };
}
