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
  FaPhone,
  FaUser,
  FaArrowRight,
  FaShieldAlt,
  FaSpinner,
  FaCheckCircle,
  FaUserTie,
  FaIdCard,
  FaGoogle,
  FaFacebook,
  FaApple,
  FaStar,
  FaQuoteLeft,
  FaHeart,
  FaGlobe,
  FaCrown,
  FaUsers
} from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";
import apiClient from "../../apiService/globalApiconfig";

interface FormState {
  email: string;
  phone: string;
  password: string;
  password2: string;
  role: "USER" | "EMPLOYEE";
  employee_registration_code?: string;
}

interface FormErrors {
  email?: string;
  phone?: string;
  password?: string;
  password2?: string;
  employee_registration_code?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const { user, initAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"USER" | "EMPLOYEE">("USER");

  // Form state
  const [formState, setFormState] = useState<FormState>({
    email: "",
    phone: "",
    password: "",
    password2: "",
    role: "USER",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize auth and redirect if already logged in
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (user && user.account_status === 'ACTIVE') {
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "EMPLOYEE") {
        router.push("/employee/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    }
  }, [user, router]);

  // Update form state when tab changes
  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      role: activeTab,
      employee_registration_code: activeTab === "USER" ? undefined : prev.employee_registration_code
    }));
  }, [activeTab]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    // Email validation
    if (!formState.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation
    if (!formState.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formState.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    // Password validation
    if (!formState.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formState.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formState.password)) {
      errors.password = "Password must contain uppercase, lowercase, number and special character";
      isValid = false;
    }

    // Confirm password validation
    if (!formState.password2.trim()) {
      errors.password2 = "Please confirm your password";
      isValid = false;
    } else if (formState.password !== formState.password2) {
      errors.password2 = "Passwords do not match";
      isValid = false;
    }

    // Employee registration code validation
    if (formState.role === "EMPLOYEE") {
      if (!formState.employee_registration_code?.trim()) {
        errors.employee_registration_code = "Employee registration code is required";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        email: formState.email,
        phone: formState.phone,
        password: formState.password,
        password2: formState.password2,
        role: formState.role,
        ...(formState.role === "EMPLOYEE" && { 
          employee_registration_code: formState.employee_registration_code 
        })
      };

      const response = await apiClient.post('/auth/register/', payload);
      
      // Store password temporarily for auto-login after OTP verification
      localStorage.setItem('temp_password', formState.password);
      
      toast.success("Registration successful! Please check your email for verification.", {
        duration: 5000,
      });
      
      // Redirect to OTP verification page
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(formState.email)}`);
      }, 2000);
      
    } catch (err: any) {
      console.error("Registration error:", err);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.email) {
          errorMessage = Array.isArray(err.response.data.email) 
            ? err.response.data.email[0] 
            : err.response.data.email;
        } else if (err.response.data.phone) {
          errorMessage = Array.isArray(err.response.data.phone) 
            ? err.response.data.phone[0] 
            : err.response.data.phone;
        } else if (err.response.data.employee_registration_code) {
          errorMessage = Array.isArray(err.response.data.employee_registration_code) 
            ? err.response.data.employee_registration_code[0] 
            : err.response.data.employee_registration_code;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific errors when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "Enter password", color: "bg-gray-200" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*]/.test(password)) strength += 1;

    const strengthMap = [
      { text: "Very Weak", color: "bg-red-500" },
      { text: "Weak", color: "bg-orange-500" },
      { text: "Fair", color: "bg-yellow-500" },
      { text: "Good", color: "bg-blue-500" },
      { text: "Strong", color: "bg-green-500" },
    ];

    return {
      strength: (strength / 4) * 100,
      text: strengthMap[strength]?.text || "Very Weak",
      color: strengthMap[strength]?.color || "bg-red-500",
    };
  };

  const passwordStrength = getPasswordStrength(formState.password);

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
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Left Side - Enhanced Brand Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600">
          {/* Enhanced Geometric Pattern Background */}
          <div className="absolute inset-0 opacity-15">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="enhanced-geometric-reg" x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
                  <rect x="10" y="10" width="25" height="25" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" transform="rotate(45 22.5 22.5)"/>
                  <rect x="70" y="70" width="25" height="25" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" transform="rotate(45 82.5 82.5)"/>
                  <rect x="115" y="115" width="20" height="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <circle cx="35" cy="105" r="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                  <circle cx="105" cy="35" r="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                  <path d="M0,70 Q35,35 70,70 T140,70" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none"/>
                  <path d="M70,0 Q105,35 70,70 T70,140" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none"/>
                  <polygon points="50,20 65,35 50,50 35,35" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#enhanced-geometric-reg)"/>
            </svg>
          </div>
          
          {/* Enhanced Floating Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-32 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-bounce delay-500"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-amber-200/20 rounded-full blur-xl animate-pulse delay-2000"></div>
            <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-orange-200/15 rounded-full blur-2xl animate-pulse delay-3000"></div>
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
                Start Your<br />
                <span className="bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">Journey</span>
              </h1>
              <p className="text-xl text-orange-100 mb-12 leading-relaxed max-w-lg font-light">
                Join thousands of users who trust our platform for spiritual guidance and enlightenment.
              </p>

              {/* Enhanced Features List */}
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-4 text-orange-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-200/25 to-amber-200/10 rounded-xl flex items-center justify-center border border-amber-200/20">
                    <FaCrown className="text-amber-200 text-xl" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold block">Expert Spiritual Guidance</span>
                    <span className="text-orange-200 text-sm">Connect with certified spiritual advisors</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-orange-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-200/25 to-amber-200/10 rounded-xl flex items-center justify-center border border-amber-200/20">
                    <FaCheckCircle className="text-amber-200 text-xl" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold block">Personalized Consultations</span>
                    <span className="text-orange-200 text-sm">Tailored guidance for your unique journey</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-orange-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-200/25 to-amber-200/10 rounded-xl flex items-center justify-center border border-amber-200/20">
                    <FaUsers className="text-amber-200 text-xl" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold block">Community Support</span>
                    <span className="text-orange-200 text-sm">Join our growing spiritual community</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Testimonial Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <FaQuoteLeft className="text-amber-200 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-orange-100 italic mb-3 leading-relaxed">
                      &quot;OKPUJA transformed my spiritual journey. The guidance I received was incredibly insightful and life-changing.&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                        <FaHeart className="text-orange-600 text-xs" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">Rajesh Kumar</div>
                        <div className="flex text-amber-200 text-xs">
                          <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-8 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-200">10K+</div>
                  <div className="text-orange-200 text-xs">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-200">500+</div>
                  <div className="text-orange-200 text-xs">Expert Advisors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-200">24/7</div>
                  <div className="text-orange-200 text-xs">Support</div>
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
              <p className="text-gray-600 text-lg font-medium">Start your spiritual journey today</p>
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
                    <pattern id="card-pattern-reg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="2" fill="currentColor"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#card-pattern-reg)" className="text-orange-500"/>
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
                  Create Account
                </motion.h2>
                <motion.p 
                  className="text-gray-600 text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Choose your account type to get started
                </motion.p>
                
                {/* Decorative line */}
                <motion.div 
                  className="w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto mt-4"
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                ></motion.div>
              </div>

              {/* Enhanced Role Toggle */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-1.5 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setActiveTab("USER")}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 ${
                      activeTab === "USER"
                        ? "bg-white text-orange-600 shadow-lg shadow-orange-100/50 transform scale-[1.02]"
                        : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                    }`}
                  >
                    <FaUser className="h-5 w-5" />
                    User Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("EMPLOYEE")}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 ${
                      activeTab === "EMPLOYEE"
                        ? "bg-white text-orange-600 shadow-lg shadow-orange-100/50 transform scale-[1.02]"
                        : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                    }`}
                  >
                    <FaUserTie className="h-5 w-5" />
                    Employee Account
                  </button>
                </div>
                
                {/* Account type description */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    {activeTab === "USER" 
                      ? "Join as a user to access spiritual guidance and consultations" 
                      : "Register as an employee to provide spiritual services"
                    }
                  </p>
                </div>
              </motion.div>

              {/* Enhanced Form */}
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
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

                {/* Enhanced Phone Field */}
                <div className="space-y-3">
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-800 tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                      <FaPhone className={`h-5 w-5 transition-colors ${formErrors.phone ? 'text-red-400' : 'text-gray-400 group-focus-within:text-orange-500'}`} />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formState.phone}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-4 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 font-medium ${
                        formErrors.phone 
                          ? 'border-red-300 focus:border-red-500 bg-red-50 shadow-red-100' 
                          : 'border-gray-200 focus:border-orange-500 hover:border-gray-300 bg-gray-50 focus:bg-white shadow-gray-100'
                      } shadow-lg hover:shadow-xl focus:shadow-orange-200/50`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <AnimatePresence>
                    {formErrors.phone && (
                      <motion.p 
                        className="text-sm text-red-600 flex items-center gap-2 font-medium"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-red-500">⚠</span>
                        {formErrors.phone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Enhanced Employee Registration Code (Only for Employee) */}
                <AnimatePresence>
                  {activeTab === "EMPLOYEE" && (
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label htmlFor="employee_registration_code" className="block text-sm font-bold text-gray-800 tracking-wide">
                        Employee Registration Code
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                          <FaIdCard className={`h-5 w-5 transition-colors ${formErrors.employee_registration_code ? 'text-red-400' : 'text-gray-400 group-focus-within:text-orange-500'}`} />
                        </div>
                        <input
                          id="employee_registration_code"
                          name="employee_registration_code"
                          type="text"
                          value={formState.employee_registration_code || ""}
                          onChange={handleInputChange}
                          className={`block w-full pl-12 pr-4 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 font-medium ${
                            formErrors.employee_registration_code 
                              ? 'border-red-300 focus:border-red-500 bg-red-50 shadow-red-100' 
                              : 'border-gray-200 focus:border-orange-500 hover:border-gray-300 bg-gray-50 focus:bg-white shadow-gray-100'
                          } shadow-lg hover:shadow-xl focus:shadow-orange-200/50`}
                          placeholder="Enter employee registration code"
                        />
                      </div>
                      <AnimatePresence>
                        {formErrors.employee_registration_code && (
                          <motion.p 
                            className="text-sm text-red-600 flex items-center gap-2 font-medium"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="text-red-500">⚠</span>
                            {formErrors.employee_registration_code}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                      autoComplete="new-password"
                      value={formState.password}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-12 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 font-medium ${
                        formErrors.password 
                          ? 'border-red-300 focus:border-red-500 bg-red-50 shadow-red-100' 
                          : 'border-gray-200 focus:border-orange-500 hover:border-gray-300 bg-gray-50 focus:bg-white shadow-gray-100'
                      } shadow-lg hover:shadow-xl focus:shadow-orange-200/50`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-600 transition-colors duration-200"
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Enhanced Password Strength Indicator */}
                  <AnimatePresence>
                    {formState.password && (
                      <motion.div 
                        className="space-y-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-medium">Password strength:</span>
                          <span className={`font-bold ${passwordStrength.strength >= 75 ? 'text-green-600' : passwordStrength.strength >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {passwordStrength.text}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className={`h-3 rounded-full transition-all duration-500 ${passwordStrength.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.strength}%` }}
                            transition={{ duration: 0.5 }}
                          ></motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

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

                {/* Enhanced Confirm Password Field */}
                <div className="space-y-3">
                  <label htmlFor="password2" className="block text-sm font-bold text-gray-800 tracking-wide">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                      <FaLock className={`h-5 w-5 transition-colors ${formErrors.password2 ? 'text-red-400' : 'text-gray-400 group-focus-within:text-orange-500'}`} />
                    </div>
                    <input
                      id="password2"
                      name="password2"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formState.password2}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-12 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 font-medium ${
                        formErrors.password2 
                          ? 'border-red-300 focus:border-red-500 bg-red-50 shadow-red-100' 
                          : 'border-gray-200 focus:border-orange-500 hover:border-gray-300 bg-gray-50 focus:bg-white shadow-gray-100'
                      } shadow-lg hover:shadow-xl focus:shadow-orange-200/50`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {formErrors.password2 && (
                      <motion.p 
                        className="text-sm text-red-600 flex items-center gap-2 font-medium"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-red-500">⚠</span>
                        {formErrors.password2}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create {activeTab === "USER" ? "User" : "Employee"} Account</span>
                      <FaArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>

                {/* Social Registration Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or register with</span>
                  </div>
                </div>

                {/* Social Registration Buttons */}
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

              {/* Enhanced Sign In Link */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <p className="text-gray-600 text-lg">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-orange-600 hover:text-orange-700 transition-colors duration-200 underline-offset-4 hover:underline"
                  >
                    Sign in here
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
              <span className="font-medium">Your data is protected with industry-standard encryption</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
