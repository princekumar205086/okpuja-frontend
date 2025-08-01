import { create } from 'zustand';
import apiClient from '../apiService/globalApiconfig';
import { toast } from 'react-hot-toast';

export interface Booking {
  id: number;
  book_id: string;
  user: {
    id: number;
    email: string;
    username: string;
    phone: string;
  };
  cart: {
    id: number;
    cart_id: string;
    user: number;
    service_type: 'PUJA' | 'ASTROLOGY';
    puja_service?: any;
    package?: any;
    astrology_service?: any;
    selected_date: string;
    selected_time: string;
    promo_code?: any;
    status: string;
    created_at: string;
    updated_at: string;
    total_price: string;
  };
  selected_date: string;
  selected_time: string;
  address: {
    id: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
  };
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'REJECTED';
  total_amount: string;
  cancellation_reason?: string;
  failure_reason?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  attachments: any[];
}

export interface CreateBookingRequest {
  cart_id: number;
  address_id: number;
  selected_date: string;
  selected_time: string;
  status?: string;
}

export interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  currentBooking: Booking | null;
  
  // Actions
  fetchBookings: () => Promise<void>;
  createBooking: (bookingData: CreateBookingRequest) => Promise<Booking | null>;
  getBookingById: (id: number) => Promise<Booking | null>;
  getBookingByBookId: (bookId: string) => Promise<Booking | null>;
  getLatestBooking: () => Promise<Booking | null>;
  updateBookingStatus: (id: number, status: string, reason?: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentBooking: () => void;
}

export const useBookingStore = create<BookingState>()((set, get) => ({
  bookings: [],
  loading: false,
  error: null,
  currentBooking: null,

  fetchBookings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/booking/bookings/');
      const bookings = response.data || [];
      set({ 
        bookings,
        loading: false,
        error: null 
      });
    } catch (err: any) {
      console.error('Fetch bookings error:', err);
      let errorMessage = 'Failed to load bookings';
      
      if (err.response?.status === 401) {
        errorMessage = 'Please login to view bookings';
      }
      
      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },

  createBooking: async (bookingData: CreateBookingRequest): Promise<Booking | null> => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('cart_id', bookingData.cart_id.toString());
      formData.append('address_id', bookingData.address_id.toString());
      formData.append('selected_date', bookingData.selected_date);
      formData.append('selected_time', bookingData.selected_time);
      if (bookingData.status) {
        formData.append('status', bookingData.status);
      }
      
      const response = await apiClient.post('/booking/bookings/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Get the full booking details
      const bookingId = response.data.id || response.data.booking_id;
      if (bookingId) {
        const fullBooking = await get().getBookingById(bookingId);
        if (fullBooking) {
          set({ 
            currentBooking: fullBooking,
            loading: false,
            error: null 
          });
          return fullBooking;
        }
      }
      
      set({ loading: false });
      return response.data;
    } catch (err: any) {
      console.error('Create booking error:', err);
      let errorMessage = 'Failed to create booking';
      
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const firstError = Object.values(errorData)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'Please login to create booking';
      }
      
      set({ 
        error: errorMessage,
        loading: false 
      });
      toast.error(errorMessage);
      return null;
    }
  },

  getBookingById: async (id: number): Promise<Booking | null> => {
    try {
      const response = await apiClient.get(`/booking/bookings/${id}/`);
      return response.data;
    } catch (err: any) {
      console.error('Get booking error:', err);
      return null;
    }
  },

  getBookingByBookId: async (bookId: string): Promise<Booking | null> => {
    try {
      const response = await apiClient.get(`/booking/bookings/by-id/${bookId}/`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (err: any) {
      console.error('Get booking by book_id error:', err);
      return null;
    }
  },

  // Get latest booking (fallback for when book_id is not available)
  getLatestBooking: async (): Promise<Booking | null> => {
    try {
      const response = await apiClient.get('/booking/bookings/latest/');
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (err: any) {
      console.error('Get latest booking error:', err);
      return null;
    }
  },

  updateBookingStatus: async (id: number, status: string, reason?: string): Promise<boolean> => {
    set({ loading: true, error: null });
    try {
      const data: any = { status };
      if (reason) {
        if (status === 'CANCELLED') {
          data.cancellation_reason = reason;
        } else if (status === 'FAILED') {
          data.failure_reason = reason;
        } else if (status === 'REJECTED') {
          data.rejection_reason = reason;
        }
      }
      
      await apiClient.post(`/booking/bookings/${id}/status/`, data);
      
      // Refresh bookings
      await get().fetchBookings();
      
      toast.success('Booking status updated successfully!');
      return true;
    } catch (err: any) {
      console.error('Update booking status error:', err);
      set({ error: 'Failed to update booking status', loading: false });
      toast.error('Failed to update booking status');
      return false;
    }
  },

  clearError: () => set({ error: null }),
  
  clearCurrentBooking: () => set({ currentBooking: null }),
}));
