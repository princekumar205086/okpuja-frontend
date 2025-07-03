"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaBriefcase,
  FaUsers,
  FaChartLine,
  FaClipboardCheck,
  FaCheckCircle,
  FaSpinner,
  FaArrowRight,
  FaCalendar,
  FaPhone,
  FaEnvelope,
  FaFile,
  FaMapMarkerAlt,
  FaFilter,
  FaUser,
} from "react-icons/fa";
import { BsCheckCircleFill, BsChevronDown } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface JobOpening {
  id: number;
  title: string;
  description: string;
  deadline: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  department: string;
  requirements: string[];
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  resume: File | null;
  coverLetter: string;
  selectedJob: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  resume?: string;
  coverLetter?: string;
  selectedJob?: string;
}

export default function Career() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: "",
    selectedJob: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeJobId, setActiveJobId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [scrolled, setScrolled] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Handle scroll for sticky nav
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const jobOpenings: JobOpening[] = [
    {
      id: 1,
      title: "Puja Coordinator",
      description:
        "Oversee and coordinate various puja ceremonies and rituals, ensuring they are conducted according to traditional practices. Work directly with pandits and clients to deliver exceptional spiritual experiences.",
      deadline: "2023-08-31",
      location: "Mumbai, India",
      type: "Full-time",
      department: "Operations",
      requirements: [
        "Minimum 2 years experience in event management or coordination",
        "Deep understanding of Hindu rituals and ceremonies",
        "Excellent communication and customer service skills",
        "Ability to work flexible hours including weekends and holidays",
        "Fluent in Hindi and English (additional Indian languages a plus)",
      ],
    },
    {
      id: 2,
      title: "Customer Support Specialist",
      description:
        "Provide exceptional support to clients booking puja services. Handle inquiries, resolve issues, and ensure customer satisfaction throughout the booking process and service delivery.",
      deadline: "2023-09-15",
      location: "Remote (India-based)",
      type: "Full-time",
      department: "Customer Experience",
      requirements: [
        "Minimum 1 year in customer support or service role",
        "Knowledge of Hindu traditions and rituals preferred",
        "Strong problem-solving abilities and patience",
        "Excellent verbal and written communication skills",
        "Experience with CRM systems",
      ],
    },
    {
      id: 3,
      title: "Digital Marketing Expert",
      description:
        "Lead our digital marketing efforts to reach more devotees and increase awareness of our puja services. Develop and implement marketing strategies across social media, email, and other digital channels.",
      deadline: "2023-09-30",
      location: "Delhi, India (Hybrid)",
      type: "Full-time",
      department: "Marketing",
      requirements: [
        "3+ years experience in digital marketing",
        "Proven track record in growing online audience and conversions",
        "Experience with social media marketing, SEO, and content creation",
        "Knowledge of analytics and reporting tools",
        "Understanding of Indian cultural and religious context",
      ],
    },
    {
      id: 4,
      title: "Pandit Relations Manager",
      description:
        "Build and maintain relationships with our network of pandits and priests. Ensure quality service delivery, handle scheduling, and facilitate training on using our platform.",
      deadline: "2023-10-15",
      location: "Varanasi, India",
      type: "Full-time",
      department: "Vendor Management",
      requirements: [
        "Strong understanding of Hindu religious practices and customs",
        "Excellent relationship management skills",
        "Ability to communicate effectively with religious practitioners",
        "3+ years in vendor management or similar role",
        "Organized and detail-oriented with ability to multitask",
      ],
    },
    {
      id: 5,
      title: "Part-Time Content Creator",
      description:
        "Create engaging content about Hindu rituals, traditions, and ceremonies for our blog, social media, and educational materials. Help explain the significance and process of various pujas to our audience.",
      deadline: "2023-09-20",
      location: "Remote",
      type: "Part-time",
      department: "Content",
      requirements: [
        "Strong knowledge of Hindu traditions and scriptures",
        "Excellent writing skills in English (additional Indian languages a plus)",
        "Experience in content creation, blogging, or journalism",
        "Ability to explain complex religious concepts in accessible language",
        "Background in religious studies or theology preferred",
      ],
    },
    {
      id: 6,
      title: "Technology Lead",
      description:
        "Lead the development and maintenance of our puja booking platform. Enhance user experience, implement new features, and ensure platform stability and security.",
      deadline: "2023-10-30",
      location: "Bangalore, India",
      type: "Full-time",
      department: "Technology",
      requirements: [
        "5+ years of software development experience",
        "Strong knowledge of web technologies and frameworks",
        "Experience with e-commerce or booking platforms",
        "Team leadership skills",
        "Understanding of scalable architecture and security best practices",
      ],
    },
  ];

  const filteredJobs =
    filter === "All"
      ? jobOpenings
      : jobOpenings.filter(
          (job) => job.type === filter || job.department === filter
        );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors({
          ...errors,
          resume: "Please upload a PDF, DOC, or DOCX file.",
        });
      } else if (file.size > maxSize) {
        setErrors({
          ...errors,
          resume: "File size should be less than 5MB.",
        });
      } else {
        setFormData({ ...formData, resume: file });
        setErrors({ ...errors, resume: "" });
      }
    }
  };

  const validateField = (name: string, value: string | File | null) => {
    let error = "";
    switch (name) {
      case "name":
        error = !value ? "Name is required" : "";
        break;
      case "email":
        error = !/\S+@\S+\.\S+/.test(value as string)
          ? "Invalid email address"
          : "";
        break;
      case "phone":
        error = !/^\d{10}$/.test(value as string)
          ? "Please enter a valid 10-digit phone number"
          : "";
        break;
      case "coverLetter":
        error = !value ? "Cover letter is required" : "";
        break;
      case "selectedJob":
        error = !value ? "Please select a job" : "";
        break;
      case "resume":
        error = !value ? "Resume is required" : "";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error;
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    let isValid = true;

    // Validate each field
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key as keyof Errors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        resume: null,
        coverLetter: "",
        selectedJob: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 2000);
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Adjust for sticky header
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const applyForJob = (jobId: number) => {
    setActiveJobId(jobId);
    const selectedJob =
      jobOpenings.find((job) => job.id === jobId)?.title || "";
    setFormData({ ...formData, selectedJob });
    scrollTo("application-form");
  };

  const toggleJobDetails = (jobId: number) => {
    setActiveJobId(activeJobId === jobId ? null : jobId);
  };

  const filters = [
    "All",
    "Full-time",
    "Part-time",
    "Contract",
    "Operations",
    "Marketing",
    "Technology",
    "Customer Experience",
    "Content",
    "Vendor Management",
  ];

  return (
    <>

      <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen font-sans">
        {/* Sticky Navigation */}
        <nav
          className={`sticky top-0 z-30 bg-white shadow-md transition-all duration-300 ${
            scrolled ? "py-2" : "py-4"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <h2
                className={`font-bold transition-all duration-300 ${
                  scrolled ? "text-lg" : "text-xl"
                } text-orange-600`}
              >
                Career Opportunities
              </h2>

              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => scrollTo("job-openings")}
                  className="text-gray-700 hover:text-orange-600 transition font-medium"
                >
                  Job Openings
                </button>
                <button
                  onClick={() => scrollTo("why-join-us")}
                  className="text-gray-700 hover:text-orange-600 transition font-medium"
                >
                  Why Join Us
                </button>
                <button
                  onClick={() => scrollTo("application-form")}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition shadow-sm"
                >
                  Apply Now
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden">
                <select
                  onChange={(e) => scrollTo(e.target.value)}
                  className="bg-orange-100 border border-orange-200 rounded-md px-2 py-1 text-orange-800"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Navigate to
                  </option>
                  <option value="job-openings">Job Openings</option>
                  <option value="why-join-us">Why Join Us</option>
                  <option value="application-form">Apply Now</option>
                </select>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          {/* Job Search Header */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl overflow-hidden shadow-lg">
              <div className="md:flex items-center">
                <div className="md:w-1/2 p-6 md:p-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Find Your Purpose With Us
                  </h1>
                  <p className="text-orange-100 text-lg mb-6">
                    Join our team to make a meaningful impact in connecting
                    people with spiritual traditions.
                  </p>
                  <button
                    onClick={() => scrollTo("application-form")}
                    className="bg-white text-orange-600 py-3 px-6 rounded-lg font-semibold hover:bg-orange-50 transition shadow-md flex items-center"
                  >
                    Apply Today <FaArrowRight className="ml-2" />
                  </button>
                </div>
                <div className="md:w-1/2">
                  <Image
                    width={600}
                    height={400}
                    src="/image/career-team.jpg"
                    alt="Our team"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </section>

          <section id="job-openings" className="mb-16 scroll-mt-24">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Current Job Openings
              </h2>

              {/* Mobile Filter dropdown */}
              <div className="md:hidden relative">
                <button
                  className="flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-lg"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <FaFilter />
                  Filter
                  <BsChevronDown
                    className={`transition-transform ${
                      filterOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {filterOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg p-2 z-20 w-56">
                    {filters.map((filterOption) => (
                      <button
                        key={filterOption}
                        onClick={() => {
                          setFilter(filterOption);
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md ${
                          filter === filterOption
                            ? "bg-orange-100 text-orange-800"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {filterOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop filters */}
            <div className="hidden md:flex space-x-2 mb-6 overflow-x-auto pb-2">
              {filters.map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-md whitespace-nowrap transition ${
                    filter === filterOption
                      ? "bg-orange-500 text-white"
                      : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FaFilter className="text-4xl text-gray-400 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No matching positions
                </h3>
                <p className="text-gray-600 mb-4">
                  We couldn&apos;t find any jobs matching your filter criteria.
                  Please try a different filter.
                </p>
                <button
                  onClick={() => setFilter("All")}
                  className="bg-orange-100 text-orange-800 px-4 py-2 rounded-md hover:bg-orange-200 transition"
                >
                  Show All Positions
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
                            <span className="flex items-center">
                              <FaMapMarkerAlt className="mr-1 text-orange-500" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <FaBriefcase className="mr-1 text-orange-500" />
                              {job.type}
                            </span>
                            <span className="flex items-center">
                              <FaCalendar className="mr-1 text-orange-500" />
                              Deadline:{" "}
                              {new Date(job.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
                            {job.department}
                          </span>

                          {new Date(job.deadline) > new Date() &&
                            new Date(job.deadline).getTime() -
                              new Date().getTime() <
                              7 * 24 * 60 * 60 * 1000 && (
                              <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full">
                                Closing Soon
                              </span>
                            )}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6">{job.description}</p>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <button
                          onClick={() => toggleJobDetails(job.id)}
                          className="text-orange-600 hover:text-orange-800 font-medium"
                        >
                          {activeJobId === job.id
                            ? "Hide Details"
                            : "View Details"}
                        </button>

                        <button
                          onClick={() => applyForJob(job.id)}
                          className="bg-orange-600 text-white py-2 px-6 rounded-md hover:bg-orange-700 transition shadow-sm flex items-center"
                        >
                          Apply Now <FaArrowRight className="ml-2" />
                        </button>
                      </div>

                      <AnimatePresence>
                        {activeJobId === job.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-gray-200 mt-6 pt-6">
                              <h4 className="font-semibold text-lg text-gray-700 mb-3">
                                Requirements:
                              </h4>
                              <ul className="space-y-2">
                                {job.requirements.map((req, index) => (
                                  <li key={index} className="flex items-start">
                                    <BsCheckCircleFill className="text-orange-500 mt-1 mr-2 flex-shrink-0" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <section id="why-join-us" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              Why Join Our Team
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg border-t-4 border-orange-500">
                <div className="bg-orange-100 text-orange-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <FaBriefcase className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Meaningful Work
                </h3>
                <p className="text-gray-600">
                  Connect people with their spiritual traditions and make a
                  positive impact on their lives
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg border-t-4 border-orange-500">
                <div className="bg-orange-100 text-orange-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <FaUsers className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Inclusive Culture
                </h3>
                <p className="text-gray-600">
                  Join a diverse and supportive team that respects all cultural
                  and spiritual backgrounds
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg border-t-4 border-orange-500">
                <div className="bg-orange-100 text-orange-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <FaChartLine className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Growth Opportunities
                </h3>
                <p className="text-gray-600">
                  Continuous learning and career advancement in a rapidly
                  growing spiritual-tech company
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg border-t-4 border-orange-500">
                <div className="bg-orange-100 text-orange-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <FaClipboardCheck className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Work-Life Balance
                </h3>
                <p className="text-gray-600">
                  Flexible schedules, generous time off, and respect for your
                  personal and spiritual needs
                </p>
              </div>
            </div>

            {/* Additional benefits section */}
            <div className="mt-10 bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                Our Benefits
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FaCheckCircle className="text-green-600" />
                      </div>
                      <span className="text-gray-700">
                        Competitive salary packages
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FaCheckCircle className="text-green-600" />
                      </div>
                      <span className="text-gray-700">
                        Health and wellness programs
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FaCheckCircle className="text-green-600" />
                      </div>
                      <span className="text-gray-700">
                        Flexible working arrangements
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FaCheckCircle className="text-green-600" />
                      </div>
                      <span className="text-gray-700">
                        Professional development opportunities
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FaCheckCircle className="text-green-600" />
                      </div>
                      <span className="text-gray-700">Performance bonuses</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FaCheckCircle className="text-green-600" />
                      </div>
                      <span className="text-gray-700">
                        Team retreats and events
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FaCheckCircle className="text-green-600" />
                      </div>
                      <span className="text-gray-700">
                        Paid time off for festivals and holidays
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FaCheckCircle className="text-green-600" />
                      </div>
                      <span className="text-gray-700">
                        Remote work opportunities
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="application-form" className="scroll-mt-24" ref={formRef}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-6 px-8">
                <h2 className="text-2xl font-bold text-white">
                  Application Form
                </h2>
                <p className="text-orange-100">
                  Complete the form below to apply for your desired position
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-8">
                  <div className="text-center py-8">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="text-green-600 text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Application Submitted Successfully!
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Thank you for your interest in joining our team. We will
                      review your application and get back to you soon.
                    </p>
                    <button
                      onClick={() => scrollTo("job-openings")}
                      className="mt-6 bg-orange-600 text-white py-2 px-6 rounded-md hover:bg-orange-700 transition shadow-sm"
                    >
                      View More Openings
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="name"
                      >
                        Full Name*
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full border rounded-md px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-800 ${
                            errors.name
                              ? "border-red-500 focus:ring"
                              : "border-gray-200"
                          }`}
                        />
                        <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="email"
                      >
                        Email Address*
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full border rounded-md px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-800 ${
                            errors.email
                              ? "border-red-500 focus:ring"
                              : "border-gray-200"
                          }`}
                        />
                        <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="phone"
                      >
                        Phone Number*
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full border rounded-md px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-800 ${
                            errors.phone
                              ? "border-red-500 focus:ring"
                              : "border-gray-200"
                          }`}
                        />
                        <FaPhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="resume"
                      >
                        Upload Resume*
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          onChange={handleFileChange}
                          className={`w-full border rounded-md px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-800 ${
                            errors.resume
                              ? "border-red-500 focus:ring"
                              : "border-gray-200"
                          }`}
                        />
                        <FaFile className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                      </div>
                      {errors.resume && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.resume}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="coverLetter"
                    >
                      Cover Letter*
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-800 ${
                        errors.coverLetter
                          ? "border-red-500 focus:ring"
                          : "border-gray-200"
                      }`}
                      rows={4}
                    />
                    {errors.coverLetter && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.coverLetter}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="selectedJob"
                    >
                      Select Job*
                    </label>
                    <select
                      id="selectedJob"
                      name="selectedJob"
                      value={formData.selectedJob}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-800 ${
                        errors.selectedJob
                          ? "border-red-500 focus:ring"
                          : "border-gray-200"
                      }`}
                    >
                      <option value="">Select a job</option>
                      {jobOpenings.map((job) => (
                        <option key={job.id} value={job.title}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                    {errors.selectedJob && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.selectedJob}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" />
                        Submitting...
                      </div>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </form>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
