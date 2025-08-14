'use client';

import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  TextField,
  ButtonGroup,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Payment as PaymentIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

interface BookingDrawerProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  bookingType: 'astrology' | 'regular' | 'puja' | 'all';
  onUpdateStatus?: (status: string, reason?: string) => Promise<boolean>;
  onSendMeetLink?: (booking: any) => void;
  onReschedule?: (booking: any, newDate: string, newTime: string) => void;
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  open,
  onClose,
  booking,
  bookingType,
  onUpdateStatus,
  onSendMeetLink,
  onReschedule,
}) => {
  const [currentStatus, setCurrentStatus] = useState(booking?.status || '');
  const [statusReason, setStatusReason] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    payment: false,
    address: false,
    astroDetails: false,
  });
  const [statusUpdating, setStatusUpdating] = useState(false);

  if (!booking) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'primary';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': case 'REJECTED': case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return <PendingIcon />;
      case 'CONFIRMED': case 'COMPLETED': return <CheckCircleIcon />;
      case 'CANCELLED': case 'REJECTED': case 'FAILED': return <CancelIcon />;
      default: return <PendingIcon />;
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'confirmed', label: 'Confirmed', color: 'primary' },
    { value: 'in_progress', label: 'In Progress', color: 'info' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'error' },
  ];

  const handleStatusUpdate = async (newStatus: string) => {
    if (!onUpdateStatus || newStatus === booking.status) return;

    setStatusUpdating(true);
    try {
      const success = await onUpdateStatus(newStatus, statusReason);
      if (success) {
        setCurrentStatus(newStatus);
        toast.success('Status updated successfully');
        setStatusReason('');
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSendMeetingLink = async () => {
    if (!onSendMeetLink || !meetLink.trim()) {
      toast.error('Please enter a valid meeting link');
      return;
    }

    try {
      await onSendMeetLink({ ...booking, meetLink });
      toast.success('Meeting link sent successfully');
      setMeetLink('');
    } catch (error) {
      console.error('Error sending meeting link:', error);
      toast.error('Failed to send meeting link');
    }
  };

  const handleReschedule = async () => {
    if (!onReschedule || !newDate || !newTime) {
      toast.error('Please select both date and time');
      return;
    }

    try {
      await onReschedule(booking, newDate, newTime);
      toast.success('Booking rescheduled successfully');
      setShowReschedule(false);
      setNewDate('');
      setNewTime('');
    } catch (error) {
      console.error('Error rescheduling:', error);
      toast.error('Failed to reschedule booking');
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }
        }}
      >
        <Box sx={{ p: 3, maxWidth: '100vw', overflowY: 'auto' }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold">
              Booking Details
            </Typography>
            <IconButton onClick={onClose} size="large">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Booking ID and Status */}
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" color="white" fontWeight="bold">
                    #{booking.astro_book_id || booking.book_id || booking.id}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                    {bookingType !== 'all' ? bookingType : booking.type} Booking
                  </Typography>
                </Box>
                <Chip
                  icon={getStatusIcon(currentStatus)}
                  label={booking.status_display || currentStatus}
                  color={getStatusColor(currentStatus) as any}
                  variant="filled"
                  sx={{ color: 'white', fontWeight: 'bold' }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>Quick Actions</Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={currentStatus === option.value ? "contained" : "outlined"}
                    color={option.color as any}
                    size="small"
                    onClick={() => handleStatusUpdate(option.value)}
                    disabled={statusUpdating}
                    startIcon={getStatusIcon(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </Box>
              
              {currentStatus !== booking.status && (
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Reason for status change (optional)"
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  sx={{ mt: 2 }}
                  multiline
                  rows={2}
                />
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>Customer Information</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary={booking.customer_name || booking.user_name || booking.user?.email || 'Unknown'}
                    secondary="Customer Name"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><EmailIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary={booking.contact_email || booking.user_email || booking.user?.email || 'No email'}
                    secondary="Email Address"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary={booking.contact_phone || booking.user?.phone || 'No phone'}
                    secondary="Phone Number"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Service Information */}
            <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>Service Information</Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Typography variant="body2" color="textSecondary">Service</Typography>
                <Typography variant="body1" fontWeight="bold">
                {booking.service?.title || booking.service_title || 'Unknown Service'}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" color="textSecondary">Amount</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                ₹{booking.service?.price || booking.total_amount || 0}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" color="textSecondary">Scheduled Date</Typography>
                <Typography variant="body1">
                {booking.preferred_date || booking.selected_date || 'Not scheduled'}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" color="textSecondary">Scheduled Time</Typography>
                <Typography variant="body1">
                {booking.preferred_time || booking.selected_time || 'Not scheduled'}
                </Typography>
              </div>
              </div>
            </CardContent>
            </Card>

          {/* Payment Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center"
                onClick={() => toggleSection('payment')}
                sx={{ cursor: 'pointer' }}
              >
                <Typography variant="h6">Payment Information</Typography>
                {expandedSections.payment ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
              <Collapse in={expandedSections.payment}>
                <Box mt={2}>
                  {booking.payment_info ? (
                    <List dense>
                      <ListItem>
                        <ListItemIcon><PaymentIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary={booking.payment_info.payment_id || booking.payment_id || 'N/A'}
                          secondary="Payment ID"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                        <ListItemText 
                          primary={booking.payment_info.status || booking.payment_status || 'Unknown'}
                          secondary="Payment Status"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                        <ListItemText 
                          primary={booking.payment_info.transaction_id || 'N/A'}
                          secondary="Transaction ID"
                        />
                      </ListItem>
                      {booking.metadata && (
                        <>
                          <ListItem>
                            <ListItemText 
                              primary={`₹${booking.metadata.payment_amount || 0}`}
                              secondary="Payment Amount"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary={booking.metadata.merchant_order_id || 'N/A'}
                              secondary="Merchant Order ID"
                            />
                          </ListItem>
                        </>
                      )}
                    </List>
                  ) : (
                    <Alert severity="info">Payment information not available</Alert>
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>

          {/* Address Information (for puja services) */}
          {(bookingType === 'regular' || booking.address_full) && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  onClick={() => toggleSection('address')}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant="h6">Service Address</Typography>
                  {expandedSections.address ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
                <Collapse in={expandedSections.address}>
                  <Box mt={2}>
                    <ListItem>
                      <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary={booking.address_full || 'Address not provided'}
                        secondary={`Address ID: ${booking.address || 'N/A'}`}
                      />
                    </ListItem>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          )}

          {/* Astrology Specific Details */}
          {(bookingType === 'astrology' || booking.birth_place) && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  onClick={() => toggleSection('astroDetails')}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant="h6">Astrology Details</Typography>
                  {expandedSections.astroDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
                <Collapse in={expandedSections.astroDetails}>
                  <Box mt={2}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="textSecondary">Birth Place</Typography>
                        <Typography variant="body1">{booking.birth_place || 'N/A'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="textSecondary">Birth Date</Typography>
                        <Typography variant="body1">{booking.birth_date || 'N/A'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="textSecondary">Birth Time</Typography>
                        <Typography variant="body1">{booking.birth_time || 'N/A'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="textSecondary">Gender</Typography>
                        <Typography variant="body1">{booking.gender || 'N/A'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" color="textSecondary">Questions</Typography>
                        <Typography variant="body1">{booking.questions || 'No questions provided'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" color="textSecondary">Language</Typography>
                        <Typography variant="body1">{booking.language || 'N/A'}</Typography>
                      </Grid>
                      {booking.google_meet_link && (
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="body2" color="textSecondary">Meeting Link</Typography>
                          <Typography variant="body1" color="primary" sx={{ wordBreak: 'break-all' }}>
                            {booking.google_meet_link}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          )}

          {/* Reschedule Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Reschedule Service</Typography>
                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  onClick={() => setShowReschedule(!showReschedule)}
                >
                  {showReschedule ? 'Cancel' : 'Reschedule'}
                </Button>
              </Box>
              
              <Collapse in={showReschedule}>
                <Box>
                  <Grid container spacing={2} mt={1}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="New Date"
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="New Time"
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleReschedule}
                        disabled={!newDate || !newTime}
                        startIcon={<CalendarIcon />}
                      >
                        Confirm Reschedule
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </CardContent>
          </Card>

          {/* Astrology Meeting Link */}
          {(bookingType === 'astrology' || booking.birth_place) && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" mb={2}>Send Meeting Link</Typography>
                <Box display="flex" gap={2} alignItems="end">
                  <TextField
                    fullWidth
                    label="Meeting Link"
                    placeholder="https://meet.google.com/..."
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSendMeetingLink}
                    disabled={!meetLink.trim()}
                    startIcon={<VideoCallIcon />}
                  >
                    Send
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>Timeline</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">Created</Typography>
                  <Typography variant="body1">
                    {booking.created_at 
                      ? new Date(booking.created_at).toLocaleString()
                      : 'Unknown'
                    }
                  </Typography>
                </Grid>
                {booking.updated_at && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="textSecondary">Last Updated</Typography>
                    <Typography variant="body1">
                      {new Date(booking.updated_at).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
                {booking.booking_age && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="textSecondary">Booking Age</Typography>
                    <Typography variant="body1">{booking.booking_age}</Typography>
                  </Grid>
                )}
                {booking.time_until_service && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="textSecondary">Time Until Service</Typography>
                    <Typography variant="body1">{booking.time_until_service}</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Bottom spacing for mobile */}
          <Box sx={{ height: 80 }} />
        </Box>
      </Drawer>
    </>
  );
};

export default BookingDrawer;
