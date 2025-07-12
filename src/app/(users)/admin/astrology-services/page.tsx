'use client';

import React, { useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useAstrologyServiceStore } from '@/app/stores/astrologyServiceStore';
import AstrologyServiceHeader from './components/AstrologyServiceHeader';
import AstrologyServiceFilters from './components/AstrologyServiceFilters';
import AstrologyServiceTable from './components/AstrologyServiceTable';
import AstrologyServiceCards from './components/AstrologyServiceCards';
import AstrologyServiceDrawer from './components/AstrologyServiceDrawer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';
import { Toaster } from 'react-hot-toast';
import './styles/components.css';

const AstrologyServicesPage: React.FC = () => {
  const {
    loading,
    error,
    viewMode,
    fetchServices,
    clearError,
  } = useAstrologyServiceStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Container maxWidth="xl" className="py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <AstrologyServiceHeader />

          {/* Error Alert */}
          {error && (
            <ErrorAlert 
              message={error} 
              onClose={clearError}
            />
          )}

          {/* Filters */}
          <AstrologyServiceFilters />

          {/* Content */}
          <Box className="relative">
            {loading && <LoadingSpinner />}
            
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'table' ? (
                <AstrologyServiceTable />
              ) : (
                <AstrologyServiceCards />
              )}
            </motion.div>
          </Box>

          {/* Bottom Drawer */}
          <AstrologyServiceDrawer />
        </motion.div>
      </Container>
    </>
  );
};

export default AstrologyServicesPage;
