"use client";
import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { motion } from "framer-motion";
import { FiClock, FiArrowRight } from "react-icons/fi";
import { usePujaServices } from "@/hooks/api/usePujaServices";

interface PujaItem {
  pujaName: string;
  slug: string;
  imageSource: string;
  description: string;
  duration: string;
  price?: string;
}

// Fallback data shown while API loads or if it fails
const fallbackPujas: PujaItem[] = [
  {
    pujaName: "Marriage Puja",
    slug: "marriage-puja",
    imageSource: "/uploads/marriage puja.jpeg",
    description: "Traditional rituals for a blessed marital journey",
    duration: "2–3 hours",
  },
  {
    pujaName: "Teej Puja",
    slug: "teej-puja",
    imageSource: "/uploads/teej puja.jpeg",
    description: "Sacred ceremony honoring Lord Shiva and Goddess Parvati",
    duration: "1–2 hours",
  },
  {
    pujaName: "Griha Pravesh Puja",
    slug: "griha-pravesh-puja",
    imageSource: "/uploads/Griha Pravesh puja.jpeg",
    description: "Blessing your new home with divine energy",
    duration: "2–3 hours",
  },
  {
    pujaName: "Satyanarayan Puja",
    slug: "satyanarayan-puja",
    imageSource: "/uploads/satya narayan puja.jpeg",
    description: "Invoke blessings of Lord Vishnu for prosperity",
    duration: "2–3 hours",
  },
  {
    pujaName: "Maha Ganapati Homa",
    slug: "maha-ganapati-homa",
    imageSource: "/uploads/Maha ganpati.jpg",
    description: "Powerful ritual to remove obstacles from life",
    duration: "3–4 hours",
  },
  {
    pujaName: "Office / Business Puja",
    slug: "office-business-puja",
    imageSource: "/uploads/Office Puja  Business Puja.jpeg",
    description: "Sacred ceremony for business growth and success",
    duration: "1–2 hours",
  },
];

const FeaturedPujas: React.FC = () => {
  const sliderRef = useRef<Slider | null>(null);
  const { services, loading, fetch: fetchServices } = usePujaServices();
  const [pujas, setPujas] = useState<PujaItem[]>(fallbackPujas);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Map API data to display format when services load
  useEffect(() => {
    if (services.length > 0) {
      const apiPujas: PujaItem[] = services
        .filter((s) => s.is_active)
        .slice(0, 8)
        .map((s) => ({
          pujaName: s.name,
          slug: s.slug,
          imageSource: s.image || "/uploads/satya narayan puja.jpeg",
          description: s.description,
          duration: s.duration || "1–2 hours",
          price: s.price,
        }));
      if (apiPujas.length > 0) setPujas(apiPujas);
    }
  }, [services]);

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
          {loading && pujas === fallbackPujas ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                  <div className="h-52 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <Slider ref={sliderRef} {...settings}>
            {pujas.map((puja, index) => (
              <div key={puja.slug || index} className="px-3">
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

                    {/* Price badge */}
                    {puja.price && (
                      <div className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        ₹{puja.price}
                      </div>
                    )}
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
                      href={`/puja/${puja.slug}`}
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
          )}
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

