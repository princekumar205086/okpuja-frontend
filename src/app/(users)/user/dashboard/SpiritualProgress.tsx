"use client";
import React from 'react';
import { DashboardStats, ProgressItem } from './types';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

interface ProgressBarProps {
  progress: number;
  total: number;
  color: string;
  label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, total, color, label }) => {
  const percentage = total > 0 ? Math.min((progress / total) * 100, 100) : 0;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">
          {progress}/{total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right mt-1">
        <span className="text-xs text-gray-500">{Math.round(percentage)}% Complete</span>
      </div>
    </div>
  );
};

interface SpiritualProgressProps {
  stats: DashboardStats;
  loading?: boolean;
}

export const SpiritualProgress: React.FC<SpiritualProgressProps> = ({ stats, loading = false }) => {
  const calculateProgress = () => {
    const targetBookingsPerYear = 12;
    const targetConsultationsPerYear = 6;
    const targetMonthlyBookings = 2;
    
    const progressItems: ProgressItem[] = [
      {
        title: 'Yearly Spiritual Journey',
        description: 'Pujas and ceremonies completed this year',
        progress: stats.totalBookings,
        total: targetBookingsPerYear,
        color: 'from-orange-500 to-red-500',
      },
      {
        title: 'Astrological Guidance',
        description: 'Consultations taken for spiritual growth',
        progress: stats.astrologyConsultations,
        total: targetConsultationsPerYear,
        color: 'from-purple-500 to-indigo-500',
      },
      {
        title: 'Monthly Devotion',
        description: 'Regular spiritual practice this month',
        progress: stats.monthlyBookings,
        total: targetMonthlyBookings,
        color: 'from-green-500 to-emerald-500',
      },
    ];

    return progressItems;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 w-40 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 w-32 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 w-full rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const progressItems = calculateProgress();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUpIcon className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Spiritual Progress</h3>
      </div>

      <div className="space-y-4">
        {progressItems.map((item, index) => (
          <div key={index}>
            <ProgressBar
              progress={item.progress}
              total={item.total}
              color={item.color}
              label={item.title}
            />
            <p className="text-xs text-gray-500 mb-4">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            You&apos;re on a beautiful spiritual journey! 🙏
          </p>
          <p className="text-xs text-gray-500">
            Continue your path with regular pujas and consultations
          </p>
        </div>
      </div>
    </div>
  );
};
