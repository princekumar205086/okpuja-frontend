'use client';

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

interface BookingDetailsModalProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  onAction: (action: string, bookingId: string) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  open,
  onClose,
  booking,
  onAction
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!open || !booking) return null;

  // Handle different booking types
  const bookingId = booking.astro_book_id || booking.book_id || booking.id;
  const customerName = booking.user?.username || booking.user_name || booking.customer_name || booking.contact_name || 'N/A';
  const customerEmail = booking.user?.email || booking.user_email || booking.contact_email || 'N/A';
  const customerPhone = booking.user?.phone || booking.user_phone || booking.contact_phone || booking.contact_number || 'N/A';
  const amount = booking.service?.price || booking.package_price || booking.total_amount || 0;
  const serviceTitle = booking.service?.title || booking.service_title || booking.package_name || 'Service';
  const status = booking.status || 'N/A';
  const address = booking.address_full || booking.address || booking.birth_place || 'N/A';
  const scheduledDate = booking.selected_date || booking.booking_date || booking.preferred_date || 'N/A';
  const scheduledTime = booking.selected_time || booking.start_time || booking.preferred_time || 'N/A';

  const getStatusColor = (status: string) => {
    const statusColors = {
      PENDING: 'bg-orange-100 text-orange-800 border-orange-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
      IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      FAILED: 'bg-red-100 text-red-800 border-red-200',
    };
    return statusColors[status as keyof typeof statusColors] || statusColors.PENDING;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-orange-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{serviceTitle}</h2>
              <p className="text-sm text-gray-600">Booking ID: {bookingId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
              {status}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{customerPhone}</p>
                    </div>
                  </div>
                  {address !== 'N/A' && (
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">
                        {scheduledDate !== 'N/A' ? new Date(scheduledDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">{scheduledTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CurrencyRupeeIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium text-green-600">₹{amount}</p>
                    </div>
                  </div>
                  {booking.payment_info && (
                    <div className="flex items-center gap-3">
                      <CreditCardIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <p className="font-medium text-gray-900">{booking.payment_info.status}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Raw booking data for debugging */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Booking Details</h3>
                <pre className="text-xs text-gray-600 overflow-auto max-h-96 bg-white p-3 rounded border">
                  {JSON.stringify(booking, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onAction('edit', bookingId)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Edit Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
