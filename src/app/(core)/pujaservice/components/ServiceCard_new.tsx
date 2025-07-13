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
}

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group h-full"
    >
      <Link href={`/pujaservice/${encryptId(service.id)}`}>
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={service.image_card ?? '/placeholder.png'}
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
            
            <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3">
              {service.description}
            </p>
            
            {/* Action indicator */}
            <div className="mt-4 pt-4 border-t border-gray-100">
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
