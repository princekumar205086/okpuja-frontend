"use client";

import { useEffect } from 'react';
import { useThemeStore } from '@/app/stores/themeStore';

export default function ThemeInitializer() {
  const { mode, setTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme classes to HTML and body on mount and theme change
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      
      if (mode === 'dark') {
        htmlElement.classList.add('dark');
        bodyElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
        bodyElement.classList.remove('dark');
      }
    }
  }, [mode]);

  // Initialize theme from storage on first load
  useEffect(() => {
    // This will trigger the theme application without changing the stored value
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      
      if (mode === 'dark') {
        htmlElement.classList.add('dark');
        bodyElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
        bodyElement.classList.remove('dark');
      }
    }
  }, [mode]); // Run on mount and when mode changes

  return null; // This component doesn't render anything
}
