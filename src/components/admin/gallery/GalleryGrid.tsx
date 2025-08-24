'use client';

import React from 'react';
import { useGalleryStore } from '@/app/stores/galleryStore';
import { Spinner } from '@/components/ui/loader';
import GalleryItemCard from './GalleryItemCard';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface GalleryGridProps {
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onView: (item: any) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  onEdit,
  onDelete,
  onView,
}) => {
  const { items, itemsLoading, error } = useGalleryStore();

  if (itemsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" text="Loading gallery items..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Gallery</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <PhotoIcon className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Gallery Items</h3>
        <p className="text-gray-600 mb-4">
          Get started by uploading your first gallery item.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <GalleryItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;