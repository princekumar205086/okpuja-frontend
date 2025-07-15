"use client";

import React, { useState } from 'react';
import { usePaymentStore } from '../../stores/paymentStore';
import { toast } from 'react-hot-toast';

const TestPaymentPage: React.FC = () => {
  const { checkBookingStatus, simulatePaymentSuccess } = usePaymentStore();
  const [paymentId, setPaymentId] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const handleTestPayment = async () => {
    if (!paymentId || isNaN(parseInt(paymentId))) {
      toast.error('Please enter a valid payment ID');
      return;
    }

    setLoading(true);
    try {
      const result = await checkBookingStatus(parseInt(paymentId));
      setResults(result);
      
      if (result) {
        toast.success('Payment status fetched successfully');
        
        // Show helpful status message
        if (result.payment_status === 'PENDING') {
          toast.success('Payment is still PENDING - you can simulate success for testing', {
            duration: 4000,
          });
        } else if (result.payment_status === 'SUCCESS' && result.booking_created) {
          toast.success('Payment successful and booking created!');
        }
      } else {
        toast.error('Failed to fetch payment status');
        setResults({ error: 'Failed to fetch payment status' });
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      toast.error('Failed to check payment status');
      setResults({ error: 'Failed to fetch payment status' });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateSuccess = async () => {
    if (!paymentId || isNaN(parseInt(paymentId))) {
      toast.error('Please enter a valid payment ID');
      return;
    }

    setSimulating(true);
    try {
      const result = await simulatePaymentSuccess(parseInt(paymentId));
      
      if (result) {
        toast.success('Payment simulation successful!');
        
        // Refresh the payment status
        setTimeout(() => {
          handleTestPayment();
        }, 1000);
        
        console.log('Simulation result:', result);
      } else {
        toast.error('Failed to simulate payment success');
      }
    } catch (error) {
      console.error('Error simulating payment:', error);
      toast.error('Failed to simulate payment success');
    } finally {
      setSimulating(false);
    }
  };

  const handleManualStatusUpdate = async () => {
    if (!paymentId || isNaN(parseInt(paymentId))) {
      toast.error('Please enter a valid payment ID');
      return;
    }

    try {
      // This would normally be done by PhonePe webhook
      // For testing, you can manually call your backend to update status
      toast.success('For manual testing: You need to manually update payment status in Django admin or database');
      toast.success(`Payment ID: ${paymentId} - Change status from PENDING to SUCCESS`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Debug Tool</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment ID
              </label>
              <input
                type="number"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter Payment ID (e.g., 1, 2, 3...)"
              />
            </div>

            <div className="flex space-x-4 flex-wrap gap-2">
              <button
                onClick={handleTestPayment}
                disabled={loading}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Check Payment Status'}
              </button>
              
              <button
                onClick={handleSimulateSuccess}
                disabled={simulating || !paymentId}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {simulating ? 'Simulating...' : 'Simulate Success (Test)'}
              </button>
              
              <button
                onClick={handleManualStatusUpdate}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Manual Update Instructions
              </button>
            </div>

            {results && (
              <div className="mt-8 p-6 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Payment Status Results:</h3>
                <pre className="text-sm bg-white p-4 rounded border overflow-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
                
                {results.payment_status && (
                  <div className="mt-4 space-y-2">
                    <p><strong>Payment Status:</strong> <span className={`px-2 py-1 rounded text-sm ${
                      results.payment_status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                      results.payment_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{results.payment_status}</span></p>
                    <p><strong>Booking Created:</strong> <span className={`px-2 py-1 rounded text-sm ${
                      results.booking_created ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>{results.booking_created ? 'Yes' : 'No'}</span></p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
                <li>Create a test payment by going through the normal checkout flow</li>
                <li>Note the payment ID from the URL or network tab</li>
                <li>Enter the payment ID above and click "Check Payment Status"</li>
                <li>If status is PENDING, click "Simulate Success (Test)" to test the complete flow</li>
                <li>This simulates what PhonePe webhook should do automatically</li>
                <li>Check again to see if booking gets created automatically</li>
                <li>If simulation works, the issue is with PhonePe webhook configuration</li>
              </ol>
            </div>

            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Backend Test Results:</h3>
              <p className="text-sm text-green-700 mb-2">
                Your backend test script shows the complete flow works perfectly:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                <li>✅ Cart creation working</li>
                <li>✅ Payment initiation working</li>
                <li>✅ Payment simulation working</li>
                <li>✅ Booking creation working</li>
                <li>✅ Email notifications working</li>
                <li>✅ Payment-booking linking working</li>
              </ul>
              <p className="text-sm text-green-700 mt-2">
                <strong>Conclusion:</strong> The issue is only with PhonePe webhook not calling your backend in the browser environment.
              </p>
            </div>

            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">PhonePe Webhook Issue:</h3>
              <p className="text-sm text-blue-700 mb-2">
                The most likely cause of payments staying PENDING is that PhonePe sandbox webhook is not properly configured or not being called.
              </p>
              <p className="text-sm text-blue-700 mb-2">
                <strong>Solutions:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                <li>Check your Django backend webhook endpoint is accessible</li>
                <li>Verify PhonePe merchant configuration has correct webhook URL</li>
                <li>Test with ngrok if developing locally</li>
                <li>Check Django backend logs for webhook calls</li>
                <li>Ensure webhook endpoint handles PhonePe callback properly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPaymentPage;
