'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Badge,
  Tooltip,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface BookingCalendarProps {
  bookings: any[];
  type: 'astrology' | 'puja';
  onBookingClick: (booking: any) => void;
  onDateSelect: (date: Date) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: any[];
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  type,
  onBookingClick,
  onDateSelect,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Status color mapping
  const getStatusColor = (status: string) => {
    const statusColors = {
      PENDING: '#f59e0b',
      pending: '#f59e0b',
      CONFIRMED: '#3b82f6',
      confirmed: '#3b82f6',
      IN_PROGRESS: '#8b5cf6',
      in_progress: '#8b5cf6',
      COMPLETED: '#10b981',
      completed: '#10b981',
      CANCELLED: '#ef4444',
      cancelled: '#ef4444',
      REJECTED: '#ef4444',
      rejected: '#ef4444',
      FAILED: '#ef4444',
      failed: '#ef4444',
    };
    return statusColors[status as keyof typeof statusColors] || statusColors.pending;
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfCalendar = new Date(firstDayOfMonth);
    firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfCalendar.getDay());
    
    const days: CalendarDay[] = [];
    const currentDay = new Date(firstDayOfCalendar);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const dayBookings = bookings.filter(booking => {
        const bookingDate = new Date(
          booking.selected_date || 
          booking.booking_date || 
          booking.preferred_date ||
          booking.puja_date ||
          booking.created_at
        );
        return (
          bookingDate.getDate() === currentDay.getDate() &&
          bookingDate.getMonth() === currentDay.getMonth() &&
          bookingDate.getFullYear() === currentDay.getFullYear()
        );
      });

      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === new Date().toDateString(),
        bookings: dayBookings,
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  }, [currentDate, bookings]);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
    onDateSelect(new Date());
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    onDateSelect(day.date);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card elevation={2}>
      <CardContent>
        {/* Calendar Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {type.charAt(0).toUpperCase() + type.slice(1)} Bookings Calendar
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={goToToday}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Today
          </Button>
        </Box>

        {/* Month Navigation */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3 
        }}>
          <IconButton onClick={goToPreviousMonth} size="small">
            <ChevronLeftIcon className="w-5 h-5" />
          </IconButton>
          
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          
          <IconButton onClick={goToNextMonth} size="small">
            <ChevronRightIcon className="w-5 h-5" />
          </IconButton>
        </Box>

        {/* Calendar Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: 1,
          mb: 2
        }}>
          {/* Week day headers */}
          {weekDays.map((day) => (
            <Box
              key={day}
              sx={{
                p: 1,
                textAlign: 'center',
                fontWeight: 600,
                color: 'text.secondary',
                borderBottom: 1,
                borderColor: 'divider'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {isMobile ? day.charAt(0) : day}
              </Typography>
            </Box>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <Box
              key={index}
              onClick={() => handleDayClick(day)}
              sx={{
                minHeight: isMobile ? 60 : 80,
                p: 0.5,
                cursor: 'pointer',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: day.isCurrentMonth ? 'background.paper' : 'grey.50',
                opacity: day.isCurrentMonth ? 1 : 0.6,
                position: 'relative',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: day.isCurrentMonth ? 'primary.50' : 'grey.100',
                  transform: 'scale(1.02)',
                },
                ...(day.isToday && {
                  bgcolor: 'primary.100',
                  border: 2,
                  borderColor: 'primary.main',
                }),
                ...(selectedDate && 
                  selectedDate.toDateString() === day.date.toDateString() && {
                  bgcolor: 'secondary.100',
                  border: 2,
                  borderColor: 'secondary.main',
                })
              }}
            >
              {/* Day number */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: day.isToday ? 600 : 400,
                  color: day.isCurrentMonth ? 'text.primary' : 'text.secondary',
                  mb: 0.5
                }}
              >
                {day.date.getDate()}
              </Typography>

              {/* Booking indicators */}
              {day.bookings.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 0.5,
                  maxHeight: isMobile ? 30 : 50,
                  overflow: 'hidden'
                }}>
                  {day.bookings.slice(0, isMobile ? 1 : 2).map((booking, bookingIndex) => {
                    const customerName = 
                      booking.user?.username || 
                      booking.user_name || 
                      booking.customer_name || 
                      booking.contact_name ||
                      'Unknown';
                    
                    const serviceTitle = 
                      booking.service?.title || 
                      booking.service_title || 
                      booking.package_name || 
                      'Service';

                    const scheduledTime = 
                      booking.selected_time || 
                      booking.start_time || 
                      booking.preferred_time ||
                      booking.puja_time ||
                      'Time TBD';

                    return (
                      <Tooltip
                        key={bookingIndex}
                        title={
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {serviceTitle}
                            </Typography>
                            <Typography variant="caption">
                              Customer: {customerName}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Time: {scheduledTime}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Status: {booking.status?.toUpperCase() || 'PENDING'}
                            </Typography>
                          </Box>
                        }
                        arrow
                      >
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookingClick(booking);
                          }}
                          sx={{
                            width: '100%',
                            height: isMobile ? 4 : 8,
                            borderRadius: 0.5,
                            bgcolor: getStatusColor(booking.status || 'pending'),
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              opacity: 0.8,
                              transform: 'scale(1.05)',
                            }
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                  
                  {day.bookings.length > (isMobile ? 1 : 2) && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: '0.7rem',
                        color: 'text.secondary',
                        textAlign: 'center'
                      }}
                    >
                      +{day.bookings.length - (isMobile ? 1 : 2)} more
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* Legend */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          justifyContent: 'center',
          mt: 3,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: '#f59e0b', borderRadius: 0.5 }} />
            <Typography variant="caption">Pending</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: '#3b82f6', borderRadius: 0.5 }} />
            <Typography variant="caption">Confirmed</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: '#8b5cf6', borderRadius: 0.5 }} />
            <Typography variant="caption">In Progress</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: '#10b981', borderRadius: 0.5 }} />
            <Typography variant="caption">Completed</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: '#ef4444', borderRadius: 0.5 }} />
            <Typography variant="caption">Cancelled/Failed</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookingCalendar;
