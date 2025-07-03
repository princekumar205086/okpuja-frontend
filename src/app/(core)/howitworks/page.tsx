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
  return (
    <section className="bg-gradient-to-b from-cream to-cream/90 pt-10 pb-8 sm:pt-12 sm:pb-8 lg:pt-16 lg:pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 md:mb-10"
        >
          <span className="text-redOrange text-sm uppercase font-semibold tracking-wider">
            Simple Process
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 text-gray-800">
            How OKPUJA Works
          </h2>
          <div className="w-16 h-1 bg-redOrange mx-auto mt-3 mb-4 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg">
            Immerse yourself in the serenity of sacred puja services with just a
            few simple steps.
          </p>
        </motion.div>

        {/* Featured Section with Image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-redOrange shadow-xl rounded-2xl overflow-hidden mb-10 sm:mb-12"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Content Side */}
            <div className="lg:w-1/2 p-5 sm:p-6 md:p-8 xl:p-10 flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-cream mb-3 sm:mb-4">
                Experience Sacred Traditions With Ease
              </h3>

              <div className="space-y-3 mb-5 sm:mb-6">
                <div className="flex items-start">
                  <div className="bg-cream/20 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-cream"
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
                  <p className="text-cream">
                    Expert pandits and purohits with verified credentials
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="bg-cream/20 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-cream"
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
                  <p className="text-cream">
                    Rituals tailored to your specific requirements and
                    traditions
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="bg-cream/20 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-cream"
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
                  <p className="text-cream">
                    Convenient puja samagri delivery right to your doorstep
                  </p>
                </div>
              </div>

              <Link href="/pujaservice">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block bg-cream text-redOrange font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Book Your Puja Now
                </motion.span>
              </Link>
            </div>

            {/* Image Side */}
            <div className="lg:w-1/2 relative h-64 sm:h-80 lg:h-auto">
              <Image
                src="/image/hawan.jpg"
                alt="Sacred hawan ceremony"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-redOrange/60 to-transparent lg:from-transparent"></div>
            </div>
          </div>
        </motion.div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connecting Line (visible on tablet and up) */}
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 sm:gap-y-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative z-10"
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 sm:h-40">
                    <Image
                      src={step.imagesrc}
                      alt={step.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Step Number */}
                    <div className="absolute -top-1 -left-1 w-12 h-12 bg-redOrange rounded-br-xl flex items-center justify-center text-xl font-bold text-white shadow-md">
                      {index + 1}
                    </div>

                    {/* Icon overlay */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-3 text-redOrange">
                        {step.icon}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm flex-grow">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center mt-10"
        >
          <p className="text-gray-700 mb-4 text-lg">
            Ready to experience a seamless spiritual journey with OKPUJA?
          </p>
          <Link href="/pujaservice">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-redOrange hover:bg-redOrange/90 text-white font-medium px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Get Started
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
