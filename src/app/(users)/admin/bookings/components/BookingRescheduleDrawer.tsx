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
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  XMarkIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAdminBookingStore } from '../../../../stores/adminBookingStore';

interface BookingRescheduleDrawerProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  type: 'astrology' | 'regular' | 'puja';
}

const BookingRescheduleDrawer: React.FC<BookingRescheduleDrawerProps> = ({
  open,
  onClose,
  booking,
  type
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    rescheduleAstrologyBooking,
    rescheduleRegularBooking,
    loading
  } = useAdminBookingStore();

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: ''
  });

  const [validationErrors, setValidationErrors] = useState({
    date: '',
    time: '',
    reason: ''
  });

  if (!booking) return null;

  // Extract customer name - try to get real name, fallback to extracted from email
  const extractNameFromEmail = (email: string) => {
    if (!email || email === 'N/A') return 'N/A';
    const name = email.split('@')[0];
    return name.split(/[._-]/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Get proper booking ID for different service types
  const getBookingId = () => {
    // For puja bookings, we need to extract the numeric ID from book_id or id
    if (type === 'puja') {
      // If book_id has format like "BK-CC2FF2A4", extract the ID from the booking data
      const numericId = booking.id || booking.booking_id;
      console.log('Puja booking ID extraction:', { booking, numericId, type });
      return numericId;
    }
    
    // For astrology bookings
    if (type === 'astrology') {
      const astrologyId = booking.id || booking.astro_book_id;
      console.log('Astrology booking ID extraction:', { booking, astrologyId, type });
      return astrologyId;
    }
    
    // For regular bookings
    const regularId = booking.id || booking.book_id;
    console.log('Regular booking ID extraction:', { booking, regularId, type });
    return regularId;
  };

  const bookingId = getBookingId();
  const rawCustomerName = booking.user?.username || booking.user_name || booking.customer_name || booking.contact_name;
  const customerEmail = booking.user?.email || booking.user_email || booking.contact_email || 'N/A';
  const customerName = rawCustomerName || extractNameFromEmail(customerEmail) || 'N/A';
  const serviceTitle = booking.service?.title || booking.service_title || booking.package_name || 'Service';
  const currentDate = booking.selected_date || booking.booking_date || booking.preferred_date || 'N/A';
  const currentTime = booking.selected_time || booking.start_time || booking.preferred_time || 'N/A';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      date: '',
      time: '',
      reason: ''
    };

    let isValid = true;

    // Simple date validation - just check if date is provided and not in past
    if (!formData.date) {
      errors.date = 'Date is required';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Date cannot be in the past';
        isValid = false;
      }
    }

    // Simple time validation - just check if time is provided
    if (!formData.time) {
      errors.time = 'Time is required';
      isValid = false;
    }

    // Simple reason validation - just check if provided (backend requires it)
    if (!formData.reason || formData.reason.trim().length === 0) {
      errors.reason = 'Reason is required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    // Validate form first
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    console.log('Submitting reschedule:', {
      type,
      bookingId,
      formData,
      booking
    });

    try {
      let success = false;

      switch (type) {
        case 'astrology':
          const astrologyResult = await rescheduleAstrologyBooking(bookingId, {
            preferred_date: formData.date,
            preferred_time: formData.time + ':00',
            reason: formData.reason.trim()
          });
          success = !!astrologyResult;
          break;
          
        case 'puja':
          // Since puja bookings are fetched from /booking/admin/bookings/, 
          // they should be rescheduled as regular bookings
          const pujaResult = await rescheduleRegularBooking(bookingId, {
            selected_date: formData.date,
            selected_time: formData.time + ':00',
            reason: formData.reason.trim()
          });
          success = !!pujaResult;
          break;
          
        case 'regular':
          const regularResult = await rescheduleRegularBooking(bookingId, {
            selected_date: formData.date,
            selected_time: formData.time + ':00',
            reason: formData.reason.trim()
          });
          success = !!regularResult;
          break;
      }
      
      if (success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} booking rescheduled successfully!`);
        onClose();
        setFormData({ date: '', time: '', reason: '' });
        setValidationErrors({ date: '', time: '', reason: '' });
      }
    } catch (error) {
      console.error('Reschedule error:', error);
      // Error is already handled in the store with proper backend messages
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const today = new Date(now);
    return {
      minDate: today.toISOString().split('T')[0],
      minTime: '00:00'
    };
  };

  const { minDate, minTime } = getCurrentDateTime();

  const handleClose = () => {
    setFormData({ date: '', time: '', reason: '' });
    setValidationErrors({ date: '', time: '', reason: '' });
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          height: isMobile ? '85vh' : '65vh',
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
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              Reschedule Booking
            </Typography>
            <IconButton 
              onClick={handleClose} 
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
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                Current Booking Details
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Booking ID</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                    {booking.astro_book_id || booking.book_id || bookingId}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{customerName}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Current Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {currentDate !== 'N/A' ? new Date(currentDate).toLocaleDateString() : 'Not Set'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Current Time</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{currentTime}</Typography>
                </Box>
                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <Typography variant="body2" color="text.secondary">Service</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{serviceTitle}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Divider sx={{ my: 2 }} />

          {/* Reschedule Form */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CalendarDaysIcon className="w-5 h-5 text-purple-600" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                New Schedule
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="New Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                error={!!validationErrors.date}
                helperText={validationErrors.date}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minDate }}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              
              <TextField
                label="New Time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                error={!!validationErrors.time}
                helperText={validationErrors.time}
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>

            <TextField
              label="Reason *"
              multiline
              rows={3}
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              error={!!validationErrors.reason}
              helperText={validationErrors.reason || 'Please provide a reason for rescheduling'}
              placeholder="Reason for rescheduling..."
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
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
            onClick={handleClose}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={
              loading || 
              !formData.date || 
              !formData.time || 
              !formData.reason ||
              !!validationErrors.date ||
              !!validationErrors.time ||
              !!validationErrors.reason
            }
            sx={{ 
              borderRadius: 2,
              bgcolor: 'purple.600',
              '&:hover': { bgcolor: 'purple.700' }
            }}
          >
            {loading ? 'Rescheduling...' : 'Reschedule'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default BookingRescheduleDrawer;