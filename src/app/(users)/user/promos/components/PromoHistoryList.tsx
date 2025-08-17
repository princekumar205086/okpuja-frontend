'use client';

import React from 'react';
import { useUserPromoStore, type PromoHistory } from '../../../../stores/userPromoStore';
import { 
  ClockIcon, 
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const PromoHistoryList: React.FC = () => {
  const { promoHistory, loading } = useUserPromoStore();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage History</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (promoHistory.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage History</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ReceiptPercentIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No usage history yet</h4>
          <p className="text-gray-500">Start using promo codes to see your savings history here!</p>
        </div>
      </div>
    );
  }

  const totalSavings = promoHistory.reduce((sum, history) => 
    sum + parseFloat(history.discount_amount || '0'), 0
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Usage History</h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Saved</p>
          <p className="text-xl font-bold text-green-600">₹{totalSavings.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {promoHistory.map((history) => (
          <div key={history.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="bg-green-100 p-2 rounded-lg">
                <ReceiptPercentIcon className="h-6 w-6 text-green-600" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{history.promo_code.code}</span>
                  <TagIcon className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    <span>Used on {format(new Date(history.used_at), 'MMM dd, yyyy hh:mm a')}</span>
                  </div>
                  
                  {history.order_id && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        Order #{history.order_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Savings Info */}
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  -₹{parseFloat(history.discount_amount).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  from ₹{parseFloat(history.order_amount).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Promo Details */}
            {history.promo_code.description && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">{history.promo_code.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {promoHistory.length} promo code{promoHistory.length !== 1 ? 's' : ''} used
          </span>
          <span className="font-medium text-green-600">
            Total savings: ₹{totalSavings.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PromoHistoryList;