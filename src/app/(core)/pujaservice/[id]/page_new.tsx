'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Clock, MapPin, Users, Star, Share2, Heart, CheckCircle, 
  Calendar, Globe, Shield, Award, Phone, Mail, MessageCircle, Package2,
  Sparkles, Timer, Gift, Info
} from 'lucide-react';
import moment from 'moment-timezone';
import { PujaService, Package } from '../types';
import { mockPujaServices, typeDisplayNames, languageDisplayNames, packageTypeDisplayNames } from '../mockData';
import { decryptId } from '../encryption';

// Set timezone to IST
moment.tz.setDefault("Asia/Kolkata");

export default function ServiceDetailPage() {
  const params = useParams();
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
  const [showAllIncludes, setShowAllIncludes] = useState(false);

  // Decrypt ID and find service
  useEffect(() => {
    const loadService = async () => {
      setLoading(true);
      try {
        const serviceId = decryptId(encryptedId);
        if (!serviceId) {
          setService(null);
          setLoading(false);
          return;
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const foundService = mockPujaServices.find(s => s.id === parseInt(serviceId));
        setService(foundService || null);
      } catch (error) {
        console.error('Error loading service:', error);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    if (encryptedId) {
      loadService();
    }
  }, [encryptedId]);

  // Get unique locations and languages
  const availableLocations = useMemo(() => {
    if (!service) return [];
    return [...new Set(service.packages.map(pkg => pkg.location))];
  }, [service]);

  const availableLanguages = useMemo(() => {
    if (!service) return [];
    return [...new Set(service.packages.map(pkg => pkg.language))];
  }, [service]);

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
  }, [service, selectedLocation, selectedLanguage]);

  // Date and Time validation
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    const currentDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
    if (date < currentDate) {
      setErrorMessage("Date cannot be in the past.");
    } else {
      setErrorMessage("");
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    const currentDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
    const currentTime = moment().tz("Asia/Kolkata").format("HH:mm");

    if (selectedDate === currentDate && time < currentTime) {
      setErrorMessage("Time cannot be in the past.");
    } else {
      setErrorMessage("");
      setSelectedTime(time);
    }
  };

  const handleBooking = () => {
    if (!selectedPackage || !selectedDate || !selectedTime) {
      alert('Please select all required options before booking.');
      return;
    }

    const bookingData = {
      service: service?.title,
      package: selectedPackage.package_type,
      location: selectedLocation,
      language: selectedLanguage,
      date: selectedDate,
      time: selectedTime,
      price: selectedPackage.price
    };

    console.log('Booking data:', bookingData);
    alert('Booking request submitted successfully! You will receive a confirmation call within 2 hours.');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 mt-4 font-medium"
          >
            Loading sacred service details...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Service not found
  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-12 h-12 text-orange-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">The sacred puja service you&apos;re looking for doesn&apos;t exist or may have been moved to a different location.</p>
          <Link 
            href="/pujaservice"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-orange-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Services
          </Link>
        </motion.div>
      </div>
    );
  }

  const whatIncludes = [
    "Qualified & experienced priest",
    "All sacred mantras & rituals",
    "Proper vedic procedures",
    "Post-puja guidance",
    "Flexible timing",
    "Devotional atmosphere",
    "Sacred materials (if included)",
    "Ritual explanations",
    "Spiritual blessings",
    "Prayer documentation"
  ];

  const reviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      rating: 5,
      date: "2 days ago",
      comment: "Excellent service! The priest was very knowledgeable and performed the puja with complete devotion. Everything was arranged perfectly. Highly recommended!",
      avatar: "R"
    },
    {
      id: 2,
      name: "Priya Gupta",
      rating: 5,
      date: "1 week ago",
      comment: "Amazing experience! The priest arrived on time and conducted the puja beautifully. The entire family felt blessed. Will definitely book again.",
      avatar: "P"
    },
    {
      id: 3,
      name: "Anil Kumar",
      rating: 4,
      date: "2 weeks ago",
      comment: "Very professional service. The rituals were performed according to proper traditions. The priest was patient in explaining the significance of each step.",
      avatar: "A"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Navigation */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/pujaservice"
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Services</span>
            </Link>
            <div className="flex items-center space-x-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all"
              >
                <Share2 className="h-5 w-5" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
              >
                <Heart className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Image */}
              <div className="relative h-80 sm:h-96 lg:h-[28rem]">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Top badges */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <motion.span 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md ${
                      service.type === 'HOME' 
                        ? 'bg-green-500/90 text-white'
                        : service.type === 'TEMPLE'
                        ? 'bg-blue-500/90 text-white'
                        : 'bg-purple-500/90 text-white'
                    }`}
                  >
                    {typeDisplayNames[service.type]}
                  </motion.span>
                  
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center shadow-lg"
                  >
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-bold text-gray-800">4.8</span>
                    <span className="text-xs text-gray-600 ml-1">(156)</span>
                  </motion.div>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.span 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-block bg-orange-500/90 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md mb-4"
                  >
                    {service.category.name}
                  </motion.span>
                  
                  <motion.h1 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                  >
                    {service.title}
                  </motion.h1>
                  
                  <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-wrap items-center gap-6 text-white/90"
                  >
                    <div className="flex items-center bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{Math.floor(service.duration_minutes / 60)}h {service.duration_minutes % 60}m</span>
                    </div>
                    <div className="flex items-center bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                      <Package2 className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{service.packages.length} packages</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 sm:p-10">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="prose prose-gray max-w-none"
                >
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {service.description}
                  </p>
                </motion.div>

                {/* Trust indicators */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
                >
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">Verified Priests</h4>
                      <p className="text-sm text-green-600">Background checked</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                    <Award className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Authentic Rituals</h4>
                      <p className="text-sm text-blue-600">Traditional procedures</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                    <MessageCircle className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-purple-800">24/7 Support</h4>
                      <p className="text-sm text-purple-600">Always available</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* What's Included */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl p-8 sm:p-10">
              <div className="flex items-center mb-8">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What&apos;s Included</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(showAllIncludes ? whatIncludes : whatIncludes.slice(0, 6)).map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center p-3 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
              
              {whatIncludes.length > 6 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAllIncludes(!showAllIncludes)}
                  className="mt-6 text-orange-600 hover:text-orange-700 font-semibold"
                >
                  {showAllIncludes ? 'Show Less' : `View All ${whatIncludes.length} Features`}
                </motion.button>
              )}
            </motion.div>

            {/* Reviews Section */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-500 mr-3 fill-current" />
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Reviews</h2>
                    <p className="text-gray-600">4.8 out of 5 stars (156 reviews)</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div 
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{review.name}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-3xl shadow-xl p-8 sticky top-24"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Sacred Ritual</h3>
                <p className="text-gray-600">Experience divine blessings with authentic ceremonies</p>
              </div>

              {/* Location & Language Selection */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    <MapPin className="inline h-5 w-5 mr-2" />
                    Select Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    disabled={availableLocations.length === 0}
                  >
                    <option value="">Choose a location</option>
                    {availableLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    <Globe className="inline h-5 w-5 mr-2" />
                    Select Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    disabled={availableLanguages.length === 0}
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
              {filteredPackages.length > 0 && (
                <div className="mb-8">
                  <label className="block text-gray-700 font-semibold mb-4">
                    <Gift className="inline h-5 w-5 mr-2" />
                    Select Package
                  </label>
                  <div className="space-y-3">
                    {filteredPackages.map((pkg) => (
                      <motion.div
                        key={pkg.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPackage?.id === pkg.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                        }`}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900">{packageTypeDisplayNames[pkg.package_type]}</h4>
                          <span className="text-xl font-bold text-orange-600">₹{pkg.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2" dangerouslySetInnerHTML={{ __html: pkg.description }} />
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{pkg.priest_count} priest{pkg.priest_count > 1 ? 's' : ''}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date & Time Selection */}
              {selectedPackage && (
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      <Calendar className="inline h-5 w-5 mr-2" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      min={moment().tz("Asia/Kolkata").format("YYYY-MM-DD")}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      <Timer className="inline h-5 w-5 mr-2" />
                      Select Time
                    </label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={handleTimeChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {errorMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-xl"
                    >
                      <div className="flex items-center text-red-700">
                        <Info className="h-4 w-4 mr-2" />
                        <p className="text-sm">{errorMessage}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Booking Button */}
              <motion.button
                whileHover={{ scale: selectedPackage && selectedDate && selectedTime && !errorMessage ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedPackage || !selectedDate || !selectedTime || !!errorMessage}
                onClick={handleBooking}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                  selectedPackage && selectedDate && selectedTime && !errorMessage
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedPackage && selectedDate && selectedTime 
                  ? `Book Now • ₹${selectedPackage.price}`
                  : 'Complete Selection to Book'
                }
              </motion.button>

              {/* Contact Info */}
              <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>Call: +91 9876543210</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Email: support@okpuja.com</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
