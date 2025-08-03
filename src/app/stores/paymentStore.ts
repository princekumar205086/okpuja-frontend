import { create } from 'zustand';
import apiClient from '../apiService/globalApiconfig';
import { toast } from 'react-hot-toast';

// PhonePe V2 Payment Interfaces
export interface Payment {
  id: number;
  transaction_id: string;
  merchant_transaction_id: string;
  booking_id?: string;
  cart_id?: number;
  amount: string;
  currency: string;
  method: string;
  method_display: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIAL_REFUND';
  status_display: string;
  created_at: string;
  updated_at: string;
  phonepe_payment_id?: string;
  phonepe_transaction_id?: string;
}

export interface CreatePaymentRequest {
  booking?: number; // Optional - for old flow compatibility
  cart_id?: number; // Required for payment-first flow
  amount?: string; // Optional - backend calculates from cart
  currency?: string;
  method?: string;
  callback_url?: string;
  redirect_url?: string;
}

export interface ProcessCartPaymentRequest {
  cart_id: string; // Changed to string to match API
  address_id: number; // NEW: Required for payment initiation with address
}

// PhonePe V2 Response Interface - Updated for new API
export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment_order: {
      id: string;
      merchant_order_id: string;
      amount: number; // amount in paise
      amount_in_rupees: number; // amount in rupees
      cart_id: string;
      status: string;
      phonepe_payment_url: string;
      created_at: string;
    };
  };
  // Legacy fields for backward compatibility
  payment_id?: string;
  merchant_transaction_id?: string;
  transaction_id?: string;
  payment_url?: string;
  currency?: string;
  timestamp?: string;
  cart_id?: number;
  // PhonePe V2 specific fields
  phonepe_payment_id?: string;
  phonepe_merchant_id?: string;
  phonepe_response?: {
    code: string;
    message: string;
    data?: any;
  };
}

export interface PaymentBookingCheck {
  success: boolean;
  payment_status: string;
  booking_created: boolean;
  payment?: Payment;
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

// PhonePe V2 Callback Response
export interface PhonePeCallbackResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: 'COMPLETED' | 'FAILED' | 'PENDING';
    responseCode: string;
    paymentInstrument: {
      type: string;
      [key: string]: any;
    };
  };
}

export interface PaymentState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  currentPayment: PaymentResponse | null;
  
  // Core Payment Actions
  fetchPayments: () => Promise<void>;
  createPayment: (paymentData: CreatePaymentRequest) => Promise<PaymentResponse | null>;
  processCartPayment: (paymentData: ProcessCartPaymentRequest) => Promise<PaymentResponse | null>;
  checkPaymentStatus: (merchantOrderId: string) => Promise<Payment | null>;
  checkCartPaymentStatus: (cartId: string) => Promise<any | null>;
  
  // NEW: Manual verification for sandbox/webhook issues
  verifyAndCompletePayment: (cartId: string) => Promise<PaymentBookingCheck | null>;
  
  // PhonePe V2 Specific Actions
  handlePhonePeCallback: (callbackData: any) => Promise<PaymentBookingCheck | null>;
  verifyPaymentWithPhonePe: (merchantTransactionId: string) => Promise<Payment | null>;
  
  // Booking Integration
  checkBookingStatus: (merchantOrderId: string) => Promise<PaymentBookingCheck | null>;
  createBookingFromPayment: (paymentId: number) => Promise<PaymentBookingCheck | null>;
  
  // Testing & Development
  simulatePaymentSuccess: (paymentId: number) => Promise<any>;
  
  // Webhook & Retry Mechanisms
  retryWebhookForPayment: (paymentId: number) => Promise<any>;
  checkAndProcessPayment: (paymentId: number) => Promise<PaymentBookingCheck | null>;
  
  // Utility
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
      const response = await apiClient.get('/payments/list/');
      const payments = response.data?.results || response.data || [];
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
        callback_url: paymentData.callback_url || `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment/callback`,
        redirect_url: paymentData.redirect_url || `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment/redirect`
      };
      
      const response = await apiClient.post('/payments/create/', requestData);
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

  // PhonePe V2 Payment Processing - Updated for new API with address_id
  processCartPayment: async (paymentData: ProcessCartPaymentRequest): Promise<PaymentResponse | null> => {
    set({ loading: true, error: null });
    try {
      const requestData = {
        cart_id: paymentData.cart_id,
        address_id: paymentData.address_id // NEW: Include address_id in payment initiation
      };
      
      console.log('Making payment request to /payments/cart/ with data:', requestData);
      const response = await apiClient.post('/payments/cart/', requestData);
      console.log('Payment API response:', response.data);
      
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
      } else if (err.response?.status === 404) {
        errorMessage = 'Cart not found. Please refresh and try again.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Please login to make payment';
      } else if (err.response?.status === 500) {
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

  checkPaymentStatus: async (merchantOrderId: string): Promise<Payment | null> => {
    try {
      const response = await apiClient.get(`/payments/status/${merchantOrderId}/`);
      return response.data;
    } catch (err: any) {
      console.error('Check payment status error:', err);
      return null;
    }
  },

  // Check cart payment status using cart_id
  checkCartPaymentStatus: async (cartId: string): Promise<any | null> => {
    try {
      const response = await apiClient.get(`/payments/cart/status/${cartId}/`);
      return response.data;
    } catch (err: any) {
      console.error('Check cart payment status error:', err);
      return null;
    }
  },

  // NEW: Manual payment verification for sandbox/webhook issues
  verifyAndCompletePayment: async (cartId: string): Promise<PaymentBookingCheck | null> => {
    try {
      const response = await apiClient.post('/payments/verify-and-complete/', {
        cart_id: cartId
      });
      return response.data;
    } catch (err: any) {
      console.error('Verify and complete payment error:', err);
      return null;
    }
  },

  // PhonePe V2 Callback Handler - Updated for new API
  handlePhonePeCallback: async (callbackData: any): Promise<PaymentBookingCheck | null> => {
    try {
      const response = await apiClient.post('/payments/webhook/phonepe/', callbackData);
      return response.data;
    } catch (err: any) {
      console.error('Handle PhonePe callback error:', err);
      return null;
    }
  },

  // Verify Payment with PhonePe V2
  verifyPaymentWithPhonePe: async (merchantTransactionId: string): Promise<Payment | null> => {
    try {
      const response = await apiClient.post(`/payments/payments/verify/phonepe/`, {
        merchant_transaction_id: merchantTransactionId
      });
      return response.data;
    } catch (err: any) {
      console.error('Verify payment with PhonePe error:', err);
      return null;
    }
  },

  // Booking Status and Creation - Updated for new API
  checkBookingStatus: async (merchantOrderId: string): Promise<PaymentBookingCheck | null> => {
    try {
      const response = await apiClient.get(`/payments/status/${merchantOrderId}/`);
      return response.data;
    } catch (err: any) {
      console.error('Check booking status error:', err);
      return null;
    }
  },

  createBookingFromPayment: async (paymentId: number): Promise<PaymentBookingCheck | null> => {
    try {
      const response = await apiClient.post(`/payments/payments/${paymentId}/create-booking/`);
      return response.data;
    } catch (err: any) {
      console.error('Create booking from payment error:', err);
      return null;
    }
  },

  // Testing method for development - Updated for new API
  simulatePaymentSuccess: async (testData: any): Promise<any> => {
    try {
      const response = await apiClient.post('/payments/test/', testData);
      return response.data;
    } catch (err: any) {
      console.error('Simulate payment success error:', err);
      return null;
    }
  },

  // Webhook retry mechanism
  retryWebhookForPayment: async (paymentId: number): Promise<any> => {
    try {
      const response = await apiClient.post(`/payments/payments/${paymentId}/retry-webhook/`);
      return response.data;
    } catch (err: any) {
      console.error('Retry webhook error:', err);
      return null;
    }
  },

  // Check payment and process booking automatically
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
