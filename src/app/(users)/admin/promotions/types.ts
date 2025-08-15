// Re-export types from the store for easy importing in components
export type {
  PromoCode,
  BulkPromoCode,
  PromoStats,
  DiscountType,
  CodeType
} from '../../../stores/promotionStore';

// Additional types for component props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API Response types
export interface ApiResponse<T> {
  results?: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export interface ErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  loading: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Email template types
export interface EmailTemplate {
  subject: string;
  body: string;
  variables: string[];
}

// Statistics types
export interface StatCard {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  textColor: string;
  bgColor: string;
  trend?: {
    value: number;
    type: 'increase' | 'decrease';
  };
}

// Service types for service-specific promo codes
export type ServiceType = 'astrology' | 'puja' | 'both';

export interface ServiceOption {
  value: ServiceType | '';
  label: string;
}

// Bulk operations
export interface BulkAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: (selectedIds: number[]) => Promise<void>;
  confirmMessage?: string;
}

// Export and import types
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  fields: string[];
  filters?: Record<string, any>;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}
