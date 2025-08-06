'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CustomerCommunicationModal: React.FC<any> = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Customer Communication</Typography>
      <Typography variant="body2" color="text.secondary">
        Customer communication functionality will be implemented here.
      </Typography>
    </Paper>
  );
};

export default CustomerCommunicationModal;
