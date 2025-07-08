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
  LinearProgress,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  AutoAwesome as PujaIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/app/stores/authStore';

const EmployeeDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'My Bookings',
      value: '24',
      icon: <CalendarIcon sx={{ fontSize: 40, color: '#ff6b35' }} />,
      change: '+3 this week',
    },
    {
      title: 'Completed Services',
      value: '156',
      icon: <PujaIcon sx={{ fontSize: 40, color: '#059669' }} />,
      change: '+12 this month',
    },
    {
      title: 'Earnings',
      value: '₹45,000',
      icon: <PaymentIcon sx={{ fontSize: 40, color: '#4f46e5' }} />,
      change: '+₹8,000 this month',
    },
    {
      title: 'Rating',
      value: '4.8',
      icon: <StarIcon sx={{ fontSize: 40, color: '#f7931e' }} />,
      change: '125 reviews',
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      title: 'Ganesh Puja',
      client: 'Rajesh Kumar',
      date: 'Today, 10:00 AM',
      location: 'Mumbai, Maharashtra',
      amount: '₹5,000',
      status: 'Confirmed',
    },
    {
      id: 2,
      title: 'Astrology Consultation',
      client: 'Priya Singh',
      date: 'Tomorrow, 2:00 PM',
      location: 'Online',
      amount: '₹2,000',
      status: 'Confirmed',
    },
    {
      id: 3,
      title: 'Satyanarayan Puja',
      client: 'Amit Patel',
      date: 'Dec 10, 6:00 AM',
      location: 'Delhi, Delhi',
      amount: '₹8,000',
      status: 'Pending',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Completed':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Pandit {user?.full_name || 'Ji'}! 🙏
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your spiritual service dashboard
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4"
          >
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.1) 100%)',
                border: '1px solid rgba(255,107,53,0.2)',
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
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming Appointments */}
        <div className="w-full lg:w-2/3 mb-6 lg:mb-0">
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
            <Typography variant="h6" fontWeight="bold">
              Upcoming Appointments
            </Typography>
            <Button variant="outlined" size="small">
              View Schedule
            </Button>
              </div>
              <List>
            {upcomingAppointments.map((appointment) => (
              <ListItem
                key={appointment.id}
                sx={{
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 8,
                  marginBottom: 8,
                  '&:last-child': { marginBottom: 0 },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#ff6b35' }}>
                <PujaIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                <div className="flex justify-between items-center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {appointment.title}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {appointment.amount}
                  </Typography>
                </div>
                  }
                  secondary={
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Client: {appointment.client}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.date} • {appointment.location}
                  </Typography>
                  <div className="mt-1">
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status) as any}
                      size="small"
                    />
                  </div>
                </div>
                  }
                  primaryTypographyProps={{ component: "div" }}
                  secondaryTypographyProps={{ component: "div" }}
                />
              </ListItem>
            ))}
              </List>
            </div>
          </div>
        </div>

        {/* Performance & Quick Actions */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
              <div className="flex flex-col gap-2">
            <Button
              variant="contained"
              startIcon={<ScheduleIcon />}
              sx={{
                background: 'linear-gradient(to right, #ff6b35, #f7931e)',
                '&:hover': {
                  background: 'linear-gradient(to right, #e55a2e, #df7f1c)',
                },
              }}
              fullWidth
            >
              Update Schedule
            </Button>
            <Button
              variant="outlined"
              startIcon={<PujaIcon />}
              fullWidth
            >
              My Services
            </Button>
            <Button
              variant="outlined"
              startIcon={<PaymentIcon />}
              fullWidth
            >
              Earnings Report
            </Button>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-6">Performance</h2>
              <div className="mb-3">
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Monthly Target Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={75}
              sx={{
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(to right, #ff6b35, #f7931e)',
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              18 of 24 services completed (75%)
            </Typography>
              </div>
              <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Client Satisfaction</span>
              <span className="text-sm font-bold text-green-600">4.8/5.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Completion Rate</span>
              <span className="text-sm font-bold text-green-600">98%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Response Time</span>
              <span className="text-sm font-bold text-blue-600">2.3 hours</span>
            </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;
