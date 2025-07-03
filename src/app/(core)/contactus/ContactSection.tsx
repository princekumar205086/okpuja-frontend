"use client"
import React from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

const ContactSection = () => {
  const contactInfo = [
    {
      title: "Visit Our Office",
      icon: <FaMapMarkerAlt className="text-3xl sm:text-4xl text-orange-500" />,
      content: "Ram Ratan Ji Nagar Rambagh, Purnia, Bihar, 854301",
      action: {
        text: "Get Directions",
        url: "https://maps.google.com/?q=Ram+Ratan+Ji+Nagar+Rambagh+Purnia+Bihar+854301",
        icon: <FaArrowRight className="ml-1" />
      }
    },
    {
      title: "Call or WhatsApp",
      icon: <FaPhone className="text-3xl sm:text-4xl text-orange-500" />,
      content: "+91 9471661636",
      action: {
        text: "Call Now",
        url: "tel:+919471661636",
        icon: <FaPhone className="ml-1" />
      },
      secondary: {
        text: "WhatsApp",
        url: "https://wa.me/919471661636",
        icon: <FaWhatsapp className="ml-1" />
      }
    },
    {
      title: "Email & Website",
      icon: <FaEnvelope className="text-3xl sm:text-4xl text-orange-500" />,
      content: (
        <>
          <p className="mb-1">namaste@okpuja.com</p>
          <p>www.okpuja.com</p>
        </>
      ),
      action: {
        text: "Send Email",
        url: "mailto:namaste@okpuja.com",
        icon: <FaEnvelope className="ml-1" />
      }
    }
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-orange-600 to-orange-500 py-12 sm:py-16 overflow-hidden" aria-label="Contact Information">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Connect With Us</h2>
          <div className="h-1 w-24 bg-white/40 mx-auto rounded-full"></div>
          <p className="text-white/80 mt-4 max-w-xl mx-auto">
            We&apos;re here to provide spiritual guidance and services. Reach out to us through any of these channels.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              tabIndex={0}
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-orange-50 p-4 rounded-full mb-5" aria-hidden="true">
                  {info.icon}
                </div>
                <h3 className="text-xl text-gray-800 font-bold mb-3" id={`contact-${index}`}>
                  {info.title}
                </h3>
                <div className="text-gray-600 mb-5 min-h-[3rem]" aria-labelledby={`contact-${index}`}>
                  {info.content}
                </div>

                {/* Action Buttons */}
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  <Link 
                    href={info.action.url}
                    target={info.action.url.startsWith('http') ? "_blank" : undefined}
                    rel={info.action.url.startsWith('http') ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-medium transition-colors duration-200"
                  >
                    {info.action.text} {info.action.icon}
                  </Link>
                  
                  {info.secondary && (
                    <Link 
                      href={info.secondary.url}
                      target={info.secondary.url.startsWith('http') ? "_blank" : undefined}
                      rel={info.secondary.url.startsWith('http') ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors duration-200"
                    >
                      {info.secondary.text} {info.secondary.icon}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Business Hours - Desktop and Mobile Responsive */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-bold text-white mb-4">Business Hours</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Weekdays</h4>
              <div className="space-y-2 text-white/90">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Weekends</h4>
              <div className="space-y-2 text-white/90">
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-friendly Quick Actions - Visible only on smaller screens */}
        <div className="mt-8 sm:hidden">
          <div className="flex justify-center space-x-4">
            <a 
              href="tel:+919471661636" 
              className="flex items-center justify-center bg-white text-orange-600 h-12 w-12 rounded-full shadow-lg hover:bg-orange-100 transition-colors"
              aria-label="Call us"
            >
              <FaPhone />
            </a>
            <a 
              href="https://wa.me/919471661636" 
              className="flex items-center justify-center bg-green-500 text-white h-12 w-12 rounded-full shadow-lg hover:bg-green-600 transition-colors"
              aria-label="WhatsApp us"
            >
              <FaWhatsapp />
            </a>
            <a 
              href="mailto:namaste@okpuja.com" 
              className="flex items-center justify-center bg-white text-orange-600 h-12 w-12 rounded-full shadow-lg hover:bg-orange-100 transition-colors"
              aria-label="Email us"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;