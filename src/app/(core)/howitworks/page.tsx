"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Select a Puja",
    description:
      "Choose from a wide range of traditional pujas and select the package that fits your needs.",
    imagesrc: "/image/select puja.jpeg",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    title: "Book a Pandit",
    description:
      "Select a pandit based on your language preference, expertise, and availability.",
    imagesrc: "/image/book pandit jee.jpeg",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    title: "Get Confirmation",
    description:
      "Make an advance payment to secure your booking and receive instant confirmation.",
    imagesrc: "/image/get confirmed.jpeg",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Get Updates",
    description:
      "Receive timely updates about your booking via email, SMS, and WhatsApp.",
    imagesrc: "/image/get update.jpeg",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-2xl"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-32 right-20 w-6 h-6 bg-orange-400 rounded-full animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-40 left-16 w-4 h-4 bg-amber-400 rounded-full animate-pulse hidden lg:block"></div>
      <div className="absolute top-1/4 right-1/3 w-8 h-8 border-2 border-orange-300 rounded-full hidden lg:block"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm uppercase tracking-wider font-semibold rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-gray-900">How</span>
            <span className="block sm:inline bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ml-0 sm:ml-3">
              OKPUJA Works
            </span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the divine through our streamlined process that connects you with 
            authentic spiritual traditions and expert pandits
          </p>
        </motion.div>

        {/* Enhanced Featured Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-orange-500 to-red-600 shadow-2xl rounded-3xl overflow-hidden mb-16 md:mb-20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-3xl"></div>
          
          <div className="relative flex flex-col lg:flex-row">
            {/* Content Side */}
            <div className="lg:w-1/2 p-8 md:p-12 xl:p-16 flex flex-col justify-center">
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Experience Sacred Traditions 
                <span className="block text-orange-100">With Ease</span>
              </h3>

              <div className="space-y-4 mb-8">
                {[
                  "Expert pandits and purohits with verified credentials",
                  "Rituals tailored to your specific requirements and traditions", 
                  "Convenient puja samagri delivery right to your doorstep"
                ].map((text, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl mr-4 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-white/90 leading-relaxed">{text}</p>
                  </motion.div>
                ))}
              </div>

              <Link href="/pujaservice">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block bg-white text-orange-600 font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-orange-50"
                >
                  Book Your Puja Now
                </motion.span>
              </Link>
            </div>

            {/* Image Side */}
            <div className="lg:w-1/2 relative h-80 lg:h-auto min-h-[400px]">
              <Image
                src="/image/hawan.jpg"
                alt="Sacred hawan ceremony"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/40 via-transparent to-transparent lg:from-transparent"></div>
              
              {/* Floating elements on image */}
              <div className="absolute top-8 right-8 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Process Steps with enhanced design */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          {/* Enhanced Connecting Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-orange-200 via-red-300 to-orange-200 z-0 rounded-full"></div>
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 z-0 rounded-full animate-pulse opacity-50"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="relative z-10 group"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden h-full flex flex-col transition-all duration-500 border border-white/20">
                  {/* Enhanced Image Section */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={step.imagesrc}
                      alt={step.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Enhanced Step Number */}
                    <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>

                    {/* Icon overlay with better styling */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 text-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {step.icon}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Content Section */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      {step.description}
                    </p>
                    
                    {/* Progress indicator */}
                    <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mt-4 group-hover:w-24 transition-all duration-500"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 md:mt-20"
        >
          <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
            Ready to experience a seamless spiritual journey with authentic traditions and expert guidance?
          </p>
          <Link href="/pujaservice">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Spiritual Journey
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
