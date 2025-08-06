'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface FilterState {
  status: string;
  dateRange: string;
  serviceType: string;
}

interface BookingFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  activeTab: 'puja' | 'astrology';
}

const BookingFilters: React.FC<BookingFiltersProps> = ({ filters, onFilterChange, activeTab }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Filter className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm transition-all duration-200"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm transition-all duration-200"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="past">Past Bookings</option>
          </select>
        </div>

        {/* Service Type Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {activeTab === 'puja' ? 'Service Type' : 'Astrology Type'}
          </label>
          <select
            value={filters.serviceType}
            onChange={(e) => onFilterChange({ ...filters, serviceType: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm transition-all duration-200"
          >
            <option value="">All Types</option>
            {activeTab === 'puja' ? (
              <>
                <option value="HOME">Home Service</option>
                <option value="TEMPLE">Temple Service</option>
                <option value="ONLINE">Online Service</option>
              </>
            ) : (
              <>
                <option value="HOROSCOPE">Horoscope Analysis</option>
                <option value="MATCHING">Kundali Matching</option>
                <option value="PREDICTION">Future Prediction</option>
                <option value="REMEDIES">Astrological Remedies</option>
                <option value="GEMSTONE">Gemstone Recommendation</option>
                <option value="VAASTU">Vaastu Consultation</option>
              </>
            )}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BookingFilters;
