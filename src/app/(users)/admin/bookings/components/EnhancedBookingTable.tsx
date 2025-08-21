import React from 'react';
import {
  EyeIcon,
  PencilIcon,
  LinkIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface BookingTableProps {
  bookings: any[];
  isLoading: boolean;
  onAction: (action: string, booking: any) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  serviceType?: 'astrology' | 'puja' | 'regular';
}

const EnhancedBookingTable: React.FC<BookingTableProps> = ({
  bookings,
  isLoading,
  onAction,
  getStatusColor,
  getStatusIcon,
  serviceType = 'astrology',
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Booking ID', 'Customer', 'Service', 'Amount', 'Status', 'Date', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Booking ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
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
            
            // Handle service title from different sources
            const serviceTitle = booking.service?.title || booking.service_title || booking.package_name || 'Service';
            
            const status = booking.status || 'N/A';
            const createdDate = booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A';

            return (
              <tr key={bookingId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{bookingId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">
                          {customerName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{customerName}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <EnvelopeIcon className="w-3 h-3" />
                        {customerEmail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{serviceTitle}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">₹{amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    {status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {createdDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-1">
                    {/* View Details */}
                    <button
                      onClick={() => onAction('view', booking)}
                      className="text-orange-600 hover:text-orange-900 p-1.5 rounded hover:bg-orange-50 transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    
                    {/* Change Status */}
                    <button
                      onClick={() => onAction('status', booking)}
                      className="text-blue-600 hover:text-blue-900 p-1.5 rounded hover:bg-blue-50 transition-colors"
                      title="Change Status"
                    >
                      <ExclamationTriangleIcon className="w-4 h-4" />
                    </button>
                    
                    {/* Reschedule Booking */}
                    <button
                      onClick={() => onAction('reschedule', booking)}
                      className="text-purple-600 hover:text-purple-900 p-1.5 rounded hover:bg-purple-50 transition-colors"
                      title="Reschedule Booking"
                    >
                      <ClockIcon className="w-4 h-4" />
                    </button>
                    
                    {/* Assign to Employee */}
                    <button
                      onClick={() => onAction('assign', booking)}
                      className="text-green-600 hover:text-green-900 p-1.5 rounded hover:bg-green-50 transition-colors"
                      title="Assign to Employee"
                    >
                      <UserPlusIcon className="w-4 h-4" />
                    </button>
                    
                    {/* Send Meet Link - Only for Astrology services */}
                    {serviceType === 'astrology' && (
                      <button
                        onClick={() => onAction('send_link', booking)}
                        className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded hover:bg-indigo-50 transition-colors"
                        title="Send Meet Link"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Edit Booking */}
                    <button
                      onClick={() => onAction('edit', booking)}
                      className="text-gray-600 hover:text-gray-900 p-1.5 rounded hover:bg-gray-50 transition-colors"
                      title="Edit Booking"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EnhancedBookingTable;