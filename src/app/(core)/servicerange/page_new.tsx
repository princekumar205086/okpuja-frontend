"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaSun, FaStar, FaVideo, FaEllipsisH, FaArrowRight } from "react-icons/fa";

interface ServiceItem {
  title: string;
  image: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
}

export default function ServiceRange() {
  const services: ServiceItem[] = [
    {
      title: "Traditional Puja Services",
      image: "/image/puja.jpeg",
      description: "Authentic rituals performed by certified pandits at your preferred location with complete arrangements",
      icon: <FaSun className="text-2xl" />,
      features: ["Certified Pandits", "Complete Arrangements", "All Locations", "Traditional Authentic"],
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Astrology Consultation",
      image: "/image/astrology.jpeg", 
      description: "Personalized astrological guidance and detailed consultations for all your life decisions and concerns",
      icon: <FaStar className="text-2xl" />,
      features: ["Birth Chart Analysis", "Future Predictions", "Remedial Solutions", "Life Guidance"],
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Live E-Puja Services",
      image: "/image/E-puja.jpeg",
      description: "Experience divine blessings through high-quality live-streamed ceremonies from sacred temples",
      icon: <FaVideo className="text-2xl" />,
      features: ["Live Streaming", "HD Quality", "Sacred Temples", "Interactive Experience"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Specialized Services",
      image: "/image/otherservice.jpeg",
      description: "Comprehensive spiritual services including special ceremonies, consultations and customized rituals",
      icon: <FaEllipsisH className="text-2xl" />,
      features: ["Custom Rituals", "Special Ceremonies", "Spiritual Guidance", "Expert Consultation"],
      color: "from-green-500 to-teal-500"
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 sm:py-24 lg:py-28 bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16 lg:mb-20"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-8 shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.6 }}
          >
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </motion.div>
          
          <span className="inline-block px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-sm font-semibold rounded-full mb-6 border border-orange-200">
            Our Sacred Offerings
          </span>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8 leading-tight">
            Comprehensive Range of{" "}
            <span className="relative inline-block">
              Sacred Services
              <motion.div 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </h2>
          
          <p className="text-xl leading-relaxed max-w-3xl mx-auto mb-8 text-gray-600">
            Transform your spiritual journey with our authentic and comprehensive services. 
            Experience divine blessings through traditional rituals, expert guidance, and modern convenience.
          </p>
        </motion.div>

        {/* Enhanced Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group"
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full">
                {/* Enhanced Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className={`p-3 bg-gradient-to-r ${service.color} rounded-xl shadow-lg text-white`}>
                      {service.icon}
                    </div>
                  </div>

                  {/* Floating Features */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="text-white text-xs font-medium">
                            • {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  
                  <motion.button
                    className="inline-flex items-center text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Explore Service
                    <FaArrowRight className="ml-2 text-xs transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Call-to-Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cta-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-pattern)" />
              </svg>
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
                  <FaStar className="text-2xl text-white" />
                </div>
              </motion.div>
              
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Begin Your Spiritual Journey?
              </h3>
              
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Book your personalized puja service today and experience the divine connection 
                with expert pandits and authentic rituals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Book Service Now
                  <FaArrowRight className="ml-3 text-lg" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-300"
                >
                  Learn More
                  <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
