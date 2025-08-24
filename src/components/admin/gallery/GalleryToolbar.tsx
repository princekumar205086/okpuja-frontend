'use client';

import React from 'react';
import { useGalleryStore } from '@/app/stores/galleryStore';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  PlusIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

interface GalleryToolbarProps {
  onUpload: () => void;
  onBulkDelete: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const GalleryToolbar: React.FC<GalleryToolbarProps> = ({
  onUpload,
  onBulkDelete,
  viewMode,
  onViewModeChange,
}) => {
  const {
    selectedItems,
    items,
    totalItems,
    sortBy,
    sortOrder,
    setSorting,
    selectAllItems,
    clearSelection,
    loading,
    fetchItems,
  } = useGalleryStore();

  const selectedCount = selectedItems.size;
  const allSelected = selectedCount > 0 && selectedCount === items.length;

  const sortOptions = [
    { value: 'created_at_desc', label: 'Newest First' },
    { value: 'created_at_asc', label: 'Oldest First' },
    { value: 'title_asc', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' },
    { value: 'popularity_desc', label: 'Most Popular' },
    { value: 'popularity_asc', label: 'Least Popular' },
  ];

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('_');
    const finalOrder = order === 'desc' ? 'desc' : 'asc';
    setSorting(field, finalOrder);
    fetchItems(1); // Manually trigger fetch after sort change
  };

  const getCurrentSortValue = () => {
    return `${sortBy}_${sortOrder}`;
  };

  const handleSelectAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAllItems();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        {/* Left side - Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Primary Actions */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={onUpload}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <ArrowUpTrayIcon className="h-4 w-4" />
              Upload Images
            </Button>
            
            {selectedCount > 0 && (
              <Button
                variant="destructive"
                onClick={onBulkDelete}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <TrashIcon className="h-4 w-4" />
                Delete Selected ({selectedCount})
              </Button>
            )}
          </div>

          {/* Selection Controls */}
          {items.length > 0 && (
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={handleSelectAll}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
              {selectedCount > 0 && (
                <span className="text-gray-500">
                  ({selectedCount} of {items.length} selected)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right side - View controls */}
        <div className="flex items-center space-x-3">
          {/* Sort */}
          <div className="min-w-[200px]">
            <Select
              options={sortOptions}
              value={getCurrentSortValue()}
              onChange={(e) => handleSortChange(e.target.value)}
              placeholder="Sort by..."
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Grid View"
            >
              <Squares2X2Icon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="List View"
            >
              <Bars3Icon className="h-4 w-4" />
            </button>
          </div>

          {/* Item Count */}
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {totalItems} items
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryToolbar;