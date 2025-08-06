import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../apiService/globalApiconfig';
import { toast } from 'react-hot-toast';

export interface AstrologyUser {
  id: number;
  email: string;
  username: string;
  phone: string;
  role: string;
  account_status: string;
  is_active: boolean;
  date_joined: string;
}

export interface AstrologyServiceDetail {
  id: number;
  title: string;
  service_type: string;
  description: string;
  image_url?: string;
  image_thumbnail_url?: string;
  image_card_url?: string;
  price: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AstrologyBooking {
  id: number;
  astro_book_id: string;
  payment_id: string;
  user: AstrologyUser;
  service: AstrologyServiceDetail;
  language: string;
  preferred_date: string;
  preferred_time: string;
  birth_place: string;
  birth_date: string;
  birth_time: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  questions: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  contact_email: string;
  contact_phone: string;
  google_meet_link?: string;
  created_at: string;
  updated_at: string;
}

export interface AstrologyBookingConfirmation {
  success: boolean;
  data: {
    booking: AstrologyBooking;
  };
}

export interface AstrologyBookingState {
  // Data
  bookings: AstrologyBooking[];
  currentBooking: AstrologyBooking | null;
  
  // UI States
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchAstrologyBookings: () => Promise<void>;
  getAstrologyBookingConfirmation: (astroBookId: string) => Promise<AstrologyBooking | null>;
  clearError: () => void;
  clearCurrentBooking: () => void;
  
  // Google Meet Link functionality (for admin use)
  updateGoogleMeetLink: (bookingId: number, meetLink: string) => Promise<boolean>;
}

export const useAstrologyBookingStore = create<AstrologyBookingState>()(
  persist(
    (set, get) => ({
      // Initial state
      bookings: [],
      currentBooking: null,
      loading: false,
      error: null,

      // Fetch all astrology bookings for current user
      fetchAstrologyBookings: async () => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.get('/astrology/bookings/');
          const bookings = response.data || [];
          
          set({ 
            bookings,
            loading: false,
            error: null 
          });
        } catch (err: any) {
          console.error('Fetch astrology bookings error:', err);
          let errorMessage = 'Failed to load astrology bookings';
          
          if (err.response?.status === 401) {
            errorMessage = 'Please login to view bookings';
          } else if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          }
          
          set({ 
            error: errorMessage,
            loading: false 
          });
          toast.error(errorMessage);
        }
      },

      // Get astrology booking confirmation by astro_book_id
      getAstrologyBookingConfirmation: async (astroBookId: string): Promise<AstrologyBooking | null> => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.get<AstrologyBookingConfirmation>(
            `/astrology/bookings/confirmation/?astro_book_id=${astroBookId}`
          );
          
          if (response.data.success && response.data.data.booking) {
            const booking = response.data.data.booking;
            set({ 
              currentBooking: booking,
              loading: false,
              error: null 
            });
            return booking;
          }
          
          set({ loading: false });
          return null;
        } catch (err: any) {
          console.error('Get astrology booking confirmation error:', err);
          let errorMessage = 'Failed to get booking confirmation';
          
          if (err.response?.status === 404) {
            errorMessage = 'Booking not found';
          } else if (err.response?.status === 400) {
            errorMessage = 'Invalid booking ID';
          } else if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          }
          
          set({ 
            error: errorMessage,
            loading: false 
          });
          toast.error(errorMessage);
          return null;
        }
      },

      // Update Google Meet link (admin functionality)
      updateGoogleMeetLink: async (bookingId: number, meetLink: string): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          // Note: This endpoint doesn't exist in the current API
          // This is a placeholder for future implementation
          await apiClient.patch(`/astrology/bookings/${bookingId}/update/`, {
            google_meet_link: meetLink
          });
          
          // Refresh bookings
          await get().fetchAstrologyBookings();
          
          toast.success('Google Meet link updated successfully!');
          set({ loading: false });
          return true;
        } catch (err: any) {
          console.error('Update Google Meet link error:', err);
          let errorMessage = 'Failed to update Google Meet link';
          
          if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          }
          
          set({ 
            error: errorMessage,
            loading: false 
          });
          toast.error(errorMessage);
          return false;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
      
      // Clear current booking
      clearCurrentBooking: () => set({ currentBooking: null }),
    }),
    {
      name: 'astrology-booking-storage',
      partialize: (state) => ({
        // Only persist non-sensitive data
        bookings: state.bookings,
      }),
    }
  )
);
