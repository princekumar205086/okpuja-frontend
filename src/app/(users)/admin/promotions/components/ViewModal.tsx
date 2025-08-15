'use client';

import React from 'react';
import { usePromotionStore, type PromoCode } from '../../../../stores/promotionStore';
import { XMarkIcon, ClipboardDocumentIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import { getPromoStatus, formatDate, formatDiscount, formatCodeType, copyToClipboard, formatCurrency } from '../utils';

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  promo: PromoCode | null;
}

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, promo }) => {
  if (!isOpen || !promo) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusInfo = () => {
    return getPromoStatus(promo);
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Promo Code Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Promo Code and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-bold text-gray-900">{promo.code}</h3>
              <button
                onClick={() => copyToClipboard(promo.code)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy code"
              >
                <ClipboardDocumentIcon className="h-5 w-5" />
              </button>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Description */}
          {promo.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
              <p className="text-gray-900">{promo.description}</p>
            </div>
          )}

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discount Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Discount Information
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Discount:</span>
                  <span className="text-sm font-bold text-orange-600">
                    {formatDiscount(promo.discount, promo.discount_type)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Type:</span>
                  <span className="text-sm text-gray-900">
                    {promo.discount_type === 'PERCENT' ? 'Percentage' : 'Fixed Amount'}
                  </span>
                </div>

                {promo.min_order_amount && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Min Order:</span>
                    <span className="text-sm text-gray-900">{formatCurrency(promo.min_order_amount)}</span>
                  </div>
                )}

                {promo.max_discount_amount && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Max Discount:</span>
                    <span className="text-sm text-gray-900">{formatCurrency(promo.max_discount_amount)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Usage Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Usage Information
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Code Type:</span>
                  <span className="text-sm text-gray-900">
                    {formatCodeType(promo.code_type)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Usage Count:</span>
                  <span className="text-sm text-gray-900">
                    {promo.usage_count || 0}
                    {promo.usage_limit && ` / ${promo.usage_limit}`}
                  </span>
                </div>

                {promo.usage_limit && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(((promo.usage_count || 0) / promo.usage_limit) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                )}

                {promo.service_type && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Service Type:</span>
                    <span className="text-sm text-gray-900 capitalize">{promo.service_type}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Date Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promo.start_date && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Start Date</p>
                    <p className="text-sm text-gray-900">
                      {formatDate(promo.start_date, 'MMM dd, yyyy hh:mm a')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiry Date</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(promo.expiry_date, 'MMM dd, yyyy hh:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          {(promo.created_at || promo.updated_at) && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                System Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                {promo.created_at && (
                  <div>
                    <span className="font-medium">Created:</span>{' '}
                    {formatDate(promo.created_at, 'MMM dd, yyyy hh:mm a')}
                  </div>
                )}
                
                {promo.updated_at && (
                  <div>
                    <span className="font-medium">Last Updated:</span>{' '}
                    {formatDate(promo.updated_at, 'MMM dd, yyyy hh:mm a')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
