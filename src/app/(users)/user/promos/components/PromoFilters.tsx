'use client';

import React from 'react';
import { useUserPromoStore } from '../../../../stores/userPromoStore';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const PromoFilters: React.FC = () => {
  const { filters, setFilters } = useUserPromoStore();

  const handleSearchChange = (value: string) => {
    setFilters({ search: value });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters({ [filterType]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search promo codes..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="min-w-[160px]">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="used">Used</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Code Type Filter */}
          <div className="min-w-[160px]">
            <select
              value={filters.code_type}
              onChange={(e) => handleFilterChange('code_type', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
            >
              <option value="all">All Types</option>
              <option value="PUBLIC">Public</option>
              <option value="ASSIGNED">Assigned to Me</option>
            </select>
          </div>

          {/* Service Type Filter */}
          <div className="min-w-[160px]">
            <select
              value={filters.service_type}
              onChange={(e) => handleFilterChange('service_type', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
            >
              <option value="all">All Services</option>
              <option value="astrology">Astrology</option>
              <option value="puja">Puja</option>
            </select>
          </div>

          {/* Filter Button for Mobile */}
          <button className="lg:hidden flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoFilters;