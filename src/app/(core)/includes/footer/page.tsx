"use client";
import React from "react";
import Image from "next/image";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
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

  return (
    <footer className="bg-gradient-to-b from-cream to-[#F8EFBA] pt-12 relative">
      {/* Top decorative element */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-redOrange"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="max-w-5xl mx-auto mb-14 px-4 py-8 bg-white rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Stay updated with the latest spiritual events and offers
              </p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-redOrange/50 w-full"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-redOrange text-white font-medium rounded-lg hover:bg-redOrange/90 transition-colors duration-200 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          {/* Company Info Section */}
          <div className="bg-white/60 rounded-xl p-6 shadow-md">
            <div className="flex justify-center sm:justify-start mb-5">
              <Image
                src="/image/okpuja logo social.png"
                alt="Okpuja Logo"
                width={130}
                height={130}
                className="object-contain"
              />
            </div>
            <p className="text-gray-700 text-sm mb-6">
              Okpuja offers seamless and sacred Puja services, ensuring a
              blissful experience from booking to completion. Our platform
              boasts the best Pandits and Purohits, with options available in
              multiple languages.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61564270386024"
                aria-label="Facebook"
              >
                <div className="w-9 h-9 flex items-center justify-center bg-redOrange text-white rounded-full hover:bg-redOrange/80 transition-colors duration-200">
                  <FaFacebook size={18} />
                </div>
              </Link>
              <Link href="https://wa.me/918051555505" aria-label="WhatsApp">
                <div className="w-9 h-9 flex items-center justify-center bg-redOrange text-white rounded-full hover:bg-redOrange/80 transition-colors duration-200">
                  <FaWhatsapp size={18} />
                </div>
              </Link>
              <Link
                href="https://www.instagram.com/invites/contact/?i=1j2rqp3o76eq5&utm_content=v2q78s6"
                aria-label="Instagram"
              >
                <div className="w-9 h-9 flex items-center justify-center bg-redOrange text-white rounded-full hover:bg-redOrange/80 transition-colors duration-200">
                  <FaInstagram size={18} />
                </div>
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <div className="w-9 h-9 flex items-center justify-center bg-redOrange text-white rounded-full hover:bg-redOrange/80 transition-colors duration-200">
                  <FaLinkedin size={18} />
                </div>
              </Link>
            </div>
          </div>

          {/* Links Section */}
          <div className="bg-white/60 rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.link}
                    className="text-gray-600 hover:text-redOrange transition-colors duration-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-2 text-redOrange"
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
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-6 pb-2 border-b border-gray-200">
              Legal
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.link}
                    className="text-gray-600 hover:text-redOrange transition-colors duration-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-2 text-redOrange"
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
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Puja Services Section */}
          <div className="bg-white/60 rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Popular Pujas
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {pujaList.map((puja, index) => (
                <Link
                  key={index}
                  href={puja.link}
                  className="text-gray-600 hover:text-redOrange transition-colors duration-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-2 text-redOrange"
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
                  {puja.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white/60 rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mr-3 mt-1 text-redOrange">
                  <FaMapMarkerAlt />
                </div>
                <span className="text-gray-600 text-sm">
                  Ram Ratan Ji Nagar Rambagh, Purnia, Bihar, 854301
                </span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 text-redOrange">
                  <FaPhoneAlt />
                </div>
                <a
                  href="tel:+919471661636"
                  className="text-gray-600 hover:text-redOrange text-sm"
                >
                  +91 9471661636
                </a>
              </li>
              <li className="flex items-center">
                <div className="mr-3 text-redOrange">
                  <FaEnvelope />
                </div>
                <a
                  href="mailto:namaste@okpuja.com"
                  className="text-gray-600 hover:text-redOrange text-sm"
                >
                  namaste@okpuja.com
                </a>
              </li>
            </ul>

            {/* Payment Section */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                Secure Payment Options
              </h4>
              <div className="flex items-center mb-3">
                <Image
                  src="/image/phonepe.svg"
                  alt="Phonepe"
                  width={100}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-2 py-1 bg-gray-100 rounded-md flex items-center text-xs text-gray-600">
                  <FaCreditCard className="mr-1" /> Cards
                </div>
                <div className="px-2 py-1 bg-gray-100 rounded-md flex items-center text-xs text-gray-600">
                  <FaMobileAlt className="mr-1" /> UPI
                </div>
                <div className="px-2 py-1 bg-gray-100 rounded-md flex items-center text-xs text-gray-600">
                  <FaUniversity className="mr-1" /> Net Banking
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider and additional links */}
        <div className="border-t border-gray-300 pt-6 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Popular Locations
              </h4>
              <p className="text-xs text-gray-600">
                Mumbai • Delhi • Bangalore • Chennai • Hyderabad • Kolkata •
                Pune • Jaipur • Ahmedabad • Lucknow • Patna • Bhopal •
                Chandigarh • Guwahati • Kochi
              </p>
            </div>
            {/* <div className="text-center md:text-right">
              <Link
                href="/download"
                className="inline-block px-4 py-2 bg-redOrange text-white text-sm rounded-lg hover:bg-redOrange/90 transition-colors duration-200"
              >
                <span className="flex items-center">
                  <FaMobileAlt className="mr-2" />
                  Download App
                </span>
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-redOrange py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-white text-sm mb-2 sm:mb-0">
              &copy; {new Date().getFullYear()} Okpuja. All Rights Reserved.
            </p>
            <p className="text-white text-sm flex items-center">
              Powered by{" "}
              <Link
                href="https://www.webdigger.in"
                className="ml-1 hover:underline font-medium"
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
