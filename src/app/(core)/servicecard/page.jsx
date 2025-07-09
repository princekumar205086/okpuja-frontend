"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ServiceCard() {
  const serviceData = [
    {
      image: "/image/havan kund.jpeg",
      number: "40000+",
      text: "Pujas and homas performed",
      icon: "🔥",
      bgGradient: "from-orange-500 to-red-500",
      iconBg: "bg-orange-100 text-orange-600"
    },
    {
      image: "/image/pandits.jpeg",
      number: "1200+",
      text: "Pandits and Purohits",
      icon: "🙏",
      bgGradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-100 text-amber-600"
    },
    {
      image: "/image/deep.jpeg",
      number: "400+",
      text: "Total unique services",
      icon: "✨",
      bgGradient: "from-yellow-500 to-amber-500",
      iconBg: "bg-yellow-100 text-yellow-600"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const numberVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "backOut"
      }
    }
  };

  return (
    <section className="relative py-12 md:py-20 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-16 right-16 w-6 h-6 bg-orange-400 rounded-full animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-32 left-20 w-4 h-4 bg-amber-400 rounded-full animate-pulse hidden lg:block"></div>
      <div className="absolute top-1/3 right-1/4 w-8 h-8 border-2 border-orange-300 rounded-full hidden lg:block"></div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2">
            <span className="text-gray-900">Our Impact in</span> 
            <span className="block sm:inline bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ml-0 sm:ml-3">
              Numbers
            </span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transforming lives through authentic spiritual practices and connecting devotees with divine blessings
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {serviceData.map((item, index) => (
            <motion.div
              key={index}
              className="group"
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className="relative h-full p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <div className={`w-full h-full bg-gradient-to-br ${item.bgGradient} rounded-full transform translate-x-8 -translate-y-8`}></div>
                </div>

                {/* Icon badge */}
                <div className={`absolute top-6 right-6 ${item.iconBg} rounded-2xl w-12 h-12 flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>

                {/* Card content */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Image with enhanced styling */}
                  <div className="relative w-24 h-24 md:w-28 md:h-28 mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 p-1 group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      <Image
                        alt={item.text}
                        src={item.image}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        fill
                        quality={90}
                        sizes="(max-width: 768px) 6rem, 7rem"
                      />
                    </div>
                  </div>

                  {/* Counter number with enhanced animation */}
                  <motion.div 
                    className="mb-3 relative"
                    variants={numberVariants}
                  >
                    <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {item.number}
                    </p>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-30"></div>
                  </motion.div>

                  {/* Service description with better typography */}
                  <p className="text-gray-700 text-base md:text-lg font-medium leading-relaxed max-w-xs">
                    {item.text}
                  </p>

                  {/* Animated accent line */}
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mt-6 group-hover:w-24 transition-all duration-500"></div>
                </div>

                {/* Subtle border glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-gray-600 text-lg mb-6">
            Ready to be part of our spiritual community?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Explore Our Services
          </button>
        </motion.div>
      </div>
    </section>
  );
}