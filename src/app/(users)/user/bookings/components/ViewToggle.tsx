'use client';

import React from 'react';
import { LayoutGrid, Table2, Filter, SortAsc } from 'lucide-react';

interface ViewToggleProps {
  view: 'card' | 'table';
  onViewChange: (view: 'card' | 'table') => void;
  totalItems: number;
  filteredItems: number;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  view,
  onViewChange,
  totalItems,
  filteredItems
}) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4 mb-6">
      {/* Left side - View toggle */}
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewChange('card')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              view === 'card'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Cards
          </button>
          <button
            onClick={() => onViewChange('table')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              view === 'table'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Table2 className="w-4 h-4" />
            Table
          </button>
        </div>
      </div>

      {/* Right side - Results count */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter className="w-4 h-4" />
          <span>
            Showing <span className="font-semibold text-gray-900">{filteredItems}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalItems}</span> bookings
          </span>
        </div>
        
        {view === 'table' && (
          <div className="flex items-center gap-1 text-gray-500">
            <SortAsc className="w-4 h-4" />
            <span className="text-xs">Sort & filter in table</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewToggle;
