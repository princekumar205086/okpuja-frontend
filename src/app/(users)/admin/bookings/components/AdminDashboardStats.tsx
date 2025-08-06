'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Schedule,
  CheckCircle,
  Cancel,
  Payment,
  Person,
  Star,
  AttachMoney,
  Group,
  Analytics,
  Warning,
  Pending
} from '@mui/icons-material';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  pendingPayments: number;
  avgBookingValue: number;
  customerSatisfaction: number;
  staffUtilization: number;
  conversionRate: number;
  growthRate: number;
}

interface AdminDashboardStatsProps {
  stats: DashboardStats;
}

const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({ stats }) => {
  const theme = useTheme();

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: number;
    subtitle?: string;
    progress?: number;
  }> = ({ title, value, icon, color, trend, subtitle, progress }) => (
    <Card 
      sx={{ 
        height: '100%', 
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        borderRadius: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${color}20`
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
            {icon}
          </Avatar>
          {trend !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend > 0 ? (
                <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 18, color: 'error.main' }} />
              )}
              <Typography 
                variant="caption" 
                sx={{ 
                  color: trend > 0 ? 'success.main' : 'error.main',
                  fontWeight: 600 
                }}
              >
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        )}
        
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: `${color}20`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color
                }
              }} 
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
              {progress}% of target
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ mb: 4 }}>
      {/* Key Metrics */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
        Key Performance Metrics
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: 3, 
        mb: 4 
      }}>
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<Schedule />}
          color={theme.palette.primary.main}
          trend={stats.growthRate}
          subtitle="This month"
        />
        
        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={<Pending />}
          color={theme.palette.warning.main}
          subtitle="Requires attention"
        />
        
        <StatCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
          icon={<AttachMoney />}
          color={theme.palette.success.main}
          trend={15.2}
          subtitle="This month"
        />
        
        <StatCard
          title="Avg Booking Value"
          value={`₹${stats.avgBookingValue.toLocaleString()}`}
          icon={<Analytics />}
          color={theme.palette.info.main}
          trend={8.5}
          subtitle="Per booking"
        />
      </Box>

      {/* Status Distribution */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
        Booking Status Overview
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, 
        gap: 3, 
        mb: 4 
      }}>
        <StatCard
          title="Confirmed"
          value={stats.confirmedBookings}
          icon={<CheckCircle />}
          color={theme.palette.info.main}
          progress={(stats.confirmedBookings / stats.totalBookings) * 100}
        />
        
        <StatCard
          title="Completed"
          value={stats.completedBookings}
          icon={<CheckCircle />}
          color={theme.palette.success.main}
          progress={(stats.completedBookings / stats.totalBookings) * 100}
        />
        
        <StatCard
          title="Cancelled"
          value={stats.cancelledBookings}
          icon={<Cancel />}
          color={theme.palette.error.main}
          progress={(stats.cancelledBookings / stats.totalBookings) * 100}
        />
        
        <StatCard
          title="Customer Rating"
          value={`${stats.customerSatisfaction}/5`}
          icon={<Star />}
          color={theme.palette.warning.main}
          progress={stats.customerSatisfaction * 20}
          subtitle="Average rating"
        />
        
        <StatCard
          title="Staff Utilization"
          value={`${stats.staffUtilization}%`}
          icon={<Group />}
          color={theme.palette.secondary.main}
          progress={stats.staffUtilization}
          subtitle="Resource usage"
        />
      </Box>

      {/* Quick Actions & Alerts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Box>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recent Activity & Alerts
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Payment Alerts */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Warning sx={{ color: 'warning.dark' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Pending Payments Alert
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ₹{stats.pendingPayments.toLocaleString()} in pending payments require attention
                  </Typography>
                </Box>
              </Box>
              
              {/* Staff Utilization Alert */}
              {stats.staffUtilization < 70 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Group sx={{ color: 'info.dark' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Low Staff Utilization
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Staff utilization at {stats.staffUtilization}% - consider reassigning resources
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {/* High Demand Alert */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <TrendingUp sx={{ color: 'success.dark' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    High Booking Volume
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.growthRate}% increase in bookings this month
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
        
        <Box>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Stats
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Conversion Rate</Typography>
                <Chip 
                  label={`${stats.conversionRate}%`} 
                  size="small" 
                  color="primary" 
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Peak Hours</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  10 AM - 2 PM
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Top Service</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Grah Shanti
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Active Staff</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  12/15
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboardStats;
