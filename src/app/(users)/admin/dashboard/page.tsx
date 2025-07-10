"use client";
import React from 'react';
import { Box, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

// Import all dashboard components
import DashboardHeader from './components/DashboardHeader';
import StatsOverview from './components/cards/StatsOverview';
import RevenueChart from './components/charts/RevenueChart';
import BookingTrendsChart from './components/charts/BookingTrendsChart';
import RecentBookingsTable from './components/tables/RecentBookingsTable';
import QuickActionsWidget from './components/widgets/QuickActionsWidget';
import PlatformHealthWidget from './components/widgets/PlatformHealthWidget';
import RecentActivitiesWidget from './components/widgets/RecentActivitiesWidget';
import ResponsiveLayout from './components/ResponsiveLayout';

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <ResponsiveLayout>
      <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
        {/* Dashboard Header */}
        <DashboardHeader />

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <StatsOverview />
          </Box>
        </motion.div>

        {/* Main Dashboard Grid */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Charts Section */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {/* Revenue Chart */}
              <Grid size={{ xs: 12 }}>
                <RevenueChart />
              </Grid>
              
              {/* Mobile: Stack charts vertically */}
              {isMobile && (
                <Grid size={{ xs: 12 }}>
                  <BookingTrendsChart />
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Desktop: Side charts */}
          {!isMobile && (
            <Grid size={{ xs: 12, lg: 4 }}>
              <BookingTrendsChart />
            </Grid>
          )}

          {/* Recent Bookings Table */}
          <Grid size={{ xs: 12, xl: 8 }}>
            <RecentBookingsTable />
          </Grid>

          {/* Widgets Column */}
          <Grid size={{ xs: 12, xl: 4 }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {/* Quick Actions Widget */}
              <Grid size={{ xs: 12, md: 6, xl: 12 }}>
                <QuickActionsWidget />
              </Grid>

              {/* Platform Health Widget */}
              <Grid size={{ xs: 12, md: 6, xl: 12 }}>
                <PlatformHealthWidget />
              </Grid>
            </Grid>
          </Grid>

          {/* Recent Activities Widget */}
          <Grid size={{ xs: 12 }}>
            <RecentActivitiesWidget />
          </Grid>
        </Grid>
      </Container>
    </ResponsiveLayout>
  );
};

export default AdminDashboard;
