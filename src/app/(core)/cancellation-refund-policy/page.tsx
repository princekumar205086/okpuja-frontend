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
  FaFileAlt,
  FaUndo,
  FaCalendarAlt,
  FaBars,
  FaTimes,
  FaBookmark,
  FaExternalLinkAlt,
  FaMoneyBillWave,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const CancellationRefundPolicy = () => {
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

  interface TermContent {
    id: number;
    title: string;
    content: string;
    icon?: React.ReactNode;
    highlights?: string[];
    category: string;
  }

  const cancellationRefundPolicyContent: TermContent[] = [
    {
      id: 1,
      title: "Introduction",
      content: "This Cancellation/Refund Policy outlines the terms and conditions for canceling services and requesting refunds at OKPUJA. By using our services, you agree to the terms of this policy. We aim to provide clear guidelines to ensure a smooth experience for all our users.",
      icon: <FaFileAlt />,
      category: "overview",
      highlights: ["Effective as of March 1, 2025", "Applicable to all services offered through OKPUJA platform"],
    },
    {
      id: 2,
      title: "Cancellation Policy",
      content: "You may cancel your booking up to 48 hours before the scheduled service time to receive a full refund. Cancellations made between 24-48 hours prior to the service will receive a 50% refund. Cancellations made within 24 hours of the service time are not eligible for a refund except in extenuating circumstances as determined by our team. To cancel a booking, please log in to your account and navigate to the 'My Bookings' section, or contact our customer support team directly.",
      icon: <FaUndo />,
      category: "cancellation",
      highlights: ["Full refund: Cancellations 48+ hours before service", "Partial refund: Cancellations 24-48 hours before service", "No refund: Cancellations within 24 hours of service"],
    },
    {
      id: 3,
      title: "Refund Processing",
      content: "Refunds will be processed within 7-10 business days after the cancellation is confirmed. The refund amount will be credited to the original payment method used during booking. Please note that depending on your financial institution, it may take additional time for the refund to appear in your account. For international transactions, processing may take up to 14 business days. If you haven't received your refund after this period, please contact our support team.",
      icon: <FaMoneyBillWave />,
      category: "refund",
      highlights: ["7-10 business days processing time", "Refund to original payment method", "International transactions may take longer"],
    },
    {
      id: 4,
      title: "Non-Refundable Services",
      content: "Certain services may be non-refundable due to their nature or special promotional offers. These services will be clearly marked as non-refundable at the time of booking. Additionally, customized services that have already begun preparation may not be eligible for a full refund. In cases where a service provider has already incurred costs in preparation for your booking, a partial refund may be offered at OKPUJA's discretion.",
      icon: <FaExclamationTriangle />,
      category: "restrictions",
      highlights: ["Non-refundable services are clearly marked", "Customized services may have different refund policies", "Partial refunds may be offered for services in preparation"],
    },
    {
      id: 5,
      title: "Service Rescheduling",
      content: "As an alternative to cancellation, you may reschedule your service up to 24 hours before the scheduled time at no additional cost. Rescheduling requests made within 24 hours of the service may incur a rescheduling fee. Please note that rescheduling is subject to the availability of our service providers. You can reschedule through your account dashboard or by contacting our customer support team.",
      icon: <FaCalendarAlt />,
      category: "rescheduling",
      highlights: ["Free rescheduling up to 24 hours before service", "Rescheduling fee may apply for last-minute changes", "Subject to service provider availability"],
    },
    {
      id: 6,
      title: "Service Provider Cancellations",
      content: "In the rare event that a service provider needs to cancel or is unable to perform the service, we will notify you as soon as possible. In such cases, you will be offered a full refund or the option to reschedule at no additional cost. If the cancellation causes significant inconvenience, we may offer additional compensation in the form of service credits or discounts on future bookings.",
      icon: <FaClock />,
      category: "provider",
      highlights: ["Full refund for provider cancellations", "Option to reschedule at no additional cost", "Possible compensation for significant inconvenience"],
    },
    {
      id: 7,
      title: "Contact Us",
      content: "If you have any questions or concerns regarding this Cancellation/Refund Policy, please contact our customer support team at support@okpuja.com or call us at +91-9999999999. Our team is available Monday through Saturday from 9:00 AM to 8:00 PM IST to assist you with any refund-related queries or special circumstances that may require individual consideration.",
      icon: <FaExternalLinkAlt />,
      category: "contact",
      highlights: ["Email: support@okpuja.com", "Phone: +91-9999999999", "Hours: Mon-Sat, 9:00 AM to 8:00 PM IST"],
    },
  ];

  const filteredContent = cancellationRefundPolicyContent.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => window.print();

  const handleCopyToClipboard = () => {
    const policyText = cancellationRefundPolicyContent
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
      <div className="relative bg-gradient-to-br from-red-900 via-pink-900 to-red-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20"></div>
        </div>
        
        <div className="relative py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <FaUndo className="text-red-400 mr-2" />
                <span className="text-sm font-medium text-white">Cancellation & Refunds</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Cancellation &
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400"> Refund Policy</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Understanding our cancellation terms and refund process. 
                Clear guidelines for a hassle-free experience.
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
                  placeholder="Search policy..."
                  className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
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
                <FaBars className="mr-3 text-red-600" />
                Policy Sections
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
                    <FaBookmark className="mr-3 text-red-600" />
                    Quick Navigation
                  </h3>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {cancellationRefundPolicyContent.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center group ${
                          activeSection === item.id
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                            : "hover:bg-gray-50 text-gray-700 border border-gray-100"
                        }`}
                      >
                        <span className={`mr-3 text-sm ${activeSection === item.id ? "text-white" : "text-red-600"}`}>
                          {item.icon}
                        </span>
                        <div>
                          <div className="font-medium text-sm">
                            {item.id}. {item.title}
                          </div>
                          <div className={`text-xs mt-1 ${activeSection === item.id ? "text-red-100" : "text-gray-500"}`}>
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
                    Try adjusting your search terms to find what you're looking for.
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
                        ? "border-red-500 shadow-2xl transform scale-[1.02]"
                        : "border-gray-200 hover:border-red-300 hover:shadow-2xl"
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
                              item.category === "restrictions"
                                ? "bg-orange-100 text-orange-600"
                                : item.category === "refund"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}>
                              {item.icon}
                            </div>
                            <div>
                              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
                                <span className="text-red-600 mr-2">{item.id}.</span>
                                {item.title}
                              </h2>
                              <div className="flex items-center mt-2">
                                <span
                                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                                    item.category === "restrictions"
                                      ? "bg-orange-100 text-orange-700"
                                      : item.category === "refund"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
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
                            className="mt-3 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
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
                                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
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

              {/* Help Section */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12 bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-8 sm:p-12 text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaUndo className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Need Help with Cancellations?</h3>
                  <p className="text-red-100 mb-6 max-w-2xl mx-auto text-lg">
                    Our support team is here to help you with cancellations, refunds, 
                    and any special circumstances.
                  </p>
                  <a
                    href="mailto:support@okpuja.com"
                    className="inline-flex items-center px-6 py-3 bg-white text-red-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    Contact Support
                  </a>
                </div>
              </motion.div>

              {/* Footer */}
              <div className="mt-8 text-center text-gray-500 text-sm">
                <p>Last Updated: March 15, 2025</p>
                <p className="mt-2">
                  For policy questions, reach us at{" "}
                  <a
                    href="mailto:support@okpuja.com"
                    className="text-red-600 hover:text-red-700 font-medium transition-colors"
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
            className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl shadow-2xl hover:shadow-red-500/25 z-50 transition-all duration-300 transform hover:scale-110 print:hidden group"
            aria-label="Back to top"
          >
            <FaArrowUp className="text-lg group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default CancellationRefundPolicy;
