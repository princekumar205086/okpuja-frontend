'use client';

import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="p-4 sm:p-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-16"></div>
              </div>
            </div>

            {/* Image */}
            <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>

            {/* Date & Time */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-16"></div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 sm:px-5 pb-4 sm:pb-5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
              <div className="w-full sm:w-20 h-10 bg-gray-200 rounded-xl"></div>
              <div className="w-full sm:w-20 h-10 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
