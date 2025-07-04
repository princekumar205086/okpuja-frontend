'use client';

import React, { useState, useEffect } from 'react';
import { BlogFilters } from '../types';
import { mockCategories, mockTags } from '../mockData';

interface SearchFilterProps {
  filters: BlogFilters;
  onFiltersChange: (filters: BlogFilters) => void;
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  onFiltersChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFiltersChange({ ...filters, search: localSearch });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearch, filters, onFiltersChange]);

  const handleClearFilters = () => {
    setLocalSearch('');
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className={className}>
      {/* Search Input */}
      <div className="relative mb-4 sm:mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="block w-full pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
        />
        {localSearch && (
          <button
            onClick={() => setLocalSearch('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Sort By */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as any })}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most_viewed">Most Viewed</option>
            <option value="most_liked">Most Liked</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
          >
            <option value="">All Categories</option>
            {mockCategories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Tag
          </label>
          <select
            value={filters.tag || ''}
            onChange={(e) => onFiltersChange({ ...filters, tag: e.target.value || undefined })}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"          >
            <option value="">All Tags</option>
            {mockTags.map((tag) => (
              <option key={tag.id} value={tag.slug}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Featured Filter */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.featured || false}
            onChange={(e) => onFiltersChange({ ...filters, featured: e.target.checked || undefined })}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">Featured Only</span>
        </label>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: &ldquo;{filters.search}&rdquo;
                <button 
                  onClick={() => onFiltersChange({ ...filters, search: undefined })}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Category: {mockCategories.find(c => c.slug === filters.category)?.name}
                <button 
                  onClick={() => onFiltersChange({ ...filters, category: undefined })}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.tag && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Tag: {mockTags.find(t => t.slug === filters.tag)?.name}
                <button 
                  onClick={() => onFiltersChange({ ...filters, tag: undefined })}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.featured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Featured Only
                <button 
                  onClick={() => onFiltersChange({ ...filters, featured: undefined })}
                  className="ml-1 text-amber-600 hover:text-amber-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
