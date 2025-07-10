"use client";
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  MoreVert, 
  Visibility, 
  Edit, 
  Delete, 
  GetApp,
  FilterList,
  Search,
} from '@mui/icons-material';

interface Booking {
  id: string;
  user: string;
  service: string;
  priest: string;
  date: string;
  amount: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  avatar?: string;
  serviceType: 'puja' | 'astrology';
}

const RecentBookingsTable: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedBooking, setSelectedBooking] = React.useState<string | null>(null);

  const recentBookings: Booking[] = [
    {
      id: 'PB001',
      user: 'Rajesh Kumar',
      service: 'Ganesh Puja',
      priest: 'Pandit Sharma',
      date: '2024-12-07',
      amount: '₹5,000',
      status: 'Confirmed',
      serviceType: 'puja',
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 'AB002',
      user: 'Priya Singh',
      service: 'Birth Chart Reading',
      priest: 'Jyotish Acharya',
      date: '2024-12-08',
      amount: '₹2,000',
      status: 'Pending',
      serviceType: 'astrology',
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 'PB003',
      user: 'Amit Patel',
      service: 'Satyanarayan Puja',
      priest: 'Pandit Kumar',
      date: '2024-12-10',
      amount: '₹8,000',
      status: 'Completed',
      serviceType: 'puja',
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 'AB004',
      user: 'Sunita Devi',
      service: 'Kundali Matching',
      priest: 'Pandit Verma',
      date: '2024-12-12',
      amount: '₹3,500',
      status: 'Confirmed',
      serviceType: 'astrology',
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 'PB005',
      user: 'Vikram Sharma',
      service: 'Griha Pravesh Puja',
      priest: 'Pandit Gupta',
      date: '2024-12-15',
      amount: '₹12,000',
      status: 'Pending',
      serviceType: 'puja',
      avatar: '/api/placeholder/40/40',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return { color: 'info', bg: '#1976d220' };
      case 'Pending':
        return { color: 'warning', bg: '#ed6c0220' };
      case 'Cancelled':
        return { color: 'error', bg: '#d32f2f20' };
      case 'Completed':
        return { color: 'success', bg: '#2e7d3220' };
      default:
        return { color: 'default', bg: '#00000010' };
    }
  };

  const getServiceTypeColor = (type: string) => {
    return type === 'puja' ? '#ff6b35' : '#8b5cf6';
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, bookingId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(bookingId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Bookings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Latest service bookings and their status
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<FilterList />}
                  sx={{ minWidth: 'auto' }}
                >
                  Filter
                </Button>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ 
                    background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #4338ca, #6d28d9)',
                    }
                  }}
                >
                  View All
                </Button>
              </Box>
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Booking ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Service</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Priest</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentBookings.map((booking, index) => {
                  const MotionTableRow = motion(TableRow);
                  return (
                    <MotionTableRow
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      sx={{
                        '&:hover': { backgroundColor: '#f8fafc' },
                        borderLeft: `4px solid ${getServiceTypeColor(booking.serviceType)}`,
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: getServiceTypeColor(booking.serviceType)
                            }}
                          />
                          <Typography variant="body2" fontWeight="medium">
                            {booking.id}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{ width: 32, height: 32 }}
                            src={booking.avatar}
                          >
                            {booking.user.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium">
                            {booking.user}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {booking.service}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.serviceType === 'puja' ? 'Puja Service' : 'Astrology Service'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {booking.priest}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(booking.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {booking.amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(booking.status).bg,
                            color: `${getStatusColor(booking.status).color}.main`,
                            fontWeight: 'medium',
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, booking.id)}
                          sx={{ color: 'text.secondary' }}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </MotionTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 0.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1 }}>
          <Visibility fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1 }}>
          <Edit fontSize="small" />
          Edit Booking
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1 }}>
          <GetApp fontSize="small" />
          Download Receipt
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1, color: 'error.main' }}>
          <Delete fontSize="small" />
          Cancel Booking
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default RecentBookingsTable;
