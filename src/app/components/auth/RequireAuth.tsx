"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { CircularProgress, Box } from '@mui/material';

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
      if (!user) {
        router.push('/auth/login');
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        router.push(`/${user.role}/dashboard`);
        return;
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};
