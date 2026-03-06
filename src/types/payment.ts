export interface PaymentCreateRequest {
  booking_id: number;
  amount: number;
  payment_method?: string;
}

export interface PaymentCreateResponse {
  redirect_url: string;
  merchant_order_id: string;
}

export interface Payment {
  id: number;
  merchant_order_id: string;
  amount: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentStatusResponse {
  merchant_order_id: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  amount: string;
  payment_method?: string;
}

export interface RefundRequest {
  reason?: string;
}
