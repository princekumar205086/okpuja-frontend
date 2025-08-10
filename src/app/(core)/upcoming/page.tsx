"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import UpcomingEventsCarousel from "../../components/UpcomingEventsCarousel";

const UpcomingEventsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-orange-400/10 to-red-400/10 -skew-y-2 transform -translate-y-20"></div>
          <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-pink-400/20 to-rose-400/20 blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-sm font-semibold rounded-full mb-6 border border-orange-200">
              Sacred Celebrations
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                Upcoming Sacred{" "}
              </span>
              <span className="relative inline-block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ml-0 sm:ml-3">
                Events & Festivals
                <motion.div 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </span>
            </h1>
            
            <p className="text-xl leading-relaxed max-w-3xl mx-auto text-gray-600 mb-8">
              Immerse yourself in India&apos;s rich spiritual heritage through these upcoming 
              sacred celebrations and traditional ceremonies.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book Puja Service
                <FaArrowRight className="ml-3 text-lg" />
              </motion.button>
              
              <Link href="/events">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-white/80 hover:bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 backdrop-blur-sm transition-all duration-300"
                >
                  View All Events
                  <FaCalendarAlt className="ml-3 text-lg" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Carousel */}
      <UpcomingEventsCarousel limit={12} showHeader={false} />

      {/* Additional Information Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
              Why Celebrate with Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
              Experience authentic Hindu festivals and pujas with our experienced pandits, 
              traditional rituals, and comprehensive spiritual guidance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCalendarAlt className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Authentic Rituals</h3>
                <p className="text-gray-600">
                  Traditional ceremonies performed according to ancient Vedic scriptures with proper mantras and procedures.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCalendarAlt className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Expert Pandits</h3>
                <p className="text-gray-600">
                  Learned and experienced pandits who understand the significance and proper execution of each ritual.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCalendarAlt className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Complete Support</h3>
                <p className="text-gray-600">
                  From planning to execution, we provide all necessary materials and guidance for your spiritual journey.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UpcomingEventsPage;
