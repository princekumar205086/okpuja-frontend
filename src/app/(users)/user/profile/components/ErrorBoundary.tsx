'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  error?: string | null;
  onRetry?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  error, 
  onRetry, 
  className = '',
  children 
}) => {
  if (!error) {
    return <>{children}</>;
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-red-200 ${className}`}>
      <div className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {error || 'An unexpected error occurred. Please try again.'}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;
