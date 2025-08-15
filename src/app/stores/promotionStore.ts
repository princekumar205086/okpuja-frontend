import { create } from 'zustand';
import apiClient from '../apiService/globalApiconfig';
import toast from 'react-hot-toast';

export type DiscountType = 'PERCENT' | 'FIXED';
export type CodeType = 'PUBLIC' | 'PRIVATE' | 'ASSIGNED' | 'SERVICE_SPECIFIC';

export interface PromoCode {
  id?: number;
  code: string;
  description?: string;
  discount: string;
  discount_type: DiscountType;
  min_order_amount?: string;
  max_discount_amount?: string;
  start_date?: string;
  expiry_date: string;
  usage_limit?: number;
  usage_count?: number;
  code_type: CodeType;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  assigned_users?: number[];
  service_type?: string;
}

export interface BulkPromoCode {
  prefix: string;
  count: number;
  discount: string;
  discount_type: DiscountType;
  expiry_date: string;
  usage_limit: number;
}

export interface PromoStats {
  total_promos: number;
  active_promos: number;
  expired_promos: number;
  total_usage: number;
  total_discount_given: string;
}

interface PromotionState {
  promoCodes: PromoCode[];
  selectedPromo: PromoCode | null;
  stats: PromoStats | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: 'all' | 'active' | 'expired' | 'inactive';
    discount_type: 'all' | 'PERCENT' | 'FIXED';
    code_type: 'all' | 'PUBLIC' | 'PRIVATE' | 'ASSIGNED' | 'SERVICE_SPECIFIC';
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  // Actions
  fetchPromoCodes: () => Promise<void>;
  fetchPromoStats: () => Promise<void>;
  createPromoCode: (data: Omit<PromoCode, 'id'>) => Promise<boolean>;
  updatePromoCode: (id: number, data: Partial<PromoCode>) => Promise<boolean>;
  deletePromoCode: (id: number) => Promise<boolean>;
  bulkCreatePromoCodes: (data: BulkPromoCode) => Promise<boolean>;
  setSelectedPromo: (promo: PromoCode | null) => void;
  setFilters: (filters: Partial<PromotionState['filters']>) => void;
  setPagination: (pagination: Partial<PromotionState['pagination']>) => void;
  clearError: () => void;
  exportPromoCodes: () => Promise<void>;
  sendPromoEmail: (promoIds: number[], userEmails: string[]) => Promise<boolean>;
}

export const usePromotionStore = create<PromotionState>((set, get) => ({
  promoCodes: [],
  selectedPromo: null,
  stats: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    discount_type: 'all',
    code_type: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },

  fetchPromoCodes: async () => {
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
      if (filters.discount_type !== 'all') {
        params.append('discount_type', filters.discount_type);
      }
      if (filters.code_type !== 'all') {
        params.append('code_type', filters.code_type);
      }

      const response = await apiClient.get(`/promo/admin/promos/?${params.toString()}`);
      
      set({
        promoCodes: response.data.results || response.data,
        pagination: {
          ...pagination,
          total: response.data.count || response.data.length,
          hasNext: !!response.data.next,
          hasPrev: !!response.data.previous,
        },
        loading: false,
      });
    } catch (error: any) {
      console.error('Error fetching promo codes:', error);
      set({ 
        error: 'Failed to fetch promo codes',
        loading: false 
      });
      toast.error('Failed to fetch promo codes');
    }
  },

  fetchPromoStats: async () => {
    try {
      const response = await apiClient.get('/promo/admin/promos/stats/');
      set({ stats: response.data });
    } catch (error: any) {
      console.error('Error fetching promo stats:', error);
      toast.error('Failed to fetch promo statistics');
    }
  },

  createPromoCode: async (data: Omit<PromoCode, 'id'>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/promo/admin/promos/', data);
      
      const { promoCodes } = get();
      set({
        promoCodes: [response.data, ...promoCodes],
        loading: false,
      });
      
      toast.success('Promo code created successfully!');
      get().fetchPromoStats(); // Refresh stats
      return true;
    } catch (error: any) {
      console.error('Error creating promo code:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to create promo code';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  updatePromoCode: async (id: number, data: Partial<PromoCode>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.patch(`/promo/admin/promos/${id}/`, data);
      
      const { promoCodes } = get();
      const updatedPromoCodes = promoCodes.map(promo => 
        promo.id === id ? { ...promo, ...response.data } : promo
      );
      
      set({
        promoCodes: updatedPromoCodes,
        selectedPromo: response.data,
        loading: false,
      });
      
      toast.success('Promo code updated successfully!');
      return true;
    } catch (error: any) {
      console.error('Error updating promo code:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to update promo code';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  deletePromoCode: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/promo/admin/promos/${id}/`);
      
      const { promoCodes } = get();
      const filteredPromoCodes = promoCodes.filter(promo => promo.id !== id);
      
      set({
        promoCodes: filteredPromoCodes,
        selectedPromo: null,
        loading: false,
      });
      
      toast.success('Promo code deleted successfully!');
      get().fetchPromoStats(); // Refresh stats
      return true;
    } catch (error: any) {
      console.error('Error deleting promo code:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to delete promo code';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  bulkCreatePromoCodes: async (data: BulkPromoCode) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/promo/admin/promos/bulk-create/', data);
      
      toast.success(`${data.count} promo codes created successfully!`);
      get().fetchPromoCodes(); // Refresh the list
      get().fetchPromoStats(); // Refresh stats
      return true;
    } catch (error: any) {
      console.error('Error bulk creating promo codes:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to create bulk promo codes';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  setSelectedPromo: (promo: PromoCode | null) => {
    set({ selectedPromo: promo });
  },

  setFilters: (filters: Partial<PromotionState['filters']>) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 }, // Reset to page 1 when filtering
    }));
  },

  setPagination: (pagination: Partial<PromotionState['pagination']>) => {
    set(state => ({
      pagination: { ...state.pagination, ...pagination },
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  exportPromoCodes: async () => {
    try {
      const response = await apiClient.get('/promo/admin/promos/export/', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `promo-codes-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Promo codes exported successfully!');
    } catch (error: any) {
      console.error('Error exporting promo codes:', error);
      toast.error('Failed to export promo codes');
    }
  },

  sendPromoEmail: async (promoIds: number[], userEmails: string[]) => {
    set({ loading: true, error: null });
    try {
      await apiClient.post('/promo/admin/promos/send-email/', {
        promo_ids: promoIds,
        user_emails: userEmails,
      });
      
      set({ loading: false });
      toast.success('Promo codes sent via email successfully!');
      return true;
    } catch (error: any) {
      console.error('Error sending promo emails:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to send promo emails';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },
}));
