"use client";
import React, { useEffect } from 'react';
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
  const { user, loading, initAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!loading) {
      if (!user || user.account_status !== 'ACTIVE') {
        router.push('/login');
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        if (user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (user.role === 'EMPLOYEE') {
          router.push('/employee/dashboard');
        } else {
          router.push('/dashboard');
        }
        return;
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.account_status !== 'ACTIVE' || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};
