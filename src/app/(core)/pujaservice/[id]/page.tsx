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
import { PujaService, Package } from '../types';
import { mockPujaServices, typeDisplayNames, languageDisplayNames, packageTypeDisplayNames } from '../mockData';
import { decryptId } from '../encryption';

// Set timezone to IST
moment.tz.setDefault("Asia/Kolkata");

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const encryptedId = params.id as string;
  
  const [service, setService] = useState<PujaService | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Decrypt ID and find service
  useEffect(() => {
    const loadService = async () => {
      setLoading(true);
      try {
        const serviceId = decryptId(encryptedId);
        if (!serviceId) {
          router.push('/pujaservice');
          return;
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const foundService = mockPujaServices.find(s => s.id === parseInt(serviceId));
        if (!foundService) {
          router.push('/pujaservice');
          return;
        }
        
        setService(foundService);
      } catch (error) {
        router.push('/pujaservice');
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [encryptedId, router]);

  // Get available locations and languages
  const availableLocations = service ? [...new Set(service.packages.map(pkg => pkg.location))] : [];
  const availableLanguages = service ? [...new Set(service.packages.map(pkg => pkg.language))] : [];

  // Filter packages based on location and language
  useEffect(() => {
    if (!service || !selectedLocation || !selectedLanguage) {
      setFilteredPackages([]);
      setSelectedPackage(null);
      return;
    }

    const filtered = service.packages.filter(
      pkg => pkg.location === selectedLocation && pkg.language === selectedLanguage
    );
    setFilteredPackages(filtered);
    setSelectedPackage(null);
  }, [selectedLocation, selectedLanguage, service]);

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
    if (!selectedPackage || !selectedDate || !selectedTime) {
      setErrorMessage("Please complete all required fields.");
      return;
    }
    
    // Handle booking logic here
    alert('Booking functionality would be implemented here!');
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

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The puja service you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/pujaservice" className="text-orange-600 hover:text-orange-700">
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Navigation */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/pujaservice"
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Services
            </Link>
            <div className="flex items-center space-x-3">
              <button className="p-2.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                <Heart className="h-5 w-5" />
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
        className="relative h-64 sm:h-80 lg:h-96 overflow-hidden"
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
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
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                service.type === 'HOME' 
                  ? 'bg-green-500/90 text-white'
                  : service.type === 'TEMPLE'
                  ? 'bg-blue-500/90 text-white'
                  : 'bg-purple-500/90 text-white'
              }`}>
                {typeDisplayNames[service.type]}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-500/90 text-white">
                {service.category.name}
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
                <span>{service.packages.length} packages available</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
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
                <p className="text-gray-700 leading-relaxed text-lg">
                  {service.description}
                </p>
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

            {/* Reviews */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {[
                  {
                    name: 'Rahul Sharma',
                    initial: 'R',
                    color: 'bg-orange-100 text-orange-600',
                    review: 'Excellent service! The priest was very knowledgeable and performed the puja with complete devotion. Everything was arranged perfectly. Highly recommended!',
                    time: '2 days ago'
                  },
                  {
                    name: 'Priya Gupta',
                    initial: 'P',
                    color: 'bg-blue-100 text-blue-600',
                    review: 'Amazing experience! The priest arrived on time and conducted the puja beautifully. The entire family felt blessed. Will definitely book again.',
                    time: '1 week ago'
                  }
                ].map((review, index) => (
                  <motion.div 
                    key={index}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.3 + index * 0.2 }}
                    className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${review.color}`}>
                        <span className="font-semibold text-lg">{review.initial}</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="ml-2 text-sm text-gray-500">{review.time}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.review}</p>
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
              className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 sticky top-24"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Book Your Puja</h3>
              
              {/* Location & Language Selection */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Select Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">Choose a location</option>
                    {availableLocations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Select Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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

              {/* Package Selection */}
              <AnimatePresence>
                {filteredPackages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8"
                  >
                    <h4 className="font-semibold text-gray-900 mb-4">Select Package</h4>
                    <div className="space-y-3">
                      {filteredPackages.map((pkg) => (
                        <motion.div
                          key={pkg.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedPackage?.id === pkg.id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">
                              {packageTypeDisplayNames[pkg.package_type]}
                            </span>
                            <span className="font-bold text-orange-600">
                              ₹{parseFloat(pkg.price).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{pkg.priest_count} priest{pkg.priest_count > 1 ? 's' : ''}</span>
                            <span className="mx-2">•</span>
                            <span>{pkg.includes_materials ? 'Materials included' : 'Materials not included'}</span>
                          </div>
                        </motion.div>
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
                    <h4 className="font-semibold text-gray-900 mb-4">Schedule Your Puja</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          min={moment().format("YYYY-MM-DD")}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Time
                        </label>
                        <input
                          type="time"
                          value={selectedTime}
                          onChange={handleTimeChange}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                    
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                      >
                        {errorMessage}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Book Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedPackage || !selectedDate || !selectedTime}
                onClick={handleBooking}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  selectedPackage && selectedDate && selectedTime
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedPackage && selectedDate && selectedTime
                  ? `Book Now - ₹${parseFloat(selectedPackage.price).toLocaleString()}`
                  : 'Complete Selection to Book'
                }
              </motion.button>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-orange-500" />
                    <span>+91 9876543210</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-orange-500" />
                    <span>support@okpuja.com</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MessageCircle className="h-4 w-4 mr-2 text-orange-500" />
                    <span>Live Chat Support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
