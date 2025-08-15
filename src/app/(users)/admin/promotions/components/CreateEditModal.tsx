'use client';

import React, { useState, useEffect } from 'react';
import { usePromotionStore, type PromoCode, type DiscountType, type CodeType } from '../../../../stores/promotionStore';
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { formatDateTimeLocal, generatePromoCode, isValidPromoCode } from '../utils';

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: PromoCode | null;
}

const CreateEditModal: React.FC<CreateEditModalProps> = ({ isOpen, onClose, editData }) => {
  const { createPromoCode, updatePromoCode, loading } = usePromotionStore();
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount: '',
    discount_type: 'PERCENT' as DiscountType,
    min_order_amount: '',
    max_discount_amount: '',
    start_date: '',
    expiry_date: '',
    usage_limit: '',
    code_type: 'PUBLIC' as CodeType,
    is_active: true,
    service_type: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editData) {
      setFormData({
        code: editData.code || '',
        description: editData.description || '',
        discount: editData.discount || '',
        discount_type: editData.discount_type || 'PERCENT',
        min_order_amount: editData.min_order_amount || '',
        max_discount_amount: editData.max_discount_amount || '',
        start_date: editData.start_date ? formatDateTimeLocal(editData.start_date) : '',
        expiry_date: editData.expiry_date ? formatDateTimeLocal(editData.expiry_date) : '',
        usage_limit: editData.usage_limit?.toString() || '',
        code_type: editData.code_type || 'PUBLIC',
        is_active: editData.is_active ?? true,
        service_type: editData.service_type || '',
      });
    } else {
      // Reset form for create mode
      setFormData({
        code: '',
        description: '',
        discount: '',
        discount_type: 'PERCENT',
        min_order_amount: '',
        max_discount_amount: '',
        start_date: '',
        expiry_date: '',
        usage_limit: '',
        code_type: 'PUBLIC',
        is_active: true,
        service_type: '',
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Promo code is required';
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

    if (formData.start_date && formData.expiry_date) {
      if (new Date(formData.start_date) >= new Date(formData.expiry_date)) {
        newErrors.start_date = 'Start date must be before expiry date';
      }
    }

    if (formData.usage_limit && (isNaN(Number(formData.usage_limit)) || Number(formData.usage_limit) <= 0)) {
      newErrors.usage_limit = 'Usage limit must be a positive number';
    }

    if (formData.min_order_amount && (isNaN(Number(formData.min_order_amount)) || Number(formData.min_order_amount) < 0)) {
      newErrors.min_order_amount = 'Minimum order amount must be a positive number';
    }

    if (formData.max_discount_amount && (isNaN(Number(formData.max_discount_amount)) || Number(formData.max_discount_amount) <= 0)) {
      newErrors.max_discount_amount = 'Maximum discount amount must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: any = {
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim(),
      discount: formData.discount,
      discount_type: formData.discount_type,
      expiry_date: new Date(formData.expiry_date).toISOString(),
      code_type: formData.code_type,
      is_active: formData.is_active,
    };

    if (formData.start_date) {
      submitData.start_date = new Date(formData.start_date).toISOString();
    }

    if (formData.usage_limit) {
      submitData.usage_limit = parseInt(formData.usage_limit);
    }

    if (formData.min_order_amount) {
      submitData.min_order_amount = formData.min_order_amount;
    }

    if (formData.max_discount_amount) {
      submitData.max_discount_amount = formData.max_discount_amount;
    }

    if (formData.service_type && formData.code_type === 'SERVICE_SPECIFIC') {
      submitData.service_type = formData.service_type;
    }

    let success = false;
    if (editData) {
      success = await updatePromoCode(editData.id!, submitData);
    } else {
      success = await createPromoCode(submitData);
    }

    if (success) {
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

  const generateCode = () => {
    const generated = generatePromoCode('', 8);
    handleInputChange('code', generated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editData ? 'Edit Promo Code' : 'Create New Promo Code'}
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
          {/* Code and Generate Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promo Code *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.code ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter promo code"
              />
              <button
                type="button"
                onClick={generateCode}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Generate
              </button>
            </div>
            {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Enter description for the promo code"
            />
          </div>

          {/* Discount and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Enter discount value"
              />
              {errors.discount && <p className="mt-1 text-sm text-red-600">{errors.discount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type *
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

          {/* Min Order Amount and Max Discount Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Order Amount (₹)
              </label>
              <input
                type="number"
                value={formData.min_order_amount}
                onChange={(e) => handleInputChange('min_order_amount', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.min_order_amount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter minimum order amount"
              />
              {errors.min_order_amount && <p className="mt-1 text-sm text-red-600">{errors.min_order_amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Discount Amount (₹)
              </label>
              <input
                type="number"
                value={formData.max_discount_amount}
                onChange={(e) => handleInputChange('max_discount_amount', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.max_discount_amount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter maximum discount amount"
              />
              {errors.max_discount_amount && <p className="mt-1 text-sm text-red-600">{errors.max_discount_amount}</p>}
            </div>
          </div>

          {/* Start Date and Expiry Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.start_date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
            </div>

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
          </div>

          {/* Usage Limit and Code Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Limit
              </label>
              <input
                type="number"
                value={formData.usage_limit}
                onChange={(e) => handleInputChange('usage_limit', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.usage_limit ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Leave empty for unlimited"
              />
              {errors.usage_limit && <p className="mt-1 text-sm text-red-600">{errors.usage_limit}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code Type *
              </label>
              <select
                value={formData.code_type}
                onChange={(e) => handleInputChange('code_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="SERVICE_SPECIFIC">Service Specific</option>
              </select>
            </div>
          </div>

          {/* Service Type (only if SERVICE_SPECIFIC) */}
          {formData.code_type === 'SERVICE_SPECIFIC' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <select
                value={formData.service_type}
                onChange={(e) => handleInputChange('service_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="">Select Service Type</option>
                <option value="astrology">Astrology</option>
                <option value="puja">Puja</option>
                <option value="both">Both</option>
              </select>
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

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
              {loading ? 'Saving...' : editData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditModal;
