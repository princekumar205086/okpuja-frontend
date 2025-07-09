
"use client";
import React from "react";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  // Sample data for Puja list
  const pujaList = [
    { name: "Ganesh Puja", link: "/puja/ganesh-puja" },
    { name: "Navratri Puja", link: "/puja/navratri-puja" },
    { name: "Diwali Puja", link: "/puja/diwali-puja" },
    { name: "Durga Puja", link: "/puja/durga-puja" },
    { name: "Saraswati Puja", link: "/puja/saraswati-puja" },
    { name: "Shiva Puja", link: "/puja/shiva-puja" },
    { name: "Krishna Janmashtami Puja", link: "/puja/janmashtami-puja" },
    { name: "Lakshmi Puja", link: "/puja/lakshmi-puja" },
    { name: "Satyanarayan Puja", link: "/puja/satyanarayan-puja" },
  ];

  // Sample data for Menu list
  const quickLinks = [
    { name: "Create Account", link: "/register" },
    { name: "Account Login", link: "/login" },
    { name: "About Us", link: "/about" },
    { name: "Puja Services", link: "/pujaservice" },
    { name: "Astrology Services", link: "/astrology" },
    { name: "Contact Us", link: "/contactus" },
    { name: "Blog", link: "/blog" },
  ];

  const legalLinks = [
    { name: "Terms of Service", link: "/terms-of-service" },
    { name: "Privacy Policy", link: "/privacy-policy" },
    { name: "Cancellation & Refund", link: "/cancellation-refund-policy" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full blur-3xl"></div>
      </div>

      {/* Top decorative element */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto py-16 px-6 md:px-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl shadow-2xl transform -translate-y-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-8 lg:mb-0 lg:mr-8 text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Stay Connected with Divine Blessings
              </h3>
              <p className="text-orange-100 text-lg">
                Get exclusive updates on spiritual events, special offers, and sacred ceremonies
              </p>
            </div>
            <div className="w-full lg:w-auto lg:min-w-[400px]">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/20 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-2xl hover:bg-orange-50 transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  Subscribe
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12"
        >
          {/* Company Info Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex justify-center lg:justify-start mb-6">
                <Image
                  src="/image/okpuja logo social.png"
                  alt="Okpuja Logo"
                  width={140}
                  height={140}
                  className="object-contain filter brightness-0 invert"
                />
              </div>
              <p className="text-gray-300 leading-relaxed mb-8">
                Okpuja offers seamless and sacred Puja services, ensuring a blissful experience 
                from booking to completion. Connect with verified Pandits and Purohits in multiple languages.
              </p>
              <div className="flex justify-center lg:justify-start space-x-3">
                {[
                  { icon: FaFacebook, href: "https://www.facebook.com/profile.php?id=61564270386024", label: "Facebook" },
                  { icon: FaWhatsapp, href: "https://wa.me/918051555505", label: "WhatsApp" },
                  { icon: FaInstagram, href: "https://www.instagram.com/invites/contact/?i=1j2rqp3o76eq5&utm_content=v2q78s6", label: "Instagram" },
                  { icon: FaLinkedin, href: "#", label: "LinkedIn" }
                ].map(({ icon: Icon, href, label }, index) => (
                  <Link key={index} href={href} aria-label={label}>
                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg">
                      <Icon size={20} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
              <h3 className="text-xl font-bold text-white mb-6 pb-3 border-b border-orange-500/30">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.link}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group"
                    >
                      <FaArrowRight className="h-3 w-3 mr-3 text-orange-500 group-hover:translate-x-1 transition-transform duration-200" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-white mb-6 mt-8 pb-3 border-b border-orange-500/30">
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.link}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group"
                    >
                      <FaArrowRight className="h-3 w-3 mr-3 text-orange-500 group-hover:translate-x-1 transition-transform duration-200" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Puja Services Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
              <h3 className="text-xl font-bold text-white mb-6 pb-3 border-b border-orange-500/30">
                Popular Pujas
              </h3>
              <div className="space-y-3">
                {pujaList.map((puja, index) => (
                  <Link
                    key={index}
                    href={puja.link}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group"
                  >
                    <FaArrowRight className="h-3 w-3 mr-3 text-orange-500 group-hover:translate-x-1 transition-transform duration-200" />
                    {puja.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
              <h3 className="text-xl font-bold text-white mb-6 pb-3 border-b border-orange-500/30">
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 mt-1 text-orange-500 bg-orange-500/10 p-2 rounded-lg">
                    <FaMapMarkerAlt />
                  </div>
                  <span className="text-gray-300 leading-relaxed">
                    Ram Ratan Ji Nagar Rambagh, Purnia, Bihar, 854301
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="mr-4 text-orange-500 bg-orange-500/10 p-2 rounded-lg">
                    <FaPhoneAlt />
                  </div>
                  <a
                    href="tel:+919471661636"
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    +91 9471661636
                  </a>
                </li>
                <li className="flex items-center">
                  <div className="mr-4 text-orange-500 bg-orange-500/10 p-2 rounded-lg">
                    <FaEnvelope />
                  </div>
                  <a
                    href="mailto:namaste@okpuja.com"
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    namaste@okpuja.com
                  </a>
                </li>
              </ul>

              {/* Enhanced Payment Section */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Secure Payments
                </h4>
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <Image
                    src="/image/phonepe.svg"
                    alt="Phonepe"
                    width={120}
                    height={35}
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: FaCreditCard, label: "Cards" },
                    { icon: FaMobileAlt, label: "UPI" },
                    { icon: FaUniversity, label: "Banking" }
                  ].map(({ icon: Icon, label }, index) => (
                    <div key={index} className="px-3 py-2 bg-white/10 rounded-lg flex items-center text-sm text-gray-300 backdrop-blur-sm">
                      <Icon className="mr-2 text-orange-500" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Popular Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-white/20 pt-8 pb-8"
        >
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-4">
              Serving Devotees Across India
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed max-w-4xl mx-auto">
              Mumbai • Delhi • Bangalore • Chennai • Hyderabad • Kolkata • Pune • Jaipur • 
              Ahmedabad • Lucknow • Patna • Bhopal • Chandigarh • Guwahati • Kochi • and many more cities
            </p>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Copyright Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-slate-900 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 mb-3 sm:mb-0">
              &copy; {new Date().getFullYear()} Okpuja. All Rights Reserved. Made with ❤️ for spiritual seekers.
            </p>
            <p className="text-gray-400 flex items-center">
              Powered by{" "}
              <Link
                href="https://www.webdigger.in"
                className="ml-2 text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200"
              >
                Webdigger
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
