'use client';

import React, { useState } from 'react';
import { usePromotionStore, type BulkPromoCode, type DiscountType } from '../../../../stores/promotionStore';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface BulkCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkCreateModal: React.FC<BulkCreateModalProps> = ({ isOpen, onClose }) => {
  const { bulkCreatePromoCodes, loading } = usePromotionStore();
  
  const [formData, setFormData] = useState({
    prefix: '',
    count: 1,
    discount: '',
    discount_type: 'PERCENT' as DiscountType,
    expiry_date: '',
    usage_limit: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.prefix.trim()) {
      newErrors.prefix = 'Prefix is required';
    } else if (formData.prefix.length > 20) {
      newErrors.prefix = 'Prefix must be 20 characters or less';
    }

    if (!formData.count || formData.count < 1 || formData.count > 100) {
      newErrors.count = 'Count must be between 1 and 100';
    }

    if (!formData.discount.trim()) {
      newErrors.discount = 'Discount is required';
    } else if (isNaN(Number(formData.discount)) || Number(formData.discount) <= 0) {
      newErrors.discount = 'Discount must be a positive number';
    }

    if (!formData.expiry_date) {
      newErrors.expiry_date = 'Expiry date is required';
    } else if (new Date(formData.expiry_date) <= new Date()) {
      newErrors.expiry_date = 'Expiry date must be in the future';
    }

    if (!formData.usage_limit || formData.usage_limit < 1) {
      newErrors.usage_limit = 'Usage limit must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: BulkPromoCode = {
      prefix: formData.prefix.trim().toUpperCase(),
      count: formData.count,
      discount: formData.discount,
      discount_type: formData.discount_type,
      expiry_date: new Date(formData.expiry_date).toISOString(),
      usage_limit: formData.usage_limit,
    };

    const success = await bulkCreatePromoCodes(submitData);
    if (success) {
      // Reset form
      setFormData({
        prefix: '',
        count: 1,
        discount: '',
        discount_type: 'PERCENT',
        expiry_date: '',
        usage_limit: 1,
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generatePreview = () => {
    if (!formData.prefix || !formData.count) return [];
    
    const previews = [];
    for (let i = 0; i < Math.min(formData.count, 5); i++) {
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      previews.push(`${formData.prefix}${randomSuffix}`);
    }
    
    if (formData.count > 5) {
      previews.push('...');
    }
    
    return previews;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Bulk Create Promo Codes
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Bulk Create Information</p>
                <p className="mt-1">
                  This will create multiple promo codes with the specified prefix followed by random characters.
                  All codes will have the same discount and expiry settings.
                </p>
              </div>
            </div>
          </div>

          {/* Prefix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code Prefix *
            </label>
            <input
              type="text"
              value={formData.prefix}
              onChange={(e) => handleInputChange('prefix', e.target.value.toUpperCase())}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.prefix ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., SUMMER"
              maxLength={20}
            />
            {errors.prefix && <p className="mt-1 text-sm text-red-600">{errors.prefix}</p>}
            <p className="mt-1 text-xs text-gray-500">
              Maximum 20 characters. Random characters will be appended to create unique codes.
            </p>
          </div>

          {/* Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Codes *
            </label>
            <input
              type="number"
              value={formData.count}
              onChange={(e) => handleInputChange('count', parseInt(e.target.value) || 1)}
              min={1}
              max={100}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.count ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter number of codes to create"
            />
            {errors.count && <p className="mt-1 text-sm text-red-600">{errors.count}</p>}
            <p className="mt-1 text-xs text-gray-500">
              Maximum 100 codes can be created at once.
            </p>
          </div>

          {/* Discount and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount *
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => handleInputChange('discount', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.discount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter discount"
              />
              {errors.discount && <p className="mt-1 text-sm text-red-600">{errors.discount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) => handleInputChange('discount_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="PERCENT">Percentage</option>
                <option value="FIXED">Fixed Amount</option>
              </select>
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <input
              type="datetime-local"
              value={formData.expiry_date}
              onChange={(e) => handleInputChange('expiry_date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.expiry_date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.expiry_date && <p className="mt-1 text-sm text-red-600">{errors.expiry_date}</p>}
          </div>

          {/* Usage Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usage Limit per Code *
            </label>
            <input
              type="number"
              value={formData.usage_limit}
              onChange={(e) => handleInputChange('usage_limit', parseInt(e.target.value) || 1)}
              min={1}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.usage_limit ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter usage limit"
            />
            {errors.usage_limit && <p className="mt-1 text-sm text-red-600">{errors.usage_limit}</p>}
            <p className="mt-1 text-xs text-gray-500">
              How many times each individual code can be used.
            </p>
          </div>

          {/* Preview */}
          {formData.prefix && formData.count > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Preview (Sample Codes)</h4>
              <div className="flex flex-wrap gap-2">
                {generatePreview().map((code, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-700"
                  >
                    {code}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {formData.count} codes will be created with discount of{' '}
                {formData.discount_type === 'PERCENT' ? `${formData.discount}%` : `₹${formData.discount}`}
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : `Create ${formData.count} Codes`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkCreateModal;
