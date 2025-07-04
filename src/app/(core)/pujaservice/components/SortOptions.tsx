'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortOptionsProps {
  sortBy: 'title' | 'price' | 'duration' | 'created_at';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'title' | 'price' | 'duration' | 'created_at', sortOrder: 'asc' | 'desc') => void;
  totalResults: number;
}

export default function SortOptions({ sortBy, sortOrder, onSortChange, totalResults }: SortOptionsProps) {
  const sortOptions = [
    { value: 'title', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'duration', label: 'Duration' },
    { value: 'created_at', label: 'Newest' },
  ];

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // Toggle sort order if same field
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      onSortChange(newSortBy as 'title' | 'price' | 'duration' | 'created_at', 'asc');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Results Count */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">{totalResults.toLocaleString()}</span> services found
          </div>

          {/* Sort Options - Mobile */}
          <div className="sm:hidden">
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('_');
                onSortChange(field as 'title' | 'price' | 'duration' | 'created_at', order as 'asc' | 'desc');
              }}
              className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <React.Fragment key={option.value}>
                  <option value={`${option.value}_asc`}>
                    {option.label} (A-Z)
                  </option>
                  <option value={`${option.value}_desc`}>
                    {option.label} (Z-A)
                  </option>
                </React.Fragment>
              ))}
            </select>
          </div>

          {/* Sort Options - Desktop */}
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <div className="flex items-center space-x-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    sortBy === option.value
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                  {sortBy === option.value && (
                    <ArrowUpDown className={`ml-1 h-3 w-3 transform transition-transform ${
                      sortOrder === 'desc' ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
