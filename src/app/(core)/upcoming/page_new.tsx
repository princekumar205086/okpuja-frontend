"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaClock } from "react-icons/fa";

// Define upcoming event data
const upcomingEvents = [
  {
    id: 1,
    title: "Vara Lakshmi Vratam",
    date: "October 31, 2024",
    time: "06:00 AM - 12:00 PM",
    location: "Pan India",
    description: "Sacred festival dedicated to Goddess Lakshmi for prosperity and wealth, celebrated with devotion and traditional rituals",
    image: "/uploads/vara lakshmi.jpeg",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 2,
    title: "Navratri Celebrations",
    date: "October 3 - 12, 2024",
    time: "All Day Event",
    location: "Pan India",
    description: "Nine sacred nights devoted to the worship of Goddess Durga with traditional dances, prayers and celebrations",
    image: "/uploads/1728074541833-Durga Mata.jpeg",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 3,
    title: "Ganesh Chaturthi",
    date: "September 7, 2024",
    time: "05:00 AM - 08:00 PM",
    location: "Pan India",
    description: "Grand celebration of Lord Ganesha's birthday, the beloved remover of obstacles and harbinger of new beginnings",
    image: "/uploads/1737638615456-Ganesh chaturthi.jpeg",
    color: "from-yellow-500 to-orange-500"
  },
];

const UpcomingEvents = () => {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 py-20 sm:py-24 lg:py-28">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-orange-400/10 to-red-400/10 -skew-y-2 transform -translate-y-20"></div>
        <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-pink-400/20 to-rose-400/20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-8 shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.6 }}
          >
            <FaCalendarAlt className="w-10 h-10 text-white" />
          </motion.div>
          
          <span className="inline-block px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-sm font-semibold rounded-full mb-6 border border-orange-200">
            Sacred Celebrations
          </span>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8 leading-tight">
            Upcoming Sacred{" "}
            <span className="relative inline-block">
              Events & Festivals
              <motion.div 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </h2>
          
          <p className="text-xl leading-relaxed max-w-3xl mx-auto text-gray-600">
            Immerse yourself in India&apos;s rich spiritual heritage through these upcoming 
            sacred celebrations and traditional ceremonies.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
              className="group"
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 h-full">
                {/* Event Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                  
                  {/* Gradient Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-4 py-2 bg-gradient-to-r ${event.color} text-white text-sm font-semibold rounded-full shadow-lg`}>
                      Upcoming
                    </div>
                  </div>

                  {/* Event Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl mb-2 group-hover:text-orange-200 transition-colors duration-300">
                      {event.title}
                    </h3>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="text-orange-500 mr-3 text-sm" />
                      <span className="text-sm font-medium">{event.date}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <FaClock className="text-orange-500 mr-3 text-sm" />
                      <span className="text-sm font-medium">{event.time}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="text-orange-500 mr-3 text-sm" />
                      <span className="text-sm font-medium">{event.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {event.description}
                  </p>
                  
                  <motion.button
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors duration-300"
                  >
                    Learn More
                    <FaArrowRight className="ml-2 text-xs transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="event-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#event-pattern)" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-6">
                <FaCalendarAlt className="text-2xl text-white" />
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                Don&apos;t Miss These Sacred Celebrations
              </h3>
              
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of devotees in celebrating these auspicious occasions. 
                Book your puja services and be part of the divine experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Book Puja Service
                  <FaArrowRight className="ml-3 text-lg" />
                </motion.button>
                
                <Link href="/events">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-300"
                  >
                    View All Events
                    <FaCalendarAlt className="ml-3 text-lg" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
