import React, { useState, useEffect } from 'react';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface FilterParams {
  status: string;
  searchTerm: string;
  dateRange: DateRange;
}

interface BookingFiltersProps {
  onFilterChange: (filters: any) => void;
  onRefresh: () => void;
  filterParams: FilterParams;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({ 
  onFilterChange, 
  onRefresh,
  filterParams 
}) => {
  const [searchTerm, setSearchTerm] = useState(filterParams.searchTerm || '');
  const [status, setStatus] = useState(filterParams.status || 'all');
  const [startDate, setStartDate] = useState(filterParams.dateRange.startDate || '');
  const [endDate, setEndDate] = useState(filterParams.dateRange.endDate || '');
  
  useEffect(() => {
    setSearchTerm(filterParams.searchTerm || '');
    setStatus(filterParams.status || 'all');
    setStartDate(filterParams.dateRange.startDate || '');
    setEndDate(filterParams.dateRange.endDate || '');
  }, [filterParams]);
  
  const handleApplyFilters = () => {
    onFilterChange({
      searchTerm,
      status,
      dateRange: {
        startDate,
        endDate
      }
    });
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatus('all');
    setStartDate('');
    setEndDate('');
    
    onFilterChange({
      searchTerm: '',
      status: 'all',
      dateRange: {
        startDate: '',
        endDate: ''
      }
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Name, email, booking ID..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
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
            <option value="all">All Statuses</option>
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
