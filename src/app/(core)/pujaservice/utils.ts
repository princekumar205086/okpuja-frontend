import { PujaService, PujaServiceFilters } from './types';

export const filterServices = (services: PujaService[], filters: PujaServiceFilters): PujaService[] => {
  let filtered = [...services];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(service =>
      service.title.toLowerCase().includes(searchLower) ||
      service.description.toLowerCase().includes(searchLower) ||
      service.category.name.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (filters.category) {
    filtered = filtered.filter(service => service.category.name === filters.category);
  }

  // Type filter
  if (filters.type) {
    filtered = filtered.filter(service => service.type === filters.type);
  }

  // Location filter
  if (filters.location) {
    filtered = filtered.filter(service =>
      service.packages.some(pkg => pkg.location === filters.location)
    );
  }

  // Language filter
  if (filters.language) {
    filtered = filtered.filter(service =>
      service.packages.some(pkg => pkg.language === filters.language)
    );
  }

  // Price range filter
  if (filters.priceRange) {
    const [minPrice, maxPrice] = filters.priceRange;
    filtered = filtered.filter(service => {
      if (service.packages.length === 0) return true;
      const serviceMinPrice = Math.min(...service.packages.map(p => parseFloat(p.price)));
      const serviceMaxPrice = Math.max(...service.packages.map(p => parseFloat(p.price)));
      return serviceMinPrice <= maxPrice && serviceMaxPrice >= minPrice;
    });
  }

  return filtered;
};

export const sortServices = (services: PujaService[], sortBy: 'title' | 'price' | 'duration' | 'created_at', sortOrder: 'asc' | 'desc'): PujaService[] => {
  const sorted = [...services];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'price':
        const priceA = a.packages.length > 0 ? Math.min(...a.packages.map(p => parseFloat(p.price))) : 0;
        const priceB = b.packages.length > 0 ? Math.min(...b.packages.map(p => parseFloat(p.price))) : 0;
        comparison = priceA - priceB;
        break;
      case 'duration':
        comparison = a.duration_minutes - b.duration_minutes;
        break;
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return sorted;
};

export const paginateServices = (services: PujaService[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const total = services.length;
  const totalPages = Math.ceil(total / limit);

  return {
    services: services.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
};

export const getUniqueLocations = (services: PujaService[]): string[] => {
  const locations = new Set<string>();
  services.forEach(service => {
    service.packages.forEach(pkg => {
      locations.add(pkg.location);
    });
  });
  return Array.from(locations).sort();
};

export const getPriceRange = (services: PujaService[]): [number, number] => {
  let minPrice = Infinity;
  let maxPrice = 0;

  services.forEach(service => {
    service.packages.forEach(pkg => {
      const price = parseFloat(pkg.price);
      minPrice = Math.min(minPrice, price);
      maxPrice = Math.max(maxPrice, price);
    });
  });

  return minPrice === Infinity ? [0, 0] : [minPrice, maxPrice];
};
