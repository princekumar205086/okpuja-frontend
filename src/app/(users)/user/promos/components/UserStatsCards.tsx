'use client';

import React from 'react';
import { useUserPromoStore } from '../../../../stores/userPromoStore';
import { 
  TicketIcon, 
  TrophyIcon, 
  CurrencyDollarIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

const UserStatsCards: React.FC = () => {
  const { stats, loading } = useUserPromoStore();

  const statsData = [
    {
      title: 'Available Codes',
      value: stats?.total_available || 0,
      icon: TicketIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Ready to use'
    },
    {
      title: 'Total Used',
      value: stats?.total_used || 0,
      icon: TrophyIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Successfully applied'
    },
    {
      title: 'Total Savings',
      value: `₹${stats?.total_savings || '0'}`,
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Money saved'
    },
    {
      title: 'Expiring Soon',
      value: stats?.expiring_soon || 0,
      icon: ClockIcon,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Next 7 days'
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-gray-300 rounded-lg"></div>
              <div className="h-8 w-16 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-3 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <IconComponent className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserStatsCards;