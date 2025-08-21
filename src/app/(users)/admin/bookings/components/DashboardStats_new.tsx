import React from 'react';
import {
  ChartBarIcon as ChartBarIconSolid,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';

interface DashboardStatsProps {
  data: any;
  isLoading: boolean;
  activeTab: 'astrology' | 'puja';
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  data, 
  isLoading, 
  activeTab 
}) => {
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Key Metrics Overview</h2>
          <p className="text-sm text-gray-600">Real-time insights into your booking performance and revenue metrics</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Use the provided data
  const overview = data?.overview || {};
  const metrics = [
    {
      title: 'Total Bookings',
      value: overview.total_bookings || 0,
      icon: ChartBarIconSolid,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Confirmed',
      value: overview.confirmed_bookings || 0,
      icon: CheckCircleIcon,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Pending',
      value: overview.pending_bookings || overview.pending_sessions || 0,
      icon: ClockIcon,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      change: '-3%',
      changeType: 'negative'
    },
    {
      title: 'Revenue',
      value: overview.total_revenue || '₹0',
      icon: BanknotesIcon,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Completed',
      value: overview.completed_bookings || 0,
      icon: SparklesIcon,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      change: '+22%',
      changeType: 'positive'
    },
    {
      title: 'Cancelled',
      value: overview.cancelled_bookings || 0,
      icon: XMarkIcon,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      change: '+5%',
      changeType: 'negative'
    },
    {
      title: 'Avg. Value',
      value: overview.average_booking_value || '₹0',
      icon: BanknotesIcon,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      change: '+10%',
      changeType: 'positive'
    },
    {
      title: 'Active Services',
      value: overview.active_services || 0,
      icon: SparklesIcon,
      color: 'bg-gradient-to-r from-teal-500 to-teal-600',
      change: '+3%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {activeTab === 'astrology' ? 'Astrology' : 'Puja'} Services Overview
        </h2>
        <p className="text-sm text-gray-600">Real-time insights into your booking performance and revenue metrics</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {typeof metric.value === 'string' ? metric.value : metric.value.toLocaleString()}
                  </p>
                  <div className="flex items-center">
                    <span className={`text-xs font-medium ${
                      metric.changeType === 'positive' ? 'text-green-600' : 
                      metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg ${metric.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardStats;