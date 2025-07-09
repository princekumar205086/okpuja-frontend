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
import { decryptId, encryptId } from '../encryption';

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
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors group text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Services</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button className="p-2 sm:p-2.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all">
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
                    <div className="space-y-4">
                      {filteredPackages.map((pkg) => (
                        <motion.div
                          key={pkg.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            selectedPackage?.id === pkg.id
                              ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg'
                              : 'border-gray-200 hover:border-orange-300 hover:shadow-md bg-white'
                          }`}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          {/* Package Type Badge */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              selectedPackage?.id === pkg.id
                                ? 'bg-orange-500 text-white'
                                : 'bg-orange-100 text-orange-600'
                            }`}>
                              {packageTypeDisplayNames[pkg.package_type]}
                            </span>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-orange-600">
                                ₹{parseFloat(pkg.price).toLocaleString()}
                              </span>
                              <div className="text-xs text-gray-500">per service</div>
                            </div>
                          </div>

                          {/* Package Description */}
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            {pkg.description}
                          </p>

                          {/* Package Features */}
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-2 text-green-500" />
                              <span className="text-gray-700">
                                <strong>{pkg.priest_count}</strong> Professional Priest{pkg.priest_count > 1 ? 's' : ''}
                              </span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span className="text-gray-700">
                                {pkg.includes_materials ? 'All Puja Materials Included' : 'Materials Not Included'}
                              </span>
                            </div>

                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-green-500" />
                              <span className="text-gray-700">
                                Complete Vedic Rituals
                              </span>
                            </div>

                            <div className="flex items-center text-sm">
                              <Shield className="h-4 w-4 mr-2 text-green-500" />
                              <span className="text-gray-700">
                                Authentic Procedures
                              </span>
                            </div>
                          </div>

                          {/* Selection Indicator */}
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
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Time
                        </label>
                        <input
                          type="time"
                          value={selectedTime}
                          onChange={handleTimeChange}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 hover:bg-white transition-all"
                        />
                      </div>
                    </div>
                    
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
                      >
                        <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
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
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  selectedPackage && selectedDate && selectedTime
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
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
                <h4 className="font-semibold text-gray-900 mb-4 text-center">Need Assistance?</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
                    <Phone className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">+91 9876543210</span>
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
            {mockPujaServices
              .filter(s => s.id !== service.id && s.category.id === service.category.id)
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
                      src={relatedService.image}
                      alt={relatedService.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        relatedService.type === 'HOME' 
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
                          ₹{Math.min(...relatedService.packages.map(p => parseFloat(p.price))).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
          
          {mockPujaServices.filter(s => s.id !== service.id && s.category.id === service.category.id).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No related services found in this category.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
