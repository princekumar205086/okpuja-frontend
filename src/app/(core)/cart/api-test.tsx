"use client";

import React, { useEffect, useState } from 'react';
import apiClient from '../../apiService/globalApiconfig';

const APITest: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);

  const testAPI = async () => {
    const tests = [
      {
        name: 'Base API Health',
        request: () => apiClient.get('/'),
      },
      {
        name: 'Cart API - List All',
        request: () => apiClient.get('/cart/carts/'),
      },
      {
        name: 'Cart API - Active',
        request: () => apiClient.get('/cart/carts/active/'),
      }
    ];

    const testResults = [];

    for (const test of tests) {
      try {
        console.log(`Testing: ${test.name}`);
        const response = await test.request();
        testResults.push({
          name: test.name,
          success: true,
          data: response.data,
          status: response.status,
        });
        console.log(`✅ ${test.name}:`, response.data);
      } catch (error: any) {
        testResults.push({
          name: test.name,
          success: false,
          error: error.response?.data || error.message,
          status: error.response?.status,
        });
        console.log(`❌ ${test.name}:`, error);
      }
    }

    setResults(testResults);
  };

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">API Test Results</h2>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <div 
            key={index}
            className={`p-4 rounded border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
          >
            <h3 className="font-semibold flex items-center gap-2">
              {result.success ? '✅' : '❌'} {result.name}
              <span className="text-sm text-gray-500">({result.status})</span>
            </h3>
            
            <pre className="text-xs mt-2 max-h-40 overflow-auto">
              {JSON.stringify(result.success ? result.data : result.error, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold">Environment Info:</h3>
        <p>API Base URL: {process.env.NEXT_PUBLIC_API_BASE_URL}</p>
        <p>Auth Token: {typeof window !== 'undefined' ? (localStorage.getItem('access') ? 'Present' : 'Missing') : 'N/A'}</p>
      </div>

      <button 
        onClick={testAPI}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry Tests
      </button>
    </div>
  );
};

export default APITest;
