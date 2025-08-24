'use client';

import React from 'react';
import { useAuthStore } from '@/app/stores/authStore';
import { Button } from '@/components/ui/button';

const AuthDebugInfo: React.FC = () => {
  const { user, access, refresh } = useAuthStore();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-xs text-xs z-50">
      <h4 className="font-bold mb-2">Auth Debug Info</h4>
      <div className="space-y-1">
        <div>User: {user ? `${user.email} (${user.role})` : 'None'}</div>
        <div>Access Token: {access ? 'Present' : 'Missing'}</div>
        <div>Refresh Token: {refresh ? 'Present' : 'Missing'}</div>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          console.log('Auth Debug:', { user, access, refresh });
        }}
        className="mt-2 text-xs"
      >
        Log to Console
      </Button>
    </div>
  );
};

export default AuthDebugInfo;