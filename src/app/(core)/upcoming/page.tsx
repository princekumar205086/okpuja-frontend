"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Define upcoming event data
const upcomingEvents = [
  {
    id: 1,
    title: "Vara lakshmi",
    date: "October 31, 2024",
    location: "Pan India",
    description:
      "Festival of lights celebrating the victory of light over darkness",
    image: "/uploads/vara lakshmi.jpeg",
  },
  {
    id: 2,
    title: "Navratri",
    date: "October 3 - 12, 2024",
    location: "Pan India",
    description: "Nine nights devoted to the worship of Goddess Durga",
    image: "/uploads/1728074541833-Durga Mata.jpeg",
  },
  {
    id: 3,
    title: "Ganesh Chaturthi",
    date: "September 7, 2024",
    location: "Pan India",
    description: "Birthday of Lord Ganesha, the remover of obstacles",
    image: "/uploads/1737638615456-Ganesh chaturthi.jpeg",
  },
];

const UpcomingEvents = () => {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-cream pt-12 pb-8 sm:pt-16 sm:pb-10 lg:pt-18 lg:pb-10">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-80 bg-redOrange/5 -skew-y-3 transform -translate-y-20"></div>
      <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-redOrange/5"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-redOrange/5"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-redOrange text-sm uppercase tracking-wider font-semibold">
            Culture & Spirituality
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
            Upcoming Events & Festivals
          </h2>
          <div className="w-20 h-1 bg-redOrange mx-auto my-4 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600">
            Experience the rich cultural heritage of India through these
            upcoming celebrations and sacred ceremonies
          </p>
        </motion.div>

        {/* Featured Event Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="relative h-80 sm:h-96 md:h-[500px] w-full">
            <Image
              src="/image/india.webp"
              alt="Upcoming Indian Festivals"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-10 text-white">
            <span className="inline-block px-3 py-1 bg-redOrange text-white text-xs font-medium rounded-full mb-3">
              Featured
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
              Celebrate India&apos;s Rich Cultural Heritage
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mb-4 sm:mb-6">
              From vibrant Diwali celebrations to sacred Navratri ceremonies,
              discover the most significant festivals and events across India.
            </p>
            <Link href="/festivals">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center bg-white text-gray-800 px-5 py-3 rounded-lg font-medium hover:bg-cream transition-colors duration-300"
              >
                Explore All Festivals
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </motion.span>
            </Link>
          </div>
        </motion.div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
            >
              <div className="relative h-48 sm:h-52">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className={`object-cover transition-transform duration-700 ${
                    hoveredEvent === event.id ? "scale-110" : "scale-100"
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="flex items-center text-white/90 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {event.date}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-redOrange mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-xs text-gray-600">
                    {event.location}
                  </span>
                </div>

                <p className="text-gray-700 text-sm">{event.description}</p>

                <div className="mt-4 flex justify-between items-center">
                  <Link
                    href={`/festivals/${event.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    <span className="text-redOrange hover:text-redOrange/80 font-medium text-sm inline-flex items-center">
                      Learn More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
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
                    </span>
                  </Link>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-cream hover:bg-redOrange/10 text-redOrange rounded-full p-2 transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Puja Services Banner Instead of Calendar Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 bg-gradient-to-r bg-orange-600 to-orange-400/80 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center">
            {/* Left content */}
            <div className="sm:col-span-2 p-6 sm:p-8">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                Book Puja Services for These Festivals
              </h3>
              <p className="text-white/90 mb-4 text-sm sm:text-base">
                Celebrate these auspicious occasions with proper rituals
                performed by experienced pandits
              </p>
              <Link href="/pujaservice">
                <span className="inline-flex items-center bg-white text-redOrange px-4 py-2 rounded-lg font-medium text-sm hover:bg-cream transition-colors duration-300">
                  View Puja Services
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Right image */}
            <div className="hidden sm:block relative h-full min-h-[160px]">
              <Image
                src="/image/puja.jpeg"
                alt="Puja Services"
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
