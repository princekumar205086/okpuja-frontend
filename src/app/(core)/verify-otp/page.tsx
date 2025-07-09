
"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { 
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaShieldAlt,
  FaRedo,
  FaEnvelope
} from "react-icons/fa";
import apiClient from "../../apiService/globalApiconfig";
import { useAuthStore } from "../../stores/authStore";

function VerifyOTPClient() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { login } = useAuthStore();
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push('/register');
    }
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (pastedNumbers.length === 6) {
      const newOtp = pastedNumbers.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/otp/verify/', {
        email,
        otp: otpValue,
      });

      if (response.data.success || response.status === 200) {
        toast.success('Email verified successfully!');
        
        // Auto-login after successful verification
        const tempPassword = localStorage.getItem('temp_password');
        if (tempPassword && email) {
          localStorage.removeItem('temp_password');
          const loginSuccess = await login(email, tempPassword);
          
          if (loginSuccess) {
            toast.success('Welcome to OkPuja!');
            router.push('/user/dashboard');
          } else {
            // If auto-login fails, redirect to login page
            router.push('/login?verified=true');
          }
        } else {
          router.push('/login?verified=true');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.detail || 
                          'Invalid verification code. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !email) return;
    
    setResendLoading(true);
    try {
      await apiClient.post('/auth/otp/request/', {
        email,
        via: 'email'
      });
      
      toast.success('New verification code sent to your email');
      setResendTimer(60);
      setCanResend(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          'Failed to resend code. Please try again.';
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

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
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <FaShieldAlt className="text-6xl mb-6 text-white/90" />
                <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Verify Your Email
                </h1>
                <p className="text-xl text-white/90 leading-relaxed mb-8">
                  We&apos;ve sent a 6-digit verification code to your email address. 
                  Enter the code below to complete your registration.
                </p>
              </div>
              
              <div className="space-y-4 text-white/80">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-lg" />
                  <span>Secure email verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-lg" />
                  <span>Account protection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-lg" />
                  <span>Instant access after verification</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Verification Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Back Button */}
            <Link
              href="/register"
              className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200 mb-8 group"
            >
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Registration
            </Link>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Enter Verification Code
              </h2>
              <p className="text-gray-600">
                We sent a 6-digit code to
              </p>
              <p className="text-orange-600 font-medium flex items-center justify-center mt-1">
                <FaEnvelope className="mr-2 text-sm" />
                {email}
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {/* OTP Input Grid */}
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none"
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Email
                    <FaCheckCircle className="ml-2" />
                  </>
                )}
              </button>
            </form>

            {/* Resend OTP */}
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

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Having trouble? Check your spam folder or{' '}
                <Link
                  href="/contact"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  contact support
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense>
      <VerifyOTPClient />
    </Suspense>
  );
}
