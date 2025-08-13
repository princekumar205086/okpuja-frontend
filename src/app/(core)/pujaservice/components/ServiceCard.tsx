'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PujaService } from '../types';
import { encryptId } from '../encryption';

interface ServiceCardProps {
  service: PujaService;
  index?: number;
  onBookingAction?: () => boolean;
  packageCount?: number;
  packagePreviews?: Array<{ price: number; package_type: string }>;
}

export default function ServiceCard({ 
  service, 
  index = 0, 
  onBookingAction, 
  packageCount = 0, 
  packagePreviews = [] 
}: ServiceCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    // implement later
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group h-full"
    >
      <Link href={`/pujaservice/${encryptId(service.id)}`} onClick={handleClick}>
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={service.image_card ?? '/default-image.jpg'}
              alt={service.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            
            {/* Overlay with category badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            
            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-500/90 text-white backdrop-blur-sm"
              >
                {service.category?.name}
              </motion.span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
              {service.title}
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3 mb-4"
               dangerouslySetInnerHTML={{ __html: service.description }}
            />
            
            {/* Available Packages */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Available Packages:</span>
                <span className="text-orange-600 font-semibold">{packageCount} option{packageCount !== 1 ? 's' : ''}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {/* {packagePreviews.slice(0, 2).map((pkg, idx) => (
                  // <span 
                  //   key={idx}
                  //   className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md font-medium"
                  // >
                  //   ₹{pkg.price}
                  // </span>
                ))} */}
                {packageCount > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                    +{packageCount - 2} more
                  </span>
                )}
                {packageCount === 0 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                    Loading packages...
                  </span>
                )}
              </div>
            </div>
            
            {/* Action indicator */}
            <div className="pt-4 border-t border-gray-100">
              <motion.div 
                className="flex items-center justify-between text-orange-600 font-medium"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-sm">View Details</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
