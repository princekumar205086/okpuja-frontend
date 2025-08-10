import apiClient from './globalApiconfig';

export interface EventData {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  banner_url: string;
  original_image_url: string;
  imagekit_original_url: string;
  imagekit_thumbnail_url: string;
  imagekit_banner_url: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  registration_link: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  is_featured: boolean;
  days_until: number;
  created_at: string;
  updated_at: string;
}

export interface EventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EventData[];
}

export interface EventFilters {
  status?: string;
  is_featured?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
  search?: string;
}

class EventsAPI {
  // Get all events with optional filters
  async getEvents(filters: EventFilters = {}): Promise<EventsResponse> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/misc/events/?${params}`);
      
      // Ensure response has the expected structure
      if (!response.data) {
        return { count: 0, next: null, previous: null, results: [] };
      }

      // Handle both paginated and direct array responses
      if (Array.isArray(response.data)) {
        return {
          count: response.data.length,
          next: null,
          previous: null,
          results: response.data
        };
      }

      return {
        count: response.data.count || 0,
        next: response.data.next || null,
        previous: response.data.previous || null,
        results: response.data.results || []
      };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { count: 0, next: null, previous: null, results: [] };
    }
  }

  // Get upcoming events (published events with future dates)
  async getUpcomingEvents(limit: number = 10): Promise<EventData[]> {
    try {
      const params = new URLSearchParams({
        status: 'PUBLISHED',
        ordering: 'event_date',
        page_size: limit.toString(),
      });

      const response = await apiClient.get(`/misc/events/?${params}`);
      
      // Check if response.data exists and has results
      if (!response.data) {
        console.error('No data in API response');
        return [];
      }

      // Handle both paginated and direct array responses
      const events = response.data.results || response.data;
      
      if (!Array.isArray(events)) {
        console.error('API response is not an array:', events);
        return [];
      }

      // Filter for future events
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return events.filter((event: EventData) => {
        if (!event.event_date) return false;
        const eventDate = new Date(event.event_date);
        return eventDate >= today;
      });
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  // Get featured events
  async getFeaturedEvents(limit: number = 6): Promise<EventData[]> {
    try {
      const params = new URLSearchParams({
        status: 'PUBLISHED',
        is_featured: 'true',
        ordering: 'event_date',
        page_size: limit.toString(),
      });

      const response = await apiClient.get(`/misc/events/?${params}`);
      
      if (!response.data) {
        return [];
      }

      // Handle both paginated and direct array responses
      const events = response.data.results || response.data;
      
      if (!Array.isArray(events)) {
        console.error('Featured events response is not an array:', events);
        return [];
      }

      return events;
    } catch (error) {
      console.error('Error fetching featured events:', error);
      return [];
    }
  }

  // Get single event by ID
  async getEvent(id: number): Promise<EventData> {
    try {
      const response = await apiClient.get(`/misc/events/${id}/`);
      
      if (!response.data) {
        throw new Error('No event data received');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error; // Re-throw to let the store handle it
    }
  }

  // Get events by date range
  async getEventsByDateRange(startDate: string, endDate: string): Promise<EventData[]> {
    try {
      const params = new URLSearchParams({
        status: 'PUBLISHED',
        event_date_after: startDate,
        event_date_before: endDate,
        ordering: 'event_date',
      });

      const response = await apiClient.get(`/misc/events/?${params}`);
      
      if (!response.data) {
        return [];
      }

      // Handle both paginated and direct array responses
      const events = response.data.results || response.data;
      
      if (!Array.isArray(events)) {
        console.error('Date range events response is not an array:', events);
        return [];
      }

      return events;
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      return [];
    }
  }

  // Get today's events
  async getTodaysEvents(): Promise<EventData[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const params = new URLSearchParams({
        status: 'PUBLISHED',
        event_date: today,
        ordering: 'start_time',
      });

      const response = await apiClient.get(`/misc/events/?${params}`);
      
      if (!response.data) {
        return [];
      }

      // Handle both paginated and direct array responses
      const events = response.data.results || response.data;
      
      if (!Array.isArray(events)) {
        console.error('Today events response is not an array:', events);
        return [];
      }

      return events;
    } catch (error) {
      console.error('Error fetching today events:', error);
      return [];
    }
  }

  // Get events for current month
  async getCurrentMonthEvents(): Promise<EventData[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    return this.getEventsByDateRange(startOfMonth, endOfMonth);
  }
}

export const eventsAPI = new EventsAPI();
