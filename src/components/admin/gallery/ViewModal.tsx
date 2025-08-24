'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import {
  XMarkIcon,
  EyeIcon,
  StarIcon,
  CalendarIcon,
  TagIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

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
        
        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <EyeIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  Gallery Item Details
                </h3>
                <Badge variant={getStatusColor(item.status)} size="sm">
                  {item.status}
                </Badge>
                {item.is_featured && (
                  <div className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    <StarSolidIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Featured</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Image */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {item.large_url || item.medium_url ? (
                  <Image
                    src={item.large_url || item.medium_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <PhotoIcon className="h-16 w-16" />
                  </div>
                )}
              </div>

              {/* Image URLs */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Available Sizes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {item.thumbnail_url && (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>Thumbnail</span>
                      <a
                        href={item.thumbnail_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View
                      </a>
                    </div>
                  )}
                  {item.medium_url && (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>Medium</span>
                      <a
                        href={item.medium_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View
                      </a>
                    </div>
                  )}
                  {item.large_url && (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>Large</span>
                      <a
                        href={item.large_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View
                      </a>
                    </div>
                  )}
                  {item.original_url && (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>Original</span>
                      <a
                        href={item.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Sidebar */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Title</label>
                    <p className="mt-1 text-sm text-gray-900">{item.title}</p>
                  </div>
                  
                  {item.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Description</label>
                      <p className="mt-1 text-sm text-gray-900">{item.description}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-500">ID</label>
                    <p className="mt-1 text-sm text-gray-900">#{item.id}</p>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Category
                </h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">{item.category?.title}</p>
                  {item.category?.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.category.description}</p>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Statistics</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Views</span>
                    <span className="font-medium text-gray-900">{item.popularity}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Featured</span>
                    <span className="font-medium text-gray-900">
                      {item.is_featured ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Dates
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <label className="block text-gray-500">Created</label>
                    <p className="text-gray-900">{formatDateTime(item.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-gray-500">Updated</label>
                    <p className="text-gray-900">{formatDateTime(item.updated_at)}</p>
                  </div>
                  {item.taken_at && (
                    <div>
                      <label className="block text-gray-500">Photo Taken</label>
                      <p className="text-gray-900">{formatDateTime(item.taken_at)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Web URL */}
              {item.web_url && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Public URL</h4>
                  <a
                    href={item.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm break-all"
                  >
                    {item.web_url}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;