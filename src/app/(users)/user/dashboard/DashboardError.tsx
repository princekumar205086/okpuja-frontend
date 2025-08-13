"use client";
import React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

interface DashboardErrorProps {
  error: string;
  onRetry?: () => void;
}

export const DashboardError: React.FC<DashboardErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
      <ErrorOutlineIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {error || 'We encountered an error while loading your dashboard. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
        >
          <RefreshIcon className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
