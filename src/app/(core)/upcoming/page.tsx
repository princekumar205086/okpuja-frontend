"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaClock, FaSpinner } from "react-icons/fa";
import { usePublicEventStore } from "../../stores/publicEventStore";
import { EventData } from "../../apiService/eventsApi";
import { format } from "date-fns";

const UpcomingEvents = () => {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const { upcomingEvents, loading, error, fetchUpcomingEvents } = usePublicEventStore();

  useEffect(() => {
    fetchUpcomingEvents(6); // Fetch 6 upcoming events
  }, [fetchUpcomingEvents]);

  // Helper function to format date
  const formatEventDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  // Helper function to format time
  const formatEventTime = (startTime: string, endTime: string): string => {
    try {
      const start = format(new Date(`2000-01-01T${startTime}`), "h:mm a");
      const end = format(new Date(`2000-01-01T${endTime}`), "h:mm a");
      return `${start} - ${end}`;
    } catch {
      return "All Day Event";
    }
  };

  // Helper function to get gradient color based on event type or use default
  const getEventGradient = (index: number): string => {
    const gradients = [
      "from-pink-500 to-rose-500",
      "from-orange-500 to-red-500", 
      "from-yellow-500 to-orange-500",
      "from-purple-500 to-pink-500",
      "from-blue-500 to-purple-500",
      "from-green-500 to-blue-500"
    ];
    return gradients[index % gradients.length];
  };

  // Loading component
  const LoadingCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <div className="h-64 bg-gray-200"></div>
      <div className="p-6">
        <div className="space-y-3 mb-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  // Error component
  const ErrorComponent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full bg-red-50 border border-red-200 rounded-xl p-8 text-center"
    >
      <div className="text-red-500 mb-4">
        <FaCalendarAlt className="mx-auto text-4xl" />
      </div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load events</h3>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={() => fetchUpcomingEvents(6)}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Try Again
      </button>
    </motion.div>
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 ">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-orange-400/10 to-red-400/10 -skew-y-2 transform -translate-y-20"></div>
        <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-pink-400/20 to-rose-400/20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          {/* <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-8 shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.6 }}
          >
            <FaCalendarAlt className="w-10 h-10 text-white" />
          </motion.div> */}
          
          <span className="inline-block px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-sm font-semibold rounded-full mb-6 border border-orange-200">
            Sacred Celebrations
          </span>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold  mb-8 ">
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">Upcoming Sacred{" "}</span>
            <span className="relative inline-block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ml-0 sm:ml-3">
              Events & Festivals
              <motion.div 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </h2>
          
          <p className="text-xl leading-relaxed max-w-3xl mx-auto text-gray-600">
            Immerse yourself in India&apos;s rich spiritual heritage through these upcoming 
            sacred celebrations and traditional ceremonies.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {loading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <LoadingCard />
              </motion.div>
            ))
          ) : error ? (
            // Error state
            <ErrorComponent />
          ) : upcomingEvents.length === 0 ? (
            // Empty state
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full bg-gray-50 border border-gray-200 rounded-xl p-12 text-center"
            >
              <div className="text-gray-400 mb-4">
                <FaCalendarAlt className="mx-auto text-4xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No upcoming events</h3>
              <p className="text-gray-500">Check back soon for new events and celebrations.</p>
            </motion.div>
          ) : (
            // Events list
            upcomingEvents.map((event: EventData, index: number) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
                className="group"
              >
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 h-full">
                  {/* Event Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={event.imagekit_thumbnail_url || event.thumbnail_url || "/placeholder-service.jpg"}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                    
                    {/* Gradient Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`px-4 py-2 bg-gradient-to-r ${getEventGradient(index)} text-white text-sm font-semibold rounded-full shadow-lg`}>
                        {event.days_until === 0 ? 'Today' : event.days_until === 1 ? 'Tomorrow' : `In ${event.days_until} days`}
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {event.is_featured && (
                      <div className="absolute top-4 right-4">
                        <div className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg">
                          Featured
                        </div>
                      </div>
                    )}

                    {/* Event Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-xl mb-2 group-hover:text-orange-200 transition-colors duration-300">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="text-orange-500 mr-3 text-sm" />
                        <span className="text-sm font-medium">{formatEventDate(event.event_date)}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <FaClock className="text-orange-500 mr-3 text-sm" />
                        <span className="text-sm font-medium">{formatEventTime(event.start_time, event.end_time)}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="text-orange-500 mr-3 text-sm" />
                        <span className="text-sm font-medium">{event.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <motion.button
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors duration-300"
                      >
                        Learn More
                        <FaArrowRight className="ml-2 text-xs transition-transform duration-300 group-hover:translate-x-1" />
                      </motion.button>

                      {event.registration_link && (
                        <a
                          href={event.registration_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 underline"
                        >
                          Register
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="event-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#event-pattern)" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-6">
                <FaCalendarAlt className="text-2xl text-white" />
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                Don&apos;t Miss These Sacred Celebrations
              </h3>
              
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of devotees in celebrating these auspicious occasions. 
                Book your puja services and be part of the divine experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Book Puja Service
                  <FaArrowRight className="ml-3 text-lg" />
                </motion.button>
                
                <Link href="/events">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-300"
                  >
                    View All Events
                    <FaCalendarAlt className="ml-3 text-lg" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingEvents;

// Add CSS for line clamping
const styles = `
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
