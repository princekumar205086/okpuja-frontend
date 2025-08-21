import React from 'react';
import {
  EyeIcon,
  PencilIcon,
  LinkIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface BookingCardsProps {
  bookings: any[];
  isLoading: boolean;
  onAction: (action: string, booking: any) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

const EnhancedBookingCards: React.FC<BookingCardsProps> = ({
  bookings,
  isLoading,
  onAction,
  getStatusColor,
  getStatusIcon,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-xl mb-2">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {bookings.map((booking) => {
        const bookingId = booking.astro_book_id || booking.book_id || booking.id;
        const customerName = booking.user_name || booking.customer_name || booking.contact_name || 'N/A';
        const customerEmail = booking.user_email || booking.contact_email || 'N/A';
        const customerPhone = booking.user_phone || booking.contact_phone || booking.contact_number || 'N/A';
        const amount = booking.total_amount || booking.service?.price || booking.package_price || 0;
        const address = booking.address_full || booking.address || booking.birth_place || 'N/A';
        const serviceTitle = booking.service?.title || booking.service_title || booking.package_name || 'Service';
        const status = booking.status || 'N/A';
        const createdDate = booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A';

        return (
          <div key={bookingId} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">#{bookingId}</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  {status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{serviceTitle}</h3>
              <p className="text-2xl font-bold text-orange-600">₹{amount}</p>
            </div>

            {/* Customer Info */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{customerName}</p>
                  <p className="text-sm text-gray-500">{createdDate}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {customerEmail !== 'N/A' && (
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{customerEmail}</span>
                  </div>
                )}
                
                {customerPhone !== 'N/A' && (
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{customerPhone}</span>
                  </div>
                )}
                
                {address !== 'N/A' && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Actions</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAction('view', booking)}
                    className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAction('edit', booking)}
                    className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Edit Booking"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAction('send_link', booking)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Send Meet Link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EnhancedBookingCards;