"use client";

import React, { useState, useEffect } from 'react';
import { debugTokenStatus, getLogoutAnalysis, isTokenExpired, getTokenExpirationTime, getStoredTokens } from '../utils/tokenUtils';
import { testRefreshEndpoint, validateTokenFormat } from '../utils/authTesting';
import { useAuthStore } from '../stores/authStore';

const TokenDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const { user, access, refresh } = useAuthStore();

  const runDiagnostics = React.useCallback(() => {
    const tokens = getStoredTokens();
    const analysis = getLogoutAnalysis();
    
    const diagnosticData = {
      storeState: { user: !!user, access: !!access, refresh: !!refresh },
      localStorageTokens: {
        access: !!tokens.access,
        refresh: !!tokens.refresh,
        user: !!tokens.user,
      },
      tokenValidation: {
        accessExpired: tokens.access ? isTokenExpired(tokens.access) : null,
        refreshExpired: tokens.refresh ? isTokenExpired(tokens.refresh) : null,
        accessExpiresAt: tokens.access ? getTokenExpirationTime(tokens.access) : null,
        refreshExpiresAt: tokens.refresh ? getTokenExpirationTime(tokens.refresh) : null,
      },
      analysis,
      timestamp: new Date().toISOString(),
    };

    setDiagnostics(diagnosticData);
    debugTokenStatus();
  }, [user, access, refresh]);

  useEffect(() => {
    // Auto-run diagnostics when component mounts
    runDiagnostics();
  }, [runDiagnostics]);

  const testRefreshTokenManually = async () => {
    const tokens = getStoredTokens();
    if (!tokens.refresh) {
      console.error('No refresh token available');
      return;
    }

    console.log('🧪 Testing refresh token manually...');
    const result = await testRefreshEndpoint(tokens.refresh);
    console.log('Manual refresh test result:', result);
    
    if (result.success) {
      // Update tokens in localStorage
      if (result.data.access) {
        localStorage.setItem('access', result.data.access);
      }
      if (result.data.refresh) {
        localStorage.setItem('refresh', result.data.refresh);
      }
      runDiagnostics();
    }
  };

  const validateCurrentTokens = () => {
    const tokens = getStoredTokens();
    console.group('🔍 Token Validation');
    
    if (tokens.access) {
      const accessValidation = validateTokenFormat(tokens.access);
      console.log('Access Token:', accessValidation);
    }
    
    if (tokens.refresh) {
      const refreshValidation = validateTokenFormat(tokens.refresh);
      console.log('Refresh Token:', refreshValidation);
    }
    
    console.groupEnd();
  };

  const clearAllData = () => {
    localStorage.clear();
    useAuthStore.getState().logout();
    runDiagnostics();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🔍 Authentication Diagnostics</h2>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={runDiagnostics}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Run Diagnostics
        </button>
        <button
          onClick={testRefreshTokenManually}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Refresh Token
        </button>
        <button
          onClick={validateCurrentTokens}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Validate Tokens
        </button>
        <button
          onClick={clearAllData}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear All Data
        </button>
      </div>

      {diagnostics && (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold text-lg mb-2">Store State</h3>
            <pre className="text-sm">{JSON.stringify(diagnostics.storeState, null, 2)}</pre>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold text-lg mb-2">LocalStorage Tokens</h3>
            <pre className="text-sm">{JSON.stringify(diagnostics.localStorageTokens, null, 2)}</pre>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold text-lg mb-2">Token Validation</h3>
            <pre className="text-sm">{JSON.stringify(diagnostics.tokenValidation, null, 2)}</pre>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold text-lg mb-2">Logout Analysis</h3>
            <pre className="text-sm">{JSON.stringify(diagnostics.analysis, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenDiagnostics;
