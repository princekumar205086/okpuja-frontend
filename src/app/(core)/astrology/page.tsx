'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AstrologyService, AstrologyServiceFilters, PaginationParams } from './types';
import { mockAstrologyServices, mockServiceTypes } from './mockData';
import SearchFilter from './components/SearchFilter';
import ServiceTypeTabs from './components/ServiceTypeTabs';
import SortOptions from './components/SortOptions';
import ServiceCard from './components/ServiceCard';
import Pagination from './components/Pagination';
import { ServiceGridSkeleton } from './components/LoadingSkeletons';
import { filterServices, sortServices, paginateServices } from './utils';
import './astrology.css';

export default function AstrologyServicePage() {
  const [services, setServices] = useState<AstrologyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AstrologyServiceFilters>({
    search: '',
    service_type: '',
    price_range: '',
    duration: '',
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
      setServices(mockAstrologyServices);
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

  const handleServiceTypeFilter = (serviceType: string) => {
    setFilters(prev => ({ ...prev, service_type: serviceType }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePriceRangeFilter = (priceRange: string) => {
    setFilters(prev => ({ ...prev, price_range: priceRange }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDurationFilter = (duration: string) => {
    setFilters(prev => ({ ...prev, duration }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      service_type: '',
      price_range: '',
      duration: '',
      sortBy: 'title',
      sortOrder: 'asc'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (sortBy: 'title' | 'price' | 'duration_minutes' | 'created_at', sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4">
              Astrology Services
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl opacity-90 max-w-3xl mx-auto px-4">
              Discover your destiny with our expert astrologers. Get personalized readings, 
              horoscope analysis, and spiritual guidance from certified professionals.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <div className="flex items-center text-sm sm:text-base">
                <span className="bg-white/20 rounded-full px-3 py-1">
                  ⭐ 1000+ Readings Done
                </span>
              </div>
              <div className="flex items-center text-sm sm:text-base">
                <span className="bg-white/20 rounded-full px-3 py-1">
                  🔮 Expert Astrologers
                </span>
              </div>
              <div className="flex items-center text-sm sm:text-base">
                <span className="bg-white/20 rounded-full px-3 py-1">
                  💫 Accurate Predictions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        onSearch={handleSearch}
        onServiceTypeFilter={handleServiceTypeFilter}
        onPriceRangeFilter={handlePriceRangeFilter}
        onDurationFilter={handleDurationFilter}
        onClearFilters={handleClearFilters}
        activeFilters={{
          search: filters.search || '',
          service_type: filters.service_type || '',
          price_range: filters.price_range || '',
          duration: filters.duration || ''
        }}
      />

      {/* Service Type Tabs - Mobile Optimized */}
      <ServiceTypeTabs
        serviceTypes={mockServiceTypes}
        activeServiceType={filters.service_type || ''}
        onServiceTypeChange={handleServiceTypeFilter}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500 mb-4 text-sm sm:text-base">
                Try adjusting your search or filter criteria to find the perfect astrology service for you.
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