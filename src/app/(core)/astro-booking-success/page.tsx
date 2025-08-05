'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Confetti } from '@/components/ui/confetti';
import Link from 'next/link';
import Image from 'next/image';
import apiClient from '@/app/apiService/globalApiconfig';
import { toast } from 'react-hot-toast';

interface BookingDetails {
  astro_book_id: string;
  payment_id: string;
  service: {
    title: string;
    price: string;
    image_url?: string;
  };
  preferred_date: string;
  preferred_time: string;
  status: string;
  contact_email: string;
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
          const response = await apiClient.get(`/astrology/bookings/confirmation/?astro_book_id=${astroBookId}`);
          if (response.data.success) {
            setBookingDetails(response.data.data.booking);
          } else {
            setError('Failed to load booking details.');
          }
        } 
        // Otherwise, we need to get astro_book_id from payment info
        else if (merchantOrderId) {
          const response = await apiClient.get(`/payments/order-status/?merchant_order_id=${merchantOrderId}`);
          
          if (response.data.success) {
            // Extract astro_book_id from payment response
            const paymentData = response.data.data;
            
            // Now fetch the booking details using the astro_book_id
            if (paymentData.astro_book_id) {
              const bookingResponse = await apiClient.get(`/astrology/bookings/confirmation/?astro_book_id=${paymentData.astro_book_id}`);
              if (bookingResponse.data.success) {
                setBookingDetails(bookingResponse.data.data.booking);
              } else {
                setError('Failed to load booking details.');
              }
            } else {
              setError('Booking reference not found in payment data.');
            }
          } else {
            setError('Failed to verify payment status.');
          }
        }
      } catch (err) {
        console.error('Error fetching booking details:', err);
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
    return timeString.substring(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Confetti active={!loading && !error} />
      
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Booking Details...</h2>
            <p className="text-gray-600">Please wait while we fetch your booking information.</p>
          </div>
        ) : error ? (
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Booking Verification Failed</h2>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
              <Link href="/astrology" className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
                Browse Services
              </Link>
              <Link href="/contact" className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Contact Support
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8 text-white text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-2">Booking Successful!</h1>
                <p className="text-lg opacity-90">Your astrology service has been successfully booked.</p>
                <p className="text-sm bg-white/20 rounded-full px-4 py-1 mt-3 inline-block">
                  Booking ID: {bookingDetails?.astro_book_id}
                </p>
              </div>

              {/* Booking Details */}
              <div className="px-6 py-8">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Details</h2>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      <div className="relative h-40 rounded-lg overflow-hidden bg-gray-100">
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
                    <div className="w-full md:w-2/3">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {bookingDetails?.service?.title}
                      </h3>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-green-600">₹{parseFloat(bookingDetails?.service?.price || "0").toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(bookingDetails?.preferred_date || "")}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{formatTime(bookingDetails?.preferred_time || "")}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-green-600">Confirmed</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-medium font-mono text-sm">{bookingDetails?.payment_id}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Next Steps</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        1
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">A confirmation email has been sent to <span className="font-medium">{bookingDetails?.contact_email}</span></p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        2
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">Our astrologer will contact you before your scheduled appointment.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        3
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">Please be available 5 minutes before your scheduled time.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
                  <Link href="/astrology" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
                    Browse More Services
                  </Link>
                  <Link href="/account/bookings" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    View All Bookings
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>If you have any questions about your booking, please contact our customer support at support@okpuja.com or call us at +91-9876543210.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
