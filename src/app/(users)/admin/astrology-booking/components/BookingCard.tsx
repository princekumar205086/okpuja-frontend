import React from 'react';
import { AdminAstrologyBooking, getStatusColor } from '../adminAstrologyApiService';
import { formatBookingDate, formatBookingTime } from '../adminAstrologyApiService';
import Image from 'next/image';

interface BookingCardProps {
  booking: AdminAstrologyBooking;
  onSelect: () => void;
  onUpdateStatus: (bookingId: string, status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onSelect, 
  onUpdateStatus
}) => {
  const statusStyle = getStatusColor(booking.status);
  const paymentStatusStyle = getStatusColor(booking.payment_status);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <div className="flex-shrink-0">
              {booking.service_details.image_url ? (
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                  <Image
                    src={booking.service_details.image_url}
                    alt={booking.service_details.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-orange-100 rounded-md flex items-center justify-center">
                  <span className="text-xl text-orange-600">🔮</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{booking.service_details.title}</h3>
              <p className="text-sm text-gray-500">{booking.service_details.service_type}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
              {booking.status}
            </span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${paymentStatusStyle.bg} ${paymentStatusStyle.text} border ${paymentStatusStyle.border}`}>
              {booking.payment_status}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Client</p>
            <p className="text-sm font-medium">{booking.user_details.username || booking.user_details.email}</p>
            <p className="text-xs text-gray-500 mt-1">Contact</p>
            <p className="text-sm">{booking.contact_phone} | {booking.contact_email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Scheduled For</p>
            <p className="text-sm font-medium">{formatBookingDate(booking.preferred_date)}</p>
            <p className="text-sm">{formatBookingTime(booking.preferred_time)}</p>
            <p className="text-xs text-gray-500 mt-1">Language</p>
            <p className="text-sm">{booking.language}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onSelect}
              className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md font-medium transition-colors"
            >
              View Details
            </button>
            
            {booking.status === 'CONFIRMED' && (
              <button
                onClick={() => onUpdateStatus(booking.astro_book_id || '', 'COMPLETED')}
                className="text-xs px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-md font-medium transition-colors"
              >
                Mark Complete
              </button>
            )}
            
            {(booking.status === 'CONFIRMED') && (
              <button
                onClick={() => onUpdateStatus(booking.astro_book_id || '', 'CANCELLED')}
                className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      
      {booking.meeting_link && (
        <div className="bg-blue-50 px-5 py-2 border-t border-blue-100">
          <p className="text-xs font-medium text-blue-700 mb-1">Meeting Link</p>
          <div className="flex items-center justify-between">
            <a 
              href={booking.meeting_link}
              target="_blank"
              rel="noopener noreferrer" 
              className="text-sm text-blue-600 hover:underline truncate"
            >
              {booking.meeting_link}
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(booking.meeting_link || '')}
              className="text-blue-600 p-1 hover:text-blue-800"
              title="Copy link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
