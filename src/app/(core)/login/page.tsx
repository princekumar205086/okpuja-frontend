"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useLogin, FormState, Errors } from "./action";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const  isRole  = "User";
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check if already logged in
  useEffect(() => {
    // Check token directly here as well as using findUser for redundancy
    const token = localStorage.getItem("token");

    if (token) {
      console.log("Token found in localStorage, checking role...");

      if (isRole === "User") {
        console.log("User role detected, redirecting to dashboard");
        router.push("/dashboard");
      } else if (isRole === "ADMIN") {
        console.log("Admin role detected, redirecting to admin dashboard");
        router.push("/admin/dashboard");
      }
    } else {
      console.log("No token found, showing login form");
    }
  }, [isRole, router]);

  const { handleSubmit } = useLogin();

  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
    staySignedIn: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form submission handler
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (loading) return; // Prevent multiple submissions

    setLoading(true);
    console.log("Form submitted with:", { email: formState.email });

    try {
      await handleSubmit(formState, setErrors);
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      console.error("Login submission error:", err);
      toast.error("Failed to process login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Input change handler
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear related error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-6 sm:py-8 lg:py-12 bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-4xl mx-4 grid grid-cols-1 sm:grid-cols-2 relative">
        {/* Decorative elements */}
        <div className="hidden lg:block absolute -top-10 -right-10 w-32 h-32 bg-orange-100 rounded-full opacity-70"></div>
        <div className="hidden lg:block absolute -bottom-10 -left-10 w-28 h-28 bg-orange-200 rounded-full opacity-60"></div>

        {/* Left Side - Image Panel (hidden on mobile) */}
        <div className="relative hidden sm:block">
          <div
            className="h-full bg-cover bg-center"
            style={{
              backgroundImage: `url("https://img.freepik.com/free-photo/navratri-highly-detailed-candle-decoration_23-2151193693.jpg?ga=GA1.1.1275289697.1728223870&semt=ais_hybrid")`,
            }}
          >
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/85 via-blue-700/85 to-orange-800/90"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
              {/* Logo */}
              <div className="mb-8 bg-white p-4 rounded-xl backdrop-blur-sm shadow-lg border border-white/20">
                <Image
                  src="/image/okpuja logo.png"
                  width={180}
                  height={100}
                  alt="OKPUJA Logo"
                  className="object-contain drop-shadow-md"
                  priority
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center drop-shadow-md">
                Welcome Back!
              </h1>

              <p className="text-center text-white mb-8 max-w-xs drop-shadow-sm">
                To continue your spiritual journey, please login with your
                personal info
              </p>

              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium rounded-full border-2 border-white text-white transition-all duration-300 ease-out hover:bg-white hover:text-orange-600 shadow-md"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span>Create Account</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-6 sm:p-8 lg:p-10">
          {/* Mobile Logo */}
          <div className="sm:hidden flex justify-center mb-6">
            <div className="bg-gradient-to-b from-orange-100 to-orange-50 p-3 rounded-xl shadow-md border border-orange-200">
              <Image
                src="/image/okpuja logo.png"
                width={140}
                height={70}
                alt="OKPUJA Logo"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h2 className="text-2xl sm:text-2xl font-bold text-orange-800 mb-2 text-center sm:text-left">
            Login to Your Account
          </h2>

          <p className="text-gray-600 mb-6 text-center sm:text-left">
            Enter your credentials to continue
          </p>

          {/* Mobile Sign Up Link */}
          <div className="sm:hidden text-center mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Don&apos;t have an account?
            </p>
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white inline-flex items-center justify-center font-medium hover:from-orange-600 hover:to-orange-700 transition-colors shadow-md"
            >
              Create Account
            </Link>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <FaEnvelope className="mr-2 text-orange-500" /> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-start">
                  <span className="inline-block mr-1 mt-0.5">⚠</span>{" "}
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <FaLock className="mr-2 text-orange-500" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-start">
                  <span className="inline-block mr-1 mt-0.5">⚠</span>{" "}
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="staySignedIn"
                  name="staySignedIn"
                  checked={formState.staySignedIn}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label
                  htmlFor="staySignedIn"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 px-5 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-orange-600
                hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-lg 
                active:shadow-inner active:scale-[0.98] transition-all duration-200 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Desktop Sign Up Link */}
          <div className="mt-8 text-center sm:block">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-orange-600 font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
