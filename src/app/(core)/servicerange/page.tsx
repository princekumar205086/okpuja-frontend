"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaSun, FaStar, FaVideo, FaEllipsisH, FaArrowRight, FaCheckCircle } from "react-icons/fa";

interface ServiceItem {
  title: string;
  image: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  href: string;
  accentColor: string;
  accentBg: string;
}

export default function ServiceRange() {
  const services: ServiceItem[] = [
    {
      title: "Traditional Puja Services",
      image: "/image/puja.jpeg",
      description: "Authentic rituals performed by certified pandits at your preferred location with complete samagri arrangements.",
      icon: <FaSun className="text-lg" />,
      features: ["Verified & certified pandits", "All locations covered", "Samagri included", "Traditional mantras"],
      href: "/pujaservice",
      accentColor: "text-orange-600",
      accentBg: "bg-orange-50 border-orange-200",
    },
    {
      title: "Astrology Consultation",
      image: "/image/astrology.jpeg",
      description: "Personalized astrological guidance for career, marriage, finance, and all major life decisions.",
      icon: <FaStar className="text-lg" />,
      features: ["Birth chart analysis", "Future predictions", "Remedial solutions", "Kundali matching"],
      href: "/astrology",
      accentColor: "text-purple-600",
      accentBg: "bg-purple-50 border-purple-200",
    },
    {
      title: "Live E-Puja Services",
      image: "/image/E-puja.jpeg",
      description: "Experience divine blessings through HD live-streamed ceremonies from sacred temples across India.",
      icon: <FaVideo className="text-lg" />,
      features: ["HD live streaming", "Sacred temples", "Real-time participation", "Digital prasad"],
      href: "/pujaservice",
      accentColor: "text-blue-600",
      accentBg: "bg-blue-50 border-blue-200",
    },
    {
      title: "Specialized Services",
      image: "/image/otherservice.jpeg",
      description: "Bespoke spiritual ceremonies, special homas, Vastu consultations, and custom ritual planning.",
      icon: <FaEllipsisH className="text-lg" />,
      features: ["Custom rituals", "Vastu consultation", "Corporate pujas", "Group ceremonies"],
      href: "/pujaservice",
      accentColor: "text-emerald-600",
      accentBg: "bg-emerald-50 border-emerald-200",
    },
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
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold tracking-widest uppercase mb-5">
            Our Sacred Offerings
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Comprehensive Range of{" "}
            <span className="text-orange-600">Sacred Services</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Transform your spiritual journey with our authentic and comprehensive services tailored to every occasion and need.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row h-full">
                {/* Image */}
                <div className="relative sm:w-48 h-52 sm:h-auto flex-shrink-0 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="192px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  {/* Icon badge */}
                  <div className={`absolute top-4 left-4 p-2.5 rounded-xl ${service.accentBg} border backdrop-blur-sm shadow-sm`}>
                    <span className={service.accentColor}>{service.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-1.5 mb-5">
                      {service.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <FaCheckCircle className="text-orange-400 flex-shrink-0" size={12} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={service.href}
                    className={`inline-flex items-center gap-2 text-sm font-semibold ${service.accentColor} hover:opacity-80 transition-opacity duration-200`}
                  >
                    Explore Service
                    <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl overflow-hidden px-8 py-12 sm:px-12 text-center text-white"
        >
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              Ready to Begin Your Spiritual Journey?
            </h3>
            <p className="text-white/80 text-base mb-8 leading-relaxed">
              Book your personalized puja service today and experience the divine connection with expert pandits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pujaservice">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:bg-orange-50"
                >
                  Book a Puja Now
                  <FaArrowRight size={14} />
                </motion.span>
              </Link>
              <Link href="/services">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl backdrop-blur-sm transition-all duration-200"
                >
                  Learn More
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

