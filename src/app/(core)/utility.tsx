"use client";

import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          background: "#363636",
          color: "#F8EFBA",
          fontFamily: "var(--font-inria-sans)",
          fontSize: "0.9rem",
          borderRadius: "8px",
          padding: "12px 20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
        },
        success: {
          duration: 3000,
          style: {
            background: "rgba(34, 197, 94, 0.95)",
            color: "#F8EFBA",
          },
          icon: "🙏",
        },
        error: {
          duration: 4000,
          style: {
            background: "rgba(239, 68, 68, 0.95)",
            color: "#F8EFBA",
          },
          icon: "⚠️",
        },
      }}
    />
  );
}

export function WhatsAppButton() {
  return (
    <div className="fixed z-50">
      {/* Wrapper with proper positioning */}
      <div className="fixed bottom-10 right-10 md:bottom-5 md:right-5 sm:bottom-4 sm:right-4 z-50">
        {/* Button with animation container */}
        <div className="relative">
          {/* Pulsing animation ring */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-70 bg-green-500 scale-125"></div>

          {/* WhatsApp button */}
          <Link
            href="https://wa.me/918051555505"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact us on WhatsApp"
            className="flex items-center justify-center bg-green-500 text-cream shadow-lg hover:bg-green-600 transition-all duration-300 rounded-full relative z-10"
            style={{
              width: "60px",
              height: "60px",
            }}
          >
            <FaWhatsapp className="text-3xl md:text-2xl sm:text-xl" />
          </Link>
        </div>
      </div>

      {/* Define custom animation keyframes */}
      <style jsx global>{`
        @keyframes ping {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70%,
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @media (max-width: 768px) {
          .fixed.bottom-10.right-10 {
            bottom: 1.25rem;
            right: 1.25rem;
          }

          .fixed.bottom-10.right-10 a {
            width: 50px !important;
            height: 50px !important;
          }
        }

        @media (max-width: 480px) {
          .fixed.bottom-10.right-10 {
            bottom: 1rem;
            right: 1rem;
          }

          .fixed.bottom-10.right-10 a {
            width: 45px !important;
            height: 45px !important;
          }
        }
      `}</style>
    </div>
  );
}
