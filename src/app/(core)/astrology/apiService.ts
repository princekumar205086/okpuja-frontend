import apiClient from '../../apiService/globalApiconfig';
import { AstrologyService, AstrologyServiceFilters, AstrologyBooking } from './types';

export interface AstrologyServiceListResponse {
  results: AstrologyService[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface FetchServicesParams {
  page?: number;
  page_size?: number;
  search?: string;
  service_type?: string;
  price_min?: number;
  price_max?: number;
  duration_min?: number;
  duration_max?: number;
  ordering?: string;
  is_active?: boolean;
}

export const astrologyApiService = {
  // Fetch all astrology services with filtering and pagination
  fetchServices: async (params: FetchServicesParams = {}): Promise<AstrologyService[]> => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.page_size) queryParams.append('page_size', params.page_size.toString());
      
      // Add search parameter
      if (params.search && params.search.trim()) {
        queryParams.append('search', params.search.trim());
      }
      
      // Add filter parameters
      if (params.service_type) queryParams.append('service_type', params.service_type);
      if (params.price_min !== undefined) queryParams.append('price_min', params.price_min.toString());
      if (params.price_max !== undefined) queryParams.append('price_max', params.price_max.toString());
      if (params.duration_min !== undefined) queryParams.append('duration_min', params.duration_min.toString());
      if (params.duration_max !== undefined) queryParams.append('duration_max', params.duration_max.toString());
      if (params.ordering) queryParams.append('ordering', params.ordering);
      if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
      
      const url = `/astrology/services/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<AstrologyService[]>(url);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching astrology services:', error);
      throw error;
    }
  },

  // Fetch a single astrology service by ID
  fetchServiceById: async (id: number): Promise<AstrologyService> => {
    try {
      const response = await apiClient.get<AstrologyService>(`/astrology/services/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching astrology service ${id}:`, error);
      throw error;
    }
  },

  // Get active services only
  fetchActiveServices: async (params: Omit<FetchServicesParams, 'is_active'> = {}): Promise<AstrologyService[]> => {
    return astrologyApiService.fetchServices({ ...params, is_active: true });
  },

  // Book a service with payment integration
  bookServiceWithPayment: async (bookingData: Omit<AstrologyBooking, 'id'> & { redirect_url: string }): Promise<{
    payment: {
      payment_url: string;
      merchant_order_id: string;
      amount: number;
      amount_in_rupees: string;
    };
    service: AstrologyService;
    redirect_urls: {
      success: string;
      failure: string;
    }
  }> => {
    try {
      const response = await apiClient.post('/astrology/bookings/book-with-payment/', bookingData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create booking');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating astrology booking with payment:', error);
      throw error;
    }
  },

  // Get booking details by astro_book_id (for confirmation page)
  getBookingByAstroBookId: async (astroBookId: string) => {
    try {
      const response = await apiClient.get(`/astrology/bookings/confirmation/?astro_book_id=${astroBookId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch booking details');
      }
      
      return response.data.data.booking;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }
};

// Helper functions for filtering and sorting
export const filterServices = (
  services: AstrologyService[],
  filters: AstrologyServiceFilters
): AstrologyService[] => {
  return services.filter(service => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        service.title.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Service type filter
    if (filters.service_type && filters.service_type !== '') {
      if (service.service_type !== filters.service_type) return false;
    }

    // Price range filter
    if (filters.price_range && filters.price_range !== '') {
      const price = parseFloat(service.price);
      switch (filters.price_range) {
        case '0-500':
          if (price >= 500) return false;
          break;
        case '500-1000':
          if (price < 500 || price >= 1000) return false;
          break;
        case '1000-2000':
          if (price < 1000 || price >= 2000) return false;
          break;
        case '2000-5000':
          if (price < 2000 || price >= 5000) return false;
          break;
        case '5000+':
          if (price < 5000) return false;
          break;
      }
    }

    // Duration filter
    if (filters.duration && filters.duration !== '') {
      const duration = service.duration_minutes;
      switch (filters.duration) {
        case '15-30':
          if (duration < 15 || duration >= 30) return false;
          break;
        case '30-45':
          if (duration < 30 || duration >= 45) return false;
          break;
        case '45-60':
          if (duration < 45 || duration >= 60) return false;
          break;
        case '60+':
          if (duration < 60) return false;
          break;
      }
    }

    return service.is_active;
  });
};

export const sortServices = (
  services: AstrologyService[],
  sortBy: 'title' | 'price' | 'duration_minutes' | 'created_at',
  sortOrder: 'asc' | 'desc'
): AstrologyService[] => {
  return [...services].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'price':
        aValue = parseFloat(a.price);
        bValue = parseFloat(b.price);
        break;
      case 'duration_minutes':
        aValue = a.duration_minutes;
        bValue = b.duration_minutes;
        break;
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      default:
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
    }

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

export const paginateServices = (
  services: AstrologyService[],
  page: number,
  limit: number
): { services: AstrologyService[]; pagination: { page: number; limit: number; total: number; totalPages: number } } => {
  const total = services.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedServices = services.slice(startIndex, endIndex);

  return {
    services: paginatedServices,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
};
