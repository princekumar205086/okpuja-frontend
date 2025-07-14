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
  FaPhone,
  FaUser,
  FaShieldAlt,
  FaSpinner,
  FaStar,
  FaCheckCircle,
  FaKey,
} from "react-icons/fa";
import { useAuthStore } from "@/app/stores/authStore";
import apiClient from "@/app/apiService/globalApiconfig";
import Link from "next/link";

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
    // Clear errors when switching tabs
    setFormErrors({});
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
          <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-orange-100/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-amber-300/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
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
                Begin Your Spiritual Journey Today
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join thousands of seekers who have found clarity and purpose through our personalized spiritual guidance and astrological insights.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span className="text-gray-700">Free initial consultation</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span className="text-gray-700">Verified expert astrologers</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span className="text-gray-700">Secure & confidential</span>
                </div>
              </div>

              {/* Success Stories */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-sm" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-3">
                  &quot;Joining OKPUJA was the best decision I made. The spiritual guidance has brought so much peace to my life.&quot;
                </p>
                <p className="text-sm text-gray-600 font-medium">- Rahul Verma, Delhi</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Register Form */}
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
              <p className="text-gray-600 text-base">Begin your spiritual journey today</p>
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
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                  <p className="text-gray-600">Join the spiritual community</p>
                </div>

                {/* Tab Selection */}
                <div className="flex mb-8 bg-gray-100 rounded-2xl p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("USER")}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center ${
                      activeTab === "USER"
                        ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <FaUser className="mr-2" />
                    General User
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("EMPLOYEE")}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center ${
                      activeTab === "EMPLOYEE"
                        ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <FaKey className="mr-2" />
                    Employee
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <FaEnvelope className={`h-5 w-5 transition-colors duration-200 ${
                          formState.email ? 'text-orange-500' : 'text-gray-400'
                        } group-focus-within:text-orange-500`} />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base bg-white/90 backdrop-blur-sm placeholder-gray-400 ${
                          formErrors.email ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                        } focus:bg-white shadow-sm hover:shadow-md focus:shadow-lg`}
                        placeholder="Enter your email"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                    {formErrors.email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {formErrors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <FaPhone className={`h-5 w-5 transition-colors duration-200 ${
                          formState.phone ? 'text-orange-500' : 'text-gray-400'
                        } group-focus-within:text-orange-500`} />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formState.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base bg-white/90 backdrop-blur-sm placeholder-gray-400 ${
                          formErrors.phone ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                        } focus:bg-white shadow-sm hover:shadow-md focus:shadow-lg`}
                        placeholder="Enter your phone number"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                    {formErrors.phone && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {formErrors.phone}
                      </motion.p>
                    )}
                  </div>

                  {/* Employee Registration Code (Only for Employee) */}
                  {activeTab === "EMPLOYEE" && (
                    <div>
                      <label htmlFor="employee_registration_code" className="block text-sm font-semibold text-gray-700 mb-2">
                        Employee Registration Code
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <FaKey className={`h-5 w-5 transition-colors duration-200 ${
                            formState.employee_registration_code ? 'text-orange-500' : 'text-gray-400'
                          } group-focus-within:text-orange-500`} />
                        </div>
                        <input
                          id="employee_registration_code"
                          name="employee_registration_code"
                          type="text"
                          value={formState.employee_registration_code || ""}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base bg-white/90 backdrop-blur-sm placeholder-gray-400 ${
                            formErrors.employee_registration_code ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                          } focus:bg-white shadow-sm hover:shadow-md focus:shadow-lg`}
                          placeholder="Enter employee registration code"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                      </div>
                      {formErrors.employee_registration_code && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {formErrors.employee_registration_code}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <FaLock className={`h-5 w-5 transition-colors duration-200 ${
                          formState.password ? 'text-orange-500' : 'text-gray-400'
                        } group-focus-within:text-orange-500`} />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formState.password}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base bg-white/90 backdrop-blur-sm placeholder-gray-400 ${
                          formErrors.password ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                        } focus:bg-white shadow-sm hover:shadow-md focus:shadow-lg`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 hover:scale-110 transition-transform duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formState.password && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Password strength:</span>
                          <span className={`font-medium transition-colors duration-200 ${
                            passwordStrength.strength >= 75 ? 'text-green-600' :
                            passwordStrength.strength >= 50 ? 'text-blue-600' :
                            passwordStrength.strength >= 25 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {passwordStrength.text}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.strength}%` }}
                            className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.color}`}
                          />
                        </div>
                      </motion.div>
                    )}
                    
                    {formErrors.password && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {formErrors.password}
                      </motion.p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="password2" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <FaLock className={`h-5 w-5 transition-colors duration-200 ${
                          formState.password2 ? 'text-orange-500' : 'text-gray-400'
                        } group-focus-within:text-orange-500`} />
                      </div>
                      <input
                        id="password2"
                        name="password2"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formState.password2}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base bg-white/90 backdrop-blur-sm placeholder-gray-400 ${
                          formErrors.password2 ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                        } focus:bg-white shadow-sm hover:shadow-md focus:shadow-lg`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 hover:scale-110 transition-transform duration-200"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                    {formErrors.password2 && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {formErrors.password2}
                      </motion.p>
                    )}
                  </div>

                  {/* Create Account Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-4 rounded-xl font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2 relative z-10" />
                        <span className="relative z-10">Creating Account...</span>
                      </>
                    ) : (
                      <span className="relative z-10">Create Account</span>
                    )}
                  </motion.button>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                    </div>
                  </div>

                  {/* Sign In Link */}
                  <Link
                    href="/login"
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 py-4 rounded-xl font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center"
                  >
                    Sign In Instead
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
              <span>Your personal information is secure and encrypted</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
