/**
 * Utility functions for the Astrology Services module
 */

import { AstrologyService, AstrologyServiceType } from '@/app/stores/astrologyServiceStore';

/**
 * Format price for display
 */
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `₹${numPrice.toLocaleString('en-IN')}`;
};

/**
 * Format duration for display
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Get service type color
 */
export const getServiceTypeColor = (type: AstrologyServiceType): string => {
  const colors: Record<AstrologyServiceType, string> = {
    HOROSCOPE: 'bg-blue-100 text-blue-800 border-blue-200',
    MATCHING: 'bg-pink-100 text-pink-800 border-pink-200',
    PREDICTION: 'bg-purple-100 text-purple-800 border-purple-200',
    REMEDIES: 'bg-green-100 text-green-800 border-green-200',
    GEMSTONE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    VAASTU: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Get status color
 */
export const getStatusColor = (isActive: boolean): {
  bg: string;
  text: string;
  border: string;
} => {
  return isActive
    ? {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
      }
    : {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
      };
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, WebP)',
    };
  }

  // Check file size (max 5MB)
  const maxSizeInBytes = 5 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: 'Image size must be less than 5MB',
    };
  }

  // Check image dimensions (optional)
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Recommended minimum dimensions
      if (img.width < 300 || img.height < 200) {
        resolve({
          isValid: false,
          error: 'Image dimensions should be at least 300x200 pixels',
        });
      } else {
        resolve({ isValid: true });
      }
    };
    img.onerror = () => {
      resolve({
        isValid: false,
        error: 'Invalid image file',
      });
    };
    img.src = URL.createObjectURL(file);
  }) as any;
};

/**
 * Generate a unique filename for image upload
 */
export const generateImageFilename = (originalName: string, serviceId?: number): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const extension = originalName.split('.').pop() || 'jpg';
  
  if (serviceId) {
    return `service_${serviceId}_${timestamp}_${random}.${extension}`;
  }
  return `service_new_${timestamp}_${random}.${extension}`;
};

/**
 * Convert file to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Sort services by different criteria
 */
export const sortServices = (
  services: AstrologyService[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): AstrologyService[] => {
  const sorted = [...services].sort((a, b) => {
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
      case 'updated_at':
        aValue = new Date(a.updated_at).getTime();
        bValue = new Date(b.updated_at).getTime();
        break;
      case 'service_type':
        aValue = a.service_type;
        bValue = b.service_type;
        break;
      case 'is_active':
        aValue = a.is_active ? 1 : 0;
        bValue = b.is_active ? 1 : 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return sorted;
};

/**
 * Filter services based on search term and filters
 */
export const filterServices = (
  services: AstrologyService[],
  searchTerm: string,
  filters: {
    service_type?: AstrologyServiceType;
    is_active?: boolean;
    price_min?: number;
    price_max?: number;
    duration_min?: number;
    duration_max?: number;
  }
): AstrologyService[] => {
  let filtered = services;

  // Text search
  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (service) =>
        service.title.toLowerCase().includes(search) ||
        service.description.toLowerCase().includes(search) ||
        service.service_type.toLowerCase().includes(search)
    );
  }

  // Service type filter
  if (filters.service_type) {
    filtered = filtered.filter((service) => service.service_type === filters.service_type);
  }

  // Status filter
  if (filters.is_active !== undefined) {
    filtered = filtered.filter((service) => service.is_active === filters.is_active);
  }

  // Price range filter
  if (filters.price_min !== undefined) {
    filtered = filtered.filter((service) => parseFloat(service.price) >= filters.price_min!);
  }
  if (filters.price_max !== undefined) {
    filtered = filtered.filter((service) => parseFloat(service.price) <= filters.price_max!);
  }

  // Duration range filter
  if (filters.duration_min !== undefined) {
    filtered = filtered.filter((service) => service.duration_minutes >= filters.duration_min!);
  }
  if (filters.duration_max !== undefined) {
    filtered = filtered.filter((service) => service.duration_minutes <= filters.duration_max!);
  }

  return filtered;
};

/**
 * Calculate service statistics
 */
export const calculateServiceStats = (services: AstrologyService[]) => {
  const total = services.length;
  const active = services.filter((s) => s.is_active).length;
  const inactive = total - active;
  
  const totalRevenue = services
    .filter((s) => s.is_active)
    .reduce((sum, s) => sum + parseFloat(s.price), 0);
  
  const averagePrice = total > 0 ? totalRevenue / active : 0;
  
  const serviceTypes = services.reduce((acc, service) => {
    acc[service.service_type] = (acc[service.service_type] || 0) + 1;
    return acc;
  }, {} as Record<AstrologyServiceType, number>);

  return {
    total,
    active,
    inactive,
    totalRevenue,
    averagePrice,
    serviceTypes,
  };
};

/**
 * Export services to CSV
 */
export const exportServicesToCSV = (services: AstrologyService[]): void => {
  const headers = [
    'ID',
    'Title',
    'Service Type',
    'Price',
    'Duration (min)',
    'Status',
    'Created',
    'Updated',
  ];

  const csvContent = [
    headers.join(','),
    ...services.map((service) =>
      [
        service.id,
        `"${service.title}"`,
        service.service_type,
        service.price,
        service.duration_minutes,
        service.is_active ? 'Active' : 'Inactive',
        new Date(service.created_at).toLocaleDateString(),
        new Date(service.updated_at).toLocaleDateString(),
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `astrology-services-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Format relative time
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};
