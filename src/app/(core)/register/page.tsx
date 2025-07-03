"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

export default function SignupForm() {
  // Form state management
  const initialFormState = {
    username: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  };
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  // Focused input tracking for flyout labels
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // UI state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [formProgress, setFormProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update form progress
  useEffect(() => {
    let progress = 0;
    const fields = Object.keys(formState);
    fields.forEach((field) => {
      if (formState[field as keyof typeof formState]) {
        progress += 100 / fields.length;
      }
    });
    setFormProgress(progress);
  }, [formState]);

  // Password visibility toggles
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Handle input focus for flyout labels
  const handleFocus = (name: string) => {
    setFocusedInput(name);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  // Check if an input should show as "active" for the flyout label
  const isInputActive = (name: string) => {
    return focusedInput === name || !!formState[name as keyof typeof formState];
  };

  // Form validation
  const validateForm = () => {
    let valid = true;
    const errors = {
      username: "",
      email: "",
      contact: "",
      password: "",
      confirmPassword: "",
    };

    if (!formState.username || !/^[a-z0-9]{3,50}$/i.test(formState.username)) {
      valid = false;
      errors.username = "Username must be 3-50 characters and alphanumeric";
    }

    if (!formState.email || !/\S+@\S+\.\S+/.test(formState.email)) {
      valid = false;
      errors.email = "Valid email is required";
    }

    if (!formState.contact || !/^\d{10}$/.test(formState.contact)) {
      valid = false;
      errors.contact = "10 digit contact number is required";
    }

    if (
      !formState.password ||
      !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(
        formState.password
      )
    ) {
      valid = false;
      errors.password =
        "Password must be at least 8 characters with uppercase letter, number, and special character";
    }

    if (formState.password !== formState.confirmPassword) {
      valid = false;
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);
    return valid;
  };

  // Form submission handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the form errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/signup", formState);
      if (response.data.success) {
        setFormState(initialFormState);
        toast.success("Signup successful! Verification email has been sent.", {
          duration: 5000,
          icon: "🎉",
        });
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (error) {
      const err = error as { response?: { status?: number; data?: { error?: string } } };
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data?.error === "User already exists"
      ) {
        toast.error(
          "This email is already registered. Please use a different email."
        );
      } else {
        toast.error(
          `Registration error: ${(error as Error).message || "Unknown error occurred"}`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input change handler
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "", color: "bg-gray-200" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*]/.test(password)) strength += 1;

    const strengthMap = [
      { text: "Weak", color: "bg-red-500" },
      { text: "Fair", color: "bg-yellow-500" },
      { text: "Good", color: "bg-blue-500" },
      { text: "Strong", color: "bg-green-500" },
    ];

    return {
      strength: strength,
      text: strengthMap[strength - 1]?.text || "Weak",
      color: strengthMap[strength - 1]?.color || "bg-red-500",
    };
  };

  const passwordStrength = getPasswordStrength(formState.password);

  // Brand color theme - matched to logo
  const brandOrange = {
    light: "from-orange-400 to-orange-500",
    main: "from-orange-500 to-orange-600",
    dark: "from-orange-600 to-orange-700",
    border: "border-orange-500",
    text: "text-orange-500",
    bg: "bg-orange-500",
    hover: "hover:text-orange-500",
    focus: "focus:ring-orange-400",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 relative">
        {/* Floating decoration elements */}
        <div className="hidden lg:block absolute -top-10 -left-10 w-40 h-40 bg-orange-100 rounded-full opacity-70"></div>
        <div className="hidden lg:block absolute -bottom-10 -right-10 w-32 h-32 bg-orange-200 rounded-full opacity-70"></div>

        {/* Left side - brand panel */}
        <div className="relative hidden md:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("https://img.freepik.com/premium-photo/dussehra-festival-celebration-indian-hindu-religion-concept_947027-1194.jpg?w=1380")`,
            }}
          ></div>

          {/* Dark overlay with brand color matching */}
          <div className="absolute inset-0 bg-gradient-to-b from-orange-600/95 via-blue-700/90 to-orange-800/95"></div>

          {/* Pattern overlay */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-pattern opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <div className="relative h-full flex flex-col items-center justify-center z-10 p-8 lg:p-12">
            {/* Logo container */}
            <div className="mb-6 lg:mb-12 bg-white p-4 rounded-xl backdrop-blur-sm shadow-lg border border-white/20">
              <div className="flex items-center justify-center">
                <Image
                  alt="OKPUJA Logo"
                  src="/image/okpuja logo.png"
                  width={200}
                  height={110}
                  className="logo-image object-contain filter drop-shadow-lg"
                  priority
                />
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white text-center mb-6 lg:mb-8 drop-shadow-md">
              Welcome to{" "}
              <span className="text-orange-200">OKPUJA Team, Join Us</span>
            </h1>

            <div className="text-center mb-8 lg:mb-12 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/20">
              <p className="text-orange-50 text-lg lg:text-xl mb-2 drop-shadow-sm">
                Already have an account?
              </p>
              <p className="text-white/90 text-base lg:text-lg mb-8">
                Sign in to continue your spiritual journey
              </p>

              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold rounded-full border-2 border-white text-white transition-all duration-300 ease-out hover:bg-white hover:text-orange-500 shadow-md"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="flex items-center">
                  Sign In{" "}
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            <div className="mt-auto">
              <div className="flex items-center space-x-4 text-orange-100 justify-center bg-white/10 py-3 px-5 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl">1000+</span>
                  <span className="text-xs text-orange-200">Users</span>
                </div>
                <div className="h-8 w-px bg-orange-300/30"></div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl">24/7</span>
                  <span className="text-xs text-orange-200">Support</span>
                </div>
                <div className="h-8 w-px bg-orange-300/30"></div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl">100%</span>
                  <span className="text-xs text-orange-200">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form side */}
        <div className="p-6 sm:p-8 md:p-10 bg-gradient-to-br from-orange-50/80 to-white">
          <div className="flex flex-col h-full">
            {/* Mobile view logo */}
            <div className="md:hidden flex items-center justify-center mb-6">
              <div className="bg-gradient-to-b from-orange-100 to-orange-50 p-3 rounded-xl shadow-md border border-orange-200">
                <Image
                  alt="OKPUJA Logo"
                  src="/image/okpuja logo.png"
                  width={150}
                  height={80}
                  className="logo-image object-contain"
                  priority
                />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-800">
                Create your account
              </h2>
              <p className="text-gray-600 mt-2">
                Enter your details to get started
              </p>

              {/* Registration progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
                <div
                  className={`bg-gradient-to-r ${brandOrange.main} h-1.5 rounded-full transition-all duration-300 ease-out`}
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Mobile login link */}
            <div className="md:hidden text-center mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Already have an account?
              </p>
              <Link
                href="/login"
                className={`px-6 py-2.5 rounded-lg bg-gradient-to-r ${brandOrange.main} text-white inline-flex items-center justify-center font-medium hover:${brandOrange.dark} transition-colors shadow-md`}
              >
                Sign In <FaArrowRight className="ml-2 text-sm" />
              </Link>
            </div>

            {/* Registration form with improved flyout labels */}
            <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
              <div className="space-y-6">
                {/* Username field with improved flyout label */}
                <div className="relative">
                  {/* Label positioned properly above the input */}
                  <label
                    htmlFor="username"
                    className={`absolute text-sm font-medium transition-all duration-300 ${
                      isInputActive("username")
                        ? "-top-6 left-0 text-orange-500"
                        : "left-10 top-1/2 -translate-y-1/2 text-gray-500"
                    }`}
                  >
                    Username
                  </label>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaUser
                        className={
                          isInputActive("username") ? "text-orange-500" : ""
                        }
                      />
                    </div>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={formState.username}
                      onChange={handleChange}
                      onFocus={() => handleFocus("username")}
                      onBlur={handleBlur}
                      className={`w-full py-3 px-10 rounded-lg border ${
                        errors.username ? "border-red-300" : "border-gray-300"
                      } text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                      placeholder={
                        isInputActive("username") ? "Enter your username" : ""
                      }
                      required
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-start">
                      <span className="inline-block mr-1 mt-0.5">⚠</span>{" "}
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email field with improved flyout label */}
                <div className="relative">
                  <label
                    htmlFor="email"
                    className={`absolute text-sm font-medium transition-all duration-300 ${
                      isInputActive("email")
                        ? "-top-6 left-0 text-orange-500"
                        : "left-10 top-1/2 -translate-y-1/2 text-gray-500"
                    }`}
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaEnvelope
                        className={
                          isInputActive("email") ? "text-orange-500" : ""
                        }
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formState.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus("email")}
                      onBlur={handleBlur}
                      className={`w-full py-3 px-10 rounded-lg border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                      placeholder={
                        isInputActive("email") ? "Enter your email address" : ""
                      }
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-start">
                      <span className="inline-block mr-1 mt-0.5">⚠</span>{" "}
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Contact field with improved flyout label */}
                <div className="relative">
                  <label
                    htmlFor="contact"
                    className={`absolute text-sm font-medium transition-all duration-300 ${
                      isInputActive("contact")
                        ? "-top-6 left-0 text-orange-500"
                        : "left-10 top-1/2 -translate-y-1/2 text-gray-500"
                    }`}
                  >
                    Contact Number
                  </label>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaPhone
                        className={
                          isInputActive("contact") ? "text-orange-500" : ""
                        }
                      />
                    </div>
                    <input
                      type="tel"
                      name="contact"
                      id="contact"
                      value={formState.contact}
                      onChange={handleChange}
                      onFocus={() => handleFocus("contact")}
                      onBlur={handleBlur}
                      className={`w-full py-3 px-10 rounded-lg border ${
                        errors.contact ? "border-red-300" : "border-gray-300"
                      } text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                      placeholder={
                        isInputActive("contact")
                          ? "Enter your 10-digit number"
                          : ""
                      }
                      required
                    />
                  </div>
                  {errors.contact && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-start">
                      <span className="inline-block mr-1 mt-0.5">⚠</span>{" "}
                      {errors.contact}
                    </p>
                  )}
                </div>

                {/* Password field with improved flyout label */}
                <div className="relative">
                  <label
                    htmlFor="password"
                    className={`absolute text-sm font-medium transition-all duration-300 ${
                      isInputActive("password")
                        ? "-top-6 left-0 text-orange-500"
                        : "left-10 top-1/2 -translate-y-1/2 text-gray-500"
                    }`}
                  >
                    Password
                  </label>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaLock
                        className={
                          isInputActive("password") ? "text-orange-500" : ""
                        }
                      />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={formState.password}
                      onChange={handleChange}
                      onFocus={() => handleFocus("password")}
                      onBlur={handleBlur}
                      className={`w-full py-3 px-10 pr-10 rounded-lg border ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      } text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                      placeholder={
                        isInputActive("password")
                          ? "Create a strong password"
                          : ""
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {formState.password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">
                          Password strength:
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.text === "Strong"
                              ? "text-green-600"
                              : passwordStrength.text === "Good"
                              ? "text-blue-600"
                              : passwordStrength.text === "Fair"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                        {[1, 2, 3, 4].map((segment) => (
                          <div
                            key={segment}
                            className={`h-full flex-grow ${
                              segment <= passwordStrength.strength
                                ? passwordStrength.color
                                : "bg-gray-100"
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-start">
                      <span className="inline-block mr-1 mt-0.5">⚠</span>{" "}
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password field with improved flyout label */}
                <div className="relative">
                  <label
                    htmlFor="confirmPassword"
                    className={`absolute text-sm font-medium transition-all duration-300 ${
                      isInputActive("confirmPassword")
                        ? "-top-6 left-0 text-orange-500"
                        : "left-10 top-1/2 -translate-y-1/2 text-gray-500"
                    }`}
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaLock
                        className={
                          isInputActive("confirmPassword")
                            ? "text-orange-500"
                            : ""
                        }
                      />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formState.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => handleFocus("confirmPassword")}
                      onBlur={handleBlur}
                      className={`w-full py-3 px-10 pr-10 rounded-lg border ${
                        errors.confirmPassword
                          ? "border-red-300"
                          : "border-gray-300"
                      } text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                      placeholder={
                        isInputActive("confirmPassword")
                          ? "Confirm your password"
                          : ""
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleShowConfirmPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-start">
                      <span className="inline-block mr-1 mt-0.5">⚠</span>{" "}
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg bg-gradient-to-r ${
                  brandOrange.main
                } text-white font-medium shadow-md hover:from-orange-600 hover:to-orange-700 transition-all duration-300 ease-out ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
