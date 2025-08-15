'use client';

import React, { useState } from 'react';
import { usePromotionStore } from '../../../../stores/promotionStore';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose }) => {
  const { promoCodes, sendPromoEmail, loading } = usePromotionStore();
  
  const [selectedPromos, setSelectedPromos] = useState<number[]>([]);
  const [emails, setEmails] = useState<string[]>(['']);
  const [emailError, setEmailError] = useState<string>('');

  const handlePromoToggle = (promoId: number) => {
    setSelectedPromos(prev => 
      prev.includes(promoId) 
        ? prev.filter(id => id !== promoId)
        : [...prev, promoId]
    );
  };

  const addEmailField = () => {
    setEmails(prev => [...prev, '']);
  };

  const removeEmailField = (index: number) => {
    setEmails(prev => prev.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, value: string) => {
    setEmails(prev => prev.map((email, i) => i === index ? value : email));
    setEmailError('');
  };

  const validateEmails = (): boolean => {
    const validEmails = emails.filter(email => email.trim());
    
    if (validEmails.length === 0) {
      setEmailError('At least one email address is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validEmails.filter(email => !emailRegex.test(email.trim()));
    
    if (invalidEmails.length > 0) {
      setEmailError('Please enter valid email addresses');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPromos.length === 0) {
      setEmailError('Please select at least one promo code');
      return;
    }

    if (!validateEmails()) {
      return;
    }

    const validEmails = emails.filter(email => email.trim()).map(email => email.trim());
    const success = await sendPromoEmail(selectedPromos, validEmails);
    
    if (success) {
      // Reset form
      setSelectedPromos([]);
      setEmails(['']);
      setEmailError('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedPromos([]);
    setEmails(['']);
    setEmailError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Send Promo Codes via Email
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Select Promo Codes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Promo Codes to Send
            </label>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {promoCodes.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">No promo codes available</p>
              ) : (
                <div className="divide-y divide-gray-200">
                  {promoCodes.map((promo) => (
                    <div key={promo.id} className="p-3 hover:bg-gray-50">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPromos.includes(promo.id!)}
                          onChange={() => handlePromoToggle(promo.id!)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{promo.code}</span>
                            <span className="text-sm text-gray-500">
                              {promo.discount_type === 'PERCENT' ? `${promo.discount}%` : `₹${promo.discount}`}
                            </span>
                          </div>
                          {promo.description && (
                            <p className="text-xs text-gray-500 mt-1">{promo.description}</p>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedPromos.length > 0 && (
              <p className="mt-2 text-sm text-green-600">
                {selectedPromos.length} promo code(s) selected
              </p>
            )}
          </div>

          {/* Email Addresses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Recipient Email Addresses
            </label>
            <div className="space-y-3">
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter email address"
                  />
                  {emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addEmailField}
              className="mt-3 flex items-center text-sm text-orange-600 hover:text-orange-800 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add another email
            </button>

            {emailError && (
              <p className="mt-2 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          {/* Preview */}
          {selectedPromos.length > 0 && emails.some(email => email.trim()) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Email Summary</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Promo Codes:</span> {selectedPromos.length} selected
                </p>
                <p>
                  <span className="font-medium">Recipients:</span>{' '}
                  {emails.filter(email => email.trim()).length} email address(es)
                </p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedPromos.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Emails'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;
