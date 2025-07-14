'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function StoreInitializer() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth store on app startup
    initAuth();
  }, [initAuth]);

  return null; // This component doesn't render anything
}
