'use client';

import React from 'react';

interface SortOptionsProps {
  sortBy: 'title' | 'price' | 'duration_minutes' | 'created_at';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'title' | 'price' | 'duration_minutes' | 'created_at', sortOrder: 'asc' | 'desc') => void;
  totalResults: number;
}

export default function SortOptions({
  sortBy,
  sortOrder,
  onSortChange,
  totalResults
}: SortOptionsProps) {
  const sortOptions = [
    { value: 'title', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'duration_minutes', label: 'Duration' },
    { value: 'created_at', label: 'Newest' }
  ];

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Results Count */}
          <div className="mb-3 sm:mb-0">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{totalResults}</span> 
              {totalResults === 1 ? ' service' : ' services'} found
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any, sortOrder)}
                className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order Toggle */}
            <button
              onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
              title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortOrder === 'asc' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
              )}
              <span className="hidden sm:inline">
                {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Sort Summary */}
        <div className="mt-2 sm:hidden">
          <p className="text-xs text-gray-500">
            Sorted by {sortOptions.find(opt => opt.value === sortBy)?.label} 
            ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
          </p>
        </div>
      </div>
    </div>
  );
}
