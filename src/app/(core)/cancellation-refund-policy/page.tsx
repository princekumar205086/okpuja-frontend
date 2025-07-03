"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaPrint,
  FaArrowUp,
  FaClipboard,
  FaCheck,
  FaInfoCircle,
  FaFileAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const CancellationRefundPolicy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Ref for policy container
  const policyContainerRef = useRef<HTMLDivElement>(null);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);

      // Determine which section is currently in view
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

  // Animation on scroll
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  interface TermContent {
    id: number;
    title: string;
    content: string;
    icon?: React.ReactNode;
    highlights?: string[];
  }

  const cancellationRefundPolicyContent: TermContent[] = [
    {
      id: 1,
      title: "Introduction",
      content:
        "This Cancellation/Refund Policy outlines the terms and conditions for canceling services and requesting refunds at OKPUJA. By using our services, you agree to the terms of this policy. We aim to provide clear guidelines to ensure a smooth experience for all our users.",
      icon: <FaFileAlt />,
      highlights: [
        "Effective as of March 1, 2025",
        "Applicable to all services offered through OKPUJA platform",
      ],
    },
    {
      id: 2,
      title: "Cancellation Policy",
      content:
        "You may cancel your booking up to 48 hours before the scheduled service time to receive a full refund. Cancellations made between 24-48 hours prior to the service will receive a 50% refund. Cancellations made within 24 hours of the service time are not eligible for a refund except in extenuating circumstances as determined by our team. To cancel a booking, please log in to your account and navigate to the 'My Bookings' section, or contact our customer support team directly.",
      icon: <FaFileAlt />,
      highlights: [
        "Full refund: Cancellations 48+ hours before service",
        "Partial refund: Cancellations 24-48 hours before service",
        "No refund: Cancellations within 24 hours of service",
      ],
    },
    {
      id: 3,
      title: "Refund Processing",
      content:
        "Refunds will be processed within 7-10 business days after the cancellation is confirmed. The refund amount will be credited to the original payment method used during booking. Please note that depending on your financial institution, it may take additional time for the refund to appear in your account. For international transactions, processing may take up to 14 business days. If you haven't received your refund after this period, please contact our support team.",
      icon: <FaFileAlt />,
      highlights: [
        "7-10 business days processing time",
        "Refund to original payment method",
        "International transactions may take longer",
      ],
    },
    {
      id: 4,
      title: "Non-Refundable Services",
      content:
        "Certain services may be non-refundable due to their nature or special promotional offers. These services will be clearly marked as non-refundable at the time of booking. Additionally, customized services that have already begun preparation may not be eligible for a full refund. In cases where a service provider has already incurred costs in preparation for your booking, a partial refund may be offered at OKPUJA's discretion.",
      icon: <FaFileAlt />,
      highlights: [
        "Non-refundable services are clearly marked",
        "Customized services may have different refund policies",
        "Partial refunds may be offered for services in preparation",
      ],
    },
    {
      id: 5,
      title: "Service Rescheduling",
      content:
        "As an alternative to cancellation, you may reschedule your service up to 24 hours before the scheduled time at no additional cost. Rescheduling requests made within 24 hours of the service may incur a rescheduling fee. Please note that rescheduling is subject to the availability of our service providers. You can reschedule through your account dashboard or by contacting our customer support team.",
      icon: <FaFileAlt />,
      highlights: [
        "Free rescheduling up to 24 hours before service",
        "Rescheduling fee may apply for last-minute changes",
        "Subject to service provider availability",
      ],
    },
    {
      id: 6,
      title: "Service Provider Cancellations",
      content:
        "In the rare event that a service provider needs to cancel or is unable to perform the service, we will notify you as soon as possible. In such cases, you will be offered a full refund or the option to reschedule at no additional cost. If the cancellation causes significant inconvenience, we may offer additional compensation in the form of service credits or discounts on future bookings.",
      icon: <FaFileAlt />,
      highlights: [
        "Full refund for provider cancellations",
        "Option to reschedule at no additional cost",
        "Possible compensation for significant inconvenience",
      ],
    },
    {
      id: 7,
      title: "Contact Us",
      content:
        "If you have any questions or concerns regarding this Cancellation/Refund Policy, please contact our customer support team at support@okpuja.com or call us at +91-9999999999. Our team is available Monday through Saturday from 9:00 AM to 8:00 PM IST to assist you with any refund-related queries or special circumstances that may require individual consideration.",
      icon: <FaFileAlt />,
      highlights: [
        "Email: support@okpuja.com",
        "Phone: +91-9999999999",
        "Hours: Mon-Sat, 9:00 AM to 8:00 PM IST",
      ],
    },
  ];

  // Filter content based on search term
  const filteredContent = cancellationRefundPolicyContent.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  // Copy to clipboard functionality
  const handleCopyToClipboard = () => {
    const policyText = cancellationRefundPolicyContent
      .map((item) => `${item.id}. ${item.title}\n${item.content}\n\n`)
      .join("");

    navigator.clipboard.writeText(policyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Scroll to section functionality
  const scrollToSection = (id: number) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
      if (isMobile) {
        setShowMobileSidebar(false); // Close mobile sidebar after selection
      }
    }
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <>
      <div className="bg-gradient-to-b from-orange-50 to-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Action bar with search and tools */}
          <div className="mb-8 bg-white rounded-xl p-4 shadow-md">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search policy..."
                  className="w-full p-3 border border-gray-300 rounded-lg pl-10 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-300 shadow-sm"
                  aria-label="Print Cancellation & Refund Policy"
                >
                  <FaPrint className="mr-2" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300 shadow-sm border border-gray-300"
                  aria-label="Copy Cancellation & Refund Policy"
                >
                  {copied ? (
                    <FaCheck className="mr-2 text-green-600" />
                  ) : (
                    <FaClipboard className="mr-2" />
                  )}
                  <span className="hidden sm:inline">
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Toggle */}
          <div className="md:hidden mb-6">
            <button
              onClick={toggleMobileSidebar}
              className="w-full flex items-center justify-between bg-orange-500 text-white px-4 py-3 rounded-lg shadow-md"
            >
              <span className="font-medium">Policy Sections</span>
              {showMobileSidebar ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <div
            className="flex flex-col md:flex-row gap-8"
            ref={policyContainerRef}
          >
            {/* ===== SIDEBAR: 3 COLUMN LAYOUT ===== */}
            <div
              className={`md:w-3/12 print:hidden ${
                isMobile
                  ? "fixed inset-0 z-50 bg-gray-800/50 backdrop-blur-sm transition-all"
                  : ""
              } ${
                showMobileSidebar
                  ? "opacity-100 visible"
                  : "opacity-0 invisible md:opacity-100 md:visible"
              }`}
            >
              <div
                className={`${
                  isMobile
                    ? "bg-white h-auto max-h-[80vh] overflow-y-auto w-4/5 max-w-xs p-4 rounded-r-2xl shadow-xl transition-transform"
                    : ""
                } ${
                  showMobileSidebar
                    ? "transform-none"
                    : "-translate-x-full md:transform-none"
                }`}
              >
                {/* Mobile close button */}
                {isMobile && (
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Policy Sections
                    </h3>
                    <button
                      onClick={toggleMobileSidebar}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}

                {/* Navigation Menu - Sidebar */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                  {!isMobile && (
                    <div className="bg-orange-500 text-white py-3 px-4 font-medium">
                      Policy Sections
                    </div>
                  )}

                  <div className="flex flex-col p-2 space-y-1">
                    {cancellationRefundPolicyContent.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`
                          px-3 py-3 rounded-lg text-left flex items-center transition-all duration-200
                          ${
                            activeSection === item.id
                              ? "bg-orange-100 text-orange-800 border-l-4 border-orange-500 pl-2"
                              : "hover:bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        <div
                          className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs font-medium ${
                            activeSection === item.id
                              ? "bg-orange-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {item.id}
                        </div>
                        <span
                          className={`${
                            activeSection === item.id ? "font-medium" : ""
                          }`}
                        >
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Additional help in sidebar */}
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg m-3 border border-orange-100">
                    <h4 className="font-medium text-orange-800 mb-2">
                      Need help?
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Our support team is available to assist you with any
                      questions.
                    </p>
                    <Link
                      href="/contactus"
                      className="text-sm text-orange-600 hover:text-orange-800 font-medium flex items-center"
                    >
                      Contact Support <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== MAIN CONTENT: 9 COLUMN LAYOUT ===== */}
            <div className="md:w-9/12">
              {/* No results message */}
              {filteredContent.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-white rounded-xl shadow-md">
                  <FaInfoCircle className="text-4xl text-gray-400 mb-3" />
                  <h3 className="text-xl font-medium text-gray-700">
                    No matches found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your search to find what you&apos;re looking for.
                  </p>
                </div>
              )}

              {/* Policy content with animations */}
              <motion.div
                ref={ref}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {filteredContent.map((item, index) => (
                  <motion.section
                    key={item.id}
                    id={`section-${item.id}`}
                    className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-orange-500"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-orange-100 text-orange-600 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                          {item.icon || (
                            <span className="font-bold">{item.id}</span>
                          )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {item.title}
                        </h2>
                      </div>

                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {item.content}
                        </p>

                        {item.highlights && (
                          <div className="bg-orange-50 p-4 rounded-lg mt-4">
                            <h3 className="text-sm font-semibold text-orange-800 uppercase tracking-wider mb-2">
                              Key Points
                            </h3>
                            <ul className="space-y-1">
                              {item.highlights.map((highlight, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-orange-500 mr-2">
                                    •
                                  </span>
                                  <span className="text-gray-700 text-sm">
                                    {highlight}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.section>
                ))}
              </motion.div>

              {/* Additional help section */}
              <div className="mt-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8 text-white">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4">
                    Need More Help?
                  </h2>
                  <p className="mb-6 opacity-90">
                    Our customer support team is available to help you with any
                    questions about cancellations or refunds.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/contactus"
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-300 shadow-md font-medium"
                    >
                      Contact Support
                    </Link>
                    <Link
                      href="/faq"
                      className="inline-flex items-center justify-center px-6 py-3 bg-orange-700 text-white border border-orange-400 rounded-lg hover:bg-orange-800 transition-all duration-300 shadow-md font-medium"
                    >
                      View FAQs
                    </Link>
                  </div>
                </div>
              </div>

              {/* Last updated information */}
              <div className="mt-8 text-center text-gray-500 text-sm">
                <p>Last Updated: March 15, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close mobile sidebar when clicking outside */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMobileSidebar(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Back to top button with animation */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 shadow-lg z-50 transition duration-300 print:hidden"
            aria-label="Back to top"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default CancellationRefundPolicy;
