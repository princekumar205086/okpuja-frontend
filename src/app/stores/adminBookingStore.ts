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

export interface Employee {
  id: number;
  email: string;
  username: string;
  phone?: string;
  role: string;
  account_status: string;
  is_active: boolean;
  date_joined: string;
}

export interface BookingAssignmentData {
  assigned_to: number;
  assignment_notes?: string;
}

export interface StatusChangeData {
  status: string;
  reason?: string;
  cancellation_reason?: string;
  failure_reason?: string;
  rejection_reason?: string;
}

export interface SessionScheduleData {
  google_meet_link: string;
  session_notes?: string;
  preferred_date?: string;
  preferred_time?: string;
}

export interface AdminBookingState {
  // Data
  astrologyBookings: AstrologyBooking[];
  regularBookings: RegularBooking[];
  pujaBookings: PujaBooking[];
  employees: Employee[];
  
  // Dashboard data
  astrologyDashboard: any;
  regularDashboard: any;
  pujaDashboard: any;
  
  // UI States
  loading: boolean;
  error: string | null;
  currentView: 'astrology' | 'regular' | 'puja' | 'all';
  selectedBookings: number[];
  
  // Actions
  fetchAstrologyBookings: (params?: any) => Promise<void>;
  fetchRegularBookings: (params?: any) => Promise<void>;
  fetchPujaBookings: (params?: any) => Promise<void>;
  fetchAllBookings: () => Promise<void>;
  fetchEmployees: () => Promise<void>;
  
  // Dashboard Actions
  fetchAstrologyDashboard: () => Promise<void>;
  fetchRegularDashboard: () => Promise<void>;
  fetchPujaDashboard: () => Promise<void>;
  
  // Status Management
  updateBookingStatus: (type: 'astrology' | 'regular' | 'puja', id: number, statusData: StatusChangeData) => Promise<boolean>;
  bulkUpdateStatus: (type: 'astrology' | 'regular' | 'puja', bookingIds: number[], statusData: StatusChangeData) => Promise<boolean>;
  
  // Assignment Management
  assignBooking: (type: 'regular' | 'puja', id: number, assignmentData: BookingAssignmentData) => Promise<boolean>;
  bulkAssignBookings: (type: 'regular' | 'puja', bookingIds: number[], assignmentData: BookingAssignmentData) => Promise<boolean>;
  unassignBooking: (type: 'regular' | 'puja', id: number) => Promise<boolean>;
  
  // Reschedule Actions
  rescheduleAstrologyBooking: (id: number, data: { preferred_date: string; preferred_time: string; reason?: string }) => Promise<any>;
  rescheduleRegularBooking: (id: number, data: { selected_date: string; selected_time: string; reason?: string }) => Promise<any>;
  reschedulePujaBooking: (id: number, data: { new_date: string; new_time: string; reason?: string }) => Promise<any>;
  
  // Astrology Session Management
  scheduleAstrologySession: (id: number, sessionData: SessionScheduleData) => Promise<boolean>;
  updateSessionLink: (id: number, googleMeetLink: string, notes?: string) => Promise<boolean>;
  
  // Bulk Actions
  performBulkAction: (type: 'astrology' | 'regular' | 'puja', request: BulkActionRequest) => Promise<boolean>;
  
  // Individual Actions
  updateAstrologyBooking: (astroBookId: string, data: any) => Promise<boolean>;
  
  // Reports
  generateReport: (type: 'astrology' | 'regular' | 'puja', params?: any) => Promise<any>;
  exportBookings: (type: 'astrology' | 'regular' | 'puja', format: 'csv' | 'excel', params?: any) => Promise<boolean>;
  
  // Selection Management
  toggleBookingSelection: (id: number) => void;
  selectAllBookings: (bookingIds: number[]) => void;
  clearSelection: () => void;
  
  // Utility
  setCurrentView: (view: 'astrology' | 'regular' | 'puja' | 'all') => void;
  clearError: () => void;
  
  // Filters and Search
  getFilteredBookings: (type: 'astrology' | 'regular' | 'puja', filters: any) => any[];
  searchBookings: (type: 'astrology' | 'regular' | 'puja', query: string) => any[];
}

export const useAdminBookingStore = create<AdminBookingState>()(
  persist(
    (set, get) => ({
      // Initial state
      astrologyBookings: [],
      regularBookings: [],
      pujaBookings: [],
      employees: [],
      astrologyDashboard: null,
      regularDashboard: null,
      pujaDashboard: null,
      loading: false,
      error: null,
      currentView: 'all',
      selectedBookings: [],

      // Fetch employees
      fetchEmployees: async () => {
        try {
          const response = await apiClient.get('/accounts/admin/employees/');
          set({ employees: response.data || [] });
        } catch (err: any) {
          console.error('Fetch employees error:', err);
        }
      },

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

      // Fetch puja bookings (same as regular bookings - they come from same API)
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
          if (params.created_from) queryParams.append('created_from', params.created_from);
          if (params.created_to) queryParams.append('created_to', params.created_to);
          if (params.has_assignment !== undefined) {
            queryParams.append('has_assignment', params.has_assignment.toString());
          }
          if (params.is_overdue !== undefined) {
            queryParams.append('is_overdue', params.is_overdue.toString());
          }
          if (params.assigned_to) queryParams.append('assigned_to', params.assigned_to.toString());
          
          // Use the same endpoint as regular bookings since puja services are part of regular bookings
          const url = `/booking/admin/bookings/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
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

      // Fetch puja dashboard (same as regular dashboard since they use same API)
      fetchPujaDashboard: async () => {
        try {
          const response = await apiClient.get('/booking/admin/dashboard/');
          set({ 
            pujaDashboard: response.data,
            regularDashboard: response.data // Set both since they're the same data
          });
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

      // Status Management
      updateBookingStatus: async (type: 'astrology' | 'regular' | 'puja', id: number, statusData: StatusChangeData): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          let endpoint = '';
          const payload: any = { status: statusData.status };
          
          // Add reason based on status and type
          if (statusData.reason) {
            if (statusData.status === 'CANCELLED') {
              payload.cancellation_reason = statusData.reason;
            } else if (statusData.status === 'REJECTED') {
              payload.rejection_reason = statusData.reason;
            } else if (statusData.status === 'FAILED') {
              payload.failure_reason = statusData.reason;
            }
          }
          
          // Add any additional status-specific data
          if (statusData.cancellation_reason) payload.cancellation_reason = statusData.cancellation_reason;
          if (statusData.failure_reason) payload.failure_reason = statusData.failure_reason;
          if (statusData.rejection_reason) payload.rejection_reason = statusData.rejection_reason;
          
          switch (type) {
            case 'astrology':
              endpoint = `/astrology/admin/bookings/${id}/status/`;
              break;
            case 'regular':
              endpoint = `/booking/admin/bookings/${id}/status/`;
              break;
            case 'puja':
              endpoint = `/puja/admin/bookings/${id}/status/`;
              break;
          }
          
          await apiClient.patch(endpoint, payload);
          
          // Refresh corresponding bookings
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
          
          toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} booking status updated successfully`);
          set({ loading: false });
          return true;
        } catch (err: any) {
          console.error('Update booking status error:', err);
          let errorMessage = 'Failed to update booking status';
          
          if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          } else if (err.response?.data?.error) {
            errorMessage = err.response.data.error;
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      bulkUpdateStatus: async (type: 'astrology' | 'regular' | 'puja', bookingIds: number[], statusData: StatusChangeData): Promise<boolean> => {
        return await get().performBulkAction(type, {
          booking_ids: bookingIds,
          action: 'update_status',
          params: statusData
        });
      },

      // Assignment Management
      assignBooking: async (type: 'regular' | 'puja', id: number, assignmentData: BookingAssignmentData): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          let endpoint = '';
          
          switch (type) {
            case 'regular':
              endpoint = `/booking/admin/bookings/${id}/assign/`;
              break;
            case 'puja':
              endpoint = `/puja/admin/bookings/${id}/assign/`;
              break;
          }
          
          await apiClient.patch(endpoint, assignmentData);
          
          // Refresh corresponding bookings
          if (type === 'regular') {
            await get().fetchRegularBookings();
          } else {
            await get().fetchPujaBookings();
          }
          
          toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} booking assigned successfully`);
          set({ loading: false });
          return true;
        } catch (err: any) {
          console.error('Assign booking error:', err);
          let errorMessage = 'Failed to assign booking';
          
          if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      bulkAssignBookings: async (type: 'regular' | 'puja', bookingIds: number[], assignmentData: BookingAssignmentData): Promise<boolean> => {
        return await get().performBulkAction(type, {
          booking_ids: bookingIds,
          action: 'assign',
          params: assignmentData
        });
      },

      unassignBooking: async (type: 'regular' | 'puja', id: number): Promise<boolean> => {
        return await get().assignBooking(type, id, { assigned_to: 0 }); // Assuming 0 or null unassigns
      },

      // Astrology Session Management
      scheduleAstrologySession: async (id: number, sessionData: SessionScheduleData): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          await apiClient.patch(`/astrology/admin/bookings/${id}/schedule/`, sessionData);
          
          await get().fetchAstrologyBookings();
          
          toast.success('Astrology session scheduled successfully');
          set({ loading: false });
          return true;
        } catch (err: any) {
          console.error('Schedule astrology session error:', err);
          let errorMessage = 'Failed to schedule astrology session';
          
          if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      updateSessionLink: async (id: number, googleMeetLink: string, notes?: string): Promise<boolean> => {
        return await get().scheduleAstrologySession(id, {
          google_meet_link: googleMeetLink,
          session_notes: notes
        });
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

      // Reschedule booking methods
      rescheduleAstrologyBooking: async (id: number, data: { preferred_date: string; preferred_time: string; reason?: string }) => {
        try {
          set({ loading: true, error: null });
          
          const response = await apiClient.patch(`/astrology/bookings/${id}/reschedule/`, data);
          
          // Refresh astrology bookings
          await get().fetchAstrologyBookings();
          
          toast.success('Astrology booking rescheduled successfully');
          set({ loading: false });
          return response.data;
        } catch (err: any) {
          console.error('Reschedule astrology booking error:', err);
          let errorMessage = 'Failed to reschedule astrology booking';
          
          // Handle validation errors
          if (err.response?.data) {
            const errorData = err.response.data;
            
            // Handle field validation errors like {"reason":["This field may not be blank."]}
            if (typeof errorData === 'object' && !errorData.detail && !errorData.error) {
              const validationErrors = [];
              for (const [field, messages] of Object.entries(errorData)) {
                if (Array.isArray(messages)) {
                  validationErrors.push(`${field}: ${messages.join(', ')}`);
                } else if (typeof messages === 'string') {
                  validationErrors.push(`${field}: ${messages}`);
                }
              }
              if (validationErrors.length > 0) {
                errorMessage = validationErrors.join('; ');
              }
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          }
          
          set({
            error: errorMessage,
            loading: false
          });
          toast.error(errorMessage);
          return null;
        }
      },

      rescheduleRegularBooking: async (id: number, data: { selected_date: string; selected_time: string; reason?: string }) => {
        try {
          set({ loading: true, error: null });
          
          const response = await apiClient.post(`/booking/admin/bookings/${id}/reschedule/`, data);
          
          // Refresh regular bookings
          await get().fetchRegularBookings();
          
          toast.success('Regular booking rescheduled successfully');
          set({ loading: false });
          return response.data;
        } catch (err: any) {
          console.error('Reschedule regular booking error:', err);
          let errorMessage = 'Failed to reschedule regular booking';
          
          // Handle validation errors
          if (err.response?.data) {
            const errorData = err.response.data;
            
            // Handle field validation errors like {"reason":["This field may not be blank."]}
            if (typeof errorData === 'object' && !errorData.detail && !errorData.error) {
              const validationErrors = [];
              for (const [field, messages] of Object.entries(errorData)) {
                if (Array.isArray(messages)) {
                  validationErrors.push(`${field}: ${messages.join(', ')}`);
                } else if (typeof messages === 'string') {
                  validationErrors.push(`${field}: ${messages}`);
                }
              }
              if (validationErrors.length > 0) {
                errorMessage = validationErrors.join('; ');
              }
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          }
          
          set({
            error: errorMessage,
            loading: false
          });
          toast.error(errorMessage);
          return null;
        }
      },

      reschedulePujaBooking: async (id: number, data: { new_date: string; new_time: string; reason?: string }) => {
        try {
          set({ loading: true, error: null });
          
          const response = await apiClient.post(`/puja/bookings/${id}/reschedule/`, data);
          
          // Refresh puja bookings
          await get().fetchPujaBookings();
          
          toast.success('Puja booking rescheduled successfully');
          set({ loading: false });
          return response.data;
        } catch (err: any) {
          console.error('Reschedule puja booking error:', err);
          let errorMessage = 'Failed to reschedule puja booking';
          
          // Handle validation errors
          if (err.response?.data) {
            const errorData = err.response.data;
            
            // Handle field validation errors like {"reason":["This field may not be blank."]}
            if (typeof errorData === 'object' && !errorData.detail && !errorData.error) {
              const validationErrors = [];
              for (const [field, messages] of Object.entries(errorData)) {
                if (Array.isArray(messages)) {
                  validationErrors.push(`${field}: ${messages.join(', ')}`);
                } else if (typeof messages === 'string') {
                  validationErrors.push(`${field}: ${messages}`);
                }
              }
              if (validationErrors.length > 0) {
                errorMessage = validationErrors.join('; ');
              }
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          }
          
          set({
            error: errorMessage,
            loading: false
          });
          toast.error(errorMessage);
          return null;
        }
      },

      // Export bookings
      exportBookings: async (type: 'astrology' | 'regular' | 'puja', format: 'csv' | 'excel', params = {}): Promise<boolean> => {
        try {
          set({ loading: true, error: null });
          
          const queryParams = new URLSearchParams();
          queryParams.append('format', format);
          
          // Add any additional parameters
          Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              queryParams.append(key, value.toString());
            }
          });
          
          let endpoint = '';
          switch (type) {
            case 'astrology':
              endpoint = '/astrology/admin/bookings/export/';
              break;
            case 'regular':
              endpoint = '/booking/admin/bookings/export/';
              break;
            case 'puja':
              endpoint = '/puja/admin/bookings/export/';
              break;
          }
          
          const url = `${endpoint}?${queryParams.toString()}`;
          const response = await apiClient.get(url, { responseType: 'blob' });
          
          // Create download link
          const blob = new Blob([response.data]);
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `${type}_bookings.${format}`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(downloadUrl);
          
          toast.success('Bookings exported successfully');
          set({ loading: false });
          return true;
        } catch (err: any) {
          console.error('Export bookings error:', err);
          let errorMessage = 'Failed to export bookings';
          
          if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      // Selection Management
      toggleBookingSelection: (id: number) => {
        set((state) => ({
          selectedBookings: state.selectedBookings.includes(id)
            ? state.selectedBookings.filter(bookingId => bookingId !== id)
            : [...state.selectedBookings, id]
        }));
      },

      selectAllBookings: (bookingIds: number[]) => {
        set({ selectedBookings: bookingIds });
      },

      clearSelection: () => {
        set({ selectedBookings: [] });
      },

      // Filters and Search
      getFilteredBookings: (type: 'astrology' | 'regular' | 'puja', filters: any) => {
        const state = get();
        let bookings: any[] = [];
        
        switch (type) {
          case 'astrology':
            bookings = state.astrologyBookings;
            break;
          case 'regular':
            bookings = state.regularBookings;
            break;
          case 'puja':
            bookings = state.pujaBookings;
            break;
        }
        
        return bookings.filter(booking => {
          // Apply filters
          if (filters.status && booking.status !== filters.status) return false;
          if (filters.dateFrom && new Date(booking.created_at) < new Date(filters.dateFrom)) return false;
          if (filters.dateTo && new Date(booking.created_at) > new Date(filters.dateTo)) return false;
          
          // Type-specific filters
          if (type === 'astrology') {
            if (filters.sessionScheduled !== undefined && booking.is_session_scheduled !== filters.sessionScheduled) return false;
            if (filters.serviceType && booking.service?.service_type !== filters.serviceType) return false;
          }
          
          if (type === 'regular' || type === 'puja') {
            if (filters.assigned !== undefined) {
              const isAssigned = !!booking.assigned_to;
              if (filters.assigned !== isAssigned) return false;
            }
            if (filters.overdue !== undefined && booking.is_overdue !== filters.overdue) return false;
          }
          
          return true;
        });
      },

      searchBookings: (type: 'astrology' | 'regular' | 'puja', query: string) => {
        const state = get();
        let bookings: any[] = [];
        
        switch (type) {
          case 'astrology':
            bookings = state.astrologyBookings;
            break;
          case 'regular':
            bookings = state.regularBookings;
            break;
          case 'puja':
            bookings = state.pujaBookings;
            break;
        }
        
        const lowerQuery = query.toLowerCase();
        
        return bookings.filter(booking => {
          // Search in common fields
          if (booking.id?.toString().includes(lowerQuery)) return true;
          if (booking.contact_email?.toLowerCase().includes(lowerQuery)) return true;
          if (booking.contact_phone?.includes(query)) return true;
          
          // Type-specific search fields
          if (type === 'astrology') {
            if (booking.astro_book_id?.toLowerCase().includes(lowerQuery)) return true;
            if (booking.service?.title?.toLowerCase().includes(lowerQuery)) return true;
            if (booking.birth_place?.toLowerCase().includes(lowerQuery)) return true;
          }
          
          if (type === 'regular' || type === 'puja') {
            if (booking.book_id?.toLowerCase().includes(lowerQuery)) return true;
            if (booking.user_name?.toLowerCase().includes(lowerQuery)) return true;
            if (booking.address_full?.toLowerCase().includes(lowerQuery)) return true;
          }
          
          if (type === 'puja') {
            if (booking.service_title?.toLowerCase().includes(lowerQuery)) return true;
            if (booking.contact_name?.toLowerCase().includes(lowerQuery)) return true;
          }
          
          return false;
        });
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
        selectedBookings: state.selectedBookings,
      }),
    }
  )
);
