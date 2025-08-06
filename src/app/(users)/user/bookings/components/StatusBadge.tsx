'use client';

import React from 'react';

// Status color mappings with professional design
export const getStatusConfig = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        icon: '✓'
      };
    case 'pending':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        icon: '⏳'
      };
    case 'completed':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        icon: '🏆'
      };
    case 'cancelled':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500',
        icon: '✕'
      };
    case 'rejected':
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        dot: 'bg-gray-500',
        icon: '⚠'
      };
    case 'failed':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500',
        icon: '⚠'
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        dot: 'bg-gray-500',
        icon: '?'
      };
  }
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className={`inline-flex items-center gap-2 ${sizeClasses[size]} font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
      <span className="capitalize">{status}</span>
    </div>
  );
};

export default StatusBadge;
