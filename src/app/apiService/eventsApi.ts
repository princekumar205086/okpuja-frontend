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
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/misc/events/?${params}`);
    return response.data;
  }

  // Get upcoming events (published events with future dates)
  async getUpcomingEvents(limit: number = 10): Promise<EventData[]> {
    const params = new URLSearchParams({
      status: 'PUBLISHED',
      ordering: 'event_date',
      page_size: limit.toString(),
    });

    const response = await apiClient.get(`/misc/events/?${params}`);
    
    // Filter for future events
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return response.data.results.filter((event: EventData) => {
      const eventDate = new Date(event.event_date);
      return eventDate >= today;
    });
  }

  // Get featured events
  async getFeaturedEvents(limit: number = 6): Promise<EventData[]> {
    const params = new URLSearchParams({
      status: 'PUBLISHED',
      is_featured: 'true',
      ordering: 'event_date',
      page_size: limit.toString(),
    });

    const response = await apiClient.get(`/misc/events/?${params}`);
    return response.data.results;
  }

  // Get single event by ID
  async getEvent(id: number): Promise<EventData> {
    const response = await apiClient.get(`/misc/events/${id}/`);
    return response.data;
  }

  // Get events by date range
  async getEventsByDateRange(startDate: string, endDate: string): Promise<EventData[]> {
    const params = new URLSearchParams({
      status: 'PUBLISHED',
      event_date_after: startDate,
      event_date_before: endDate,
      ordering: 'event_date',
    });

    const response = await apiClient.get(`/misc/events/?${params}`);
    return response.data.results;
  }

  // Get today's events
  async getTodaysEvents(): Promise<EventData[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const params = new URLSearchParams({
      status: 'PUBLISHED',
      event_date: today,
      ordering: 'start_time',
    });

    const response = await apiClient.get(`/misc/events/?${params}`);
    return response.data.results;
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
