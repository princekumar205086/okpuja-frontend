"use client";
import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { BsChevronLeft, BsChevronRight, BsCalendar3, BsClock, BsGeoAlt, BsArrowRight } from "react-icons/bs";
import { FaRegCalendarAlt, FaSpinner } from "react-icons/fa";
import { usePublicEventStore } from "../../stores/publicEventStore";
import { EventData } from "../../apiService/eventsApi";
import { format } from "date-fns";

export default function Events() {
  // Reference to the slider to control it with custom navigation
  const sliderRef = useRef<Slider | null>(null);
  const { events, loading, error, fetchEvents } = usePublicEventStore();

  useEffect(() => {
    fetchEvents({ 
      status: 'PUBLISHED',
      ordering: 'event_date',
      page_size: 20 
    });
  }, [fetchEvents]);

  // Helper function to format date
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        day: format(date, 'EEEE'),
        number: format(date, 'd'),
        month: format(date, 'MMMM'),
      };
    } catch {
      return {
        day: 'Friday',
        number: '1',
        month: 'January',
      };
    }
  };

  // Loading component
  const LoadingSlide = () => (
    <div className="px-3">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
        <div className="h-56 bg-gray-200"></div>
        <div className="p-6">
          <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
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
      <div className="w-3 h-3 bg-orange-200 rounded-full mt-8 transition-all duration-300 hover:bg-orange-400"></div>
    ),
    dotsClass: "slick-dots custom-dots flex justify-center space-x-2",
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

  // Error component
  const ErrorComponent = () => (
    <div className="px-3">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <div className="text-red-500 mb-4">
          <BsCalendar3 className="mx-auto text-4xl" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load events</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchEvents({ status: 'PUBLISHED', ordering: 'event_date', page_size: 20 })}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
              <BsCalendar3 className="text-white text-2xl" />
            </div>
          </div>
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-sm font-semibold uppercase tracking-wider rounded-full mb-4">
            Religious Calendar
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
            <span className="text-gray-900">Upcoming Sacred Events</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-6 rounded-full"></div>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
            Discover and prepare for important religious celebrations. Book your puja services 
            in advance to ensure spiritual guidance on these auspicious occasions.
          </p>
        </motion.div>

        {/* Custom Navigation */}
        <div className="flex justify-center sm:justify-end mb-8">
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sliderRef.current?.slickPrev()}
              className="p-3 rounded-full bg-white shadow-lg text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition-all duration-300 border border-orange-100"
              aria-label="Previous slide"
            >
              <BsChevronLeft size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sliderRef.current?.slickNext()}
              className="p-3 rounded-full bg-white shadow-lg text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition-all duration-300 border border-orange-100"
              aria-label="Next slide"
            >
              <BsChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <Slider ref={sliderRef} {...settings} className="events-slider">
            {loading ? (
              // Loading state
              Array.from({ length: 4 }).map((_, index) => (
                <LoadingSlide key={index} />
              ))
            ) : error ? (
              // Error state
              <ErrorComponent />
            ) : events.length === 0 ? (
              // Empty state
              <div className="px-3">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <BsCalendar3 className="mx-auto text-4xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No events available</h3>
                  <p className="text-gray-500">Check back soon for new events and celebrations.</p>
                </div>
              </div>
            ) : (
              // Events from API
              events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="px-3"
                >
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full">
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center p-3 rounded-xl shadow-lg">
                        <div className="text-2xl font-bold leading-none mb-1">
                          {formatEventDate(event.event_date).number}
                        </div>
                        <div className="text-xs font-medium uppercase tracking-wide">
                          {formatEventDate(event.event_date).month.slice(0, 3)}
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={event.imagekit_thumbnail_url || event.thumbnail_url || "/placeholder-service.jpg"}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="flex items-center px-3 py-1 bg-orange-100 rounded-full">
                          <BsClock className="text-orange-600 text-sm mr-2" />
                          <span className="text-orange-800 text-xs font-medium">
                            {formatEventTime(event.start_time, event.end_time)}
                          </span>
                        </div>
                        {event.is_featured && (
                          <div className="ml-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-semibold rounded-full">
                            Featured
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-gray-800 text-xl mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                        {event.title}
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {event.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-xs">
                          <BsGeoAlt className="mr-1" />
                          <span>{event.location}</span>
                        </div>
                        
                        <motion.button 
                          whileHover={{ x: 5 }}
                          className="flex items-center text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors duration-300"
                        >
                          Learn More
                          <BsArrowRight className="ml-2 text-lg" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </Slider>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <motion.a
            href="/calendar"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaRegCalendarAlt className="mr-3 text-lg" />
            View Complete Calendar
            <svg
              className="w-5 h-5 ml-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </motion.a>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .events-slider .slick-list {
          margin: 0 -12px;
          padding-bottom: 20px !important;
        }

        .events-slider .slick-slide > div {
          height: 100%;
        }

        .events-slider .slick-track {
          display: flex !important;
        }

        .events-slider .slick-slide {
          height: auto !important;
        }

        .events-slider .slick-slide > div > div {
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
}
