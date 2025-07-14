import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../apiService/globalApiconfig';
import { toast } from 'react-hot-toast';

export interface CartItem {
  id: number;
  cart_id: string;
  user: number;
  service_type: 'PUJA' | 'ASTROLOGY';
  puja_service?: {
    id: number;
    title: string;
    image_url?: string;
    description: string;
    category_detail?: {
      id: number;
      name: string;
    };
    type: string;
    duration_minutes: number;
  };
  package?: {
    id: number;
    location: string;
    language: string;
    package_type: string;
    price: string;
    description: string;
    includes_materials: boolean;
    priest_count: number;
  };
  astrology_service?: {
    id: number;
    title: string;
    service_type: string;
    description: string;
    image_url?: string;
    price: string;
    duration_minutes: number;
  };
  selected_date: string;
  selected_time: string;
  promo_code?: {
    id: number;
    code: string;
    description: string;
    discount: string;
    discount_type: 'PERCENTAGE' | 'FIXED';
    min_order_amount?: string;
    max_discount_amount?: string;
    is_valid: boolean;
    validity_message: string;
  };
  status: 'ACTIVE' | 'CHECKOUT' | 'CANCELLED' | 'EXPIRED';
  created_at: string;
  updated_at: string;
  total_price: string;
}

export interface AddToCartRequest {
  service_type: 'PUJA' | 'ASTROLOGY';
  puja_service?: number;
  package_id?: number;
  astrology_service_id?: number;
  selected_date: string;
  selected_time: string;
  promo_code?: string;
}

export interface CartState {
  // Data
  items: CartItem[];
  totalCount: number;
  totalAmount: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCartItems: () => Promise<void>;
  addToCart: (item: AddToCartRequest) => Promise<boolean>;
  updateCartItem: (id: number, updates: Partial<AddToCartRequest>) => Promise<boolean>;
  removeFromCart: (id: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  applyPromoCode: (cartId: number, promoCode: string) => Promise<boolean>;
  removePromoCode: (cartId: number) => Promise<boolean>;
  
  // UI Actions
  clearError: () => void;
  
  // Local storage helpers
  getLocalCartCount: () => number;
  syncWithLocal: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      totalCount: 0,
      totalAmount: 0,
      loading: false,
      error: null,

      // Fetch cart items from API
      fetchCartItems: async () => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.get('/cart/carts/active/');
          const items = response.data.results || response.data || [];
          
          const totalAmount = items.reduce((sum: number, item: CartItem) => 
            sum + parseFloat(item.total_price || '0'), 0
          );
          
          set({
            items,
            totalCount: items.length,
            totalAmount,
            loading: false,
            error: null,
          });
          
          // Update localStorage for offline access
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart_count', items.length.toString());
          }
          
        } catch (err: any) {
          console.error('Fetch cart error:', err);
          let errorMessage = 'Failed to load cart items';
          
          if (err.response?.status === 401) {
            errorMessage = 'Please login to view your cart';
          } else if (err.response?.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (err.code === 'NETWORK_ERROR' || !err.response) {
            errorMessage = 'Network error. Please check your connection.';
          }
          
          set({ 
            error: errorMessage, 
            loading: false,
            items: [],
            totalCount: 0,
            totalAmount: 0,
          });
        }
      },

      // Add item to cart
      addToCart: async (item: AddToCartRequest): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.post('/cart/carts/', item);
          
          // Refresh cart items after adding
          await get().fetchCartItems();
          
          toast.success('Item added to cart successfully!');
          return true;
          
        } catch (err: any) {
          console.error('Add to cart error:', err);
          let errorMessage = 'Failed to add item to cart';
          
          if (err.response?.status === 400) {
            const errorData = err.response.data;
            if (typeof errorData === 'object' && errorData !== null) {
              // Handle field-specific errors
              const firstError = Object.values(errorData)[0];
              if (Array.isArray(firstError)) {
                errorMessage = firstError[0];
              } else if (typeof firstError === 'string') {
                errorMessage = firstError;
              }
            }
          } else if (err.response?.status === 401) {
            errorMessage = 'Please login to add items to cart';
          } else if (err.response?.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (err.code === 'NETWORK_ERROR' || !err.response) {
            errorMessage = 'Network error. Please check your connection.';
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      // Update cart item
      updateCartItem: async (id: number, updates: Partial<AddToCartRequest>): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          await apiClient.patch(`/cart/carts/${id}/`, updates);
          
          // Refresh cart items after updating
          await get().fetchCartItems();
          
          toast.success('Cart item updated successfully!');
          return true;
          
        } catch (err: any) {
          console.error('Update cart error:', err);
          let errorMessage = 'Failed to update cart item';
          
          if (err.response?.status === 400) {
            const errorData = err.response.data;
            if (typeof errorData === 'object' && errorData !== null) {
              const firstError = Object.values(errorData)[0];
              if (Array.isArray(firstError)) {
                errorMessage = firstError[0];
              } else if (typeof firstError === 'string') {
                errorMessage = firstError;
              }
            }
          } else if (err.response?.status === 404) {
            errorMessage = 'Cart item not found';
          } else if (err.response?.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      // Remove item from cart
      removeFromCart: async (id: number): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          await apiClient.delete(`/cart/carts/${id}/`);
          
          // Refresh cart items after removing
          await get().fetchCartItems();
          
          toast.success('Item removed from cart!');
          return true;
          
        } catch (err: any) {
          console.error('Remove from cart error:', err);
          let errorMessage = 'Failed to remove item from cart';
          
          if (err.response?.status === 404) {
            errorMessage = 'Cart item not found';
          } else if (err.response?.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      // Clear entire cart
      clearCart: async (): Promise<boolean> => {
        const { items } = get();
        set({ loading: true, error: null });
        
        try {
          // Delete all cart items
          const deletePromises = items.map(item => 
            apiClient.delete(`/cart/carts/${item.id}/`)
          );
          
          await Promise.all(deletePromises);
          
          set({
            items: [],
            totalCount: 0,
            totalAmount: 0,
            loading: false,
            error: null,
          });
          
          // Update localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart_count', '0');
          }
          
          toast.success('Cart cleared successfully!');
          return true;
          
        } catch (err: any) {
          console.error('Clear cart error:', err);
          set({ error: 'Failed to clear cart', loading: false });
          toast.error('Failed to clear cart');
          return false;
        }
      },

      // Apply promo code
      applyPromoCode: async (cartId: number, promoCode: string): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          await apiClient.post(`/cart/carts/${cartId}/apply_promo/`, {
            promo_code: promoCode
          });
          
          // Refresh cart items after applying promo
          await get().fetchCartItems();
          
          toast.success('Promo code applied successfully!');
          return true;
          
        } catch (err: any) {
          console.error('Apply promo error:', err);
          let errorMessage = 'Failed to apply promo code';
          
          if (err.response?.status === 400) {
            const errorData = err.response.data;
            if (errorData?.detail) {
              errorMessage = errorData.detail;
            } else if (errorData?.promo_code) {
              errorMessage = Array.isArray(errorData.promo_code) 
                ? errorData.promo_code[0] 
                : errorData.promo_code;
            }
          } else if (err.response?.status === 404) {
            errorMessage = 'Invalid promo code';
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      // Remove promo code
      removePromoCode: async (cartId: number): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          await apiClient.post(`/cart/carts/${cartId}/remove_promo/`);
          
          // Refresh cart items after removing promo
          await get().fetchCartItems();
          
          toast.success('Promo code removed successfully!');
          return true;
          
        } catch (err: any) {
          console.error('Remove promo error:', err);
          set({ error: 'Failed to remove promo code', loading: false });
          toast.error('Failed to remove promo code');
          return false;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Get local cart count (fallback when offline)
      getLocalCartCount: (): number => {
        if (typeof window === 'undefined') return 0;
        return parseInt(localStorage.getItem('cart_count') || '0');
      },

      // Sync with local storage
      syncWithLocal: () => {
        const { totalCount } = get();
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart_count', totalCount.toString());
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        // Only persist essential data, not the full items
        totalCount: state.totalCount,
        totalAmount: state.totalAmount,
      }),
    }
  )
);
