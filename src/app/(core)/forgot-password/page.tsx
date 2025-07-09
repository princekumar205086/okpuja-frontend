"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaShieldAlt,
  FaRedo,
  FaEye,
  FaEyeSlash,
  FaKey
} from "react-icons/fa";
import apiClient from "../../apiService/globalApiconfig";

type Step = 'email' | 'otp' | 'password';

interface FormState {
  email: string;
  otp: string[];
  newPassword: string;
  confirmPassword: string;
}

export default function ForgotPassword() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formState, setFormState] = useState<FormState>({
    email: "",
    otp: new Array(6).fill(''),
    newPassword: "",
    confirmPassword: "",
  });

  // Timer for resend OTP
  React.useEffect(() => {
    if (resendTimer > 0 && currentStep === 'otp') {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, currentStep]);

  // Step 1: Send reset email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formState.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/password/reset/', {
        email: formState.email,
      });

      toast.success("Reset code sent to your email!");
      setCurrentStep('otp');
      setResendTimer(60);
      setCanResend(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          "Failed to send reset code. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...formState.otp];
    newOtp[index] = value;
    setFormState(prev => ({ ...prev, otp: newOtp }));

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !formState.otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (pastedNumbers.length === 6) {
      const newOtp = pastedNumbers.split('');
      setFormState(prev => ({ ...prev, otp: newOtp }));
      inputRefs.current[5]?.focus();
    }
  };

  // Step 2: Just validate OTP locally and move to password step (don't consume OTP)
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = formState.otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    toast.success('Code entered! Now set your new password.');
    setCurrentStep('password');
  };

  // Step 3: Reset password (OTP verification happens here)
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (formState.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/password/reset/confirm/', {
        email: formState.email,
        otp: formState.otp.join(''),
        new_password: formState.newPassword,
      });

      toast.success('Password reset successful! You can now login with your new password.');
      
      setTimeout(() => {
        router.push('/login?reset=success');
      }, 2000);
    } catch (error: any) {
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (detail.toLowerCase().includes('invalid') || detail.toLowerCase().includes('expired')) {
          errorMessage = 'The verification code is invalid or expired. Please request a new code.';
          // Go back to OTP step
          setCurrentStep('otp');
          // Reset OTP fields
          setFormState(prev => ({ ...prev, otp: new Array(6).fill('') }));
          // Enable resend immediately
          setCanResend(true);
          setResendTimer(0);
        } else {
          errorMessage = detail;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP for password reset
  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setResendLoading(true);
    try {
      // Use the password reset endpoint to resend the OTP
      await apiClient.post('/auth/password/reset/', {
        email: formState.email,
      });
      
      toast.success('New reset code sent to your email');
      setResendTimer(60);
      setCanResend(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to resend code. Please try again.';
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const renderEmailStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Reset Your Password
        </h2>
        <p className="text-gray-600">
          Enter your email address and we&apos;ll send you a verification code
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={formState.email}
              onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="Enter your email address"
              autoComplete="email"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Sending Code...
            </>
          ) : (
            <>
              Send Reset Code
              <FaEnvelope className="ml-2" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );

  const renderOtpStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Enter Verification Code
        </h2>
        <p className="text-gray-600 mb-2">
          We sent a 6-digit code to
        </p>
        <p className="text-orange-600 font-medium flex items-center justify-center">
          <FaEnvelope className="mr-2 text-sm" />
          {formState.email}
        </p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="flex justify-center space-x-3">
          {formState.otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={index === 0 ? handleOtpPaste : undefined}
              className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || formState.otp.join('').length !== 6}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Verifying...
            </>
          ) : (
            <>
              Verify Code
              <FaCheckCircle className="ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-2">Didn&apos;t receive the code?</p>
        {canResend ? (
          <button
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center disabled:opacity-50"
          >
            {resendLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <FaRedo className="mr-2" />
                Resend Code
              </>
            )}
          </button>
        ) : (
          <p className="text-gray-500">
            Resend code in {resendTimer}s
          </p>
        )}
      </div>
    </motion.div>
  );

  const renderPasswordStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Set New Password
        </h2>
        <p className="text-gray-600">
          Create a strong password for your account
        </p>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={formState.newPassword}
              onChange={(e) => setFormState(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="Enter new password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formState.confirmPassword}
              onChange={(e) => setFormState(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Resetting Password...
            </>
          ) : (
            <>
              Reset Password
              <FaKey className="ml-2" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );

  const getStepContent = () => {
    switch (currentStep) {
      case 'email':
        return renderEmailStep();
      case 'otp':
        return renderOtpStep();
      case 'password':
        return renderPasswordStep();
      default:
        return renderEmailStep();
    }
  };

  const getLeftSideContent = () => {
    switch (currentStep) {
      case 'email':
        return {
          icon: <FaEnvelope className="text-6xl mb-6 text-white/90" />,
          title: "Reset Your Password",
          description: "Don't worry, it happens to the best of us. Enter your email address and we'll help you reset your password securely."
        };
      case 'otp':
        return {
          icon: <FaShieldAlt className="text-6xl mb-6 text-white/90" />,
          title: "Verify Your Identity",
          description: "We've sent a secure verification code to your email. This extra step ensures your account stays protected."
        };
      case 'password':
        return {
          icon: <FaKey className="text-6xl mb-6 text-white/90" />,
          title: "Create New Password",
          description: "Choose a strong password that you'll remember. Your account security is our top priority."
        };
      default:
        return {
          icon: <FaEnvelope className="text-6xl mb-6 text-white/90" />,
          title: "Reset Your Password",
          description: "Don't worry, it happens to the best of us. Enter your email address and we'll help you reset your password securely."
        };
    }
  };

  const leftContent = getLeftSideContent();

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: '',
          style: {
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
          {/* Geometric Pattern Background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="geometric" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <circle cx="75" cy="75" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#geometric)"/>
            </svg>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-32 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-bounce"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                {leftContent.icon}
                <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  {leftContent.title}
                </h1>
                <p className="text-xl text-white/90 leading-relaxed mb-8">
                  {leftContent.description}
                </p>
              </div>
              
              <div className="space-y-4 text-white/80">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-lg" />
                  <span>Secure password recovery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-lg" />
                  <span>Email verification required</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-lg" />
                  <span>Account protection guaranteed</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <Link
              href="/login"
              className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200 mb-8 group"
            >
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Login
            </Link>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'email' ? 'bg-orange-600 text-white' : 
                  currentStep === 'otp' || currentStep === 'password' ? 'bg-green-500 text-white' : 
                  'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`flex-1 h-2 mx-2 rounded ${
                  currentStep === 'otp' || currentStep === 'password' ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'otp' ? 'bg-orange-600 text-white' : 
                  currentStep === 'password' ? 'bg-green-500 text-white' : 
                  'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <div className={`flex-1 h-2 mx-2 rounded ${
                  currentStep === 'password' ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'password' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Email</span>
                <span>Verify</span>
                <span>Reset</span>
              </div>
            </div>

            {/* Form Content */}
            {getStepContent()}
          </div>
        </div>
      </div>
    </>
  );
}
