"use client";
import React from 'react';
import { DashboardStats } from './types';
import {
  CalendarToday as CalendarIcon,
  AutoAwesome as PujaIcon,
  StarBorder as AstrologyIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, gradient }) => (
  <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-white/80">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className="text-xs text-white/70 mt-2">{change}</p>
      </div>
      <div className="flex-shrink-0 ml-4 opacity-80">
        {icon}
      </div>
    </div>
    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full transform rotate-12"></div>
    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
  </div>
);

interface StatsGridProps {
  stats: DashboardStats;
  loading?: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, loading = false }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: loading ? '...' : stats.totalBookings,
      change: loading ? '...' : `+${stats.monthlyBookings} this month`,
      icon: <CalendarIcon className="w-10 h-10" />,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Upcoming Pujas',
      value: loading ? '...' : stats.upcomingPujas,
      change: 'Scheduled services',
      icon: <PujaIcon className="w-10 h-10" />,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Consultations',
      value: loading ? '...' : stats.astrologyConsultations,
      change: 'Astrology sessions',
      icon: <AstrologyIcon className="w-10 h-10" />,
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'Total Spent',
      value: loading ? '...' : formatCurrency(stats.totalSpent),
      change: loading ? '...' : `+${formatCurrency(stats.monthlySpent)} this month`,
      icon: <PaymentIcon className="w-10 h-10" />,
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          change={card.change}
          icon={card.icon}
          gradient={card.gradient}
        />
      ))}
    </div>
  );
};
