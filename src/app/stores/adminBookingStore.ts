import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../apiService/globalApiconfig';
import { toast } from 'react-hot-toast';

// Types based on Swagger API responses
export interface AdminUser {
  id: number;
  email: string;
  username: string;
  phone: string;
  role: string;
  account_status: string;
  is_active: boolean;
  date_joined: string;
}

export interface AstrologyService {
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
  user: AdminUser;
  service: AstrologyService;
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
  session_notes?: string;
  is_session_scheduled: boolean;
  metadata?: {
    payment_confirmed: boolean;
    payment_order_id: string;
    merchant_order_id: string;
    payment_amount: number;
    payment_completed_at: string;
    phonepe_transaction_id: string;
  };
  created_at: string;
  updated_at: string;
  customer_name: string;
  session_status: string;
  payment_status: string;
  days_until_session: number;
}

export interface RegularBooking {
  id: number;
  book_id: string;
  user: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  cart: number;
  cart_items_count: number;
  payment_order_id: string;
  selected_date: string;
  selected_time: string;
  address: number;
  address_full: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'REJECTED';
  status_display: string;
  assigned_to?: number;
  assigned_to_name?: string;
  cancellation_reason?: string;
  failure_reason?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  total_amount: number;
  booking_age: string;
  time_until_service: string;
  payment_info: {
    payment_id: string;
    status: string;
    method?: string;
    transaction_id: string;
  };
  is_overdue: boolean;
}

export interface PujaBooking {
  id: number;
  puja_service: number;
  service_title: string;
  service_type: string;
  category_name: string;
  package: number;
  package_name: string;
  package_price: string;
  user?: number;
  user_email: string;
  contact_name: string;
  contact_email: string;
  contact_number: string;
  address: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  status_display: string;
  special_instructions?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  booking_age: string;
  time_until_service: string;
}

export interface DashboardOverview {
  total_bookings: number;
  confirmed_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  pending_bookings?: number;
  rejected_bookings?: number;
  failed_bookings?: number;
  pending_sessions?: number;
  total_revenue: string;
  average_booking_value: string;
  bookings_this_period: number;
  active_services: number;
  assigned_bookings?: number;
  unassigned_bookings?: number;
  active_employees?: number;
  today_bookings?: number;
  overdue_bookings?: number;
  total_packages?: number;
  total_categories?: number;
}

export interface BulkActionRequest {
  booking_ids: number[];
  action: string;
  params?: { [key: string]: any };
}

export interface AdminBookingState {
  // Data
  astrologyBookings: AstrologyBooking[];
  regularBookings: RegularBooking[];
  pujaBookings: PujaBooking[];
  
  // Dashboard data
  astrologyDashboard: any;
  regularDashboard: any;
  pujaDashboard: any;
  
  // UI States
  loading: boolean;
  error: string | null;
  currentView: 'astrology' | 'regular' | 'puja' | 'all';
  
  // Actions
  fetchAstrologyBookings: (params?: any) => Promise<void>;
  fetchRegularBookings: (params?: any) => Promise<void>;
  fetchPujaBookings: (params?: any) => Promise<void>;
  fetchAllBookings: () => Promise<void>;
  
  // Dashboard Actions
  fetchAstrologyDashboard: () => Promise<void>;
  fetchRegularDashboard: () => Promise<void>;
  fetchPujaDashboard: () => Promise<void>;
  
  // Bulk Actions
  performBulkAction: (type: 'astrology' | 'regular' | 'puja', request: BulkActionRequest) => Promise<boolean>;
  
  // Individual Actions
  updateAstrologyBooking: (astroBookId: string, data: any) => Promise<boolean>;
  updateBookingStatus: (type: 'regular' | 'puja', id: number, status: string, reason?: string) => Promise<boolean>;
  
  // Reports
  generateReport: (type: 'astrology' | 'regular' | 'puja', params?: any) => Promise<any>;
  
  // Utility
  setCurrentView: (view: 'astrology' | 'regular' | 'puja' | 'all') => void;
  clearError: () => void;
}

export const useAdminBookingStore = create<AdminBookingState>()(
  persist(
    (set, get) => ({
      // Initial state
      astrologyBookings: [],
      regularBookings: [],
      pujaBookings: [],
      astrologyDashboard: null,
      regularDashboard: null,
      pujaDashboard: null,
      loading: false,
      error: null,
      currentView: 'all',

      // Fetch astrology bookings
      fetchAstrologyBookings: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const queryParams = new URLSearchParams();
          
          // Add filtering parameters
          if (params.search) queryParams.append('search', params.search);
          if (params.ordering) queryParams.append('ordering', params.ordering);
          if (params.status) queryParams.append('status', params.status);
          if (params.service) queryParams.append('service', params.service.toString());
          if (params.date_from) queryParams.append('date_from', params.date_from);
          if (params.date_to) queryParams.append('date_to', params.date_to);
          if (params.is_session_scheduled !== undefined) {
            queryParams.append('is_session_scheduled', params.is_session_scheduled.toString());
          }
          
          const url = `/astrology/admin/bookings/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
          const response = await apiClient.get(url);
          
          set({
            astrologyBookings: response.data || [],
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

      // Fetch regular bookings
      fetchRegularBookings: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const queryParams = new URLSearchParams();
          
          // Add filtering parameters
          if (params.search) queryParams.append('search', params.search);
          if (params.ordering) queryParams.append('ordering', params.ordering);
          if (params.status) queryParams.append('status', params.status);
          if (params.date_from) queryParams.append('date_from', params.date_from);
          if (params.date_to) queryParams.append('date_to', params.date_to);
          if (params.created_from) queryParams.append('created_from', params.created_from);
          if (params.created_to) queryParams.append('created_to', params.created_to);
          if (params.has_assignment !== undefined) {
            queryParams.append('has_assignment', params.has_assignment.toString());
          }
          if (params.is_overdue !== undefined) {
            queryParams.append('is_overdue', params.is_overdue.toString());
          }
          if (params.assigned_to) queryParams.append('assigned_to', params.assigned_to.toString());
          
          const url = `/booking/admin/bookings/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
          const response = await apiClient.get(url);
          
          set({
            regularBookings: response.data || [],
            loading: false,
            error: null
          });
        } catch (err: any) {
          console.error('Fetch regular bookings error:', err);
          let errorMessage = 'Failed to load bookings';
          
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

      // Fetch puja bookings
      fetchPujaBookings: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const queryParams = new URLSearchParams();
          
          // Add filtering parameters
          if (params.search) queryParams.append('search', params.search);
          if (params.ordering) queryParams.append('ordering', params.ordering);
          if (params.status) queryParams.append('status', params.status);
          if (params.date_from) queryParams.append('date_from', params.date_from);
          if (params.date_to) queryParams.append('date_to', params.date_to);
          if (params.service_type) queryParams.append('service_type', params.service_type);
          if (params.category) queryParams.append('category', params.category.toString());
          
          const url = `/puja/admin/bookings/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
          const response = await apiClient.get(url);
          
          set({
            pujaBookings: response.data || [],
            loading: false,
            error: null
          });
        } catch (err: any) {
          console.error('Fetch puja bookings error:', err);
          let errorMessage = 'Failed to load puja bookings';
          
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

      // Fetch all bookings
      fetchAllBookings: async () => {
        await Promise.all([
          get().fetchAstrologyBookings(),
          get().fetchRegularBookings(),
          get().fetchPujaBookings()
        ]);
      },

      // Fetch astrology dashboard
      fetchAstrologyDashboard: async () => {
        try {
          const response = await apiClient.get('/astrology/admin/dashboard/');
          set({ astrologyDashboard: response.data });
        } catch (err: any) {
          console.error('Fetch astrology dashboard error:', err);
        }
      },

      // Fetch regular booking dashboard
      fetchRegularDashboard: async () => {
        try {
          const response = await apiClient.get('/booking/admin/dashboard/');
          set({ regularDashboard: response.data });
        } catch (err: any) {
          console.error('Fetch regular dashboard error:', err);
        }
      },

      // Fetch puja dashboard
      fetchPujaDashboard: async () => {
        try {
          const response = await apiClient.get('/puja/admin/dashboard/');
          set({ pujaDashboard: response.data });
        } catch (err: any) {
          console.error('Fetch puja dashboard error:', err);
        }
      },

      // Perform bulk actions
      performBulkAction: async (type: 'astrology' | 'regular' | 'puja', request: BulkActionRequest): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          let endpoint = '';
          switch (type) {
            case 'astrology':
              endpoint = '/astrology/admin/bookings/bulk-actions/';
              break;
            case 'regular':
              endpoint = '/booking/admin/bookings/bulk-actions/';
              break;
            case 'puja':
              endpoint = '/puja/admin/bookings/bulk-actions/';
              break;
          }
          
          const response = await apiClient.post(endpoint, request);
          
          if (response.data.success) {
            toast.success(response.data.message || 'Bulk action completed successfully');
            
            // Refresh the corresponding bookings
            switch (type) {
              case 'astrology':
                await get().fetchAstrologyBookings();
                break;
              case 'regular':
                await get().fetchRegularBookings();
                break;
              case 'puja':
                await get().fetchPujaBookings();
                break;
            }
            
            set({ loading: false });
            return true;
          } else {
            throw new Error(response.data.message || 'Bulk action failed');
          }
        } catch (err: any) {
          console.error('Bulk action error:', err);
          let errorMessage = 'Failed to perform bulk action';
          
          if (err.response?.data?.errors) {
            errorMessage = Object.values(err.response.data.errors).flat().join(', ');
          } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          }
          
          set({
            error: errorMessage,
            loading: false
          });
          toast.error(errorMessage);
          return false;
        }
      },

      // Update astrology booking
      updateAstrologyBooking: async (astroBookId: string, data: any): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          await apiClient.put(`/astrology/admin/bookings/${astroBookId}/`, data);
          
          // Refresh astrology bookings
          await get().fetchAstrologyBookings();
          
          toast.success('Astrology booking updated successfully');
          set({ loading: false });
          return true;
        } catch (err: any) {
          console.error('Update astrology booking error:', err);
          let errorMessage = 'Failed to update astrology booking';
          
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

      // Update booking status (for regular and puja bookings)
      updateBookingStatus: async (type: 'regular' | 'puja', id: number, status: string, reason?: string): Promise<boolean> => {
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
          
          let endpoint = '';
          if (type === 'regular') {
            endpoint = `/booking/bookings/${id}/status/`;
          } else {
            endpoint = `/puja/admin/bookings/${id}/status/`;
          }
          
          await apiClient.post(endpoint, data);
          
          // Refresh corresponding bookings
          if (type === 'regular') {
            await get().fetchRegularBookings();
          } else {
            await get().fetchPujaBookings();
          }
          
          toast.success('Booking status updated successfully');
          set({ loading: false });
          return true;
        } catch (err: any) {
          console.error('Update booking status error:', err);
          let errorMessage = 'Failed to update booking status';
          
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

      // Generate reports
      generateReport: async (type: 'astrology' | 'regular' | 'puja', params = {}) => {
        try {
          const queryParams = new URLSearchParams();
          
          if (params.report_type) queryParams.append('report_type', params.report_type);
          if (params.start_date) queryParams.append('start_date', params.start_date);
          if (params.end_date) queryParams.append('end_date', params.end_date);
          
          let endpoint = '';
          switch (type) {
            case 'astrology':
              endpoint = '/astrology/admin/reports/';
              break;
            case 'regular':
              endpoint = '/booking/admin/reports/';
              break;
            case 'puja':
              endpoint = '/puja/admin/reports/';
              break;
          }
          
          const url = `${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
          const response = await apiClient.get(url);
          
          return response.data;
        } catch (err: any) {
          console.error('Generate report error:', err);
          toast.error('Failed to generate report');
          return null;
        }
      },

      // Set current view
      setCurrentView: (view: 'astrology' | 'regular' | 'puja' | 'all') => {
        set({ currentView: view });
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'admin-booking-storage',
      partialize: (state) => ({
        currentView: state.currentView,
      }),
    }
  )
);
