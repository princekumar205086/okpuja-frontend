"use client";
import React from 'react';
import { User } from '@/app/stores/authStore';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface WelcomeHeaderProps {
  user: User | null;
  onRefresh?: () => void;
  loading?: boolean;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  user,
  onRefresh,
  loading = false,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.first_name) {
      return user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name;
    }
    return 'Devotee';
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {getGreeting()}, {getUserName()}! 🙏
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome to your spiritual journey dashboard
        </p>
      </div>
      
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 
            hover:bg-gray-50 transition-colors duration-200 text-sm font-medium
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          `}
        >
          <RefreshIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      )}
    </div>
  );
};
