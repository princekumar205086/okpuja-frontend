'use client';

import React, { useEffect, useState } from 'react';
import { usePromotionStore, type PromoCode } from '../../../stores/promotionStore';

// Import all components
import StatsCards from './components/StatsCards';
import SearchAndFilters from './components/SearchAndFilters';
import ActionButtons from './components/ActionButtons';
import PromoTable from './components/PromoTable';
import CreateEditModal from './components/CreateEditModal';
import BulkCreateModal from './components/BulkCreateModal';
import EmailModal from './components/EmailModal';
import ViewModal from './components/ViewModal';

const PromotionsPage: React.FC = () => {
  const { 
    fetchPromoCodes, 
    fetchPromoStats, 
    filters, 
    pagination,
    clearError 
  } = usePromotionStore();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkCreateModalOpen, setIsBulkCreateModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [viewingPromo, setViewingPromo] = useState<PromoCode | null>(null);

  // Initialize data on component mount
  useEffect(() => {
    fetchPromoCodes();
    fetchPromoStats();
  }, [fetchPromoCodes, fetchPromoStats]);

  // Refetch data when filters or pagination change
  useEffect(() => {
    fetchPromoCodes();
  }, [filters, pagination.page, pagination.limit, fetchPromoCodes]);

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Modal handlers
  const handleCreateSingle = () => {
    setEditingPromo(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateBulk = () => {
    setIsBulkCreateModalOpen(true);
  };

  const handleSendEmail = () => {
    setIsEmailModalOpen(true);
  };

  const handleEdit = (promo: PromoCode) => {
    setEditingPromo(promo);
    setIsCreateModalOpen(true);
  };

  const handleView = (promo: PromoCode) => {
    setViewingPromo(promo);
    setIsViewModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setEditingPromo(null);
  };

  const handleCloseBulkCreateModal = () => {
    setIsBulkCreateModalOpen(false);
  };

  const handleCloseEmailModal = () => {
    setIsEmailModalOpen(false);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingPromo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Promotions & Coupons
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage promotional codes, discounts, and special offers for your customers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <StatsCards />

        {/* Search and Filters */}
        <SearchAndFilters />

        {/* Action Buttons */}
        <ActionButtons
          onCreateSingle={handleCreateSingle}
          onCreateBulk={handleCreateBulk}
          onSendEmail={handleSendEmail}
        />

        {/* Promo Codes Table */}
        <PromoTable
          onEdit={handleEdit}
          onView={handleView}
        />
      </div>

      {/* Modals */}
      <CreateEditModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        editData={editingPromo}
      />

      <BulkCreateModal
        isOpen={isBulkCreateModalOpen}
        onClose={handleCloseBulkCreateModal}
      />

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={handleCloseEmailModal}
      />

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        promo={viewingPromo}
      />
    </div>
  );
};

export default PromotionsPage;