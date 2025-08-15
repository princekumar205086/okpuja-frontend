import { format, isAfter, isBefore, isValid, parseISO } from 'date-fns';
import type { PromoCode, DiscountType, CodeType } from './types';

/**
 * Format a date string or Date object to a readable format
 */
export const formatDate = (date: string | Date, formatString: string = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatString) : 'Invalid Date';
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Format a date string or Date object to datetime-local input format
 */
export const formatDateTimeLocal = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, "yyyy-MM-dd'T'HH:mm") : '';
  } catch {
    return '';
  }
};

/**
 * Get the status of a promo code based on dates and active flag
 */
export const getPromoStatus = (promo: PromoCode): {
  status: 'active' | 'inactive' | 'expired' | 'scheduled';
  label: string;
  color: string;
} => {
  const now = new Date();
  const expiryDate = new Date(promo.expiry_date);
  const startDate = promo.start_date ? new Date(promo.start_date) : null;

  if (!promo.is_active) {
    return {
      status: 'inactive',
      label: 'Inactive',
      color: 'bg-gray-100 text-gray-800'
    };
  }

  if (isAfter(now, expiryDate)) {
    return {
      status: 'expired',
      label: 'Expired',
      color: 'bg-red-100 text-red-800'
    };
  }

  if (startDate && isBefore(now, startDate)) {
    return {
      status: 'scheduled',
      label: 'Scheduled',
      color: 'bg-yellow-100 text-yellow-800'
    };
  }

  return {
    status: 'active',
    label: 'Active',
    color: 'bg-green-100 text-green-800'
  };
};

/**
 * Format discount value with appropriate symbol
 */
export const formatDiscount = (discount: string, type: DiscountType): string => {
  const value = parseFloat(discount);
  if (isNaN(value)) return discount;
  
  return type === 'PERCENT' ? `${value}%` : `₹${value.toLocaleString()}`;
};

/**
 * Format code type for display
 */
export const formatCodeType = (codeType: CodeType): string => {
  const typeMap: Record<CodeType, string> = {
    PUBLIC: 'Public',
    PRIVATE: 'Private',
    ASSIGNED: 'Assigned',
    SERVICE_SPECIFIC: 'Service Specific'
  };
  
  return typeMap[codeType] || codeType;
};

/**
 * Calculate usage percentage
 */
export const calculateUsagePercentage = (usageCount: number = 0, usageLimit?: number): number => {
  if (!usageLimit || usageLimit === 0) return 0;
  return Math.min((usageCount / usageLimit) * 100, 100);
};

/**
 * Generate a random promo code
 */
export const generatePromoCode = (prefix: string = '', length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix.toUpperCase();
  const remainingLength = Math.max(0, length - prefix.length);
  
  for (let i = 0; i < remainingLength; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate promo code format
 */
export const isValidPromoCode = (code: string): boolean => {
  // Allow letters, numbers, and common symbols, 3-50 characters
  const codeRegex = /^[A-Z0-9_-]{3,50}$/;
  return codeRegex.test(code.trim().toUpperCase());
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Download data as CSV file
 */
export const downloadCSV = (data: any[], filename: string, headers?: string[]): void => {
  if (!data || data.length === 0) return;

  const csvHeaders = headers || Object.keys(data[0]);
  const csvContent = [
    csvHeaders.join(','),
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: string | number, currency: string = '₹'): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(value)) return `${currency}0`;
  
  return `${currency}${value.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Check if date is in the past
 */
export const isDateInPast = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) && isBefore(dateObj, new Date());
  } catch {
    return false;
  }
};

/**
 * Check if date is in the future
 */
export const isDateInFuture = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) && isAfter(dateObj, new Date());
  } catch {
    return false;
  }
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 */
export const getRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';

    const now = new Date();
    const diffInSeconds = Math.abs((dateObj.getTime() - now.getTime()) / 1000);
    const isPast = isBefore(dateObj, now);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        const plural = count > 1 ? 's' : '';
        return isPast 
          ? `${count} ${interval.label}${plural} ago`
          : `in ${count} ${interval.label}${plural}`;
      }
    }

    return isPast ? 'just now' : 'in a moment';
  } catch {
    return 'Invalid date';
  }
};
