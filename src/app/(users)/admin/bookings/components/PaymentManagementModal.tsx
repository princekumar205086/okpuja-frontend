'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PaymentManagementModal: React.FC<any> = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Payment Management</Typography>
      <Typography variant="body2" color="text.secondary">
        Payment management functionality will be implemented here.
      </Typography>
    </Paper>
  );
};

export default PaymentManagementModal;
