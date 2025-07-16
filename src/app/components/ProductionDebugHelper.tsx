"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaTools, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const ProductionDebugHelper: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testPaymentConnection = async () => {
    setTesting(true);
    setResults(null);

    try {
      // Test the actual payment endpoint that's failing
      const response = await fetch('/api/payments/payments/process-cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          cart_id: 1, // Test with a dummy cart ID
          method: 'PHONEPE'
        })
      });

      const data = await response.text();
      
      setResults({
        status: response.status,
        statusText: response.statusText,
        success: response.ok,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });

    } catch (error: any) {
      setResults({
        success: false,
        error: error.message,
        type: error.constructor.name
      });
    } finally {
      setTesting(false);
    }
  };

  const testEnvironmentCheck = async () => {
    setTesting(true);
    
    try {
      // Test a simple API call to see if the backend is reachable
      const response = await fetch('/api/auth/users/me/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }
      });

      if (response.ok) {
        toast.success('✅ Backend connection working');
      } else {
        toast.error(`❌ Backend issue: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      toast.error(`❌ Network error: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-4 max-w-sm">
        <div className="flex items-center gap-2 mb-3">
          <FaTools className="text-orange-500" />
          <span className="font-semibold text-gray-800">Production Debug</span>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={testEnvironmentCheck}
            disabled={testing}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
          >
            {testing ? <FaSpinner className="animate-spin mx-auto" /> : 'Test Backend Connection'}
          </button>
          
          <button
            onClick={testPaymentConnection}
            disabled={testing}
            className="w-full px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 text-sm"
          >
            {testing ? <FaSpinner className="animate-spin mx-auto" /> : 'Test Payment Gateway'}
          </button>
        </div>
        
        {results && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
            <div className="flex items-center gap-1 mb-1">
              {results.success ? 
                <FaCheckCircle className="text-green-500" /> : 
                <FaTimesCircle className="text-red-500" />
              }
              <span className="font-medium">
                {results.success ? 'Success' : 'Failed'}
              </span>
            </div>
            
            {results.status && (
              <div>Status: {results.status} {results.statusText}</div>
            )}
            
            {results.error && (
              <div className="text-red-600">Error: {results.error}</div>
            )}
            
            {results.data && (
              <div className="mt-1">
                <details>
                  <summary className="cursor-pointer text-gray-600">Response Data</summary>
                  <pre className="text-xs mt-1 overflow-auto max-h-32">
                    {typeof results.data === 'string' ? results.data : JSON.stringify(results.data, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-3 text-xs text-gray-500">
          <div>💡 This helps debug production payment issues</div>
          <div>🔧 Remove after fixing connectivity</div>
        </div>
      </div>
    </div>
  );
};

export default ProductionDebugHelper;
