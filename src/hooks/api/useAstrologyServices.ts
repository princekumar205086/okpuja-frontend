import { useState, useCallback } from "react";
import { astrologyService } from "@/lib/services";
import { handleApiError } from "@/lib/api/errorHandler";
import type { AstrologyService } from "@/types";

export function useAstrologyServices() {
  const [services, setServices] = useState<AstrologyService[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await astrologyService.getServices();
      setServices(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { services, loading, fetch };
}
