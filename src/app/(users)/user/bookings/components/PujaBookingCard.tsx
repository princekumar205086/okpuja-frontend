'use client';

import React from 'react';
import { Calendar, Clock, IndianRupee, Eye, Video, X, Download } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Image from 'next/image';

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">
              {booking.cart?.puja_service?.title || 'Puja Service'}
            </h3>
            <p className="text-xs text-gray-500">ID: {booking.book_id}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <StatusBadge status={booking.status} size="sm" />
            <div className="flex items-center gap-1 text-base font-bold text-gray-900">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="text-sm">{booking.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Service Image - Smaller */}
        {booking.cart?.puja_service?.image_url && (
          <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-sm mb-3">
            <Image
              src={booking.cart.puja_service.image_url}
              alt={booking.cart.puja_service.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              layout="responsive"
              width={500}
              height={300}
            />
          </div>
        )}

        {/* Date & Time - Compact */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <div className="p-1 bg-blue-50 rounded">
              <Calendar className="w-3 h-3 text-blue-600" />
            </div>
            <span className="font-medium">{formatDate(booking.selected_date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <div className="p-1 bg-orange-50 rounded">
              <Clock className="w-3 h-3 text-orange-600" />
            </div>
            <span className="font-medium">{formatTime(booking.selected_time)}</span>
          </div>
        </div>

        {/* Service Details - Compact Grid */}
        {booking.cart?.puja_service && (
          <div className="bg-gray-50 rounded-lg p-2.5 mb-3">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              <div>
                <span className="text-gray-500 block">Category</span>
                <p className="font-medium text-gray-900 truncate">
                  {booking.cart.puja_service.category_detail?.name || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-gray-500 block">Duration</span>
                <p className="font-medium text-gray-900">{booking.cart.puja_service.duration_minutes}m</p>
              </div>
            </div>
          </div>
        )}

        {/* Address Preview - Compact */}
        {booking.address && (
          <div className="text-xs text-gray-600 mb-3">
            <span className="font-medium">📍 </span>
            <span className="line-clamp-1">
              {booking.address.address_line1}, {booking.address.city}
            </span>
          </div>
        )}
      </div>

      {/* Actions - Compact */}
      <div className="px-4 pb-4 border-t border-gray-50 pt-3">
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(booking)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            Details
          </button>
          
          <button
            onClick={handleInvoiceDownload}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            Invoice
          </button>

          {booking.status?.toLowerCase() === 'confirmed' && (
            <button
              onClick={() => onCancel(booking)}
              disabled={!canCancel}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${
                canCancel 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              title={!canCancel ? 'Can only cancel 24 hours before booking time' : 'Cancel booking'}
            >
              <X className="w-3.5 h-3.5" />
              {canCancel ? 'Cancel' : 'Locked'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PujaBookingCard;
