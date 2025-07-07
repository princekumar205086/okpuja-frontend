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
  LinearProgress,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AutoAwesome as PujaIcon,
  StarBorder as AstrologyIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/app/stores/authStore';

const UserDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Total Bookings',
      value: '12',
      icon: <CalendarIcon sx={{ fontSize: 40, color: '#ff6b35' }} />,
      change: '+3 this month',
    },
    {
      title: 'Upcoming Pujas',
      value: '3',
      icon: <PujaIcon sx={{ fontSize: 40, color: '#f7931e' }} />,
      change: 'Next: Tomorrow',
    },
    {
      title: 'Consultations',
      value: '8',
      icon: <AstrologyIcon sx={{ fontSize: 40, color: '#4f46e5' }} />,
      change: '2 scheduled',
    },
    {
      title: 'Total Spent',
      value: '₹25,000',
      icon: <PaymentIcon sx={{ fontSize: 40, color: '#059669' }} />,
      change: '+₹5,000 this month',
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      title: 'Ganesh Puja',
      date: 'Tomorrow, 10:00 AM',
      priest: 'Pandit Raj Kumar',
      status: 'Confirmed',
    },
    {
      id: 2,
      title: 'Astrology Consultation',
      date: 'Dec 8, 2:00 PM',
      priest: 'Jyotish Acharya Singh',
      status: 'Pending',
    },
    {
      id: 3,
      title: 'Satyanarayan Puja',
      date: 'Dec 10, 6:00 AM',
      priest: 'Pandit Sharma',
      status: 'Confirmed',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.full_name || 'User'}! 🙏
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your spiritual journey overview
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="h-full bg-gradient-to-br from-orange-100/50 to-orange-200/30 border border-orange-300/40 rounded-lg"
            >
              <div className="p-6">
            <div className="flex items-center mb-4">
              <span className="">{stat.icon}</span>
              <div className="ml-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.title}</div>
              </div>
            </div>
            <div className="text-xs text-orange-600 font-medium">{stat.change}</div>
              </div>
            </div>
          ))}
        </div>
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming Bookings */}
        <div className="w-full md:w-2/3 pr-0 md:pr-6 mb-6 md:mb-0">
          <Card>
            <CardContent>
              <div className="flex justify-between items-center mb-3">
            <Typography variant="h6" fontWeight="bold">
              Upcoming Bookings
            </Typography>
            <Button variant="outlined" size="small">
              View All
            </Button>
              </div>
              <List>
            {upcomingBookings.map((booking, index) => (
              <ListItem
                key={booking.id}
                sx={{
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  mb: 1,
                  '&:last-child': { mb: 0 },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#ff6b35' }}>
                <PujaIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={booking.title}
                  secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {booking.date}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Priest: {booking.priest}
                  </Typography>
                </Box>
                  }
                />
                <Chip
                  label={booking.status}
                  color={getStatusColor(booking.status) as any}
                  size="small"
                />
              </ListItem>
            ))}
              </List>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PujaIcon />}
              sx={{
                background: 'linear-gradient(to right, #ff6b35, #f7931e)',
                '&:hover': {
                  background: 'linear-gradient(to right, #e55a2e, #df7f1c)',
                },
              }}
              fullWidth
            >
              Book a Puja
            </Button>
            <Button
              variant="outlined"
              startIcon={<AstrologyIcon />}
              fullWidth
            >
              Astrology Consultation
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalendarIcon />}
              fullWidth
            >
              View Calendar
            </Button>
              </Box>

              <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              Spiritual Progress
            </Typography>
            <Typography variant="caption" color="text.secondary">
              You've completed 8 out of 12 planned pujas this year
            </Typography>
            <LinearProgress
              variant="determinate"
              value={67}
              sx={{
                mt: 1,
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(to right, #ff6b35, #f7931e)',
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              67% Complete
            </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
