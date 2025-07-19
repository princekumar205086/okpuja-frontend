"use client";

import React, { useState } from 'react';
import apiClient from '../../apiService/globalApiconfig';

const DebugCart: React.FC = () => {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testCartAPI = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      console.log('Testing cart API...');
      const result = await apiClient.get('/cart/carts/');
      console.log('Cart API Response:', result.data);
      setResponse(result.data);
    } catch (err: any) {
      console.error('Cart API Error:', err);
      setError(err.response?.data?.detail || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testActiveCartAPI = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      console.log('Testing active cart API...');
      const result = await apiClient.get('/cart/carts/active/');
      console.log('Active Cart API Response:', result.data);
      setResponse(result.data);
    } catch (err: any) {
      console.error('Active Cart API Error:', err);
      setError(err.response?.data?.detail || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Cart API Debug</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testCartAPI}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Cart API (/cart/carts/)
        </button>
        
        <button
          onClick={testActiveCartAPI}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-2"
        >
          Test Active Cart API (/cart/carts/active/)
        </button>
      </div>

      {loading && (
        <div className="text-blue-600">Loading...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <h3 className="font-bold text-red-800">Error:</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {response && (
        <div className="bg-gray-50 border border-gray-200 rounded p-4">
          <h3 className="font-bold mb-2">Response:</h3>
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold">Debug Info:</h3>
        <p>API Base URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.okpuja.com/api'}</p>
        <p>Auth Token: {typeof window !== 'undefined' ? (localStorage.getItem('access') ? 'Present' : 'Not present') : 'Server side'}</p>
      </div>
    </div>
  );
};

export default DebugCart;
