"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  FaSearch, 
  FaPrint, 
  FaClipboard, 
  FaCheck, 
  FaChevronDown, 
  FaChevronRight, 
  FaArrowUp, 
  FaInfoCircle,
  FaFileContract,
  FaBars,
  FaTimes,
  FaUsers,
  FaCreditCard,
  FaGavel,
  FaHandshake,
  FaShieldAlt,
  FaExternalLinkAlt,
  FaExclamationTriangle,
  FaBookOpen,
  FaUserCheck,
  FaCalendarAlt,
  FaDatabase
} from "react-icons/fa";

interface FormErrors {
  email?: string;
  password?: string;
}

interface TermContent {
  id: number;
  title: string;
  content: string;
  category: string;
  summary?: string;
  icon?: React.ReactNode;
  highlights?: string[];
}

const TermsOfService = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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

      // Determine which section is currently in view
      if (termsContainerRef.current) {
        const sections = termsContainerRef.current.querySelectorAll("section");
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

  // Define term categories
  const categories = ["all", "usage", "payment", "legal"];

  // Group terms by category
  const termsContent: TermContent[] = [
    {
      id: 1,
      title: "Introduction",
      category: "usage",
      icon: <FaBookOpen />,
      summary: "Welcome to OKPUJA and acceptance of terms",
      content:
        "Welcome to OKPUJA. By using our website and services, you agree to be bound by the following terms and conditions. These Terms govern your use of our online platform for booking puja services and astrology consultations. Please read these terms carefully before using our services.",
      highlights: [
        "Effective as of March 1, 2025", 
        "Governs use of OKPUJA platform", 
        "Binding agreement upon use"
      ],
    },
    {
      id: 2,
      title: "Eligibility",
      category: "legal",
      icon: <FaUserCheck />,
      summary: "Age requirements and ability to enter agreements",
      content:
        "You must be at least 18 years old to use our services. By accessing the website, you confirm that you meet this age requirement and are fully capable of entering into binding agreements. We reserve the right to request proof of age if necessary.",
      highlights: [
        "Minimum age requirement: 18 years", 
        "Legal capacity to enter agreements", 
        "Age verification may be required"
      ],
    },
    {
      id: 3,
      title: "Services Offered",
      category: "usage",
      icon: <FaHandshake />,
      summary: "Description of services provided through platform",
      content:
        "OKPUJA offers users the ability to book various puja services, astrology consultations, and spiritual guidance sessions. All services are provided by experienced practitioners. We facilitate these services but do not perform them ourselves. The actual services will be carried out by qualified Pandits, astrologers, or spiritual experts. Service availability may vary based on location and practitioner availability.",
      highlights: [
        "Puja services and astrology consultations", 
        "Experienced spiritual practitioners", 
        "Location-based availability"
      ],
    },
    {
      id: 4,
      title: "Booking Process",
      category: "usage",
      icon: <FaCalendarAlt />,
      summary: "How to book services and related responsibilities",
      content:
        "When booking a service through our platform: You are responsible for providing accurate and up-to-date information. Upon confirmation, you will receive an email or message with details of your scheduled service. OKPUJA reserves the right to cancel or reschedule any bookings with prior notice in case of unforeseen circumstances. It is your responsibility to ensure you are available at the scheduled time.",
      highlights: [
        "Accurate information required", 
        "Email confirmation provided", 
        "User responsibility for availability"
      ],
    },
    {
      id: 5,
      title: "Payment and Fees",
      category: "payment",
      icon: <FaCreditCard />,
      summary: "Payment methods and fee structure",
      content:
        "Payment for services is required in full at the time of booking. Fees for each service are clearly displayed on the website, and once a booking is confirmed, the fee is non-refundable except under exceptional circumstances. OKPUJA accepts major payment methods, including credit/debit cards and online payment gateways. All payments are processed securely. Additional charges may apply for special requests or customized services.",
      highlights: [
        "Full payment required at booking", 
        "Secure payment processing", 
        "Additional charges for customization"
      ],
    },
    {
      id: 6,
      title: "Cancellation and Refund Policy",
      category: "payment",
      icon: <FaExclamationTriangle />,
      summary: "Policy for cancellations and refunds",
      content:
        "If you wish to cancel a booking, you must do so at least 48 hours before the scheduled time to be eligible for a refund. No refunds will be issued for cancellations made within 48 hours of the scheduled service. In the event that the service provider cancels, you will be entitled to a full refund or the option to reschedule. Processing of refunds may take up to 7 business days depending on your payment method and financial institution.",
      highlights: [
        "48-hour cancellation policy", 
        "Full refund for provider cancellations", 
        "7-day refund processing time"
      ],
    },
    {
      id: 7,
      title: "User Conduct",
      category: "usage",
      icon: <FaUsers />,
      summary: "Expected behavior when using platform",
      content:
        "You agree to use our platform responsibly and not engage in any misrepresentation of personal or booking details, posting of harmful content, attempts to disrupt website functionality, or harassment of service providers. OKPUJA reserves the right to terminate access to any user who violates these conduct guidelines. We expect all users to maintain respectful communication with service providers and staff.",
      highlights: [
        "Responsible platform usage", 
        "No harassment or harmful content", 
        "Respectful communication required"
      ],
    },
    {
      id: 8,
      title: "Disclaimer of Warranties",
      category: "legal",
      icon: <FaShieldAlt />,
      summary: "Limitations on guarantees of service effectiveness",
      content:
        "OKPUJA provides access to spiritual and religious services but makes no guarantees regarding the effectiveness of the rituals or consultations. Results may vary based on personal faith and beliefs. All services are provided as-is, without warranties of any kind. We do not guarantee that rituals will produce specific outcomes or results.",
      highlights: [
        "No guarantees on ritual effectiveness", 
        "Results vary by personal beliefs", 
        "Services provided as-is"
      ],
    },
    {
      id: 9,
      title: "Limitation of Liability",
      category: "legal",
      icon: <FaGavel />,
      summary: "Limits on company liability for damages",
      content:
        "Under no circumstances will OKPUJA be liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use the services. This includes any loss of data, profit, or personal injury resulting from engaging with the services on our platform. Our total liability shall not exceed the amount paid by you for the specific service in question.",
      highlights: [
        "Limited liability for damages", 
        "No responsibility for personal injury", 
        "Liability capped at service amount"
      ],
    },
    {
      id: 10,
      title: "Privacy Policy",
      category: "legal",
      icon: <FaDatabase />,
      summary: "How user data is collected and used",
      content:
        "Your personal information is protected in accordance with our Privacy Policy. By using our services, you consent to the collection and use of your data as outlined in that policy. We collect information necessary to provide our services and improve user experience. Your data is never sold to third parties without your explicit consent.",
      highlights: [
        "Data protected per Privacy Policy", 
        "User consent for data collection", 
        "No data sales without consent"
      ],
    },
    {
      id: 11,
      title: "Modifications to the Terms",
      category: "legal",
      icon: <FaFileContract />,
      summary: "How and when terms may change",
      content:
        "OKPUJA reserves the right to modify or update these Terms at any time. Any changes will be effective immediately upon posting on our website. Continued use of the platform constitutes acceptance of any revised Terms. For significant changes, we may provide notification via email or website announcement.",
      highlights: [
        "Terms may be updated anytime", 
        "Changes effective upon posting", 
        "Continued use implies acceptance"
      ],
    },
    {
      id: 12,
      title: "Governing Law",
      category: "legal",
      icon: <FaGavel />,
      summary: "Legal jurisdiction governing these terms",
      content:
        "These Terms are governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Delhi. You agree to submit to the personal jurisdiction of such courts for the purpose of litigating all claims or disputes.",
      highlights: [
        "Governed by laws of India", 
        "Delhi court jurisdiction", 
        "Exclusive legal jurisdiction"
      ],
    },
    {
      id: 13,
      title: "Contact Us",
      category: "usage",
      icon: <FaExternalLinkAlt />,
      summary: "How to reach customer support",
      content:
        "If you have any questions about these Terms, please contact us at support@okpuja.com. Our customer service team is available Monday through Friday, 9:00 AM to 6:00 PM IST. We aim to respond to all inquiries within 48 hours.",
      highlights: [
        "Email: support@okpuja.com", 
        "Hours: Mon-Fri, 9 AM to 6 PM IST", 
        "48-hour response time"
      ],
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
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
      if (isMobile) {
        setShowMobileSidebar(false); // Close mobile sidebar after selection
      }
    }
  };

  // Toggle section expansion
  const toggleSection = (id: number) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-900 via-orange-800 to-amber-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20"></div>
        </div>
        
        <div className="relative py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <FaFileContract className="text-orange-400 mr-2" />
                <span className="text-orange-200 text-sm font-medium">Legal Terms</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Terms of 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-300">Service</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Understanding our terms and conditions for using OKPUJA. 
                Clear guidelines for a transparent spiritual journey.
              </p>
              
              <div className="mt-8 text-sm text-gray-400">
                <span>Last Updated: March 15, 2025</span>
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
                  placeholder="Search terms..."
                  className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  aria-label="Print Terms of Service"
                >
                  <FaPrint className="mr-2 text-lg" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  aria-label="Copy Terms of Service"
                >
                  {copied ? (
                    <>
                      <FaCheck className="mr-2 text-lg text-green-600" />
                      <span className="hidden sm:inline text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <FaClipboard className="mr-2 text-lg" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeFilter === category
                      ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/25"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Mobile Sidebar Toggle */}
          <div className="md:hidden mb-6">
            <button
              onClick={toggleMobileSidebar}
              className="w-full flex items-center justify-between bg-white rounded-xl p-4 shadow-lg border border-gray-100"
            >
              <span className="font-semibold text-gray-800 flex items-center">
                <FaBars className="mr-3 text-orange-600" />
                Terms Sections
              </span>
              {showMobileSidebar ? <FaTimes className="text-gray-600" /> : <FaBars className="text-gray-600" />}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8" ref={termsContainerRef}>
            
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
                    <h3 className="text-lg font-bold text-gray-900">Navigation</h3>
                    <button
                      onClick={() => setShowMobileSidebar(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FaTimes className="text-gray-600" />
                    </button>
                  </div>
                )}

                <motion.div 
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="p-6 bg-gradient-to-r from-orange-600 to-orange-500">
                    <h3 className="text-xl font-bold text-white mb-2">Quick Navigation</h3>
                    <p className="text-orange-100 text-sm">Jump to any section</p>
                  </div>

                  <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {filteredContent.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                            activeSection === item.id
                              ? "bg-orange-50 text-orange-700 border-l-4 border-orange-500"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-orange-500 flex-shrink-0">{item.icon}</span>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{item.title}</div>
                            <div className="text-xs text-gray-500 truncate">{item.summary}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* No results message */}
              {filteredContent.length === 0 && (
                <motion.div 
                  className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl shadow-xl border border-gray-100"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <FaInfoCircle className="text-6xl text-gray-300 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No matches found</h3>
                  <p className="text-gray-500 text-lg">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </motion.div>
              )}

              {/* Terms content with animations */}
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
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => isMobile && toggleSection(item.id)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                            {item.icon}
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                              {item.id}. {item.title}
                            </h2>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              item.category === "legal"
                                ? "bg-blue-100 text-blue-800"
                                : item.category === "payment"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}>
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {isMobile && (
                          <button
                            className="text-orange-500 p-2"
                            aria-label={
                              expandedSection === item.id
                                ? "Collapse section"
                                : "Expand section"
                            }
                          >
                            {expandedSection === item.id ? (
                              <FaChevronDown className="text-xl" />
                            ) : (
                              <FaChevronRight className="text-xl" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Summary for mobile, full content always visible on desktop */}
                      {isMobile && expandedSection !== item.id ? (
                        <div className="text-gray-600 text-base line-clamp-2">
                          {item.summary}
                        </div>
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
                              <div className="text-gray-700 text-base leading-relaxed mb-6">
                                {item.content}
                              </div>

                              {/* Highlights */}
                              {item.highlights && item.highlights.length > 0 && (
                                <div className="border-t border-gray-100 pt-4">
                                  <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                    <FaInfoCircle className="text-orange-500 mr-2" />
                                    Key Points
                                  </h4>
                                  <div className="grid gap-2">
                                    {item.highlights.map((highlight, idx) => (
                                      <div key={idx} className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-gray-600">{highlight}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  </motion.section>
                ))}
              </motion.div>

              {/* Additional help section */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-8 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <FaExternalLinkAlt className="text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold">Need Help?</h3>
                  </div>
                  <p className="text-orange-100 text-lg mb-6 leading-relaxed">
                    If you have any questions about these terms or need clarification on any point, 
                    our customer support team is here to help you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="mailto:support@okpuja.com"
                      className="inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors duration-200"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      Contact Support
                    </a>
                    <button className="inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors duration-200">
                      <FaInfoCircle className="mr-2" />
                      FAQs
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Last updated information */}
              <div className="mt-8 text-center text-gray-500 text-sm">
                <p>Last Updated: March 15, 2025</p>
                <p className="mt-2">
                  If you have any questions about these terms, please contact us at{" "}
                  <a
                    href="mailto:support@okpuja.com"
                    className="text-orange-600 hover:underline font-medium"
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
            className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/25 z-50 transition-all duration-300 transform hover:scale-110 print:hidden group"
            aria-label="Back to top"
          >
            <FaArrowUp className="text-lg group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default TermsOfService;
