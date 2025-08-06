'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Chip,
  Avatar,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  ViewWeek,
  ViewDay,
  Add,
  Event,
  Spa,
  Psychology,
  Person,
  AccessTime,
  LocationOn
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

interface BookingCalendarViewProps {
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
}

const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({
  bookings,
  onBookingClick
}) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Get calendar days for the current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    
    return days;
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(booking => booking.scheduledDate === dateString);
  };

  // Navigate calendar
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setQuickViewOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: theme.palette.warning.main,
      confirmed: theme.palette.info.main,
      in_progress: theme.palette.primary.main,
      completed: theme.palette.success.main,
      cancelled: theme.palette.error.main,
      refunded: theme.palette.grey[500]
    };
    return colors[status as keyof typeof colors] || theme.palette.grey[500];
  };

  const calendarDays = getCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box>
      {/* Calendar Header */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* View Mode Toggle */}
            <Box sx={{ display: 'flex', bgcolor: 'grey.100', borderRadius: 1, p: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => setViewMode('month')}
                sx={{ 
                  bgcolor: viewMode === 'month' ? 'primary.main' : 'transparent',
                  color: viewMode === 'month' ? 'white' : 'inherit'
                }}
              >
                <ViewWeek />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setViewMode('week')}
                sx={{ 
                  bgcolor: viewMode === 'week' ? 'primary.main' : 'transparent',
                  color: viewMode === 'week' ? 'white' : 'inherit'
                }}
              >
                <ViewDay />
              </IconButton>
            </Box>

            {/* Navigation */}
            <Tooltip title="Previous Month">
              <IconButton onClick={() => navigateMonth('prev')}>
                <ChevronLeft />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Today">
              <Button
                variant="outlined"
                size="small"
                startIcon={<Today />}
                onClick={navigateToToday}
              >
                Today
              </Button>
            </Tooltip>
            
            <Tooltip title="Next Month">
              <IconButton onClick={() => navigateMonth('next')}>
                <ChevronRight />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<Add />}
              size="small"
            >
              New Booking
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Calendar Grid */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Day Headers */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          {dayNames.map((day) => (
            <Box
              key={day}
              sx={{
                p: 2,
                textAlign: 'center',
                fontWeight: 600,
                borderRight: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {day}
            </Box>
          ))}
        </Box>

        {/* Calendar Body */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          minHeight: 600
        }}>
          {calendarDays.map((day, index) => {
            const dayBookings = getBookingsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            
            return (
              <Box
                key={index}
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.200',
                  p: 1,
                  minHeight: 120,
                  bgcolor: isCurrentMonth ? 'white' : 'grey.50',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: isCurrentMonth ? 'grey.50' : 'grey.100'
                  }
                }}
              >
                {/* Date Header */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 1
                }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isToday ? 700 : 500,
                      bgcolor: isToday ? 'primary.main' : 'transparent',
                      color: isToday ? 'white' : (isCurrentMonth ? 'text.primary' : 'text.secondary'),
                      borderRadius: isToday ? '50%' : 0,
                      width: isToday ? 24 : 'auto',
                      height: isToday ? 24 : 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {day.getDate()}
                  </Typography>
                  
                  {dayBookings.length > 0 && (
                    <Chip
                      label={dayBookings.length}
                      size="small"
                      color="primary"
                      sx={{ 
                        height: 16, 
                        fontSize: '0.7rem',
                        minWidth: 16
                      }}
                    />
                  )}
                </Box>

                {/* Bookings */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {dayBookings.slice(0, 3).map((booking) => (
                    <Card
                      key={booking.id}
                      sx={{
                        cursor: 'pointer',
                        borderLeft: `3px solid ${getStatusColor(booking.status)}`,
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'translateY(-1px)',
                          boxShadow: 1
                        },
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleBookingClick(booking)}
                    >
                      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          {booking.serviceType === 'puja' ? (
                            <Spa sx={{ fontSize: 12, color: 'primary.main' }} />
                          ) : (
                            <Psychology sx={{ fontSize: 12, color: 'secondary.main' }} />
                          )}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1
                            }}
                          >
                            {booking.serviceName}
                          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {booking.scheduledTime} - {booking.customerName}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {dayBookings.length > 3 && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ textAlign: 'center', mt: 0.5 }}
                    >
                      +{dayBookings.length - 3} more
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Quick View Dialog */}
      <Dialog
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedBooking && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {selectedBooking.serviceType === 'puja' ? <Spa /> : <Psychology />}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedBooking.serviceName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedBooking.bookingId}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ color: 'text.secondary' }} />
                  <Typography>{selectedBooking.customerName}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ color: 'text.secondary' }} />
                  <Typography>
                    {new Date(selectedBooking.scheduledDate).toLocaleDateString()} at {selectedBooking.scheduledTime}
                  </Typography>
                </Box>
                
                {selectedBooking.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ color: 'text.secondary' }} />
                    <Typography>{selectedBooking.location}</Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={selectedBooking.status.replace('_', ' ')}
                    color={getStatusColor(selectedBooking.status) === theme.palette.success.main ? 'success' : 'default'}
                    size="small"
                  />
                  <Chip
                    label={`₹${selectedBooking.amount.toLocaleString()}`}
                    color="primary"
                    size="small"
                  />
                </Box>
              </Box>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setQuickViewOpen(false)}>
                Close
              </Button>
              <Button 
                variant="contained"
                onClick={() => {
                  onBookingClick(selectedBooking);
                  setQuickViewOpen(false);
                }}
              >
                View Details
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default BookingCalendarView;
