import React from 'react';
import { UserAstrologyBooking, formatBookingDate, formatBookingTime, getStatusColor } from '../userAstrologyApiService';
import Image from 'next/image';

interface BookingDetailsProps {
  booking: UserAstrologyBooking | null;
  onClose: () => void;
  onCancelBooking: (bookingId: string) => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ 
  booking, 
  onClose, 
  onCancelBooking 
}) => {
  if (!booking) return null;
  
  const statusStyle = getStatusColor(booking.status);
  const paymentStatusStyle = getStatusColor(booking.payment_status);
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Booking Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
          <div className="flex items-center gap-4 mb-6">
            <div>
              {booking.service_details.image_url ? (
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={booking.service_details.image_url}
                    alt={booking.service_details.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-orange-100 rounded-md flex items-center justify-center">
                  <span className="text-2xl text-orange-600">🔮</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{booking.service_details.title}</h3>
              <p className="text-gray-600">{booking.service_details.service_type}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                {booking.status}
              </span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${paymentStatusStyle.bg} ${paymentStatusStyle.text} border ${paymentStatusStyle.border}`}>
                {booking.payment_status}
              </span>
            </div>
            
            {booking.meeting_link && (
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <h4 className="text-md font-semibold text-blue-700 mb-2">Meeting Details</h4>
                <div className="flex justify-between items-start mb-2">
                  <a 
                    href={booking.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {booking.meeting_link}
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(booking.meeting_link || '')}
                    className="text-blue-600 p-1 hover:text-blue-800 ml-2 flex-shrink-0"
                    title="Copy link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                
                {booking.meeting_time && (
                  <p className="text-sm text-blue-700">
                    Scheduled for: {formatBookingDate(booking.meeting_time)} at {formatBookingTime(booking.meeting_time)}
                  </p>
                )}
                
                <a
                  href={booking.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Join Meeting
                </a>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Booking Information</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Booking ID:</dt>
                  <dd className="text-sm text-gray-900">{booking.astro_book_id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Payment ID:</dt>
                  <dd className="text-sm text-gray-900">{booking.payment_id || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Price:</dt>
                  <dd className="text-sm text-gray-900">₹{parseFloat(booking.service_details.price).toLocaleString('en-IN')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Duration:</dt>
                  <dd className="text-sm text-gray-900">{booking.service_details.duration_minutes} minutes</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Booked On:</dt>
                  <dd className="text-sm text-gray-900">{booking.created_at ? formatBookingDate(booking.created_at) : 'N/A'}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Session Information</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Preferred Date:</dt>
                  <dd className="text-sm text-gray-900">{formatBookingDate(booking.preferred_date)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Preferred Time:</dt>
                  <dd className="text-sm text-gray-900">{formatBookingTime(booking.preferred_time)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Language:</dt>
                  <dd className="text-sm text-gray-900">{booking.language}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Contact Email:</dt>
                  <dd className="text-sm text-gray-900">{booking.contact_email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Contact Phone:</dt>
                  <dd className="text-sm text-gray-900">{booking.contact_phone}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Birth Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Birth Date</p>
                <p className="text-sm text-gray-900">{formatBookingDate(booking.birth_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Birth Time</p>
                <p className="text-sm text-gray-900">{formatBookingTime(booking.birth_time)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Birth Place</p>
                <p className="text-sm text-gray-900">{booking.birth_place}</p>
              </div>
              <div className="sm:col-span-3">
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="text-sm text-gray-900">{booking.gender}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Your Questions/Concerns</h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{booking.questions || 'No questions provided.'}</p>
            </div>
          </div>
          
          {booking.status === 'CONFIRMED' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => onCancelBooking(booking.astro_book_id || '')}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Cancel Booking
              </button>
              <p className="text-xs text-gray-500 mt-2">
                * Cancellation might be subject to terms and conditions. Please contact support for refund information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
