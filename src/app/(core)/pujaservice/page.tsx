'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PujaService, PujaServiceFilters, PaginationParams } from './types';
import SearchFilter from './components/SearchFilter';
import CategoryTabs from './components/CategoryTabs';
import SortOptions from './components/SortOptions';
import ServiceCard from './components/ServiceCard';
import Pagination from './components/Pagination';
import { ServiceGridSkeleton } from './components/LoadingSkeletons';
import { usePujaServiceStore } from '../../stores/pujaServiceStore';
import { useAuthStore } from '../../stores/authStore';
import { usePackageCount } from './hooks/usePackageCount';
import LoginPrompt from './components/LoginPrompt';

export default function PujaservicePage() {
  const { user } = useAuthStore();
  
  const {
    services,
    categories,
    loading,
    error,
    searchTerm,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    filters,
    fetchServices,
    fetchCategories,
    setSearchTerm,
    setCurrentPage,
    setFilters,
    clearError,
  } = usePujaServiceStore();

  const { packageCounts, loading: packagesLoading } = usePackageCount(services);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Initialize data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchServices({ page: 1 })
        ]);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, [fetchCategories, fetchServices]);

  // Reload services when filters change
  useEffect(() => {
    if (searchTerm !== undefined || Object.keys(filters).length > 0) {
      const loadServices = async () => {
        try {
          await fetchServices({
            page: 1,
            search: searchTerm,
            category: filters.category,
            type: filters.type,
            location: filters.location,
            language: filters.language,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
            is_active: true, // Only show active services to public
          });
        } catch (error) {
          console.error('Failed to load services:', error);
        }
      };

      loadServices();
    }
  }, [searchTerm, filters, fetchServices]);

  // Handle pagination
  const handlePageChange = async (page: number) => {
    try {
      setCurrentPage(page);
      await fetchServices({
        page,
        search: searchTerm,
        category: filters.category,
        type: filters.type,
        location: filters.location,
        language: filters.language,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        is_active: true,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to change page:', error);
    }
  };

  // Filter handlers
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string) => {
    const categoryId = category ? parseInt(category) : undefined;
    setFilters({ ...filters, category: categoryId });
    setCurrentPage(1);
  };

  const handleTypeFilter = (type: string) => {
    setFilters({ ...filters, type: type || undefined });
    setCurrentPage(1);
  };

  const handleLocationFilter = (location: string) => {
    setFilters({ ...filters, location: location || undefined });
    setCurrentPage(1);
  };

  const handleLanguageFilter = (language: string) => {
    setFilters({ ...filters, language: language || undefined });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleSortChange = (sortBy: 'title' | 'price' | 'duration' | 'created_at', sortOrder: 'asc' | 'desc') => {
    setFilters({ ...filters, sortBy, sortOrder });
  };

  // Handle authentication-required actions
  const handleBookingAction = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return false;
    }
    return true;
  };

  // Transform services to match expected format
  const transformedServices = useMemo(() => {
    return services.map(service => ({
      ...service,
      image: service.image_url || '',
      image_thumbnail: service.image_url || '',
      image_card: service.image_url || '',
      category: service.category_detail || { id: 0, name: 'Unknown', created_at: '', updated_at: '' },
      packages: [], // Packages will be fetched separately when needed
    }));
  }, [services]);

  const paginationData = {
    page: currentPage,
    limit: pageSize,
    total: totalCount,
    totalPages: totalPages,
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

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading services</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      clearError();
                      fetchServices({ page: 1, is_active: true });
                    }}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <SearchFilter
        categories={categories}
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        onTypeFilter={handleTypeFilter}
        onLocationFilter={handleLocationFilter}
        onLanguageFilter={handleLanguageFilter}
        onClearFilters={handleClearFilters}
        activeFilters={{
          search: searchTerm || '',
          category: (filters.category || '').toString(),
          type: filters.type || '',
          location: filters.location || '',
          language: filters.language || ''
        }}
      />

      {/* Category Tabs - Mobile Optimized */}
      <CategoryTabs
        categories={categories}
        activeCategory={(filters.category || '').toString()}
        onCategoryChange={handleCategoryFilter}
      />

      {/* Sort Options */}
      {!loading && (
        <SortOptions
          sortBy={filters.sortBy || 'title'}
          sortOrder={filters.sortOrder || 'asc'}
          onSortChange={handleSortChange}
          totalResults={totalCount}
        />
      )}

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <ServiceGridSkeleton count={12} />
        ) : transformedServices.length > 0 ? (
          <>
            {/* Results Summary - Mobile */}
            <div className="mb-6 sm:hidden">
              <p className="text-sm text-gray-600 text-center">
                Showing {transformedServices.length} of {totalCount} services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {transformedServices.map((service, index) => {
                const packageData = packageCounts[service.id];
                return (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    index={index}
                    onBookingAction={handleBookingAction}
                    packageCount={packageData?.count || 0}
                    packagePreviews={packageData?.packages || []}
                  />
                );
              })}
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
      {!loading && transformedServices.length > 0 && (
        <Pagination
          pagination={paginationData}
          onPageChange={handlePageChange}
        />
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <LoginPrompt
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
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