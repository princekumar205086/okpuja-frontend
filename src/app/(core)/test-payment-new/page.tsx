"use client";
import React, { useState } from 'react';
import { usePaymentStore } from '../../stores/paymentStore';
import { useCartStore } from '../../stores/cartStore';
import { toast } from 'react-hot-toast';

const TestPaymentNew = () => {
  const { processCartPayment, checkPaymentStatus, checkCartPaymentStatus } = usePaymentStore();
  const { items: cartItems, fetchCartItems } = useCartStore();
  type TestResults = {
    payment_creation?: any;
    payment_status?: any;
    cart_status?: any;
  };

  const [testResults, setTestResults] = useState<TestResults>({});
  const [loading, setLoading] = useState(false);

  const handleTestCartPayment = async () => {
    if (cartItems.length === 0) {
      toast.error('Please add items to cart first');
      return;
    }

    setLoading(true);
    try {
      const firstCartItem = cartItems[0];
      console.log('Testing payment with cart_id:', firstCartItem.cart_id);
      
      const result = await processCartPayment({
        cart_id: firstCartItem.cart_id
      });
      
      console.log('Payment result:', result);
    setTestResults((prev: TestResults) => ({
      ...prev,
      payment_creation: result
    }));


      
      if (result?.success) {
        toast.success('Payment order created successfully!');
      } else {
        toast.error('Payment creation failed');
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Test failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestPaymentStatus = async () => {
    const merchantOrderId = testResults.payment_creation?.data?.payment_order?.merchant_order_id;
    if (!merchantOrderId) {
      toast.error('No merchant order ID available. Create payment first.');
      return;
    }

    setLoading(true);
    try {
      const result = await checkPaymentStatus(merchantOrderId);
      console.log('Payment status result:', result);
      setTestResults(prev => ({
        ...prev,
        payment_status: result
      }));
      
      if (result) {
        toast.success('Payment status retrieved successfully!');
      } else {
        toast.error('Failed to get payment status');
      }
    } catch (error) {
      console.error('Status check error:', error);
      toast.error('Status check failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestCartStatus = async () => {
    if (cartItems.length === 0) {
      toast.error('Please add items to cart first');
      return;
    }

    setLoading(true);
    try {
      const firstCartItem = cartItems[0];
      const result = await checkCartPaymentStatus(firstCartItem.cart_id);
      console.log('Cart payment status result:', result);
      setTestResults(prev => ({
        ...prev,
        cart_status: result
      }));
      
      if (result) {
        toast.success('Cart payment status retrieved successfully!');
      } else {
        toast.error('Failed to get cart payment status');
      }
    } catch (error) {
      console.error('Cart status check error:', error);
      toast.error('Cart status check failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCart = async () => {
    setLoading(true);
    try {
      await fetchCartItems();
      toast.success('Cart refreshed');
    } catch (error) {
      console.error('Cart refresh error:', error);
      toast.error('Failed to refresh cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment API Test - New Endpoints</h1>
        
        {/* Cart Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cart Information</h2>
          <p className="mb-2">Cart Items: {cartItems.length}</p>
          {cartItems.length > 0 && (
            <div className="text-sm text-gray-600">
              <p>First Cart ID: {cartItems[0].cart_id}</p>
              <p>Service: {cartItems[0].puja_service?.title || cartItems[0].astrology_service?.title}</p>
            </div>
          )}
          <button
            onClick={handleRefreshCart}
            disabled={loading}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Refresh Cart
          </button>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          <div className="space-y-4">
            <button
              onClick={handleTestCartPayment}
              disabled={loading || cartItems.length === 0}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded disabled:opacity-50"
            >
              1. Test Cart Payment Creation (POST /payments/cart/)
            </button>
            
            <button
              onClick={handleTestPaymentStatus}
              disabled={loading || !testResults.payment_creation}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded disabled:opacity-50"
            >
              2. Test Payment Status Check (GET /payments/status/{testResults.payment_creation?.data?.payment_order?.merchant_order_id || 'merchant_order_id'}/)
            </button>
            
            <button
              onClick={handleTestCartStatus}
              disabled={loading || cartItems.length === 0}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded disabled:opacity-50"
            >
              3. Test Cart Payment Status (GET /payments/cart/status/{cartItems[0]?.cart_id || 'cart_id'}/)
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestPaymentNew;
