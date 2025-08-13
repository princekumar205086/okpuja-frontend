"use client";
import React from 'react';
import Link from 'next/link';
import { QuickAction } from './types';
import {
  AutoAwesome as PujaIcon,
  StarBorder as AstrologyIcon,
  CalendarToday as CalendarIcon,
  History as HistoryIcon,
  Person as ProfileIcon,
  Phone as ContactIcon,
} from '@mui/icons-material';

interface QuickActionButtonProps {
  action: QuickAction;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ action }) => (
  <Link href={action.href} className="block">
    <div className={`p-4 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {action.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm">{action.title}</h4>
          <p className="text-white/80 text-xs mt-1 line-clamp-2">{action.description}</p>
        </div>
      </div>
    </div>
  </Link>
);

interface QuickActionsProps {
  loading?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ loading = false }) => {
  const quickActions: QuickAction[] = [
    {
      title: 'Book a Puja',
      description: 'Schedule your spiritual ceremonies',
      icon: <PujaIcon className="w-6 h-6" />,
      href: '/pujaservice',
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Astrology Consultation',
      description: 'Get guidance from expert astrologers',
      icon: <AstrologyIcon className="w-6 h-6" />,
      href: '/astrology',
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'View Calendar',
      description: 'Check your upcoming appointments',
      icon: <CalendarIcon className="w-6 h-6" />,
      href: '/user/bookings',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Booking History',
      description: 'Review your past services',
      icon: <HistoryIcon className="w-6 h-6" />,
      href: '/user/bookings?tab=history',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'My Profile',
      description: 'Manage your account settings',
      icon: <ProfileIcon className="w-6 h-6" />,
      href: '/user/profile',
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Contact Support',
      description: 'Get help with your bookings',
      icon: <ContactIcon className="w-6 h-6" />,
      href: '/contactus',
      color: 'gray',
      gradient: 'from-gray-500 to-slate-500',
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse mb-6">
          <div className="h-6 bg-gray-200 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <QuickActionButton key={index} action={action} />
        ))}
      </div>
    </div>
  );
};
