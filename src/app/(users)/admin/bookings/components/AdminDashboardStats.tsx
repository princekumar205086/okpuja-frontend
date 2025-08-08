'use client';

import React from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  UserIcon,
  StarIcon,
  BanknotesIcon,
  UsersIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  PauseCircleIcon
} from '@heroicons/react/24/outline';

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
  astrologyData?: any;
  regularData?: any;
  pujaData?: any;
  loading?: boolean;
}

const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({ 
  astrologyData, 
  regularData, 
  pujaData, 
  loading = false 
}) => {
  // Combine all dashboard data
  const combinedStats = {
    totalBookings: (astrologyData?.total_bookings || 0) + (regularData?.total_bookings || 0) + (pujaData?.total_bookings || 0),
    pendingBookings: (astrologyData?.pending_bookings || 0) + (regularData?.pending_bookings || 0) + (pujaData?.pending_bookings || 0),
    confirmedBookings: (astrologyData?.confirmed_bookings || 0) + (regularData?.confirmed_bookings || 0) + (pujaData?.confirmed_bookings || 0),
    completedBookings: (astrologyData?.completed_bookings || 0) + (regularData?.completed_bookings || 0) + (pujaData?.completed_bookings || 0),
    cancelledBookings: (astrologyData?.cancelled_bookings || 0) + (regularData?.cancelled_bookings || 0) + (pujaData?.cancelled_bookings || 0),
    totalRevenue: parseFloat(astrologyData?.total_revenue || '0') + parseFloat(regularData?.total_revenue || '0') + parseFloat(pujaData?.total_revenue || '0'),
    avgBookingValue: parseFloat(astrologyData?.average_booking_value || '0'),
    pendingPayments: (astrologyData?.pending_sessions || 0) + (regularData?.pending_bookings || 0),
    customerSatisfaction: 4.5, // Default value since not provided by API
    staffUtilization: 85, // Default value
    conversionRate: 78, // Default value
    growthRate: 12.5, // Default value
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: number;
    subtitle?: string;
    progress?: number;
  }> = ({ title, value, icon, color, trend, subtitle, progress }) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 ${color}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className="flex items-center space-x-1">
            {trend > 0 ? (
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
      
      {subtitle && (
        <div className="text-xs text-gray-500 mb-3">{subtitle}</div>
      )}
      
      {progress !== undefined && (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${color}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">{progress}% of target</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-8">
      {/* Key Metrics */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Key Performance Metrics
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value={combinedStats.totalBookings}
          icon={<ClockIcon className="h-6 w-6 text-blue-600" />}
          color="border-blue-200"
          trend={combinedStats.growthRate}
          subtitle="This month"
        />
        
        <StatCard
          title="Pending Bookings"
          value={combinedStats.pendingBookings}
          icon={<PauseCircleIcon className="h-6 w-6 text-yellow-600" />}
          color="border-yellow-200"
          subtitle="Requires attention"
        />
        
        <StatCard
          title="Total Revenue"
          value={`₹${(combinedStats.totalRevenue / 100000).toFixed(1)}L`}
          icon={<BanknotesIcon className="h-6 w-6 text-green-600" />}
          color="border-green-200"
          trend={15.2}
          subtitle="This month"
        />
        
        <StatCard
          title="Avg Booking Value"
          value={`₹${combinedStats.avgBookingValue.toLocaleString()}`}
          icon={<ChartBarIcon className="h-6 w-6 text-indigo-600" />}
          color="border-indigo-200"
          trend={8.5}
          subtitle="Per booking"
        />
      </div>

      {/* Status Distribution */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Booking Status Overview
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Confirmed"
          value={combinedStats.confirmedBookings}
          icon={<CheckCircleIcon className="h-6 w-6 text-blue-600" />}
          color="border-blue-200"
          progress={combinedStats.totalBookings > 0 ? (combinedStats.confirmedBookings / combinedStats.totalBookings) * 100 : 0}
        />
        
        <StatCard
          title="Completed"
          value={combinedStats.completedBookings}
          icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
          color="border-green-200"
          progress={combinedStats.totalBookings > 0 ? (combinedStats.completedBookings / combinedStats.totalBookings) * 100 : 0}
        />
        
        <StatCard
          title="Cancelled"
          value={combinedStats.cancelledBookings}
          icon={<XCircleIcon className="h-6 w-6 text-red-600" />}
          color="border-red-200"
          progress={combinedStats.totalBookings > 0 ? (combinedStats.cancelledBookings / combinedStats.totalBookings) * 100 : 0}
        />
        
        <StatCard
          title="Customer Rating"
          value={`${combinedStats.customerSatisfaction}/5`}
          icon={<StarIcon className="h-6 w-6 text-yellow-600" />}
          color="border-yellow-200"
          progress={combinedStats.customerSatisfaction * 20}
          subtitle="Average rating"
        />
        
        <StatCard
          title="Staff Utilization"
          value={`${combinedStats.staffUtilization}%`}
          icon={<UsersIcon className="h-6 w-6 text-purple-600" />}
          color="border-purple-200"
          progress={combinedStats.staffUtilization}
          subtitle="Resource usage"
        />
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity & Alerts
            </h3>
            
            <div className="space-y-4">
              {/* Payment Alerts */}
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-yellow-900">
                    Pending Payments Alert
                  </div>
                  <div className="text-sm text-yellow-700">
                    ₹{combinedStats.pendingPayments.toLocaleString()} in pending payments require attention
                  </div>
                </div>
              </div>
              
              {/* Staff Utilization Alert */}
              {combinedStats.staffUtilization < 70 && (
                <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <UsersIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-blue-900">
                      Low Staff Utilization
                    </div>
                    <div className="text-sm text-blue-700">
                      Staff utilization at {combinedStats.staffUtilization}% - consider reassigning resources
                    </div>
                  </div>
                </div>
              )}
              
              {/* High Demand Alert */}
              <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-green-900">
                    High Booking Volume
                  </div>
                  <div className="text-sm text-green-700">
                    {combinedStats.growthRate}% increase in bookings this month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {combinedStats.conversionRate}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Peak Hours</span>
                <span className="text-sm font-medium text-gray-900">
                  10 AM - 2 PM
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Top Service</span>
                <span className="text-sm font-medium text-gray-900">
                  Grah Shanti
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Staff</span>
                <span className="text-sm font-medium text-gray-900">
                  12/15
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardStats;
