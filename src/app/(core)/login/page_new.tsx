"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import Image from "next/image";
import { useAuthStore } from "../../stores/authStore";
import { Toaster } from "react-hot-toast";

interface FormState {
  email: string;
  password: string;
  staySignedIn: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { login, loading, error, user, initAuth, clearError } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);

  // Form state
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
    staySignedIn: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize auth and check if already logged in
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (user && user.account_status === 'ACTIVE') {
      // Redirect based on role
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "EMPLOYEE") {
        router.push("/employee/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    }
  }, [user, router]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formState.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formState.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formState.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Form submission handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (loading) return;
    
    clearError();
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    const success = await login(formState.email, formState.password);
    
    if (success) {
      // Navigation will be handled by the useEffect above
    }
  };

  // Input change handler
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear related error when typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear global error when user starts typing
    if (error) {
      clearError();
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
          },
          success: {
            style: {
              border: '1px solid #10b981',
            },
          },
          error: {
            style: {
              border: '1px solid #ef4444',
            },
          },
        }}
      />
      
      <div className="min-h-screen flex items-center justify-center py-4 sm:py-6 lg:py-8 bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 relative">
          {/* Decorative elements */}
          <div className="hidden xl:block absolute -top-8 -right-8 w-24 h-24 bg-orange-100 rounded-full opacity-70"></div>
          <div className="hidden xl:block absolute -bottom-8 -left-8 w-20 h-20 bg-orange-200 rounded-full opacity-60"></div>

          {/* Left Side - Image Panel (hidden on mobile and tablet) */}
          <div className="relative hidden lg:block">
            <div
              className="h-full bg-cover bg-center min-h-[600px]"
              style={{
                backgroundImage: `url("https://img.freepik.com/free-photo/navratri-highly-detailed-candle-decoration_23-2151193693.jpg?ga=GA1.1.1275289697.1728223870&semt=ais_hybrid")`,
              }}
            >
              {/* Overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/80 via-blue-700/80 to-orange-800/85"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                {/* Logo */}
                <div className="mb-6 bg-white p-3 rounded-xl backdrop-blur-sm shadow-lg border border-white/20">
                  <Image
                    src="/image/okpuja logo.png"
                    width={160}
                    height={80}
                    alt="OKPUJA Logo"
                    className="object-contain drop-shadow-md"
                    priority
                  />
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4 text-center drop-shadow-md">
                  Welcome Back!
                </h1>

                <p className="text-center text-white/90 mb-6 max-w-sm text-sm lg:text-base drop-shadow-sm">
                  To continue your spiritual journey, please login with your personal info
                </p>

                <Link
                  href="/register"
                  className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium rounded-full border-2 border-white text-white transition-all duration-300 ease-out hover:bg-white hover:text-orange-600 shadow-md hover:scale-105"
                >
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                  <span className="relative">Create Account</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            {/* Mobile/Tablet Logo */}
            <div className="lg:hidden flex justify-center mb-6">
              <div className="bg-gradient-to-b from-orange-100 to-orange-50 p-3 rounded-xl shadow-md border border-orange-200">
                <Image
                  src="/image/okpuja logo.png"
                  width={120}
                  height={60}
                  alt="OKPUJA Logo"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="w-full max-w-md mx-auto lg:max-w-none">
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-800 mb-2 text-center lg:text-left">
                Login to Your Account
              </h2>

              <p className="text-gray-600 mb-6 text-center lg:text-left text-sm sm:text-base">
                Enter your credentials to continue your spiritual journey
              </p>

              {/* Global Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  <div className="flex items-center">
                    <span className="mr-2">⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Mobile/Tablet Sign Up Link */}
              <div className="lg:hidden text-center mb-6">
                <p className="text-sm text-gray-600 mb-3">
                  Don&apos;t have an account?
                </p>
                <Link
                  href="/register"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white inline-flex items-center justify-center font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Create Account
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="mr-2 text-orange-500" /> Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 rounded-lg border text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        formErrors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-2 flex items-start">
                      <span className="inline-block mr-1 mt-0.5">⚠</span>
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FaLock className="mr-2 text-orange-500" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formState.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`w-full px-4 py-3 rounded-lg border text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 pr-12 ${
                        formErrors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      required
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={loading}
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-500 text-xs mt-2 flex items-start">
                      <span className="inline-block mr-1 mt-0.5">⚠</span>
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between flex-wrap gap-2">
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
                    <label htmlFor="staySignedIn" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-orange-600 hover:text-orange-700 transition-colors"
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
                    active:shadow-inner transition-all duration-200 ${
                      loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl active:scale-[0.98]"
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
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
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Desktop Sign Up Link */}
              <div className="mt-8 text-center hidden lg:block">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link 
                    href="/register" 
                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
