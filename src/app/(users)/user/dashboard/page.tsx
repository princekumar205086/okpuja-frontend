"use client";
import React from 'react';
import { useAuthStore } from '@/app/stores/authStore';
import {
  WelcomeHeader,
  StatsGrid,
  UpcomingBookings,
  QuickActions,
  SpiritualProgress,
  RecentActivities,
  DashboardError,
  useDashboardData,
} from './index';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const {
    stats,
    upcomingBookings,
    recentActivities,
    loading,
    error,
    refreshData,
  } = useDashboardData();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <WelcomeHeader user={user} />
          <DashboardError error={error} onRetry={refreshData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <WelcomeHeader user={user} onRefresh={refreshData} loading={loading} />

        {/* Stats Grid */}
        <StatsGrid stats={stats} loading={loading} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Bookings */}
            <UpcomingBookings bookings={upcomingBookings} loading={loading} />
            
            {/* Quick Actions */}
            <QuickActions loading={loading} />
          </div>

          {/* Right Column - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Spiritual Progress */}
            <SpiritualProgress stats={stats} loading={loading} />
            
            {/* Recent Activities */}
            <RecentActivities activities={recentActivities} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
