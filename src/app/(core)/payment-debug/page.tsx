"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

const PaymentDebugPage = () => {
  const searchParams = useSearchParams();
  const [urlParams, setUrlParams] = useState<Record<string, string>>({});
  const [sessionData, setSessionData] = useState<Record<string, string | null>>({});
  const [latestPayment, setLatestPayment] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    // Get all URL parameters
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setUrlParams(params);

    // Get session storage data
    const sessionKeys = ['checkout_session_id', 'payment_id', 'merchant_order_id'];
    const session: Record<string, string | null> = {};
    sessionKeys.forEach(key => {
      session[key] = sessionStorage.getItem(key);
    });
    setSessionData(session);

    // Fetch latest payment
    fetchLatestPayment();
    fetchRecentBookings();
  }, [searchParams]);

  const fetchLatestPayment = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('No access token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/latest/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLatestPayment(data);
      } else {
        console.log('Failed to fetch latest payment:', response.status);
      }
    } catch (error) {
      console.error('Error fetching latest payment:', error);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('No access token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecentBookings(data.results || data || []);
      } else {
        console.log('Failed to fetch bookings:', response.status);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleGoToBooking = (bookId: string) => {
    window.location.href = `/confirmbooking?book_id=${bookId}`;
  };

  const handleGoToLatestBooking = () => {
    if (latestPayment?.booking?.book_id) {
      handleGoToBooking(latestPayment.booking.book_id);
    } else if (recentBookings.length > 0) {
      handleGoToBooking(recentBookings[0].book_id);
    } else {
      toast.error('No booking found');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment Redirect Debug</h1>
        
        {/* Current URL Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current URL Information</h2>
          <div className="space-y-2">
            <p><strong>Full URL:</strong> {window.location.href}</p>
            <p><strong>Search Params:</strong> {window.location.search}</p>
          </div>
        </div>

        {/* URL Parameters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">URL Parameters</h2>
          {Object.keys(urlParams).length === 0 ? (
            <p className="text-gray-500">No URL parameters found</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(urlParams).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="font-medium w-32">{key}:</span>
                  <span className="text-blue-600">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Session Storage */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Storage Data</h2>
          <div className="space-y-2">
            {Object.entries(sessionData).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-medium w-40">{key}:</span>
                <span className={value ? 'text-blue-600' : 'text-gray-400'}>
                  {value || 'null'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Payment */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Latest Payment</h2>
          {latestPayment ? (
            <div className="space-y-2">
              <p><strong>Payment ID:</strong> {latestPayment.id}</p>
              <p><strong>Status:</strong> {latestPayment.status}</p>
              <p><strong>Amount:</strong> ₹{latestPayment.amount}</p>
              <p><strong>Merchant Order ID:</strong> {latestPayment.merchant_order_id}</p>
              <p><strong>Created:</strong> {new Date(latestPayment.created_at).toLocaleString()}</p>
              {latestPayment.booking && (
                <div className="mt-4 p-4 bg-green-50 rounded">
                  <p><strong>Booking ID:</strong> {latestPayment.booking.book_id}</p>
                  <p><strong>Service:</strong> {latestPayment.booking.cart?.puja_service?.title}</p>
                  <p><strong>Date:</strong> {latestPayment.booking.selected_date}</p>
                  <p><strong>Time:</strong> {latestPayment.booking.selected_time}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No payment data found</p>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <p className="text-gray-500">No bookings found</p>
          ) : (
            <div className="space-y-4">
              {recentBookings.slice(0, 3).map((booking, index) => (
                <div key={booking.id} className="p-4 border rounded">
                  <p><strong>Booking ID:</strong> {booking.book_id}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                  <p><strong>Amount:</strong> ₹{booking.total_amount}</p>
                  <p><strong>Service:</strong> {booking.cart?.puja_service?.title}</p>
                  <p><strong>Created:</strong> {new Date(booking.created_at).toLocaleString()}</p>
                  <button
                    onClick={() => handleGoToBooking(booking.book_id)}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    View This Booking
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleGoToLatestBooking}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded"
            >
              Go to Latest Booking
            </button>
            
            <button
              onClick={() => window.location.href = '/cart'}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded ml-4"
            >
              Go to Cart
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded ml-4"
            >
              Go Home
            </button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>• If you see <code>status=completed</code> but no booking ID, the backend redirect handler might not be working properly</p>
            <p>• The backend should redirect to: <code>/confirmbooking?book_id=BK-XXXXXX&order_id=CART_XXXXX</code></p>
            <p>• Check if the backend's <code>PHONEPE_SUCCESS_REDIRECT_URL</code> is set correctly</p>
            <p>• Verify the backend's redirect handler is processing payments and creating bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDebugPage;
