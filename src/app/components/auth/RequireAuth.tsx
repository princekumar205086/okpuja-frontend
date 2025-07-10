"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, initAuth, loading } = useAuthStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth store on component mount
    initAuth();
    setIsInitialized(true);
  }, [initAuth]);

  useEffect(() => {
    // Only check auth after initialization is complete
    if (!isInitialized || loading) return;

    if (!user || user.account_status !== 'ACTIVE') {
      router.push('/login');
      return;
    }
    
    if (
      requiredRole &&
      ![requiredRole].flat().map(r => r.toLowerCase()).includes(user.role?.toLowerCase())
    ) {
      // Redirect to appropriate dashboard based on user role
      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'EMPLOYEE') {
        router.push('/employee/dashboard');
      } else {
        router.push('/user/dashboard');
      }
      return;
    }
  }, [user, requiredRole, router, isInitialized, loading]);

  // Show loading while initializing or checking auth
  if (!isInitialized || loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.account_status !== 'ACTIVE') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          <p className="text-gray-600 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (
    requiredRole &&
    ![requiredRole].flat().map(r => r.toLowerCase()).includes(user.role?.toLowerCase())
  ) {
    // Show a spinner or message while redirecting to correct dashboard
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          <p className="text-gray-600 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
