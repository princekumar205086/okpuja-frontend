import React from 'react';
import {
  EyeIcon,
  PencilIcon,
  LinkIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface BookingCardsProps {
  bookings: any[];
  isLoading: boolean;
  onAction: (action: string, booking: any) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  serviceType?: 'astrology' | 'puja' | 'regular';
}

const EnhancedBookingCards: React.FC<BookingCardsProps> = ({
  bookings,
  isLoading,
  onAction,
  getStatusColor,
  getStatusIcon,
  serviceType = 'astrology',
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
        // Handle different booking types (astrology, puja, regular)
        const bookingId = booking.astro_book_id || booking.book_id || booking.id;
        
        // Extract customer name - try to get real name, fallback to extracted from email
        const extractNameFromEmail = (email: string) => {
          if (!email || email === 'N/A') return 'N/A';
          const name = email.split('@')[0];
          return name.split(/[._-]/).map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
        };
        
        const rawCustomerName = booking.user?.username || booking.user_name || booking.customer_name || booking.contact_name;
        const customerEmail = booking.user?.email || booking.user_email || booking.contact_email || 'N/A';
        const customerName = rawCustomerName || extractNameFromEmail(customerEmail) || 'N/A';
        const customerPhone = booking.user?.phone || booking.user_phone || booking.contact_phone || booking.contact_number || 'N/A';
        
        // Handle amount from different sources
        const amount = booking.service?.price || booking.package_price || booking.total_amount || 0;
        
        // Handle address
        const address = booking.address_full || booking.address || booking.birth_place || 'N/A';
        
        // Handle service title from different sources
        const serviceTitle = booking.service?.title || booking.service_title || booking.package_name || 'Service';
        
        const status = booking.status || 'N/A';
        const createdDate = booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A';

        return (
          <div key={bookingId} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              {/* Status Badge - Full width at top */}
              <div className="flex justify-end mb-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  {status.toUpperCase()}
                </span>
              </div>
              
              {/* Booking ID - Truncated for long IDs */}
              <div className="mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Booking ID</span>
                <p className="text-sm font-mono text-gray-800 truncate" title={bookingId}>
                  #{bookingId}
                </p>
              </div>
              
              {/* Service Title and Amount */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{serviceTitle}</h3>
              <p className="text-2xl font-bold text-orange-600">₹{amount}</p>
            </div>

            {/* Customer Info */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{customerName}</p>
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
            <div className="p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Actions</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* View Details */}
                <button
                  onClick={() => onAction('view', booking)}
                  className="flex-1 min-w-0 px-3 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 border border-orange-200 rounded-md transition-colors text-sm font-medium"
                  title="View Details"
                >
                  <EyeIcon className="w-4 h-4 mx-auto" />
                </button>
                
                {/* Change Status */}
                <button
                  onClick={() => onAction('status', booking)}
                  className="flex-1 min-w-0 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-md transition-colors text-sm font-medium"
                  title="Change Status"
                >
                  <ExclamationTriangleIcon className="w-4 h-4 mx-auto" />
                </button>
                
                {/* Reschedule */}
                <button
                  onClick={() => onAction('reschedule', booking)}
                  className="flex-1 min-w-0 px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 border border-purple-200 rounded-md transition-colors text-sm font-medium"
                  title="Reschedule"
                >
                  <ClockIcon className="w-4 h-4 mx-auto" />
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {/* Assign */}
                <button
                  onClick={() => onAction('assign', booking)}
                  className="flex-1 min-w-0 px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 border border-green-200 rounded-md transition-colors text-sm font-medium"
                  title="Assign"
                >
                  <UserPlusIcon className="w-4 h-4 mx-auto" />
                </button>
                
                {/* Send Link - Only for Astrology services */}
                {serviceType === 'astrology' && (
                  <button
                    onClick={() => onAction('send_link', booking)}
                    className="flex-1 min-w-0 px-3 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-md transition-colors text-sm font-medium"
                    title="Send Meet Link"
                  >
                    <LinkIcon className="w-4 h-4 mx-auto" />
                  </button>
                )}
                
                {/* Edit */}
                <button
                  onClick={() => onAction('edit', booking)}
                  className="flex-1 min-w-0 px-3 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-md transition-colors text-sm font-medium"
                  title="Edit"
                >
                  <PencilIcon className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EnhancedBookingCards;