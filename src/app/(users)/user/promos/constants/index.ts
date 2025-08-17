/**
 * Constants for user promo code management
 */

// Promo code types
export const PROMO_TYPES = {
  PUBLIC: 'public',
  ASSIGNED: 'assigned'
} as const;

// Promo code statuses
export const PROMO_STATUSES = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  UPCOMING: 'upcoming',
  INACTIVE: 'inactive'
} as const;

// Discount types
export const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed'
} as const;

// Promo categories
export const PROMO_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'puja', label: 'Puja Services' },
  { value: 'astrology', label: 'Astrology' },
  { value: 'books', label: 'Religious Books' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'spiritual', label: 'Spiritual Items' },
  { value: 'festivals', label: 'Festival Specials' },
  { value: 'seasonal', label: 'Seasonal Offers' }
] as const;

// Filter options
export const FILTER_OPTIONS = {
  types: [
    { value: 'all', label: 'All Types' },
    { value: 'public', label: 'Public Codes' },
    { value: 'assigned', label: 'My Personal Codes' }
  ],
  statuses: [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'expired', label: 'Expired' }
  ],
  sortOptions: [
    { value: 'discount_desc', label: 'Highest Discount' },
    { value: 'discount_asc', label: 'Lowest Discount' },
    { value: 'expiry_asc', label: 'Expiring Soon' },
    { value: 'expiry_desc', label: 'Latest Expiry' },
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' }
  ]
} as const;

// Pagination settings
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  LIMIT_OPTIONS: [6, 12, 18, 24],
  MAX_VISIBLE_PAGES: 5
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AVAILABLE_PROMOS: '/api/user/promos/available',
  PROMO_HISTORY: '/api/user/promos/history',
  USER_STATS: '/api/user/promos/stats',
  VALIDATE_PROMO: '/api/user/promos/validate',
  USE_PROMO: '/api/user/promos/use',
  PROMO_DETAILS: '/api/user/promos/details'
} as const;

// UI constants
export const UI_CONFIG = {
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  COPY_SUCCESS_DURATION: 2000,
  MODAL_Z_INDEX: 1000,
  TOOLTIP_DELAY: 500
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

// Color scheme
export const COLORS = {
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12'
  },
  success: {
    50: '#f0fdf4',
    500: '#10b981',
    600: '#059669'
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706'
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626'
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
} as const;

// Status colors
export const STATUS_COLORS = {
  active: 'green',
  expired: 'red',
  upcoming: 'blue',
  inactive: 'gray'
} as const;

// Copy messages
export const COPY_MESSAGES = {
  success: 'Promo code copied to clipboard!',
  error: 'Failed to copy promo code. Please try again.',
  manualCopy: 'Press Ctrl+C to copy the selected text'
} as const;

// Error messages
export const ERROR_MESSAGES = {
  FETCH_PROMOS: 'Failed to load promo codes. Please refresh the page.',
  FETCH_HISTORY: 'Failed to load usage history. Please try again.',
  FETCH_STATS: 'Failed to load statistics. Please refresh the page.',
  VALIDATE_PROMO: 'Failed to validate promo code. Please try again.',
  USE_PROMO: 'Failed to apply promo code. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  INVALID_CODE: 'Invalid promo code format.',
  CODE_NOT_FOUND: 'Promo code not found.',
  CODE_EXPIRED: 'This promo code has expired.',
  CODE_NOT_STARTED: 'This promo code is not yet active.',
  CODE_USED: 'This promo code has already been used.',
  MIN_ORDER_NOT_MET: 'Minimum order amount not met for this promo code.'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PROMO_VALIDATED: 'Promo code is valid!',
  PROMO_APPLIED: 'Promo code applied successfully!',
  PROMO_COPIED: 'Promo code copied to clipboard!'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PROMO_FILTERS: 'okpuja_user_promo_filters',
  USER_PROMO_PREFERENCES: 'okpuja_user_promo_preferences',
  RECENTLY_VIEWED_PROMOS: 'okpuja_recently_viewed_promos'
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_PROMO_SHARING: true,
  ENABLE_PROMO_HISTORY: true,
  ENABLE_PROMO_VALIDATION: true,
  ENABLE_COPY_FEEDBACK: true,
  ENABLE_EXPIRY_WARNINGS: true,
  ENABLE_RECOMMENDATIONS: true,
  ENABLE_ADVANCED_FILTERS: true,
  ENABLE_BULK_OPERATIONS: false // Reserved for future use
} as const;

// Validation rules
export const VALIDATION_RULES = {
  PROMO_CODE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z0-9-]{3,20}$/,
    ALLOWED_CHARACTERS: 'A-Z, 0-9, and hyphens only'
  },
  SEARCH: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  }
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy hh:mm a',
  ISO: 'yyyy-MM-dd',
  RELATIVE_THRESHOLD: 7 // days - show relative time for dates within this range
} as const;

// Analytics events (for future implementation)
export const ANALYTICS_EVENTS = {
  PROMO_VIEWED: 'promo_viewed',
  PROMO_COPIED: 'promo_copied',
  PROMO_VALIDATED: 'promo_validated',
  PROMO_APPLIED: 'promo_applied',
  FILTER_APPLIED: 'promo_filter_applied',
  SEARCH_PERFORMED: 'promo_search_performed'
} as const;

// Performance thresholds
export const PERFORMANCE = {
  LARGE_LIST_THRESHOLD: 50, // Virtual scrolling threshold
  DEBOUNCE_MS: 300, // Search debounce
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes cache TTL
  MAX_CONCURRENT_REQUESTS: 3
} as const;

// Default promo code for demo/testing
export const DEFAULT_PROMO_CODE = {
  id: 'demo-promo-001',
  code: 'WELCOME10',
  title: 'Welcome Discount',
  description: 'Get 10% off on your first order',
  discountType: 'percentage' as const,
  discountValue: 10,
  maxDiscount: 500,
  minOrderAmount: 100,
  type: 'public' as const,
  category: 'puja',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  isActive: true,
  usageLimit: 100,
  usedCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
} as const;