"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaSpinner,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { useAuthStore } from "@/app/stores/authStore";
import Link from "next/link";

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
  const { login, loading, error, user, clearError, initAuth } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);

  // Form state
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
    staySignedIn: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  // Initialize auth store
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check if already logged in
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

  // Handle URL search params for success messages
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const verified = searchParams.get('verified');
    const reset = searchParams.get('reset');
    
    if (verified === 'true') {
      toast.success('Email verified successfully! Please login with your credentials.');
    }
    
    if (reset === 'success') {
      toast.success('Password reset successful! Please login with your new password.');
    }
  }, []);

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formState.email, formState.password);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field-specific errors when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: {
              border: '1px solid #10b981',
              background: '#f0fdf4',
            },
          },
          error: {
            style: {
              border: '1px solid #ef4444',
              background: '#fef2f2',
            },
          },
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-100/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
          {/* Left Side - Brand Section (Hidden on Mobile) */}
          <motion.div 
            className="hidden lg:flex flex-col justify-center px-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-lg">
              {/* Logo */}
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mr-4">
                  <FaStar className="text-white text-xl" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">OKPUJA</h1>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome Back to Your Spiritual Journey
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Continue your path of enlightenment with personalized guidance from our expert astrologers and spiritual advisors.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span className="text-gray-700">Trusted by 10,000+ users</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span className="text-gray-700">Expert astrologers available 24/7</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span className="text-gray-700">Personalized spiritual guidance</span>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-sm" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-3">
                  &quot;OKPUJA has transformed my spiritual journey. The guidance I received was incredibly accurate and helpful.&quot;
                </p>
                <p className="text-sm text-gray-600 font-medium">- Priya Sharma, Mumbai</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Mobile Brand Header */}
            <div className="lg:hidden text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              >
                <FaStar className="text-white text-xl" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">OKPUJA</h1>
              <p className="text-gray-600 text-base">Welcome back to your spiritual journey</p>
            </div>

            {/* Form Card */}
            <motion.div 
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8 border border-white/50 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5 rounded-3xl"></div>
              <div className="absolute -top-2 -left-2 w-20 h-20 bg-orange-200/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-amber-200/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                  <p className="text-gray-600">Access your spiritual dashboard</p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div 
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base bg-white/70 backdrop-blur-sm ${
                          formErrors.email ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {formErrors.email && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formState.password}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base bg-white/70 backdrop-blur-sm ${
                          formErrors.password ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>

                  {/* Remember me and Forgot password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        name="staySignedIn"
                        type="checkbox"
                        checked={formState.staySignedIn}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Remember me</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-orange-600 hover:text-orange-500 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-4 rounded-xl font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : null}
                    {loading ? "Signing In..." : "Sign In"}
                  </button>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Don&apos;t have an account?</span>
                    </div>
                  </div>

                  {/* Sign Up Link */}
                  <Link
                    href="/register"
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 py-4 rounded-xl font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center"
                  >
                    Create New Account
                  </Link>
                </form>
              </div>
            </motion.div>

            {/* Security Notice */}
            <motion.div 
              className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <FaShieldAlt className="text-green-500 h-4 w-4" />
              <span>Your data is protected with end-to-end encryption</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
