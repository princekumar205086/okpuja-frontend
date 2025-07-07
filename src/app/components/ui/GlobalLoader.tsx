"use client";
import React from 'react';
import { CircularProgress, Box, Typography, Backdrop } from '@mui/material';
import { useLoading } from '@/app/context/LoadingContext';

const GlobalLoader: React.FC = () => {
  const { isLoading, loadingMessage } = useLoading();

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
      {loadingMessage && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {loadingMessage}
        </Typography>
      )}
    </Backdrop>
  );
};

export default GlobalLoader;
