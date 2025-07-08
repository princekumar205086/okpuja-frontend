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
} from "react-icons/fa";
import { motion, useAnimation, easeInOut } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import MissionVision from "./mission";
import "./about.css";
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
      number: "5000+",
      label: "Pujas Conducted",
      icon: <FaCalendarAlt className="text-orange-500 text-3xl mb-3" />,
    },
    {
      number: "1200+",
      label: "Happy Clients",
      icon: <FaUsers className="text-orange-500 text-3xl mb-3" />,
    },
    {
      number: "15+",
      label: "Years Experience",
      icon: <FaHandHoldingHeart className="text-orange-500 text-3xl mb-3" />,
    },
  ];

  return (
    <>
      <div className="relative">
        <MissionVision />

        {/* Company Story Section - New addition */}
        <div className="bg-gradient-to-b from-white to-orange-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Story
              </h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="/image/about.jpeg"
                    alt="Company History"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-white text-lg font-semibold">
                      Established 2008
                    </p>
                    <p className="text-orange-200">15+ Years of Excellence</p>
                  </div>
                </div>
              </div>

              <div>
                <FaQuoteLeft className="text-4xl text-orange-400 mb-4 opacity-60" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Bridging Ancient Traditions with Modern Needs
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  OKPUJA began as a small family initiative to preserve
                  authentic Vedic traditions in a rapidly modernizing world.
                  What started as a small local service in 2008 has grown into a
                  trusted platform connecting devotees with qualified pandits
                  across the country.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our journey has been guided by the principles of authenticity,
                  accessibility, and respect for tradition. We&apos;ve combined
                  ancient wisdom with technology to make sacred rituals
                  accessible to all, regardless of their location or background.
                </p>

                {/* Stats Counter */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                  {companyStats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-white rounded-lg shadow-md border border-orange-100"
                    >
                      {stat.icon}
                      <div className="text-2xl font-bold text-gray-800">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet Our Team - Enhanced section */}
        <div
          ref={ref}
          className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-orange-100"
        >
          <motion.div
            className="max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
              <p className="max-w-2xl mx-auto text-gray-600">
                Our team of dedicated professionals brings together decades of
                experience in Vedic traditions and modern service excellence.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {profiles.map((profile, index) => (
                <motion.div
                  key={index}
                  className={`bg-white rounded-xl overflow-hidden shadow-xl transition-all duration-300 ${activeProfile === index ? "transform scale-105" : ""
                    } hover:shadow-2xl`}
                  style={{
                    maxWidth: isMobile ? "100%" : "380px",
                    width: "100%",
                  }}
                  onMouseEnter={() => setActiveProfile(index)}
                  onMouseLeave={() => setActiveProfile(null)}
                  tabIndex={0}
                  variants={itemVariants}
                >
                  <div className="relative">
                    <div className="relative h-64 sm:h-80 overflow-hidden">
                      <Image
                        alt={profile.name}
                        src={profile.image}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-bold text-lg text-white mb-1">
                        {profile.name}
                      </h3>
                      <p className="text-orange-200 text-sm">{profile.title}</p>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <p className="text-gray-600 text-sm mb-4">{profile.bio}</p>
                    <div className="flex justify-start space-x-4">
                      <a
                        href={profile.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 transition-colors duration-300"
                        aria-label={`LinkedIn profile of ${profile.name}`}
                      >
                        <FaLinkedin size={22} />
                      </a>
                      <a
                        href={profile.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600 transition-colors duration-300"
                        aria-label={`Twitter profile of ${profile.name}`}
                      >
                        <FaTwitter size={22} />
                      </a>
                      <a
                        href={profile.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
                        aria-label={`GitHub profile of ${profile.name}`}
                      >
                        <FaGithub size={22} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <p className="text-gray-600 mb-6">
                Interested in joining our team of professionals?
              </p>
              <Link
                href="/careers"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
              >
                View Open Positions
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Testimonials Section - Enhanced with better responsiveness */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Client Testimonials
              </h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
            </div>
            <CustomerReviews />
          </div>
        </div>

        {/* Contact Form - Enhanced section */}
        <div className="bg-gradient-to-b from-orange-50 to-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
              <p className="max-w-2xl mx-auto text-gray-600">
                Have questions about our services? We&apos;d love to hear from you!
                Fill out the form below and we&apos;ll get back to you as soon as
                possible.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
