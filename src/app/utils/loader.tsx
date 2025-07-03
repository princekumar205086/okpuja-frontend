import React from "react";
import { FaSpinner } from "react-icons/fa";
import Image from "next/image";

const Loader = ({
  message = "Loading...",
  fullScreen = true,
  transparent = false,
}) => {
  // Choose container classes based on props
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center z-50"
    : "relative flex items-center justify-center min-h-[200px] w-full z-10";

  // Choose background classes based on props
  const backgroundClasses = transparent
    ? "bg-transparent backdrop-blur-sm"
    : "bg-white/95 dark:bg-gray-900/95";

  return (
    <div
      className={`${containerClasses} ${fullScreen ? backgroundClasses : ""}`}
    >
      <div className="flex flex-col items-center justify-center p-6 rounded-xl max-w-xs">
        {/* Logo */}
        <div className="relative w-16 h-16 mb-4">
          <Image
            src="/image/okpuja logo.png"
            alt="OKPUJA"
            fill
            sizes="4rem"
            priority
            className="object-contain"
          />
        </div>

        {/* Loading Animation */}
        <div className="relative mb-4">
          {/* Outer circle */}
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>

          {/* Spinning indicator */}
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-t-4 border-r-4 border-orange-500 animate-spin"></div>

          {/* Inner pulsing circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-full animate-pulse"></div>
        </div>

        {/* Loading text */}
        <p className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
          {message}
        </p>

        {/* Loading dots animation */}
        <div className="flex mt-2 space-x-1">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${dot * 0.15}s`,
                animationDuration: "0.8s",
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Subtle design element - decorative rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
        <div
          className="w-32 h-32 md:w-48 md:h-48 border border-orange-200 dark:border-orange-900/30 rounded-full animate-ping opacity-20"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute w-48 h-48 md:w-64 md:h-64 border border-orange-100 dark:border-orange-900/20 rounded-full animate-ping opacity-10"
          style={{ animationDuration: "4s" }}
        ></div>
      </div>
    </div>
  );
};

// A smaller version that can be used inline in components
export const MiniLoader = ({
  size = "md",
  color = "orange",
}: {
  size?: "sm" | "md" | "lg";
  color?: "orange" | "blue" | "gray" | "white";
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colorClasses = {
    orange: "text-orange-500",
    blue: "text-blue-500",
    gray: "text-gray-500",
    white: "text-white",
  };

  return (
    <div className="inline-flex items-center justify-center">
      <FaSpinner
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
      />
    </div>
  );
};

export default Loader;
