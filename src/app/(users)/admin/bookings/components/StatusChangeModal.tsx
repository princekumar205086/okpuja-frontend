'use client';

import { useState } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAdminBookingStore } from '@/app/stores/adminBookingStore';
import { toast } from 'react-hot-toast';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  type: 'astrology' | 'regular' | 'puja';
}

const STATUS_OPTIONS = {
  astrology: [
    { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ],
  regular: [
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { value: 'FAILED', label: 'Failed', color: 'bg-gray-100 text-gray-800' }
  ],
  puja: [
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'FAILED', label: 'Failed', color: 'bg-gray-100 text-gray-800' }
  ]
};

export default function StatusChangeModal({
  isOpen,
  onClose,
  booking,
  type
}: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateBookingStatus } = useAdminBookingStore();

  if (!isOpen || !booking) return null;

  const statusOptions = STATUS_OPTIONS[type] || [];
  const currentStatus = booking.status;
  const needsReason = ['CANCELLED', 'REJECTED', 'FAILED'].includes(selectedStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStatus) {
      toast.error('Please select a status');
      return;
    }

    if (needsReason && !reason.trim()) {
      toast.error(`Please provide a reason for ${selectedStatus.toLowerCase()}`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get the correct booking ID
      const bookingId = booking.id || booking.astro_book_id || booking.book_id;
      
      // Use the correct type for API call
      const apiType = type === 'puja' ? 'regular' : type;
      
      const success = await updateBookingStatus(apiType, bookingId, {
        status: selectedStatus,
        reason: reason.trim() || undefined
      });
      
      if (success) {
        onClose();
        setSelectedStatus('');
        setReason('');
      }
    } catch (error) {
      console.error('Status change error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColorClass = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Change Booking Status
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Booking Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>ID:</strong> {booking.book_id || booking.astro_book_id}</p>
              <p><strong>Customer:</strong> {booking.contact_email || booking.user?.email}</p>
              <div className="flex items-center">
                <strong>Current Status:</strong>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(currentStatus)}`}>
                  {currentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <label
                  key={status.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedStatus === status.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={selectedStatus === status.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                  {status.value === currentStatus && (
                    <span className="ml-auto text-xs text-gray-500">(Current)</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Reason Field */}
          {needsReason && (
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                <ExclamationTriangleIcon className="h-4 w-4 inline mr-1 text-amber-500" />
                Reason *
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder={`Please provide a reason for ${selectedStatus.toLowerCase()}...`}
                required
              />
            </div>
          )}

          {/* Warning for irreversible actions */}
          {selectedStatus === 'COMPLETED' && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" />
                <div className="ml-3 text-sm text-amber-700">
                  <strong>Warning:</strong> Marking as completed cannot be undone easily. Make sure the service has been delivered.
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedStatus}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}