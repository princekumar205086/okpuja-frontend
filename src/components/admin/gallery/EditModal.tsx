'use client';

import React, { useState } from 'react';
import { useGalleryStore } from '@/app/stores/galleryStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import {
  XMarkIcon,
  PencilIcon,
  EyeIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, item }) => {
  const {
    categories,
    loading,
    updateItem,
    fetchCategories,
    categoriesLoading,
  } = useGalleryStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    is_featured: false,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'DRAFT',
    taken_at: '',
  });

  // Initialize categories
  React.useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      fetchCategories();
    }
  }, [categories.length, categoriesLoading, fetchCategories]);

  // Initialize form data when item changes
  React.useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        category_id: item.category?.id?.toString() || '',
        is_featured: item.is_featured || false,
        status: item.status || 'ACTIVE',
        taken_at: item.taken_at ? item.taken_at.split('T')[0] : '',
      });
    }
  }, [item]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title.');
      return;
    }

    if (!formData.category_id) {
      alert('Please select a category.');
      return;
    }

    const updateData = {
      title: formData.title,
      description: formData.description || undefined,
      category_id: parseInt(formData.category_id),
      is_featured: formData.is_featured,
      status: formData.status,
      taken_at: formData.taken_at || undefined,
    };

    const success = await updateItem(item.id, updateData);
    if (success) {
      onClose();
    }
  };

  if (!isOpen || !item) return null;

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.title,
  }));

  // Add a default option if no categories are available
  if (categoryOptions.length === 0) {
    categoryOptions.push({
      value: '',
      label: 'No categories available',
    });
  }

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'DRAFT', label: 'Draft' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'destructive';
      case 'DRAFT':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <PencilIcon className="h-6 w-6 text-indigo-600" />
              </div>
              Edit Gallery Item
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 bg-gray-50">
            {/* Image Preview */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <EyeIcon className="h-5 w-5" />
                  Image Preview
                </h4>
                
                <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                  {item.medium_url ? (
                    <Image
                      src={item.medium_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <EyeIcon className="h-16 w-16" />
                    </div>
                  )}
                  
                  {/* Overlays */}
                  <div className="absolute top-3 left-3">
                    <Badge variant={getStatusColor(item.status)} size="sm">
                      {item.status}
                    </Badge>
                  </div>

                  {item.is_featured && (
                    <div className="absolute top-3 right-3 bg-yellow-100 rounded-full p-2">
                      <StarSolidIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                  )}

                  {item.popularity > 0 && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      {item.popularity}
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Metadata</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium">ID:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">#{item.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium">Created:</span>
                    <span>{formatDateTime(item.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium">Updated:</span>
                    <span>{formatDateTime(item.updated_at)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Views:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.popularity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <PencilIcon className="h-5 w-5" />
                Edit Details
              </h4>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Title *"
                  placeholder="Enter gallery title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />

                <Textarea
                  label="Description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Category *"
                    options={categoryOptions}
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    placeholder="Select category"
                    required
                  />

                  <Select
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Date Taken"
                    type="date"
                    value={formData.taken_at}
                    onChange={(e) => handleInputChange('taken_at', e.target.value)}
                  />

                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      checked={formData.is_featured}
                      onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                      label="Featured Item"
                      description="Show in featured sections"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <PencilIcon className="h-4 w-4" />
                        Update Item
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;