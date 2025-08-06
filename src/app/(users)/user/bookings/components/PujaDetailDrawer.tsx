'use client';

import React from 'react';
import { Drawer } from '@mui/material';
import { X, Calendar, Clock, MapPin, Phone, Mail, IndianRupee, User, Package } from 'lucide-react';
import StatusBadge from './StatusBadge';
import CopyableText from './CopyableText';

interface PujaDetailDrawerProps {
  booking: any;
  open: boolean;
  onClose: () => void;
  onCancel: (booking: any) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (timeString: string) => {
  const time = timeString.includes(':') ? timeString.split(':').slice(0, 2).join(':') : timeString;
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const canCancelBooking = (selectedDate: string, selectedTime: string): boolean => {
  const bookingDateTime = new Date(`${selectedDate}T${selectedTime}`);
  const now = new Date();
  const timeDiff = bookingDateTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  return hoursDiff >= 24;
};

const PujaDetailDrawer: React.FC<PujaDetailDrawerProps> = ({ booking, open, onClose, onCancel }) => {
  if (!booking) return null;

  const canCancel = canCancelBooking(booking.selected_date, booking.selected_time);

  const handleInvoiceDownload = () => {
    if (booking.book_id) {
      window.open(`/booking/invoice/${booking.book_id}/`, '_blank');
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: '90vh',
          overflow: 'visible'
        }
      }}
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Header with dismiss button */}
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">Puja Booking Details</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6 max-h-[calc(90vh-80px)] overflow-y-auto">
          {/* Booking Info */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {booking.cart?.puja_service?.title || 'Puja Service'}
                </h3>
                <p className="text-sm text-gray-600">Booking ID: {booking.book_id}</p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
                <StatusBadge status={booking.status} />
                <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                  <IndianRupee className="w-5 h-5" />
                  {booking.total_amount}
                </div>
              </div>
            </div>
          </div>

          {/* Service Image */}
          {booking.cart?.puja_service?.image_url && (
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <img
                src={booking.cart.puja_service.image_url}
                alt={booking.cart.puja_service.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Date & Time */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Schedule Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.selected_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">{formatTime(booking.selected_time)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          {booking.cart?.puja_service && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Service Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-gray-900">
                    {booking.cart.puja_service.category_detail?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-medium text-gray-900">{booking.cart.puja_service.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium text-gray-900">{booking.cart.puja_service.duration_minutes} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Language</p>
                  <p className="font-medium text-gray-900">{booking.cart.package?.language || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Address */}
          {booking.address && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Service Address
              </h4>
              <div className="text-gray-700">
                <p>{booking.address.address_line1}</p>
                {booking.address.address_line2 && <p>{booking.address.address_line2}</p>}
                <p>{booking.address.city}, {booking.address.state} - {booking.address.postal_code}</p>
                <p>{booking.address.country}</p>
              </div>
            </div>
          )}

          {/* Package Details */}
          {booking.cart?.package && (
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
              <h4 className="font-semibold text-purple-900 mb-3">Package Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-purple-600">Package Type</p>
                  <p className="font-medium text-purple-900">{booking.cart.package.package_type}</p>
                </div>
                <div>
                  <p className="text-purple-600">Number of Priests</p>
                  <p className="font-medium text-purple-900">{booking.cart.package.priest_count}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-purple-600">Materials</p>
                  <p className="font-medium text-purple-900">
                    {booking.cart.package.includes_materials ? 'Included' : 'Not Included'}
                  </p>
                </div>
                {booking.cart.package.description && (
                  <div className="sm:col-span-2">
                    <p className="text-purple-600">Description</p>
                    <div 
                      className="font-medium text-purple-900"
                      dangerouslySetInnerHTML={{ __html: booking.cart.package.description }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Information */}
          {booking.payment_details && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-4">
              <h4 className="font-semibold text-green-900 mb-3">Payment Information</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-700">Status</span>
                  <span className="font-medium text-green-900">{booking.payment_details.status}</span>
                </div>
                <CopyableText
                  text={booking.payment_details.transaction_id}
                  label="Transaction ID"
                  className="text-sm"
                />
                <div className="flex items-center justify-between">
                  <span className="text-green-700">Payment Date</span>
                  <span className="font-medium text-green-900">
                    {new Date(booking.payment_details.payment_date).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700">Amount</span>
                  <span className="font-medium text-green-900 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {booking.payment_details.amount}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleInvoiceDownload}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Invoice
            </button>
            
            {booking.status?.toLowerCase() === 'confirmed' && (
              <button
                onClick={() => onCancel(booking)}
                disabled={!canCancel}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors duration-200 ${
                  canCancel 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                title={!canCancel ? 'Can only cancel 24 hours before booking time' : 'Cancel booking'}
              >
                <X className="w-5 h-5" />
                {canCancel ? 'Cancel Booking' : 'Cannot Cancel'}
              </button>
            )}
          </div>

          {!canCancel && booking.status?.toLowerCase() === 'confirmed' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Bookings can only be cancelled 24 hours before the scheduled time. 
                Please contact admin for assistance.
              </p>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default PujaDetailDrawer;
