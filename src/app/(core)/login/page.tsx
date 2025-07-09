"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { 
  FaEye, 
  FaEyeSlash, 
  FaEnvelope, 
  FaLock, 
  FaArrowRight,
  FaShieldAlt,
  FaSpinner,
  FaCheckCircle,
  FaGoogle,
  FaFacebook,
  FaApple,
  FaStar,
  FaQuoteLeft,
  FaHeart,
  FaGlobe
} from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";

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
        router.push("user/dashboard");
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
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50 to-amber-100 flex relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl animate-bounce"></div>
        </div>

        {/* Left Side - Enhanced Brand Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600">
          {/* Enhanced Geometric Pattern Background */}
          <div className="absolute inset-0 opacity-15">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="enhanced-geometric" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                  <circle cx="25" cy="25" r="15" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                  <circle cx="95" cy="95" r="15" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                  <rect x="50" y="10" width="20" height="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" transform="rotate(45 60 20)"/>
                  <rect x="10" y="50" width="20" height="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" transform="rotate(45 20 60)"/>
                  <path d="M0,60 Q30,30 60,60 T120,60" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none"/>
                  <path d="M60,0 Q90,30 60,60 T60,120" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#enhanced-geometric)"/>
            </svg>
          </div>
          
          {/* Enhanced Floating Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-32 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-bounce delay-500"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-amber-200/20 rounded-full blur-xl animate-pulse delay-2000"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              {/* Enhanced Logo Section */}
              <div className="mb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-white/25 to-white/10 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20 shadow-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-lg"></div>
                </div>
                <div className="text-3xl font-bold text-white/90 mb-2">OKPUJA</div>
                <div className="text-sm text-orange-100 font-medium">Spiritual Guidance Platform</div>
              </div>

              <h1 className="text-7xl font-bold mb-8 leading-tight">
                Welcome<br />
                <span className="bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">Back</span>
              </h1>
              <p className="text-xl text-orange-100 mb-12 leading-relaxed max-w-lg font-light">
                Continue your spiritual journey with personalized guidance from our expert astrologers and spiritual advisors.
              </p>

              {/* Enhanced Features List */}
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-4 text-orange-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-200/25 to-amber-200/10 rounded-xl flex items-center justify-center border border-amber-200/20">
                    <FaCheckCircle className="text-amber-200 text-xl" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold block">Personalized Consultations</span>
                    <span className="text-orange-200 text-sm">Get guidance tailored to your needs</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-orange-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-200/25 to-amber-200/10 rounded-xl flex items-center justify-center border border-amber-200/20">
                    <FaShieldAlt className="text-amber-200 text-xl" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold block">Secure & Private</span>
                    <span className="text-orange-200 text-sm">Your data is protected and confidential</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-orange-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-200/25 to-amber-200/10 rounded-xl flex items-center justify-center border border-amber-200/20">
                    <FaGlobe className="text-amber-200 text-xl" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold block">24/7 Availability</span>
                    <span className="text-orange-200 text-sm">Access spiritual guidance anytime</span>
                  </div>
                </div>
              </div>

              {/* Testimonial Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <FaQuoteLeft className="text-amber-200 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-orange-100 italic mb-3 leading-relaxed">
                      "OKPUJA transformed my spiritual journey. The guidance I received was incredibly insightful and life-changing."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                        <FaHeart className="text-orange-600 text-xs" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">Priya Sharma</div>
                        <div className="flex text-amber-200 text-xs">
                          <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Enhanced Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative z-10">
          <motion.div 
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Enhanced Mobile Brand Header */}
            <div className="lg:hidden text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
              >
                <div className="w-10 h-10 bg-white rounded-xl shadow-lg"></div>
              </motion.div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">OKPUJA</h1>
              <p className="text-gray-600 text-lg font-medium">Welcome back to your spiritual journey</p>
            </div>

            {/* Enhanced Form Card */}
            <motion.div 
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Card Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="card-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="2" fill="currentColor"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#card-pattern)" className="text-orange-500"/>
                </svg>
              </div>

              {/* Enhanced Header */}
              <div className="text-center mb-10 relative">
                <motion.h2 
                  className="text-4xl font-bold text-gray-900 mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Sign In
                </motion.h2>
                <motion.p 
                  className="text-gray-600 text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Enter your credentials to access your account
                </motion.p>
                
                {/* Decorative line */}
                <motion.div 
                  className="w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto mt-4"
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                ></motion.div>
              </div>

              {/* Enhanced Form */}
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {/* Enhanced Email Field */}
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-800 tracking-wide">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                      <FaEnvelope className={`h-5 w-5 transition-colors ${formErrors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-orange-500'}`} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-4 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 font-medium ${
                        formErrors.email 
                          ? 'border-red-300 focus:border-red-500 bg-red-50 shadow-red-100' 
                          : 'border-gray-200 focus:border-orange-500 hover:border-gray-300 bg-gray-50 focus:bg-white shadow-gray-100'
                      } shadow-lg hover:shadow-xl focus:shadow-orange-200/50`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  <AnimatePresence>
                    {formErrors.email && (
                      <motion.p 
                        className="text-sm text-red-600 flex items-center gap-2 font-medium"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-red-500">⚠</span>
                        {formErrors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Enhanced Password Field */}
                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-bold text-gray-800 tracking-wide">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                      <FaLock className={`h-5 w-5 transition-colors ${formErrors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-orange-500'}`} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={formState.password}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-12 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 font-medium ${
                        formErrors.password 
                          ? 'border-red-300 focus:border-red-500 bg-red-50 shadow-red-100' 
                          : 'border-gray-200 focus:border-orange-500 hover:border-gray-300 bg-gray-50 focus:bg-white shadow-gray-100'
                      } shadow-lg hover:shadow-xl focus:shadow-orange-200/50`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-600 transition-colors duration-200"
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {formErrors.password && (
                      <motion.p 
                        className="text-sm text-red-600 flex items-center gap-2 font-medium"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-red-500">⚠</span>
                        {formErrors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Enhanced Remember Me & Forgot Password */}
                <div className="flex items-center justify-between py-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      name="staySignedIn"
                      type="checkbox"
                      checked={formState.staySignedIn}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded transition-colors duration-200"
                    />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-200">Remember me</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors duration-200 underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Enhanced Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl backdrop-blur-sm"
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm text-red-800 font-semibold flex items-center gap-2">
                        <span className="text-red-500">⚠</span>
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enhanced Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-orange-700 hover:via-orange-600 hover:to-amber-600 focus:outline-none focus:ring-4 focus:ring-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Button background animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                  
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin h-5 w-5" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <FaArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>

                {/* Social Login Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <FaGoogle className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <FaFacebook className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <FaApple className="h-5 w-5" />
                  </button>
                </div>
              </motion.form>

              {/* Enhanced Sign Up Link */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <p className="text-gray-600 text-lg">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-bold text-orange-600 hover:text-orange-700 transition-colors duration-200 underline-offset-4 hover:underline"
                  >
                    Create one here
                  </Link>
                </p>
              </motion.div>
            </motion.div>

            {/* Enhanced Security Badge */}
            <motion.div 
              className="mt-8 flex items-center justify-center gap-3 text-sm text-gray-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <FaShieldAlt className="text-green-500 h-5 w-5" />
              <span className="font-medium">Secured with 256-bit SSL encryption</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
