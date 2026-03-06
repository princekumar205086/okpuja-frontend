export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface Booking {
  id: number;
  book_id: string;
  user: { id: number; email: string; username: string };
  puja?: { id: number; name: string };
  status: BookingStatus;
  booking_date: string;
  selected_date?: string;
  total_amount: string;
  assigned_to?: { id: number; email: string; username: string } | null;
  assigned_to_name?: string;
  user_name?: string;
  booking_age?: string;
  is_overdue?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface BookingListParams {
  status?: BookingStatus;
  page?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface InvoiceResponse {
  invoice_url?: string;
  html?: string;
}
