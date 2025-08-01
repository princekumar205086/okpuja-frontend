"use client";
import React, { useState, useEffect } from "react";
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
import { jsPDF } from "jspdf";
import Loader from "@/app/utils/loader";
import Link from "next/link";
import { toast } from 'react-hot-toast';

const BookingSuccess = () => {
  const searchParams = useSearchParams();
  const { getBookingByBookId, getLatestBooking } = useBookingStore();
  
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Get book_id from URL parameters - support multiple formats
  const bookIdParam = searchParams.get('book_id');
  const paymentIdParam = searchParams.get('payment_id');
  const statusParam = searchParams.get('status');
  const merchantOrderIdParam = searchParams.get('order_id') || searchParams.get('merchant_order_id');
  
  // Also check if URL has malformed parameter like ?=BK-072D32E4
  const urlParams = new URLSearchParams(window.location.search);
  const allKeys = Array.from(urlParams.keys());
  const emptyKeyValue = urlParams.get(''); // Check for malformed ?=value
  
  // Get merchant order ID from session storage or URL params for backup lookup
  const sessionMerchantOrderId = typeof window !== 'undefined' ? 
    sessionStorage.getItem('merchant_order_id') : null;
  
  // Determine the booking ID from various sources
  const bookId = bookIdParam || emptyKeyValue || paymentIdParam;
  const merchantOrderId = merchantOrderIdParam || sessionMerchantOrderId;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      console.log('URL search params:', window.location.search);
      console.log('All URL keys:', allKeys);
      console.log('book_id param:', bookIdParam);
      console.log('payment_id param:', paymentIdParam);
      console.log('status param:', statusParam);
      console.log('merchant_order_id param:', merchantOrderIdParam);
      console.log('empty key value:', emptyKeyValue);
      console.log('Final bookId:', bookId);
      console.log('merchantOrderId:', merchantOrderId);

      // If we have a booking ID, fetch it directly
      if (bookId) {
        try {
          setLoading(true);
          setError('');
          
          console.log('Calling API with bookId:', bookId);
          const booking = await getBookingByBookId(bookId);
          console.log('API response:', booking);
          
          if (booking) {
            setBookingDetails(booking);
            toast.success('Booking details loaded successfully!');
          } else {
            setError(`Booking with ID "${bookId}" not found or could not be retrieved`);
            toast.error('Failed to load booking details');
          }
        } catch (error) {
          console.error('Error fetching booking details:', error);
          setError(`Error loading booking details: ${error instanceof Error ? error.message : 'Unknown error'}`);
          toast.error('Error loading booking details');
        } finally {
          setLoading(false);
        }
        return;
      }

      // If we have status=completed but no booking ID, try to find booking using merchant order ID
      if (statusParam === 'completed' && !bookId) {
        try {
          setLoading(true);
          setError('Payment completed! Searching for your booking...');
          
          console.log('Payment completed - searching for booking...');
          
          // First, try to get booking from latest payment
          const token = localStorage.getItem('access_token');
          if (!token) {
            setError('Please login to view your booking details');
            setLoading(false);
            return;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/latest/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const latestPayment = await response.json();
            console.log('Latest payment:', latestPayment);
            
            // If the latest payment has a booking, use it
            if (latestPayment.booking) {
              console.log('Found booking from latest payment:', latestPayment.booking.book_id);
              setBookingDetails(latestPayment.booking);
              toast.success('Booking found! Loading details...');
              
              // Update URL to include booking ID for future reference
              const newUrl = `/confirmbooking?book_id=${latestPayment.booking.book_id}&order_id=${latestPayment.merchant_order_id || 'N/A'}`;
              window.history.replaceState({}, '', newUrl);
              setLoading(false);
              return;
            }
            
            // If payment exists but no booking, check if payment is successful
            if (latestPayment.status === 'SUCCESS' || latestPayment.status === 'COMPLETED') {
              // Payment successful but no booking - this indicates backend issue
              setError('Payment was successful but booking was not created automatically. Please contact support with your payment ID: ' + (latestPayment.merchant_order_id || latestPayment.id));
              toast.error('Booking creation failed - please contact support');
              setLoading(false);
              return;
            }
          }
          
          // Fallback: Try to get any recent successful booking using latest booking API
          console.log('Trying latest booking API as final fallback...');
          const latestBooking = await getLatestBooking();
          if (latestBooking) {
            console.log('Found latest booking:', latestBooking.book_id);
            setBookingDetails(latestBooking);
            toast.success('Found your latest booking!');
            
            // Update URL to include booking ID
            const newUrl = `/confirmbooking?book_id=${latestBooking.book_id}`;
            window.history.replaceState({}, '', newUrl);
            setLoading(false);
            return;
          }
          
          // If we still haven't found a booking, show helpful error
          setError('Payment completed successfully, but we need a moment to process your booking. Please refresh this page in a few seconds, or visit the debug page to find your booking.');
          toast.error('Booking processing - please refresh in a moment');
          
          // Auto-refresh after 5 seconds
          setTimeout(() => {
            window.location.reload();
          }, 5000);
          
        } catch (error) {
          console.error('Error finding booking after payment completion:', error);
          setError('Payment completed but unable to retrieve booking details. Please visit the payment debug page or contact support.');
          toast.error('Error retrieving booking details');
        } finally {
          setLoading(false);
        }
        return;
      }

      // If no booking ID and no status=completed, show error
      if (!bookId) {
        setError('Booking ID not found in URL. Please check the URL format.');
        setLoading(false);
        return;
      }
    };

    fetchBookingDetails();
  }, [bookId, merchantOrderId, statusParam, getBookingByBookId]);

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
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Booking Details</h2>
          <p className="text-gray-500">Please wait while we fetch your booking information...</p>
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
            Booking Not Found
          </h1>
          <p className="text-gray-600 text-md md:text-lg mb-6">
            {error || "We couldn't retrieve your booking details. Please check your booking ID or contact our support team."}
          </p>
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
                  <strong>Payment Completed!</strong> We're automatically searching for your booking details...
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  If this takes too long, visit <a href="/payment-debug" className="underline font-medium">payment debug page</a> to find your booking.
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
