import api from "@/lib/api/client";
import type {
  PaymentCreateRequest,
  PaymentCreateResponse,
  Payment,
  PaymentStatusResponse,
} from "@/types";

export const paymentService = {
  create: (data: PaymentCreateRequest) =>
    api.post<PaymentCreateResponse>("/api/payments/create/", data),

  list: () =>
    api.get<Payment[]>("/api/payments/list/"),

  getStatus: (merchantOrderId: string) =>
    api.get<PaymentStatusResponse>(
      `/api/payments/status/${merchantOrderId}/`
    ),

  refund: (merchantOrderId: string, reason?: string) =>
    api.post(`/api/payments/refund/${merchantOrderId}/`, { reason }),

  verifyAndComplete: (data: Record<string, unknown>) =>
    api.post("/api/payments/verify-and-complete/", data),

  /**
   * Poll payment status every `interval` ms until status !== PENDING
   * or `maxAttempts` reached.
   */
  async pollStatus(
    merchantOrderId: string,
    interval = 3000,
    maxAttempts = 20
  ): Promise<PaymentStatusResponse> {
    for (let i = 0; i < maxAttempts; i++) {
      const { data } = await this.getStatus(merchantOrderId);
      if (data.status !== "PENDING") return data;
      await new Promise((r) => setTimeout(r, interval));
    }
    throw new Error("Payment verification timed out");
  },
};
