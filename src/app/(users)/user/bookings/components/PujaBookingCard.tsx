'use client';

import React from 'react';
import { Calendar, Clock, IndianRupee, Eye, Video, X, Download } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface PujaBookingCardProps {
  booking: any;
  onViewDetails: (booking: any) => void;
  onCancel: (booking: any) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
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

const PujaBookingCard: React.FC<PujaBookingCardProps> = ({ booking, onViewDetails, onCancel }) => {
  const canCancel = canCancelBooking(booking.selected_date, booking.selected_time);

  const handleInvoiceDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (booking.book_id) {
      window.open(`/booking/invoice/${booking.book_id}/`, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
              {booking.cart?.puja_service?.title || 'Puja Service'}
            </h3>
            <p className="text-sm text-gray-500">ID: {booking.book_id}</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <StatusBadge status={booking.status} size="sm" />
            <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
              <IndianRupee className="w-4 h-4" />
              {booking.total_amount}
            </div>
          </div>
        </div>

        {/* Service Image */}
        {booking.cart?.puja_service?.image_url && (
          <div className="aspect-video rounded-xl overflow-hidden shadow-sm mb-4">
            <img
              src={booking.cart.puja_service.image_url}
              alt={booking.cart.puja_service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Date & Time */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="font-medium">{formatDate(booking.selected_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <span className="font-medium">{formatTime(booking.selected_time)}</span>
          </div>
        </div>

        {/* Service Details */}
        {booking.cart?.puja_service && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Category:</span>
                <p className="font-medium text-gray-900 truncate">
                  {booking.cart.puja_service.category_detail?.name || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <p className="font-medium text-gray-900">{booking.cart.puja_service.type}</p>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <p className="font-medium text-gray-900">{booking.cart.puja_service.duration_minutes}m</p>
              </div>
              <div>
                <span className="text-gray-500">Language:</span>
                <p className="font-medium text-gray-900">{booking.cart.package?.language || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Address Preview */}
        {booking.address && (
          <div className="text-xs text-gray-600 mb-4">
            <span className="font-medium">Address: </span>
            <span className="line-clamp-1">
              {booking.address.address_line1}, {booking.address.city}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onViewDetails(booking)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-sm shadow-sm"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          
          <button
            onClick={handleInvoiceDownload}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Invoice</span>
          </button>

          {booking.status?.toLowerCase() === 'confirmed' && (
            <button
              onClick={() => onCancel(booking)}
              disabled={!canCancel}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors duration-200 ${
                canCancel 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              title={!canCancel ? 'Can only cancel 24 hours before booking time' : 'Cancel booking'}
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">{canCancel ? 'Cancel' : 'Locked'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PujaBookingCard;
