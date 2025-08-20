'use client';

import React from 'react';

interface BulkActionsProps {
  selectedBookings: string[];
  activeTab: string;
  onClearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ 
  selectedBookings, 
  activeTab, 
  onClearSelection 
}) => {
  if (selectedBookings.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between space-y-2 xs:space-y-0">
        <span className="text-sm font-medium text-blue-900">
          {selectedBookings.length} booking(s) selected
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
          >
            Confirm
          </button>
          <button
            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClearSelection}
            className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
