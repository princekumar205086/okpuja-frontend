'use client';

import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon, 
  actionText, 
  onAction 
}) => {
  const defaultIcon = (
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
      <Search className="w-8 h-8 text-gray-400" />
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon || defaultIcon}
      <h3 className="mt-6 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
