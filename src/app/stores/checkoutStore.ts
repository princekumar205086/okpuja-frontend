import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CheckoutSession {
  id: string;
  cart_items: number[];
  address_id: number;
  total_amount: number;
  status: 'PENDING' | 'PAYMENT_INITIATED' | 'PAYMENT_SUCCESS' | 'BOOKING_CREATED' | 'COMPLETED' | 'FAILED';
  created_at: string;
  payment_url?: string;
  payment_id?: string; // Store payment ID instead of booking IDs
  booking_id?: number; // Store the final booking ID
}

export interface CheckoutState {
  currentSession: CheckoutSession | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  createCheckoutSession: (cartItems: number[], addressId: number, totalAmount: number) => string;
  updateSessionStatus: (sessionId: string, status: CheckoutSession['status']) => void;
  setPaymentUrl: (sessionId: string, paymentUrl: string) => void;
  setPaymentId: (sessionId: string, paymentId: string) => void; // New method
  setBookingId: (sessionId: string, bookingId: number) => void; // Updated method
  clearSession: () => void;
  clearCheckoutSession: () => void;
  getSession: (sessionId: string) => CheckoutSession | null;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      loading: false,
      error: null,

      createCheckoutSession: (cartItems: number[], addressId: number, totalAmount: number): string => {
        const sessionId = `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const session: CheckoutSession = {
          id: sessionId,
          cart_items: cartItems,
          address_id: addressId,
          total_amount: totalAmount,
          status: 'PENDING',
          created_at: new Date().toISOString()
        };

        set({ currentSession: session });
        return sessionId;
      },

      updateSessionStatus: (sessionId: string, status: CheckoutSession['status']) => {
        const { currentSession } = get();
        if (currentSession?.id === sessionId) {
          set({
            currentSession: {
              ...currentSession,
              status
            }
          });
        }
      },

      setPaymentUrl: (sessionId: string, paymentUrl: string) => {
        const { currentSession } = get();
        if (currentSession?.id === sessionId) {
          set({
            currentSession: {
              ...currentSession,
              payment_url: paymentUrl,
              status: 'PAYMENT_INITIATED'
            }
          });
        }
      },

      setPaymentId: (sessionId: string, paymentId: string) => {
        const { currentSession } = get();
        if (currentSession?.id === sessionId) {
          set({
            currentSession: {
              ...currentSession,
              payment_id: paymentId,
              status: 'PAYMENT_SUCCESS'
            }
          });
        }
      },

      setBookingId: (sessionId: string, bookingId: number) => {
        const { currentSession } = get();
        if (currentSession?.id === sessionId) {
          set({
            currentSession: {
              ...currentSession,
              booking_id: bookingId,
              status: 'BOOKING_CREATED'
            }
          });
        }
      },


      clearSession: () => {
        set({ currentSession: null });
      },

      clearCheckoutSession: () => {
        set({ currentSession: null });
      },

      getSession: (sessionId: string) => {
        const { currentSession } = get();
        return currentSession?.id === sessionId ? currentSession : null;
      },
    }),
    {
      name: 'checkout-session',
      partialize: (state) => ({
        currentSession: state.currentSession,
      }),
    }
  )
);
