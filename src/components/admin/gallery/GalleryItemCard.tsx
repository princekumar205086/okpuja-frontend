'use client';

import React from 'react';
import { useGalleryStore } from '@/app/stores/galleryStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDateTime, truncateText } from '@/lib/utils';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface GalleryItemCardProps {
  item: any;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onView: (item: any) => void;
}

const GalleryItemCard: React.FC<GalleryItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onView,
}) => {
  const { selectedItems, toggleItemSelection } = useGalleryStore();
  const isSelected = selectedItems.has(item.id);

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
    <div className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
      isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    }`}>
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <PhotoIcon className="h-12 w-12" />
          </div>
        )}
        
        {/* Selection Checkbox */}
        <div className="absolute top-2 left-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleItemSelection(item.id)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {/* Featured Badge */}
        {item.is_featured && (
          <div className="absolute top-2 right-2">
            <StarSolidIcon className="h-5 w-5 text-yellow-500" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          <Badge variant={getStatusColor(item.status)} size="sm">
            {item.status}
          </Badge>
        </div>

        {/* Popularity */}
        {item.popularity > 0 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <EyeIcon className="h-3 w-3" />
            {item.popularity}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {truncateText(item.title, 50)}
          </h3>
          
          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {truncateText(item.description, 80)}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{item.category?.title}</span>
            <span>{formatDateTime(item.created_at)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onView(item)}
              className="flex items-center gap-1"
            >
              <EyeIcon className="h-4 w-4" />
              View
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(item)}
              className="flex items-center gap-1"
            >
              <PencilIcon className="h-4 w-4" />
              Edit
            </Button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(item)}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GalleryItemCard;