"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaCommentAlt,
  FaPhone,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import Image from "next/image";

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [validationState, setValidationState] = useState({
    isEmailValid: true,
    isPhoneValid: true,
    isSubmitting: false,
    isSubmitted: false,
    hasError: false,
  });
  const [formFocus, setFormFocus] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const commonDomains = useMemo(
    () => [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
      "protonmail.com",
    ],
    []
  );

  // Email suggestions feature
  useEffect(() => {
    if (formState.email.includes("@")) {
      const [username, domain] = formState.email.split("@");
      if (domain) {
        const suggestions = commonDomains.filter((d) =>
          d.startsWith(domain.toLowerCase())
        );
        setEmailSuggestions(suggestions);
      } else {
        setEmailSuggestions(commonDomains);
      }
    } else {
      setEmailSuggestions([]);
    }
  }, [formState.email, commonDomains]);

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate phone number (basic validation)
  const validatePhone = (phone: string) => {
    if (phone.length === 0) return true; // Optional field
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });

    // Validate email and phone as user types
    if (name === "email") {
      setValidationState({
        ...validationState,
        isEmailValid: value === "" || validateEmail(value),
      });
    }

    if (name === "phone") {
      setValidationState({
        ...validationState,
        isPhoneValid: validatePhone(value),
      });
    }
  };

  // Focus handling for animation and styling
  const handleFocus = (fieldName: string) => {
    setFormFocus(fieldName);
  };

  const handleBlur = () => {
    setFormFocus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    const isEmailValid = validateEmail(formState.email);
    const isPhoneValid = validatePhone(formState.phone);

    if (!isEmailValid || !isPhoneValid) {
      setValidationState({
        ...validationState,
        isEmailValid,
        isPhoneValid,
      });
      return;
    }

    // Set submitting state
    setValidationState({
      ...validationState,
      isSubmitting: true,
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success handling
      setValidationState({
        ...validationState,
        isSubmitting: false,
        isSubmitted: true,
        hasError: false,
      });

      // Reset form after successful submission
      setTimeout(() => {
        setFormState({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        if (formRef.current) {
          formRef.current.reset();
        }
      }, 200);
    } catch (error) {
      setValidationState({
        ...validationState,
        isSubmitting: false,
        hasError: true,
      });
    }
  };

  const inputBaseClass =
    "w-full pl-10 pr-3 py-3 rounded-lg border-2 text-gray-700 bg-white/90 border-gray-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300";

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px] bg-cream">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 p-4 sm:p-8 lg:p-12 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
            Get in Touch
          </h2>
          <div className="h-1 w-20 bg-orange-500 mb-6 rounded-full"></div>
          <p className="text-gray-600 mb-6">
            We&apos;d love to hear from you. Please fill out the form below and we&apos;ll
            get back to you as soon as possible.
          </p>

          {validationState.isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg shadow-md text-center"
            >
              <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
              <p>
                Your message has been sent successfully. We&apos;ll get back to you
                soon.
              </p>
              <button
                onClick={() =>
                  setValidationState({ ...validationState, isSubmitted: false })
                }
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Full Name*
                </label>
                <div className="relative">
                  <FaUser
                    className={`absolute top-3.5 left-3 ${
                      formFocus === "name" ? "text-orange-500" : "text-gray-400"
                    } transition-colors duration-200`}
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("name")}
                    onBlur={handleBlur}
                    placeholder="Your full name"
                    className={inputBaseClass}
                    required
                    aria-label="Your Name"
                  />
                </div>
              </div>

              {/* Email Input with Suggestions */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Email Address*
                </label>
                <div className="relative">
                  <FaEnvelope
                    className={`absolute top-3.5 left-3 ${
                      formFocus === "email"
                        ? "text-orange-500"
                        : "text-gray-400"
                    } transition-colors duration-200`}
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    className={`${inputBaseClass} ${
                      !validationState.isEmailValid
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : ""
                    }`}
                    required
                    aria-label="Your Email"
                    list="email-suggestions"
                  />
                  {!validationState.isEmailValid && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationCircle className="mr-1" />
                      Please enter a valid email address
                    </p>
                  )}
                  {emailSuggestions.length > 0 && (
                    <datalist id="email-suggestions">
                      {emailSuggestions.map((domain) => (
                        <option
                          key={domain}
                          value={`${formState.email.split("@")[0]}@${domain}`}
                        />
                      ))}
                    </datalist>
                  )}
                </div>
              </div>

              {/* Phone Input (Optional) */}
              <div className="relative">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Phone Number{" "}
                  <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <div className="relative">
                  <FaPhone
                    className={`absolute top-3.5 left-3 ${
                      formFocus === "phone"
                        ? "text-orange-500"
                        : "text-gray-400"
                    } transition-colors duration-200`}
                  />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("phone")}
                    onBlur={handleBlur}
                    placeholder="+1 (123) 456-7890"
                    className={`${inputBaseClass} ${
                      !validationState.isPhoneValid
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : ""
                    }`}
                    aria-label="Your Phone"
                  />
                  {!validationState.isPhoneValid && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationCircle className="mr-1" />
                      Please enter a valid phone number
                    </p>
                  )}
                </div>
              </div>

              {/* Subject Dropdown */}
              <div className="relative">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Subject*
                </label>
                <div className="relative">
                  <select
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("subject")}
                    onBlur={handleBlur}
                    className={`${inputBaseClass} pl-4 appearance-none cursor-pointer`}
                    required
                    aria-label="Subject"
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    <option value="general">General Inquiry</option>
                    <option value="service">Service Information</option>
                    <option value="booking">Booking Request</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message Textarea */}
              <div className="relative">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Your Message*
                </label>
                <div className="relative">
                  <FaCommentAlt
                    className={`absolute top-3.5 left-3 ${
                      formFocus === "message"
                        ? "text-orange-500"
                        : "text-gray-400"
                    } transition-colors duration-200`}
                  />
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("message")}
                    onBlur={handleBlur}
                    placeholder="How can we help you?"
                    className={`${inputBaseClass} resize-none`}
                    rows={4}
                    required
                    aria-label="Your Message"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={validationState.isSubmitting}
                className={`w-full mt-2 py-3 px-6 rounded-lg text-white font-medium shadow-lg transition-all duration-300 flex items-center justify-center
                  ${
                    validationState.isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  }`}
              >
                {validationState.isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Send Message
                  </>
                )}
              </motion.button>

              {/* Form Error Message */}
              {validationState.hasError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-center">
                  <FaExclamationCircle className="mr-2 flex-shrink-0" />
                  <span>Something went wrong. Please try again later.</span>
                </div>
              )}

              {/* Privacy Notice */}
              <p className="text-xs text-gray-500 mt-4">
                By submitting this form, you agree to our{" "}
                <a
                  href="/privacy-policy"
                  className="text-orange-600 hover:underline"
                >
                  Privacy Policy
                </a>{" "}
                and consent to us contacting you regarding your inquiry.
              </p>
            </form>
          )}
        </motion.div>
      </div>

      {/* Image and Contact Info Section */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-orange-100 to-indigo-50 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="relative w-full max-w-md h-64 sm:h-80 overflow-hidden rounded-xl shadow-2xl mb-8">
          <Image
            src="/image/contform.jpeg"
            alt="Contact Us"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 w-full p-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              We&apos;re here to help!
            </h3>
            <p className="text-white/80 text-sm">
              Our team is ready to assist you with any questions.
            </p>
          </div>
        </div>

        {/* Contact Information Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-4">
            <h4 className="font-semibold text-gray-800 mb-4">Quick Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <FaEnvelope className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Email us at
                  </p>
                  <a
                    href="mailto:info@sripandit.com"
                    className="text-orange-600 hover:underline"
                  >
                    info@sripandit.com
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <FaPhone className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Call us at
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="text-orange-600 hover:underline"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours - Visible only on larger screens */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 hidden sm:block">
            <h4 className="font-semibold text-gray-800 mb-4">Business Hours</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monday - Friday:</span>
                <span className="font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturday:</span>
                <span className="font-medium">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sunday:</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactForm;
