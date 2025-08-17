'use client';

import React, { useState } from 'react';
import { useUserPromoStore } from '../../../../stores/userPromoStore';
import { MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const PromoValidator: React.FC = () => {
  const { validatePromoCode, validatingCode } = useUserPromoStore();
  const [code, setCode] = useState('');
  const [orderAmount, setOrderAmount] = useState('');
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message?: string;
    discount_amount?: number;
  } | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const result = await validatePromoCode(
      code.trim().toUpperCase(),
      orderAmount ? parseFloat(orderAmount) : undefined
    );
    
    setValidationResult(result);
  };

  const handleReset = () => {
    setCode('');
    setOrderAmount('');
    setValidationResult(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Validate Promo Code</h3>
        <p className="text-sm text-gray-600">
          Check if a promo code is valid and see how much you can save
        </p>
      </div>

      <form onSubmit={handleValidate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Promo Code Input */}
          <div>
            <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
              Promo Code *
            </label>
            <input
              id="promoCode"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors uppercase"
              required
            />
          </div>

          {/* Order Amount Input */}
          <div>
            <label htmlFor="orderAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Order Amount (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                id="orderAmount"
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={validatingCode || !code.trim()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            {validatingCode ? 'Validating...' : 'Validate'}
          </button>
          
          {validationResult && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Validation Result */}
      {validationResult && (
        <div className={`mt-6 p-4 rounded-lg border ${
          validationResult.valid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {validationResult.valid ? (
              <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            
            <div className="flex-1">
              <h4 className={`font-medium ${
                validationResult.valid ? 'text-green-900' : 'text-red-900'
              }`}>
                {validationResult.valid ? 'Valid Promo Code!' : 'Invalid Promo Code'}
              </h4>
              
              {validationResult.message && (
                <p className={`text-sm mt-1 ${
                  validationResult.valid ? 'text-green-700' : 'text-red-700'
                }`}>
                  {validationResult.message}
                </p>
              )}
              
              {validationResult.valid && validationResult.discount_amount && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                  <div className="text-sm text-green-700">
                    <strong>Your Savings:</strong>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    ₹{validationResult.discount_amount.toLocaleString()}
                  </div>
                  {orderAmount && (
                    <div className="text-sm text-green-700 mt-1">
                      Final Amount: ₹{(parseFloat(orderAmount) - validationResult.discount_amount).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoValidator;