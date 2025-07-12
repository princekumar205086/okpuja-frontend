'use client';

import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 40,
  overlay = true,
}) => {
  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center gap-3"
    >
      <CircularProgress 
        size={size} 
        className="text-purple-600"
        thickness={4}
      />
      {message && (
        <Typography 
          variant="body2" 
          className="text-gray-600 font-medium"
        >
          {message}
        </Typography>
      )}
    </motion.div>
  );

  if (overlay) {
    return (
      <Backdrop
        open={true}
        className="bg-white/80 backdrop-blur-sm z-50"
      >
        {content}
      </Backdrop>
    );
  }

  return (
    <Box className="flex justify-center items-center p-8">
      {content}
    </Box>
  );
};

export default LoadingSpinner;
