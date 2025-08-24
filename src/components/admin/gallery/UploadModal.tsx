'use client';

import React, { useState, useCallback } from 'react';
import { useGalleryStore } from '@/app/stores/galleryStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/loader';
import { formatFileSize } from '@/lib/utils';
import {
  XMarkIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const {
    categories,
    uploading,
    uploadItems,
    fetchCategories,
    categoriesLoading,
  } = useGalleryStore();

  // Form state
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
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

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setFiles([]);
      setFormData({
        title: '',
        description: '',
        category_id: '',
        is_featured: false,
        status: 'ACTIVE',
        taken_at: '',
      });
    }
  }, [isOpen]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    setFiles(prev => [...prev, ...imageFiles]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const imageFiles = selectedFiles.filter(file => 
        file.type.startsWith('image/')
      );
      setFiles(prev => [...prev, ...imageFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      alert('Please select at least one image to upload.');
      return;
    }

    if (!formData.category_id || formData.category_id === '') {
      alert('Please select a category. If no categories are available, please create one first.');
      return;
    }

    const uploadData = {
      files,
      title: formData.title || `Gallery Upload ${new Date().toLocaleDateString()}`,
      description: formData.description,
      category_id: parseInt(formData.category_id),
      is_featured: formData.is_featured,
      status: formData.status,
      taken_at: formData.taken_at || undefined,
    };

    const success = await uploadItems(uploadData);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

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

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CloudArrowUpIcon className="h-6 w-6 text-blue-600" />
              </div>
              Upload Gallery Images
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6 bg-gray-50">
            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                dragActive
                  ? 'border-blue-400 bg-blue-50 scale-[1.02]'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                  dragActive ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <CloudArrowUpIcon className={`h-10 w-10 ${
                    dragActive ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </div>
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-lg font-semibold text-gray-900">
                      Drop images here or click to upload
                    </span>
                    <span className="block text-sm text-gray-500 mt-2">
                      PNG, JPG, GIF up to 10MB each
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                  />
                </div>
              </div>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="space-y-4 bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <PhotoIcon className="h-4 w-4" />
                    Selected Files ({files.length})
                  </h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    Total: {formatFileSize(totalSize)}
                  </span>
                </div>
                
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <PhotoIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <span className="text-sm font-medium text-gray-700 truncate block max-w-[200px]">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Image Details</h4>
              
              <Input
                label="Title"
                placeholder="Enter gallery title (optional)"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />

              <Textarea
                label="Description"
                placeholder="Enter description (optional)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Category *"
                  options={categoryOptions}
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  placeholder="Select category"
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
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 bg-white px-6 py-4 rounded-b-xl">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={uploading}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading || files.length === 0}
                className="flex items-center gap-2 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {uploading ? (
                  <>
                    <Spinner size="sm" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="h-4 w-4" />
                    Upload {files.length} Image{files.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;