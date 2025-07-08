"use client";
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  People as UsersIcon,
  AutoAwesome as PujaIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/app/stores/authStore';

const AdminDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Total Users',
      value: '2,456',
      icon: <UsersIcon sx={{ fontSize: 40, color: '#4f46e5' }} />,
      change: '+12% this month',
    },
    {
      title: 'Total Bookings',
      value: '1,234',
      icon: <CalendarIcon sx={{ fontSize: 40, color: '#ff6b35' }} />,
      change: '+8% this month',
    },
    {
      title: 'Revenue',
      value: '₹12,45,000',
      icon: <PaymentIcon sx={{ fontSize: 40, color: '#059669' }} />,
      change: '+15% this month',
    },
    {
      title: 'Active Priests',
      value: '89',
      icon: <StarIcon sx={{ fontSize: 40, color: '#f7931e' }} />,
      change: '5 new this week',
    },
  ];

  const recentBookings = [
    {
      id: 'B001',
      user: 'Rajesh Kumar',
      service: 'Ganesh Puja',
      priest: 'Pandit Sharma',
      date: '2024-12-07',
      amount: '₹5,000',
      status: 'Confirmed',
    },
    {
      id: 'B002',
      user: 'Priya Singh',
      service: 'Astrology Consultation',
      priest: 'Jyotish Acharya',
      date: '2024-12-08',
      amount: '₹2,000',
      status: 'Pending',
    },
    {
      id: 'B003',
      user: 'Amit Patel',
      service: 'Satyanarayan Puja',
      priest: 'Pandit Kumar',
      date: '2024-12-10',
      amount: '₹8,000',
      status: 'Confirmed',
    },
    {
      id: 'B004',
      user: 'Sunita Devi',
      service: 'Griha Pravesh Puja',
      priest: 'Pandit Verma',
      date: '2024-12-12',
      amount: '₹12,000',
      status: 'Pending',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard 🕉️
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage OKPUJA platform and monitor all activities
        </Typography>
      </Box>

      {/* Stats Grid */}
      <div className="w-full mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <div key={index} className="w-full">
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, rgba(79,70,229,0.1) 0%, rgba(255,107,53,0.1) 100%)',
                border: '1px solid rgba(79,70,229,0.2)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {stat.icon}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="primary">
                  {stat.change}
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Recent Bookings Table */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Bookings
                </Typography>
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Booking ID</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Priest</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id} hover>
                        <TableCell>{booking.id}</TableCell>
                        <TableCell>{booking.user}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.priest}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.amount}</TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status}
                            color={getStatusColor(booking.status) as any}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Analytics */}
        <div className="col-span-12 lg:col-span-4">
          <div className="flex flex-col gap-3">
            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Quick Actions
                </Typography>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="contained"
                    startIcon={<UsersIcon />}
                    sx={{
                      background: 'linear-gradient(to right, #4f46e5, #0ea5e9)',
                      '&:hover': {
                        background: 'linear-gradient(to right, #4338ca, #0284c7)',
                      },
                    }}
                    fullWidth
                  >
                    Manage Users
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PujaIcon />}
                    fullWidth
                  >
                    Add New Service
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<StarIcon />}
                    fullWidth
                  >
                    Manage Priests
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PaymentIcon />}
                    fullWidth
                  >
                    Payment Reports
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Platform Health */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Platform Health
                </Typography>
                <div className="flex flex-col gap-2">
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      Active Users (Last 24h)
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      456 Users
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      Pending Approvals
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      12 Priests
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      System Status
                    </Typography>
                    <Chip label="All Systems Operational" color="success" size="small" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default AdminDashboard;
