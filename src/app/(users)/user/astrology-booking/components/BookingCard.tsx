import React from 'react';
import { UserAstrologyBooking, formatBookingDate, formatBookingTime, getStatusColor } from '../userAstrologyApiService';
import Image from 'next/image';

interface BookingCardProps {
  booking: UserAstrologyBooking;
  onViewDetails: () => void;
  onCancelBooking: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onViewDetails,
  onCancelBooking
}) => {
  const statusStyle = getStatusColor(booking.status);
  const paymentStatusStyle = getStatusColor(booking.payment_status);
  
  // Check if meeting is upcoming
  const isMeetingUpcoming = () => {
    if (!booking.meeting_time) return false;
    
    const meetingTime = new Date(booking.meeting_time);
    const now = new Date();
    
    // Meeting is upcoming if it's in the future but within the next 24 hours
    const timeDiff = meetingTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return timeDiff > 0 && hoursDiff <= 24;
  };
  
  const isUpcoming = isMeetingUpcoming();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {isUpcoming && (
        <div className="bg-yellow-50 px-4 py-2 border-b border-yellow-100">
          <p className="text-sm font-medium text-yellow-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Upcoming Session
          </p>
        </div>
      )}
      
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
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Booking ID</p>
            <p className="text-sm font-medium">{booking.astro_book_id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Booked On</p>
            <p className="text-sm">{booking.created_at ? formatBookingDate(booking.created_at) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Preferred Date</p>
            <p className="text-sm">{formatBookingDate(booking.preferred_date)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Preferred Time</p>
            <p className="text-sm">{formatBookingTime(booking.preferred_time)}</p>
          </div>
        </div>
        
        {booking.meeting_link && (
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-blue-700 mb-1">Meeting Details</p>
                <a 
                  href={booking.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-600 hover:underline truncate block mb-1"
                >
                  {booking.meeting_link}
                </a>
                {booking.meeting_time && (
                  <p className="text-xs text-blue-600">
                    Scheduled for: {formatBookingDate(booking.meeting_time)} at {formatBookingTime(booking.meeting_time)}
                  </p>
                )}
              </div>
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
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <button
              onClick={onViewDetails}
              className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md font-medium transition-colors"
            >
              View Details
            </button>
            
            {booking.status === 'CONFIRMED' && (
              <button
                onClick={() => onCancelBooking(booking.astro_book_id || '')}
                className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-md font-medium transition-colors"
              >
                Cancel Booking
              </button>
            )}
            
            {booking.meeting_link && (
              <a
                href={booking.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                Join Meeting
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
