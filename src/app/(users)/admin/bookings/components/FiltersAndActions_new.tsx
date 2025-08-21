import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  TableCellsIcon,
  Squares2X2Icon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

interface FilterState {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  serviceType: string;
}

interface FiltersAndActionsProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  viewMode: 'table' | 'card';
  onViewModeChange: (mode: 'table' | 'card') => void;
  isLoading: boolean;
}

const FiltersAndActions: React.FC<FiltersAndActionsProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  isLoading,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? 'border-orange-200 bg-orange-50 text-orange-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>

          {/* View Mode */}
          <div className="border border-gray-300 rounded-lg p-1 flex">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Table View"
            >
              <TableCellsIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('card')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'card'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Card View"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
          </div>

          {/* Export */}
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Service Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                value={filters.serviceType}
                onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Services</option>
                <option value="birth_chart">Birth Chart</option>
                <option value="kundli_matching">Kundli Matching</option>
                <option value="palmistry">Palmistry</option>
                <option value="tarot_reading">Tarot Reading</option>
                <option value="numerology">Numerology</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() =>
                onFilterChange({
                  search: '',
                  status: '',
                  dateFrom: '',
                  dateTo: '',
                  serviceType: '',
                })
              }
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersAndActions;