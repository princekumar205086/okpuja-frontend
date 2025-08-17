'use client';

import React, { useState } from 'react';
import { useUserPromoStore, type UserPromoCode } from '../../../../stores/userPromoStore';
import { 
  ClipboardDocumentIcon, 
  EyeIcon,
  CalendarIcon,
  TagIcon,
  GiftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { format, isAfter, isBefore } from 'date-fns';

interface PromoCardGridProps {
  onViewDetails: (promo: UserPromoCode) => void;
}

const PromoCardGrid: React.FC<PromoCardGridProps> = ({ onViewDetails }) => {
  const { availablePromos, loading, copyPromoCode, pagination, setPagination } = useUserPromoStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getPromoStatus = (promo: UserPromoCode) => {
    const now = new Date();
    const expiryDate = new Date(promo.expiry_date);
    const startDate = promo.start_date ? new Date(promo.start_date) : null;

    if (!promo.is_active) {
      return { status: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' };
    }

    if (promo.is_used_by_user) {
      return { status: 'used', label: 'Used', color: 'bg-blue-100 text-blue-800' };
    }

    if (isAfter(now, expiryDate)) {
      return { status: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800' };
    }

    if (startDate && isBefore(now, startDate)) {
      return { status: 'scheduled', label: 'Upcoming', color: 'bg-yellow-100 text-yellow-800' };
    }

    // Check if expiring soon (within 7 days)
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (isAfter(nextWeek, expiryDate)) {
      return { status: 'expiring', label: 'Expiring Soon', color: 'bg-orange-100 text-orange-800' };
    }

    return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const formatDiscount = (discount: string, type: 'PERCENT' | 'FIXED') => {
    const value = parseFloat(discount);
    return type === 'PERCENT' ? `${value}% OFF` : `₹${value.toLocaleString()} OFF`;
  };

  const handleCopyCode = async (code: string) => {
    await copyPromoCode(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 bg-gray-300 rounded w-24"></div>
              <div className="h-6 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="mb-4">
              <div className="h-8 bg-gray-300 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-300 rounded flex-1"></div>
              <div className="h-10 w-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (availablePromos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <GiftIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No promo codes found</h3>
        <p className="text-gray-500">Check back later for new promotional offers!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {availablePromos.map((promo) => {
          const statusInfo = getPromoStatus(promo);
          const isExpiringSoon = statusInfo.status === 'expiring';
          const isUsed = statusInfo.status === 'used';
          const isExpired = statusInfo.status === 'expired';
          const isAvailable = statusInfo.status === 'active' || statusInfo.status === 'expiring';

          return (
            <div
              key={promo.id}
              className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                isExpiringSoon ? 'border-orange-200 bg-orange-50/30' : 
                isUsed ? 'border-blue-200 bg-blue-50/30' :
                isExpired ? 'border-gray-200 bg-gray-50/30' :
                'border-gray-200 hover:border-orange-300'
              }`}
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      {promo.code_type === 'ASSIGNED' ? 'Assigned to You' : 'Public Offer'}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Promo Code */}
                <div className="mb-4">
                  <div className={`text-2xl font-bold mb-2 ${
                    isAvailable ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    {promo.code}
                  </div>
                  {promo.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{promo.description}</p>
                  )}
                </div>

                {/* Discount Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${
                      isAvailable ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {formatDiscount(promo.discount, promo.discount_type)}
                    </div>
                    {promo.min_order_amount && (
                      <div className="text-xs text-gray-500 mt-1">
                        Min order: ₹{parseFloat(promo.min_order_amount).toLocaleString()}
                      </div>
                    )}
                    {promo.max_discount_amount && promo.discount_type === 'PERCENT' && (
                      <div className="text-xs text-gray-500">
                        Max discount: ₹{parseFloat(promo.max_discount_amount).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Expires: {format(new Date(promo.expiry_date), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  {promo.usage_limit && (
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>
                        Used: {promo.user_usage_count || 0}
                        {promo.usage_limit && ` / ${promo.usage_limit}`}
                      </span>
                    </div>
                  )}

                  {promo.service_type && (
                    <div className="flex items-center gap-2">
                      <GiftIcon className="h-4 w-4" />
                      <span className="capitalize">For {promo.service_type} services</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    disabled={isExpired}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      isExpired
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isUsed
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="h-4 w-4" />
                        {isUsed ? 'Copy Again' : 'Copy Code'}
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => onViewDetails(promo)}
                    className="p-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Used Badge */}
              {isUsed && (
                <div className="absolute top-4 right-4">
                  <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    USED
                  </div>
                </div>
              )}

              {/* Expiring Soon Badge */}
              {isExpiringSoon && !isUsed && (
                <div className="absolute top-4 right-4">
                  <div className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    EXPIRES SOON
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.total}</span> promo codes
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromoCardGrid;