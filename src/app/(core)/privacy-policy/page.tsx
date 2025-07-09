"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaPrint,
  FaArrowUp,
  FaClipboard,
  FaCheck,
  FaInfoCircle,
  FaChevronDown,
  FaChevronRight,
  FaUserShield,
  FaLock,
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaBookmark,
  FaExternalLinkAlt,
  FaDatabase,
  FaCookie,
  FaEye,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const PrivacyPolicy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const policyContainerRef = useRef<HTMLDivElement>(null);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);

      if (policyContainerRef.current) {
        const sections = policyContainerRef.current.querySelectorAll("section");
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(parseInt(section.id.split("-")[1]));
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  interface PrivacyContent {
    id: number;
    title: string;
    content: string;
    icon: React.ReactNode;
    highlights?: string[];
    category: string;
  }

  const privacyPolicyContent: PrivacyContent[] = [
    {
      id: 1,
      title: "Introduction",
      icon: <FaUserShield />,
      category: "overview",
      content: "At OKPUJA, we value your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect, why we collect it, how we use it, and the measures we take to ensure it is handled safely and responsibly. By using our website and services, you agree to the collection and use of your data in accordance with this policy.",
      highlights: ["Effective as of March 1, 2025", "Applies to all services offered through OKPUJA"],
    },
    {
      id: 2,
      title: "Information We Collect",
      icon: <FaDatabase />,
      category: "data",
      content: "We collect two types of information: personal information and non-personal information. Personal Information includes data you provide when you register on our platform, book a service, or communicate with us. It may include your name, email address, phone number, billing address, and payment details. Non-Personal Information includes details such as your IP address, browser type, operating system, device information, and browsing behavior on our site.",
      highlights: ["Personal data: name, email, phone, address", "Non-personal data: IP address, browser info, cookies"],
    },
    {
      id: 3,
      title: "How We Use Your Information",
      icon: <FaEye />,
      category: "usage",
      content: "We use the information collected to provide and enhance our services. Your personal information is essential for processing bookings, managing accounts, sending service confirmations, and communicating with you about your service requests. We use non-personal data to analyze trends, improve website functionality, and ensure an optimal user experience. With your consent, we may use your contact details to inform you about special offers, new services, or updates.",
      highlights: ["Processing bookings and service requests", "Improving website functionality", "Marketing communications (opt-out available)"],
    },
    {
      id: 4,
      title: "Data Sharing and Disclosure",
      icon: <FaShieldAlt />,
      category: "sharing",
      content: "We treat your personal information with the utmost confidentiality and will not share, sell, or rent your data to third parties for their marketing purposes. We may share data with trusted third parties who assist us in operating our platform and delivering services. These parties are required to protect your information and only use it to fulfill their services to OKPUJA. We may disclose your information if required by law or to protect our rights and safety.",
      highlights: ["No selling or renting of data to third parties", "Limited sharing with trusted service providers", "Disclosure when legally required"],
    },
    {
      id: 5,
      title: "Data Security",
      icon: <FaLock />,
      category: "security",
      content: "We implement a range of security measures to safeguard your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include secure servers, encryption of sensitive data (such as payment information), and regular security audits. However, no method of internet transmission or electronic storage is completely secure, and while we strive to protect your personal data, we cannot guarantee its absolute security.",
      highlights: ["Secure servers and encryption technologies", "Regular security audits", "Continuous monitoring for vulnerabilities"],
    },
    {
      id: 6,
      title: "Cookies and Tracking Technologies",
      icon: <FaCookie />,
      category: "cookies",
      content: "Our website uses cookies and similar tracking technologies to enhance your browsing experience. Cookies help us understand user behavior, personalize content, and analyze web traffic. You can modify your browser settings to reject cookies, but this may limit some functionalities of our site. We also use tracking technologies to collect aggregate data about site usage to continuously improve our services.",
      highlights: ["Cookies used for personalization and analysis", "User option to modify cookie settings", "Aggregate data collection for site improvement"],
    },
    {
      id: 7,
      title: "Your Rights",
      icon: <FaUserShield />,
      category: "rights",
      content: "You have rights concerning your personal information, including the right to access, correct, or delete your data. Additionally, you can withdraw consent for data processing where applicable or restrict certain uses of your data. To exercise any of these rights, please contact us at support@okpuja.com. We will respond to your request within a reasonable timeframe and in accordance with applicable laws.",
      highlights: ["Right to access, correct, delete your data", "Option to withdraw consent anytime", "Prompt response to privacy requests"],
    },
    {
      id: 8,
      title: "Third-Party Links",
      icon: <FaExternalLinkAlt />,
      category: "links",
      content: "Our platform may contain links to third-party websites, which operate independently of our privacy practices. These websites are governed by their own privacy policies, and we are not responsible for how they handle your data. We encourage you to review the privacy policies of any third-party sites you visit before providing any personal information.",
      highlights: ["Links to external websites not covered by our policy", "Independent privacy practices of third parties", "Recommendation to review third-party policies"],
    },
    {
      id: 9,
      title: "Children's Privacy",
      icon: <FaShieldAlt />,
      category: "children",
      content: "Our services are not intended for use by individuals under the age of 18. We do not knowingly collect or solicit personal information from children. If we become aware that we have collected personal data from a child without parental consent, we will take immediate steps to delete such information.",
      highlights: ["Services intended for users 18+", "No intentional collection of children's data", "Prompt deletion of any inadvertently collected data"],
    },
    {
      id: 10,
      title: "Changes to This Policy",
      icon: <FaInfoCircle />,
      category: "changes",
      content: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. Any modifications will be posted on this page, and the 'Effective Date' will be updated accordingly. We encourage you to periodically review this page to stay informed about how we protect your data. Continued use of our services after any changes constitutes your acceptance of the revised policy.",
      highlights: ["Policy updates reflect changing practices", "Notification of changes on this page", "Continued use signifies acceptance"],
    },
    {
      id: 11,
      title: "Contact Us",
      icon: <FaExternalLinkAlt />,
      category: "contact",
      content: "If you have any questions, concerns, or requests regarding this Privacy Policy or the way your personal data is handled, please contact us at support@okpuja.com. We are committed to resolving any issues promptly and efficiently.",
      highlights: ["Email: support@okpuja.com", "Phone: +91-9999999999", "Hours: Mon-Sat, 9:00 AM to 8:00 PM IST"],
    },
  ];

  const filteredContent = privacyPolicyContent.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => window.print();

  const handleCopyToClipboard = () => {
    const policyText = privacyPolicyContent
      .map((item) => `${item.id}. ${item.title}\n${item.content}\n\n`)
      .join("");

    navigator.clipboard.writeText(policyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: number) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
      if (isMobile) {
        setShowMobileSidebar(false);
      }
    }
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const toggleSection = (id: number) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20"></div>
        </div>
        
        <div className="relative py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <FaUserShield className="text-emerald-400 mr-2" />
                <span className="text-sm font-medium text-white">Privacy Protection</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Privacy 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> Policy</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Your privacy matters to us. Learn how we collect, use, and protect 
                your personal information on our platform.
              </p>
              
              <div className="mt-8 text-sm text-gray-400">
                <span>Last updated: March 15, 2025</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search privacy policy..."
                  className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  <FaPrint className="mr-2" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  {copied ? (
                    <>
                      <FaCheck className="mr-2 text-green-600" />
                      <span className="hidden sm:inline text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <FaClipboard className="mr-2" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Mobile Sidebar Toggle */}
          <div className="md:hidden mb-6">
            <button
              onClick={toggleMobileSidebar}
              className="w-full flex items-center justify-between bg-white rounded-xl p-4 shadow-lg border border-gray-100"
            >
              <span className="font-semibold text-gray-800 flex items-center">
                <FaBars className="mr-3 text-emerald-600" />
                Privacy Sections
              </span>
              {showMobileSidebar ? <FaTimes className="text-gray-600" /> : <FaBars className="text-gray-600" />}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8" ref={policyContainerRef}>
            
            {/* Sidebar */}
            <div
              className={`md:w-80 ${
                isMobile
                  ? `fixed inset-0 z-50 bg-black/50 transition-all duration-300 ${
                      showMobileSidebar ? "opacity-100 visible" : "opacity-0 invisible"
                    }`
                  : ""
              }`}
            >
              <div
                className={`${
                  isMobile
                    ? `bg-white h-full w-80 p-6 transform transition-transform duration-300 overflow-y-auto ${
                        showMobileSidebar ? "translate-x-0" : "-translate-x-full"
                      }`
                    : "sticky top-8"
                }`}
              >
                {isMobile && (
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Sections</h3>
                    <button
                      onClick={() => setShowMobileSidebar(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FaTimes className="text-gray-600" />
                    </button>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaBookmark className="mr-3 text-emerald-600" />
                    Quick Navigation
                  </h3>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {privacyPolicyContent.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center group ${
                          activeSection === item.id
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                            : "hover:bg-gray-50 text-gray-700 border border-gray-100"
                        }`}
                      >
                        <span className={`mr-3 text-sm ${activeSection === item.id ? "text-white" : "text-emerald-600"}`}>
                          {item.icon}
                        </span>
                        <div>
                          <div className="font-medium text-sm">
                            {item.id}. {item.title}
                          </div>
                          <div className={`text-xs mt-1 ${activeSection === item.id ? "text-emerald-100" : "text-gray-500"}`}>
                            {item.category}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              
              {/* No Results */}
              {filteredContent.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl shadow-xl border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaInfoCircle className="text-2xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No matches found</h3>
                  <p className="text-gray-600 max-w-md">
                    Try adjusting your search terms to find what you&apos;re looking for.
                  </p>
                </motion.div>
              )}

              {/* Policy Content */}
              <motion.div
                ref={ref}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {filteredContent.map((item, index) => (
                  <motion.section
                    key={item.id}
                    id={`section-${item.id}`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`bg-white rounded-2xl shadow-xl border-l-4 transition-all duration-500 overflow-hidden ${
                      activeSection === item.id
                        ? "border-emerald-500 shadow-2xl transform scale-[1.02]"
                        : "border-gray-200 hover:border-emerald-300 hover:shadow-2xl"
                    }`}
                  >
                    <div className="p-6 sm:p-8">
                      <div
                        className="flex justify-between items-start cursor-pointer"
                        onClick={() => isMobile && toggleSection(item.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                              item.category === "security"
                                ? "bg-red-100 text-red-600"
                                : item.category === "data"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-emerald-100 text-emerald-600"
                            }`}>
                              {item.icon}
                            </div>
                            <div>
                              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
                                <span className="text-emerald-600 mr-2">{item.id}.</span>
                                {item.title}
                              </h2>
                              <div className="flex items-center mt-2">
                                <span
                                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                                    item.category === "security"
                                      ? "bg-red-100 text-red-700"
                                      : item.category === "data"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-emerald-100 text-emerald-700"
                                  }`}
                                >
                                  {item.category.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {isMobile && (
                          <button
                            className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                          >
                            {expandedSection === item.id ? (
                              <FaChevronDown className="transform rotate-180 transition-transform duration-300" />
                            ) : (
                              <FaChevronDown className="transition-transform duration-300" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Content */}
                      {isMobile && expandedSection !== item.id ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4"
                        >
                          <p className="text-gray-600 leading-relaxed">
                            {item.content.substring(0, 150) + "..."}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSection(item.id);
                            }}
                            className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
                          >
                            Read more →
                          </button>
                        </motion.div>
                      ) : (
                        <AnimatePresence>
                          {(!isMobile || expandedSection === item.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-6">
                                <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4">
                                  {item.content}
                                </p>
                                
                                {item.highlights && (
                                  <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Points:</h4>
                                    <ul className="space-y-1">
                                      {item.highlights.map((highlight, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                                          {highlight}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              
                              {isMobile && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSection(item.id);
                                  }}
                                  className="mt-4 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
                                >
                                  ← Show less
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  </motion.section>
                ))}
              </motion.div>

              {/* Contact Section */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-8 sm:p-12 text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaUserShield className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Privacy Questions?</h3>
                  <p className="text-emerald-100 mb-6 max-w-2xl mx-auto text-lg">
                    If you have any questions about our privacy practices or how we handle your data, 
                    we&apos;re here to help.
                  </p>
                  <a
                    href="mailto:support@okpuja.com"
                    className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    Contact Support
                  </a>
                </div>
              </motion.div>

              {/* Footer */}
              <div className="mt-8 text-center text-gray-500 text-sm">
                <p>This privacy policy was last updated on March 15, 2025</p>
                <p className="mt-2">
                  For privacy concerns, reach us at{" "}
                  <a
                    href="mailto:support@okpuja.com"
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    support@okpuja.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-2xl hover:shadow-emerald-500/25 z-50 transition-all duration-300 transform hover:scale-110 print:hidden group"
            aria-label="Back to top"
          >
            <FaArrowUp className="text-lg group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default PrivacyPolicy;
