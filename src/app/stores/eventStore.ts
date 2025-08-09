import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../apiService/globalApiconfig";
import { toast } from "react-hot-toast";

export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";

export type Event = {
  id: number;
  title: string;
  slug: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  registration_link?: string;
  status: EventStatus;
  is_featured: boolean;
  original_image?: string;
  thumbnail_url?: string;
  banner_url?: string;
  original_image_url?: string;
  days_until?: number;
  created_at: string;
  updated_at: string;
};

export type CreateEventData = {
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  registration_link?: string;
  status: EventStatus;
  is_featured: boolean;
  original_image?: File;
};

export type UpdateEventData = Partial<CreateEventData> & {
  id: number;
};

export type EventFilters = {
  status?: EventStatus;
  is_featured?: boolean;
  date_range?: {
    start: string;
    end: string;
  };
  search?: string;
};

type EventState = {
  events: Event[];
  loading: boolean;
  error: string | null;
  currentEvent: Event | null;
  filters: EventFilters;
  totalCount: number;
  currentPage: number;
  pageSize: number;

  // Actions
  fetchEvents: (page?: number, filters?: EventFilters) => Promise<void>;
  createEvent: (eventData: CreateEventData) => Promise<Event | null>;
  updateEvent: (eventData: UpdateEventData) => Promise<Event | null>;
  deleteEvent: (id: number) => Promise<boolean>;
  getEvent: (id: number) => Promise<Event | null>;
  setCurrentEvent: (event: Event | null) => void;
  setFilters: (filters: EventFilters) => void;
  clearError: () => void;
  resetEvents: () => void;
};

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      loading: false,
      error: null,
      currentEvent: null,
      filters: {},
      totalCount: 0,
      currentPage: 1,
      pageSize: 12,

      fetchEvents: async (page = 1, filters = {}) => {
        set({ loading: true, error: null });
        
        try {
          const params = new URLSearchParams();
          params.append('page', page.toString());
          params.append('page_size', get().pageSize.toString());
          
          if (filters.status) {
            params.append('status', filters.status);
          }
          if (filters.is_featured !== undefined) {
            params.append('is_featured', filters.is_featured.toString());
          }
          if (filters.search) {
            params.append('search', filters.search);
          }
          if (filters.date_range) {
            params.append('start_date', filters.date_range.start);
            params.append('end_date', filters.date_range.end);
          }

          const response = await apiClient.get(`/misc/admin/events/?${params}`);
          
          set({
            events: response.data.results || response.data,
            totalCount: response.data.count || response.data.length,
            currentPage: page,
            filters,
            loading: false,
            error: null,
          });

        } catch (err: any) {
          console.error("Fetch events error:", err);
          let errorMessage = "Failed to fetch events. Please try again.";
          
          if (err.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (err.response?.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (err.code === 'NETWORK_ERROR' || !err.response) {
            errorMessage = "Network error. Please check your connection.";
          }

          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },

      createEvent: async (eventData: CreateEventData): Promise<Event | null> => {
        set({ loading: true, error: null });
        
        try {
          const formData = new FormData();
          
          // Add all text fields
          formData.append('title', eventData.title);
          formData.append('description', eventData.description);
          formData.append('event_date', eventData.event_date);
          formData.append('start_time', eventData.start_time);
          formData.append('end_time', eventData.end_time);
          formData.append('location', eventData.location);
          formData.append('status', eventData.status);
          formData.append('is_featured', eventData.is_featured.toString());
          
          if (eventData.registration_link) {
            formData.append('registration_link', eventData.registration_link);
          }
          
          if (eventData.original_image) {
            formData.append('original_image', eventData.original_image);
          }

          const response = await apiClient.post('/misc/admin/events/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const newEvent = response.data;
          
          // Add to events list
          set(state => ({
            events: [newEvent, ...state.events],
            totalCount: state.totalCount + 1,
            loading: false,
            error: null,
          }));

          toast.success("Event created successfully!");
          return newEvent;

        } catch (err: any) {
          console.error("Create event error:", err);
          let errorMessage = "Failed to create event. Please try again.";
          
          if (err.response?.data) {
            if (typeof err.response.data === 'object') {
              const errors = err.response.data;
              const firstError = Object.values(errors)[0];
              if (Array.isArray(firstError)) {
                errorMessage = firstError[0];
              } else if (typeof firstError === 'string') {
                errorMessage = firstError;
              }
            }
          }

          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return null;
        }
      },

      updateEvent: async (eventData: UpdateEventData): Promise<Event | null> => {
        set({ loading: true, error: null });
        
        try {
          const formData = new FormData();
          
          // Add all fields that are provided
          Object.entries(eventData).forEach(([key, value]) => {
            if (key !== 'id' && value !== undefined && value !== null) {
              if (key === 'original_image' && value instanceof File) {
                formData.append(key, value);
              } else if (key !== 'original_image') {
                formData.append(key, value.toString());
              }
            }
          });

          const response = await apiClient.patch(`/misc/admin/events/${eventData.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const updatedEvent = response.data;
          
          // Update in events list
          set(state => ({
            events: state.events.map(event => 
              event.id === eventData.id ? updatedEvent : event
            ),
            currentEvent: state.currentEvent?.id === eventData.id ? updatedEvent : state.currentEvent,
            loading: false,
            error: null,
          }));

          toast.success("Event updated successfully!");
          return updatedEvent;

        } catch (err: any) {
          console.error("Update event error:", err);
          let errorMessage = "Failed to update event. Please try again.";
          
          if (err.response?.data) {
            if (typeof err.response.data === 'object') {
              const errors = err.response.data;
              const firstError = Object.values(errors)[0];
              if (Array.isArray(firstError)) {
                errorMessage = firstError[0];
              } else if (typeof firstError === 'string') {
                errorMessage = firstError;
              }
            }
          }

          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return null;
        }
      },

      deleteEvent: async (id: number): Promise<boolean> => {
        set({ loading: true, error: null });
        
        try {
          await apiClient.delete(`/misc/admin/events/${id}/`);
          
          // Remove from events list
          set(state => ({
            events: state.events.filter(event => event.id !== id),
            totalCount: Math.max(0, state.totalCount - 1),
            currentEvent: state.currentEvent?.id === id ? null : state.currentEvent,
            loading: false,
            error: null,
          }));

          toast.success("Event deleted successfully!");
          return true;

        } catch (err: any) {
          console.error("Delete event error:", err);
          let errorMessage = "Failed to delete event. Please try again.";
          
          if (err.response?.status === 404) {
            errorMessage = "Event not found.";
          } else if (err.response?.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          }

          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      getEvent: async (id: number): Promise<Event | null> => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiClient.get(`/misc/admin/events/${id}/`);
          const event = response.data;
          
          set({
            currentEvent: event,
            loading: false,
            error: null,
          });

          return event;

        } catch (err: any) {
          console.error("Get event error:", err);
          let errorMessage = "Failed to fetch event details.";
          
          if (err.response?.status === 404) {
            errorMessage = "Event not found.";
          }

          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return null;
        }
      },

      setCurrentEvent: (event: Event | null) => {
        set({ currentEvent: event });
      },

      setFilters: (filters: EventFilters) => {
        set({ filters });
      },

      clearError: () => {
        set({ error: null });
      },

      resetEvents: () => {
        set({
          events: [],
          currentEvent: null,
          filters: {},
          totalCount: 0,
          currentPage: 1,
          error: null,
        });
      },
    }),
    {
      name: 'event-storage',
      partialize: (state) => ({
        // Only persist non-sensitive data
        filters: state.filters,
        pageSize: state.pageSize,
      }),
    }
  )
);


