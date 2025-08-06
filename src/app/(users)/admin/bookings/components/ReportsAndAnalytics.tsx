'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ReportsAndAnalytics: React.FC<any> = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Reports & Analytics</Typography>
      <Typography variant="body2" color="text.secondary">
        Reports and analytics functionality will be implemented here.
      </Typography>
    </Paper>
  );
};

export default ReportsAndAnalytics;
