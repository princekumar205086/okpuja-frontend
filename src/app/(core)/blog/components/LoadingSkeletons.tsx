'use client';

import React from 'react';

interface LoadingSkeletonsProps {
  variant?: 'card' | 'featured' | 'compact' | 'sidebar';
  count?: number;
  className?: string;
}

const LoadingSkeletons: React.FC<LoadingSkeletonsProps> = ({
  variant = 'card',
  count = 3,
  className = '',
}) => {
  const renderCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="h-3 bg-gray-200 rounded w-8"></div>
            <div className="h-3 bg-gray-200 rounded w-8"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturedSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="relative h-64 sm:h-80 bg-gray-200">
        <div className="absolute top-4 left-4 w-16 h-6 bg-gray-300 rounded-full"></div>
        <div className="absolute top-4 right-4 w-20 h-6 bg-gray-300 rounded-full"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded mb-4 w-5/6"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div>
                <div className="h-3 bg-gray-300 rounded w-20 mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="h-3 bg-gray-300 rounded w-8"></div>
              <div className="h-3 bg-gray-300 rounded w-8"></div>
              <div className="h-3 bg-gray-300 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompactSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="flex">
        <div className="w-24 h-24 bg-gray-200 flex-shrink-0"></div>
        <div className="flex-1 p-4">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSidebarSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'featured':
        return renderFeaturedSkeleton();
      case 'compact':
        return renderCompactSkeleton();
      case 'sidebar':
        return renderSidebarSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={variant === 'sidebar' ? '' : 'mb-6 last:mb-0'}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

// Individual skeleton components for more specific use cases
export const BlogCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <LoadingSkeletons variant="card" count={1} className={className} />
);

export const FeaturedPostSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <LoadingSkeletons variant="featured" count={1} className={className} />
);

export const CompactPostSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <LoadingSkeletons variant="compact" count={1} className={className} />
);

export const SidebarSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <LoadingSkeletons variant="sidebar" count={1} className={className} />
);

// Hero section skeleton
export const HeroSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 md:p-12 text-white animate-pulse ${className}`}>
    <div className="max-w-2xl">
      <div className="h-8 bg-white/20 rounded mb-4 w-3/4"></div>
      <div className="h-6 bg-white/20 rounded mb-6 w-5/6"></div>
      <div className="space-y-2 mb-8">
        <div className="h-4 bg-white/20 rounded"></div>
        <div className="h-4 bg-white/20 rounded w-4/5"></div>
      </div>
      <div className="h-12 bg-white/20 rounded w-40"></div>
    </div>
  </div>
);

// Category tabs skeleton
export const CategoryTabsSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white animate-pulse ${className}`}>
    <div className="flex space-x-1 overflow-x-auto py-2 px-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex-shrink-0 h-8 bg-gray-200 rounded-full whitespace-nowrap" style={{ width: `${Math.random() * 40 + 80}px` }}>
        </div>
      ))}
    </div>
  </div>
);

export default LoadingSkeletons;
