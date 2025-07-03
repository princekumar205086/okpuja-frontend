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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const TermsOfService = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Ref for scroll position
  const termsContainerRef = useRef<HTMLDivElement>(null);

  // Animation on scroll
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Define term categories
  const categories = ["all", "usage", "payment", "legal"];

  // Group terms by category
  interface TermContent {
    id: number;
    title: string;
    content: string;
    category: string;
    summary?: string;
  }

  const termsContent: TermContent[] = [
    {
      id: 1,
      title: "Introduction",
      category: "usage",
      summary: "Welcome to OKPUJA and acceptance of terms",
      content:
        "Welcome to OKPUJA. By using our website and services, you agree to be bound by the following terms and conditions. These Terms govern your use of our online platform for booking puja services and astrology consultations. Please read these terms carefully before using our services.",
    },
    {
      id: 2,
      title: "Eligibility",
      category: "legal",
      summary: "Age requirements and ability to enter agreements",
      content:
        "You must be at least 18 years old to use our services. By accessing the website, you confirm that you meet this age requirement and are fully capable of entering into binding agreements. We reserve the right to request proof of age if necessary.",
    },
    {
      id: 3,
      title: "Services Offered",
      category: "usage",
      summary: "Description of services provided through platform",
      content:
        "OKPUJA offers users the ability to book various puja services, astrology consultations, and spiritual guidance sessions. All services are provided by experienced practitioners. We facilitate these services but do not perform them ourselves. The actual services will be carried out by qualified Pandits, astrologers, or spiritual experts. Service availability may vary based on location and practitioner availability.",
    },
    {
      id: 4,
      title: "Booking Process",
      category: "usage",
      summary: "How to book services and related responsibilities",
      content:
        "When booking a service through our platform: You are responsible for providing accurate and up-to-date information. Upon confirmation, you will receive an email or message with details of your scheduled service. OKPUJA reserves the right to cancel or reschedule any bookings with prior notice in case of unforeseen circumstances. It is your responsibility to ensure you are available at the scheduled time.",
    },
    {
      id: 5,
      title: "Payment and Fees",
      category: "payment",
      summary: "Payment methods and fee structure",
      content:
        "Payment for services is required in full at the time of booking. Fees for each service are clearly displayed on the website, and once a booking is confirmed, the fee is non-refundable except under exceptional circumstances. OKPUJA accepts major payment methods, including credit/debit cards and online payment gateways. All payments are processed securely. Additional charges may apply for special requests or customized services.",
    },
    {
      id: 6,
      title: "Cancellation and Refund Policy",
      category: "payment",
      summary: "Policy for cancellations and refunds",
      content:
        "If you wish to cancel a booking, you must do so at least 48 hours before the scheduled time to be eligible for a refund. No refunds will be issued for cancellations made within 48 hours of the scheduled service. In the event that the service provider cancels, you will be entitled to a full refund or the option to reschedule. Processing of refunds may take up to 7 business days depending on your payment method and financial institution.",
    },
    {
      id: 7,
      title: "User Conduct",
      category: "usage",
      summary: "Expected behavior when using platform",
      content:
        "You agree to use our platform responsibly and not engage in any misrepresentation of personal or booking details, posting of harmful content, attempts to disrupt website functionality, or harassment of service providers. OKPUJA reserves the right to terminate access to any user who violates these conduct guidelines. We expect all users to maintain respectful communication with service providers and staff.",
    },
    {
      id: 8,
      title: "Disclaimer of Warranties",
      category: "legal",
      summary: "Limitations on guarantees of service effectiveness",
      content:
        "OKPUJA provides access to spiritual and religious services but makes no guarantees regarding the effectiveness of the rituals or consultations. Results may vary based on personal faith and beliefs. All services are provided as-is, without warranties of any kind. We do not guarantee that rituals will produce specific outcomes or results.",
    },
    {
      id: 9,
      title: "Limitation of Liability",
      category: "legal",
      summary: "Limits on company liability for damages",
      content:
        "Under no circumstances will OKPUJA be liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use the services. This includes any loss of data, profit, or personal injury resulting from engaging with the services on our platform. Our total liability shall not exceed the amount paid by you for the specific service in question.",
    },
    {
      id: 10,
      title: "Privacy Policy",
      category: "legal",
      summary: "How user data is collected and used",
      content:
        "Your personal information is protected in accordance with our Privacy Policy. By using our services, you consent to the collection and use of your data as outlined in that policy. We collect information necessary to provide our services and improve user experience. Your data is never sold to third parties without your explicit consent.",
    },
    {
      id: 11,
      title: "Modifications to the Terms",
      category: "legal",
      summary: "How and when terms may change",
      content:
        "OKPUJA reserves the right to modify or update these Terms at any time. Any changes will be effective immediately upon posting on our website. Continued use of the platform constitutes acceptance of any revised Terms. For significant changes, we may provide notification via email or website announcement.",
    },
    {
      id: 12,
      title: "Governing Law",
      category: "legal",
      summary: "Legal jurisdiction governing these terms",
      content:
        "These Terms are governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Delhi. You agree to submit to the personal jurisdiction of such courts for the purpose of litigating all claims or disputes.",
    },
    {
      id: 13,
      title: "Contact Us",
      category: "usage",
      summary: "How to reach customer support",
      content:
        "If you have any questions about these Terms, please contact us at support@okpuja.com. Our customer service team is available Monday through Friday, 9:00 AM to 6:00 PM IST. We aim to respond to all inquiries within 48 hours.",
    },
  ];

  // Filter content based on search term and category
  const filteredContent = termsContent.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeFilter === "all" || item.category === activeFilter;

    return matchesSearch && matchesCategory;
  });

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  // Copy to clipboard functionality
  const handleCopyToClipboard = () => {
    const termsText = termsContent
      .map((item) => `${item.id}. ${item.title}\n${item.content}\n\n`)
      .join("");
    navigator.clipboard.writeText(termsText).then(() => {
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
    setExpandedSection(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Toggle section expansion
  const toggleSection = (id: number) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <>
      <div className="bg-gradient-to-b from-orange-50 to-white py-8 sm:py-12">
        <div
          ref={termsContainerRef}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Action bar with search and tools */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <input
                type="text"
                placeholder="Search terms..."
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" />
            </div>

            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-300 shadow-sm"
                aria-label="Print Terms of Service"
              >
                <FaPrint className="mr-2" /> Print
              </button>

              <button
                onClick={handleCopyToClipboard}
                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300 shadow-sm border border-gray-300"
                aria-label="Copy Terms of Service"
              >
                {copied ? (
                  <FaCheck className="mr-2 text-green-600" />
                ) : (
                  <FaClipboard className="mr-2" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Categories filter - horizontal scrolling on mobile */}
          <div className="mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 pb-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeFilter === category
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Quick navigation - collapsed on mobile */}
          <div className="mb-8 bg-white rounded-xl shadow-md p-4 print:hidden">
            <details className="sm:hidden">
              <summary className="font-medium text-orange-600 cursor-pointer flex items-center justify-between">
                Quick Navigation <FaChevronDown className="text-xs" />
              </summary>
              <div className="mt-3 ml-4 space-y-1">
                {termsContent.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left py-1 px-2 text-sm hover:bg-orange-50 rounded transition-colors"
                  >
                    {`${item.id}. ${item.title}`}
                  </button>
                ))}
              </div>
            </details>

            <nav className="hidden sm:block">
              <h3 className="text-lg font-semibold text-orange-700 mb-3">
                Quick Navigation
              </h3>
              <ul className="flex flex-wrap gap-2">
                {termsContent.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-orange-100 transition duration-200 border border-gray-200"
                    >
                      {`${item.id}. ${item.title}`}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* No results message */}
          {filteredContent.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <FaInfoCircle className="text-4xl text-gray-400 mb-3" />
              <h3 className="text-xl font-medium text-gray-700">
                No matches found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filter to find what you&apos;re looking
                for.
              </p>
            </div>
          )}

          {/* Terms content - with responsive design */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {filteredContent.map((item) => (
              <motion.section
                key={item.id}
                id={`section-${item.id}`}
                className={`p-5 bg-white rounded-xl shadow-md border-l-4 ${
                  expandedSection === item.id
                    ? "border-orange-600"
                    : "border-gray-200"
                } transition-all duration-300`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: item.id * 0.05 }}
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => isMobile && toggleSection(item.id)}
                >
                  <h2 className="text-xl font-semibold text-gray-800">
                    <span className="text-orange-600 mr-2">{item.id}.</span>
                    {item.title}
                  </h2>

                  {isMobile && (
                    <button
                      className="text-orange-500"
                      aria-label={
                        expandedSection === item.id
                          ? "Collapse section"
                          : "Expand section"
                      }
                    >
                      {expandedSection === item.id ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </button>
                  )}
                </div>

                {/* Tag showing category */}
                <div className="flex items-center mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.category === "legal"
                        ? "bg-blue-100 text-blue-800"
                        : item.category === "payment"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Summary for mobile, full content always visible on desktop */}
                {isMobile && expandedSection !== item.id ? (
                  <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                    {item.summary || item.content.substring(0, 100) + "..."}
                  </p>
                ) : (
                  <AnimatePresence>
                    {(!isMobile || expandedSection === item.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-700 mt-4 leading-relaxed">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.section>
            ))}
          </motion.div>

          {/* Last updated information */}
          <div className="mt-10 text-center text-gray-500 text-sm">
            <p>Last Updated: March 15, 2025</p>
            <p className="mt-2">
              If you have any questions about these terms, please contact us at{" "}
              <a
                href="mailto:support@okpuja.com"
                className="text-orange-600 hover:underline"
              >
                support@okpuja.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Back to top button */}
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

export default TermsOfService;
