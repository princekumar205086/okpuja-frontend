'use client';

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { PujaCategory } from '../types';
import { typeDisplayNames } from '../mockData';

interface SearchFilterProps {
  categories: PujaCategory[];
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  onTypeFilter: (type: string) => void;
  onLocationFilter: (location: string) => void;
  onLanguageFilter: (language: string) => void;
  onClearFilters: () => void;
  activeFilters: {
    search: string;
    category: string;
    type: string;
    location: string;
    language: string;
  };
}

export default function SearchFilter({ 
  categories, 
  onSearch, 
  onCategoryFilter, 
  onTypeFilter, 
  onLocationFilter,
  onLanguageFilter,
  onClearFilters,
  activeFilters 
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(activeFilters.search);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const hasActiveFilters = activeFilters.category || activeFilters.type || activeFilters.location || activeFilters.language || activeFilters.search;

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="py-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search puja services..."
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
                <Filter className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="ml-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="pb-4 border-t border-gray-100">
            <div className="pt-4 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={activeFilters.category}
                  onChange={(e) => onCategoryFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={activeFilters.type}
                  onChange={(e) => onTypeFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {Object.entries(typeDisplayNames).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={activeFilters.location}
                  onChange={(e) => onLocationFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={activeFilters.language}
                  onChange={(e) => onLanguageFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Languages</option>
                  <option value="HINDI">Hindi</option>
                  <option value="ENGLISH">English</option>
                  <option value="SANSKRIT">Sanskrit</option>
                  <option value="REGIONAL">Regional</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                {hasActiveFilters && (
                  <button
                    onClick={onClearFilters}
                    className="flex items-center px-4 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pb-4">
            <div className="flex flex-wrap gap-2">
              {activeFilters.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                  Search: {activeFilters.search}
                  <button
                    onClick={() => onSearch('')}
                    className="ml-2 hover:text-orange-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {activeFilters.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Category: {activeFilters.category}
                  <button
                    onClick={() => onCategoryFilter('')}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {activeFilters.type && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Type: {typeDisplayNames[activeFilters.type as keyof typeof typeDisplayNames]}
                  <button
                    onClick={() => onTypeFilter('')}
                    className="ml-2 hover:text-green-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {activeFilters.location && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  Location: {activeFilters.location}
                  <button
                    onClick={() => onLocationFilter('')}
                    className="ml-2 hover:text-purple-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {activeFilters.language && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  Language: {activeFilters.language}
                  <button
                    onClick={() => onLanguageFilter('')}
                    className="ml-2 hover:text-yellow-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
