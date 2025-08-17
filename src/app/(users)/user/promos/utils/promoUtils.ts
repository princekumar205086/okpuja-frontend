/**
 * Utility functions for user promo code management
 */

import { UserPromoCode } from '../../../../stores/userPromoStore';

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy text: ', error);
    return false;
  }
};

/**
 * Format currency value
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format percentage value
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calculate discount amount
 */
export const calculateDiscount = (
  originalPrice: number,
  promo: UserPromoCode
): number => {
  const discountValue = parseFloat(promo.discount);
  if (promo.discount_type === 'PERCENT') {
    const discount = (originalPrice * discountValue) / 100;
    const maxDiscount = promo.max_discount_amount ? parseFloat(promo.max_discount_amount) : discount;
    return Math.min(discount, maxDiscount);
  } else {
    return Math.min(discountValue, originalPrice);
  }
};

/**
 * Calculate final price after discount
 */
export const calculateFinalPrice = (
  originalPrice: number,
  promo: UserPromoCode
): number => {
  const discount = calculateDiscount(originalPrice, promo);
  return Math.max(0, originalPrice - discount);
};

/**
 * Check if promo code is valid for current date
 */
export const isPromoValid = (promo: UserPromoCode): boolean => {
  const now = new Date();
  const startDate = promo.start_date ? new Date(promo.start_date) : new Date(0);
  const endDate = new Date(promo.expiry_date);
  
  return now >= startDate && now <= endDate && promo.is_active;
};

/**
 * Check if promo code is expiring soon (within 7 days)
 */
export const isPromoExpiringSoon = (promo: UserPromoCode): boolean => {
  const now = new Date();
  const endDate = new Date(promo.expiry_date);
  const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
};

/**
 * Get days until expiry
 */
export const getDaysUntilExpiry = (promo: UserPromoCode): number => {
  const now = new Date();
  const endDate = new Date(promo.expiry_date);
  return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
};

/**
 * Get promo code status
 */
export const getPromoStatus = (promo: UserPromoCode): {
  status: 'active' | 'expired' | 'upcoming' | 'inactive' | 'used';
  label: string;
  color: string;
} => {
  const now = new Date();
  const startDate = promo.start_date ? new Date(promo.start_date) : new Date(0);
  const endDate = new Date(promo.expiry_date);

  if (!promo.is_active) {
    return {
      status: 'inactive',
      label: 'Inactive',
      color: 'gray'
    };
  }

  if (promo.is_used_by_user) {
    return {
      status: 'used',
      label: 'Used',
      color: 'blue'
    };
  }

  if (now < startDate) {
    return {
      status: 'upcoming',
      label: 'Upcoming',
      color: 'blue'
    };
  }

  if (now > endDate) {
    return {
      status: 'expired',
      label: 'Expired',
      color: 'red'
    };
  }

  return {
    status: 'active',
    label: 'Active',
    color: 'green'
  };
};

/**
 * Sort promo codes by priority
 */
export const sortPromosByPriority = (promos: UserPromoCode[]): UserPromoCode[] => {
  return [...promos].sort((a, b) => {
    // Active codes first
    const aStatus = getPromoStatus(a);
    const bStatus = getPromoStatus(b);
    
    if (aStatus.status === 'active' && bStatus.status !== 'active') return -1;
    if (bStatus.status === 'active' && aStatus.status !== 'active') return 1;
    
    // Then by discount value (higher first)
    const aDiscountValue = parseFloat(a.discount);
    const bDiscountValue = parseFloat(b.discount);
    
    if (a.discount_type === 'PERCENT' && b.discount_type === 'PERCENT') {
      return bDiscountValue - aDiscountValue;
    }
    
    if (a.discount_type === 'FIXED' && b.discount_type === 'FIXED') {
      return bDiscountValue - aDiscountValue;
    }
    
    // Mixed types: prioritize percentage if it's higher value
    if (a.discount_type === 'PERCENT' && b.discount_type === 'FIXED') {
      return aDiscountValue > 20 ? -1 : 1; // Assume 20% is better than most fixed amounts
    }
    
    if (a.discount_type === 'FIXED' && b.discount_type === 'PERCENT') {
      return bDiscountValue > 20 ? 1 : -1;
    }
    
    // Finally by expiry date (expiring soon first)
    return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
  });
};

/**
 * Filter promo codes based on search criteria
 */
export const filterPromos = (
  promos: UserPromoCode[],
  filters: {
    search?: string;
    type?: string;
    category?: string;
    status?: string;
    minDiscount?: number;
    maxDiscount?: number;
  }
): UserPromoCode[] => {
  return promos.filter(promo => {
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchesSearch = 
        promo.code.toLowerCase().includes(search) ||
        (promo.description?.toLowerCase().includes(search)) ||
        (promo.service_type?.toLowerCase().includes(search));
      
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      const typeMap = {
        'public': 'PUBLIC',
        'assigned': 'ASSIGNED'
      };
      if ((typeMap as any)[filters.type] !== promo.code_type) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      const promoStatus = getPromoStatus(promo);
      if (filters.status !== promoStatus.status) return false;
    }

    // Discount range filter
    const discountValue = parseFloat(promo.discount);
    if (filters.minDiscount !== undefined) {
      if (discountValue < filters.minDiscount) return false;
    }

    if (filters.maxDiscount !== undefined) {
      if (discountValue > filters.maxDiscount) return false;
    }

    return true;
  });
};

/**
 * Generate shareable promo code text
 */
export const generateShareableText = (promo: UserPromoCode): string => {
  const discountValue = parseFloat(promo.discount);
  const discount = promo.discount_type === 'PERCENT' 
    ? `${discountValue}% OFF` 
    : `${formatCurrency(discountValue)} OFF`;
  
  return `🎉 Save ${discount} with code: ${promo.code}\n\n${promo.description || 'Amazing deal!'}\n\nValid until: ${formatDate(promo.expiry_date)}\n\n#OkPujaDeals #SaveMoney`;
};

/**
 * Validate promo code format
 */
export const validatePromoCodeFormat = (code: string): boolean => {
  // Basic validation: 3-20 characters, alphanumeric and hyphens only
  const regex = /^[A-Z0-9-]{3,20}$/;
  return regex.test(code.toUpperCase());
};

/**
 * Get recommended promo codes based on user history
 */
export const getRecommendedPromos = (
  availablePromos: UserPromoCode[],
  usedPromos: UserPromoCode[]
): UserPromoCode[] => {
  // Simple recommendation: codes in service types user has used before
  const usedServiceTypes = [...new Set(usedPromos.map(p => p.service_type).filter(Boolean))];
  
  return availablePromos
    .filter(promo => {
      const status = getPromoStatus(promo);
      return status.status === 'active' && 
             (usedServiceTypes.includes(promo.service_type) || promo.code_type === 'PUBLIC');
    })
    .slice(0, 3); // Return top 3 recommendations
};

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(diffInSeconds, 'second');
  } else if (Math.abs(diffInSeconds) < 3600) {
    return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
  } else if (Math.abs(diffInSeconds) < 86400) {
    return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
  } else {
    return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
  }
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-IN', defaultOptions).format(targetDate);
};