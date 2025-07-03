"use client";

import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaSpinner,
  FaCheck,
  FaTimesCircle,
} from "react-icons/fa";
import Link from "next/link";

export default function ForgotPassword() {
  // Form states
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: Email entry, 2: OTP verification, 3: New password
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Move to OTP verification
      setSuccess("A verification code has been sent to your email");
      setStep(2);
    } catch (err) {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete verification code");
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Move to password reset
      setSuccess("Verification successful");
      setStep(3);
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Password reset successful
      setSuccess("Your password has been reset successfully");
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the process
  const handleRestart = () => {
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setStep(1);
  };

  return (
    <>
      <div className="bg-gray-50 py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {/* Progress Indicator */}
            <div className="flex justify-between items-center mb-8 px-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      step === stepNumber
                        ? "bg-orange-500 text-white"
                        : step > stepNumber
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > stepNumber ? <FaCheck /> : stepNumber}
                  </div>
                  <p
                    className={`text-xs mt-1 text-center ${
                      step === stepNumber
                        ? "text-orange-500 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {stepNumber === 1
                      ? "Email"
                      : stepNumber === 2
                      ? "Verification"
                      : "New Password"}
                  </p>
                </div>
              ))}

              {/* Connecting lines */}
              <div className="h-1 bg-gray-200 absolute left-1/2 transform -translate-x-1/2 top-12 w-[65%] z-0">
                <div
                  className={`h-full bg-orange-500 transition-all duration-500 ${
                    step === 1 ? "w-0" : step === 2 ? "w-1/2" : "w-full"
                  }`}
                ></div>
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-100 text-red-600 rounded-md p-3 flex items-start">
                <FaTimesCircle className="mt-1 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && !error && (
              <div className="mb-6 bg-green-50 border border-green-100 text-green-600 rounded-md p-3 flex items-start">
                <FaCheck className="mt-1 mr-2 flex-shrink-0" />
                <p>{success}</p>
              </div>
            )}

            {/* Step 1: Email Entry */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Forgot Your Password?
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter your email address and we&apos;ll send you a verification
                  code to reset your password.
                </p>

                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Send Verification Code
                      <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-orange-600 hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleOtpSubmit}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Enter Verification Code
                </h2>
                <p className="text-gray-600 mb-6">
                  We&apos;ve sent a 6-digit verification code to{" "}
                  <span className="font-medium">{email}</span>. The code will
                  expire in 10 minutes.
                </p>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-3">
                    Verification Code
                  </label>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Verify Code
                      <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
                      onClick={async () => {
                        setError("");
                        setIsLoading(true);
                        // Simulate API call for resend
                        await new Promise((resolve) => setTimeout(resolve, 1500));
                        setIsLoading(false);
                        setSuccess("A verification code has been resent to your email");
                      }}
                      className="text-orange-600 hover:underline"
                    >
                      Resend
                    </button>
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Use a different email address
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handlePasswordReset}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Create New Password
                </h2>
                <p className="text-gray-600 mb-6">
                  Your identity has been verified. Set your new password below.
                </p>

                <div className="mb-5">
                  <label
                    htmlFor="newPassword"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter new password"
                      minLength={8}
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Confirm new password"
                      minLength={8}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !!success}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin h-5 w-5" />
                  ) : success ? (
                    <>
                      <FaCheck className="mr-2" />
                      Password Reset Successfully
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>

                {success && (
                  <div className="mt-6 text-center">
                    <Link
                      href="/login"
                      className="text-white bg-green-600 py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Go to Login
                    </Link>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Security Info */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-5 md:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Security Tips
            </h3>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Never share your password or OTP with anyone, including OKPUJA
                support.
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Create a strong password using a mix of letters, numbers and
                symbols.
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Use a unique password that you don&apos;t use for other accounts.
              </li>
            </ul>
          </div>

          <div className="mt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} OKPUJA. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
