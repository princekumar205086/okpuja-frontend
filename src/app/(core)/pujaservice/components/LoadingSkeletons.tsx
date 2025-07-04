import React from 'react';

// Individual service card skeleton
export const ServiceCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse h-full">
      <div className="p-6 flex flex-col h-full">
        {/* Category skeleton */}
        <div className="h-4 bg-gray-200 rounded-full w-20 mb-3"></div>
        
        {/* Title skeleton */}
        <div className="space-y-2 mb-4 flex-grow">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

// Grid of service card skeletons
export const ServiceGridSkeleton = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Search filter skeleton
export const SearchFilterSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 animate-pulse">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search input skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
        
        {/* Category filter skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
        
        {/* Language filter skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="flex items-end">
          <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
};

// Pagination skeleton
export const PaginationSkeleton = () => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-12 animate-pulse">
      <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
      <div className="h-6 w-8 bg-gray-200 rounded"></div>
      <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
    </div>
  );
};

// Full page skeleton combining all components
export const ServiceListingPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-100 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchFilterSkeleton />
        <ServiceGridSkeleton />
        <PaginationSkeleton />
      </div>
    </div>
  );
};

// Service detail page skeleton
export const ServiceDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero section skeleton */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};
