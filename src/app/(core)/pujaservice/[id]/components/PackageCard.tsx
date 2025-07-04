'use client';

import React from 'react';
import { Package } from '../../types';
import { languageDisplayNames, packageTypeDisplayNames } from '../../mockData';
import { CheckCircle, XCircle, Users, MapPin } from 'lucide-react';

interface PackageCardProps {
  package: Package;
  onSelect: (pkg: Package) => void;
  isSelected: boolean;
}

export default function PackageCard({ package: pkg, onSelect, isSelected }: PackageCardProps) {
  const getPackageColor = (type: string) => {
    switch (type) {
      case 'BASIC':
        return 'border-blue-200 bg-blue-50';
      case 'STANDARD':
        return 'border-green-200 bg-green-50';
      case 'PREMIUM':
        return 'border-purple-200 bg-purple-50';
      case 'CUSTOM':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPackageTextColor = (type: string) => {
    switch (type) {
      case 'BASIC':
        return 'text-blue-700';
      case 'STANDARD':
        return 'text-green-700';
      case 'PREMIUM':
        return 'text-purple-700';
      case 'CUSTOM':
        return 'text-orange-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div 
      className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-orange-500 bg-orange-50 shadow-lg' 
          : `${getPackageColor(pkg.package_type)} hover:shadow-md`
      }`}
      onClick={() => onSelect(pkg)}
    >
      {/* Package Type Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isSelected ? 'bg-orange-100 text-orange-800' : `${getPackageTextColor(pkg.package_type)}`
        }`}>
          {packageTypeDisplayNames[pkg.package_type]}
        </span>
        {pkg.package_type === 'PREMIUM' && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Most Popular
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">
            ₹{parseFloat(pkg.price).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Package Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{pkg.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{pkg.priest_count} Priest{pkg.priest_count > 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center text-sm">
          {pkg.includes_materials ? (
            <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" />
          )}
          <span className={pkg.includes_materials ? 'text-green-700' : 'text-red-700'}>
            {pkg.includes_materials ? 'Materials Included' : 'Materials Not Included'}
          </span>
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-medium">Language:</span> {languageDisplayNames[pkg.language]}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6">
        {pkg.description}
      </p>

      {/* Select Button */}
      <button
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isSelected
            ? 'bg-orange-600 text-white'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {isSelected ? 'Selected' : 'Select Package'}
      </button>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1">
          <CheckCircle className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
