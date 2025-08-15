'use client';

import React, { useState } from 'react';
import { usePromotionStore, type PromoCode } from '../../../../stores/promotionStore';
import { 
  PlusIcon, 
  DocumentArrowDownIcon,
  ClipboardDocumentListIcon,
  EnvelopeIcon 
} from '@heroicons/react/24/outline';

interface ActionButtonsProps {
  onCreateSingle: () => void;
  onCreateBulk: () => void;
  onSendEmail: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onCreateSingle, 
  onCreateBulk, 
  onSendEmail 
}) => {
  const { exportPromoCodes, loading } = usePromotionStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportPromoCodes();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <button
          onClick={onCreateSingle}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Promo Code
        </button>

        <button
          onClick={onCreateBulk}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
          Bulk Create
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSendEmail}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <EnvelopeIcon className="h-5 w-5 mr-2" />
          Send Email
        </button>

        <button
          onClick={handleExport}
          disabled={loading || isExporting}
          className="flex items-center justify-center px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
