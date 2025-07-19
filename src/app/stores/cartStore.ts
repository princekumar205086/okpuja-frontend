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
      created_at: string;
      updated_at: string;
    };
    type: string;
    duration_minutes: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  package?: {
    id: number;
    puja_service_detail?: {
      id: number;
      title: string;
      image_url?: string;
      description: string;
      category_detail?: {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
      };
      type: string;
      duration_minutes: number;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    location: string;
    language: string;
    package_type: string;
    price: string;
    description: string;
    includes_materials: boolean;
    priest_count: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  astrology_service?: {
    id: number;
    title: string;
    service_type: string;
    description: string;
    image_url?: string;
    price: string;
    duration_minutes: number;
  } | null;
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
  } | null;
  status: 'ACTIVE' | 'CHECKOUT' | 'CANCELLED' | 'EXPIRED';
  created_at: string;
  updated_at: string;
  total_price: string;
  can_delete: boolean;
}

export interface AddToCartRequest {
  service_type: 'PUJA' | 'ASTROLOGY';
  puja_service?: number;
  package?: number; // Changed from package_id to package to match your backend
  astrology_service?: number; // Changed from astrology_service_id to astrology_service
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
  
  // Checkout related
  proceedToCheckout: () => boolean;
  
  // UI Actions
  clearError: () => void;
  
  // Check deletion status for detailed timing info
  checkDeletionStatus: (cartId: number) => Promise<any>;
  
  // Cleanup old payments
  cleanupOldPayments: (cartId: number) => Promise<boolean>;
  
  // Payment and booking related
  checkPaymentAndCreateBooking: (paymentId: number) => Promise<boolean>;
  createBookingFromPayment: (paymentId: number) => Promise<boolean>;
  
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
          // Try the active cart endpoint first, then fallback to list all carts
          let response;
          try {
            response = await apiClient.get('/cart/carts/active/');
          } catch (activeError: any) {
            if (activeError.response?.status === 404) {
              // No active cart, try getting all carts and filter active ones
              response = await apiClient.get('/cart/carts/');
            } else {
              throw activeError;
            }
          }
          
          // Handle different response structures
          let allCarts = [];
          if (response.data) {
            if (Array.isArray(response.data)) {
              allCarts = response.data;
            } else if (response.data.results && Array.isArray(response.data.results)) {
              allCarts = response.data.results;
            } else if (typeof response.data === 'object' && response.data.id) {
              // Single cart object
              allCarts = [response.data];
            }
          }

          // Filter only active cart items and ensure they're valid cart items
          const items = allCarts.filter((cart: any) => 
            cart && 
            cart.id && 
            cart.status === 'ACTIVE' && 
            cart.total_price
          );
          
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
          } else if (err.response?.status === 404) {
            // No cart items found - this is normal, set empty state
            set({
              items: [],
              totalCount: 0,
              totalAmount: 0,
              loading: false,
              error: null,
            });
            
            if (typeof window !== 'undefined') {
              localStorage.setItem('cart_count', '0');
            }
            return;
          } else if (err.response?.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (err.code === 'NETWORK_ERROR' || !err.response) {
            errorMessage = 'Network error. Please check your connection.';
          } else if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
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
          
          if (err.response?.status === 400) {
            const errorData = err.response.data;
            
            // Handle the new detailed timing messages
            if (errorData?.error) {
              errorMessage = errorData.error;
              
              // If there's wait time info, add it to the message
              if (errorData?.wait_minutes) {
                errorMessage += ` (${errorData.wait_minutes} minute(s) remaining)`;
              }
              
              // If auto-cleanup is available, mention it
              if (errorData?.can_cleanup) {
                errorMessage += ' You can try cleanup old payments.';
              }
            } else if (errorData?.detail) {
              errorMessage = errorData.detail;
            } else if (errorData?.message) {
              errorMessage = errorData.message;
            }
          } else if (err.response?.status === 404) {
            errorMessage = 'Cart item not found';
          } else if (err.response?.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (err.response?.data?.error) {
            errorMessage = err.response.data.error;
          } else if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
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
          // Use the new clear converted carts endpoint or delete individual items
          if (items.length === 0) {
            set({
              items: [],
              totalCount: 0,
              totalAmount: 0,
              loading: false,
              error: null,
            });
            return true;
          }

          // Try to use the bulk clear endpoint first
          try {
            await apiClient.post('/cart/carts/clear_converted/');
          } catch (clearError) {
            // If bulk clear fails, fallback to individual deletion
            console.warn('Bulk clear failed, falling back to individual deletion');
            const deletePromises = items.map(item => 
              apiClient.delete(`/cart/carts/${item.id}/`)
            );
            await Promise.all(deletePromises);
          }
          
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
          let errorMessage = 'Failed to clear cart';
          
          if (err.response?.data?.error) {
            errorMessage = err.response.data.error;
          } else if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          } else if (err.response?.status === 400) {
            const errorData = err.response.data;
            if (typeof errorData === 'string') {
              errorMessage = errorData;
            } else if (errorData?.message) {
              errorMessage = errorData.message;
            } else {
              errorMessage = 'Cannot clear cart. Some items may have pending payments.';
            }
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
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

      // Proceed to checkout
      proceedToCheckout: (): boolean => {
        const { items, totalCount } = get();
        
        if (totalCount === 0) {
          toast.error('Your cart is empty');
          return false;
        }
        
        // Validate cart items
        const invalidItems = items.filter(item => !item.selected_date || !item.selected_time);
        if (invalidItems.length > 0) {
          toast.error('Please ensure all items have date and time selected');
          return false;
        }
        
        return true;
      },

      // Check deletion status with timing info
      checkDeletionStatus: async (cartId: number) => {
        try {
          const response = await apiClient.get(`/cart/carts/${cartId}/deletion_status/`);
          return response.data;
        } catch (err: any) {
          console.error('Check deletion status error:', err);
          return null;
        }
      },

      // Cleanup old payments for a cart
      cleanupOldPayments: async (cartId: number): Promise<boolean> => {
        try {
          await apiClient.post(`/cart/carts/${cartId}/cleanup_old_payments/`);
          toast.success('Old payments cleaned up successfully!');
          // Refresh cart after cleanup
          await get().fetchCartItems();
          return true;
        } catch (err: any) {
          console.error('Cleanup old payments error:', err);
          let errorMessage = 'Failed to cleanup old payments';
          
          if (err.response?.data?.error) {
            errorMessage = err.response.data.error;
          } else if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          }
          
          toast.error(errorMessage);
          return false;
        }
      },

      // Add webhook retry mechanism for payment completion
      checkPaymentAndCreateBooking: async (paymentId: number): Promise<boolean> => {
        try {
          const response = await apiClient.post(`/payments/payments/${paymentId}/check-and-create-booking/`);
          
          if (response.data.booking_created) {
            // Refresh cart after successful booking creation
            await get().fetchCartItems();
            toast.success('Booking created successfully!');
            return true;
          }
          
          return false;
        } catch (err: any) {
          console.error('Check payment and create booking error:', err);
          return false;
        }
      },

      // Manual booking creation for failed webhook scenarios  
      createBookingFromPayment: async (paymentId: number): Promise<boolean> => {
        try {
          const response = await apiClient.post(`/payments/payments/${paymentId}/create-booking/`);
          
          if (response.data.success) {
            // Clear cart after successful booking
            await get().fetchCartItems();
            toast.success('Booking created successfully!');
            return true;
          }
          
          return false;
        } catch (err: any) {
          console.error('Create booking from payment error:', err);
          let errorMessage = 'Failed to create booking from payment';
          
          if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          }
          
          toast.error(errorMessage);
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
