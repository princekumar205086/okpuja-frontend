'use client';

import React from 'react';
import { ServiceType } from '../types';

interface ServiceTypeTabsProps {
  serviceTypes: ServiceType[];
  activeServiceType: string;
  onServiceTypeChange: (serviceType: string) => void;
}

export default function ServiceTypeTabs({
  serviceTypes,
  activeServiceType,
  onServiceTypeChange
}: ServiceTypeTabsProps) {
  return (
    <div className="bg-white border-b overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 py-4">
          {/* All Services Tab */}
          <button
            onClick={() => onServiceTypeChange('')}
            className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
              activeServiceType === ''
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span className="mr-1 sm:mr-2">🌟</span>
            All Services
          </button>

          {/* Service Type Tabs */}
          {serviceTypes.map((serviceType) => (
            <button
              key={serviceType.value}
              onClick={() => onServiceTypeChange(serviceType.value)}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                activeServiceType === serviceType.value
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1 sm:mr-2">{serviceType.icon}</span>
              <span className="hidden sm:inline">{serviceType.label}</span>
              <span className="sm:hidden">
                {serviceType.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
