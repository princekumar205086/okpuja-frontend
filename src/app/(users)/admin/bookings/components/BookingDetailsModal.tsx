'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Alert,
  Stack
} from '@mui/material';
import {
  Close,
  Person,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  AccessTime,
  AttachMoney,
  Payment,
  Star,
  Edit,
  CheckCircle,
  Cancel,
  Schedule,
  Send,
  Print,
  Share,
  Assignment,
  Notes,
  History,
  Warning,
  Info,
  Spa,
  Psychology
} from '@mui/icons-material';

interface Booking {
  id: string;
  bookingId: string;
  serviceType: 'puja' | 'astrology';
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  scheduledDate: string;
  scheduledTime: string;
  assignedStaff?: string;
  location?: string;
  createdAt: string;
  lastUpdated: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  customerRating?: number;
}

interface BookingDetailsModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  onAction: (action: string, bookingId: string) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  open,
  onClose,
  booking,
  onAction
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState(booking?.notes || '');

  if (!booking) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      in_progress: 'primary',
      completed: 'success',
      cancelled: 'error',
      refunded: 'default'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'warning',
      paid: 'success',
      failed: 'error',
      refunded: 'default'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error',
      urgent: 'error'
    };
    return colors[priority as keyof typeof colors] || 'default';
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const mockActivityLog = [
    {
      action: 'Booking Created',
      timestamp: '2025-08-07 10:00:00',
      user: 'System',
      details: 'Booking was created by customer'
    },
    {
      action: 'Payment Received',
      timestamp: '2025-08-07 10:15:00',
      user: 'Payment Gateway',
      details: 'Payment of ₹5,000 received successfully'
    },
    {
      action: 'Staff Assigned',
      timestamp: '2025-08-07 11:00:00',
      user: 'Admin',
      details: 'Pandit Sharma assigned to this booking'
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, minHeight: '80vh' }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ 
          p: 3, 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              {booking.serviceType === 'puja' ? <Spa /> : <Psychology />}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {booking.serviceName}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Booking ID: {booking.bookingId}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={booking.status.replace('_', ' ')}
              color={getStatusColor(booking.status) as any}
              sx={{ color: 'white' }}
            />
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Overview" />
            <Tab label="Customer Details" />
            <Tab label="Service Details" />
            <Tab label="Activity Log" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Overview Tab */}
          {activeTab === 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {/* Key Information */}
              <Box>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Booking Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CalendarToday sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Scheduled Date
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {new Date(booking.scheduledDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AccessTime sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Scheduled Time
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {booking.scheduledTime}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AttachMoney sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Amount
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                            ₹{booking.amount.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LocationOn sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Location
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {booking.location || 'Not specified'}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>

              {/* Status & Payment */}
              <Box>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Status & Payment
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Booking Status
                        </Typography>
                        <Chip
                          label={booking.status.replace('_', ' ')}
                          color={getStatusColor(booking.status) as any}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Payment Status
                        </Typography>
                        <Chip
                          label={booking.paymentStatus}
                          color={getPaymentStatusColor(booking.paymentStatus) as any}
                          icon={<Payment />}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Priority Level
                        </Typography>
                        <Chip
                          label={booking.priority}
                          color={getPriorityColor(booking.priority) as any}
                          variant={booking.priority === 'urgent' ? 'filled' : 'outlined'}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      {booking.customerRating && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Customer Rating
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star sx={{ color: 'warning.main' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {booking.customerRating}/5
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Box>

              {/* Notes Section */}
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Notes
                      </Typography>
                      <Button
                        startIcon={<Edit />}
                        size="small"
                        onClick={() => setEditMode(!editMode)}
                      >
                        {editMode ? 'Save' : 'Edit'}
                      </Button>
                    </Box>
                    {editMode ? (
                      <TextField
                        multiline
                        rows={4}
                        fullWidth
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this booking..."
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {booking.notes || 'No notes added yet.'}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}

          {/* Customer Details Tab */}
          {activeTab === 1 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Customer Information
                    </Typography>
                    <Stack spacing={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {booking.customerName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Primary Contact
                          </Typography>
                        </Box>
                      </Box>

                      <Divider />

                      <List disablePadding>
                        <ListItem disablePadding sx={{ mb: 2 }}>
                          <ListItemIcon>
                            <Email sx={{ color: 'primary.main' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={booking.customerEmail}
                            secondary="Email Address"
                          />
                        </ListItem>

                        <ListItem disablePadding>
                          <ListItemIcon>
                            <Phone sx={{ color: 'primary.main' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={booking.customerPhone}
                            secondary="Phone Number"
                          />
                        </ListItem>
                      </List>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>

              <Box>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Booking History
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This customer has made 3 previous bookings with an average rating of 4.8/5.
                    </Typography>
                    {/* Add customer history details here */}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}

          {/* Service Details Tab */}
          {activeTab === 2 && (
            <Box sx={{ display: 'grid', gap: 3 }}>
              <Box>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Service Configuration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Detailed service information and configurations will be displayed here.
                    </Typography>
                    {/* Add service-specific details */}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}

          {/* Activity Log Tab */}
          {activeTab === 3 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Activity Timeline
                </Typography>
                <List>
                  {mockActivityLog.map((activity, index) => (
                    <ListItem key={index} alignItems="flex-start">
                      <ListItemIcon>
                        <History sx={{ color: 'primary.main', mt: 1 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {activity.action}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {activity.details}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.timestamp} by {activity.user}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {booking.status === 'pending' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => onAction('confirm', booking.id)}
            >
              Confirm Booking
            </Button>
          )}
          
          {['pending', 'confirmed'].includes(booking.status) && (
            <>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<Schedule />}
                onClick={() => onAction('reschedule', booking.id)}
              >
                Reschedule
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => onAction('cancel', booking.id)}
              >
                Cancel
              </Button>
            </>
          )}
          
          <Button
            variant="outlined"
            startIcon={<Send />}
            onClick={() => onAction('notify', booking.id)}
          >
            Send Update
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => onAction('print', booking.id)}
          >
            Print
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetailsModal;
