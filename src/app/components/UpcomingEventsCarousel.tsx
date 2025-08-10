"use client";

import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaChevronLeft, 
  FaChevronRight,
  FaCalendarCheck 
} from "react-icons/fa";
import { usePublicEventStore } from "../stores/publicEventStore";
import { EventData } from "../apiService/eventsApi";
import { format } from "date-fns";

interface UpcomingEventsCarouselProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

const UpcomingEventsCarousel: React.FC<UpcomingEventsCarouselProps> = ({
  limit = 8,
  showHeader = true,
  className = "",
}) => {
  const sliderRef = useRef<Slider | null>(null);
  const { upcomingEvents, loading, error, fetchUpcomingEvents } = usePublicEventStore();

  useEffect(() => {
    fetchUpcomingEvents(limit);
  }, [fetchUpcomingEvents, limit]);

  // Helper function to format date
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        day: format(date, 'dd'),
        month: format(date, 'MMM'),
        year: format(date, 'yyyy'),
        fullDate: format(date, 'MMMM dd, yyyy'),
      };
    } catch {
      return {
        day: '01',
        month: 'Jan',
        year: '2025',
        fullDate: 'January 01, 2025',
      };
    }
  };

  // Helper function to format time
  const formatEventTime = (startTime: string, endTime: string): string => {
    try {
      const start = format(new Date(`2000-01-01T${startTime}`), "h:mm a");
      const end = format(new Date(`2000-01-01T${endTime}`), "h:mm a");
      return `${start} - ${end}`;
    } catch {
      return "All Day";
    }
  };

  // Helper function to calculate days until event
  const getDaysUntil = (eventDate: string): string => {
    try {
      const today = new Date();
      const event = new Date(eventDate);
      const diffTime = event.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
      if (diffDays > 0) return `In ${diffDays} days`;
      return "Past event";
    } catch {
      return "Soon";
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0px",
        },
      },
    ],
    customPaging: () => (
      <div className="w-3 h-3 bg-orange-200 rounded-full transition-all duration-300 hover:bg-orange-400"></div>
    ),
    dotsClass: "slick-dots custom-dots flex justify-center space-x-2 mt-8",
  };

  // Loading Card Component
  const LoadingCard = () => (
    <div className="mx-3">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
        <div className="h-64 bg-gray-200"></div>
        <div className="p-6">
          <div className="space-y-3 mb-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  // Error Component
  const ErrorComponent = () => (
    <div className="mx-3">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div className="text-red-500 mb-4">
          <FaCalendarAlt className="mx-auto text-4xl" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load events</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchUpcomingEvents(limit)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6 shadow-xl">
              <FaCalendarAlt className="w-8 h-8 text-white" />
            </div>
            
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-sm font-semibold rounded-full mb-6 border border-orange-200">
              Sacred Celebrations
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Upcoming Sacred
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Events & Festivals
              </span>
            </h2>
            
            <p className="text-xl leading-relaxed max-w-3xl mx-auto text-gray-600">
              Join thousands of devotees in celebrating these auspicious occasions and 
              traditional Hindu festivals.
            </p>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end mb-8">
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sliderRef.current?.slickPrev()}
              className="p-3 rounded-full bg-white shadow-lg text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition-all duration-300 border border-orange-100"
              aria-label="Previous event"
            >
              <FaChevronLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sliderRef.current?.slickNext()}
              className="p-3 rounded-full bg-white shadow-lg text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition-all duration-300 border border-orange-100"
              aria-label="Next event"
            >
              <FaChevronRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Slider ref={sliderRef} {...settings} className="upcoming-events-slider">
            {loading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <LoadingCard key={index} />
              ))
            ) : error ? (
              // Error state
              <ErrorComponent />
            ) : !Array.isArray(upcomingEvents) || upcomingEvents.length === 0 ? (
              // Empty state
              <div className="mx-3">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <FaCalendarAlt className="mx-auto text-4xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No upcoming events</h3>
                  <p className="text-gray-500">Check back soon for new events and celebrations.</p>
                </div>
              </div>
            ) : (
              // Events from API
              upcomingEvents.map((event: EventData, index: number) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="px-3"
                >
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full border border-gray-100">
                    {/* Event Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={event.imagekit_thumbnail_url || event.thumbnail_url || "/placeholder-service.jpg"}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                      
                      {/* Days Until Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full shadow-lg">
                          {getDaysUntil(event.event_date)}
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {event.is_featured && (
                        <div className="absolute top-4 right-4">
                          <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-semibold rounded-full shadow-lg">
                            Featured
                          </div>
                        </div>
                      )}

                      {/* Date Badge */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center shadow-lg">
                          <div className="text-2xl font-bold text-gray-800">
                            {formatEventDate(event.event_date).day}
                          </div>
                          <div className="text-xs font-medium text-gray-600 uppercase">
                            {formatEventDate(event.event_date).month}
                          </div>
                        </div>
                      </div>

                      {/* Event Title Overlay */}
                      <div className="absolute bottom-4 right-4 left-20">
                        <h3 className="text-white font-bold text-xl group-hover:text-orange-200 transition-colors duration-300">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="text-orange-500 mr-3 text-sm flex-shrink-0" />
                          <span className="text-sm font-medium">
                            {formatEventDate(event.event_date).fullDate}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <FaClock className="text-orange-500 mr-3 text-sm flex-shrink-0" />
                          <span className="text-sm">
                            {formatEventTime(event.start_time, event.end_time)}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="text-orange-500 mr-3 text-sm flex-shrink-0" />
                          <span className="text-sm truncate">
                            {event.location}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Event ID: #{event.id}
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Learn More
                          <FaCalendarCheck className="ml-2 text-sm" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </Slider>
        </div>

        {/* View All Events CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaCalendarAlt className="mr-3 text-lg" />
            View All Events
            <FaChevronRight className="ml-3 text-lg" />
          </motion.button>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .upcoming-events-slider .slick-list {
          margin: 0 -12px;
          padding-bottom: 20px !important;
        }

        .upcoming-events-slider .slick-slide > div {
          height: 100%;
        }

        .upcoming-events-slider .slick-track {
          display: flex !important;
        }

        .upcoming-events-slider .slick-slide {
          height: auto !important;
        }

        .upcoming-events-slider .slick-slide > div > div {
          height: 100%;
        }

        .custom-dots {
          bottom: -10px !important;
        }

        .custom-dots li {
          margin: 0 4px !important;
        }

        .custom-dots li div {
          transition: all 0.3s ease !important;
        }

        .custom-dots li.slick-active div {
          background: linear-gradient(135deg, #f97316, #dc2626) !important;
          transform: scale(1.3);
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default UpcomingEventsCarousel;
