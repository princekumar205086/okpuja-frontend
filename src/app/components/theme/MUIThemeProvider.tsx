"use client";
import React, { createContext, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useThemeStore } from '@/app/stores/themeStore';

const ThemeContext = createContext({});

export const useTheme = () => useContext(ThemeContext);

export const MUIThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    // Apply theme classes to html/body elements
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

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#ff6b35',
        light: '#ff8c5c',
        dark: '#e55a2e',
      },
      secondary: {
        main: '#f7931e',
        light: '#f9a849',
        dark: '#df7f1c',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#ffffff',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#000000',
        secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      },
    },
    typography: {
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: mode === 'dark' 
              ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
              : '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            color: mode === 'dark' ? '#ffffff' : '#000000',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
