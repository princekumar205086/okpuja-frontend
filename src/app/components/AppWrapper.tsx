"use client";

import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Render children immediately — don't block render on auth
  return <>{children}</>;
}
