import type { PromoCode, PromoStats } from './types';

// Sample promo codes for development/testing
export const SAMPLE_PROMO_CODES: PromoCode[] = [
  {
    id: 1,
    code: 'WELCOME25',
    description: 'Welcome discount for new users',
    discount: '25',
    discount_type: 'PERCENT',
    min_order_amount: '500',
    max_discount_amount: '2000',
    start_date: '2025-08-01T00:00:00Z',
    expiry_date: '2025-12-31T23:59:59Z',
    usage_limit: 100,
    usage_count: 45,
    code_type: 'PUBLIC',
    is_active: true,
    created_at: '2025-08-01T10:00:00Z',
    updated_at: '2025-08-15T15:30:00Z'
  },
  {
    id: 2,
    code: 'SUMMER50',
    description: 'Summer special discount',
    discount: '500',
    discount_type: 'FIXED',
    min_order_amount: '1000',
    expiry_date: '2025-08-31T23:59:59Z',
    usage_limit: 50,
    usage_count: 50,
    code_type: 'PUBLIC',
    is_active: true,
    created_at: '2025-07-01T10:00:00Z',
    updated_at: '2025-08-10T12:00:00Z'
  },
  {
    id: 3,
    code: 'ASTRO15',
    description: 'Special discount for astrology services',
    discount: '15',
    discount_type: 'PERCENT',
    expiry_date: '2025-09-30T23:59:59Z',
    usage_limit: 200,
    usage_count: 12,
    code_type: 'SERVICE_SPECIFIC',
    service_type: 'astrology',
    is_active: true,
    created_at: '2025-08-01T10:00:00Z',
    updated_at: '2025-08-01T10:00:00Z'
  },
  {
    id: 4,
    code: 'PUJA20',
    description: 'Discount for puja services',
    discount: '20',
    discount_type: 'PERCENT',
    min_order_amount: '750',
    max_discount_amount: '1500',
    expiry_date: '2025-10-31T23:59:59Z',
    usage_limit: 75,
    usage_count: 8,
    code_type: 'SERVICE_SPECIFIC',
    service_type: 'puja',
    is_active: true,
    created_at: '2025-08-05T10:00:00Z',
    updated_at: '2025-08-05T10:00:00Z'
  },
  {
    id: 5,
    code: 'VIP100',
    description: 'VIP customer exclusive discount',
    discount: '1000',
    discount_type: 'FIXED',
    min_order_amount: '2000',
    expiry_date: '2025-12-31T23:59:59Z',
    usage_limit: 10,
    usage_count: 3,
    code_type: 'ASSIGNED',
    is_active: true,
    created_at: '2025-08-10T10:00:00Z',
    updated_at: '2025-08-12T14:20:00Z'
  },
  {
    id: 6,
    code: 'EXPIRED10',
    description: 'This code has expired',
    discount: '10',
    discount_type: 'PERCENT',
    expiry_date: '2025-07-31T23:59:59Z',
    usage_limit: 100,
    usage_count: 89,
    code_type: 'PUBLIC',
    is_active: true,
    created_at: '2025-07-01T10:00:00Z',
    updated_at: '2025-07-15T16:45:00Z'
  },
  {
    id: 7,
    code: 'INACTIVE5',
    description: 'This code is inactive',
    discount: '5',
    discount_type: 'PERCENT',
    expiry_date: '2025-12-31T23:59:59Z',
    usage_limit: 50,
    usage_count: 0,
    code_type: 'PRIVATE',
    is_active: false,
    created_at: '2025-08-01T10:00:00Z',
    updated_at: '2025-08-14T11:30:00Z'
  }
];

// Sample statistics for development/testing
export const SAMPLE_STATS: PromoStats = {
  total_promos: 7,
  active_promos: 5,
  expired_promos: 1,
  total_usage: 207,
  total_discount_given: '15750'
};

// Form validation constants
export const VALIDATION_RULES = {
  CODE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[A-Z0-9_-]+$/
  },
  DISCOUNT: {
    MIN_VALUE: 0.01,
    MAX_PERCENT: 100
  },
  BULK_CREATE: {
    MIN_COUNT: 1,
    MAX_COUNT: 100,
    PREFIX_MAX_LENGTH: 20
  },
  USAGE_LIMIT: {
    MIN_VALUE: 1
  }
};

// Service type options
export const SERVICE_OPTIONS = [
  { value: '', label: 'Select Service Type' },
  { value: 'astrology', label: 'Astrology' },
  { value: 'puja', label: 'Puja' },
  { value: 'both', label: 'Both Services' }
];

// Code type options
export const CODE_TYPE_OPTIONS = [
  { value: 'PUBLIC', label: 'Public' },
  { value: 'PRIVATE', label: 'Private' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'SERVICE_SPECIFIC', label: 'Service Specific' }
];

// Discount type options
export const DISCOUNT_TYPE_OPTIONS = [
  { value: 'PERCENT', label: 'Percentage' },
  { value: 'FIXED', label: 'Fixed Amount' }
];

// Status filter options
export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'inactive', label: 'Inactive' }
];

// Default pagination settings
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  LIMITS: [10, 25, 50, 100]
};

// API endpoints
export const API_ENDPOINTS = {
  LIST: '/promo/admin/promos/',
  CREATE: '/promo/admin/promos/',
  UPDATE: (id: number) => `/promo/admin/promos/${id}/`,
  DELETE: (id: number) => `/promo/admin/promos/${id}/`,
  BULK_CREATE: '/promo/admin/promos/bulk-create/',
  STATS: '/promo/admin/promos/stats/',
  EXPORT: '/promo/admin/promos/export/',
  SEND_EMAIL: '/promo/admin/promos/send-email/'
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_CODE: 'Code must contain only letters, numbers, hyphens, and underscores',
  INVALID_DISCOUNT: 'Please enter a valid discount amount',
  INVALID_DATE: 'Please select a valid date',
  EXPIRY_IN_PAST: 'Expiry date must be in the future',
  START_AFTER_EXPIRY: 'Start date must be before expiry date',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Promo code created successfully!',
  UPDATED: 'Promo code updated successfully!',
  DELETED: 'Promo code deleted successfully!',
  BULK_CREATED: 'Promo codes created successfully!',
  EMAIL_SENT: 'Promo codes sent via email successfully!',
  EXPORTED: 'Promo codes exported successfully!',
  COPIED: 'Code copied to clipboard!'
};

// Table column configurations
export const TABLE_COLUMNS = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'discount', label: 'Discount', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'usage', label: 'Usage', sortable: true },
  { key: 'expiry_date', label: 'Expiry Date', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];
