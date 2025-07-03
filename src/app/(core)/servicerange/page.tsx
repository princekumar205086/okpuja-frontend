"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ServiceItem {
  title: string;
  image: string;
  description: string;
  icon: React.ReactNode;
}

export default function ServiceRange() {
  const services: ServiceItem[] = [
    {
      title: "Puja Services",
      image: "/image/puja.jpeg",
      description:
        "Traditional rituals performed by expert pandits at your preferred location",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      title: "Astrology",
      image: "/image/astrology.jpeg",
      description:
        "Personalized astrological consultations to guide your important life decisions",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      title: "E-Puja",
      image: "/image/E-puja.jpeg",
      description:
        "Virtual puja ceremonies live-streamed to you from sacred temples",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Other Services",
      image: "/image/otherservice.jpeg",
      description:
        "Specialized religious ceremonies and spiritual guidance for all occasions",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </svg>
      ),
    },
  ];

  // Track which card is currently being hovered
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="bg-gradient-to-b from-cream to-cream/80 pt-10 pb-8 sm:pt-12 sm:pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
        >
          <span className="text-redOrange text-sm sm:text-base uppercase font-semibold tracking-wider mb-2 inline-block">
            Our Offerings
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            We Provide a Range of Sacred Services
          </h2>
          <div className="w-20 h-1.5 bg-redOrange mx-auto rounded-full mb-4"></div>
          <p className="text-base sm:text-lg text-gray-600">
            Book online for a sacred, hassle-free experience with verified
            pandits and astrologers. Every ceremony is customized to your
            traditions and preferences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="bg-white rounded-2xl overflow-hidden shadow-md h-full flex flex-col"
            >
              {/* Image container with overlay */}
              <div className="relative h-56 sm:h-48 md:h-52 lg:h-56 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  className="object-cover transition-all duration-300"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Gradient overlay that darkens on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all duration-300 ${
                    hoveredIndex === index ? "bg-black/50" : ""
                  }`}
                ></div>

                {/* Centered icon that appears on hover */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    hoveredIndex === index
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-75"
                  }`}
                >
                  <div className="bg-redOrange text-white p-4 rounded-full shadow-lg">
                    {service.icon}
                  </div>
                </div>

                {/* Service icon in corner (only visible when not hovering) */}
                <div
                  className={`absolute -bottom-6 right-6 bg-redOrange text-white p-3 rounded-xl shadow-lg transition-all duration-300 ${
                    hoveredIndex === index
                      ? "opacity-0 translate-y-3"
                      : "opacity-100"
                  }`}
                >
                  {service.icon}
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Simplified info box at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-md max-w-3xl mx-auto text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-redOrange"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Need a custom service?
          </h4>
          <p className="text-gray-600 mb-0">
            We can arrange specialized pujas and ceremonies tailored to your
            specific needs and traditions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
