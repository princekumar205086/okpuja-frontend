"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { usePaymentStore } from '../../../stores/paymentStore';

const PaymentRedirectPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkPaymentStatus } = usePaymentStore();
  
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'SUCCESS' | 'FAILED' | 'PENDING' | null>(null);

  useEffect(() => {
    const handlePaymentRedirect = async () => {
      try {
        // Get payment details from URL params
        const paymentId = searchParams.get('payment_id');
        const transactionId = searchParams.get('transaction_id');
        const merchantTransactionId = searchParams.get('merchant_transaction_id');
        const status = searchParams.get('status');

        console.log('Payment redirect received:', { paymentId, transactionId, merchantTransactionId, status });

        // If status is provided directly in URL (from PhonePe)
        if (status) {
          if (status === 'SUCCESS' || status === 'PAYMENT_SUCCESS') {
            setPaymentStatus('SUCCESS');
            setTimeout(() => {
              router.push(`/confirmbooking?payment_id=${paymentId}&transaction_id=${transactionId}`);
            }, 2000);
            return;
          } else if (status === 'FAILED' || status === 'PAYMENT_FAILED') {
            setPaymentStatus('FAILED');
            setTimeout(() => {
              router.push(`/failedbooking?payment_id=${paymentId}&transaction_id=${transactionId}&status=${status}`);
            }, 2000);
            return;
          }
        }

        if (paymentId) {
          // Check payment status from backend
          const payment = await checkPaymentStatus(parseInt(paymentId));
          
          if (payment) {
            // Map backend status to allowed values
            let mappedStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
            switch (payment.status) {
              case 'SUCCESS':
                mappedStatus = 'SUCCESS';
                break;
              case 'FAILED':
                mappedStatus = 'FAILED';
                break;
              case 'PENDING':
                mappedStatus = 'PENDING';
                break;
              default:
                mappedStatus = 'FAILED';
                break;
            }
            setPaymentStatus(mappedStatus);

            // Redirect based on payment status
            setTimeout(() => {
              if (mappedStatus === 'SUCCESS') {
                router.push(`/confirmbooking?payment_id=${paymentId}&transaction_id=${transactionId}`);
              } else {
                router.push(`/failedbooking?payment_id=${paymentId}&transaction_id=${transactionId}&status=${payment.status}`);
              }
            }, 2000);
          } else {
            // If no payment found, treat as failed
            setPaymentStatus('FAILED');
            setTimeout(() => {
              router.push(`/failedbooking?transaction_id=${transactionId}&status=PAYMENT_NOT_FOUND`);
            }, 2000);
          }
        } else {
          // No payment ID, redirect to failed booking
          setPaymentStatus('FAILED');
          setTimeout(() => {
            router.push('/failedbooking?status=INVALID_REDIRECT');
          }, 2000);
        }
      } catch (error) {
        console.error('Payment redirect error:', error);
        setPaymentStatus('FAILED');
        setTimeout(() => {
          router.push('/failedbooking?status=REDIRECT_ERROR');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    handlePaymentRedirect();
  }, [searchParams, checkPaymentStatus, router]);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'SUCCESS':
        return <FaCheckCircle className="text-green-500 text-6xl" />;
      case 'FAILED':
        return <FaTimesCircle className="text-red-500 text-6xl" />;
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner className="text-orange-500 text-6xl" />
          </motion.div>
        );
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'SUCCESS':
        return {
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully. Redirecting to confirmation page...',
          color: 'text-green-600'
        };
      case 'FAILED':
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Redirecting to failure page...',
          color: 'text-red-600'
        };
      default:
        return {
          title: 'Processing Payment...',
          message: 'Please wait while we confirm your payment status.',
          color: 'text-orange-600'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center"
      >
        <div className="mb-6">
          {getStatusIcon()}
        </div>
        
        <h1 className={`text-2xl font-bold mb-4 ${statusInfo.color}`}>
          {statusInfo.title}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {statusInfo.message}
        </p>
        
        {loading && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <FaSpinner className="animate-spin" />
            <span>Confirming payment status...</span>
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-4">
          You will be redirected automatically in a few seconds.
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentRedirectPage;
