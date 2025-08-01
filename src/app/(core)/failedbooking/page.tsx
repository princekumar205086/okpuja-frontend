"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import {
  FaTimesCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaQuestionCircle,
  FaLongArrowAltLeft,
  FaSyncAlt,
  FaExclamationTriangle,
  FaHeadset,
  FaSpinner,
  FaHome,
  FaShoppingCart,
  FaCreditCard,
  FaInfoCircle,
} from "react-icons/fa";
import Link from "next/link";
import { usePaymentStore } from '../../stores/paymentStore';
import { useBookingStore } from '../../stores/bookingStore';
import { useCartStore } from '../../stores/cartStore';
import { toast } from 'react-hot-toast';

const BookingFailed = () => {
  const searchParams = useSearchParams();
  const { checkPaymentStatus, retryWebhookForPayment } = usePaymentStore();
  const { getBookingByBookId } = useBookingStore();
  const { fetchCartItems } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string>('');

  // Get URL parameters - support both old and new URL formats
  const paymentId = searchParams.get('payment_id');
  const bookId = searchParams.get('book_id');
  const transactionId = searchParams.get('transaction_id');
  const status = searchParams.get('status');
  const errorCode = searchParams.get('error_code') || searchParams.get('code');
  const message = searchParams.get('message');
  
  // Get merchant order ID from session storage or URL params
  const merchantOrderId = searchParams.get('merchant_order_id') || 
                          sessionStorage.getItem('merchant_order_id') || 
                          null;

  useEffect(() => {
    const handleFailureCheck = async () => {
      setLoading(true);
      try {
        // If we have a book_id, try to fetch booking details
        if (bookId) {
          const booking = await getBookingByBookId(bookId);
          if (booking) {
            setBookingData(booking);
            // If booking exists and payment is successful, redirect to success page
            if ((booking as any)?.payment?.status === 'SUCCESS' || (booking as any)?.payment?.status === 'COMPLETED') {
              toast.success('Booking was actually successful! Redirecting...');
              setTimeout(() => {
                window.location.href = `/confirmbooking?book_id=${bookId}`;
              }, 2000);
              return;
            }
          }
        }

        // If we have a merchant_order_id, check payment status with new API
        if (merchantOrderId) {
          const payment = await checkPaymentStatus(merchantOrderId);
          if (payment) {
            setPaymentData(payment);
            // If payment is actually successful, redirect to success page
            if (payment.status === 'SUCCESS') {
              toast.success('Payment was actually successful! Redirecting...');
              setTimeout(() => {
                window.location.href = `/confirmbooking?merchant_order_id=${merchantOrderId}`;
              }, 2000);
              return;
            }
          }
        }
        // Fallback: If we have a payment_id but no merchant_order_id (old flow)
        else if (paymentId) {
          // For backward compatibility, we'll try to find payment info
          // This might not work with the new API structure
          console.warn('Using legacy payment_id without merchant_order_id');
          // You might want to implement a migration strategy here
        }

        // Restore cart items (in case they were cleared prematurely)
        await fetchCartItems();
      } catch (error) {
        console.error('Error checking failure status:', error);
        setError('Failed to load details');
      } finally {
        setLoading(false);
      }
    };

    if (bookId || paymentId) {
      handleFailureCheck();
    } else {
      setLoading(false);
      setError('No booking or payment reference found');
    }

    // Clean URL params without page reload after a delay
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [paymentId, bookId, checkPaymentStatus, getBookingByBookId, fetchCartItems]);

  const formatAmount = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(numAmount);
  };

  const getDisplayBookingId = () => {
    if (bookingData?.book_id) return bookingData.book_id;
    if (paymentData?.id) return `OKPAY${paymentData.id}`;
    if (bookId) return bookId;
    if (paymentId) return `OKPAY${paymentId}`;
    return "OKREF123456";
  };

  const getFailureReason = () => {
    // Check if we have booking data with payment info
    if (bookingData?.payment?.status) {
      const paymentStatus = bookingData.payment.status;
      switch (paymentStatus) {
        case 'FAILED':
          return "Payment processing failed";
        case 'CANCELLED':
          return "Payment was cancelled";
        case 'PENDING':
          return "Payment is still being processed";
        case 'DECLINED':
          return "Payment was declined by the bank";
        default:
          return "Payment could not be completed";
      }
    }

    // Fallback to URL parameters
    if (message) return message;
    
    switch (errorCode || status) {
      case 'PAYMENT_FAILED':
      case 'FAILED':
        return "Your payment could not be processed at this time";
      case 'PAYMENT_DECLINED':
        return "Your payment was declined by the bank";
      case 'TRANSACTION_FAILED':
        return "The transaction was declined by the payment provider";
      case 'SERVER_ERROR':
        return "Our server encountered an issue while processing your booking";
      case 'TIMEOUT':
        return "The payment request timed out";
      case 'INSUFFICIENT_FUNDS':
        return "The transaction was declined due to insufficient funds";
      case 'NETWORK_ERROR':
        return "Network connection issue occurred during payment";
      case 'INVALID_CARD':
        return "Invalid card details provided";
      case 'CANCELLED':
        return "Payment was cancelled by user";
      case 'PENDING':
        return "Payment is still being processed";
      default:
        return "We were unable to complete your booking request";
    }
  };

  const handleRetryPayment = async () => {
    // First try webhook retry if we have a payment ID
    if (paymentId && !retrying) {
      setRetrying(true);
      try {
        const retryResult = await retryWebhookForPayment(parseInt(paymentId));
        if (retryResult && retryResult.success) {
          toast.success('Payment verification successful! Redirecting...');
          setTimeout(() => {
            window.location.href = `/confirmbooking?payment_id=${paymentId}`;
          }, 2000);
          return;
        }
      } catch (error) {
        console.error('Retry failed:', error);
        toast.error('Retry failed. Please try a new payment.');
      }
      setRetrying(false);
    }
    
    // Go back to checkout for new payment attempt
    window.location.href = '/checkout';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Checking Status</h2>
          <p className="text-gray-500">Please wait while we verify the payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100">
      {/* Header Space */}
      <div className="h-20"></div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* Failure Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full scale-150 opacity-40 animate-pulse"></div>
            <div className="absolute inset-0 bg-red-200 rounded-full scale-125 opacity-30 animate-ping"></div>
            <FaTimesCircle className="text-red-600 text-6xl md:text-7xl mx-auto relative z-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold  mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Booking Failed
          </h1>
          <p className="text-gray-600 text-lg md:text-xl px-4 mb-6 max-w-2xl mx-auto">
            We apologize for the inconvenience. Don't worry - your cart is still saved and you can try again.
          </p>
          <div className="bg-gradient-to-r from-red-100 to-red-200 rounded-xl py-4 px-6 inline-block border border-red-300">
            <p className="text-gray-700 text-lg">
              Reference ID: <span className="font-bold text-red-700 text-xl">{getDisplayBookingId()}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Error Details */}
          <div className="space-y-6">
            {/* Error Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <FaExclamationTriangle className="text-red-600" />
                </div>
                What Happened?
              </h2>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <FaInfoCircle className="text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-semibold mb-1">Failure Reason</p>
                    <p className="text-red-700">{getFailureReason()}</p>
                  </div>
                </div>
              </div>

              {/* Booking/Payment Details */}
              {(bookingData || paymentData) && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <FaCreditCard className="mr-2 text-gray-600" />
                    Transaction Details
                  </h3>
                  <div className="space-y-3">
                    {bookingData && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Booking ID:</span>
                          <span className="font-mono text-gray-800 font-semibold">{bookingData.book_id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Amount:</span>
                          <span className="text-gray-800 font-semibold">₹{bookingData.total_amount}</span>
                        </div>
                        {bookingData.payment?.transaction_id && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Transaction ID:</span>
                            <span className="font-mono text-gray-800 text-sm">{bookingData.payment.transaction_id}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Status:</span>
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            {bookingData.payment?.status || 'Failed'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Date:</span>
                          <span className="text-gray-800">{new Date(bookingData.created_at).toLocaleDateString()}</span>
                        </div>
                      </>
                    )}
                    {paymentData && !bookingData && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Amount:</span>
                          <span className="text-gray-800 font-semibold">{formatAmount(paymentData.amount)}</span>
                        </div>
                        {paymentData.transaction_id && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Transaction ID:</span>
                            <span className="font-mono text-gray-800 text-sm">{paymentData.transaction_id}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Status:</span>
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            {paymentData.status_display || 'Failed'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Date:</span>
                          <span className="text-gray-800">{new Date(paymentData.created_at).toLocaleDateString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Common Causes */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-800 mb-3">Common Causes:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Temporary payment gateway issues</li>
                  <li>• Network connectivity problems</li>
                  <li>• Insufficient funds or daily limit exceeded</li>
                  <li>• Bank security restrictions</li>
                  <li>• Session timeout during payment</li>
                  <li>• Card expired or blocked</li>
                </ul>
              </div>
            </div>

            {/* Service Details (if available) */}
            {bookingData?.cart && (
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <FaInfoCircle className="text-orange-600" />
                  </div>
                  Service Details
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaQuestionCircle className="text-orange-500" />
                      <span className="text-gray-500 text-sm font-medium">Puja Service</span>
                    </div>
                    <p className="text-gray-800 font-semibold ml-6">{bookingData.cart.puja_service?.title || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <FaSpinner className="text-blue-500" />
                        <span className="text-gray-500 text-sm font-medium">Date</span>
                      </div>
                      <p className="text-gray-800 font-semibold ml-6">{new Date(bookingData.selected_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <FaSpinner className="text-green-500" />
                        <span className="text-gray-500 text-sm font-medium">Time</span>
                      </div>
                      <p className="text-gray-800 font-semibold ml-6">{bookingData.selected_time}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Action Items */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <FaSyncAlt className="text-green-600" />
                </div>
                Quick Actions
              </h2>
              <div className="space-y-4">
                <button
                  onClick={handleRetryPayment}
                  disabled={retrying}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                >
                  {retrying ? (
                    <>
                      <FaSpinner className="animate-spin text-lg" />
                      <span className="font-semibold">Retrying Payment...</span>
                    </>
                  ) : (
                    <>
                      <FaSyncAlt className="text-lg" />
                      <span className="font-semibold">Try Payment Again</span>
                    </>
                  )}
                </button>

                <Link
                  href="/cart"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-3"
                >
                  <FaShoppingCart className="text-lg" />
                  <span className="font-semibold">Review Cart</span>
                </Link>

                <Link
                  href="/"
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-3"
                >
                  <FaHome className="text-lg" />
                  <span className="font-semibold">Browse Services</span>
                </Link>
              </div>
            </div>

            {/* Support Options */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <FaHeadset className="text-purple-600" />
                </div>
                Need Help?
              </h2>
              <div className="space-y-4">
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="w-full bg-orange-50 border-2 border-orange-200 p-4 rounded-xl hover:bg-orange-100 hover:border-orange-300 transition-all duration-300 flex items-center space-x-3"
                >
                  <div className="bg-orange-100 p-3 rounded-full">
                    <FaPhoneAlt className="text-orange-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-orange-600 font-semibold">Call Support</p>
                    <p className="text-gray-600 text-sm">+91-XXXXX-XXXXX</p>
                  </div>
                </a>

                <a
                  href="mailto:support@okpuja.com"
                  className="w-full bg-blue-50 border-2 border-blue-200 p-4 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 flex items-center space-x-3"
                >
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaEnvelope className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-blue-600 font-semibold">Email Support</p>
                    <p className="text-gray-600 text-sm">support@okpuja.com</p>
                  </div>
                </a>

                <Link
                  href="/faq"
                  className="w-full bg-purple-50 border-2 border-purple-200 p-4 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition-all duration-300 flex items-center space-x-3"
                >
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaQuestionCircle className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-purple-600 font-semibold">View FAQs</p>
                    <p className="text-gray-600 text-sm">Find quick answers</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Reassurance Card */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaInfoCircle className="text-blue-600 mr-3" />
                Don't Worry!
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">Your cart items are safely saved</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">No charges were made to your account</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">You can retry payment anytime</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">Our support team is here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8 py-4">
          © {new Date().getFullYear()} OKPUJA. All rights reserved. | We're here to help with your spiritual journey
        </div>
      </main>
    </div>
  );
};

export default BookingFailed;
