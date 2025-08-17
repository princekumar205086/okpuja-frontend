import { create } from 'zustand';
import apiClient from '../apiService/globalApiconfig';
import toast from 'react-hot-toast';

export type UserPromoCode = {
  id: number;
  code: string;
  description?: string;
  discount: string;
  discount_type: 'PERCENT' | 'FIXED';
  min_order_amount?: string;
  max_discount_amount?: string;
  start_date?: string;
  expiry_date: string;
  usage_limit?: number;
  usage_count?: number;
  user_usage_count?: number; // How many times current user has used this code
  code_type: 'PUBLIC' | 'ASSIGNED';
  is_active: boolean;
  is_used_by_user?: boolean;
  service_type?: string;
  created_at?: string;
  assigned_at?: string; // When it was assigned to user
};

export interface PromoHistory {
  id: number;
  promo_code: UserPromoCode;
  used_at: string;
  order_amount: string;
  discount_amount: string;
  order_id?: string;
}

export interface UserPromoStats {
  total_available: number;
  total_used: number;
  total_savings: string;
  expiring_soon: number; // Count of codes expiring in next 7 days
}

interface UserPromoState {
  availablePromos: UserPromoCode[];
  promoHistory: PromoHistory[];
  stats: UserPromoStats | null;
  loading: boolean;
  validatingCode: boolean;
  error: string | null;
  filters: {
    search: string;
    status: 'all' | 'available' | 'used' | 'expired';
    code_type: 'all' | 'PUBLIC' | 'ASSIGNED';
    service_type: 'all' | 'astrology' | 'puja';
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  // Actions
  fetchAvailablePromos: () => Promise<void>;
  fetchPromoHistory: () => Promise<void>;
  fetchUserStats: () => Promise<void>;
  validatePromoCode: (code: string, orderAmount?: number) => Promise<{
    valid: boolean;
    promo?: UserPromoCode;
    discount_amount?: number;
    message?: string;
  }>;
  setFilters: (filters: Partial<UserPromoState['filters']>) => void;
  setPagination: (pagination: Partial<UserPromoState['pagination']>) => void;
  clearError: () => void;
  copyPromoCode: (code: string) => Promise<void>;
  markAsUsed: (promoId: number) => void;
}

export const useUserPromoStore = create<UserPromoState>((set, get) => ({
  availablePromos: [],
  promoHistory: [],
  stats: null,
  loading: false,
  validatingCode: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    code_type: 'all',
    service_type: 'all',
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },

  fetchAvailablePromos: async () => {
    set({ loading: true, error: null });
    try {
      const { filters, pagination } = get();
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: filters.search,
      });

      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.code_type !== 'all') {
        params.append('code_type', filters.code_type);
      }
      if (filters.service_type !== 'all') {
        params.append('service_type', filters.service_type);
      }

      const response = await apiClient.get(`/promo/user/promos/?${params.toString()}`);
      
      set({
        availablePromos: response.data.results || response.data,
        pagination: {
          ...pagination,
          total: response.data.count || response.data.length,
          hasNext: !!response.data.next,
          hasPrev: !!response.data.previous,
        },
        loading: false,
      });
    } catch (error: any) {
      console.error('Error fetching user promo codes:', error);
      set({ 
        error: 'Failed to fetch promo codes',
        loading: false 
      });
      toast.error('Failed to fetch promo codes');
    }
  },

  fetchPromoHistory: async () => {
    try {
      const response = await apiClient.get('/promo/user/promos/history/');
      set({ promoHistory: response.data.results || response.data });
    } catch (error: any) {
      console.error('Error fetching promo history:', error);
      toast.error('Failed to fetch promo history');
    }
  },

  fetchUserStats: async () => {
    try {
      // This endpoint might not exist, so we'll calculate from available data
      const { availablePromos, promoHistory } = get();
      
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const stats: UserPromoStats = {
        total_available: availablePromos.filter(p => 
          p.is_active && new Date(p.expiry_date) > now
        ).length,
        total_used: promoHistory.length,
        total_savings: promoHistory.reduce((sum, history) => 
          sum + parseFloat(history.discount_amount || '0'), 0
        ).toString(),
        expiring_soon: availablePromos.filter(p => 
          p.is_active && 
          new Date(p.expiry_date) > now && 
          new Date(p.expiry_date) <= nextWeek
        ).length,
      };
      
      set({ stats });
    } catch (error: any) {
      console.error('Error calculating user stats:', error);
    }
  },

  validatePromoCode: async (code: string, orderAmount?: number) => {
    set({ validatingCode: true, error: null });
    try {
      const params = new URLSearchParams({ code });
      if (orderAmount) {
        params.append('order_amount', orderAmount.toString());
      }

      const response = await apiClient.get(`/promo/promos/validate/?${params.toString()}`);
      
      set({ validatingCode: false });
      
      if (response.data.valid) {
        toast.success('Promo code is valid!');
        return {
          valid: true,
          promo: response.data.promo,
          discount_amount: response.data.discount_amount,
          message: response.data.message,
        };
      } else {
        toast.error(response.data.message || 'Invalid promo code');
        return {
          valid: false,
          message: response.data.message,
        };
      }
    } catch (error: any) {
      console.error('Error validating promo code:', error);
      const errorMessage = error.response?.data?.message || 'Failed to validate promo code';
      set({ error: errorMessage, validatingCode: false });
      toast.error(errorMessage);
      return {
        valid: false,
        message: errorMessage,
      };
    }
  },

  setFilters: (filters: Partial<UserPromoState['filters']>) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 }, // Reset to page 1 when filtering
    }));
  },

  setPagination: (pagination: Partial<UserPromoState['pagination']>) => {
    set(state => ({
      pagination: { ...state.pagination, ...pagination },
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  copyPromoCode: async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Promo code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy promo code:', error);
      toast.error('Failed to copy promo code');
    }
  },

  markAsUsed: (promoId: number) => {
    set(state => ({
      availablePromos: state.availablePromos.map(promo =>
        promo.id === promoId
          ? { ...promo, is_used_by_user: true, user_usage_count: (promo.user_usage_count || 0) + 1 }
          : promo
      ),
    }));
  },
}));