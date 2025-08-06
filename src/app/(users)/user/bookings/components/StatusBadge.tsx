'use client';

import React from 'react';

// Professional status tracking system
export const getStatusConfig = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        icon: '⏳',
        label: 'Pending Approval',
        description: 'Waiting for admin confirmation'
      };
    case 'confirmed':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        icon: '✓',
        label: 'Confirmed',
        description: 'Booking confirmed by admin'
      };
    case 'completed':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        dot: 'bg-green-500',
        icon: '🏆',
        label: 'Completed',
        description: 'Service delivered successfully'
      };
    case 'cancelled':
    case 'canceled':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500',
        icon: '✕',
        label: 'Cancelled',
        description: 'Booking cancelled by user'
      };
    case 'refund_requested':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        dot: 'bg-orange-500',
        icon: '💰',
        label: 'Refund Requested',
        description: 'Refund request submitted'
      };
    case 'refund_completed':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        dot: 'bg-purple-500',
        icon: '✅',
        label: 'Refund Completed',
        description: 'Refund processed successfully'
      };
    case 'rejected':
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        dot: 'bg-gray-500',
        icon: '⚠',
        label: 'Rejected',
        description: 'Booking rejected by admin'
      };
    case 'failed':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500',
        icon: '⚠',
        label: 'Failed',
        description: 'Payment or booking failed'
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        dot: 'bg-gray-500',
        icon: '?',
        label: status || 'Unknown',
        description: 'Status not recognized'
      };
  }
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showDescription = false 
}) => {
  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className="flex flex-col items-center sm:items-end gap-1">
      <div 
        className={`inline-flex items-center gap-2 ${sizeClasses[size]} font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}
        title={config.description}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
        <span>{config.label}</span>
      </div>
      {showDescription && size !== 'sm' && (
        <span className="text-xs text-gray-500 text-center sm:text-right max-w-32">
          {config.description}
        </span>
      )}
    </div>
  );
};

// Order tracking component for visual status progression
export const OrderTracking: React.FC<{ status: string; type: 'puja' | 'astrology' }> = ({ 
  status, 
  type 
}) => {
  const steps = [
    { key: 'pending', label: 'Pending', description: 'Booking submitted' },
    { key: 'confirmed', label: 'Confirmed', description: 'Admin approved' },
    { key: 'completed', label: 'Completed', description: 'Service delivered' }
  ];

  const cancelSteps = [
    { key: 'cancelled', label: 'Cancelled', description: 'User cancelled' },
    { key: 'refund_requested', label: 'Refund Requested', description: 'Refund initiated' },
    { key: 'refund_completed', label: 'Refund Completed', description: 'Money returned' }
  ];

  const currentStatus = status?.toLowerCase();
  const isCancelled = ['cancelled', 'canceled', 'refund_requested', 'refund_completed'].includes(currentStatus);
  const activeSteps = isCancelled ? cancelSteps : steps;

  const getStepStatus = (stepKey: string) => {
    const stepIndex = activeSteps.findIndex(s => s.key === stepKey);
    const currentIndex = activeSteps.findIndex(s => s.key === currentStatus);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {activeSteps.map((step, index) => {
          const stepStatus = getStepStatus(step.key);
          const isLast = index === activeSteps.length - 1;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <div className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium
                  ${stepStatus === 'completed' ? 'bg-green-500 border-green-500 text-white' : 
                    stepStatus === 'active' ? 'bg-blue-500 border-blue-500 text-white' : 
                    'bg-gray-100 border-gray-300 text-gray-500'}
                `}>
                  {stepStatus === 'completed' ? '✓' : index + 1}
                </div>
                {!isLast && (
                  <div className={`
                    flex-1 h-0.5 mx-2
                    ${stepStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'}
                  `} />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-xs font-medium ${
                  stepStatus === 'active' ? 'text-blue-600' : 
                  stepStatus === 'completed' ? 'text-green-600' : 
                  'text-gray-500'
                }`}>
                  {step.label}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusBadge;
