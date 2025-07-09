"use client";

import React from 'react';
import { motion } from 'framer-motion';

const MissionVision = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-10"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse hidden md:block"></div>
      <div className="absolute bottom-20 right-16 w-32 h-32 bg-red-200 rounded-full opacity-15 animate-bounce hidden lg:block" style={{ animationDuration: '3s' }}></div>
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse hidden md:block" style={{ animationDelay: '1s' }}></div>

      <motion.div 
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6 sm:mb-8"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent mb-4 sm:mb-6">
            Our Mission & Vision
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Bridging ancient wisdom with modern convenience for spiritual seekers worldwide
          </p>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Mission Card */}
          <motion.div 
            variants={cardVariants}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl sm:rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 h-full">
              {/* Mission Icon */}
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                Our Mission
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  At OKPUJA, our mission is to provide <span className="font-semibold text-orange-600">authentic and accessible spiritual experiences</span> through online puja services, astrology consultations, and personalized spiritual guidance.
                </p>
                
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  We aim to bridge the gap between devotees and trusted, experienced practitioners, helping you lead a life of <span className="font-semibold text-red-600">peace, prosperity, and well-being</span>.
                </p>
                
                {/* Mission Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  {[
                    { icon: "🕉️", text: "Authentic Rituals" },
                    { icon: "🔮", text: "Expert Guidance" },
                    { icon: "🌟", text: "Spiritual Growth" },
                    { icon: "🤝", text: "Trusted Network" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg bg-orange-50/50 hover:bg-orange-50 transition-colors duration-200">
                      <span className="text-lg sm:text-xl">{feature.icon}</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            variants={cardVariants}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl sm:rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 h-full">
              {/* Vision Icon */}
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                Our Vision
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  Our vision is to be the <span className="font-semibold text-red-600">global leader in delivering online spiritual services</span>, offering a seamless and trustworthy platform that connects individuals to ancient rituals and astrological insights.
                </p>
                
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  We aspire to empower people worldwide to discover and embrace their <span className="font-semibold text-orange-600">spiritual journeys</span>, no matter where they are.
                </p>
                
                {/* Vision Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  {[
                    { icon: "🌍", text: "Global Reach" },
                    { icon: "⚡", text: "Seamless Experience" },
                    { icon: "🎯", text: "Personalized Journey" },
                    { icon: "🚀", text: "Innovation" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg bg-red-50/50 hover:bg-red-50 transition-colors duration-200">
                      <span className="text-lg sm:text-xl">{feature.icon}</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Call-to-Action */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 sm:mt-16 lg:mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white shadow-2xl max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
              Join Our Spiritual Community
            </h3>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Experience the perfect blend of ancient wisdom and modern convenience. Start your spiritual journey with us today.
            </p>
            <motion.button
              className="bg-white text-orange-600 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl sm:rounded-2xl hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Our Services
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MissionVision;
