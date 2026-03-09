"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { motion } from "framer-motion";
import { FiClock, FiArrowRight } from "react-icons/fi";

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
    duration: "🕐 2–3hours",
  },
  {
    pujaName: "Teej Puja",
    imageSource: "/uploads/teej puja.jpeg",
    description: "Sacred ceremony honoring Lord Shiva and Goddess Parvati",
    duration: "🕐 1–2 hours",
  },
  {
    pujaName: "Griha Pravesh Puja",
    imageSource: "/uploads/Griha Pravesh puja.jpeg",
    description: "Blessing your new home with divine energy",
    duration: "🕐 2–3 hours",
  },
  {
    pujaName: "Satyanarayan Puja",
    imageSource: "/uploads/satya narayan puja.jpeg",
    description: "Invoke blessings of Lord Vishnu for prosperity",
    duration: "🕐 2–3 hours",
  },
  {
    pujaName: "Maha Ganapati Homa",
    imageSource: "/uploads/Maha ganpati.jpg",
    description: "Powerful ritual to remove obstacles from life",
    duration: "🕐 3–4 hours",
  },
  {
    pujaName: "Office / Business Puja",
    imageSource: "/uploads/Office Puja  Business Puja.jpeg",
    description: "Sacred ceremony for business growth and success",
    duration: "🕐 1–2 hours",
  },
];

const FeaturedPujas: React.FC = () => {
  const sliderRef = useRef<Slider | null>(null);

  const settings: Settings = {
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1, centerMode: true, centerPadding: "24px" } },
    ],
  };

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold tracking-widest uppercase mb-4">
              Popular Ceremonies
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Featured <span className="text-orange-600">Puja Services</span>
            </h2>
            <p className="mt-3 text-gray-500 text-base max-w-xl leading-relaxed">
              Most-booked sacred rituals, performed by our certified pandits with complete traditional arrangements.
            </p>
          </div>

          {/* Desktop nav arrows */}
          <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-orange-500 hover:text-orange-600 flex items-center justify-center transition-all duration-200 shadow-sm"
              aria-label="Previous"
            >
              <IoChevronBack size={18} />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-orange-500 hover:text-orange-600 flex items-center justify-center transition-all duration-200 shadow-sm"
              aria-label="Next"
            >
              <IoChevronForward size={18} />
            </button>
          </div>
        </motion.div>

        {/* Slider */}
        <div className="pb-10">
          <Slider ref={sliderRef} {...settings}>
            {pujas.map((puja, index) => (
              <div key={index} className="px-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={puja.imageSource}
                      alt={puja.pujaName}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                    {/* Duration badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      <FiClock size={12} className="text-orange-500" />
                      {puja.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-orange-600 transition-colors duration-200 leading-snug">
                      {puja.pujaName}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                      {puja.description}
                    </p>
                    <Link
                      href={`/pujaservice/${puja.pujaName.toLowerCase().replace(/\s+/g, "-")}`}
                      className="inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-semibold text-sm group/link"
                    >
                      Book Now
                      <FiArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>

        {/* CTA */}
        <div className="text-center mt-4">
          <Link href="/pujaservice">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-md shadow-orange-200 transition-all duration-200"
            >
              View All Puja Services
              <FiArrowRight size={16} />
            </motion.span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPujas;

