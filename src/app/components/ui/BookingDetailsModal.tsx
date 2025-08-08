'use client';

import React, { useState } from 'react';
import {
  XMarkIcon,
  UserIcon,
  CalendarDaysIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PencilIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  bookingType: 'astrology' | 'regular' | 'puja' | 'all';
  onUpdateStatus?: (status: string, reason?: string) => Promise<boolean>;
  onEdit?: (booking: any) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  bookingType,
  onUpdateStatus,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(booking?.status || '');
  const [statusReason, setStatusReason] = useState('');

  if (!isOpen || !booking) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
      case 'REJECTED':
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <ClockIcon className="h-4 w-4" />;
      case 'CONFIRMED':
      case 'COMPLETED':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'CANCELLED':
      case 'REJECTED':
      case 'FAILED':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async () => {
    if (!onUpdateStatus || newStatus === booking.status) {
      setIsEditing(false);
      return;
    }

    setStatusUpdating(true);
    try {
      const success = await onUpdateStatus(newStatus, statusReason);
      if (success) {
        setIsEditing(false);
        toast.success('Status updated successfully');
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const renderBookingDetails = () => {
    switch (bookingType) {
      case 'astrology':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Booking ID</label>
                <p className="text-sm text-gray-900">{booking.astro_book_id || booking.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Service</label>
                <p className="text-sm text-gray-900">{booking.service?.title || 'Unknown Service'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer</label>
                <p className="text-sm text-gray-900">{booking.customer_name || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{booking.contact_email || 'No email'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Price</label>
                <p className="text-sm text-gray-900">₹{booking.service?.price || 0}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Session Scheduled</label>
                <p className="text-sm text-gray-900">
                  {booking.is_session_scheduled ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {booking.session_date && (
              <div>
                <label className="text-sm font-medium text-gray-500">Session Date</label>
                <p className="text-sm text-gray-900">
                  {new Date(booking.session_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        );
      
      case 'regular':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Booking ID</label>
                <p className="text-sm text-gray-900">{booking.book_id || booking.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Amount</label>
                <p className="text-sm text-gray-900">₹{booking.total_amount || 0}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer</label>
                <p className="text-sm text-gray-900">{booking.user_name || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{booking.user_email || 'No email'}</p>
              </div>
            </div>

            {booking.address && (
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-sm text-gray-900">{booking.address}</p>
              </div>
            )}

            {booking.payment_status && (
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Status</label>
                <p className="text-sm text-gray-900">{booking.payment_status}</p>
              </div>
            )}
          </div>
        );
      
      case 'puja':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Service</label>
                <p className="text-sm text-gray-900">{booking.service_title || 'Unknown Service'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-sm text-gray-900">{booking.category_name || 'N/A'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer</label>
                <p className="text-sm text-gray-900">{booking.contact_name || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{booking.contact_email || 'No email'}</p>
              </div>
            </div>

            {booking.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">{booking.phone}</p>
              </div>
            )}

            {booking.address && (
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-sm text-gray-900">{booking.address}</p>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="text-sm text-gray-900 capitalize">{booking.type || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ID</label>
                <p className="text-sm text-gray-900">{booking.id}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <UserIcon className="h-6 w-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">
              Booking Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Status</h3>
              {!isEditing && onUpdateStatus && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit Status
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                {['CANCELLED', 'REJECTED', 'FAILED'].includes(newStatus) && (
                  <textarea
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    placeholder="Enter reason for status change..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                )}

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleStatusUpdate}
                    disabled={statusUpdating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {statusUpdating ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setNewStatus(booking.status);
                      setStatusReason('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)}
                <span className="ml-1">{booking.status_display || booking.status}</span>
              </span>
            )}
          </div>

          {/* Booking Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Booking Information</h3>
            {renderBookingDetails()}
          </div>

          {/* Timestamps */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-sm text-gray-900">
                  {booking.created_at 
                    ? new Date(booking.created_at).toLocaleString()
                    : 'Unknown'
                  }
                </p>
              </div>
              {booking.updated_at && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900">
                    {new Date(booking.updated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(booking)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
