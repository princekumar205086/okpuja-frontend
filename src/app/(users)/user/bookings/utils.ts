// Utility functions for booking page

import { toast } from 'react-hot-toast';

export interface BookingFilters {
  status: string;
  dateRange: string;
  serviceType: string;
}

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
  FAILED: 'FAILED',
} as const;

export const PUJA_SERVICE_TYPES = {
  HOME: 'HOME',
  TEMPLE: 'TEMPLE',
  ONLINE: 'ONLINE',
} as const;

export const ASTROLOGY_SERVICE_TYPES = {
  HOROSCOPE: 'HOROSCOPE',
  MATCHING: 'MATCHING',
  PREDICTION: 'PREDICTION',
  REMEDIES: 'REMEDIES',
  GEMSTONE: 'GEMSTONE',
  VAASTU: 'VAASTU',
} as const;

export const DATE_RANGES = {
  TODAY: 'today',
  TOMORROW: 'tomorrow',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  PAST: 'past',
} as const;

// Date utility functions
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

export const isThisWeek = (date: Date): boolean => {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  return date >= weekStart && date <= weekEnd;
};

export const isThisMonth = (date: Date): boolean => {
  const today = new Date();
  return date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
};

export const isPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Format currency for Indian Rupees
export const formatCurrency = (amount: string | number): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

// Format phone number for Indian format
export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +91 XXXXX XXXXX
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length === 13 && cleaned.startsWith('91')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if format is not recognized
};

// Copy text to clipboard
export const copyToClipboard = async (text: string, successMessage?: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage || 'Copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    toast.error('Failed to copy to clipboard');
  }
};

// Generate shareable booking link
export const generateBookingShareLink = (bookingId: string, type: 'puja' | 'astrology'): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/booking/${type}/${bookingId}`;
};

// Download invoice
export const downloadInvoice = (bookingId: string) => {
  const invoiceUrl = `/confirmbooking?book_id=${bookingId}/`;
  window.open(invoiceUrl, '_blank');
};

// Open Google Meet link
export const openGoogleMeet = (meetLink: string) => {
  if (meetLink) {
    window.open(meetLink, '_blank', 'noopener,noreferrer');
  } else {
    toast.error('Meeting link not available');
  }
};

// Validate Google Meet link
export const isValidGoogleMeetLink = (link: string): boolean => {
  const googleMeetRegex = /^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i;
  return googleMeetRegex.test(link);
};

// Get relative time from now
export const getRelativeTime = (date: string | Date): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(Math.abs(diffInSeconds) / seconds);
    if (interval >= 1) {
      const isPlural = interval > 1;
      const timeUnit = isPlural ? `${unit}s` : unit;
      return diffInSeconds > 0 
        ? `in ${interval} ${timeUnit}`
        : `${interval} ${timeUnit} ago`;
    }
  }
  
  return 'just now';
};

// Filter bookings by date range
export const filterBookingsByDateRange = (
  bookings: any[], 
  dateRange: string, 
  dateField: string = 'selected_date'
) => {
  if (!dateRange) return bookings;
  
  return bookings.filter(booking => {
    const bookingDate = new Date(booking[dateField]);
    
    switch (dateRange) {
      case DATE_RANGES.TODAY:
        return isToday(bookingDate);
      case DATE_RANGES.TOMORROW:
        return isTomorrow(bookingDate);
      case DATE_RANGES.THIS_WEEK:
        return isThisWeek(bookingDate);
      case DATE_RANGES.THIS_MONTH:
        return isThisMonth(bookingDate);
      case DATE_RANGES.PAST:
        return isPast(bookingDate);
      default:
        return true;
    }
  });
};

// Sort bookings by date
export const sortBookingsByDate = (bookings: any[], dateField: string = 'created_at', order: 'asc' | 'desc' = 'desc') => {
  return [...bookings].sort((a, b) => {
    const dateA = new Date(a[dateField]).getTime();
    const dateB = new Date(b[dateField]).getTime();
    
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

// Calculate booking stats
export const calculateBookingStats = (bookings: any[]) => {
  const stats = {
    total: bookings.length,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalAmount: 0,
  };
  
  bookings.forEach(booking => {
    const status = booking.status?.toLowerCase();
    switch (status) {
      case 'pending':
        stats.pending++;
        break;
      case 'confirmed':
        stats.confirmed++;
        break;
      case 'completed':
        stats.completed++;
        break;
      case 'cancelled':
      case 'rejected':
      case 'failed':
        stats.cancelled++;
        break;
    }
    
    // Calculate total amount
    const amount = booking.total_amount || booking.service?.price || 0;
    if (typeof amount === 'string') {
      stats.totalAmount += parseFloat(amount) || 0;
    } else {
      stats.totalAmount += amount || 0;
    }
  });
  
  return stats;
};

// Booking validation
export const validateBookingData = (booking: any, type: 'puja' | 'astrology'): string[] => {
  const errors: string[] = [];
  
  if (!booking.id) errors.push('Booking ID is required');
  if (!booking.status) errors.push('Booking status is required');
  
  if (type === 'puja') {
    if (!booking.book_id) errors.push('Book ID is required');
    if (!booking.selected_date) errors.push('Selected date is required');
    if (!booking.selected_time) errors.push('Selected time is required');
    if (!booking.address) errors.push('Address is required');
  } else if (type === 'astrology') {
    if (!booking.astro_book_id) errors.push('Astro Book ID is required');
    if (!booking.preferred_date) errors.push('Preferred date is required');
    if (!booking.preferred_time) errors.push('Preferred time is required');
    if (!booking.birth_place) errors.push('Birth place is required');
    if (!booking.birth_date) errors.push('Birth date is required');
    if (!booking.birth_time) errors.push('Birth time is required');
  }
  
  return errors;
};
