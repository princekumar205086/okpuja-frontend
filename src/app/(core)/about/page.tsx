"use client";
import { useState, useEffect } from "react";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaQuoteLeft,
  FaUsers,
  FaHandHoldingHeart,
  FaCalendarAlt,
  FaStar,
  FaCheckCircle,
  FaHeart,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";
import { motion, useAnimation, easeInOut } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import MissionVision from "./mission";
import CustomerReviews from "../customerreview/page";
import ContactForm from "../contactus/contactForm";

const AboutPage = () => {
  const [activeProfile, setActiveProfile] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easeInOut, // Use the imported easing function
      },
    },
  };

  const profiles = [
    {
      name: "Shri Rohan Shree",
      title: "Founder & CEO",
      image: "/image/rohan.jpg",
      bio: "With over 15 years of experience in traditional Hindu rituals and ceremonies, Shri Rohan brings exceptional knowledge and leadership to our organization.",
      social: {
        linkedin: "https://linkedin.com/in/rohanshree",
        twitter: "https://twitter.com/rohanshree",
        github: "https://github.com/rohanshree",
      },
    },
    {
      name: "Pandit Suraj Bhardwaj",
      title: "Managing Director",
      image: "/image/suraj.jpg",
      bio: "Pandit Suraj is a 5th generation priest with deep expertise in Vedic traditions and modern management principles, ensuring authentic service delivery.",
      social: {
        linkedin: "https://linkedin.com/in/surajbhardwaj",
        twitter: "https://twitter.com/surajbhardwaj",
        github: "https://github.com/surajbhardwaj",
      },
    },
  ];

  const companyStats = [
    {
      number: "10,000+",
      label: "Satisfied Devotees",
      icon: <FaUsers className="text-orange-500 text-4xl mb-4" />,
      description: "Happy customers served nationwide"
    },
    {
      number: "500+",
      label: "Qualified Pandits",
      icon: <FaHeart className="text-red-500 text-4xl mb-4" />,
      description: "Expert spiritual guides"
    },
    {
      number: "5,000+",
      label: "Pujas Conducted",
      icon: <FaCalendarAlt className="text-blue-500 text-4xl mb-4" />,
      description: "Sacred ceremonies completed"
    },
    {
      number: "50+",
      label: "Cities Covered",
      icon: <FaGlobe className="text-green-500 text-4xl mb-4" />,
      description: "Pan-India presence"
    },
  ];

  return (
    <>
      <div className="relative min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-400 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                About <span className="text-yellow-200">OKPUJA</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-orange-100 leading-relaxed">
                Connecting devotees with authentic Vedic traditions through qualified pandits and sacred ceremonies
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 text-yellow-200"
                >
                  <FaCheckCircle className="text-2xl" />
                  <span className="text-lg font-semibold">15+ Years of Trust</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 text-yellow-200"
                >
                  <FaStar className="text-2xl" />
                  <span className="text-lg font-semibold">10,000+ Happy Customers</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-1 left-0 right-0">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-white">
              <path d="M1200 120L0 16.48V0h1200v120z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        <MissionVision />

        {/* Company Story Section */}
        <div className="bg-gradient-to-b from-white to-orange-50 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Our <span className="text-orange-500">Journey</span>
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto mb-6"></div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  From humble beginnings to becoming India&apos;s trusted spiritual platform
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                  <Image
                    src="/image/about.jpeg"
                    alt="Company History"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <FaCalendarAlt className="text-orange-400 text-2xl" />
                      <p className="text-white text-2xl font-bold">
                        Established 2008
                      </p>
                    </div>
                    <p className="text-orange-200 text-lg">15+ Years of Spiritual Excellence</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <FaQuoteLeft className="text-5xl text-orange-400 opacity-60" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
                      Bridging Ancient Traditions with Modern Needs
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p className="text-lg">
                    OKPUJA began as a small family initiative to preserve
                    authentic Vedic traditions in a rapidly modernizing world.
                    What started as a small local service in 2008 has grown into a
                    trusted platform connecting devotees with qualified pandits
                    across the country.
                  </p>
                  <p className="text-lg">
                    Our journey has been guided by the principles of authenticity,
                    accessibility, and respect for tradition. We&apos;ve combined
                    ancient wisdom with technology to make sacred rituals
                    accessible to all, regardless of their location or background.
                  </p>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {[
                    { icon: <FaCheckCircle className="text-green-500" />, text: "Verified Pandits" },
                    { icon: <FaHeart className="text-red-500" />, text: "Authentic Rituals" },
                    { icon: <FaGlobe className="text-blue-500" />, text: "Pan-India Service" },
                    { icon: <FaStar className="text-yellow-500" />, text: "5-Star Rated" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-xl">{feature.icon}</div>
                      <span className="font-medium text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              {companyStats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-white rounded-xl shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-center mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-600 mb-2">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Meet Our Team - Enhanced section */}
        <div
          ref={ref}
          className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50"
        >
          <motion.div
            className="max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Meet Our <span className="text-orange-500">Leaders</span>
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto mb-6"></div>
                <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
                  Our team of dedicated professionals brings together decades of
                  experience in Vedic traditions and modern service excellence.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {profiles.map((profile, index) => (
                <motion.div
                  key={index}
                  className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${
                    activeProfile === index ? "transform scale-105" : ""
                  } group`}
                  onMouseEnter={() => setActiveProfile(index)}
                  onMouseLeave={() => setActiveProfile(null)}
                  tabIndex={0}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative">
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        alt={profile.name}
                        src={profile.image}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-bold text-2xl text-white mb-2 group-hover:text-orange-200 transition-colors duration-300">
                        {profile.name}
                      </h3>
                      <p className="text-orange-200 text-lg font-medium">{profile.title}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 text-base mb-6 leading-relaxed">{profile.bio}</p>
                    <div className="flex justify-center space-x-6 pt-4 border-t border-gray-100">
                      <a
                        href={profile.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-300"
                        aria-label={`LinkedIn profile of ${profile.name}`}
                      >
                        <FaLinkedin size={24} />
                      </a>
                      <a
                        href={profile.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600 hover:scale-110 transition-all duration-300"
                        aria-label={`Twitter profile of ${profile.name}`}
                      >
                        <FaTwitter size={24} />
                      </a>
                      <a
                        href={profile.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-900 hover:scale-110 transition-all duration-300"
                        aria-label={`GitHub profile of ${profile.name}`}
                      >
                        <FaGithub size={24} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div 
              className="mt-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Join Our Growing Team</h3>
                <p className="text-orange-100 mb-6 text-lg">
                  Interested in being part of our mission to preserve and share Vedic traditions?
                </p>
                <Link
                  href="/career"
                  className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  View Open Positions
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Testimonials Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-orange-50 to-amber-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-gray-900">What Our </span><span className="text-orange-500">Clients Say</span>
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto mb-6"></div>
                <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
                  Hear from thousands of satisfied devotees who have experienced authentic spiritual ceremonies with us
                </p>
              </motion.div>
            </div>
            <CustomerReviews />
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-gradient-to-br from-slate-900 via-orange-900 to-amber-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Get in <span className="text-orange-300">Touch</span>
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto mb-6"></div>
                <p className="max-w-3xl mx-auto text-xl text-orange-100 leading-relaxed">
                  Have questions about our services? We&apos;d love to hear from you!
                  Our team is here to help make your spiritual journey meaningful.
                </p>
              </motion.div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
