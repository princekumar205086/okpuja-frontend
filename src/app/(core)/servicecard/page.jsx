"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import "./servicecard.css";

export default function ServiceCard() {
  const serviceData = [
    {
      image: "/image/havan kund.jpeg",
      number: "40000+",
      text: "Pujas and homas performed",
      icon: "🔥"
    },
    {
      image: "/image/pandits.jpeg",
      number: "1200+",
      text: "Pandits and Purohits",
      icon: "🙏"
    },
    {
      image: "/image/deep.jpeg",
      number: "400+",
      text: "Total unique services",
      icon: "✨"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative py-6 sm:py-8 md:py-10 bg-cream">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-800"
        >
          Our Impact in Numbers
          <div className="w-20 h-1.5 bg-redOrange mx-auto rounded-full mb-4"></div>
        </motion.h2>
        <motion.div
          className="flex flex-wrap justify-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {serviceData.map((item, index) => (
            <motion.div
              key={index}
              className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-5 sm:mb-0"
              variants={cardVariants}
            >
              <div className="h-full p-4 sm:p-5 md:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-center items-center relative overflow-hidden group">
                {/* Background pattern for visual interest */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5 bg-redOrange rounded-full -mr-6 -mt-6"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 opacity-5 bg-redOrange rounded-full -ml-10 -mb-10"></div>

                {/* Icon badge */}
                <div className="absolute top-4 right-4 bg-redOrange/10 text-redOrange rounded-full w-8 h-8 flex items-center justify-center">
                  {item.icon}
                </div>

                {/* Card image with improved styling */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 rounded-full overflow-hidden bg-orange-100 p-1">
                  <Image
                    alt={item.text}
                    src={item.image}
                    className="object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                    fill
                    quality={90}
                    sizes="(max-width: 768px) 5rem, 6rem"
                  />
                </div>

                {/* Counter number with highlight */}
                <div className="mb-1 relative">
                  <p className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-orange-600">
                    {item.number}
                  </p>
                  <div className="absolute -bottom-1 left-0 right-0 h-3 bg-orange-100 opacity-40 -z-10 rounded-full transform -rotate-1"></div>
                </div>

                {/* Service description */}
                <p className="text-orange-500 text-base sm:text-lg font-medium text-center max-w-xs">
                  {item.text}
                </p>

                {/* Subtle accent line */}
                <div className="w-12 h-1 bg-orange-400 rounded-full mt-4 group-hover:w-24 transition-all duration-300"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="hidden md:block absolute top-10 left-10 w-16 h-16 border-4 border-orange-200 rounded-full opacity-20"></div>
      <div className="hidden md:block absolute bottom-10 right-10 w-24 h-24 border-4 border-orange-200 rounded-full opacity-20"></div>
    </section>
  );
}