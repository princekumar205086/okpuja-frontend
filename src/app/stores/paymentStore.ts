import { create } from 'zustand';
import apiClient from '../apiService/globalApiconfig';
import { toast } from 'react-hot-toast';

export interface Payment {
  id: number;
  transaction_id: string;
  booking_id: string;
  amount: string;
  currency: string;
  method: string;
  method_display: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIAL_REFUND';
  status_display: string;
  created_at: string;
}

export interface CreatePaymentRequest {
  booking?: number; // Optional now - for old flow compatibility
  cart_id?: number; // New field for payment-first flow
  amount?: string; // Optional - backend calculates from cart
  currency?: string;
  method?: string;
  callback_url?: string;
  redirect_url?: string;
}

export interface ProcessCartPaymentRequest {
  cart_id: number;
  method?: string;
}

export interface PaymentBookingCheck {
  success: boolean;
  payment_status: string;
  booking_created: boolean;
  booking?: {
    id: number;
    book_id: string;
    user: any;
    cart: any;
    selected_date: string;
    selected_time: string;
    status: string;
    total_amount: string;
    address: any;
    created_at: string;
  };
  message?: string;
}

export interface PaymentResponse {
  success: boolean;
  payment_id: string;
  merchant_transaction_id: string;
  transaction_id: string;
  amount: string;
  currency: string;
  payment_url: string;
  status: string;
  timestamp?: string;
  cart_id?: number; // Added for new flow
}

export interface PaymentState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  currentPayment: PaymentResponse | null;
  
  // Actions
  fetchPayments: () => Promise<void>;
  createPayment: (paymentData: CreatePaymentRequest) => Promise<PaymentResponse | null>;
  processCartPayment: (paymentData: ProcessCartPaymentRequest) => Promise<PaymentResponse | null>; // New method
  checkPaymentStatus: (paymentId: number) => Promise<Payment | null>;
  checkBookingStatus: (paymentId: number) => Promise<PaymentBookingCheck | null>; // New method
  simulatePaymentSuccess: (paymentId: number) => Promise<any>; // Testing method
  
  // Webhook retry mechanisms
  retryWebhookForPayment: (paymentId: number) => Promise<any>;
  checkAndProcessPayment: (paymentId: number) => Promise<PaymentBookingCheck | null>;
  clearError: () => void;
  clearCurrentPayment: () => void;
}

export const usePaymentStore = create<PaymentState>()((set, get) => ({
  payments: [],
  loading: false,
  error: null,
  currentPayment: null,

  fetchPayments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/payments/payments/');
      const payments = response.data || [];
      set({ 
        payments,
        loading: false,
        error: null 
      });
    } catch (err: any) {
      console.error('Fetch payments error:', err);
      let errorMessage = 'Failed to load payments';
      
      if (err.response?.status === 401) {
        errorMessage = 'Please login to view payments';
      }
      
      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },

  createPayment: async (paymentData: CreatePaymentRequest): Promise<PaymentResponse | null> => {
    set({ loading: true, error: null });
    try {
      const requestData = {
        ...paymentData,
        currency: paymentData.currency || 'INR',
        method: paymentData.method || 'PHONEPE',
        callback_url: paymentData.callback_url || `${window.location.origin}/payment/callback`,
        redirect_url: paymentData.redirect_url || `${window.location.origin}/payment/redirect`
      };
      
      const response = await apiClient.post('/payments/payments/', requestData);
      const paymentResponse: PaymentResponse = response.data;
      
      set({ 
        currentPayment: paymentResponse,
        loading: false,
        error: null 
      });
      
      return paymentResponse;
    } catch (err: any) {
      console.error('Create payment error:', err);
      let errorMessage = 'Failed to create payment';
      
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const firstError = Object.values(errorData)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'Please login to make payment';
      }
      
      set({ 
        error: errorMessage,
        loading: false 
      });
      toast.error(errorMessage);
      return null;
    }
  },

  // New method for payment-first flow
  processCartPayment: async (paymentData: ProcessCartPaymentRequest): Promise<PaymentResponse | null> => {
    set({ loading: true, error: null });
    try {
      const requestData = {
        cart_id: paymentData.cart_id,
        method: paymentData.method || 'PHONEPE'
      };
      
      const response = await apiClient.post('/payments/payments/process-cart/', requestData);
      const paymentResponse: PaymentResponse = response.data;
      
      set({ 
        currentPayment: paymentResponse,
        loading: false,
        error: null 
      });
      
      return paymentResponse;
    } catch (err: any) {
      console.error('Process cart payment error:', err);
      let errorMessage = 'Failed to process cart payment';
      
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const firstError = Object.values(errorData)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'Please login to make payment';
      } else if (err.response?.status === 500) {
        // Enhanced handling for production gateway issues
        const errorData = err.response.data;
        if (typeof errorData === 'string' && errorData.includes('Payment initiation failed')) {
          errorMessage = 'Payment gateway connection issue. Please try again or contact support if this persists.';
        } else if (typeof errorData === 'object' && errorData.detail && errorData.detail.includes('Payment initiation failed')) {
          errorMessage = 'Payment service temporarily unavailable. Please try again in a few minutes.';
        } else {
          errorMessage = 'Server error occurred. Please try again.';
        }
      } else if (err.response?.status === 502 || err.response?.status === 504) {
        errorMessage = 'Payment gateway connection timeout. Please try again.';
      } else if (err.response?.status === 503) {
        errorMessage = 'Payment service temporarily unavailable. Please try again later.';
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        errorMessage = 'Network connection issue. Please check your internet connection.';
      }
      
      set({ 
        error: errorMessage,
        loading: false 
      });
      toast.error(errorMessage);
      return null;
    }
  },

  checkPaymentStatus: async (paymentId: number): Promise<Payment | null> => {
    try {
      const response = await apiClient.get(`/payments/payments/${paymentId}/`);
      return response.data;
    } catch (err: any) {
      console.error('Check payment status error:', err);
      return null;
    }
  },

  // New method to check if payment resulted in booking creation
  checkBookingStatus: async (paymentId: number): Promise<PaymentBookingCheck | null> => {
    try {
      const response = await apiClient.get(`/payments/payments/${paymentId}/check-booking/`);
      return response.data;
    } catch (err: any) {
      console.error('Check booking status error:', err);
      return null;
    }
  },

  // Testing method to simulate payment success (for development)
  simulatePaymentSuccess: async (paymentId: number): Promise<any> => {
    try {
      const response = await apiClient.post(`/payments/payments/${paymentId}/simulate-success/`);
      return response.data;
    } catch (err: any) {
      console.error('Simulate payment success error:', err);
      return null;
    }
  },

  // Webhook retry mechanism for failed webhooks
  retryWebhookForPayment: async (paymentId: number): Promise<any> => {
    try {
      const response = await apiClient.post(`/payments/payments/${paymentId}/retry-webhook/`);
      return response.data;
    } catch (err: any) {
      console.error('Retry webhook error:', err);
      return null;
    }
  },

  // Check payment status and auto-create booking if payment is successful
  checkAndProcessPayment: async (paymentId: number): Promise<PaymentBookingCheck | null> => {
    try {
      const response = await apiClient.post(`/payments/payments/${paymentId}/check-and-process/`);
      return response.data;
    } catch (err: any) {
      console.error('Check and process payment error:', err);
      return null;
    }
  },

  clearError: () => set({ error: null }),
  
  clearCurrentPayment: () => set({ currentPayment: null }),
}));
