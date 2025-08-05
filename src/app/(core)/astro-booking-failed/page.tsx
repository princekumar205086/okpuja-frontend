'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/app/apiService/globalApiconfig';

interface PaymentErrorDetails {
  merchant_order_id: string;
  error_code?: string;
  error_message?: string;
  payment_provider?: string;
  amount?: number;
}

export default function AstroBookingFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorDetails, setErrorDetails] = useState<PaymentErrorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  const merchantOrderId = searchParams.get('merchant_order_id');
  const errorCode = searchParams.get('error_code');
  const errorMessage = searchParams.get('error_message');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!merchantOrderId) {
        setErrorDetails({
          merchant_order_id: 'UNKNOWN',
          error_message: 'Payment failed for unknown reasons. Please try again or contact support.',
        });
        setLoading(false);
        return;
      }

      try {
        // Try to get payment details from API
        const response = await apiClient.get(`/payments/order-status/?merchant_order_id=${merchantOrderId}`);
        
        if (response.data.success) {
          // We got details but we know it failed since we're on the failure page
          setErrorDetails({
            merchant_order_id: merchantOrderId,
            payment_provider: response.data.data?.payment_provider || 'Unknown',
            amount: response.data.data?.amount,
            error_code: errorCode || response.data.data?.error_code || 'PAYMENT_FAILED',
            error_message: errorMessage || response.data.data?.error_message || 'Payment was not successful. Please try again.',
          });
        } else {
          // API call successful but status was failure
          setErrorDetails({
            merchant_order_id: merchantOrderId,
            error_code: errorCode || 'API_ERROR',
            error_message: errorMessage || response.data.message || 'Payment verification failed. Please contact support.',
          });
        }
      } catch (err) {
        console.error('Error fetching payment details:', err);
        // API call failed
        setErrorDetails({
          merchant_order_id: merchantOrderId,
          error_code: errorCode || 'API_ERROR',
          error_message: errorMessage || 'Could not verify payment status. Please contact customer support.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [merchantOrderId, errorCode, errorMessage]);

  // Get a user-friendly error message
  const getUserFriendlyErrorMessage = () => {
    if (!errorDetails) return 'Payment processing failed. Please try again.';

    switch (errorDetails.error_code) {
      case 'PAYMENT_CANCELLED':
        return 'You cancelled the payment. You can try again whenever you\'re ready.';
      case 'INSUFFICIENT_FUNDS':
        return 'The payment failed due to insufficient funds. Please try with another payment method.';
      case 'BANK_ERROR':
        return 'There was an issue with your bank. Please contact your bank or try another payment method.';
      case 'TIMEOUT':
        return 'The payment process timed out. Please try again.';
      default:
        return errorDetails.error_message || 'Payment could not be completed. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-width error banner for large screens */}
      {!loading && (
        <div className="w-full bg-gradient-to-r from-gray-700 to-gray-900 py-10 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center text-white text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-3">Payment Failed</h1>
              <p className="text-xl opacity-90 mb-4">Your astrology booking could not be completed</p>
              {merchantOrderId && (
                <p className="text-md bg-white/20 rounded-full px-6 py-2 inline-block">
                  Reference ID: {merchantOrderId}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-white shadow-lg rounded-lg p-10 text-center max-w-xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6">
              <div className="w-20 h-20 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Checking Payment Status...</h2>
            <p className="text-gray-600 mb-4">Please wait while we verify your payment information.</p>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-500 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Error Details */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden lg:col-span-2">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="bg-red-100 text-red-600 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </span>
                  What Happened?
                </h2>

                <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-8">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-red-800">Payment Error</h3>
                        <div className="mt-2 text-red-700">
                          <p>{getUserFriendlyErrorMessage()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {errorDetails?.error_code && (
                      <div className="mt-2 border-t border-red-200 pt-4">
                        <p className="text-sm text-gray-600">Error Code: <span className="font-mono font-medium">{errorDetails.error_code}</span></p>
                        {errorDetails.payment_provider && (
                          <p className="text-sm text-gray-600 mt-1">Payment Provider: <span className="font-medium">{errorDetails.payment_provider}</span></p>
                        )}
                        {errorDetails.amount && (
                          <p className="text-sm text-gray-600 mt-1">Amount: <span className="font-medium">₹{errorDetails.amount}</span></p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Frequently Asked Questions
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="font-medium text-gray-900 mb-2">Will I be charged for this failed payment?</h3>
                    <p className="text-gray-600">No, you will not be charged for failed payment attempts. If any amount was temporarily held, it should be released back to your account within 5-7 business days.</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="font-medium text-gray-900 mb-2">How can I retry my booking?</h3>
                    <p className="text-gray-600">You can return to the astrology services page, select your desired service, and attempt the booking process again with the same or different payment method.</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="font-medium text-gray-900 mb-2">Was my booking information saved?</h3>
                    <p className="text-gray-600">No, your booking information is only saved after a successful payment. You'll need to fill in your details again when you retry.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - What to Do Next */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  What You Can Do Now
                </h2>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-200 text-blue-600 font-bold">
                      1
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-800">Try Again</h3>
                      <p className="text-gray-600 mt-1">Return to the astrology services page and try booking again with a different payment method.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-200 text-blue-600 font-bold">
                      2
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-800">Check Payment Method</h3>
                      <p className="text-gray-600 mt-1">Ensure your card has sufficient funds and is enabled for online transactions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-200 text-blue-600 font-bold">
                      3
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-800">Contact Support</h3>
                      <p className="text-gray-600 mt-1">If you continue to face issues, please reach out to our customer support team.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-col space-y-3">
                    <Link href="/astrology" className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                      Browse Astrology Services
                    </Link>
                    <Link href="/contact" className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact Customer Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!loading && (
          <div className="mt-8 bg-white shadow-sm rounded-lg p-6 text-center">
            <p className="text-gray-600">If you have any questions about your payment, please contact our customer support at <span className="font-medium">support@okpuja.com</span> or call us at <span className="font-medium">+91-9876543210</span>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
