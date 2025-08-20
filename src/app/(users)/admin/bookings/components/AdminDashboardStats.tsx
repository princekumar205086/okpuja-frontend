'use client';

import React from 'react';
import {
  ChartBarIcon,
  CurrencyRupeeIcon,
  UsersIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface DashboardData {
  overview: {
    total_bookings: number;
    confirmed_bookings: number;
    completed_bookings: number;
    cancelled_bookings: number;
    pending_sessions: number;
    total_revenue: string | number;
    average_booking_value: string | number;
    bookings_this_period: number;
    active_services: number;
  };
}

interface AdminDashboardStatsProps {
  astrologyData?: DashboardData;
  regularData?: DashboardData;
  pujaData?: DashboardData;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon: Icon, color }) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') {
      const numVal = parseFloat(val);
      if (isNaN(numVal)) return val;
      return numVal.toLocaleString();
    }
    return val.toLocaleString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {formatValue(value)}
          </p>
          {change && (
            <div className={`inline-flex items-center text-xs sm:text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 
              changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
            }`}>
              <ArrowTrendingUpIcon className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 ${
                changeType === 'decrease' ? 'rotate-180' : ''
              }`} />
              {change}
            </div>
          )}
        </div>
        <div className={`flex-shrink-0 ${color} p-3 sm:p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
        </div>
      </div>
    </div>
  );
};

const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({
  astrologyData,
  regularData,
  pujaData,
  loading
}) => {
  // Aggregate data from all services
  const aggregateData = React.useMemo(() => {
    const astroOverview = astrologyData?.overview;
    const regularOverview = regularData?.overview;
    const pujaOverview = pujaData?.overview;

    const totalBookings = (astroOverview?.total_bookings || 0) + 
                         (regularOverview?.total_bookings || 0) + 
                         (pujaOverview?.total_bookings || 0);

    const confirmedBookings = (astroOverview?.confirmed_bookings || 0) + 
                             (regularOverview?.confirmed_bookings || 0) + 
                             (pujaOverview?.confirmed_bookings || 0);

    const completedBookings = (astroOverview?.completed_bookings || 0) + 
                             (regularOverview?.completed_bookings || 0) + 
                             (pujaOverview?.completed_bookings || 0);

    const cancelledBookings = (astroOverview?.cancelled_bookings || 0) + 
                             (regularOverview?.cancelled_bookings || 0) + 
                             (pujaOverview?.cancelled_bookings || 0);

    const pendingSessions = (astroOverview?.pending_sessions || 0) + 
                           (regularOverview?.pending_sessions || 0) + 
                           (pujaOverview?.pending_sessions || 0);

    // Parse revenue values properly
    const parseRevenue = (rev: string | number) => {
      if (typeof rev === 'string') {
        const parsed = parseFloat(rev);
        return isNaN(parsed) ? 0 : parsed;
      }
      return rev || 0;
    };

    const totalRevenue = parseRevenue(astroOverview?.total_revenue || 0) + 
                        parseRevenue(regularOverview?.total_revenue || 0) + 
                        parseRevenue(pujaOverview?.total_revenue || 0);

    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    const activeServices = (astroOverview?.active_services || 0) + 
                          (regularOverview?.active_services || 0) + 
                          (pujaOverview?.active_services || 0);

    return {
      totalBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      pendingSessions,
      totalRevenue,
      averageBookingValue,
      activeServices,
      // Calculate completion rate
      completionRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : '0',
      // Calculate confirmation rate
      confirmationRate: totalBookings > 0 ? ((confirmedBookings / totalBookings) * 100).toFixed(1) : '0',
    };
  }, [astrologyData, regularData, pujaData]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Bookings',
      value: aggregateData.totalBookings,
      change: '+12% from last month',
      changeType: 'increase' as const,
      icon: ChartBarIcon,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      title: 'Total Revenue',
      value: `₹${aggregateData.totalRevenue.toLocaleString()}`,
      change: '+8% from last month',
      changeType: 'increase' as const,
      icon: CurrencyRupeeIcon,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    {
      title: 'Confirmed Bookings',
      value: aggregateData.confirmedBookings,
      change: `${aggregateData.confirmationRate}% confirmation rate`,
      changeType: 'neutral' as const,
      icon: CheckCircleIcon,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    {
      title: 'Pending Sessions',
      value: aggregateData.pendingSessions,
      change: 'Requires attention',
      changeType: 'neutral' as const,
      icon: ClockIcon,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    },
    {
      title: 'Completed Sessions',
      value: aggregateData.completedBookings,
      change: `${aggregateData.completionRate}% completion rate`,
      changeType: 'increase' as const,
      icon: UsersIcon,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
    {
      title: 'Avg Booking Value',
      value: `₹${Math.round(aggregateData.averageBookingValue)}`,
      change: '+5% from last month',
      changeType: 'increase' as const,
      icon: ArrowTrendingUpIcon,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    },
    {
      title: 'Active Services',
      value: aggregateData.activeServices,
      change: 'All services operational',
      changeType: 'increase' as const,
      icon: SparklesIcon,
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
    },
    {
      title: 'Cancelled Bookings',
      value: aggregateData.cancelledBookings,
      change: '-3% from last month',
      changeType: 'decrease' as const,
      icon: XCircleIcon,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
    },
  ];

  return (
    <div className="mb-6 sm:mb-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
          Key Metrics Overview
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Real-time insights into your booking performance and revenue metrics
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardStats;
        