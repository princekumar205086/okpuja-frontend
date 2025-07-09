"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaCheckCircle, FaUsers, FaCalendarAlt, FaRupeeSign, FaStar, FaArrowRight, FaInfoCircle } from "react-icons/fa";

const QualifiedPandit = () => {
  const benefits = [
    {
      icon: <FaUsers className="text-xl" />,
      title: "Expand Your Reach",
      description: "Connect with devotees across major Indian cities and grow your practice"
    },
    {
      icon: <FaCalendarAlt className="text-xl" />,
      title: "Flexible Schedule",
      description: "Work according to your availability with complete scheduling freedom"
    },
    {
      icon: <FaRupeeSign className="text-xl" />,
      title: "Secure Payments",
      description: "Guaranteed and timely payments for all your spiritual services"
    },
    {
      icon: <FaStar className="text-xl" />,
      title: "Build Reputation",
      description: "Showcase your expertise through verified client reviews and ratings"
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Pandits" },
    { number: "50,000+", label: "Satisfied Clients" },
    { number: "100+", label: "Cities Covered" },
    { number: "4.8/5", label: "Average Rating" },
  ];

  return (
    <section className="relative py-20 sm:py-24 lg:py-28 overflow-hidden">
      {/* Modern Background with Better Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/astrologer.jpeg"
          alt="Qualified Pandits background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/95 via-red-900/85 to-orange-900/95" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
            >
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {stat.number}
              </div>
              <div className="text-orange-200 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-400/30 mb-6">
                  <span className="text-orange-300 text-sm font-semibold uppercase tracking-wider">
                    Join Our Sacred Network
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Are you a qualified{" "}
                  <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Pandit
                  </span>{" "}
                  or{" "}
                  <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Astrologer
                  </span>?
                </h2>

                <p className="text-xl text-orange-100 leading-relaxed mb-8">
                  Join our prestigious platform to connect with devotees across India. 
                  We empower qualified spiritual practitioners to reach more clients and 
                  build a thriving practice.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Why Choose Our Platform?
                </h3>
                <div className="grid gap-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">
                          {benefit.title}
                        </h4>
                        <p className="text-orange-200 text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/join-as-pandit">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300"
                  >
                    Apply to Join
                    <FaArrowRight className="ml-3 text-lg group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.div>
                </Link>
                <Link href="/pandit-requirements">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-300"
                  >
                    Learn More
                    <FaInfoCircle className="ml-3 text-lg group-hover:rotate-12 transition-transform duration-300" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Enhanced Testimonial */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Testimonial Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center mb-6">
                  <svg
                    className="h-12 w-12 text-orange-400 mr-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <div className="flex text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-lg" />
                    ))}
                  </div>
                </div>

                <blockquote className="text-lg text-white mb-6 leading-relaxed">
                  &quot;Joining this platform has transformed my practice. I now reach devotees
                  from across India and have built a strong reputation through verified reviews.
                  The payment system is reliable and the platform support is excellent.&quot;
                </blockquote>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    P
                  </div>
                  <div>
                    <p className="font-semibold text-white">Pandit Rajesh Sharma</p>
                    <p className="text-orange-200 text-sm">Vedic Astrologer, Delhi</p>
                    <p className="text-orange-300 text-xs">Member since 2022</p>
                  </div>
                </div>
              </div>

              {/* Requirements Card */}
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-lg rounded-2xl p-8 border border-orange-400/30 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Basic Requirements
                </h3>
                <div className="space-y-4">
                  {[
                    "Minimum 3 years of experience in Hindu rituals",
                    "Valid certification or traditional training",
                    "Proficiency in Sanskrit and regional languages",
                    "Commitment to authentic spiritual practices",
                    "Professional conduct and punctuality"
                  ].map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <FaCheckCircle className="text-orange-400 text-lg mt-0.5 flex-shrink-0" />
                      <span className="text-orange-100 text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-xl text-orange-200 mb-8 leading-relaxed">
              Join thousands of qualified pandits who are growing their practice with us. 
              Apply today and start connecting with devotees nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300"
                >
                  Start Application
                  <FaArrowRight className="ml-3 text-lg" />
                </motion.div>
              </Link>
              <Link href="/contact">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-300"
                >
                  Have Questions?
                  <FaInfoCircle className="ml-3 text-lg" />
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QualifiedPandit;
