"use client";
import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./featurecard.css";
import Link from "next/link";
import Image from "next/image";
import { IoChevronBack, IoChevronForward, IoTimeOutline, IoStarSharp } from "react-icons/io5";
import { motion, useInView, easeInOut } from "framer-motion";

// Fix TypeScript issues with Slider component
declare module "react-slick" {
  export interface SliderInstance extends Slider {
    slickNext(): void;
    slickPrev(): void;
    slickGoTo(slideNumber: number): void;
  }
}

// Type for individual puja item
interface PujaItem {
  pujaName: string;
  imageSource: string;
  description: string;
  duration: string;
  category: string;
  rating: number;
  benefits: string[];
}

const pujas: PujaItem[] = [
  {
    pujaName: "Marriage Puja",
    imageSource: "/uploads/marriage puja.jpeg",
    description: "Sacred rituals for blessed marital harmony and lifelong togetherness",
    duration: "3-4 hours",
    category: "Wedding Ceremonies",
    rating: 4.9,
    benefits: ["Marital Bliss", "Divine Blessings", "Prosperity"]
  },
  {
    pujaName: "Teej Puja",
    imageSource: "/uploads/teej puja.jpeg",
    description: "Divine ceremony honoring Shiva-Parvati for marital happiness",
    duration: "1-2 hours",
    category: "Festival Rituals",
    rating: 4.8,
    benefits: ["Marital Harmony", "Health & Longevity", "Family Peace"]
  },
  {
    pujaName: "Griha Pravesh Puja",
    imageSource: "/uploads/Griha Pravesh puja.jpeg",
    description: "Blessing your new sanctuary with divine positive energy",
    duration: "2-3 hours",
    category: "Home Ceremonies",
    rating: 4.9,
    benefits: ["Prosperity", "Protection", "Peace"]
  },
  {
    pujaName: "Satyanarayan Puja",
    imageSource: "/uploads/satya narayan puja.jpeg",
    description: "Invoke Lord Vishnu's blessings for abundance and prosperity",
    duration: "2-3 hours",
    category: "Devotional Rituals",
    rating: 4.8,
    benefits: ["Wealth", "Success", "Spiritual Growth"]
  },
  {
    pujaName: "Maha Ganapati Homa",
    imageSource: "/uploads/Maha ganpati.jpg",
    description: "Powerful fire ritual to remove all obstacles from your path",
    duration: "3-4 hours",
    category: "Sacred Fire Rituals",
    rating: 4.9,
    benefits: ["Obstacle Removal", "Success", "New Beginnings"]
  },
  {
    pujaName: "Office Puja / Business Puja",
    imageSource: "/uploads/Office Puja  Business Puja.jpeg",
    description: "Sacred ceremony for exponential business growth and success",
    duration: "1-2 hours",
    category: "Business Rituals",
    rating: 4.7,
    benefits: ["Business Growth", "Financial Success", "Team Harmony"]
  },
];

const FeaturedPujas: React.FC = () => {
  const sliderRef = useRef<Slider | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const settings: Settings = {
    dots: true,
    autoplay: isAutoPlaying,
    autoplaySpeed: 4000,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    fade: false,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    beforeChange: (current: number, next: number) => setActiveSlide(next),
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
          centerPadding: "20px",
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
    customPaging: (i: number) => (
      <div className={`custom-dot ${i === activeSlide ? 'active' : ''}`}></div>
    ),
    dotsClass: "slick-dots custom-dots",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring" as "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  const floatingAnimation = {
    y: [0, -15, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: easeInOut // use imported easing function
    }
  };

  return (
    <section className="relative min-h-screen py-20 md:py-28 bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-32 left-20 w-64 h-64 bg-gradient-to-br from-violet-300/20 via-purple-300/20 to-indigo-300/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-40 right-16 w-80 h-80 bg-gradient-to-br from-orange-300/15 via-pink-300/15 to-red-300/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="absolute top-1/3 left-1/2 w-48 h-48 bg-gradient-to-br from-emerald-300/10 via-teal-300/10 to-cyan-300/10 rounded-full blur-2xl"
          animate={floatingAnimation}
        />
      </div>

      {/* Floating geometric elements */}
      <motion.div 
        className="absolute top-28 right-20 w-6 h-6 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full shadow-xl"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: easeInOut
        }}
      />
      <motion.div 
        className="absolute bottom-48 left-24 w-4 h-4 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full shadow-xl"
        animate={{
          ...floatingAnimation,
          transition: { ...floatingAnimation.transition, delay: 2 }
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Section Header */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isHeaderInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-3 bg-gradient-to-r from-violet-100 via-purple-100 to-indigo-100 text-violet-700 rounded-full text-sm font-bold tracking-wider border border-violet-200/50 shadow-lg backdrop-blur-sm">
              ✨ SACRED CEREMONIES ✨
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Featured
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Puja Services
            </span>
          </motion.h1>
          
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ scaleX: 0 }}
            animate={isHeaderInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="h-2 w-40 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-full shadow-lg"></div>
          </motion.div>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Immerse yourself in our most revered spiritual ceremonies, meticulously crafted to 
            channel divine blessings, prosperity, and inner peace into your life's journey
          </motion.p>
        </motion.div>

        {/* Enhanced Slider Container */}
        <div className="relative max-w-8xl mx-auto">
          {/* Advanced Custom Navigation Buttons */}
          <motion.button
            onClick={goToPrev}
            className="absolute left-0 lg:-left-16 top-1/2 -translate-y-1/2 z-30 bg-white/95 backdrop-blur-md hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600 hover:text-white text-gray-700 rounded-2xl p-4 shadow-2xl hover:shadow-3xl transition-all duration-500 hidden md:flex items-center justify-center group border border-gray-200/50"
            whileHover={{ 
              scale: 1.05,
              rotate: -5,
              boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous slide"
          >
            <IoChevronBack size={28} className="group-hover:scale-110 transition-transform duration-300" />
          </motion.button>

          <motion.button
            onClick={goToNext}
            className="absolute right-0 lg:-right-16 top-1/2 -translate-y-1/2 z-30 bg-white/95 backdrop-blur-md hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600 hover:text-white text-gray-700 rounded-2xl p-4 shadow-2xl hover:shadow-3xl transition-all duration-500 hidden md:flex items-center justify-center group border border-gray-200/50"
            whileHover={{ 
              scale: 1.05,
              rotate: 5,
              boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next slide"
          >
            <IoChevronForward size={28} className="group-hover:scale-110 transition-transform duration-300" />
          </motion.button>

          {/* Auto-play toggle button */}
          <motion.button
            onClick={toggleAutoPlay}
            className="absolute top-0 right-4 z-30 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-violet-600 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
          >
            {isAutoPlaying ? "⏸️" : "▶️"}
          </motion.button>

          {/* Enhanced Slider Component */}
          <div className="puja-slider-container overflow-hidden">
            <Slider ref={sliderRef} {...settings}>
              {pujas.map((puja, index) => (
                <div key={index} className="px-4 py-6">
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ 
                      y: -15,
                      scale: 1.02,
                      rotateY: 5,
                      transition: { 
                        type: "spring",
                        damping: 20,
                        stiffness: 300
                      }
                    }}
                    className="group bg-gradient-to-br from-white/90 via-white/80 to-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-700 h-full flex flex-col border border-white/50 transform-gpu perspective-1000"
                  >
                    {/* Enhanced Image Section */}
                    <div className="relative h-64 sm:h-72 overflow-hidden">
                      <Image
                        src={puja.imageSource}
                        alt={puja.pujaName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110"
                        quality={95}
                      />
                      
                      {/* Enhanced gradient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-violet-500/90 to-purple-600/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full shadow-lg border border-white/20">
                        {puja.category}
                      </div>

                      {/* Duration badge with enhanced design */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-700 text-sm px-4 py-2 rounded-full shadow-lg border border-gray-200/50 flex items-center gap-2">
                        <IoTimeOutline size={16} className="text-violet-600" />
                        {puja.duration}
                      </div>

                      {/* Rating badge */}
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-gray-700 text-sm px-3 py-2 rounded-full shadow-lg border border-gray-200/50 flex items-center gap-1">
                        <IoStarSharp className="text-yellow-500" size={16} />
                        <span className="font-semibold">{puja.rating}</span>
                      </div>
                    </div>

                    {/* Enhanced Content Section */}
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-violet-600 transition-colors duration-500 leading-tight">
                        {puja.pujaName}
                      </h3>
                      
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 flex-1 font-medium">
                        {puja.description}
                      </p>

                      {/* Benefits tags */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {puja.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 text-sm rounded-full border border-violet-200/50 font-medium"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>

                      {/* Enhanced CTA Button */}
                      <Link
                        href={`/pujaservice/${puja.pujaName
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="group/button"
                      >
                        <motion.div
                          className="inline-flex items-center justify-center w-full bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 hover:from-violet-600 hover:via-purple-700 hover:to-indigo-700 text-white py-4 px-8 rounded-2xl transition-all duration-500 text-base font-bold shadow-xl hover:shadow-2xl relative overflow-hidden"
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 20px 40px rgba(139, 69, 197, 0.3)"
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            Book Now
                            <motion.svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              animate={{ x: [0, 5, 0] }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </motion.svg>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-700 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500"></div>
                        </motion.div>
                      </Link>
                    </div>

                    {/* Enhanced border glow effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10"></div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-24"
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-gradient-to-br from-white/90 via-white/70 to-white/90 backdrop-blur-xl rounded-3xl p-10 md:p-16 border border-white/60 shadow-2xl relative overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl"></div>
              
              <div className="relative z-10 text-center">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-6 leading-tight">
                  Ready to Begin Your 
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block sm:inline sm:ml-4">
                    Sacred Journey?
                  </span>
                </h3>
                
                <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
                  Join thousands of devotees who have experienced divine transformation through our authentic 
                  spiritual ceremonies and sacred rituals
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href="/pujaservice">
                      <span className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 text-white font-bold rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 text-lg">
                        <span className="relative z-10 flex items-center gap-3">
                          Explore All Services
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            ✨
                          </motion.span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </span>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button className="px-10 py-5 bg-white/90 backdrop-blur-sm text-gray-700 font-bold rounded-2xl border-2 border-gray-200 hover:border-violet-300 hover:bg-white hover:text-violet-600 transition-all duration-500 shadow-lg hover:shadow-xl text-lg">
                      Learn More
                    </button>
                  </motion.div>
                </div>
                
                {/* Enhanced trust indicators */}
                <motion.div 
                  className="mt-12 pt-10 border-t border-gray-200/60"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-2xl">🔥</span>
                      </div>
                      <span className="text-2xl font-black text-gray-800">40,000+</span>
                      <span className="text-gray-600 font-medium">Sacred Rituals</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-2xl">🙏</span>
                      </div>
                      <span className="text-2xl font-black text-gray-800">1,200+</span>
                      <span className="text-gray-600 font-medium">Expert Pandits</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-2xl">⭐</span>
                      </div>
                      <span className="text-2xl font-black text-gray-800">4.9/5</span>
                      <span className="text-gray-600 font-medium">Client Rating</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced decorative divider */}
      <motion.div 
        className="container mx-auto px-4 sm:px-6 mt-20 md:mt-24"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-center">
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent"></div>
          <div className="mx-8">
            <div className="w-4 h-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full shadow-lg"></div>
          </div>
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
        </div>
      </motion.div>

      {/* Enhanced CSS for Custom Dots */}
      <style jsx global>{`
        .puja-slider-container {
          position: relative;
          padding-bottom: 60px;
        }

        .puja-slider-container .slick-dots {
          bottom: 0;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 12px;
          padding: 20px 0;
        }

        .puja-slider-container .slick-dots li {
          margin: 0;
        }

        .custom-dot {
          width: 14px;
          height: 14px;
          background: linear-gradient(135deg, #e5e7eb, #d1d5db);
          border-radius: 50%;
          display: inline-block;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 2px solid transparent;
        }

        .custom-dot.active,
        .slick-active .custom-dot {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          width: 40px;
          border-radius: 14px;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
          border: 2px solid rgba(139, 92, 246, 0.2);
        }

        .custom-dot:hover {
          background: linear-gradient(135deg, #a855f7, #9333ea);
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
        }

        @media (max-width: 768px) {
          .puja-slider-container {
            padding-bottom: 50px;
          }

          .puja-slider-container .slick-dots {
            gap: 8px;
            padding: 15px 0;
          }

          .custom-dot {
            width: 12px;
            height: 12px;
          }

          .custom-dot.active,
          .slick-active .custom-dot {
            width: 32px;
            border-radius: 12px;
          }
        }

        @media (max-width: 640px) {
          .puja-slider-container .slick-dots {
            gap: 6px;
            padding: 12px 0;
          }

          .custom-dot {
            width: 10px;
            height: 10px;
          }

          .custom-dot.active,
          .slick-active .custom-dot {
            width: 24px;
            border-radius: 10px;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedPujas;
