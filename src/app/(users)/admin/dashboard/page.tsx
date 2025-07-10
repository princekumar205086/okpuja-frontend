"use client";
import React from 'react';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Users, CheckCircle, Eye, Search, MousePointer, BarChart3 } from 'lucide-react';

// Import all dashboard components
import ProfessionalDashboardHeader from './components/ProfessionalDashboardHeader';
import ResponsiveStatsCard from './components/cards/ResponsiveStatsCard';
import RevenueChart from './components/charts/RevenueChart';
import BookingTrendsChart from './components/charts/BookingTrendsChart';
import ResponsiveBookingsTable from './components/tables/ResponsiveBookingsTable';
import QuickActionsWidget from './components/widgets/QuickActionsWidget';
import PlatformHealthWidget from './components/widgets/PlatformHealthWidget';
import ProfessionalActivitiesWidget from './components/widgets/ProfessionalActivitiesWidget';
import PerformanceMetricsWidget from './components/widgets/PerformanceMetricsWidget';
import NotificationsWidget from './components/widgets/NotificationsWidget';
import ResponsiveLayout from './components/ResponsiveLayout';

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // Mock stats data - replace with real API data
  const statsData = [
    {
      title: 'Total Revenue',
      value: 125000,
      icon: <TrendingUp className="w-6 h-6" />,
      change: '+12.5%',
      trend: 'up' as const,
      color: '#10b981'
    },
    {
      title: 'Total Bookings',
      value: 1250,
      icon: <Calendar className="w-6 h-6" />,
      change: '+8.2%',
      trend: 'up' as const,
      color: '#3b82f6'
    },
    {
      title: 'Active Astrologers',
      value: 48,
      icon: <Users className="w-6 h-6" />,
      change: '+4.1%',
      trend: 'up' as const,
      color: '#8b5cf6'
    },
    {
      title: 'Completion Rate',
      value: '94.8%',
      icon: <CheckCircle className="w-6 h-6" />,
      change: '+2.3%',
      trend: 'up' as const,
      color: '#10b981'
    },
    {
      title: 'Page Views',
      value: 45620,
      icon: <Eye className="w-6 h-6" />,
      change: '+18.7%',
      trend: 'up' as const,
      color: '#f59e0b'
    },
    {
      title: 'SEO Score',
      value: '89/100',
      icon: <Search className="w-6 h-6" />,
      change: '+5.2%',
      trend: 'up' as const,
      color: '#06b6d4'
    },
    {
      title: 'Conversion Rate',
      value: '3.45%',
      icon: <MousePointer className="w-6 h-6" />,
      change: '+1.2%',
      trend: 'up' as const,
      color: '#ef4444'
    },
    {
      title: 'Analytics Score',
      value: 92,
      icon: <BarChart3 className="w-6 h-6" />,
      change: '+7.8%',
      trend: 'up' as const,
      color: '#8b5cf6'
    },
  ];

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-gray-50">
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
          {/* Dashboard Header */}
          <ProfessionalDashboardHeader />

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ResponsiveStatsCard {...stat} index={index} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
            {/* Charts Section */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-4">
                {/* Revenue Chart */}
                <div className="col-span-1">
                  <RevenueChart />
                </div>
                
                {/* Mobile: Stack charts vertically */}
                {isMobile && (
                  <div className="col-span-1">
                    <BookingTrendsChart />
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: Side charts */}
            {!isMobile && (
              <div className="lg:col-span-4">
                <BookingTrendsChart />
              </div>
            )}
          </div>

          {/* Recent Bookings and Widgets */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
            {/* Recent Bookings Table */}
            <div className="xl:col-span-8">
              <ResponsiveBookingsTable />
            </div>

            {/* Widgets Column */}
            <div className="xl:col-span-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                {/* Quick Actions Widget */}
                <div>
                  <QuickActionsWidget />
                </div>

                {/* Platform Health Widget */}
                <div>
                  <PlatformHealthWidget />
                </div>

                {/* Performance Metrics Widget */}
                <div>
                  <PerformanceMetricsWidget />
                </div>

                {/* Notifications Widget */}
                <div>
                  <NotificationsWidget />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities Widget */}
          <div className="mb-6">
            <ProfessionalActivitiesWidget />
          </div>
        </Container>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminDashboard;
