"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  FaIdCard
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
      
      toast.success("Registration successful! Please check your email for verification.", {
        duration: 5000,
      });
      
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push("/login");
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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex">
        {/* Left Side - Brand Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-32 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-bounce"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Join the<br />
                <span className="text-amber-200">OkPuja Family</span>
              </h1>
              <p className="text-xl text-orange-100 mb-8 leading-relaxed max-w-md">
                Create your account and embark on a spiritual journey with thousands of satisfied users worldwide.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-orange-100">
                  <FaCheckCircle className="text-amber-200 text-xl" />
                  <span className="text-lg font-medium">Expert Spiritual Guidance</span>
                </div>
                <div className="flex items-center gap-4 text-orange-100">
                  <FaCheckCircle className="text-amber-200 text-xl" />
                  <span className="text-lg font-medium">Personalized Consultations</span>
                </div>
                <div className="flex items-center gap-4 text-orange-100">
                  <FaCheckCircle className="text-amber-200 text-xl" />
                  <span className="text-lg font-medium">24/7 Support Available</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Mobile Brand Header */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">OkPuja</h1>
              <p className="text-gray-600">Start your spiritual journey today</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600 text-base">Choose your account type to get started</p>
              </div>

              {/* Role Toggle */}
              <div className="mb-8">
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("USER")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      activeTab === "USER"
                        ? "bg-white text-orange-600 shadow-md"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <FaUser className="h-4 w-4" />
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("EMPLOYEE")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      activeTab === "EMPLOYEE"
                        ? "bg-white text-orange-600 shadow-md"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <FaUserTie className="h-4 w-4" />
                    Employee
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
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
                      autoComplete="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 ${
                        formErrors.email 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-orange-500 hover:border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <span className="text-xs">⚠</span>
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formState.phone}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 ${
                        formErrors.phone 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-orange-500 hover:border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <span className="text-xs">⚠</span>
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Employee Registration Code (Only for Employee) */}
                {activeTab === "EMPLOYEE" && (
                  <div className="space-y-2">
                    <label htmlFor="employee_registration_code" className="block text-sm font-semibold text-gray-700">
                      Employee Registration Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaIdCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="employee_registration_code"
                        name="employee_registration_code"
                        type="text"
                        value={formState.employee_registration_code || ""}
                        onChange={handleInputChange}
                        className={`block w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 ${
                          formErrors.employee_registration_code 
                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                            : 'border-gray-200 focus:border-orange-500 hover:border-gray-300'
                        }`}
                        placeholder="Enter employee registration code"
                      />
                    </div>
                    {formErrors.employee_registration_code && (
                      <p className="text-sm text-red-600 flex items-center gap-2">
                        <span className="text-xs">⚠</span>
                        {formErrors.employee_registration_code}
                      </p>
                    )}
                  </div>
                )}

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
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
                      autoComplete="new-password"
                      value={formState.password}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-12 py-4 text-base border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 ${
                        formErrors.password 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-orange-500 hover:border-gray-300'
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Password Strength Indicator */}
                  {formState.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Password strength:</span>
                        <span className={`font-medium ${passwordStrength.strength >= 75 ? 'text-green-600' : passwordStrength.strength >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {formErrors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <span className="text-xs">⚠</span>
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password2" className="block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password2"
                      name="password2"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formState.password2}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-12 py-4 text-base border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 ${
                        formErrors.password2 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-orange-500 hover:border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formErrors.password2 && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <span className="text-xs">⚠</span>
                      {formErrors.password2}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-base hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.01] flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin h-5 w-5" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create {activeTab === "USER" ? "User" : "Employee"} Account</span>
                      <FaArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <FaShieldAlt className="text-green-500 h-4 w-4" />
              <span>Your data is protected with industry-standard encryption</span>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
