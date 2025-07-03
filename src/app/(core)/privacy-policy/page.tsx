"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaPrint,
  FaArrowUp,
  FaClipboard,
  FaCheck,
  FaInfoCircle,
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaLock,
  FaUserShield,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const PrivacyPolicy = () => {
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

  interface PrivacyContent {
    id: number;
    title: string;
    content: string;
    icon: React.ReactNode;
    highlights?: string[];
  }

  const privacyPolicyContent: PrivacyContent[] = [
    {
      id: 1,
      title: "Introduction",
      icon: <FaUserShield />,
      content:
        "At OKPUJA, we value your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect, why we collect it, how we use it, and the measures we take to ensure it is handled safely and responsibly. By using our website and services, you agree to the collection and use of your data in accordance with this policy.",
      highlights: [
        "Effective as of March 1, 2025",
        "Applies to all services offered through OKPUJA",
      ],
    },
    {
      id: 2,
      title: "Information We Collect",
      icon: <FaInfoCircle />,
      content:
        "We collect two types of information: personal information and non-personal information.\n\n1. **Personal Information**: This includes data you provide when you register on our platform, book a service, or communicate with us. It may include your name, email address, phone number, billing address, and payment details.\n\n2. **Non-Personal Information**: We also collect information automatically through cookies and similar technologies. This includes details such as your IP address, browser type, operating system, device information, and browsing behavior on our site.",
      highlights: [
        "Personal data: name, email, phone, address",
        "Non-personal data: IP address, browser info, cookies",
      ],
    },
    {
      id: 3,
      title: "How We Use Your Information",
      icon: <FaInfoCircle />,
      content:
        "We use the information collected to provide and enhance our services in several ways:\n\n1. **Service Delivery**: Your personal information is essential for processing bookings, managing accounts, sending service confirmations, and communicating with you about your service requests.\n\n2. **Improving User Experience**: We use non-personal data to analyze trends, improve website functionality, and ensure an optimal user experience.\n\n3. **Marketing and Communication**: With your consent, we may use your contact details to inform you about special offers, new services, or updates. You can opt-out of receiving these communications at any time.",
      highlights: [
        "Processing bookings and service requests",
        "Improving website functionality",
        "Marketing communications (opt-out available)",
      ],
    },
    {
      id: 4,
      title: "Data Sharing and Disclosure",
      icon: <FaShieldAlt />,
      content:
        "We treat your personal information with the utmost confidentiality and will not share, sell, or rent your data to third parties for their marketing purposes. However, we may share your information in the following instances:\n\n1. **Service Providers**: We may share data with trusted third parties who assist us in operating our platform and delivering services (e.g., payment processors, hosting services, or customer support). These parties are required to protect your information and only use it to fulfill their services to OKPUJA.\n\n2. **Legal Obligations**: We may disclose your information if required by law or if we believe such action is necessary to comply with legal processes or protect our rights and safety, or that of our users.",
      highlights: [
        "No selling or renting of data to third parties",
        "Limited sharing with trusted service providers",
        "Disclosure when legally required",
      ],
    },
    {
      id: 5,
      title: "Data Security",
      icon: <FaLock />,
      content:
        "We implement a range of security measures to safeguard your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include secure servers, encryption of sensitive data (such as payment information), and regular security audits. However, no method of internet transmission or electronic storage is completely secure, and while we strive to protect your personal data, we cannot guarantee its absolute security.",
      highlights: [
        "Secure servers and encryption technologies",
        "Regular security audits",
        "Continuous monitoring for vulnerabilities",
      ],
    },
    {
      id: 6,
      title: "Cookies and Tracking Technologies",
      icon: <FaInfoCircle />,
      content:
        "Our website uses cookies and similar tracking technologies to enhance your browsing experience. Cookies help us understand user behavior, personalize content, and analyze web traffic. You can modify your browser settings to reject cookies, but this may limit some functionalities of our site. We also use tracking technologies to collect aggregate data about site usage, such as popular pages and duration of visits, to continuously improve our services.",
      highlights: [
        "Cookies used for personalization and analysis",
        "User option to modify cookie settings",
        "Aggregate data collection for site improvement",
      ],
    },
    {
      id: 7,
      title: "Your Rights",
      icon: <FaUserShield />,
      content:
        "You have rights concerning your personal information, including the right to access, correct, or delete your data. Additionally, you can withdraw consent for data processing where applicable or restrict certain uses of your data (such as opting out of marketing communications). To exercise any of these rights, please contact us at support@okpuja.com. We will respond to your request within a reasonable timeframe and in accordance with applicable laws.",
      highlights: [
        "Right to access, correct, delete your data",
        "Option to withdraw consent anytime",
        "Prompt response to privacy requests",
      ],
    },
    {
      id: 8,
      title: "Third-Party Links",
      icon: <FaInfoCircle />,
      content:
        "Our platform may contain links to third-party websites, which operate independently of our privacy practices. These websites are governed by their own privacy policies, and we are not responsible for how they handle your data. We encourage you to review the privacy policies of any third-party sites you visit before providing any personal information.",
      highlights: [
        "Links to external websites not covered by our policy",
        "Independent privacy practices of third parties",
        "Recommendation to review third-party policies",
      ],
    },
    {
      id: 9,
      title: "Children's Privacy",
      icon: <FaShieldAlt />,
      content:
        "Our services are not intended for use by individuals under the age of 18. We do not knowingly collect or solicit personal information from children. If we become aware that we have collected personal data from a child without parental consent, we will take immediate steps to delete such information.",
      highlights: [
        "Services intended for users 18+",
        "No intentional collection of children's data",
        "Prompt deletion of any inadvertently collected data",
      ],
    },
    {
      id: 10,
      title: "Changes to This Policy",
      icon: <FaInfoCircle />,
      content:
        "We may update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. Any modifications will be posted on this page, and the 'Effective Date' will be updated accordingly. We encourage you to periodically review this page to stay informed about how we protect your data. Continued use of our services after any changes constitutes your acceptance of the revised policy.",
      highlights: [
        "Policy updates reflect changing practices",
        "Notification of changes on this page",
        "Continued use signifies acceptance",
      ],
    },
    {
      id: 11,
      title: "Contact Us",
      icon: <FaInfoCircle />,
      content:
        "If you have any questions, concerns, or requests regarding this Privacy Policy or the way your personal data is handled, please contact us at support@okpuja.com. We are committed to resolving any issues promptly and efficiently.",
      highlights: [
        "Email: support@okpuja.com",
        "Phone: +91-9999999999",
        "Hours: Mon-Sat, 9:00 AM to 8:00 PM IST",
      ],
    },
  ];

  // Filter content based on search term
  const filteredContent = privacyPolicyContent.filter(
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
    const policyText = privacyPolicyContent
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
                  placeholder="Search privacy policy..."
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
                  aria-label="Print Privacy Policy"
                >
                  <FaPrint className="mr-2" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300 shadow-sm border border-gray-300"
                  aria-label="Copy Privacy Policy"
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
              <span className="font-medium">Privacy Policy Sections</span>
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
                      Privacy Policy Sections
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
                      Privacy Policy Sections
                    </div>
                  )}

                  <div className="flex flex-col p-2 space-y-1">
                    {privacyPolicyContent.map((item) => (
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
                          className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center text-xs ${
                            activeSection === item.id
                              ? "bg-orange-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <span
                          className={`${
                            activeSection === item.id ? "font-medium" : ""
                          } line-clamp-1`}
                        >
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Data protection badge in sidebar */}
                  <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg m-3 border border-blue-100">
                    <div className="flex items-center mb-2">
                      <FaShieldAlt className="text-blue-600 mr-2" />
                      <h4 className="font-medium text-blue-800">
                        Data Protection
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Your data is important to us. We implement security
                      measures to protect your information.
                    </p>
                    <Link
                      href="/contactus"
                      className="text-sm text-blue-700 hover:text-blue-900 font-medium flex items-center"
                    >
                      Data Request <span className="ml-1">→</span>
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

              {/* Privacy policy content with animations */}
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
                          {item.icon}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {`${item.id}. ${item.title}`}
                        </h2>
                      </div>

                      <div className="prose max-w-none">
                        <div className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                          {item.content.split("\n\n").map((paragraph, i) => (
                            <p key={i} className="mb-4">
                              {paragraph.replace(
                                /\*\*(.*?)\*\*/g,
                                "<strong>$1</strong>"
                              )}
                            </p>
                          ))}
                        </div>

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
              <div className="mt-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8 text-white">
                  <div className="flex items-center mb-4">
                    <FaShieldAlt className="text-3xl text-blue-200 mr-4" />
                    <h2 className="text-xl sm:text-2xl font-bold">
                      Privacy Matters to Us
                    </h2>
                  </div>
                  <p className="mb-6 opacity-90">
                    If you have any questions about your data or our privacy
                    practices, our dedicated privacy team is here to help.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/contactus"
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-md font-medium"
                    >
                      Contact Privacy Team
                    </Link>
                    <Link
                      href="/faq"
                      className="inline-flex items-center justify-center px-6 py-3 bg-blue-800 text-white border border-blue-500 rounded-lg hover:bg-blue-900 transition-all duration-300 shadow-md font-medium"
                    >
                      View Privacy FAQs
                    </Link>
                  </div>
                </div>
              </div>

              {/* Last updated information */}
              <div className="mt-8 text-center text-gray-500 text-sm">
                <p>Last Updated: March 15, 2025</p>
                <p className="mt-1">
                  OKPUJA is committed to complying with applicable data
                  protection laws.
                </p>
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

export default PrivacyPolicy;
