import React from 'react';
import { AdminAstrologyBooking } from '../adminAstrologyApiService';
import { formatBookingDate, formatBookingTime, getStatusColor } from '../adminAstrologyApiService';
import Image from 'next/image';

interface BookingDetailsProps {
  booking: AdminAstrologyBooking | null;
  onClose: () => void;
  onUpdateStatus: (bookingId: string, status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => void;
  onSendMeetingLink: (booking: AdminAstrologyBooking) => void;
  onUpdateNotes: (bookingId: string, notes: string) => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ 
  booking, 
  onClose, 
  onUpdateStatus, 
  onSendMeetingLink, 
  onUpdateNotes 
}) => {
  const [notes, setNotes] = React.useState('');
  
  React.useEffect(() => {
    if (booking) {
      setNotes(booking.admin_notes || '');
    }
  }, [booking]);
  
  if (!booking) return null;
  
  const statusStyle = getStatusColor(booking.status);
  const paymentStatusStyle = getStatusColor(booking.payment_status);
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-2/3">
              <div className="flex items-center gap-4 mb-4">
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
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
                      <dt className="text-sm font-medium text-gray-500">Created At:</dt>
                      <dd className="text-sm text-gray-900">{booking.created_at ? formatBookingDate(booking.created_at) : 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Status:</dt>
                      <dd>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                          {booking.status}
                        </span>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Payment Status:</dt>
                      <dd>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${paymentStatusStyle.bg} ${paymentStatusStyle.text}`}>
                          {booking.payment_status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Client Information</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Name:</dt>
                      <dd className="text-sm text-gray-900">{booking.user_details.username || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Email:</dt>
                      <dd className="text-sm text-gray-900">{booking.contact_email}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Phone:</dt>
                      <dd className="text-sm text-gray-900">{booking.contact_phone}</dd>
                    </div>
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
                <h4 className="text-sm font-medium text-gray-500 mb-2">Questions/Concerns</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{booking.questions || 'No questions provided.'}</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Session Management</h4>
              
              {/* Meeting Link Section */}
              <div className="mb-6">
                <h5 className="text-xs font-semibold text-gray-500 mb-2">Google Meet Link</h5>
                {booking.meeting_link ? (
                  <div className="bg-white border border-gray-200 rounded-md p-3 mb-3">
                    <a 
                      href={booking.meeting_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block mb-2 truncate"
                    >
                      {booking.meeting_link}
                    </a>
                    {booking.meeting_time && (
                      <p className="text-xs text-gray-500">
                        Scheduled for: {formatBookingTime(booking.meeting_time)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-3">No meeting link has been set.</p>
                )}
                <button
                  onClick={() => onSendMeetingLink(booking)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  {booking.meeting_link ? 'Update Meeting Link' : 'Send Meeting Link'}
                </button>
              </div>
              
              {/* Admin Notes */}
              <div className="mb-6">
                <h5 className="text-xs font-semibold text-gray-500 mb-2">Admin Notes</h5>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-32 border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add private notes about this booking..."
                ></textarea>
                <button
                  onClick={() => onUpdateNotes(booking.astro_book_id || '', notes)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium mt-2 transition-colors"
                >
                  Save Notes
                </button>
              </div>
              
              {/* Status Actions */}
              <div>
                <h5 className="text-xs font-semibold text-gray-500 mb-2">Actions</h5>
                <div className="space-y-2">
                  {booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => onUpdateStatus(booking.astro_book_id || '', 'COMPLETED')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                  
                  {booking.status !== 'CANCELLED' && (
                    <button
                      onClick={() => onUpdateStatus(booking.astro_book_id || '', 'CANCELLED')}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
