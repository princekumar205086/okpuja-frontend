'use client';

import React from 'react';
import { RefreshCw, Search } from 'lucide-react';

interface BookingHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeTab: 'puja' | 'astrology';
}

const BookingHeader: React.FC<BookingHeaderProps> = ({
  onRefresh,
  isLoading,
  searchTerm,
  onSearchChange,
  activeTab
}) => {
  return (
    <>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              My Bookings
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your puja and astrology service bookings
            </p>
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${activeTab} bookings by name or ID...`}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 text-sm placeholder-gray-500"
          />
        </div>
      </div>
    </>
  );
};

export default BookingHeader;
