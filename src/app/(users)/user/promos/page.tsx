'use client';

import React, { useEffect, useState } from 'react';
import { useUserPromoStore, type UserPromoCode } from '../../../stores/userPromoStore';

// Import components
import UserStatsCards from './components/UserStatsCards';
import PromoFilters from './components/PromoFilters';
import PromoValidator from './components/PromoValidator';
import PromoCardGrid from './components/PromoCardGrid';
import PromoDetailsModal from './components/PromoDetailsModal';
import PromoHistoryList from './components/PromoHistoryList';

const UserPromosPage: React.FC = () => {
  const { 
    fetchAvailablePromos, 
    fetchPromoHistory, 
    fetchUserStats,
    filters, 
    pagination,
    clearError 
  } = useUserPromoStore();

  // Modal state
  const [selectedPromo, setSelectedPromo] = useState<UserPromoCode | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'available' | 'history'>('available');

  // Initialize data on component mount
  useEffect(() => {
    fetchAvailablePromos();
    fetchPromoHistory();
    fetchUserStats();
  }, [fetchAvailablePromos, fetchPromoHistory, fetchUserStats]);

  // Refetch data when filters or pagination change
  useEffect(() => {
    fetchAvailablePromos();
  }, [fetchAvailablePromos, filters, pagination.page, pagination.limit]);

  // Update stats when data changes
  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleViewDetails = (promo: UserPromoCode) => {
    setSelectedPromo(promo);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPromo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              My Promo Codes
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Discover amazing deals and save money on your purchases. 
              Copy your promo codes and use them at checkout!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <UserStatsCards />

        {/* Promo Code Validator */}
        <PromoValidator />

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('available')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'available'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Available Codes
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'history'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Usage History
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'available' ? (
          <>
            {/* Search and Filters */}
            <PromoFilters />

            {/* Promo Cards Grid */}
            <PromoCardGrid onViewDetails={handleViewDetails} />
          </>
        ) : (
          <PromoHistoryList />
        )}
      </div>

      {/* Modals */}
      <PromoDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        promo={selectedPromo}
      />

      {/* Help Section */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to Use Promo Codes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Find Your Code</h3>
                <p className="text-gray-600 text-sm">
                  Browse through available promo codes or check your assigned codes
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Copy the Code</h3>
                <p className="text-gray-600 text-sm">
                  Click the copy button to copy the promo code to your clipboard
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Apply at Checkout</h3>
                <p className="text-gray-600 text-sm">
                  Paste the code during checkout and enjoy your discount!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPromosPage;