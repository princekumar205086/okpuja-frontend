"use client";
import React from 'react';
import MobileStatsCard from './MobileStatsCard';
import {
  People as UsersIcon,
  AutoAwesome as PujaIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as RevenueIcon,
  Assessment as AnalyticsIcon,
} from '@mui/icons-material';

const StatsOverview: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: 2456,
      icon: <UsersIcon />,
      change: '+12% this month',
      trend: 'up' as const,
      color: '#4f46e5',
      gradient: 'linear-gradient(135deg, rgba(79,70,229,0.1) 0%, rgba(79,70,229,0.05) 100%)',
    },
    {
      title: 'Puja Bookings',
      value: 1234,
      icon: <PujaIcon />,
      change: '+8% this month',
      trend: 'up' as const,
      color: '#ff6b35',
      gradient: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.05) 100%)',
    },
    {
      title: 'Astrology Bookings',
      value: 567,
      icon: <CalendarIcon />,
      change: '+15% this month',
      trend: 'up' as const,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(139,92,246,0.05) 100%)',
    },
    {
      title: 'Revenue',
      value: 1245000,
      icon: <RevenueIcon />,
      change: '+18% this month',
      trend: 'up' as const,
      color: '#059669',
      gradient: 'linear-gradient(135deg, rgba(5,150,105,0.1) 0%, rgba(5,150,105,0.05) 100%)',
    },
    {
      title: 'Active Priests',
      value: 89,
      icon: <StarIcon />,
      change: '5 new this week',
      trend: 'up' as const,
      color: '#f7931e',
      gradient: 'linear-gradient(135deg, rgba(247,147,30,0.1) 0%, rgba(247,147,30,0.05) 100%)',
    },
    {
      title: 'Pending Payments',
      value: 23,
      icon: <PaymentIcon />,
      change: '-5 from yesterday',
      trend: 'down' as const,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 100%)',
    },
    {
      title: 'Blog Posts',
      value: 156,
      icon: <AnalyticsIcon />,
      change: '+3 this week',
      trend: 'up' as const,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(6,182,212,0.05) 100%)',
    },
    {
      title: 'Gallery Items',
      value: 789,
      icon: <TrendingUpIcon />,
      change: '+12 this week',
      trend: 'up' as const,
      color: '#84cc16',
      gradient: 'linear-gradient(135deg, rgba(132,204,22,0.1) 0%, rgba(132,204,22,0.05) 100%)',
    },
  ];

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="col-span-1">
          <MobileStatsCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            trend={stat.trend}
            color={stat.color}
            gradient={stat.gradient}
            index={index}
          />
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
