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
    <section className="featured-pujas pt-10 pb-6 sm:pt-12 sm:pb-8 bg-gradient-to-b from-cream to-cream/80">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <span className="text-redOrange text-sm uppercase tracking-wider font-semibold">
            Popular Ceremonies
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            Featured Pujas
          </h2>
          <div className="w-20 h-1.5 bg-redOrange mx-auto rounded-full mb-4"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Here are some of the most popular Pujas and Homas booked on our
            portal
          </p>
        </motion.div>

        <div className="relative">
          {/* Custom Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-redOrange hover:text-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-300 hidden sm:flex items-center justify-center"
            aria-label="Previous slide"
          >
            <IoChevronBack size={24} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-redOrange hover:text-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-300 hidden sm:flex items-center justify-center"
            aria-label="Next slide"
          >
            <IoChevronForward size={24} />
          </button>

          {/* Slider Component - TypeScript Fix */}
          <div className="puja-slider-container">
            <Slider ref={sliderRef} {...settings}>
              {pujas.map((puja, index) => (
                <div key={index} className="px-2 py-1">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="relative h-44 sm:h-48 overflow-hidden">
                      <Image
                        src={puja.imageSource}
                        alt={puja.pujaName}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-3 right-3 bg-redOrange/90 text-cream text-xs px-2 py-1 rounded-full">
                        {puja.duration}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1.5">
                        {puja.pujaName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 flex-1">
                        {puja.description}
                      </p>

                      <Link
                        href={`/pujaservice/${puja.pujaName
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="inline-flex items-center justify-center bg-cream hover:bg-redOrange border border-redOrange text-redOrange hover:text-white py-2 px-4 rounded-lg transition-colors duration-300 text-sm font-medium mt-auto group"
                      >
                        View Details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform"
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

        <div className="mt-8 text-center">
          <Link href="/pujaservice">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block bg-redOrange hover:bg-redOrange/90 text-white py-2.5 px-7 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore All Puja Services
            </motion.span>
          </Link>
        </div>
      </div>

      {/* Professional HR divider with ornament */}
      <div className="container mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
        <div className="flex items-center justify-center">
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="mx-4">
            <svg
              className="h-6 w-6 text-redOrange/60"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <circle cx="12" cy="12" r="5" />
            </svg>
          </div>
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
      </div>

      {/* CSS for Custom Dots */}
      <style jsx global>{`
        .custom-dots {
          bottom: -25px;
        }

        .custom-dot {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          border-radius: 50%;
          display: inline-block;
          margin: 0 4px;
          transition: all 0.3s ease;
        }

        .slick-active .custom-dot {
          background: #e25822;
          width: 24px;
          border-radius: 10px;
        }

        @media (max-width: 640px) {
          .custom-dots {
            bottom: -22px;
          }

          .custom-dot {
            width: 8px;
            height: 8px;
          }

          .slick-active .custom-dot {
            width: 20px;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedPujas;
