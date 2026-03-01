"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Select a Puja",
    description: "Choose from 230+ traditional pujas, homas, and rituals. Pick the package that suits your occasion and budget.",
    imagesrc: "/image/select puja.jpeg",
    tags: ["Browse Categories", "Compare Packages"],
  },
  {
    number: "02",
    title: "Book a Pandit",
    description: "Choose from our verified pandits based on language preference, expertise, and availability near you.",
    imagesrc: "/image/book pandit jee.jpeg",
    tags: ["View Profiles", "Check Reviews"],
  },
  {
    number: "03",
    title: "Confirm & Pay",
    description: "Make a secure advance payment to confirm your booking. Receive instant confirmation via email, SMS, and WhatsApp.",
    imagesrc: "/image/get confirmed.jpeg",
    tags: ["Secure Payment", "Instant Confirmation"],
  },
  {
    number: "04",
    title: "Get Updates",
    description: "Receive real-time updates, pandit arrival alerts, and post-puja divine blessings to your phone.",
    imagesrc: "/image/get update.jpeg",
    tags: ["Live Tracking", "WhatsApp Updates"],
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold tracking-widest uppercase mb-5">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            How <span className="text-orange-600">OKPUJA</span> Works
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            From choosing your puja to experiencing divine blessings â€” our streamlined process makes spiritual bookings effortless.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group relative"
            >
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-[calc(100%+4px)] w-[calc(100%-8px)] h-px bg-gradient-to-r from-orange-200 to-orange-100 z-0" />
              )}

              <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6 h-full">
                {/* Step number badge */}
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange-600 text-white text-xs font-black mb-5 shadow-md shadow-orange-200">
                  {step.number}
                </div>

                {/* Image */}
                <div className="relative w-full h-36 rounded-xl overflow-hidden mb-5">
                  <Image
                    src={step.imagesrc}
                    alt={step.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Feature tags */}
                <div className="flex flex-wrap gap-1.5">
                  {step.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-orange-50 text-orange-700 border border-orange-100 px-2.5 py-1 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature highlight banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row items-center">
            {/* Content */}
            <div className="lg:w-1/2 p-10 lg:p-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-semibold uppercase tracking-wider mb-6">
                Why Choose OKPUJA
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-snug">
                Experience Sacred Traditions{" "}
                <span className="text-orange-400">With Ease</span>
              </h3>

              <ul className="space-y-4 mb-8">
                {[
                  "Expert pandits with verified credentials and years of experience",
                  "Rituals tailored precisely to your specific traditions and requirements",
                  "Convenient puja samagri delivery right to your doorstep",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>

              <Link href="/pujaservice">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-900/30 transition-all duration-200"
                >
                  Book Your Puja Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.span>
              </Link>
            </div>

            {/* Image */}
            <div className="lg:w-1/2 relative h-72 lg:h-auto lg:min-h-[400px] w-full">
              <Image
                src="/image/hawan.jpg"
                alt="Sacred hawan ceremony"
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-gray-900/80 lg:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent lg:hidden block" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

