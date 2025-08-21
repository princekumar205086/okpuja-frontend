'use client';

import React, { useState } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Chip, 
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAdminBookingStore } from '../../../../stores/adminBookingStore';

interface StatusChangeDrawerProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  type: 'astrology' | 'regular' | 'puja';
}

const StatusChangeDrawer: React.FC<StatusChangeDrawerProps> = ({
  open,
  onClose,
  booking,
  type
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { updateBookingStatus, loading } = useAdminBookingStore();

  const [selectedStatus, setSelectedStatus] = useState('');
  const [reason, setReason] = useState('');

  if (!booking) return null;

  // Extract customer name
  const extractNameFromEmail = (email: string) => {
    if (!email || email === 'N/A') return 'N/A';
    const name = email.split('@')[0];
    return name.split(/[._-]/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const rawCustomerName = booking.user?.username || booking.user_name || booking.customer_name || booking.contact_name;
  const customerEmail = booking.user?.email || booking.user_email || booking.contact_email || 'N/A';
  const customerName = rawCustomerName || extractNameFromEmail(customerEmail) || 'N/A';
  const serviceTitle = booking.service?.title || booking.service_title || booking.package_name || 'Service';
  const currentStatus = booking.status || 'PENDING';
  const bookingId = booking.id || booking.astro_book_id || booking.book_id;

  const availableStatuses = [
    { value: 'CONFIRMED', label: 'Confirmed', color: 'info', icon: <CheckCircleIcon className="w-4 h-4" /> },
    { value: 'COMPLETED', label: 'Completed', color: 'success', icon: <CheckCircleIcon className="w-4 h-4" /> },
    { value: 'CANCELLED', label: 'Cancelled', color: 'error', icon: <XCircleIcon className="w-4 h-4" /> },
    { value: 'REJECTED', label: 'Rejected', color: 'error', icon: <XCircleIcon className="w-4 h-4" /> },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      COMPLETED: 'success',
      CANCELLED: 'error',
      REJECTED: 'error',
    };
    return colors[status as keyof typeof colors] || 'warning';
  };

  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast.error('Please select a status');
      return;
    }

    if ((selectedStatus === 'CANCELLED' || selectedStatus === 'REJECTED') && !reason.trim()) {
      toast.error('Please provide a reason for cancellation/rejection');
      return;
    }

    try {
      const payload: any = { status: selectedStatus };
      
      if (selectedStatus === 'CANCELLED') {
        payload.cancellation_reason = reason;
      } else if (selectedStatus === 'REJECTED') {
        payload.rejection_reason = reason;
      }

      // Convert puja type to regular for API call
      const apiType = type === 'puja' ? 'regular' : type;
      
      const result = await updateBookingStatus(apiType, bookingId, payload);
      
      if (result) {
        toast.success(`Booking status updated to ${selectedStatus}`);
        onClose();
        setSelectedStatus('');
        setReason('');
      }
    } catch (error) {
      console.error('Status update error:', error);
      // Error is already handled in the store
    }
  };

  const requiresReason = selectedStatus === 'CANCELLED' || selectedStatus === 'REJECTED';

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          height: isMobile ? '80vh' : '60vh',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxWidth: '100vw',
          left: 0,
          right: 0,
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          borderBottom: 1, 
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              Change Booking Status
            </Typography>
            <IconButton 
              onClick={onClose} 
              sx={{ color: 'white' }}
              size="small"
            >
              <XMarkIcon className="w-5 h-5" />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {serviceTitle}
            </Typography>
            <Chip 
              label={type.toUpperCase()}
              size="small"
              sx={{ 
                fontWeight: 600,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white'
              }}
            />
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {/* Current Booking Info */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Booking Details
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">ID</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                    {booking.astro_book_id || booking.book_id || bookingId}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{customerName}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Current Status</Typography>
                  <Chip 
                    label={currentStatus}
                    color={getStatusColor(currentStatus) as any}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Status Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ExclamationTriangleIcon className="w-5 h-5 text-blue-500" />
              New Status
            </Typography>
            
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {availableStatuses.map((status) => (
                  <Box key={status.value} sx={{ mb: 1 }}>
                    <FormControlLabel
                      value={status.value}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {status.icon}
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {status.label}
                          </Typography>
                          {currentStatus === status.value && (
                            <Chip label="Current" size="small" variant="outlined" />
                          )}
                        </Box>
                      }
                      disabled={currentStatus === status.value}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          width: '100%'
                        }
                      }}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          {/* Reason Field (for cancellation/rejection) */}
          {requiresReason && (
            <TextField
              label={`Reason for ${selectedStatus.toLowerCase()}`}
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Please provide a reason for ${selectedStatus.toLowerCase()}...`}
              fullWidth
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ 
          p: 3, 
          borderTop: 1, 
          borderColor: 'divider', 
          bgcolor: 'grey.50',
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end'
        }}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading || !selectedStatus || (requiresReason && !reason.trim())}
            sx={{ 
              borderRadius: 2,
              bgcolor: 'blue.600',
              '&:hover': { bgcolor: 'blue.700' }
            }}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default StatusChangeDrawer;