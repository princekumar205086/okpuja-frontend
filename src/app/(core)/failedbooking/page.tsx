"use client";
import React, { useEffect } from "react";
import {
  FaTimesCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaQuestionCircle,
  FaLongArrowAltLeft,
  FaSyncAlt,
  FaExclamationTriangle,
  FaHeadset,
} from "react-icons/fa";
import Link from "next/link";

const BookingFailed = () => {
  // Parse the URL params if any
  const getErrorDetails = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const errorCode = urlParams.get("code") || "TRANSACTION_FAILED";
      const bookingId = urlParams.get("bookingId") || "OK123456";

      return {
        errorCode,
        bookingId,
      };
    }
    return {
      errorCode: "TRANSACTION_FAILED",
      bookingId: "OK123456",
    };
  };

  const { errorCode, bookingId } = getErrorDetails();

  useEffect(() => {
    // Clean URL params without page reload
    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Map error codes to user-friendly messages
  const errorMessages = {
    PAYMENT_FAILED: "Your payment could not be processed at this time.",
    TRANSACTION_FAILED: "The transaction was declined by the payment provider.",
    SERVER_ERROR: "Our server encountered an issue while processing your booking.",
    TIMEOUT: "The payment request timed out. Please try again.",
    INSUFFICIENT_FUNDS: "The transaction was declined due to insufficient funds.",
  };

  const getErrorMessage = (code: keyof typeof errorMessages) => {
    return (
      errorMessages[code] || "We were unable to complete your booking request."
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100">
      {/* Header */}
      <header className="bg-transparent shadow-md py-4 h-20"></header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Failure Message */}
        <div className="text-center mb-8 md:mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-100 rounded-full scale-150 opacity-30 animate-pulse"></div>
            <FaTimesCircle className="text-red-600 text-5xl md:text-6xl mx-auto mb-4 relative z-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
            Your Puja Booking Failed
          </h1>
          <p className="text-gray-600 text-md md:text-lg max-w-xl mx-auto">
            We apologize for the inconvenience. Our team has been notified and
            is looking into this issue.
          </p>
          <div className="mt-3 md:mt-4 bg-red-100 rounded-lg py-2 px-4 inline-block">
            <p className="text-gray-700">
              Your booking reference is{" "}
              <span className="font-semibold text-red-600">{bookingId}</span>
            </p>
          </div>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8 transition-all hover:shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 border-b pb-2 border-gray-100">
            What Happened?
          </h2>

          <div className="flex items-start space-x-3 p-3 rounded-md bg-red-50 border border-red-100">
            <span className="mt-1 text-red-500">
              <FaExclamationTriangle />
            </span>
            <div>
              <p className="text-gray-700 font-medium">Error Details</p>
              <p className="text-gray-600 mt-1">
                {getErrorMessage(
                  errorCode as
                    | "PAYMENT_FAILED"
                    | "TRANSACTION_FAILED"
                    | "SERVER_ERROR"
                    | "TIMEOUT"
                    | "INSUFFICIENT_FUNDS"
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 text-gray-600">
            <p>This could be due to one of the following reasons:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>Temporary issue with the payment gateway</li>
              <li>Network connectivity problems during the transaction</li>
              <li>Issues with your bank or payment method</li>
              <li>Session timeout during the booking process</li>
            </ul>
          </div>
        </div>

        {/* What to do next */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8 transition-all hover:shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 border-b pb-2 border-gray-100">
            What To Do Next
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-white p-2 rounded-full text-red-500">
                  <FaSyncAlt />
                </span>
                <h3 className="font-medium text-gray-800">Try Again</h3>
              </div>
              <p className="text-gray-600 ml-11">
                Return to your cart and attempt the booking process again with
                the same or a different payment method.
              </p>
              <Link
                href="/checkout"
                className="mt-3 ml-11 inline-block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                Try Again
              </Link>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-white p-2 rounded-full text-red-500">
                  <FaHeadset />
                </span>
                <h3 className="font-medium text-gray-800">Contact Support</h3>
              </div>
              <p className="text-gray-600 ml-11">
                Get in touch with our customer support team for assistance with
                your booking.
              </p>
              <a
                href="mailto:support@okpuja.com"
                className="mt-3 ml-11 inline-block bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-8 transition-all hover:shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 border-b pb-2 border-gray-100 text-center">
            Need Assistance?
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center">
            <a
              href="tel:+91XXXXXXXXXX"
              className="flex items-center gap-2 hover:text-red-600 transition-colors"
            >
              <div className="bg-red-100 p-2 rounded-full">
                <FaPhoneAlt className="text-red-600" />
              </div>
              <span className="text-gray-700">+91-XXXXX-XXXXX</span>
            </a>
            <a
              href="mailto:support@okpuja.com"
              className="flex items-center gap-2 hover:text-red-600 transition-colors"
            >
              <div className="bg-red-100 p-2 rounded-full">
                <FaEnvelope className="text-red-600" />
              </div>
              <span className="text-gray-700">support@okpuja.com</span>
            </a>
            <a
              href="/faq"
              className="flex items-center gap-2 hover:text-red-600 transition-colors"
            >
              <div className="bg-red-100 p-2 rounded-full">
                <FaQuestionCircle className="text-red-600" />
              </div>
              <span className="text-red-600 hover:underline">View FAQs</span>
            </a>
          </div>
        </div>

        {/* Return to Homepage */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <FaLongArrowAltLeft />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pb-8">
          © {new Date().getFullYear()} OKPUJA. All rights reserved.
        </div>
      </main>
    </div>
  );
};

export default BookingFailed;
