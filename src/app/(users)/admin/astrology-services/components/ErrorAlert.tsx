'use client';

import React from 'react';
import { Alert, AlertTitle, IconButton, Collapse } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorAlertProps {
  message: string;
  title?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  onClose?: () => void;
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  title,
  severity = 'error',
  onClose,
  className = '',
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        <Alert
          severity={severity}
          className="shadow-lg border border-red-200"
          action={
            onClose && (
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={onClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            )
          }
        >
          {title && <AlertTitle className="font-semibold">{title}</AlertTitle>}
          {message}
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorAlert;
