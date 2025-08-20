'use client';

import React from 'react';
import {
  EyeIcon,
  CalendarIcon,
  LinkIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  SparklesIcon,
  FireIcon,
  UserGroupIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface BookingCardsProps {
  data: any[];
  activeTab: string;
  selectedBookings: string[];
  onSelectionChange: (selected: string[]) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  onViewBooking: (booking: any) => void;
  onEditBooking: (booking: any) => void;
  onSendMeetLink: (booking: any) => void;
}

const BookingCards: React.FC<BookingCardsProps> = ({
  data,
  activeTab,
  selectedBookings,
  onSelectionChange,
  getStatusColor,
  getStatusIcon,
  onViewBooking,
  onEditBooking,
  onSendMeetLink,
}) => {
  // Helper functions
  const getServiceName = (item: any) => {
    if (item.service?.title) return item.service.title;
    if (item.service_title) return item.service_title;
    if (item.service_name) return item.service_name;
    if (item.puja_name) return item.puja_name;
    if (item.puja_title) return item.puja_title;
    
    const serviceType = activeTab !== 'all' ? activeTab : item.type;
    if (serviceType === 'astrology' || item.type === 'astrology') {
      return 'Astrology Consultation';
    }
    
    if (serviceType === 'puja' || item.type === 'puja' || activeTab === 'puja') {
      return item.category_name ? `${item.category_name} Puja` : 'Puja Service';
    }
    
    return 'Service';
  };

  const getContactInfo = (item: any) => {
    const phone = item.contact_phone || item.user_phone || item.phone || item.contact_number || 
                  item.phone_number || item.mobile || item.contact_mobile || item.user_mobile || 
                  item.customer_phone || item.customer_mobile || 'No phone';

    const name = item.customer_name || item.user_name || item.contact_name || item.name || 
                 item.full_name || item.customer || item.user || 'Unknown Customer';

    const email = item.contact_email || item.user_email || item.email || item.customer_email || 'No email';

    const address = item.address || item.contact_address || item.user_address || item.customer_address || 
                    item.location || item.full_address || 'No address';

    return { name, email, phone, address };
  };

  const isSelected = (itemId: any) => {
    const id = itemId !== undefined && itemId !== null ? String(itemId) : '';
    return selectedBookings.includes(id);
  };

  const handleSelectItem = (itemId: any, checked: boolean) => {
    const id = itemId !== undefined && itemId !== null ? String(itemId) : '';
    if (!id) return;

    if (checked) {
      if (!selectedBookings.includes(id)) {
        onSelectionChange([...selectedBookings, id]);
      }
    } else {
      onSelectionChange(selectedBookings.filter(s => s !== id));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((item, index) => {
        const itemId = item.id?.toString() || item.astro_book_id?.toString() || item.book_id?.toString() || `item-${index}`;
        const uniqueKey = `${activeTab}-${itemId}-${index}`;
        const serviceType = activeTab !== 'all' ? activeTab : (item.type || 'puja');
        const isAstrology = serviceType === 'astrology';
        const contact = getContactInfo(item);
        const serviceName = getServiceName(item);
        
        return (
          <div
            key={uniqueKey}
            className={`bg-white rounded-2xl shadow-lg border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group ${
              isSelected(itemId) 
                ? 'border-blue-500 shadow-2xl ring-4 ring-blue-100 bg-gradient-to-br from-blue-50 to-white' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Card Header */}
            <div className={`px-6 py-5 border-b border-gray-100 ${
              isAstrology 
                ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700' 
                : 'bg-gradient-to-br from-orange-500 via-red-500 to-red-600'
            } rounded-t-2xl`}>
              <div className="flex items-center justify-between mb-3">
                <input
                  type="checkbox"
                  checked={isSelected(itemId)}
                  onChange={(e) => handleSelectItem(itemId, e.target.checked)}
                  className="h-4 w-4 text-white focus:ring-white/20 border-white/30 rounded bg-white/10 backdrop-blur-sm"
                />
                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  <span className="ml-1.5">{item.status_display || item.status}</span>
                </span>
              </div>
              
              <div className="text-white">
                <h3 className="text-xl font-bold tracking-wide mb-2">
                  #{item.astro_book_id || item.book_id || item.id}
                </h3>
                <div className="flex items-center space-x-2">
                  {isAstrology ? (
                    <SparklesIcon className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <FireIcon className="h-5 w-5 flex-shrink-0" />
                  )}
                  <span className="text-sm font-semibold opacity-90 capitalize">
                    {serviceType} Service
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Customer Information */}
              <div className="mb-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                      <UserGroupIcon className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      {contact.name}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate" title={contact.email}>{contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4 flex-shrink-0" />
                        <span className={contact.phone === 'No phone' ? 'text-red-500 italic' : 'font-medium'}>
                          {contact.phone}
                        </span>
                      </div>
                      {contact.address !== 'No address' && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate" title={contact.address}>{contact.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Service Details</h4>
                      <p className="text-lg font-bold text-gray-900 leading-tight mb-2" title={serviceName}>
                        {serviceName}
                      </p>
                      {item.category_name && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
                          {item.category_name}
                        </span>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-green-600">
                        ₹{(item.service?.price || item.total_amount || item.amount || item.price || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timing Information */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <p className="text-gray-500 font-semibold mb-2 text-xs uppercase tracking-wide">Created Date</p>
                    <p className="text-gray-900 font-bold text-sm">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <p className="text-gray-500 font-semibold mb-2 text-xs uppercase tracking-wide">Time</p>
                    <p className="text-gray-900 font-bold text-sm">
                      {item.created_at ? new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => onViewBooking(item)}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl group-hover:shadow-2xl"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Complete Details
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => onEditBooking(item)}
                    className="inline-flex items-center justify-center px-3 py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl hover:bg-green-100 transition-all duration-200 hover:shadow-md"
                  >
                    <CalendarIcon className="h-4 w-4 mr-1.5" />
                    Reschedule
                  </button>
                  
                  {isAstrology ? (
                    <button 
                      onClick={() => onSendMeetLink(item)}
                      className="inline-flex items-center justify-center px-3 py-2.5 bg-purple-50 border border-purple-200 text-purple-700 text-sm font-semibold rounded-xl hover:bg-purple-100 transition-all duration-200 hover:shadow-md"
                    >
                      <LinkIcon className="h-4 w-4 mr-1.5" />
                      Meet Link
                    </button>
                  ) : (
                    <button 
                      onClick={() => onViewBooking(item)}
                      className="inline-flex items-center justify-center px-3 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-all duration-200 hover:shadow-md"
                    >
                      <PencilIcon className="h-4 w-4 mr-1.5" />
                      Edit Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingCards;
