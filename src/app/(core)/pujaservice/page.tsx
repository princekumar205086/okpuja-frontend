'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PujaService, PujaServiceFilters, PaginationParams } from './types';
import { mockPujaServices, mockCategories } from './mockData';
import SearchFilter from './components/SearchFilter';
import CategoryTabs from './components/CategoryTabs';
import SortOptions from './components/SortOptions';
import ServiceCard from './components/ServiceCard';
import Pagination from './components/Pagination';
import { ServiceGridSkeleton } from './components/LoadingSkeletons';
import { filterServices, sortServices, paginateServices } from './utils';

export default function PujaservicePage() {
  const [services, setServices] = useState<PujaService[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PujaServiceFilters>({
    search: '',
    category: '',
    type: '',
    location: '',
    language: '',
    sortBy: 'title',
    sortOrder: 'asc'
  });
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Simulate API loading
  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setServices(mockPujaServices);
      setLoading(false);
    };

    loadServices();
  }, []);

  // Process services through filter, sort, and pagination pipeline
  const processedData = useMemo(() => {
    if (loading) return { services: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };

    // Filter services
    const filtered = filterServices(services, filters);
    
    // Sort services
    const sorted = sortServices(filtered, filters.sortBy || 'title', filters.sortOrder || 'asc');
    
    // Paginate services
    return paginateServices(sorted, pagination.page, pagination.limit);
  }, [services, filters, pagination.page, pagination.limit, loading]);

  // Update pagination when data changes
  useEffect(() => {
    if (!loading && processedData.pagination.total !== pagination.total) {
      setPagination(prev => ({
        ...prev,
        total: processedData.pagination.total,
        totalPages: processedData.pagination.totalPages
      }));
    }
  }, [processedData.pagination.total, processedData.pagination.totalPages, pagination.total, loading]);

  // Filter handlers
  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleTypeFilter = (type: string) => {
    setFilters(prev => ({ ...prev, type }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleLocationFilter = (location: string) => {
    setFilters(prev => ({ ...prev, location }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleLanguageFilter = (language: string) => {
    setFilters(prev => ({ ...prev, language }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      type: '',
      location: '',
      language: '',
      sortBy: 'title',
      sortOrder: 'asc'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (sortBy: 'title' | 'price' | 'duration' | 'created_at', sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4">
              Sacred Puja Services
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl opacity-90 max-w-3xl mx-auto px-4">
              Connect with divine blessings through our authentic puja services. 
              Choose from home visits, temple ceremonies, or online rituals conducted by qualified priests.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <div className="flex items-center text-sm sm:text-base">
                <span className="bg-white/20 rounded-full px-3 py-1">
                  ✨ 500+ Happy Customers
                </span>
              </div>
              <div className="flex items-center text-sm sm:text-base">
                <span className="bg-white/20 rounded-full px-3 py-1">
                  🏆 Verified Priests
                </span>
              </div>
              <div className="flex items-center text-sm sm:text-base">
                <span className="bg-white/20 rounded-full px-3 py-1">
                  📱 Mobile App Experience
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        categories={mockCategories}
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        onTypeFilter={handleTypeFilter}
        onLocationFilter={handleLocationFilter}
        onLanguageFilter={handleLanguageFilter}
        onClearFilters={handleClearFilters}
        activeFilters={{
          search: filters.search || '',
          category: filters.category || '',
          type: filters.type || '',
          location: filters.location || '',
          language: filters.language || ''
        }}
      />

      {/* Category Tabs - Mobile Optimized */}
      <CategoryTabs
        categories={mockCategories}
        activeCategory={filters.category || ''}
        onCategoryChange={handleCategoryFilter}
      />

      {/* Sort Options */}
      {!loading && (
        <SortOptions
          sortBy={filters.sortBy || 'title'}
          sortOrder={filters.sortOrder || 'asc'}
          onSortChange={handleSortChange}
          totalResults={processedData.pagination.total}
        />
      )}

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <ServiceGridSkeleton count={12} />
        ) : processedData.services.length > 0 ? (
          <>
            {/* Results Summary - Mobile */}
            <div className="mb-6 sm:hidden">
              <p className="text-sm text-gray-600 text-center">
                Showing {processedData.services.length} of {processedData.pagination.total} services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {processedData.services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="max-w-md mx-auto px-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500 mb-4 text-sm sm:text-base">
                Try adjusting your search or filter criteria to find what you&apos;re looking for.
              </p>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-600 bg-orange-100 hover:bg-orange-200 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && processedData.services.length > 0 && (
        <Pagination
          pagination={processedData.pagination}
          onPageChange={handlePageChange}
        />
      )}

      {/* Mobile-optimized floating action button for filters */}
      <div className="fixed bottom-6 right-6 sm:hidden z-50">
        <button
          onClick={() => {
            // In a real app, this would toggle a mobile filter modal
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}