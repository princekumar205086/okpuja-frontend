'use client';

import React, { useState } from 'react';
import { SERVICE_TYPES, PRICE_RANGES, DURATION_OPTIONS } from '../types';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onServiceTypeFilter: (serviceType: string) => void;
  onPriceRangeFilter: (priceRange: string) => void;
  onDurationFilter: (duration: string) => void;
  onClearFilters: () => void;
  activeFilters: {
    search: string;
    service_type: string;
    price_range: string;
    duration: string;
  };
}

export default function SearchFilter({
  onSearch,
  onServiceTypeFilter,
  onPriceRangeFilter,
  onDurationFilter,
  onClearFilters,
  activeFilters
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(activeFilters.search);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const hasActiveFilters = Boolean(
    activeFilters.search ||
    activeFilters.service_type ||
    activeFilters.price_range ||
    activeFilters.duration
  );

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="py-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search astrology services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-orange-500"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="ml-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 font-medium"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="pb-4 border-t border-gray-100">
            <div className="pt-4 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4">
              {/* Service Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={activeFilters.service_type}
                  onChange={(e) => onServiceTypeFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Services</option>
                  {SERVICE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={activeFilters.price_range}
                  onChange={(e) => onPriceRangeFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  value={activeFilters.duration}
                  onChange={(e) => onDurationFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {DURATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="lg:col-span-1 xl:col-span-2">
                {hasActiveFilters ? (
                  <div className="lg:flex lg:items-end lg:h-full">
                    <button
                      onClick={onClearFilters}
                      className="w-full px-4 py-2 text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition-colors text-sm font-medium lg:h-10"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="hidden lg:block lg:h-full"></div>
                )}
              </div>
            </div>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {activeFilters.search && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                    Search: {activeFilters.search}
                    <button
                      onClick={() => onSearch('')}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {activeFilters.service_type && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                    {SERVICE_TYPES.find(t => t.value === activeFilters.service_type)?.label}
                    <button
                      onClick={() => onServiceTypeFilter('')}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {activeFilters.price_range && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                    {PRICE_RANGES.find(r => r.value === activeFilters.price_range)?.label}
                    <button
                      onClick={() => onPriceRangeFilter('')}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {activeFilters.duration && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                    {DURATION_OPTIONS.find(d => d.value === activeFilters.duration)?.label}
                    <button
                      onClick={() => onDurationFilter('')}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
