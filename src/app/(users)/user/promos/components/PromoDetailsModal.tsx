'use client';

import React from 'react';
import { useUserPromoStore, type UserPromoCode } from '../../../../stores/userPromoStore';
import { XMarkIcon, CalendarIcon, TagIcon, GiftIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface PromoDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  promo: UserPromoCode | null;
}

const PromoDetailsModal: React.FC<PromoDetailsModalProps> = ({ isOpen, onClose, promo }) => {
  const { copyPromoCode } = useUserPromoStore();

  if (!isOpen || !promo) return null;

  const formatDiscount = (discount: string, type: 'PERCENT' | 'FIXED') => {
    const value = parseFloat(discount);
    return type === 'PERCENT' ? `${value}%` : `₹${value.toLocaleString()}`;
  };

  const getStatusInfo = () => {
    const now = new Date();
    const expiryDate = new Date(promo.expiry_date);
    const startDate = promo.start_date ? new Date(promo.start_date) : null;

    if (!promo.is_active) {
      return { status: 'Inactive', color: 'text-gray-800 bg-gray-100' };
    }

    if (promo.is_used_by_user) {
      return { status: 'Used by You', color: 'text-blue-800 bg-blue-100' };
    }

    if (expiryDate < now) {
      return { status: 'Expired', color: 'text-red-800 bg-red-100' };
    }

    if (startDate && startDate > now) {
      return { status: 'Upcoming', color: 'text-yellow-800 bg-yellow-100' };
    }

    // Check if expiring soon
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (expiryDate <= nextWeek) {
      return { status: 'Expiring Soon', color: 'text-orange-800 bg-orange-100' };
    }

    return { status: 'Active', color: 'text-green-800 bg-green-100' };
  };

  const statusInfo = getStatusInfo();

  const handleCopyCode = async () => {
    await copyPromoCode(promo.code);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h3 className="text-3xl font-bold text-orange-600">{promo.code}</h3>
              <button
                onClick={handleCopyCode}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy code"
              >
                <ClipboardDocumentIcon className="h-5 w-5" />
              </button>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}>
              {statusInfo.status}
            </span>
          </div>

          {/* Description */}
          {promo.description && (
            <div className="text-center">
              <p className="text-gray-700">{promo.description}</p>
            </div>
          )}

          {/* Discount Information */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {formatDiscount(promo.discount, promo.discount_type)}
              <span className="text-lg font-normal"> OFF</span>
            </div>
            <p className="text-sm text-orange-700">
              {promo.discount_type === 'PERCENT' ? 'Percentage Discount' : 'Fixed Amount Discount'}
            </p>
          </div>

          {/* Conditions */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Terms & Conditions</h4>
            
            <div className="space-y-3">
              {promo.min_order_amount && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Minimum Order Amount</p>
                    <p className="text-sm text-gray-600">₹{parseFloat(promo.min_order_amount).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {promo.max_discount_amount && promo.discount_type === 'PERCENT' && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Maximum Discount</p>
                    <p className="text-sm text-gray-600">₹{parseFloat(promo.max_discount_amount).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {promo.service_type && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <GiftIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Applicable Services</p>
                    <p className="text-sm text-gray-600 capitalize">{promo.service_type} services only</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Valid Until</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(promo.expiry_date), 'MMMM dd, yyyy hh:mm a')}
                  </p>
                </div>
              </div>

              {promo.usage_limit && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Usage Information</p>
                    <p className="text-sm text-gray-600">
                      You've used this code {promo.user_usage_count || 0} time(s)
                      {promo.usage_limit && ` out of ${promo.usage_limit} allowed`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Code Type Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <GiftIcon className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                {promo.code_type === 'ASSIGNED' ? 'Exclusively Yours' : 'Public Offer'}
              </span>
            </div>
            <p className="text-sm text-blue-700">
              {promo.code_type === 'ASSIGNED' 
                ? 'This promo code has been specially assigned to your account.'
                : 'This is a public promotional offer available to all users.'
              }
            </p>
          </div>

          {/* Usage History Note */}
          {promo.is_used_by_user && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                <strong>✓ You've successfully used this promo code!</strong><br />
                You can copy and use it again if usage limits allow.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCopyCode}
            disabled={statusInfo.status === 'Expired'}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              statusInfo.status === 'Expired'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            <ClipboardDocumentIcon className="h-4 w-4" />
            Copy Code
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoDetailsModal;