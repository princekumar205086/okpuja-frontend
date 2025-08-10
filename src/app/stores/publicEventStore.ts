import { create } from "zustand";
import { persist } from "zustand/middleware";
import { eventsAPI, EventData, EventFilters } from "../apiService/eventsApi";
import { toast } from "react-hot-toast";

type PublicEventState = {
  events: EventData[];
  upcomingEvents: EventData[];
  featuredEvents: EventData[];
  currentMonthEvents: EventData[];
  todaysEvents: EventData[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;

  // Actions
  fetchEvents: (filters?: EventFilters) => Promise<void>;
  fetchUpcomingEvents: (limit?: number) => Promise<void>;
  fetchFeaturedEvents: (limit?: number) => Promise<void>;
  fetchCurrentMonthEvents: () => Promise<void>;
  fetchTodaysEvents: () => Promise<void>;
  getEvent: (id: number) => Promise<EventData | null>;
  clearError: () => void;
  resetEvents: () => void;
};

export const usePublicEventStore = create<PublicEventState>()(
  persist(
    (set, get) => ({
      events: [],
      upcomingEvents: [],
      featuredEvents: [],
      currentMonthEvents: [],
      todaysEvents: [],
      loading: false,
      error: null,
      totalCount: 0,
      currentPage: 1,
      pageSize: 12,

      fetchEvents: async (filters: EventFilters = {}) => {
        set({ loading: true, error: null });
        
        try {
          const defaultFilters = {
            status: 'PUBLISHED',
            ordering: 'event_date',
            page_size: get().pageSize,
            page: get().currentPage,
            ...filters,
          };

          const response = await eventsAPI.getEvents(defaultFilters);
          
          set({
            events: response.results,
            totalCount: response.count,
            loading: false,
            error: null,
          });

        } catch (err: any) {
          console.error("Fetch events error:", err);
          let errorMessage = "Failed to fetch events. Please try again.";
          
          if (err.response?.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (err.code === 'NETWORK_ERROR' || !err.response) {
            errorMessage = "Network error. Please check your connection.";
          }

          set({ error: errorMessage, loading: false });
        }
      },

      fetchUpcomingEvents: async (limit = 10) => {
        set({ loading: true, error: null });
        
        try {
          const events = await eventsAPI.getUpcomingEvents(limit);
          
          set({
            upcomingEvents: events,
            loading: false,
            error: null,
          });

        } catch (err: any) {
          console.error("Fetch upcoming events error:", err);
          let errorMessage = "Failed to fetch upcoming events.";
          
          if (err.response?.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (err.code === 'NETWORK_ERROR' || !err.response) {
            errorMessage = "Network error. Please check your connection.";
          }

          set({ error: errorMessage, loading: false });
        }
      },

      fetchFeaturedEvents: async (limit = 6) => {
        set({ loading: true, error: null });
        
        try {
          const events = await eventsAPI.getFeaturedEvents(limit);
          
          set({
            featuredEvents: events,
            loading: false,
            error: null,
          });

        } catch (err: any) {
          console.error("Fetch featured events error:", err);
          const errorMessage = "Failed to fetch featured events.";
          
          set({ error: errorMessage, loading: false });
        }
      },

      fetchCurrentMonthEvents: async () => {
        set({ loading: true, error: null });
        
        try {
          const events = await eventsAPI.getCurrentMonthEvents();
          
          set({
            currentMonthEvents: events,
            loading: false,
            error: null,
          });

        } catch (err: any) {
          console.error("Fetch current month events error:", err);
          const errorMessage = "Failed to fetch current month events.";
          
          set({ error: errorMessage, loading: false });
        }
      },

      fetchTodaysEvents: async () => {
        try {
          const events = await eventsAPI.getTodaysEvents();
          
          set({
            todaysEvents: events,
            error: null,
          });

        } catch (err: any) {
          console.error("Fetch today's events error:", err);
        }
      },

      getEvent: async (id: number): Promise<EventData | null> => {
        set({ loading: true, error: null });
        
        try {
          const event = await eventsAPI.getEvent(id);
          
          set({
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
          return null;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      resetEvents: () => {
        set({
          events: [],
          upcomingEvents: [],
          featuredEvents: [],
          currentMonthEvents: [],
          todaysEvents: [],
          error: null,
          totalCount: 0,
          currentPage: 1,
        });
      },
    }),
    {
      name: 'public-event-storage',
      partialize: (state) => ({
        // Only persist non-sensitive data and cache for short periods
        pageSize: state.pageSize,
      }),
    }
  )
);
