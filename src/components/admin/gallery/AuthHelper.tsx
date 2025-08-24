'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/app/stores/authStore';
import { Button } from '@/components/ui/button';

const AuthHelper: React.FC = () => {
  const { user, login } = useAuthStore();

  const createMockAuth = () => {
    // Create a mock user for testing
    const mockUser = {
      id: 1,
      email: 'admin@okpuja.com',
      username: 'admin',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      is_active: true,
      is_staff: true,
      is_superuser: true,
    };

    // Create mock tokens
    const mockTokens = {
      access: 'mock-access-token-for-testing-' + Date.now(),
      refresh: 'mock-refresh-token-for-testing-' + Date.now(),
    };

    // Store in localStorage
    localStorage.setItem('access', mockTokens.access);
    localStorage.setItem('refresh', mockTokens.refresh);
    localStorage.setItem('user', JSON.stringify(mockUser));

    // Update auth store by reloading so the app can read from localStorage
    window.location.reload();

    console.log('Mock authentication created for testing');
  };

  const clearAuth = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    // Reload so the auth store can reinitialize from localStorage
    window.location.reload();
    console.log('Authentication cleared');
  };

  if (!user) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold">Authentication Required</h4>
            <p className="text-sm">Create mock auth for testing</p>
          </div>
          <Button 
            onClick={createMockAuth}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Create Mock Auth
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold">Authenticated</h4>
          <p className="text-sm">User: {user.email}</p>
        </div>
        <Button 
          onClick={clearAuth}
          size="sm"
          variant="outline"
          className="border-green-600 text-green-700 hover:bg-green-50"
        >
          Clear Auth
        </Button>
      </div>
    </div>
  );
};

export default AuthHelper;