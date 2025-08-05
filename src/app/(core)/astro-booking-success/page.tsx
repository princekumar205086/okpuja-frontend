'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Confetti } from '@/components/ui/confetti';
import Link from 'next/link';
import Image from 'next/image';
import apiClient from '@/app/apiService/globalApiconfig';
import { toast } from 'react-hot-toast';

interface BookingDetails {
  id: number;
  astro_book_id: string;
  payment_id: string;
  user: {
    id: number;
    email: string;
    phone: string;
    role: string;
    account_status: string;
    is_active: boolean;
    date_joined: string;
  };
  service: {
    id: number;
    title: string;
    service_type: string;
    description: string;
    image_url: string;
    image_thumbnail_url: string;
    image_card_url: string;
    price: string;
    duration_minutes: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  language: string;
  preferred_date: string;
  preferred_time: string;
  birth_place: string;
  birth_date: string;
  birth_time: string;
  gender: string;
  questions: string;
  status: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
}

export default function AstroBookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const merchantOrderId = searchParams.get('merchant_order_id');
  const astroBookId = searchParams.get('astro_book_id');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!merchantOrderId && !astroBookId) {
        setError('No booking reference found. Please check your URL.');
        setLoading(false);
        return;
      }

      try {
        // If we have astro_book_id directly, use it
        if (astroBookId) {
          toast.loading('Fetching booking details...');
          const response = await apiClient.get(`/astrology/bookings/confirmation/?astro_book_id=${astroBookId}`);
          
          if (response.data.success) {
            setBookingDetails(response.data.data.booking);
            toast.dismiss();
            toast.success('Booking details loaded successfully');
          } else {
            toast.dismiss();
            toast.error('Failed to load booking details');
            setError('Failed to load booking details.');
          }
        } 
        // Otherwise, we need to get astro_book_id from payment info
        else if (merchantOrderId) {
          toast.loading('Verifying payment status...');
          const response = await apiClient.get(`/payments/order-status/?merchant_order_id=${merchantOrderId}`);
          
          if (response.data.success) {
            // Extract astro_book_id from payment response
            const paymentData = response.data.data;
            
            // Now fetch the booking details using the astro_book_id
            if (paymentData.astro_book_id) {
              toast.loading('Fetching booking details...');
              const bookingResponse = await apiClient.get(`/astrology/bookings/confirmation/?astro_book_id=${paymentData.astro_book_id}`);
              
              if (bookingResponse.data.success) {
                setBookingDetails(bookingResponse.data.data.booking);
                toast.dismiss();
                toast.success('Booking details loaded successfully');
              } else {
                toast.dismiss();
                toast.error('Failed to load booking details');
                setError('Failed to load booking details.');
              }
            } else {
              toast.dismiss();
              toast.error('Booking reference not found');
              setError('Booking reference not found in payment data.');
            }
          } else {
            toast.dismiss();
            toast.error('Payment verification failed');
            setError('Failed to verify payment status.');
          }
        }
      } catch (err) {
        console.error('Error fetching booking details:', err);
        toast.dismiss();
        toast.error('Error loading booking details');
        setError('An error occurred while loading your booking details. Please contact customer support.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [merchantOrderId, astroBookId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    
    // Parse time to display in 12-hour format with AM/PM
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Confetti active={!loading && !error} />
      
      {/* Full-width success banner for large screens */}
      {!loading && !error && bookingDetails && (
        <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-10 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center text-white text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-3">Booking Successful!</h1>
              <p className="text-xl opacity-90 mb-4">Your astrology service has been successfully booked.</p>
              <p className="text-md bg-white/20 rounded-full px-6 py-2 inline-block">
                Booking ID: {bookingDetails?.astro_book_id}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-white shadow-lg rounded-lg p-10 text-center max-w-xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6">
              <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Booking Details...</h2>
            <p className="text-gray-600 mb-4">Please wait while we fetch your booking information.</p>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-10 text-white text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">Booking Verification Failed</h2>
              <p className="text-lg opacity-90 max-w-lg mx-auto">{error}</p>
            </div>
            
            <div className="p-8">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      We couldn't verify your booking details. This could be due to a payment issue or a system error.
                    </p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">What You Can Do Now</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                    1
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Try refreshing the page or checking your email for booking confirmation.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                    2
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Check if the payment was deducted from your account.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                    3
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Contact our customer support for immediate assistance.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                <Link href="/astrology" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                  Browse Services
                </Link>
                <Link href="/contact" className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Success message is already shown in the full-width banner above */}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Service Details */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden lg:col-span-2">
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="bg-orange-100 text-orange-600 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    Service Details
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-6 mb-8">
                    <div className="w-full sm:w-1/3">
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                        {bookingDetails?.service?.image_url ? (
                          <Image 
                            src={bookingDetails.service.image_url}
                            alt={bookingDetails.service.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-orange-50">
                            <svg className="w-16 h-16 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full sm:w-2/3">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        {bookingDetails?.service?.title}
                      </h3>
                      
                      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4 rounded-r-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-orange-800 font-medium">Appointment Date:</span>
                          <span className="font-bold text-gray-800">{formatDate(bookingDetails?.preferred_date || "")}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-orange-800 font-medium">Appointment Time:</span>
                          <span className="font-bold text-gray-800">{formatTime(bookingDetails?.preferred_time || "")}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium text-green-600">₹{parseFloat(bookingDetails?.service?.price || "0").toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{bookingDetails?.service?.duration_minutes} minutes</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Language:</span>
                          <span className="font-medium">{bookingDetails?.language}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{bookingDetails?.status}</span>
                        </div>
                        <div className="flex items-center justify-between col-span-2">
                          <span className="text-gray-600">Payment ID:</span>
                          <span className="font-medium font-mono text-sm">{bookingDetails?.payment_id}</span>
                        </div>
                        <div className="flex items-center justify-between col-span-2">
                          <span className="text-gray-600">Booking ID:</span>
                          <span className="font-medium font-mono text-sm">{bookingDetails?.astro_book_id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    Personal Details
                  </h2>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-blue-800 mb-2">Birth Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{formatDate(bookingDetails?.birth_date || "")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{formatTime(bookingDetails?.birth_time || "")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Place</p>
                        <p className="font-medium">{bookingDetails?.birth_place}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Personal Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium">{bookingDetails?.gender}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{bookingDetails?.contact_email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{bookingDetails?.contact_phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Questions/Concerns</h3>
                      <div className="bg-gray-50 p-4 rounded-lg h-full">
                        <p className="italic text-gray-700">{bookingDetails?.questions || "No specific questions mentioned."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Next Steps */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </span>
                    Next Steps
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start bg-green-50 p-4 rounded-lg">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-green-200 text-green-600 font-bold">
                        1
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-800">Confirmation Email</h3>
                        <p className="text-gray-600 mt-1">A confirmation email has been sent to <span className="font-medium">{bookingDetails?.contact_email}</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-start bg-green-50 p-4 rounded-lg">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-green-200 text-green-600 font-bold">
                        2
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-800">Astrologer Contact</h3>
                        <p className="text-gray-600 mt-1">Our astrologer will contact you on <span className="font-medium">{bookingDetails?.contact_phone}</span> before your scheduled appointment.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start bg-green-50 p-4 rounded-lg">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-green-200 text-green-600 font-bold">
                        3
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-800">Session Language</h3>
                        <p className="text-gray-600 mt-1">Your session will be conducted in <span className="font-medium">{bookingDetails?.language}</span> as requested.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start bg-green-50 p-4 rounded-lg">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-green-200 text-green-600 font-bold">
                        4
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-800">Be Ready</h3>
                        <p className="text-gray-600 mt-1">Please be available 5 minutes before your scheduled time on <span className="font-medium">{formatDate(bookingDetails?.preferred_date || "")}</span> at <span className="font-medium">{formatTime(bookingDetails?.preferred_time || "")}</span>.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col space-y-3">
                      <Link href="/astrology" className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                        Browse More Services
                      </Link>
                      <Link href="/account/bookings" className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        View All Bookings
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-white shadow-sm rounded-lg p-6 text-center">
              <p className="text-gray-600">If you have any questions about your booking, please contact our customer support at <span className="font-medium">support@okpuja.com</span> or call us at <span className="font-medium">+91-9876543210</span>.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
