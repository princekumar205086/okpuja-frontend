"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./featurecard.css";
import Link from "next/link";
import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { motion } from "framer-motion";

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
}

const pujas: PujaItem[] = [
  {
    pujaName: "Marriage Puja",
    imageSource: "/uploads/marriage puja.jpeg",
    description: "Traditional rituals for a blessed marital journey",
    duration: "3-4 hours",
  },
  {
    pujaName: "Teej Puja",
    imageSource: "/uploads/teej puja.jpeg",
    description: "Sacred ceremony honoring Lord Shiva and Goddess Parvati",
    duration: "1-2 hours",
  },
  {
    pujaName: "Griha Pravesh Puja",
    imageSource: "/uploads/Griha Pravesh puja.jpeg",
    description: "Blessing your new home with divine energy",
    duration: "2-3 hours",
  },
  {
    pujaName: "Satyanarayan Puja",
    imageSource: "/uploads/satya narayan puja.jpeg",
    description: "Invoke blessings of Lord Vishnu for prosperity",
    duration: "2-3 hours",
  },
  {
    pujaName: "Maha Ganapati Homa",
    imageSource: "/uploads/Maha ganpati.jpg",
    description: "Powerful ritual to remove obstacles from life",
    duration: "3-4 hours",
  },
  {
    pujaName: "Office Puja / Business Puja",
    imageSource: "/uploads/Office Puja  Business Puja.jpeg",
    description: "Sacred ceremony for business growth and success",
    duration: "1-2 hours",
  },
];

const FeaturedPujas: React.FC = () => {
  // Use SliderInstance type for the ref
  const sliderRef = useRef<Slider | null>(null);

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

  const settings: Settings = {
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "30px",
        },
      },
    ],
    customPaging: () => <div className="custom-dot"></div>,
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-32 left-16 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm uppercase tracking-wider font-semibold rounded-full mb-4">
            Popular Ceremonies
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-gray-900">Featured</span>
            <span className="block sm:inline bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ml-0 sm:ml-3">
              Pujas
            </span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the divine through our most popular Pujas and Homas, 
            carefully curated to bring blessings and prosperity to your life
          </p>
        </motion.div>

        <div className="relative">
          {/* Enhanced Custom Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white text-gray-700 rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hidden sm:flex items-center justify-center group"
            aria-label="Previous slide"
          >
            <IoChevronBack size={24} className="group-hover:scale-110 transition-transform duration-200" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white text-gray-700 rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hidden sm:flex items-center justify-center group"
            aria-label="Next slide"
          >
            <IoChevronForward size={24} className="group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Enhanced Slider Component */}
          <div className="puja-slider-container">
            <Slider ref={sliderRef} {...settings}>
              {pujas.map((puja, index) => (
                <div key={index} className="px-3 py-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-white/20"
                  >
                    {/* Enhanced Image Section */}
                    <div className="relative h-52 sm:h-56 overflow-hidden">
                      <Image
                        src={puja.imageSource}
                        alt={puja.pujaName}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      {/* Duration badge */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                        ⏱ {puja.duration}
                      </div>

                      {/* Floating overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Enhanced Content Section */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                        {puja.pujaName}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                        {puja.description}
                      </p>

                      {/* Enhanced CTA Button */}
                      <Link
                        href={`/pujaservice/${puja.pujaName
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-2xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 group/button"
                      >
                        <span>View Details</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2 transform group-hover/button:translate-x-1 transition-transform duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 text-center"
        >
          <p className="text-gray-600 text-lg mb-6">
            Discover more sacred ceremonies and spiritual services
          </p>
          <Link href="/pujaservice">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-8 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore All Puja Services
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* Professional decorative divider */}
      <div className="container mx-auto px-4 sm:px-6 mt-16 md:mt-20">
        <div className="flex items-center justify-center">
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="mx-6">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          </div>
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
      </div>

      {/* Enhanced CSS for Custom Dots */}
      <style jsx global>{`
        .puja-slider-container .slick-dots {
          bottom: -40px;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .puja-slider-container .slick-dots li {
          margin: 0;
        }

        .custom-dot {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #d1d5db, #9ca3af);
          border-radius: 50%;
          display: inline-block;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slick-active .custom-dot {
          background: linear-gradient(135deg, #f97316, #dc2626);
          width: 32px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
        }

        @media (max-width: 640px) {
          .puja-slider-container .slick-dots {
            bottom: -35px;
          }

          .custom-dot {
            width: 10px;
            height: 10px;
          }

          .slick-active .custom-dot {
            width: 24px;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedPujas;
