'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { AstrologyService, AstrologyBooking } from '../types';
import { mockAstrologyServices } from '../mockData';
import { formatPrice, formatDuration, getServiceTypeLabel, getServiceTypeIcon } from '../utils';
import { ServiceDetailSkeleton } from '../components/LoadingSkeletons';
import { decryptId } from '../encryption';
import BookingForm from './BookingForm';

interface ServiceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [service, setService] = useState<AstrologyService | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      setLoading(true);
      
      try {
        // Decrypt the ID
        const serviceId = decryptId(resolvedParams.id);
        if (!serviceId) {
          router.push('/astrology');
          return;
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundService = mockAstrologyServices.find(s => s.id === serviceId);
        if (!foundService) {
          notFound();
        }
        
        setService(foundService);
        
        // Check if URL has booking hash to auto-open booking form
        if (window.location.hash === '#booking') {
          setShowBookingForm(true);
        }
      } catch (error) {
        console.error('Error loading service:', error);
        router.push('/astrology');
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [resolvedParams.id, router]);

  const handleBookingSubmit = async (bookingData: Omit<AstrologyBooking, 'id' | 'created_at' | 'updated_at'>) => {
    setBookingLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Booking submitted:', bookingData);
      
      // In a real app, you would:
      // 1. Send booking data to your API
      // 2. Handle payment processing
      // 3. Send confirmation emails
      // 4. Redirect to confirmation page
      
      alert('Booking submitted successfully! You will receive a confirmation email shortly.');
      setShowBookingForm(false);
      
      // Remove hash from URL
      window.history.replaceState(null, '', window.location.pathname);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <ServiceDetailSkeleton />;
  }

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/astrology" className="text-orange-600 hover:text-orange-700">
              Astrology Services
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600 truncate">{service.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Image */}
            <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden mb-6">
              {!imageError ? (
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{getServiceTypeIcon(service.service_type)}</div>
                    <p className="text-gray-600 text-lg">{service.title}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{getServiceTypeIcon(service.service_type)}</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  {getServiceTypeLabel(service.service_type)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {service.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDuration(service.duration_minutes)}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Expert Astrologer
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Instant Booking
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {service.description}
                </p>
              </div>
            </div>

            {/* What You'll Get */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What You&apos;ll Get</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Detailed Analysis</h3>
                    <p className="text-sm text-gray-600">Comprehensive reading based on your birth chart</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Personalized Remedies</h3>
                    <p className="text-sm text-gray-600">Customized solutions for your specific needs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Written Report</h3>
                    <p className="text-sm text-gray-600">Detailed written analysis sent via email</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Follow-up Support</h3>
                    <p className="text-sm text-gray-600">15 days of email support for clarifications</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Book Your Session</h3>
                    <p className="text-sm text-gray-600">Provide your birth details and preferred consultation time</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Expert Analysis</h3>
                    <p className="text-sm text-gray-600">Our certified astrologer prepares your personalized reading</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Live Consultation</h3>
                    <p className="text-sm text-gray-600">Join the session via phone/video call at your scheduled time</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Receive Report</h3>
                    <p className="text-sm text-gray-600">Get detailed written analysis and remedies via email</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {!showBookingForm ? (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <div className="text-center mb-6">
                  <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
                    {formatPrice(service.price)}
                  </div>
                  <p className="text-gray-600">per consultation</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{formatDuration(service.duration_minutes)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Service Type</span>
                    <span className="font-medium">{getServiceTypeLabel(service.service_type)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium">Within 24 hours</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium">Hindi, English</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition-colors font-medium text-lg"
                >
                  Book Now
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    100% secure payment • Instant confirmation
                  </p>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Certified Astrologer
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      10+ Years Experience
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      500+ Happy Clients
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Privacy Protected
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="sticky top-6">
                <BookingForm
                  serviceId={service.id}
                  serviceTitle={service.title}
                  servicePrice={service.price}
                  onBookingSubmit={handleBookingSubmit}
                  isLoading={bookingLoading}
                />
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="mt-4 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  Back to Service Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
