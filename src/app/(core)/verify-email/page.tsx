"use client";
import React, { useState, useEffect } from "react";
import {
  FiHelpCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiMail,
  FiClock,
  FiX,
} from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState<
    "verified" | "expired" | "loading"
  >("loading");
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Fetch token from the URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setVerificationStatus("expired");
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  // Handle email verification logic
  const verifyEmail = async (token: string) => {
    try {
      const data = JSON.stringify({ token });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/api/verify-email",
        headers: { "Content-Type": "application/json" },
        data,
      };

      setVerificationStatus("loading");

      const response = await axios(config);
      if (response.data.success) {
        setVerificationStatus("verified");
      } else {
        setVerificationStatus("expired");
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      setVerificationStatus("expired");
    }
  };

  // Handle resending the verification email
  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate an API call
      setShowToast(true);
    } catch (error) {
      console.error("Error resending email:", error);
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Modal to provide help information
  const HelpModal = () => (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 ${
        showModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-95 sm:scale-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full mr-3">
              <FiHelpCircle className="text-orange-600 dark:text-orange-400 w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Need Help?
            </h3>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            If you&apos;re experiencing issues with email verification, please
            contact our support team:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-center">
              <MdOutlineEmail className="mr-2 text-orange-500" />
              <span>support@okpuja.com</span>
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>+91-XXXXX-XXXXX</span>
            </li>
            <li className="flex items-center">
              <BiTimeFive className="mr-2 text-orange-500" />
              <span>Hours: 9AM - 6PM (Mon-Sat)</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <Link
            href="/contact"
            className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors text-center"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );

  // Toast message to show when email is successfully resent
  const Toast = () => (
    <div
      className={`fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-500 flex items-center ${
        showToast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
    >
      <FiCheckCircle className="mr-2 h-5 w-5" />
      Verification email sent successfully!
    </div>
  );

  // Loading component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative mb-6">
        {/* Animated envelope */}
        <div className="w-24 h-24 relative">
          <div className="absolute inset-0 bg-orange-100 rounded-lg border-2 border-orange-300 flex items-center justify-center animate-pulse">
            <MdOutlineEmail className="w-12 h-12 text-orange-500" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-t-orange-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center mt-4">
          Verifying Your Email
        </h2>
        <p className="text-gray-500 text-center">
          Please wait while we validate your email address...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col">
      <header className="w-full h-20 bg-transparent"></header>

      <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
            {/* Logo section */}
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <Image
                  src="/image/logo.png"
                  alt="OKPUJA"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {verificationStatus === "loading" ? (
              <LoadingState />
            ) : verificationStatus === "verified" ? (
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <FaCheckCircle className="w-12 h-12 text-green-600" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Email Verified Successfully!
                </h1>

                <div className="bg-green-50 border border-green-100 rounded-lg p-4 mx-auto max-w-md">
                  <p className="text-gray-700">
                    Your email has been verified and your account is now active.
                    You can now access all features of OKPUJA.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Link
                    href="/login"
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto flex items-center justify-center"
                  >
                    <FiCheckCircle className="mr-2" />
                    Go to Login
                  </Link>

                  <Link
                    href="/"
                    className="bg-white border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors w-full sm:w-auto"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                  <BiTimeFive className="w-12 h-12 text-red-600" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Verification Link Expired
                </h1>

                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mx-auto max-w-md">
                  <p className="text-gray-700 mb-2">
                    Don&apos;t worry! Your verification link has expired or is
                    invalid. This could happen if:
                  </p>
                  <ul className="text-left text-gray-600 space-y-1 pl-5 list-disc">
                    <li>The link was already used</li>
                    <li>The link has expired (valid for 24 hours)</li>
                    <li>The URL was modified</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <button
                    onClick={handleResendEmail}
                    disabled={isResending}
                    className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isResending ? (
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
                        <MdOutlineEmail className="mr-2" />
                        Resend Verification Email
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto flex items-center justify-center"
                  >
                    <FiHelpCircle className="mr-2" />
                    Need Help?
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md">
            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-800 font-medium mb-1">
                  Security Note
                </h3>
                <p className="text-gray-600 text-sm">
                  Email verification helps ensure account security and prevents
                  unauthorized access. If you didn&apos;t request this verification,
                  please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} OKPUJA. All rights reserved.
      </footer>

      <HelpModal />
      <Toast />
    </div>
  );
};

export default EmailVerification;
