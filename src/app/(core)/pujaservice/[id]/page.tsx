'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Clock, MapPin, Users, Star, Share2, Heart, CheckCircle,
  Calendar, Globe, Shield, Award, Phone, Mail, MessageCircle
} from 'lucide-react';
import moment from 'moment-timezone';
import { PujaService, Package } from '../../../stores/pujaServiceStore';
import { usePujaServiceStore } from '../../../stores/pujaServiceStore';
import { useAuthStore } from '../../../stores/authStore';
import { useCartStore } from '../../../stores/cartStore';
import { typeDisplayNames, languageDisplayNames, packageTypeDisplayNames } from '../mockData';
import { decryptId, encryptId } from '../encryption';
import { PACKAGE_CONFIG } from '../constants';
import LoginPrompt from '../components/LoginPrompt';
import toast from 'react-hot-toast';

// Set timezone to IST
moment.tz.setDefault("Asia/Kolkata");

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const encryptedId = params.id as string;
  const { user } = useAuthStore();

  const {
    services,
    packages,
    loading: storeLoading,
    error,
    getServiceById,
    fetchPackages,
    fetchServices,
    clearError,
  } = usePujaServiceStore();

  const { addToCart, loading: cartLoading } = useCartStore();

  const [service, setService] = useState<PujaService | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Share functionality
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${service?.title} - Sacred Puja Service`;
    const shareText = `Check out this amazing puja service: ${service?.title}. Book now for authentic spiritual experience!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to clipboard copy
        fallbackShare(shareUrl, shareTitle);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      fallbackShare(shareUrl, shareTitle);
    }
  };

  const fallbackShare = async (url: string, title: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // Final fallback - show share modal with options
      showShareModal(url, title);
    }
  };

  const showShareModal = (url: string, title: string) => {
    const shareOptions = [
      {
        name: 'WhatsApp',
        url: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
      },
      {
        name: 'Facebook',
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      },
      {
        name: 'Twitter',
        url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      },
      {
        name: 'LinkedIn',
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      },
    ];

    // Create a simple share modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 class="text-lg font-semibold mb-4">Share this service</h3>
        <div class="space-y-3">
          ${shareOptions.map(option => `
            <a href="${option.url}" target="_blank" rel="noopener noreferrer" 
               class="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <span class="font-medium">${option.name}</span>
            </a>
          `).join('')}
          <button id="copyLinkBtn" class="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="font-medium">Copy Link</span>
          </button>
        </div>
        <button id="closeShareModal" class="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Close
        </button>
      </div>
    `;

    // Add event listeners
    const copyBtn = modal.querySelector('#copyLinkBtn');
    const closeBtn = modal.querySelector('#closeShareModal');
    
    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Error copying link:', error);
        toast.error('Failed to copy link');
      }
    });

    closeBtn?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    document.body.appendChild(modal);
  };

  // Decrypt ID and find service
  useEffect(() => {
    const loadService = async () => {
      setLoading(true);
      setErrorMessage('');
      
      try {
        const serviceId = decryptId(encryptedId);
        console.log('Decrypted service ID:', serviceId);
        
        if (!serviceId || isNaN(parseInt(serviceId))) {
          setErrorMessage('Invalid service link');
          setLoading(false);
          return;
        }

        // Always try to fetch from API first for fresh data
        let foundService;
        try {
          foundService = await getServiceById(parseInt(serviceId));
          console.log('Service fetched from API:', foundService);
        } catch (apiError) {
          console.log('API fetch failed, checking store:', apiError);
          // Fallback to store if API fails
          foundService = services.find(s => s.id === parseInt(serviceId));
        }

        if (!foundService) {
          // If services array is empty (page refresh), try to fetch all services first
          if (services.length === 0) {
            console.log('Services array empty, fetching all services...');
            await fetchServices();
            // After fetching, try to find the service again
            foundService = services.find(s => s.id === parseInt(serviceId));
          }
        }

        if (!foundService) {
          setErrorMessage('Service not found');
          setLoading(false);
          return;
        }

        setService(foundService);
        console.log('Service set:', foundService);

        // Fetch packages for this service
        try {
          await fetchPackages(parseInt(serviceId));
          console.log('Packages fetched for service:', serviceId);
        } catch (packageError) {
          console.log('Package fetch failed:', packageError);
          // Don't fail if packages can't be fetched
        }

      } catch (error) {
        console.error('Error loading service:', error);
        setErrorMessage('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    if (encryptedId) {
      loadService();
    }
  }, [encryptedId, getServiceById, fetchPackages, fetchServices]);

  // Restore booking state after login
  useEffect(() => {
    if (user && service) {
      const bookingState = localStorage.getItem('bookingState');
      const cartState = localStorage.getItem('cartState');

      if (bookingState) {
        try {
          const state = JSON.parse(bookingState);
          if (state.serviceId === service.id) {
            // Restore the booking state
            if (state.location) setSelectedLocation(state.location);
            if (state.language) setSelectedLanguage(state.language);
            if (state.date) setSelectedDate(state.date);
            if (state.time) setSelectedTime(state.time);

            // Find and set the package
            if (state.packageId && packages.length > 0) {
              const pkg = packages.find(p => p.id === state.packageId);
              if (pkg) setSelectedPackage(pkg);
            }

            localStorage.removeItem('bookingState');
            toast.success('Welcome back! Your booking details have been restored.');
          }
        } catch (error) {
          console.error('Error restoring booking state:', error);
        }
      }

      if (cartState) {
        try {
          const state = JSON.parse(cartState);
          if (state.serviceId === service.id) {
            // Restore the cart state
            if (state.location) setSelectedLocation(state.location);
            if (state.language) setSelectedLanguage(state.language);

            // Find and set the package
            if (state.packageId && packages.length > 0) {
              const pkg = packages.find(p => p.id === state.packageId);
              if (pkg) setSelectedPackage(pkg);
            }

            localStorage.removeItem('cartState');
            toast.success('Welcome back! Your cart selection has been restored.');
          }
        } catch (error) {
          console.error('Error restoring cart state:', error);
        }
      }
    }
  }, [user, service, packages]);

  // Get available locations and languages from packages
  const availableLocations = packages ? [...new Set(packages.map(pkg => pkg.location))] : [];
  const availableLanguages = packages ? [...new Set(packages.map(pkg => pkg.language))] : [];

  // Filter packages based on location and language
  useEffect(() => {
    if (!packages || !selectedLocation || !selectedLanguage) {
      setFilteredPackages([]);
      setSelectedPackage(null);
      return;
    }

    const filtered = packages.filter(
      pkg => pkg.location === selectedLocation && pkg.language === selectedLanguage
    );
    // Sort by price (ascending) for clarity
    const sorted = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
    setFilteredPackages(sorted);

    // Keep selection if still valid, otherwise preselect the first option
    setSelectedPackage(prev =>
      prev && sorted.some(p => p.id === prev.id) ? prev : (sorted[0] ?? null)
    );
  }, [selectedLocation, selectedLanguage, service, packages]);

  // Date validation
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    const currentDate = moment().format("YYYY-MM-DD");
    if (date < currentDate) {
      setErrorMessage("Date cannot be in the past.");
    } else {
      setErrorMessage("");
      setSelectedDate(date);
    }
  };

  // Time validation
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    const currentDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm");

    if (selectedDate === currentDate && time < currentTime) {
      setErrorMessage("Time cannot be in the past.");
    } else {
      setErrorMessage("");
      setSelectedTime(time);
    }
  };

  const handleBooking = () => {
    if (!user) {
      // Save booking state before redirecting to login
      const bookingState = {
        serviceId: service?.id,
        packageId: selectedPackage?.id,
        location: selectedLocation,
        language: selectedLanguage,
        date: selectedDate,
        time: selectedTime,
        returnUrl: window.location.href
      };
      localStorage.setItem('bookingState', JSON.stringify(bookingState));
      setShowLoginPrompt(true);
      return;
    }

    if (!selectedPackage || !selectedDate || !selectedTime) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    // For now booking is handled via cart -> checkout. Add to cart then navigate to checkout
    const cartItemData = {
      service_type: 'PUJA' as const,
      puja_service: service!.id,
      package_id: selectedPackage.id,
      selected_date: selectedDate,
      selected_time: selectedTime,
    };

    const doAddAndGo = async () => {
      try {
        const success = await addToCart(cartItemData);
        if (success) {
          // Clear transient selections
          setSelectedDate('');
          setSelectedTime('');
          setErrorMessage('');
          // Navigate to checkout
          router.push('/checkout');
        } else {
          setErrorMessage('Failed to add item to cart. Please try again.');
        }
      } catch (err) {
        console.error('Error adding to cart during booking:', err);
        setErrorMessage('Failed to add item to cart. Please try again.');
      }
    };

    void doAddAndGo();
  };

  const handleAddToCart = async () => {
    if (!user) {
      // Save cart state before redirecting to login  
      const cartState = {
        serviceId: service?.id,
        packageId: selectedPackage?.id,
        location: selectedLocation,
        language: selectedLanguage,
        date: selectedDate,
        time: selectedTime,
        returnUrl: window.location.href
      };
      localStorage.setItem('cartState', JSON.stringify(cartState));
      setShowLoginPrompt(true);
      return;
    }

    if (!selectedPackage || !selectedDate || !selectedTime) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    // Prepare cart item data
    const cartItemData = {
      service_type: 'PUJA' as const,
      puja_service: service!.id,
      package_id: selectedPackage.id,
      selected_date: selectedDate,
      selected_time: selectedTime,
    };

    try {
      const success = await addToCart(cartItemData);
      if (success) {
        // Clear form data after successful addition
        setSelectedDate('');
        setSelectedTime('');
        setErrorMessage('');
        
        // Optionally redirect to cart or show success message
        // router.push('/cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setErrorMessage("Failed to add item to cart. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!service || errorMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {errorMessage || "Service Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            {errorMessage === 'Invalid service link' 
              ? 'The service link you used is invalid or corrupted.'
              : errorMessage === 'Service not found'
              ? 'The puja service you\'re looking for doesn\'t exist or is no longer available.'
              : 'The puja service you\'re looking for doesn\'t exist.'
            }
          </p>
          <Link 
            href="/pujaservice" 
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 w-full max-w-full overflow-x-hidden">
      {/* Navigation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between py-4 gap-2 w-full min-w-0">
            <Link
              href="/pujaservice"
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors group text-sm sm:text-base min-w-0 flex-1"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Services</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button 
                onClick={handleShare}
                className="p-2 sm:p-2.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all"
                title="Share this service"
              >
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="p-2 sm:p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-64 sm:h-80 lg:h-[500px] overflow-hidden"
      >
        <Image
          src={service.image_url || '/placeholder-service.jpg'}
          alt={service.title}
          fill
          className="object-contain bg-gray-100"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 mb-4"
            >
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${service.type === 'HOME'
                  ? 'bg-green-500/90 text-white'
                  : service.type === 'TEMPLE'
                    ? 'bg-blue-500/90 text-white'
                    : 'bg-purple-500/90 text-white'
                }`}>
                {typeDisplayNames[service.type]}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-500/90 text-white">
                {service.category_detail?.name || 'Puja Service'}
              </span>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-semibold">4.8 (156 reviews)</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
            >
              {service.title}
            </motion.h1>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 text-sm"
            >
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{Math.floor(service.duration_minutes / 60)}h {service.duration_minutes % 60}m</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{packages.length} packages available</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Professional Message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-orange-500"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start">
            <Shield className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-1">Sacred Assurance</h3>
              <p className="text-orange-800 text-sm leading-relaxed">
                Our experienced pandits perform each ritual with utmost care and devotion according to authentic Vedic traditions.
                Your spiritual well-being is our highest priority, backed by years of expertise and countless satisfied devotees.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24 sm:pb-0">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Puja</h2>
              <div className="prose prose-orange max-w-none">
                <div
                  className="text-gray-700 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              </div>
            </motion.div>

            {/* What's Included */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="h-6 w-6 text-orange-500 mr-2" />
                What&apos;s Included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Qualified & experienced priest',
                  'All sacred mantras & rituals',
                  'Proper vedic procedures',
                  'Post-puja guidance',
                  'Flexible timing',
                  'Devotional atmosphere',
                  'Complete ritual setup',
                  'Spiritual consultation'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 lg:sticky lg:top-24"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Puja</h3>
                <p className="text-gray-600 text-sm">Choose your preferred options below</p>
              </div>

              {/* Location & Language Selection */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="h-4 w-4 inline mr-1 text-orange-500" />
                    Select Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white"
                  >
                    <option value="">Choose a location</option>
                    {availableLocations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Globe className="h-4 w-4 inline mr-1 text-orange-500" />
                    Select Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white"
                  >
                    <option value="">Choose a language</option>
                    {availableLanguages.map((language) => (
                      <option key={language} value={language}>
                        {languageDisplayNames[language]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lightweight loading skeleton while fetching packages */}
              {storeLoading && (
                <div className="mb-8 space-y-3">
                  <div className="h-20 rounded-lg bg-gray-100 animate-pulse" />
                  <div className="h-20 rounded-lg bg-gray-100 animate-pulse" />
                </div>
              )}

              {/* Friendly empty state when no matching packages */}
              {selectedLocation && selectedLanguage && filteredPackages.length === 0 && !storeLoading && (
                <div className="mb-8 p-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-700 text-sm">
                  No packages available for the selected location and language. Please try a different combination.
                </div>
              )}

              {/* Package Selection */}
              <AnimatePresence>
                {filteredPackages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8"
                  >
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-orange-500" />
                      Choose Your Package
                    </h4>

                    {/* Use a radiogroup for accessibility */}
                    <div role="radiogroup" aria-label="Available packages" className="space-y-4">
                      {filteredPackages.map((pkg, idx) => (
                        // Use a label so the entire card is clickable and keyboard accessible
                        <label key={pkg.id} className="block cursor-pointer">
                          {/* hidden radio input keeps native accessibility and keyboard support */}
                          <input
                            type="radio"
                            name="package"
                            className="sr-only"
                            checked={selectedPackage?.id === pkg.id}
                            onChange={() => setSelectedPackage(pkg)}
                            aria-checked={selectedPackage?.id === pkg.id}
                          />

                          <motion.div
                            role="radio"
                            aria-checked={selectedPackage?.id === pkg.id}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedPackage(pkg);
                              }
                              if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
                                e.preventDefault();
                                const next = filteredPackages[(idx + 1) % filteredPackages.length];
                                setSelectedPackage(next);
                              }
                              if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
                                e.preventDefault();
                                const prevIdx = (idx - 1 + filteredPackages.length) % filteredPackages.length;
                                const prev = filteredPackages[prevIdx];
                                setSelectedPackage(prev);
                              }
                            }}
                            className={`relative p-5 rounded-xl border-2 transition-all duration-300 flex items-start gap-4 ${selectedPackage?.id === pkg.id
                                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg'
                                : 'border-gray-200 hover:border-orange-300 hover:shadow-md bg-white'
                              }`}
                          >
                            {/* Visible radio indicator on the left */}
                            <div className="flex-shrink-0 mt-1">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${selectedPackage?.id === pkg.id ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'}`}>
                                {selectedPackage?.id === pkg.id ? (
                                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                ) : null}
                              </div>
                            </div>

                            <div className="flex-1">
                              {/* Package header + price */}
                              <div className="flex items-center justify-between mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedPackage?.id === pkg.id
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-orange-100 text-orange-600'
                                  }`}>
                                  {packageTypeDisplayNames[pkg.package_type]}
                                </span>
                                <div className="text-right">
                                  <span className="text-2xl font-bold text-orange-600">
                                    ₹{parseFloat(pkg.price.toString()).toLocaleString('en-IN')}
                                  </span>
                                  <div className="text-xs text-gray-500">per service</div>
                                </div>
                              </div>

                              {/* Package Description */}
                              <div
                                className="text-sm text-gray-700 mb-4 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: pkg.description }}
                              />

                              {/* Package Features */}
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <Users className="h-4 w-4 mr-2 text-green-500" />
                                  <span className="text-gray-700">
                                    <strong>
                                      {PACKAGE_CONFIG[pkg.package_type]?.priests || pkg.priest_count}
                                    </strong> Professional Priest{
                                      (typeof PACKAGE_CONFIG[pkg.package_type]?.priests === 'number'
                                        ? Number(PACKAGE_CONFIG[pkg.package_type]?.priests) > 1
                                        : pkg.priest_count > 1) ? 's' : ''
                                    }
                                  </span>
                                </div>

                                <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-2 text-green-500" />
                                  <span className="text-gray-700">
                                    <strong>
                                      {PACKAGE_CONFIG[pkg.package_type]?.duration || '2-3'} hours
                                    </strong> duration
                                  </span>
                                </div>

                                <div className="flex items-center text-sm">
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  <span className="text-gray-700">
                                    {pkg.includes_materials ? 'All Puja Materials Included' : 'Materials Not Included'}
                                  </span>
                                </div>

                                <div className="flex items-center text-sm">
                                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                                  <span className="text-gray-700">
                                    Authentic Procedures
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Selection Check (keeps previous visual) */}
                            {selectedPackage?.id === pkg.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-3 right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
                              >
                                <CheckCircle className="h-4 w-4 text-white" />
                              </motion.div>
                            )}
                          </motion.div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Date & Time Selection */}
              <AnimatePresence>
                {selectedPackage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8"
                  >
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                      Schedule Your Puja
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          min={moment().format("YYYY-MM-DD")}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 hover:bg-white transition-all"
                        />
                        <div className="mt-1 text-xs text-gray-500">Earliest available date is today.</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Time
                        </label>
                        <input
                          type="time"
                          value={selectedTime}
                          onChange={handleTimeChange}
                          min={selectedDate === moment().format("YYYY-MM-DD") ? moment().format("HH:mm") : undefined}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 hover:bg-white transition-all"
                        />
                        <div className="mt-1 text-xs text-gray-500">
                          All times in IST (UTC+5:30).
                          {/* Display friendly AM/PM preview */}
                          {selectedTime ? (
                            <span className="ml-1 font-medium text-gray-700">
                              {moment(selectedTime, 'HH:mm').format('hh:mm A')}
                            </span>
                          ) : (
                            <span className="ml-1"> Select a time to see it in AM/PM</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
                        role="alert"
                        aria-live="assertive"
                      >
                        <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Book Now Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!selectedPackage || !selectedDate || !selectedTime}
                  onClick={handleBooking}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${selectedPackage && selectedDate && selectedTime
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {selectedPackage && selectedDate && selectedTime
                    ? `Book Now - ₹${parseFloat(selectedPackage.price.toString()).toLocaleString('en-IN')}`
                    : 'Complete Selection to Book'
                  }
                </motion.button>

                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!selectedPackage || !selectedDate || !selectedTime || cartLoading}
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 border-2 ${selectedPackage && selectedDate && selectedTime
                      ? 'border-orange-500 text-orange-600 hover:bg-orange-50 shadow-md hover:shadow-lg'
                      : 'border-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {cartLoading 
                    ? 'Adding to Cart...' 
                    : selectedPackage && selectedDate && selectedTime
                      ? `Add to Cart - ₹${parseFloat(selectedPackage.price.toString()).toLocaleString('en-IN')}`
                      : 'Complete Selection to Add to Cart'
                  }
                </motion.button>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4 text-center">Need Assistance?</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
                    <Phone className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">+91 9471661636</span>
                  </div>
                  <div className="flex items-center justify-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
                    <Mail className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">support@okpuja.com</span>
                  </div>
                  <div className="flex items-center justify-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
                    <MessageCircle className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">Live Chat Support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Customer Reviews Section - Moved Below Booking */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold  mb-2"><span className="text-gray-900">What Our Customers Say</span></h2>
            <p className="text-gray-600">Trusted by thousands of satisfied devotees</p>
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-700">4.8 out of 5</span>
              <span className="ml-2 text-gray-500">(156 reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                name: 'Rahul Sharma',
                initial: 'R',
                color: 'bg-orange-100 text-orange-600',
                review: 'Excellent service! The priest was very knowledgeable and performed the puja with complete devotion. Everything was arranged perfectly. The spiritual atmosphere created was truly divine.',
                time: '2 days ago',
                rating: 5,
                location: 'Mumbai'
              },
              {
                name: 'Priya Gupta',
                initial: 'P',
                color: 'bg-blue-100 text-blue-600',
                review: 'Amazing experience! The priest arrived on time and conducted the puja beautifully. The entire family felt blessed. Will definitely book again for future occasions.',
                time: '1 week ago',
                rating: 5,
                location: 'Delhi'
              },
              {
                name: 'Suresh Kumar',
                initial: 'S',
                color: 'bg-green-100 text-green-600',
                review: 'Professional service with authentic rituals. The priest explained each step of the puja, which made it more meaningful. Highly recommended for anyone seeking genuine spiritual experience.',
                time: '2 weeks ago',
                rating: 5,
                location: 'Bangalore'
              },
              {
                name: 'Anita Patel',
                initial: 'A',
                color: 'bg-purple-100 text-purple-600',
                review: 'Very satisfied with the service. The materials provided were of excellent quality and the priest was extremely knowledgeable about the rituals. Great value for money.',
                time: '3 weeks ago',
                rating: 4,
                location: 'Ahmedabad'
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3 + index * 0.2 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${review.color} flex-shrink-0`}>
                    <span className="font-semibold text-lg">{review.initial}</span>
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <span className="text-xs text-gray-500">{review.location}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{review.time}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">{review.review}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Related Services Carousel */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">You Might Also Like</h2>
            <p className="text-gray-600">Explore other spiritual services</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {services
              .filter(s => s.id !== service.id && s.category_detail?.id === service.category_detail?.id)
              .slice(0, 4)
              .map((relatedService, index) => (
                <motion.div
                  key={relatedService.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/pujaservice/${encryptId(relatedService.id.toString())}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={relatedService.image_url || '/placeholder-service.jpg'}
                      alt={relatedService.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${relatedService.type === 'HOME'
                          ? 'bg-green-500 text-white'
                          : relatedService.type === 'TEMPLE'
                            ? 'bg-blue-500 text-white'
                            : 'bg-purple-500 text-white'
                        }`}>
                        {typeDisplayNames[relatedService.type]}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-xs font-semibold">4.8</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>{relatedService.title}</h3>
                    <p className="text-gray-600 text-sm mb-4" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>{relatedService.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{Math.floor(relatedService.duration_minutes / 60)}h {relatedService.duration_minutes % 60}m</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Starting from</span>
                        <div className="font-bold text-orange-600">
                          ₹5,000+
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {services.filter(s => s.id !== service.id && s.category_detail?.id === service.category_detail?.id).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No related services found in this category.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Mobile summary bar */}
      <div className="fixed bottom-0 inset-x-0 sm:hidden z-50">
        <div className="mx-4 mb-4 rounded-xl shadow-lg border border-gray-200 bg-white p-3 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-xs text-gray-500 truncate">
              {selectedPackage ? packageTypeDisplayNames[selectedPackage.package_type] : 'No package selected'}
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {selectedPackage ? `₹${parseFloat(selectedPackage.price.toString()).toLocaleString('en-IN')}` : ''}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {selectedDate && selectedTime ? `${moment(selectedDate).format('DD MMM')} • ${moment(selectedTime, 'HH:mm').format('hh:mm A')}` : ''}
            </div>
          </div>
          <button
            disabled={!selectedPackage || !selectedDate || !selectedTime}
            onClick={handleBooking}
            className={`ml-3 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedPackage && selectedDate && selectedTime
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Book
          </button>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <LoginPrompt
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    </div>
  );
}
