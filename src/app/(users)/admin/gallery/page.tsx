'use client';

import React, { useState, useEffect } from 'react';
import { useGalleryStore } from '@/app/stores/galleryStore';
import { useAuthStore } from '@/app/stores/authStore';

// Components
import GalleryFilters from '@/components/admin/gallery/GalleryFilters';
import GalleryToolbar from '@/components/admin/gallery/GalleryToolbar';
import GalleryGrid from '@/components/admin/gallery/GalleryGrid';
import GalleryPagination from '@/components/admin/gallery/GalleryPagination';
import UploadModal from '@/components/admin/gallery/UploadModal';
import EditModal from '@/components/admin/gallery/EditModal';
import ViewModal from '@/components/admin/gallery/ViewModal';
import DeleteConfirmModal from '@/components/admin/gallery/DeleteConfirmModal';
import AuthDebugInfo from '@/components/admin/gallery/AuthDebugInfo';
import AuthHelper from '@/components/admin/gallery/AuthHelper';

// UI Components
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/loader';

// Icons
import { PhotoIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';

const GalleryPage: React.FC = () => {
  const { user, initAuth } = useAuthStore();
  const {
    items,
    selectedItems,
    currentItem,
    loading,
    itemsLoading,
    error,
    totalItems,
    fetchItems,
    fetchCategories,
    deleteItem,
    deleteMultipleItems,
    clearError,
  } = useGalleryStore();

  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemForAction, setSelectedItemForAction] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Initialize data on mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (user) {
      fetchItems();
      fetchCategories();
    }
  }, [user]); // Removed fetchItems and fetchCategories from dependencies

  // Handle item actions
  const handleEdit = (item: any) => {
    setSelectedItemForAction(item);
    setEditModalOpen(true);
  };

  const handleView = (item: any) => {
    setSelectedItemForAction(item);
    setViewModalOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItemForAction(item);
    setDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return;
    setSelectedItemForAction(null);
    setDeleteModalOpen(true);
  };

  const handleUpload = () => {
    setUploadModalOpen(true);
  };

  const handleRefresh = () => {
    fetchItems(1);
    fetchCategories();
  };

  // Delete confirmation
  const handleConfirmDelete = async () => {
    let success = false;
    
    if (selectedItemForAction) {
      // Single item delete
      success = await deleteItem(selectedItemForAction.id);
    } else if (selectedItems.size > 0) {
      // Bulk delete
      const itemIds = Array.from(selectedItems);
      success = await deleteMultipleItems(itemIds);
    }

    if (success) {
      setDeleteModalOpen(false);
      setSelectedItemForAction(null);
    }
  };

  // Modal close handlers
  const handleCloseModals = () => {
    setUploadModalOpen(false);
    setEditModalOpen(false);
    setViewModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedItemForAction(null);
  };

  // Get delete modal content
  const getDeleteModalContent = () => {
    if (selectedItemForAction) {
      return {
        title: 'Delete Gallery Item',
        message: `Are you sure you want to delete "${selectedItemForAction.title}"?`,
        itemCount: 1,
      };
    } else if (selectedItems.size > 0) {
      return {
        title: 'Delete Gallery Items',
        message: 'Are you sure you want to delete the selected gallery items?',
        itemCount: selectedItems.size,
      };
    }
    return {
      title: 'Delete Items',
      message: 'Are you sure you want to delete these items?',
      itemCount: 0,
    };
  };

  const deleteModalContent = getDeleteModalContent();

  // Show loading state if user is not authenticated yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Auth Helper for Testing */}
      <AuthHelper />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <PhotoIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your gallery images and collections
                </p>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <div className="text-sm text-gray-500">
                {totalItems} total items
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-400 mr-3">
                  <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-red-600 hover:text-red-700 hover:bg-red-100"
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <GalleryFilters />
        </div>

        {/* Toolbar */}
        <GalleryToolbar
          onUpload={handleUpload}
          onBulkDelete={handleBulkDelete}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Gallery Grid */}
          <div className="p-6">
            <GalleryGrid
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          </div>

          {/* Pagination */}
          <GalleryPagination />
        </div>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={selectedItemForAction}
      />

      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        item={selectedItemForAction}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={loading}
        title={deleteModalContent.title}
        message={deleteModalContent.message}
        itemCount={deleteModalContent.itemCount}
      />

      {/* Auth Debug Info (Development only) */}
      <AuthDebugInfo />
    </div>
  );
};

export default GalleryPage;
