'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  Button,
} from '@mui/material';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface DailyBookingListProps {
  date: Date | null;
  bookings: any[];
  type: 'astrology' | 'puja';
  onBookingClick: (booking: any) => void;
  onReschedule: (booking: any) => void;
  onStatusChange: (booking: any) => void;
}

const DailyBookingList: React.FC<DailyBookingListProps> = ({
  date,
  bookings,
  type,
  onBookingClick,
  onReschedule,
  onStatusChange,
}) => {
  if (!date) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            py: 8 
          }}>
            <CalendarDaysIcon className="w-16 h-16 text-gray-300 mb-4" />
            <Typography variant="h6" color="text.secondary">
              Select a date to view bookings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click on any date in the calendar to see daily bookings
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const dailyBookings = bookings.filter(booking => {
    const bookingDate = new Date(
      booking.selected_date || 
      booking.booking_date || 
      booking.preferred_date ||
      booking.puja_date ||
      booking.created_at
    );
    return (
      bookingDate.getDate() === date.getDate() &&
      bookingDate.getMonth() === date.getMonth() &&
      bookingDate.getFullYear() === date.getFullYear()
    );
  });

  const getStatusColor = (status: string) => {
    const statusColors = {
      PENDING: 'warning',
      pending: 'warning',
      CONFIRMED: 'info',
      confirmed: 'info',
      IN_PROGRESS: 'secondary',
      in_progress: 'secondary',
      COMPLETED: 'success',
      completed: 'success',
      CANCELLED: 'error',
      cancelled: 'error',
      REJECTED: 'error',
      rejected: 'error',
      FAILED: 'error',
      failed: 'error',
    };
    return statusColors[status as keyof typeof statusColors] || 'warning';
  };

  const formatTime = (timeString: string) => {
    if (!timeString || timeString === 'N/A') return 'Time TBD';
    try {
      // Handle different time formats
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  return (
    <Card elevation={2}>
      <CardContent>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dailyBookings.length} {type} booking{dailyBookings.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Bookings List */}
        {dailyBookings.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            py: 6 
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No bookings for this date
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All clear for {date.toLocaleDateString()}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {dailyBookings
              .sort((a, b) => {
                const timeA = a.selected_time || a.start_time || a.preferred_time || a.puja_time || '00:00';
                const timeB = b.selected_time || b.start_time || b.preferred_time || b.puja_time || '00:00';
                return timeA.localeCompare(timeB);
              })
              .map((booking, index) => {
                const customerName = 
                  booking.user?.username || 
                  booking.user_name || 
                  booking.customer_name || 
                  booking.contact_name ||
                  'Unknown Customer';
                
                const customerEmail = 
                  booking.user?.email || 
                  booking.user_email || 
                  booking.contact_email || 
                  'N/A';

                const customerPhone = 
                  booking.user?.phone || 
                  booking.user_phone || 
                  booking.contact_phone || 
                  booking.contact_number || 
                  'N/A';
                
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
                  'TBD';

                const amount = 
                  booking.service?.price || 
                  booking.package_price || 
                  booking.total_amount || 
                  0;

                const address = 
                  booking.address_full || 
                  booking.address || 
                  booking.birth_place ||
                  booking.location ||
                  'N/A';

                const bookingId = 
                  booking.astro_book_id || 
                  booking.book_id || 
                  booking.id;

                return (
                  <Card 
                    key={index} 
                    variant="outlined" 
                    sx={{ 
                      '&:hover': { 
                        boxShadow: 2, 
                        transform: 'translateY(-2px)' 
                      },
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => onBookingClick(booking)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        justifyContent: 'space-between',
                        mb: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: 'primary.main', 
                            width: 48, 
                            height: 48 
                          }}>
                            <UserIcon className="w-6 h-6" />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {serviceTitle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {bookingId}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={booking.status?.toUpperCase() || 'PENDING'} 
                            color={getStatusColor(booking.status || 'pending') as any}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                            ₹{amount}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                        gap: 2,
                        mb: 3
                      }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            <Typography variant="body2" color="text.secondary">Customer</Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {customerName}
                          </Typography>
                          
                          {customerEmail !== 'N/A' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                              <Typography variant="body2" color="text.secondary">
                                {customerEmail}
                              </Typography>
                            </Box>
                          )}
                          
                          {customerPhone !== 'N/A' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <PhoneIcon className="w-4 h-4 text-gray-400" />
                              <Typography variant="body2" color="text.secondary">
                                {customerPhone}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                            <Typography variant="body2" color="text.secondary">Time</Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatTime(scheduledTime)}
                          </Typography>
                          
                          {address !== 'N/A' && (
                            <Box sx={{ mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <MapPinIcon className="w-4 h-4 text-gray-400" />
                                <Typography variant="body2" color="text.secondary">Location</Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {address.length > 50 ? `${address.substring(0, 50)}...` : address}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Action Buttons */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: 1 
                      }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onBookingClick(booking);
                            }}
                            sx={{ color: 'primary.main' }}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Reschedule">
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReschedule(booking);
                            }}
                            sx={{ color: 'warning.main' }}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Change Status">
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(booking);
                            }}
                            sx={{ color: 'success.main' }}
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyBookingList;