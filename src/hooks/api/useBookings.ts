import { useState, useCallback } from "react";
import { bookingService } from "@/lib/services";
import { handleApiError } from "@/lib/api/errorHandler";
import type { Booking, BookingListParams, PaginatedResponse } from "@/types";

export function useBookings() {
  const [data, setData] = useState<PaginatedResponse<Booking> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (params?: BookingListParams) => {
    setLoading(true);
    try {
      const res = await bookingService.list(params);
      setData(res.data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bookings: data?.results ?? [],
    count: data?.count ?? 0,
    loading,
    fetch,
  };
}

export function useBookingDetail() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const { data } = await bookingService.get(id);
      setBooking(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { booking, loading, fetch };
}
