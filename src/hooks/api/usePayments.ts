import { useState, useCallback } from "react";
import { paymentService } from "@/lib/services";
import { handleApiError } from "@/lib/api/errorHandler";
import type { Payment, PaymentCreateRequest, PaymentStatusResponse } from "@/types";

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await paymentService.list();
      setPayments(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { payments, loading, fetch };
}

export function usePaymentFlow() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatusResponse | null>(null);

  const initiate = useCallback(async (data: PaymentCreateRequest) => {
    setLoading(true);
    try {
      const res = await paymentService.create(data);
      // Redirect to payment gateway
      if (typeof window !== "undefined" && res.data.redirect_url) {
        window.location.href = res.data.redirect_url;
      }
      return res.data;
    } catch (err) {
      handleApiError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const pollAndVerify = useCallback(async (merchantOrderId: string) => {
    setLoading(true);
    try {
      const result = await paymentService.pollStatus(merchantOrderId);
      setStatus(result);
      return result;
    } catch (err) {
      handleApiError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, status, initiate, pollAndVerify };
}
