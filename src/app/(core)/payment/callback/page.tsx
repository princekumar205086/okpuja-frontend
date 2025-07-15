"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { usePaymentStore } from '../../../stores/paymentStore';
import { useCartStore } from '../../../stores/cartStore';
import { useCheckoutStore } from '../../../stores/checkoutStore';
import { toast } from 'react-hot-toast';

const PaymentCallbackPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkBookingStatus, retryWebhookForPayment, checkAndProcessPayment } = usePaymentStore();
  const { clearCart, checkPaymentAndCreateBooking } = useCartStore();
  const { clearCheckoutSession, setBookingId } = useCheckoutStore();
  
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'SUCCESS' | 'FAILED' | 'PENDING' | null>(null);
  const [bookingCreated, setBookingCreated] = useState(false);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Get payment details from URL params and session storage
        const sessionId = searchParams.get('session');
        const paymentId = searchParams.get('payment_id') || sessionStorage.getItem('payment_id');
        const transactionId = searchParams.get('transaction_id');

        console.log('Payment callback received:', { sessionId, paymentId, transactionId });

        if (paymentId) {
          // First, check payment and booking status using new API
          let bookingCheck = await checkBookingStatus(parseInt(paymentId));
          
          if (bookingCheck) {
            setPaymentStatus(bookingCheck.payment_status as 'SUCCESS' | 'FAILED' | 'PENDING');
            setBookingCreated(bookingCheck.booking_created);
            
            // If payment is successful but booking not created, try to create it
            if (bookingCheck.payment_status === 'SUCCESS' && !bookingCheck.booking_created) {
              console.log('Payment successful but booking not created. Attempting to create booking...');
              
              // Try to create booking from payment
              const bookingCreationResult = await checkPaymentAndCreateBooking(parseInt(paymentId));
              
              if (bookingCreationResult) {
                // Re-check booking status after creation attempt
                bookingCheck = await checkBookingStatus(parseInt(paymentId));
                if (bookingCheck) {
                  setBookingCreated(bookingCheck.booking_created);
                }
              }
            }
            
            // Handle based on payment status and booking creation
            setTimeout(async () => {
              if (bookingCheck && bookingCheck.payment_status === 'SUCCESS') {
                if (bookingCheck.booking_created && bookingCheck.booking) {
                  // Payment successful and booking created
                  try {
                    await clearCart();
                    clearCheckoutSession();
                    
                    // Store booking ID in checkout session if available
                    if (sessionId && bookingCheck.booking) {
                      setBookingId(sessionId, bookingCheck.booking.id);
                    }
                    
                    // Clear session storage
                    sessionStorage.removeItem('checkout_session_id');
                    sessionStorage.removeItem('payment_id');
                    
                    toast.success('Payment successful! Your booking is confirmed.');
                  } catch (error) {
                    console.error('Failed to clear cart:', error);
                  }
                  
                  router.push(`/confirmbooking?payment_id=${paymentId}&booking_id=${bookingCheck.booking.id}`);
                } else {
                  // Payment successful but booking still processing
                  toast.success('Payment successful! Your booking is being processed.');
                  router.push(`/confirmbooking?payment_id=${paymentId}&status=processing`);
                }
              } else if (bookingCheck && bookingCheck.payment_status === 'PENDING') {
                // Payment still pending, try webhook retry
                console.log('Payment still pending. Attempting webhook retry...');
                
                try {
                  const retryResult = await retryWebhookForPayment(parseInt(paymentId));
                  if (retryResult && retryResult.success) {
                    // Re-check after retry
                    const updatedCheck = await checkBookingStatus(parseInt(paymentId));
                    if (updatedCheck && updatedCheck.payment_status === 'SUCCESS') {
                      window.location.reload(); // Reload to process success
                      return;
                    }
                  }
                } catch (error) {
                  console.error('Webhook retry failed:', error);
                }
                
                // Still pending after retry
                router.push(`/failedbooking?payment_id=${paymentId}&status=PENDING&message=Payment is still being processed. Please contact support if this persists.`);
              } else if (bookingCheck) {
                // Payment failed
                router.push(`/failedbooking?payment_id=${paymentId}&status=${bookingCheck.payment_status}`);
              }
            }, 3000);
          } else {
            // If no payment check response, treat as failed
            setPaymentStatus('FAILED');
            setTimeout(() => {
              router.push(`/failedbooking?payment_id=${paymentId}&status=UNKNOWN`);
            }, 3000);
          }
        } else {
          // No payment ID, redirect to failed booking
          setPaymentStatus('FAILED');
          setTimeout(() => {
            router.push('/failedbooking?status=INVALID_CALLBACK');
          }, 3000);
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        setPaymentStatus('FAILED');
        setTimeout(() => {
          router.push('/failedbooking?status=CALLBACK_ERROR');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handlePaymentCallback();
  }, [searchParams, checkBookingStatus, router, clearCart, clearCheckoutSession, setBookingId]);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'SUCCESS':
        return <FaCheckCircle className="text-green-500 text-6xl" />;
      case 'FAILED':
        return <FaTimesCircle className="text-red-500 text-6xl" />;
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner className="text-orange-500 text-6xl" />
          </motion.div>
        );
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'SUCCESS':
        return {
          title: 'Payment Successful!',
          message: bookingCreated 
            ? 'Your booking has been confirmed. Redirecting to confirmation page...'
            : 'Your payment was successful. Booking is being processed...',
          color: 'text-green-600'
        };
      case 'FAILED':
        return {
          title: 'Payment Failed',
          message: 'There was an issue with your payment. Redirecting to failure page...',
          color: 'text-red-600'
        };
      default:
        return {
          title: 'Processing Payment...',
          message: 'Please wait while we verify your payment status.',
          color: 'text-orange-600'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center"
      >
        <div className="mb-6">
          {getStatusIcon()}
        </div>
        
        <h1 className={`text-2xl font-bold mb-4 ${statusInfo.color}`}>
          {statusInfo.title}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {statusInfo.message}
        </p>
        
        {loading && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <FaSpinner className="animate-spin" />
            <span>Verifying payment status...</span>
          </div>
        )}
        
        {!loading && paymentStatus === 'PENDING' && (
          <p className="text-sm text-orange-600">
            Payment is still being processed. Please wait a moment.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentCallbackPage;
