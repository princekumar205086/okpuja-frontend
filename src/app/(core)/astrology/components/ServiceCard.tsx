'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AstrologyService } from '../types';
import { formatPrice, formatDuration, getServiceTypeLabel, getServiceTypeIcon } from '../utils';
import { encryptId } from '../encryption';

// Helper function to strip HTML tags and limit text
const stripHtmlAndLimit = (html: string, limit: number = 150): string => {
  const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  return text.length > limit ? text.substring(0, limit) + '...' : text;
};

interface ServiceCardProps {
  service: AstrologyService;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to booking page or open booking modal
    window.location.href = `/astrology/${encryptId(service.id)}#booking`;
  };

  return (
    <Link href={`/astrology/${encryptId(service.id)}`}>
      <div 
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Service Image */}
        <div className="relative h-48 sm:h-52 lg:h-48 bg-gray-200 overflow-hidden">
          {!imageError ? (
            <Image
              src={service.image_card_url || service.image_url || '/placeholder-service.jpg'}
              alt={service.title}
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
              <div className="text-center">
                <div className="text-4xl mb-2">{getServiceTypeIcon(service.service_type)}</div>
                <p className="text-gray-600 text-sm">Service Image</p>
              </div>
            </div>
          )}
          
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Service Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm">
              <span className="mr-1">{getServiceTypeIcon(service.service_type)}</span>
              {getServiceTypeLabel(service.service_type)}
            </span>
          </div>

          {/* Duration Badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(service.duration_minutes)}
            </span>
          </div>
        </div>

        {/* Service Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors text-center">
            {service.title}
          </h3>

          {/* No Description */}
          
          {/* No Price or Book Button */}

          {/* No features section */}
        </div>
      </div>
    </Link>
  );
}
