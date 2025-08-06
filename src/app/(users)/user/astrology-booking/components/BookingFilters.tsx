import React, { useState } from 'react';
import { getStatusColor } from '../userAstrologyApiService';

interface FilterOptions {
  status: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

interface BookingFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  onRefresh: () => void;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({ 
  onFilterChange,
  onRefresh
}) => {
  const [status, setStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const handleApplyFilters = () => {
    onFilterChange({
      status,
      dateRange: {
        startDate,
        endDate
      }
    });
  };
  
  const handleResetFilters = () => {
    setStatus('all');
    setStartDate('');
    setEndDate('');
    
    onFilterChange({
      status: 'all',
      dateRange: {
        startDate: '',
        endDate: ''
      }
    });
  };
  
  // Get status label with colored badge
  const getStatusBadge = (value: string, label: string) => {
    const style = getStatusColor(value);
    
    return (
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${style.bg.replace('bg-', 'bg-')} border ${style.border}`}></span>
        <span>{label}</span>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">Filter Bookings</h3>
        <button
          onClick={onRefresh}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Bookings
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Booking Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Bookings</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Reset
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default BookingFilters;
