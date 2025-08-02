"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from 'next/navigation';
import {
  FaCheckCircle,
  FaDownload,
  FaShare,
  FaPhoneAlt,
  FaEnvelope,
  FaQuestionCircle,
  FaClock,
  FaMapMarkerAlt,
  FaLanguage,
  FaUser,
  FaMobile,
  FaEnvelopeOpen,
  FaLocationArrow,
  FaMapPin,
  FaSpinner,
  FaCalendarAlt,
  FaRupeeSign,
  FaHome,
} from "react-icons/fa";
import { useBookingStore } from '../../stores/bookingStore';
import { usePaymentStore } from '../../stores/paymentStore';
import { jsPDF } from "jspdf";
import Loader from "@/app/utils/loader";
import Link from "next/link";
import { toast } from 'react-hot-toast';

const BookingSuccess = () => {
  const searchParams = useSearchParams();
  const { getBookingByBookId, getBookingByCartId, getLatestBooking } = useBookingStore();
  const { checkCartPaymentStatus, verifyAndCompletePayment } = usePaymentStore();
  
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [showManualVerification, setShowManualVerification] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Memoize URL parameter parsing to prevent recalculation on every render
  const urlParams = useMemo(() => {
    if (typeof window === 'undefined') return { allKeys: [], emptyKeyValue: null };
    const params = new URLSearchParams(window.location.search);
    return {
      allKeys: Array.from(params.keys()),
      emptyKeyValue: params.get('') // Check for malformed ?=value
    };
  }, []);

  // Get parameters from URL - support multiple formats
  const bookIdParam = searchParams.get('book_id'); // Old format
  const bookingIdParam = searchParams.get('booking_id'); // NEW format (BK-DAFB33E3)
  const cartIdParam = searchParams.get('cart_id'); // Cart format
  const paymentIdParam = searchParams.get('payment_id');
  const statusParam = searchParams.get('status');
  const merchantOrderIdParam = searchParams.get('order_id') || searchParams.get('merchant_order_id');
  
  // Get merchant order ID and cart ID from session storage for backup lookup
  const sessionMerchantOrderId = typeof window !== 'undefined' ? 
    sessionStorage.getItem('merchant_order_id') : null;
  const sessionCartId = typeof window !== 'undefined' ? 
    sessionStorage.getItem('cart_id') : null;
  
  // Determine the booking lookup method from various sources (NEW: prioritize booking_id)
  const bookingId = bookingIdParam; // Direct booking ID (BK-format)
  const bookId = bookIdParam || urlParams.emptyKeyValue || paymentIdParam; // Legacy formats
  const cartId = cartIdParam || sessionCartId;
  const merchantOrderId = merchantOrderIdParam || sessionMerchantOrderId;

  useEffect(() => {
    // Prevent multiple API calls if we already have booking details or have attempted fetch
    if (bookingDetails || hasAttemptedFetch) {
      console.log('Skipping fetch - already have data or attempted:', { 
        hasBookingDetails: !!bookingDetails, 
        hasAttemptedFetch 
      });
      return;
    }

    const fetchBookingData = async () => {
      console.log('🚀 Starting booking data fetch...');
      console.log('URL search params:', window.location.search);
      console.log('bookingId:', bookingId, 'cartId:', cartId, 'bookId:', bookId);

      // Mark that we've attempted to fetch
      setHasAttemptedFetch(true);
      setLoading(true);
      setError('');

      // PRIORITY 1: Direct booking ID fetch (NEW FORMAT: booking_id=BK-DAFB33E3)
      if (bookingId) {
        console.log('✅ Priority 1: Fetching by booking_id:', bookingId);
        try {
          const booking = await getBookingByBookId(bookingId);
          if (booking) {
            console.log('🎉 Booking found by booking_id:', booking);
            setBookingDetails(booking);
            toast.success('Booking details loaded successfully!');
            setLoading(false);
            return; // Success!
          }
        } catch (error) {
          console.error('Error fetching booking by booking_id:', error);
          setError(`Unable to find booking with ID: ${bookingId}`);
          setLoading(false);
          return;
        }
      }

      // PRIORITY 2: Cart ID fetch (for payment completion flow)
      if (cartId) {
        console.log('✅ Priority 2: Checking cart-based booking...');
        try {
          const booking = await getBookingByCartId(cartId);
          if (booking) {
            console.log('🎉 Booking found by cart_id:', booking);
            setBookingDetails(booking);
            toast.success('Booking details loaded successfully!');
            setLoading(false);
            return; // Success!
          } else {
            console.log('No booking found for cart_id, checking payment status...');
          }
        } catch (error) {
          console.error('Error fetching booking by cart_id:', error);
        }

        // If no booking found for cart_id, check payment status for auto-completion
        console.log('⏳ Checking payment status for automatic completion...');
        try {
          const paymentStatus = await checkCartPaymentStatus(cartId);
          console.log('Payment status response:', paymentStatus);

          if (paymentStatus?.success && paymentStatus?.data) {
            const { payment_status, booking_created, booking_id } = paymentStatus.data;

            if (payment_status === 'SUCCESS' && booking_created) {
              // Payment completed and booking created automatically
              console.log('🎊 Payment completed automatically with booking!');
              
              // Try to get the booking details again
              try {
                const booking = await getBookingByCartId(cartId);
                if (booking) {
                  setBookingDetails(booking);
                  toast.success('Payment completed and booking created automatically!');
                  setLoading(false);
                  return;
                }
              } catch (bookingError) {
                console.log('Booking created but fetching details failed, will retry...');
              }
            } else if (payment_status === 'SUCCESS' && !booking_created) {
              console.log('💰 Payment completed, booking creation in progress...');
              setError('Payment successful! Our system is automatically creating your booking...');
              
              if (retryCount < 3) {
                setTimeout(() => {
                  setRetryCount(prev => prev + 1);
                  setHasAttemptedFetch(false);
                }, 5000);
                setLoading(false);
                return;
              }
            } else if (payment_status === 'INITIATED') {
              console.log('🔄 Payment being processed by automatic system...');
              setError('Payment received! Our automated system is verifying and completing your booking...');
              
              if (retryCount < 8) {
                const delay = Math.min(30000 + (retryCount * 10000), 60000);
                setTimeout(() => {
                  setRetryCount(prev => prev + 1);
                  setHasAttemptedFetch(false);
                }, delay);
                setLoading(false);
                return;
              } else {
                setShowManualVerification(true);
                setError('Our automatic verification is taking longer than expected. You can verify manually below.');
                setLoading(false);
                return;
              }
            } else if (payment_status === 'FAILED') {
              setError(`Payment failed. Please try again or contact support.`);
              setLoading(false);
              return;
            }
          }
        } catch (paymentError) {
          console.error('Error checking payment status:', paymentError);
          setError('Unable to check payment status. Our background system may still be processing.');
          
          if (retryCount < 3) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              setHasAttemptedFetch(false);
            }, 10000);
          } else {
            setShowManualVerification(true);
          }
          setLoading(false);
          return;
        }
      }

      // PRIORITY 3: Legacy book_id fetch (OLD FORMAT)
      if (bookId) {
        console.log('✅ Priority 3: Fetching by legacy book_id:', bookId);
        try {
          const booking = await getBookingByBookId(bookId);
          if (booking) {
            console.log('🎉 Booking found by legacy book_id:', booking);
            setBookingDetails(booking);
            toast.success('Booking details loaded successfully!');
            setLoading(false);
            return; // Success!
          }
        } catch (error) {
          console.error('Error fetching booking by legacy book_id:', error);
        }
      }

      // PRIORITY 4: Final fallback - try latest booking
      console.log('🔍 Priority 4: Trying latest booking as fallback...');
      try {
        const latestBooking = await getLatestBooking();
        if (latestBooking) {
          console.log('Found latest booking:', latestBooking);
          setBookingDetails(latestBooking);
          toast.success('Found your latest booking!');
          setLoading(false);
          return;
        }
      } catch (latestError) {
        console.error('Error getting latest booking:', latestError);
      }

      // If we reach here, no booking was found
      if (bookingId) {
        setError(`Booking not found with ID: ${bookingId}. Please check the booking ID or contact support.`);
      } else if (cartId) {
        setError('🤖 Payment processing... Our automated system is running and will complete your payment within 1-2 minutes.');
        setShowManualVerification(true);
      } else {
        setError('No booking ID or cart ID provided. Please check the URL or contact support.');
      }
      setLoading(false);
    };

    fetchBookingData();
  }, [
    bookingId,
    cartId,
    bookId,
    retryCount,
    hasAttemptedFetch,
    bookingDetails,
    getBookingByBookId,
    getBookingByCartId,
    getLatestBooking,
    checkCartPaymentStatus
  ]);

  const handleDownloadReceipt = () => {
    if (!bookingDetails) return;

    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("OKPUJA Service Booking Invoice", 20, 20);

    // Booking Details Section
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Booking ID: ${bookingDetails.book_id}`, 20, 40);
    doc.text(`Transaction ID: ${bookingDetails.payment?.transaction_id || 'N/A'}`, 20, 50);
    doc.text(`Payment Status: ${bookingDetails.payment?.status || 'N/A'}`, 20, 60);

    // Payment Information Section
    doc.setFont("helvetica", "bold");
    doc.text("Payment Information", 20, 75);
    doc.setFont("helvetica", "normal");
    doc.text(`Amount Paid: ₹${bookingDetails.total_amount}`, 20, 85);
    doc.text(`Payment Method: ${bookingDetails.payment?.payment_method || "PhonePe"}`, 20, 95);
    doc.text(`Payment Date: ${new Date(bookingDetails.created_at).toLocaleString()}`, 20, 105);

    // Service Details Section
    doc.setFont("helvetica", "bold");
    doc.text("Service Details", 20, 120);
    doc.setFont("helvetica", "normal");
    doc.text(`Puja Name: ${bookingDetails.cart?.puja_service?.title || 'N/A'}`, 20, 130);
    doc.text(`Date & Time: ${new Date(bookingDetails.selected_date).toLocaleDateString()} | ${bookingDetails.selected_time}`, 20, 140);
    doc.text(`Location: ${bookingDetails.cart?.package?.location || 'N/A'}`, 20, 150);
    doc.text(`Language: ${bookingDetails.cart?.package?.language || 'N/A'}`, 20, 160);
    
    if (bookingDetails.cart?.package?.description) {
      const div = document.createElement("div");
      div.innerHTML = bookingDetails.cart.package.description;
      doc.text("Package Details:", 20, 170);
      doc.text(div.textContent || "", 20, 180);
    }

    // User Information Section
    doc.setFont("helvetica", "bold");
    doc.text("User Information", 110, 75);
    doc.setFont("helvetica", "normal");
    doc.text(`User Name: ${bookingDetails.user?.username || bookingDetails.user?.email || 'N/A'}`, 110, 85);
    doc.text(`Email: ${bookingDetails.user?.email || 'N/A'}`, 110, 95);
    doc.text(`Mobile: ${bookingDetails.user?.phone || 'N/A'}`, 110, 105);

    // Address Information Section
    doc.setFont("helvetica", "bold");
    doc.text("Address Information", 110, 120);
    doc.setFont("helvetica", "normal");
    const address = bookingDetails.address;
    if (address) {
      doc.text(`Address: ${address.address_line1 || ''}, ${address.city || ''}, ${address.state || ''}, ${address.country || ''}, ${address.postal_code || ''}`, 110, 130);
      if (address.address_line2) {
        doc.text(`Landmark: ${address.address_line2}`, 110, 140);
      }
    }

    // Footer Section
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing OKPUJA!", 20, 220);
    doc.text("For any inquiries, please contact our support team.", 20, 230);

    // Save the file
    doc.save(`OKPUJA_Booking_${bookingDetails.book_id}.pdf`);
  };

  // Manual verification handler - backup for automatic system
  const handleManualVerification = async (paymentSuccessful: boolean) => {
    if (!paymentSuccessful) {
      setError('Payment was not successful. Please try again or contact support.');
      setShowManualVerification(false);
      return;
    }

    if (!cartId) {
      setError('Cart ID is missing. Cannot verify payment.');
      setShowManualVerification(false);
      return;
    }

    setLoading(true);
    setShowManualVerification(false);
    setError('🔄 Manually verifying payment with our automatic completion system...');
    
    try {
      // Note: This now works with the backend's automatic completion system
      // The server will automatically verify with PhonePe and complete the payment
      const result = await verifyAndCompletePayment(cartId);
      
      if (result?.success && result?.booking) {
        console.log('✅ Manual verification successful, payment completed automatically:', result);
        setBookingDetails(result.booking);
        toast.success('Payment verified and completed automatically by our system!');
        setError('');
      } else if (result && 'already_processed' in result && result.booking) {
        // Handle the case where payment was already processed
        setBookingDetails(result.booking);
        toast.success('Booking already exists!');
        setError('');
      } else {
        setError(`Manual verification completed: ${result?.message || 'Our automatic background system will continue processing your payment.'}`);
      }
    } catch (error: any) {
      console.error('Manual verification error:', error);
      setError(`Manual verification failed: ${error.message || 'Network error'}. Don't worry - our automatic background system is still processing your payment.`);
    } finally {
      setLoading(false);
    }
  };

  const handleShareDetails = () => {
    if (!bookingDetails) return;

    const shareData = {
      title: "Puja Booking Details",
      text: `Puja Booking ID: ${bookingDetails.book_id}\nTransaction ID: ${bookingDetails.payment?.transaction_id || 'N/A'}\nAmount Paid: ₹${bookingDetails.total_amount}\nPayment Status: ${bookingDetails.payment?.status || 'N/A'}`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = shareData.text + '\n' + shareData.url;
      navigator.clipboard.writeText(shareText).then(() => {
        toast.success('Booking details copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy details');
      });
    }
  };

  // Determine package details based on package type
  const getPackageDetails = () => {
    const packageType = bookingDetails?.cart?.package?.package_type;
    switch (packageType) {
      case "Basic":
        return { pandits: 1, duration: "1.5 hrs" };
      case "Standard":
        return { pandits: 2, duration: "2 hrs - 2.5 hrs" };
      case "Premium":
        return { pandits: "3-5", duration: "2.5 hrs - 3.5 hrs" };
      default:
        return { pandits: 1, duration: "1.5 hrs" };
    }
  };

  const packageDetails = getPackageDetails();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="text-center p-8">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">🤖 Automatic Processing</h2>
          <p className="text-gray-500">Our automated system is verifying your payment and creating your booking...</p>
          <p className="text-sm text-gray-400 mt-2">⏰ This usually takes 30-60 seconds</p>
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <FaQuestionCircle className="text-orange-600 text-6xl mb-6 mx-auto" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {showManualVerification ? 'Payment Verification' : 'Booking Not Found'}
          </h1>
          <p className="text-gray-600 text-md md:text-lg mb-6">
            {showManualVerification 
              ? '🤖 Our automatic system is processing your payment in the background. If you completed payment on PhonePe, you can verify manually as a backup:' 
              : (error || "We couldn't retrieve your booking details. Our automatic system may still be processing your payment.")
            }
          </p>
          
          {showManualVerification ? (
            // Manual Verification UI (Backup for Automatic System)
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>💡 Note:</strong> Our automatic background service is running and will complete your payment within 1-2 minutes. Manual verification is just a backup option.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleManualVerification(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                >
                  <FaCheckCircle className="mr-2" />
                  ✅ Yes, Payment Successful (Manual Verify)
                </button>
                <button
                  onClick={() => handleManualVerification(false)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                >
                  <FaQuestionCircle className="mr-2" />
                  ❌ No, Payment Failed
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  🔄 Refresh & Check Auto-Completion
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                ⏰ <strong>Automatic Processing:</strong> Our system checks every 30-60 seconds. You can also refresh this page to check if payment was completed automatically.
              </p>
            </div>
          ) : (
            // Regular Error UI
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors text-center font-medium"
              >
                <FaHome className="inline mr-2" />
                Return Home
              </Link>
              <a
                href="tel:+91XXXXXXXXXX"
                className="bg-white border-2 border-orange-600 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors text-center font-medium"
              >
                <FaPhoneAlt className="inline mr-2" />
                Contact Support
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header Space */}
      <div className="h-20"></div>
      
      {/* Status=completed detection banner */}
      {statusParam === 'completed' && !bookingDetails && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>🤖 Automatic Payment Processing!</strong> Our automated system is verifying and completing your payment with PhonePe...
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Background service runs every 30-60 seconds. No action needed from you!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* Success Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 opacity-40 animate-pulse"></div>
            <div className="absolute inset-0 bg-green-200 rounded-full scale-125 opacity-30 animate-ping"></div>
            <FaCheckCircle className="text-green-600 text-6xl md:text-7xl mx-auto relative z-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 text-lg md:text-xl px-4 mb-6">
            Thank you for choosing OKPUJA. We're honored to serve you on this auspicious occasion.
          </p>
          <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl py-4 px-6 inline-block border border-orange-300">
            <p className="text-gray-700 text-lg">
              Booking ID: <span className="font-bold text-orange-700 text-xl">{bookingDetails.book_id}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking & Payment Details */}
          <div className="space-y-6">
            {/* Transaction Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <FaRupeeSign className="text-orange-600" />
                </div>
                Payment Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <FaCheckCircle className="text-green-500" />,
                    label: "Booking ID",
                    value: bookingDetails.book_id,
                  },
                  {
                    icon: <FaClock className="text-blue-500" />,
                    label: "Transaction ID",
                    value: bookingDetails.payment?.transaction_id || 'N/A',
                  },
                  {
                    icon: <FaRupeeSign className="text-green-500" />,
                    label: "Amount Paid",
                    value: `₹${bookingDetails.total_amount}`,
                  },
                  {
                    icon: <FaShare className="text-purple-500" />,
                    label: "Payment Method",
                    value: bookingDetails.payment?.payment_method || "PhonePe",
                  },
                  {
                    icon: <FaClock className="text-blue-500" />,
                    label: "Payment Date",
                    value: new Date(bookingDetails.created_at).toLocaleDateString(),
                  },
                  {
                    icon: <FaCheckCircle className="text-green-500" />,
                    label: "Payment Status",
                    value: bookingDetails.payment?.status || 'Completed',
                    valueClass: "text-green-600 font-semibold",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">{item.icon}</span>
                      <p className="text-gray-500 text-sm font-medium">{item.label}</p>
                    </div>
                    <p className={`text-gray-800 font-semibold ${item.valueClass || ""}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <FaCalendarAlt className="text-orange-600" />
                </div>
                Service Details
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: <FaCheckCircle className="text-orange-500" />,
                    label: "Puja Name",
                    value: bookingDetails.cart?.puja_service?.title || 'N/A',
                  },
                  {
                    icon: <FaClock className="text-orange-500" />,
                    label: "Date & Time",
                    value: `${new Date(bookingDetails.selected_date).toLocaleDateString()} at ${bookingDetails.selected_time}`,
                  },
                  {
                    icon: <FaMapMarkerAlt className="text-orange-500" />,
                    label: "Location",
                    value: bookingDetails.cart?.package?.location || 'N/A',
                  },
                  {
                    icon: <FaLanguage className="text-orange-500" />,
                    label: "Language",
                    value: bookingDetails.cart?.package?.language || 'N/A',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="mt-1 text-lg">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-gray-500 text-sm font-medium mb-1">{item.label}</p>
                        <p className="text-gray-800 font-semibold">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Package Description */}
                {bookingDetails.cart?.package?.description && (
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-start space-x-3">
                      <FaCheckCircle className="text-orange-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-gray-500 text-sm font-medium mb-2">Package Details</p>
                        <div
                          className="text-gray-800 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: bookingDetails.cart.package.description,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Package Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <FaUser className="text-blue-600" />
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Pandits</p>
                        <p className="text-blue-800 font-bold">{packageDetails.pandits}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center space-x-3">
                      <FaClock className="text-green-600" />
                      <div>
                        <p className="text-green-600 text-sm font-medium">Duration</p>
                        <p className="text-green-800 font-bold">{packageDetails.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - User & Address Details */}
          <div className="space-y-6">
            {/* User Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FaUser className="text-blue-600" />
                </div>
                Contact Information
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: <FaUser className="text-blue-500" />,
                    label: "Name",
                    value: bookingDetails.user?.username || bookingDetails.user?.email || 'N/A',
                  },
                  {
                    icon: <FaMobile className="text-green-500" />,
                    label: "Mobile",
                    value: bookingDetails.user?.phone || 'N/A',
                  },
                  {
                    icon: <FaEnvelopeOpen className="text-purple-500" />,
                    label: "Email",
                    value: bookingDetails.user?.email || 'N/A',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-gray-500 text-sm font-medium">{item.label}</p>
                        <p className="text-gray-800 font-semibold">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Details Card */}
            {bookingDetails.address && (
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <FaMapPin className="text-green-600" />
                  </div>
                  Service Address
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <FaLocationArrow className="text-green-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-gray-500 text-sm font-medium mb-2">Complete Address</p>
                        <p className="text-gray-800 font-semibold leading-relaxed">
                          {[
                            bookingDetails.address.address_line1,
                            bookingDetails.address.address_line2,
                            bookingDetails.address.city,
                            bookingDetails.address.state,
                            bookingDetails.address.country,
                            bookingDetails.address.postal_code
                          ].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                  {bookingDetails.address.postal_code && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <FaMapPin className="text-blue-600" />
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Pincode</p>
                          <p className="text-blue-800 font-bold">{bookingDetails.address.postal_code}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps Card */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCheckCircle className="text-orange-600 mr-3" />
                What's Next?
              </h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">Our team will contact you within 24 hours to confirm details</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">You'll receive detailed instructions for the puja ceremony</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">Our pandits will arrive 30 minutes before the scheduled time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 mb-8">
          <button
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            onClick={handleDownloadReceipt}
          >
            <FaDownload className="text-lg" />
            Download Receipt
          </button>
          <button
            className="flex items-center justify-center gap-3 bg-white border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            onClick={handleShareDetails}
          >
            <FaShare className="text-lg" />
            Share Details
          </button>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Need Assistance?
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center">
            <a
              href="tel:+91XXXXXXXXXX"
              className="flex items-center gap-3 hover:text-orange-600 transition-colors bg-orange-50 p-4 rounded-xl border border-orange-200 hover:border-orange-300"
            >
              <div className="bg-orange-100 p-3 rounded-full">
                <FaPhoneAlt className="text-orange-600 text-lg" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Call us</p>
                <p className="text-gray-700 font-semibold">+91-XXXXX-XXXXX</p>
              </div>
            </a>
            <a
              href="mailto:support@okpuja.com"
              className="flex items-center gap-3 hover:text-orange-600 transition-colors bg-orange-50 p-4 rounded-xl border border-orange-200 hover:border-orange-300"
            >
              <div className="bg-orange-100 p-3 rounded-full">
                <FaEnvelope className="text-orange-600 text-lg" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email us</p>
                <p className="text-gray-700 font-semibold">support@okpuja.com</p>
              </div>
            </a>
            <Link
              href="/faq"
              className="flex items-center gap-3 hover:text-orange-600 transition-colors bg-orange-50 p-4 rounded-xl border border-orange-200 hover:border-orange-300"
            >
              <div className="bg-orange-100 p-3 rounded-full">
                <FaQuestionCircle className="text-orange-600 text-lg" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Help Center</p>
                <p className="text-orange-600 hover:underline font-semibold">View FAQs</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8 py-4">
          © {new Date().getFullYear()} OKPUJA. All rights reserved. | Made with ❤️ for your spiritual journey
        </div>
      </main>
    </div>
  );
};

export default BookingSuccess;
