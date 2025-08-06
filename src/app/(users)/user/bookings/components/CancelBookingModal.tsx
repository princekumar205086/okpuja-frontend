'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  Box,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { AlertTriangle, DollarSign, Clock, FileText, Phone, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyableText from './CopyableText';

interface CancelBookingModalProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  type: 'puja' | 'astrology';
  onCancel: (booking: any, reason: string, requestRefund: boolean) => Promise<void>;
}

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  open,
  onClose,
  booking,
  type,
  onCancel
}) => {
  const [reason, setReason] = useState('');
  const [reasonCategory, setReasonCategory] = useState('');
  const [requestRefund, setRequestRefund] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const reasonOptions = [
    { value: 'schedule_conflict', label: 'Schedule Conflict' },
    { value: 'emergency', label: 'Emergency Situation' },
    { value: 'financial_constraints', label: 'Financial Constraints' },
    { value: 'service_not_needed', label: 'Service No Longer Needed' },
    { value: 'dissatisfaction', label: 'Dissatisfaction with Service' },
    { value: 'personal_reasons', label: 'Personal Reasons' },
    { value: 'other', label: 'Other' }
  ];

  const canCancelBooking = (selectedDate: string, selectedTime: string): boolean => {
    const bookingDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    const timeDiff = bookingDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff >= 24;
  };

  const bookingDate = type === 'puja' ? booking?.selected_date : booking?.preferred_date;
  const bookingTime = type === 'puja' ? booking?.selected_time : booking?.preferred_time;
  const canCancel = canCancelBooking(bookingDate || '', bookingTime || '');
  const transactionId = type === 'puja' 
    ? booking?.payment_details?.transaction_id 
    : booking?.payment_id;

  const handleCancel = async () => {
    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    if (!reasonCategory) {
      toast.error('Please select a cancellation reason');
      return;
    }

    if (!reason.trim()) {
      toast.error('Please provide additional details for cancellation');
      return;
    }

    setLoading(true);
    try {
      await onCancel(booking, reason, requestRefund);
      onClose();
      toast.success(requestRefund 
        ? 'Booking cancelled and refund requested!' 
        : 'Booking cancelled successfully!');
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setReasonCategory('');
    setRequestRefund(true);
    setAcceptTerms(false);
    onClose();
  };

  if (!canCancel) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Cancellation Not Available
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>24-Hour Policy:</strong> This booking cannot be cancelled as it&apos;s less than 24 hours before the scheduled time.
          </Alert>
          
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              📅 Booking Details:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Service:</strong> {type === 'puja' 
                ? booking?.cart?.puja_service?.title 
                : booking?.service?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Date:</strong> {new Date(bookingDate || '').toLocaleDateString('en-IN')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Time:</strong> {bookingTime}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Amount:</strong> ₹{type === 'puja' 
                ? booking?.total_amount 
                : booking?.service?.price}
            </Typography>
          </Box>
          
          <DialogContentText>
            <strong>Need to cancel urgently?</strong> Our admin team can help with emergency cancellations.
            Please contact them directly with your booking details:
          </DialogContentText>
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              🔗 <strong>Quick Contact Options:</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              📞 <strong>Phone:</strong> +91-XXXX-XXXX-XX
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              📧 <strong>Email:</strong> admin@okpuja.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              💬 <strong>WhatsApp:</strong> +91-XXXX-XXXX-XX
            </Typography>
            <Typography variant="body2" color="primary.main">
              📋 <strong>Booking ID:</strong> {type === 'puja' ? booking?.book_id : booking?.astro_book_id}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined">Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => window.open('tel:+91XXXXXXXXXX')}
            startIcon={<AlertTriangle className="w-4 h-4" />}
          >
            Call Admin
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => window.open('https://wa.me/91XXXXXXXXXX')}
          >
            WhatsApp
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        Cancel Booking
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>Important:</strong> Cancelling this booking may affect your future bookings. Please review our cancellation policy below.
          </Alert>

          {/* Booking Details */}
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Booking Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Service:</strong> {type === 'puja' 
                ? booking?.cart?.puja_service?.title 
                : booking?.service?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Amount:</strong> ₹{type === 'puja' 
                ? booking?.total_amount 
                : booking?.service?.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Date:</strong> {new Date(bookingDate).toLocaleDateString('en-IN')}
            </Typography>
            {transactionId && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Transaction ID:</strong>
                </Typography>
                <CopyableText 
                  text={transactionId} 
                  label="Transaction ID"
                  className="text-sm bg-gray-100 px-2 py-1 rounded"
                />
              </Box>
            )}
          </Box>

          {/* Cancellation Reason */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Reason for Cancellation *</InputLabel>
            <Select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              label="Reason for Cancellation *"
              required
            >
              {reasonOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Details"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide more details about your cancellation reason..."
            sx={{ mb: 3 }}
            required
            helperText="Please explain your situation briefly. This helps us improve our services."
          />

          {/* Refund Request */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={requestRefund}
                  onChange={(e) => setRequestRefund(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DollarSign className="w-4 h-4" />
                  Request Refund
                </Box>
              }
            />
            {requestRefund && (
              <Alert severity="info" sx={{ mt: 1 }}>
                Your refund request will be processed within 5-7 business days. 
                The transaction ID above will be required for processing.
              </Alert>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Terms and Conditions */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FileText className="w-4 h-4" />
              Cancellation Policy
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Cancellations must be made at least 24 hours before the scheduled time
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Refunds will be processed within 5-7 business days
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • A cancellation fee may apply based on the service type
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Emergency cancellations require admin approval
              </Typography>
              <Typography variant="body2">
                • Keep your transaction ID safe for refund processing
              </Typography>
            </Box>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                color="primary"
              />
            }
            label="I accept the cancellation terms and conditions"
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
        >
          Keep Booking
        </Button>
        <Button 
          onClick={handleCancel}
          variant="contained"
          color="error"
          disabled={!acceptTerms || !reasonCategory || !reason.trim() || loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Processing...' : (requestRefund ? 'Cancel & Request Refund' : 'Cancel Booking')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelBookingModal;
