"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import UpcomingEventsCarousel from "../../components/UpcomingEventsCarousel";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

const UpcomingEventsPage = () => {
  const features = [
    { title: "Authentic Rituals", desc: "Ceremonies performed according to ancient Vedic scriptures with proper mantras." },
    { title: "Expert Pandits", desc: "Learned pandits who understand the significance of each ritual and festival." },
    { title: "Complete Support", desc: "From planning to execution with all necessary materials and guidance." },
  ];

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
              Sacred Celebrations
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
              Upcoming <span className="text-orange-600">Events & Festivals</span>
            </h2>
            <p className="text-gray-500 text-base max-w-xl leading-relaxed">
              Immerse yourself in India&apos;s rich spiritual heritage through these upcoming sacred celebrations and traditional ceremonies.
            </p>
          </div>
          <Link href="/events" className="flex-shrink-0">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 border border-gray-200 bg-white hover:border-orange-500 hover:text-orange-600 text-gray-700 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm"
            >
              View All Events
              <FaArrowRight size={12} />
            </motion.span>
          </Link>
        </motion.div>

        {/* Events Carousel */}
        <UpcomingEventsCarousel limit={12} showHeader={false} />

        {/* Why celebrate section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-gray-100"
        >
          {features.map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <FaCheckCircle className="text-orange-500 mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingEventsPage;

