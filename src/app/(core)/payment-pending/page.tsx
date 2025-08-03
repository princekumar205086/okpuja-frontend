"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import {
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaQuestionCircle,
  FaHome,
  FaShoppingCart,
  FaCreditCard,
  FaInfoCircle,
  FaExclamationTriangle,
  FaHeadset,
  FaSyncAlt,
  FaChevronRight,
  FaMobile,
  FaDesktop,
} from "react-icons/fa";
import Link from "next/link";
import { usePaymentStore } from '../../stores/paymentStore';
import { useBookingStore } from '../../stores/bookingStore';
import { useCartStore } from '../../stores/cartStore';
import { toast } from 'react-hot-toast';

const PaymentPending = () => {
  const searchParams = useSearchParams();
  const { checkPaymentStatus, checkCartPaymentStatus, verifyAndCompletePayment } = usePaymentStore();
  const { getBookingByCartId, getLatestBooking } = useBookingStore();
  const { fetchCartItems } = useCartStore();
  
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [statusCheckCount, setStatusCheckCount] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [manualVerifyLoading, setManualVerifyLoading] = useState(false);

  // Get URL parameters
  const paymentId = searchParams.get('payment_id'); // CART_xxx_xxx format
  const merchantOrderId = searchParams.get('merchant_order_id') || paymentId;
  const cartId = searchParams.get('cart_id') || 
                 sessionStorage.getItem('cart_id') || 
                 (paymentId ? paymentId.split('_')[1] : null); // Extract cart_id from payment_id
  const autoRefreshParam = searchParams.get('auto_refresh') === 'true';
  
  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto refresh logic
  useEffect(() => {
    if (!autoRefresh || !merchantOrderId) return;

    const checkPaymentStatusPeriodically = async () => {
      if (statusCheckCount >= 20) { // Stop after 20 attempts (10 minutes)
        setAutoRefresh(false);
        toast.error('Payment verification is taking longer than expected. Please try manual verification.');
        return;
      }

      setLoading(true);
      try {
        console.log(`Status check #${statusCheckCount + 1} for payment:`, merchantOrderId);

        // Method 1: Check by merchant order ID
        if (merchantOrderId) {
          const paymentStatus = await checkPaymentStatus(merchantOrderId);
          console.log('Payment status response:', paymentStatus);
          
          if (paymentStatus) {
            setPaymentData(paymentStatus);
            
            if (paymentStatus.status === 'SUCCESS') {
              toast.success('Payment successful! Redirecting to booking confirmation...');
              setTimeout(() => {
                window.location.href = `/confirmbooking?payment_id=${merchantOrderId}`;
              }, 2000);
              return;
            } else if (paymentStatus.status === 'FAILED') {
              toast.error('Payment failed. Redirecting to failure page...');
              setTimeout(() => {
                window.location.href = `/failedbooking?payment_id=${merchantOrderId}&status=failed`;
              }, 2000);
              return;
            }
          }
        }

        // Method 2: Check by cart ID if available
        if (cartId) {
          const cartPaymentStatus = await checkCartPaymentStatus(cartId);
          console.log('Cart payment status response:', cartPaymentStatus);
          
          if (cartPaymentStatus?.success && cartPaymentStatus?.data) {
            const { payment_status, booking_created, booking_id } = cartPaymentStatus.data;
            
            if (payment_status === 'SUCCESS' && booking_created) {
              toast.success('Payment completed and booking created! Redirecting...');
              setTimeout(() => {
                window.location.href = `/confirmbooking?cart_id=${cartId}`;
              }, 2000);
              return;
            } else if (payment_status === 'FAILED') {
              toast.error('Payment failed. Redirecting to failure page...');
              setTimeout(() => {
                window.location.href = `/failedbooking?cart_id=${cartId}&status=failed`;
              }, 2000);
              return;
            }
          }
        }

        setStatusCheckCount(prev => prev + 1);
      } catch (error) {
        console.error('Status check error:', error);
        setError('Unable to check payment status');
      } finally {
        setLoading(false);
      }
    };

    // Initial check immediately
    if (statusCheckCount === 0) {
      checkPaymentStatusPeriodically();
    }

    // Set up periodic checks (every 30 seconds)
    const interval = setInterval(checkPaymentStatusPeriodically, 30000);

    return () => clearInterval(interval);
  }, [statusCheckCount, autoRefresh, merchantOrderId, cartId, checkPaymentStatus, checkCartPaymentStatus]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleManualVerification = async () => {
    if (!cartId) {
      toast.error('Unable to verify payment: Cart ID not found');
      return;
    }

    setManualVerifyLoading(true);
    try {
      console.log('Manual verification for cart:', cartId);
      const result = await verifyAndCompletePayment(cartId);
      
      if (result?.success && result?.booking) {
        toast.success('Payment verified and booking created successfully!');
        setTimeout(() => {
          window.location.href = `/confirmbooking?cart_id=${cartId}`;
        }, 2000);
      } else if (result && 'already_processed' in result && result.booking) {
        toast.success('Booking already exists!');
        setTimeout(() => {
          window.location.href = `/confirmbooking?cart_id=${cartId}`;
        }, 2000);
      } else {
        toast.error(result?.message || 'Manual verification failed. Please contact support.');
      }
    } catch (error: any) {
      console.error('Manual verification error:', error);
      toast.error('Verification failed. Please try again or contact support.');
    } finally {
      setManualVerifyLoading(false);
    }
  };

  const handleRefreshStatus = () => {
    setStatusCheckCount(0);
    setAutoRefresh(true);
    setError('');
    toast('Refreshing payment status...');
  };

  const getStatusMessage = () => {
    if (timeElapsed < 60) {
      return "Processing your payment... This usually takes 30-60 seconds.";
    } else if (timeElapsed < 180) {
      return "Payment verification in progress... Sometimes this can take up to 3 minutes.";
    } else if (timeElapsed < 300) {
      return "Payment taking longer than usual... Our system is working to complete your transaction.";
    } else {
      return "Payment verification is taking longer than expected. You can try manual verification below.";
    }
  };

  const getProgressPercentage = () => {
    const maxTime = 300; // 5 minutes
    return Math.min((timeElapsed / maxTime) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header Space */}
      <div className="h-16 sm:h-20"></div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
        {/* Pending Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="relative inline-block mb-4 sm:mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 opacity-40 animate-pulse"></div>
            <div className="absolute inset-0 bg-blue-200 rounded-full scale-125 opacity-30 animate-ping"></div>
            <FaClock className="text-blue-600 text-5xl sm:text-6xl md:text-7xl mx-auto relative z-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Payment Processing
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl px-4 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Please wait while we confirm your payment with the bank. This usually takes just a moment.
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-4">
            <div className="bg-gray-200 rounded-full h-2 sm:h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 sm:h-3 rounded-full transition-all duration-1000"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Time elapsed: {formatTime(timeElapsed)}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl py-3 sm:py-4 px-4 sm:px-6 inline-block border border-blue-300 max-w-full">
            <p className="text-gray-700 text-sm sm:text-lg break-all">
              Payment ID: <span className="font-bold text-blue-700 text-sm sm:text-xl">{merchantOrderId || 'Processing...'}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column - Status & Progress */}
          <div className="space-y-4 sm:space-y-6">
            {/* Current Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FaSpinner className="text-blue-600 animate-spin" />
                </div>
                <span className="text-sm sm:text-2xl">Current Status</span>
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-start space-x-3">
                  <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-blue-800 font-semibold mb-1 text-sm sm:text-base">Payment Status</p>
                    <p className="text-blue-700 text-sm sm:text-base break-words">{getStatusMessage()}</p>
                  </div>
                </div>
              </div>

              {/* Status Checks */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                  <FaCheckCircle className="mr-2 text-gray-600" />
                  Verification Progress
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-600">Status Checks:</span>
                    <span className="text-gray-800 font-semibold">{statusCheckCount} / 20</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-600">Auto Refresh:</span>
                    <span className={`font-semibold ${autoRefresh ? 'text-green-600' : 'text-red-600'}`}>
                      {autoRefresh ? 'Active' : 'Stopped'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-600">Next Check:</span>
                    <span className="text-gray-800 font-semibold">
                      {autoRefresh ? '30 seconds' : 'Manual only'}
                    </span>
                  </div>
                  {cartId && (
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-gray-600">Cart ID:</span>
                      <span className="text-gray-800 font-mono text-xs break-all">{cartId.substring(0, 8)}...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* What's Happening */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
                <h4 className="font-medium text-green-800 mb-3 text-sm sm:text-base">What's Happening:</h4>
                <ul className="text-green-700 text-xs sm:text-sm space-y-1">
                  <li>• Verifying payment with PhonePe gateway</li>
                  <li>• Confirming transaction with your bank</li>
                  <li>• Preparing your booking confirmation</li>
                  <li>• Sending confirmation notifications</li>
                </ul>
              </div>
            </div>

            {/* Payment Details (if available) */}
            {paymentData && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <FaCreditCard className="text-orange-600" />
                  </div>
                  <span className="text-sm sm:text-2xl">Payment Details</span>
                </h2>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="text-gray-600 text-sm sm:text-base">Transaction ID:</span>
                    <span className="font-mono text-gray-800 text-xs sm:text-sm break-all">{paymentData.transaction_id}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="text-gray-600 text-sm sm:text-base">Amount:</span>
                    <span className="text-gray-800 font-semibold text-sm sm:text-base">₹{paymentData.amount}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="text-gray-600 text-sm sm:text-base">Status:</span>
                    <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm font-medium">
                      {paymentData.status_display || 'Processing'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="text-gray-600 text-sm sm:text-base">Date:</span>
                    <span className="text-gray-800 text-sm sm:text-base">{new Date(paymentData.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions & Support */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <FaSyncAlt className="text-green-600" />
                </div>
                <span className="text-sm sm:text-2xl">Quick Actions</span>
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={handleRefreshStatus}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 sm:p-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-3"
                >
                  <FaSyncAlt className="text-base sm:text-lg" />
                  <span className="font-semibold text-sm sm:text-base">Refresh Status</span>
                </button>

                {timeElapsed > 120 && (
                  <button
                    onClick={handleManualVerification}
                    disabled={manualVerifyLoading || !cartId}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-3 sm:p-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    {manualVerifyLoading ? (
                      <>
                        <FaSpinner className="animate-spin text-base sm:text-lg" />
                        <span className="font-semibold text-sm sm:text-base">Verifying...</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="text-base sm:text-lg" />
                        <span className="font-semibold text-sm sm:text-base">Manual Verification</span>
                      </>
                    )}
                  </button>
                )}

                <Link
                  href="/cart"
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white p-3 sm:p-4 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-3"
                >
                  <FaShoppingCart className="text-base sm:text-lg" />
                  <span className="font-semibold text-sm sm:text-base">Back to Cart</span>
                </Link>
              </div>
            </div>

            {/* Support Options */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <FaHeadset className="text-purple-600" />
                </div>
                <span className="text-sm sm:text-2xl">Need Help?</span>
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="w-full bg-orange-50 border-2 border-orange-200 p-3 sm:p-4 rounded-xl hover:bg-orange-100 hover:border-orange-300 transition-all duration-300 flex items-center space-x-3"
                >
                  <div className="bg-orange-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                    <FaPhoneAlt className="text-orange-600 text-sm sm:text-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-orange-600 font-semibold text-sm sm:text-base">Call Support</p>
                    <p className="text-gray-600 text-xs sm:text-sm">+91-XXXXX-XXXXX</p>
                  </div>
                </a>

                <a
                  href="mailto:support@okpuja.com"
                  className="w-full bg-blue-50 border-2 border-blue-200 p-3 sm:p-4 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 flex items-center space-x-3"
                >
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                    <FaEnvelope className="text-blue-600 text-sm sm:text-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-blue-600 font-semibold text-sm sm:text-base">Email Support</p>
                    <p className="text-gray-600 text-xs sm:text-sm break-all">support@okpuja.com</p>
                  </div>
                </a>

                <Link
                  href="/payment-debug"
                  className="w-full bg-purple-50 border-2 border-purple-200 p-3 sm:p-4 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition-all duration-300 flex items-center space-x-3"
                >
                  <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                    <FaQuestionCircle className="text-purple-600 text-sm sm:text-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-purple-600 font-semibold text-sm sm:text-base">Payment Debug</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Check payment status</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Device-Specific Tips */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-4 sm:p-6 border-2 border-yellow-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <FaInfoCircle className="text-yellow-600 mr-3" />
                <span className="text-sm sm:text-xl">Helpful Tips</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-xs sm:text-sm">Keep this page open while we process your payment</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-xs sm:text-sm">Don't refresh or close this page during processing</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-xs sm:text-sm">Payment verification typically takes 30-60 seconds</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-xs sm:text-sm">If taking longer, try manual verification after 2 minutes</p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6">
                <div className="flex items-start space-x-3">
                  <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-red-800 font-semibold mb-1 text-sm sm:text-base">Error</p>
                    <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-Specific Footer Actions */}
        <div className="block sm:hidden mt-6 space-y-3">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FaMobile className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Mobile Optimized</p>
                  <p className="text-gray-600 text-xs">Real-time updates</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaSpinner className="text-blue-600 animate-spin" />
                <span className="text-xs text-gray-600">Processing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8 py-4">
          © {new Date().getFullYear()} OKPUJA. All rights reserved. | Secure payment processing powered by PhonePe
        </div>
      </main>
    </div>
  );
};

export default PaymentPending;