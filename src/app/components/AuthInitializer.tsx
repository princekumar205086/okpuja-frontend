"use client";

import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function AuthInitializer() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth on app startup
    initAuth();
  }, [initAuth]);

  return null;
}
