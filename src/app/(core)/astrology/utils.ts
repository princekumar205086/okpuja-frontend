import { AstrologyService, AstrologyServiceFilters, PaginationParams } from './types';

export function filterServices(
  services: AstrologyService[],
  filters: AstrologyServiceFilters
): AstrologyService[] {
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
      const price = typeof service.price === 'string' ? parseFloat(service.price) : service.price;
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
}

export function sortServices(
  services: AstrologyService[],
  sortBy: 'title' | 'price' | 'duration_minutes' | 'created_at',
  sortOrder: 'asc' | 'desc'
): AstrologyService[] {
  return [...services].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'price':
        aValue = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        bValue = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
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
}

export function paginateServices(
  services: AstrologyService[],
  page: number,
  limit: number
): { services: AstrologyService[]; pagination: PaginationParams } {
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
}

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export function getServiceTypeLabel(serviceType: string): string {
  const serviceTypeMap: Record<string, string> = {
    'HOROSCOPE': 'Horoscope Analysis',
    'MATCHING': 'Kundali Matching',
    'PREDICTION': 'Future Prediction',
    'REMEDIES': 'Astrological Remedies',
    'GEMSTONE': 'Gemstone Recommendation',
    'VAASTU': 'Vaastu Consultation'
  };
  return serviceTypeMap[serviceType] || serviceType;
}

export function getServiceTypeIcon(serviceType: string): string {
  const iconMap: Record<string, string> = {
    'HOROSCOPE': '🌟',
    'MATCHING': '💑',
    'PREDICTION': '🔮',
    'REMEDIES': '🕯️',
    'GEMSTONE': '💎',
    'VAASTU': '🏠'
  };
  return iconMap[serviceType] || '⭐';
}
