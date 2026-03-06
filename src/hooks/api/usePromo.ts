import { useState, useCallback } from "react";
import { promoService } from "@/lib/services";
import { handleApiError } from "@/lib/api/errorHandler";
import type { Promo } from "@/types";

export function usePromos() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await promoService.list();
      setPromos(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { promos, loading, fetch };
}

export function usePromoValidation() {
  const [result, setResult] = useState<Promo | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = useCallback(async (code: string) => {
    setLoading(true);
    try {
      const { data } = await promoService.validate(code);
      setResult(data);
      return data;
    } catch (err) {
      handleApiError(err);
      setResult(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, validate };
}
