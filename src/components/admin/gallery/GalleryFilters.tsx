'use client';

import React, { useState } from 'react';
import { useGalleryStore } from '@/app/stores/galleryStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { debounce } from '@/lib/utils';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface GalleryFiltersProps {
  className?: string;
}

const GalleryFilters: React.FC<GalleryFiltersProps> = ({ className }) => {
  const {
    filters,
    categories,
    setFilters,
    categoriesLoading,
    fetchCategories,
    fetchItems
  } = useGalleryStore();

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  // Initialize categories on mount
  React.useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      fetchCategories();
    }
  }, [categories.length, categoriesLoading]); // Removed fetchCategories from dependencies

  // Debounced search
  const debouncedSearch = React.useMemo(
    () => debounce((term: string) => {
      setFilters({ search: term || undefined });
      fetchItems(1); // Manually trigger fetch after filter change
    }, 500),
    [setFilters]
  );

  React.useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters({
      [key]: value === '' ? undefined : value
    });
    fetchItems(1); // Manually trigger fetch after filter change
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: undefined,
      status: undefined,
      is_featured: undefined,
      search: undefined
    });
    fetchItems(1); // Manually trigger fetch after clearing filters
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'DRAFT', label: 'Draft' }
  ];

  const featuredOptions = [
    { value: '', label: 'All Items' },
    { value: 'true', label: 'Featured Only' },
    { value: 'false', label: 'Non-Featured' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({
      value: cat.id.toString(),
      label: cat.title
    }))
  ];

  return (
    <div className={className}>
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search gallery items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<MagnifyingGlassIcon />}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                {Object.values(filters).filter(v => v !== undefined).length}
              </span>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-1"
            >
              <XMarkIcon className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={filters.category?.toString() || ''}
              onChange={(e) => handleFilterChange('category', e.target.value ? parseInt(e.target.value) : undefined)}
            />
            
            <Select
              label="Status"
              options={statusOptions}
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            />
            
            <Select
              label="Featured"
              options={featuredOptions}
              value={filters.is_featured !== undefined ? filters.is_featured.toString() : ''}
              onChange={(e) => handleFilterChange('is_featured', e.target.value === '' ? undefined : e.target.value === 'true')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryFilters;