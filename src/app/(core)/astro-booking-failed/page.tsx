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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        {loading ? (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Checking Payment Status...</h2>
            <p className="text-gray-600">Please wait while we verify your payment information.</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Error Header */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-8 text-white text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
              <p className="text-lg opacity-90">Your booking could not be completed</p>
              {merchantOrderId && (
                <p className="text-sm bg-white/20 rounded-full px-4 py-1 mt-3 inline-block">
                  Reference ID: {merchantOrderId}
                </p>
              )}
            </div>

            {/* Error Details */}
            <div className="px-6 py-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">What Happened?</h2>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700">{getUserFriendlyErrorMessage()}</p>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">What You Can Do Now</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      1
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700">Try booking again with a different payment method.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      2
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700">Check your payment method has sufficient funds.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      3
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700">Contact our support team if you need assistance.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
                <Link href="/astrology" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Back to Services
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
