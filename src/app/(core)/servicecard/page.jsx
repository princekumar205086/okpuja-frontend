"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

export default function ServiceCard() {
  const [inView, setInView] = useState(false);
  const [counters, setCounters] = useState({ 0: 0, 1: 0, 2: 0 });

  const serviceData = [
    {
      image: "/image/havan kund.jpeg",
      number: 40000,
      suffix: "+",
      text: "Sacred Pujas & Homas Performed",
      description: "Authentic spiritual ceremonies conducted with devotion",
      icon: "🔥",
      bgGradient: "from-amber-50 via-orange-50 to-red-50",
      cardGradient: "from-orange-500/5 via-red-500/5 to-amber-500/5",
      borderGradient: "from-orange-200 via-red-200 to-amber-200",
      accentColor: "text-orange-600",
      shadowColor: "shadow-orange-200/50"
    },
    {
      image: "/image/pandits.jpeg",
      number: 1200,
      suffix: "+",
      text: "Expert Pandits & Purohits",
      description: "Learned scholars dedicated to spiritual guidance",
      icon: "🙏",
      bgGradient: "from-indigo-50 via-purple-50 to-pink-50",
      cardGradient: "from-indigo-500/5 via-purple-500/5 to-pink-500/5",
      borderGradient: "from-indigo-200 via-purple-200 to-pink-200",
      accentColor: "text-indigo-600",
      shadowColor: "shadow-indigo-200/50"
    },
    {
      image: "/image/deep.jpeg",
      number: 400,
      suffix: "+",
      text: "Comprehensive Services",
      description: "Diverse spiritual solutions for every need",
      icon: "✨",
      bgGradient: "from-emerald-50 via-teal-50 to-cyan-50",
      cardGradient: "from-emerald-500/5 via-teal-500/5 to-cyan-500/5",
      borderGradient: "from-emerald-200 via-teal-200 to-cyan-200",
      accentColor: "text-emerald-600",
      shadowColor: "shadow-emerald-200/50"
    },
  ];

  // Counter animation
  useEffect(() => {
    if (inView) {
      serviceData.forEach((item, index) => {
        let current = 0;
        const increment = item.number / 100;
        const timer = setInterval(() => {
          current += increment;
          if (current >= item.number) {
            current = item.number;
            clearInterval(timer);
          }
          setCounters(prev => ({ ...prev, [index]: Math.floor(current) }));
        }, 20);
      });
    }
  }, [inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      y: 50, 
      opacity: 0, 
      scale: 0.9,
      rotateX: -15
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 80,
        duration: 0.6
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-48 h-48 bg-gradient-to-br from-orange-300/20 via-pink-300/20 to-purple-300/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-br from-blue-300/20 via-indigo-300/20 to-purple-300/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-emerald-300/15 via-teal-300/15 to-cyan-300/15 rounded-full blur-2xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>

      {/* Floating geometric elements with enhanced design */}
      <motion.div 
        className="absolute top-24 right-16 w-4 h-4 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full shadow-lg"
        animate={floatingAnimation}
      />
      <motion.div 
        className="absolute bottom-40 left-20 w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full shadow-lg"
        animate={{
          ...floatingAnimation,
          transition: { ...floatingAnimation.transition, delay: 2 }
        }}
      />
      <motion.div 
        className="absolute top-1/3 right-1/4 w-3 h-3 border-2 border-gradient-to-br from-emerald-400 to-teal-400 rounded-full"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.5, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative py-16 md:py-24">
        {/* Enhanced Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 text-gray-700 rounded-full text-sm font-medium tracking-wide border border-orange-200/50">
              ✨ Our Spiritual Journey in Numbers
            </span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Transforming lives
            </span>
            <span className="bg-gradient-to-r from-orange-500  to-yellow-600 bg-clip-text text-transparent">
              &nbsp;through devotion
            </span>
          </h2>
          
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="h-1.5 w-32 bg-gradient-to-r from-orange-500 via-white-500 to-yellow-600 rounded-full shadow-lg"></div>
          </motion.div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Connecting hearts to divine blessings through authentic spiritual practices, 
            guided by wisdom, devotion, and centuries-old traditions
          </p>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          onViewportEnter={() => setInView(true)}
        >
          {serviceData.map((item, index) => (
            <motion.div
              key={index}
              className="group perspective-1000"
              variants={cardVariants}
              whileHover={{ 
                y: -12,
                scale: 1.02,
                transition: { 
                  type: "spring",
                  damping: 20,
                  stiffness: 300
                }
              }}
            >
              <div className={`relative h-full p-8 md:p-10 bg-gradient-to-br ${item.cardGradient} backdrop-blur-xl rounded-3xl border border-white/40 ${item.shadowColor} shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden transform-gpu`}>
                
                {/* Enhanced gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-3xl`}></div>
                
                {/* Dynamic background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-40 h-40">
                    <div className={`w-full h-full bg-gradient-to-br ${item.borderGradient} rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-700`}></div>
                  </div>
                </div>

                {/* Floating icon with enhanced design */}
                <motion.div 
                  className={`absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center text-2xl shadow-xl border border-white/50`}
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1
                  }}
                  transition={{ 
                    type: "spring",
                    damping: 10,
                    stiffness: 200
                  }}
                >
                  <span className="filter drop-shadow-sm">{item.icon}</span>
                </motion.div>

                {/* Card content with enhanced spacing */}
                <div className="relative z-10 flex flex-col h-full">
                  
                  {/* Enhanced image container */}
                  <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-8 rounded-3xl overflow-hidden bg-white/20 backdrop-blur-sm p-2 group-hover:scale-105 transition-all duration-700 shadow-xl">
                    <div className="w-full h-full rounded-2xl overflow-hidden relative">
                      <Image
                        alt={item.text}
                        src={item.image}
                        className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110"
                        fill
                        quality={95}
                        sizes="(max-width: 768px) 7rem, 8rem"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>

                  {/* Counter with enhanced animation */}
                  <div className="text-center mb-6">
                    <motion.div 
                      className="relative inline-block"
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring",
                        damping: 15,
                        stiffness: 100,
                        delay: index * 0.2 + 0.3
                      }}
                    >
                      <h3 className={`text-5xl md:text-6xl font-black ${item.accentColor} leading-none`}>
                        {inView ? counters[index].toLocaleString() : 0}
                        <span className="text-gray-600">{item.suffix}</span>
                      </h3>
                      <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r ${item.borderGradient} rounded-full shadow-sm`}></div>
                    </motion.div>
                  </div>

                  {/* Enhanced text content */}
                  <div className="text-center flex-grow flex flex-col justify-center space-y-4">
                    <h4 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
                      {item.text}
                    </h4>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium max-w-xs mx-auto">
                      {item.description}
                    </p>
                  </div>

                  {/* Enhanced bottom accent */}
                  <div className="mt-8 flex justify-center">
                    <motion.div 
                      className={`h-1.5 bg-gradient-to-r ${item.borderGradient} rounded-full shadow-sm group-hover:shadow-lg transition-all duration-500`}
                      initial={{ width: "3rem" }}
                      whileHover={{ width: "5rem" }}
                    />
                  </div>
                </div>

                {/* Enhanced border glow effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${item.borderGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-xl -z-10`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring",
            damping: 20,
            stiffness: 100,
            delay: 0.6 
          }}
          className="text-center mt-20 md:mt-24"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-gradient-to-br from-white/80 via-white/60 to-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/50 shadow-2xl"
            >
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Ready to Begin Your 
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent block sm:inline sm:ml-3">
                  Spiritual Journey?
                </span>
              </h3>
              
              <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of devotees who have found peace, prosperity, and divine blessings through our authentic spiritual practices
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button 
                  className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-bold rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Our Services
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      ✨
                    </motion.span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
                
                <motion.button 
                  className="px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-white transition-all duration-300 shadow-lg"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(255,255,255,1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </div>
              
              {/* Trust indicators */}
              <motion.div 
                className="mt-10 pt-8 border-t border-gray-200/50"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Trusted by 40,000+ devotees
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    1200+ certified pandits
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    400+ spiritual services
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}