'use client';

import React, { useState } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Chip, 
  Tab, 
  Tabs, 
  Card, 
  CardContent,
  Divider,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface BookingDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  onAction: (action: string, bookingId: string) => void;
  type?: 'astrology' | 'regular' | 'puja';
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} style={{ height: '100%' }}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const BookingDetailsDrawer: React.FC<BookingDetailsDrawerProps> = ({
  open,
  onClose,
  booking,
  onAction,
  type = 'astrology'
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!booking) return null;

  // Extract customer name - try to get real name, fallback to extracted from email
  const extractNameFromEmail = (email: string) => {
    if (!email || email === 'N/A') return 'N/A';
    const name = email.split('@')[0];
    return name.split(/[._-]/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Convert HTML to plain text
  const htmlToPlainText = (html: string) => {
    if (!html) return '';
    // Remove HTML tags and decode HTML entities
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Handle different booking types
  const bookingId = booking.astro_book_id || booking.book_id || booking.id;
  const rawCustomerName = booking.user?.username || booking.user_name || booking.customer_name || booking.contact_name;
  const customerEmail = booking.user?.email || booking.user_email || booking.contact_email || 'N/A';
  const customerName = rawCustomerName || extractNameFromEmail(customerEmail) || 'N/A';
  const customerPhone = booking.user?.phone || booking.user_phone || booking.contact_phone || booking.contact_number || 'N/A';
  const amount = booking.service?.price || booking.package_price || booking.total_amount || 0;
  const serviceTitle = booking.service?.title || booking.service_title || booking.package_name || 'Service';
  const status = booking.status || 'N/A';
  
  // Enhanced address handling for different booking types
  let address = 'N/A';
  if (type === 'puja') {
    address = booking.address_full || booking.address || booking.delivery_address || booking.location || 'N/A';
  } else if (type === 'astrology') {
    address = booking.birth_place || booking.location || 'N/A';
  } else {
    address = booking.address_full || booking.address || booking.location || 'N/A';
  }
  
  const scheduledDate = booking.selected_date || booking.booking_date || booking.preferred_date || 'N/A';
  const scheduledTime = booking.selected_time || booking.start_time || booking.preferred_time || 'N/A';
  const createdAt = booking.created_at || booking.created_date || 'N/A';

  const getStatusColor = (status: string) => {
    const statusColors = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      IN_PROGRESS: 'secondary',
      COMPLETED: 'success',
      CANCELLED: 'error',
      REJECTED: 'error',
      FAILED: 'error',
    };
    return statusColors[status as keyof typeof statusColors] || 'warning';
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          height: isMobile ? '95vh' : '85vh',
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
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              {serviceTitle}
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
              ID: {bookingId}
            </Typography>
            <Chip 
              label={status.toUpperCase()} 
              color={getStatusColor(status) as any}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, ml: 'auto' }}>
              ₹{amount}
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Overview" />
            <Tab label="Details" />
            <Tab label="History" />
          </Tabs>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                gap: 3 
              }}>
                {/* Customer Information */}
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <UserIcon className="w-5 h-5 text-white" />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Customer Information
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IdentificationIcon className="w-5 h-5 text-gray-400" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Name</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>{customerName}</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="body2" color="text.secondary">Email</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                            {customerEmail}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PhoneIcon className="w-5 h-5 text-gray-400" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Phone</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>{customerPhone}</Typography>
                        </Box>
                      </Box>
                      
                      {address !== 'N/A' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <MapPinIcon className="w-5 h-5 text-gray-400" />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="body2" color="text.secondary">Location</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{address}</Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>

                {/* Booking Information */}
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CalendarDaysIcon className="w-5 h-5 text-white" />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Booking Details
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Scheduled Date</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {scheduledDate !== 'N/A' ? new Date(scheduledDate).toLocaleDateString() : 'Not Set'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ClockIcon className="w-5 h-5 text-gray-400" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Scheduled Time</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>{scheduledTime}</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CurrencyRupeeIcon className="w-5 h-5 text-gray-400" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Amount</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: 'success.main' }}>
                            ₹{amount}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Service Type</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {type.charAt(0).toUpperCase() + type.slice(1)} Service
                          </Typography>
                        </Box>
                      </Box>
                      
                      {createdAt !== 'N/A' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <ClockIcon className="w-5 h-5 text-gray-400" />
                          <Box>
                            <Typography variant="body2" color="text.secondary">Created</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {new Date(createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box sx={{ p: 3 }}>
              {/* Service Details */}
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Service Information
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Service Name</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {serviceTitle}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Price</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: 'success.main' }}>
                        ₹{amount}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Service Type</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Service
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip 
                        label={status.toUpperCase()} 
                        color={getStatusColor(status) as any}
                        size="small"
                        sx={{ fontWeight: 600, alignSelf: 'start' }}
                      />
                    </Box>
                    {(booking.service?.description || booking.description) && (
                      <Box sx={{ gridColumn: '1 / -1' }}>
                        <Typography variant="body2" color="text.secondary">Description</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {htmlToPlainText(booking.service?.description || booking.description)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Address & Location Details */}
              {address !== 'N/A' && (
                <Card elevation={2} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {type === 'puja' ? 'Service Address' : type === 'astrology' ? 'Birth Place' : 'Address'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <MapPinIcon className="w-5 h-5 text-gray-400" />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {address}
                      </Typography>
                    </Box>
                    
                    {/* Additional puja-specific address fields */}
                    {type === 'puja' && (
                      <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        {booking.city && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">City</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{booking.city}</Typography>
                          </Box>
                        )}
                        {booking.state && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">State</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{booking.state}</Typography>
                          </Box>
                        )}
                        {booking.pincode && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">Pincode</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{booking.pincode}</Typography>
                          </Box>
                        )}
                        {booking.landmark && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">Landmark</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{booking.landmark}</Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Astrology Specific Details */}
              {type === 'astrology' && (
                <Card elevation={2} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Astrology Details
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      {booking.birth_date && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Birth Date</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {new Date(booking.birth_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                      {booking.birth_time && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Birth Time</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {booking.birth_time}
                          </Typography>
                        </Box>
                      )}
                      {booking.gender && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Gender</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {booking.gender}
                          </Typography>
                        </Box>
                      )}
                      {booking.question && (
                        <Box sx={{ gridColumn: '1 / -1' }}>
                          <Typography variant="body2" color="text.secondary">Question/Query</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {booking.question}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Puja Specific Details */}
              {type === 'puja' && (
                <Card elevation={2} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Puja Details
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      {booking.puja_date && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Puja Date</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {new Date(booking.puja_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                      {booking.puja_time && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Puja Time</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {booking.puja_time}
                          </Typography>
                        </Box>
                      )}
                      {booking.devotee_name && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Devotee Name</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {booking.devotee_name}
                          </Typography>
                        </Box>
                      )}
                      {booking.gotra && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Gotra</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {booking.gotra}
                          </Typography>
                        </Box>
                      )}
                      {booking.special_request && (
                        <Box sx={{ gridColumn: '1 / -1' }}>
                          <Typography variant="body2" color="text.secondary">Special Request</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {booking.special_request}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Schedule Details */}
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Schedule Information
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Scheduled Date</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {scheduledDate !== 'N/A' ? new Date(scheduledDate).toLocaleDateString() : 'Not Set'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Scheduled Time</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {scheduledTime}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Created On</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {createdAt !== 'N/A' ? new Date(createdAt).toLocaleDateString() : 'Unknown'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Booking ID</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                        {bookingId}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Payment Information */}
              {(booking.payment_status || booking.payment_method || booking.transaction_id) && (
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Payment Information
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      {booking.payment_status && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Payment Status</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {booking.payment_status}
                          </Typography>
                        </Box>
                      )}
                      {booking.payment_method && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {booking.payment_method}
                          </Typography>
                        </Box>
                      )}
                      {booking.transaction_id && (
                        <Box sx={{ gridColumn: '1 / -1' }}>
                          <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                            {booking.transaction_id}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box sx={{ p: 3 }}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Booking History
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status updates and modifications will appear here.
                  </Typography>
                  {/* Add actual history implementation here */}
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">
                      📅 {createdAt !== 'N/A' ? new Date(createdAt).toLocaleString() : 'Unknown'} - Booking Created
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </Box>

        {/* Actions */}
        <Box sx={{ 
          p: 3, 
          borderTop: 1, 
          borderColor: 'divider', 
          bgcolor: 'grey.50',
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          flexWrap: 'wrap'
        }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => onAction('reschedule', bookingId)}
            sx={{ bgcolor: 'primary.main' }}
          >
            Reschedule
          </Button>
          <Button 
            variant="contained" 
            onClick={() => onAction('edit', bookingId)}
            sx={{ bgcolor: 'warning.main' }}
          >
            Edit Booking
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default BookingDetailsDrawer;