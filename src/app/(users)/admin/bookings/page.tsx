'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  Squares2X2Icon,
  TableCellsIcon,
  XCircleIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CalendarIcon,
  LinkIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { ChartBarIcon as ChartBarIconSolid, SparklesIcon, FireIcon } from '@heroicons/react/24/solid';

// Store imports
import { useAdminBookingStore } from '../../../stores/adminBookingStore';

// Component imports
import AdminDashboardStats from './components/AdminDashboardStats';
import BookingFilters from './components/BookingFilters';
import BookingTable from './components/BookingTable';
import BulkActions from './components/BulkActions';
import Calendar from '../../../components/ui/Calendar';
import { BookingDrawer } from '../../../components/ui/BookingDrawer';
import { MUIProvider } from '../../../components/providers/MUIProvider';

// Utils and hooks
import { exportToCSV } from '../../../utils/exportUtils';
import { useBookingHandlers } from './hooks/useBookingHandlers';
import { useBookingFilters } from './hooks/useBookingFilters';

interface FilterState {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  serviceType: string;
}

// Enhanced Table View Component with better information display
const EnhancedBookingTable: React.FC<{
  data: any[];
  activeTab: string;
  selectedBookings: string[];
  onSelectionChange: (selected: string[]) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  onUpdateStatus: (type: 'regular' | 'puja', id: number, status: string, reason?: string) => Promise<boolean>;
  onViewBooking: (booking: any) => void;
  onEditBooking: (booking: any) => void;
  onSendMeetLink: (booking: any) => void;
}> = ({ data, activeTab, selectedBookings, onSelectionChange, getStatusColor, getStatusIcon, onUpdateStatus, onViewBooking, onEditBooking, onSendMeetLink }) => {
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(data.map(item => item.id?.toString() || ''));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedBookings, id]);
    } else {
      onSelectionChange(selectedBookings.filter(item => item !== id));
    }
  };

  const isSelected = (id: string) => selectedBookings.includes(id);
  const isAllSelected = data.length > 0 && selectedBookings.length === data.length;
  const isIndeterminate = selectedBookings.length > 0 && selectedBookings.length < data.length;

  // Enhanced helper function to get service name with better fallbacks
  const getServiceName = (item: any) => {
    // First check for direct service title
    if (item.service?.title) return item.service.title;
    if (item.service_title) return item.service_title;
    if (item.service_name) return item.service_name;
    
    // Check for puja specific fields
    if (item.puja_name) return item.puja_name;
    if (item.puja_title) return item.puja_title;
    
    // Check service type and provide appropriate default
    const serviceType = activeTab !== 'all' ? activeTab : item.type;
    if (serviceType === 'astrology' || item.type === 'astrology') {
      return 'Astrology Consultation';
    }
    
    // For puja services, provide a more specific default
    if (serviceType === 'puja' || item.type === 'puja' || activeTab === 'puja') {
      return item.category_name ? `${item.category_name} Puja` : 'Puja Service';
    }
    
    return 'Service';
  };

  // Enhanced helper function to get contact information with more fallbacks
  const getContactInfo = (item: any) => {
    // Try multiple possible field names for phone
    const phone = item.contact_phone || 
                  item.user_phone || 
                  item.phone || 
                  item.contact_number || 
                  item.phone_number ||
                  item.mobile ||
                  item.contact_mobile ||
                  item.user_mobile ||
                  item.customer_phone ||
                  item.customer_mobile ||
                  'No phone';

    // Try multiple possible field names for name
    const name = item.customer_name || 
                 item.user_name || 
                 item.contact_name ||
                 item.name ||
                 item.full_name ||
                 item.customer ||
                 item.user ||
                 'Unknown Customer';

    // Try multiple possible field names for email
    const email = item.contact_email || 
                  item.user_email || 
                  item.email ||
                  item.customer_email ||
                  'No email';

    // Try multiple possible field names for address
    const address = item.address || 
                    item.contact_address || 
                    item.user_address ||
                    item.customer_address ||
                    item.location ||
                    item.full_address ||
                    'No address';

    return { name, email, phone, address };
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="w-4 p-3 md:px-6 py-4">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded shadow-sm"
                />
              </th>
              <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Booking Details
              </th>
              <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Customer Info
              </th>
              <th className="hidden lg:table-cell px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Service & Amount
              </th>
              <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="hidden md:table-cell px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const itemId = item.id?.toString() || item.astro_book_id?.toString() || item.book_id?.toString() || `item-${index}`;
              const uniqueKey = `${activeTab}-${itemId}-${index}`;
              const contact = getContactInfo(item);
              const serviceName = getServiceName(item);
              
              return (
                <tr
                  key={uniqueKey}
                  className={`hover:bg-gray-50 transition-colors ${isSelected(itemId) ? 'bg-blue-50 ring-2 ring-blue-200' : ''}`}
                >
                  <td className="px-3 md:px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected(itemId)}
                      onChange={(e) => handleSelectItem(itemId, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded shadow-sm"
                    />
                  </td>
                  
                  {/* Booking Details */}
                  <td className="px-3 md:px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-gray-900">
                        #{item.astro_book_id || item.book_id || item.id}
                      </div>
                      <div className="flex items-center space-x-2">
                        {activeTab === 'astrology' || item.type === 'astrology' ? (
                          <SparklesIcon className="h-4 w-4 text-purple-500" />
                        ) : (
                          <FireIcon className="h-4 w-4 text-orange-500" />
                        )}
                        <span className="text-xs font-medium text-gray-600 capitalize">
                          {activeTab !== 'all' ? activeTab : (item.type || 'puja')} Service
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Enhanced Customer Info with better phone display */}
                  <td className="px-3 md:px-6 py-4">
                    <div className="space-y-2">
                      <div className="font-semibold text-gray-900 text-sm">{contact.name}</div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <EnvelopeIcon className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate max-w-[150px]" title={contact.email}>{contact.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <PhoneIcon className="h-3 w-3 flex-shrink-0" />
                          <span className={contact.phone === 'No phone' ? 'text-red-500 italic' : 'font-medium'}>
                            {contact.phone}
                          </span>
                        </div>
                        {contact.address !== 'No address' && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <MapPinIcon className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate max-w-[150px]" title={contact.address}>{contact.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Enhanced Service & Amount */}
                  <td className="hidden lg:table-cell px-3 md:px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900 text-sm" title={serviceName}>{serviceName}</div>
                      <div className="text-lg font-bold text-green-600">
                        ₹{(item.service?.price || item.total_amount || item.amount || item.price || 0).toLocaleString()}
                      </div>
                      {item.category_name && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.category_name}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3 md:px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1.5">{item.status_display || item.status}</span>
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td className="hidden md:table-cell px-3 md:px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.created_at ? new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-3 md:px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => onViewBooking(item)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onEditBooking(item)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all"
                        title="Reschedule/Edit"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </button>
                      {(item.type === 'astrology' || activeTab === 'astrology') && (
                        <button 
                          onClick={() => onSendMeetLink(item)}
                          className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-all"
                          title="Send Meeting Link"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Enhanced Card View Component with complete information
const EnhancedBookingCards: React.FC<{
  data: any[];
  activeTab: string;
  selectedBookings: string[];
  onSelectionChange: (selected: string[]) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  onUpdateStatus: (type: 'regular' | 'puja', id: number, status: string, reason?: string) => Promise<boolean>;
  onViewBooking: (booking: any) => void;
  onEditBooking: (booking: any) => void;
  onSendMeetLink: (booking: any) => void;
}> = ({ data, activeTab, selectedBookings, onSelectionChange, getStatusColor, getStatusIcon, onUpdateStatus, onViewBooking, onEditBooking, onSendMeetLink }) => {
  
  // Enhanced helper functions with better data mapping
  const getServiceName = (item: any) => {
    // First check for direct service title
    if (item.service?.title) return item.service.title;
    if (item.service_title) return item.service_title;
    if (item.service_name) return item.service_name;
    
    // Check for puja specific fields
    if (item.puja_name) return item.puja_name;
    if (item.puja_title) return item.puja_title;
    
    // Check service type and provide appropriate default
    const serviceType = activeTab !== 'all' ? activeTab : item.type;
    if (serviceType === 'astrology' || item.type === 'astrology') {
      return 'Astrology Consultation';
    }
    
    // For puja services, provide a more specific default
    if (serviceType === 'puja' || item.type === 'puja' || activeTab === 'puja') {
      return item.category_name ? `${item.category_name} Puja` : 'Puja Service';
    }
    
    return 'Service';
  };

  const getContactInfo = (item: any) => {
    // Try multiple possible field names for phone with extensive fallbacks
    const phone = item.contact_phone || 
                  item.user_phone || 
                  item.phone || 
                  item.contact_number || 
                  item.phone_number ||
                  item.mobile ||
                  item.contact_mobile ||
                  item.user_mobile ||
                  item.customer_phone ||
                  item.customer_mobile ||
                  'No phone';

    // Try multiple possible field names for name
    const name = item.customer_name || 
                 item.user_name || 
                 item.contact_name ||
                 item.name ||
                 item.full_name ||
                 item.customer ||
                 item.user ||
                 'Unknown Customer';

    // Try multiple possible field names for email
    const email = item.contact_email || 
                  item.user_email || 
                  item.email ||
                  item.customer_email ||
                  'No email';

    // Try multiple possible field names for address
    const address = item.address || 
                    item.contact_address || 
                    item.user_address ||
                    item.customer_address ||
                    item.location ||
                    item.full_address ||
                    'No address';

    return { name, email, phone, address };
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
        
        const isSelected = (itemId: any) => {
          const id = itemId !== undefined && itemId !== null ? String(itemId) : '';
          return selectedBookings.includes(id);
        };

        function handleSelectItem(itemId: any, checked: boolean): void {
          const id = itemId !== undefined && itemId !== null ? String(itemId) : '';
          if (!id) return;

          if (checked) {
            if (!selectedBookings.includes(id)) {
              onSelectionChange([...selectedBookings, id]);
            }
          } else {
            onSelectionChange(selectedBookings.filter(s => s !== id));
          }
        }

        return (
          <div
            key={uniqueKey}
            className={`bg-white rounded-2xl shadow-lg border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group ${
              isSelected(itemId) 
                ? 'border-blue-500 shadow-2xl ring-4 ring-blue-100 bg-gradient-to-br from-blue-50 to-white' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Enhanced Card Header */}
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
                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg ${
                  item.status === 'CONFIRMED' 
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : item.status === 'PENDING' 
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    : item.status === 'COMPLETED' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : item.status === 'CANCELLED' 
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
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
              {/* Enhanced Customer Information with better phone display */}
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

              {/* Enhanced Service Details */}
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

const AdminBookingsPage: React.FC = () => {
  // Store
  const {
    astrologyBookings,
    regularBookings,
    pujaBookings,
    astrologyDashboard,
    regularDashboard,
    pujaDashboard,
    loading,
    error,
    fetchAstrologyBookings,
    fetchRegularBookings,
    fetchPujaBookings,
    fetchAllBookings,
    fetchAstrologyDashboard,
    fetchRegularDashboard,
    fetchPujaDashboard,
    clearError,
  } = useAdminBookingStore();

  // Local state
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBookingDrawer, setShowBookingDrawer] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    serviceType: '',
  });

  // Custom hooks
  const { getCurrentData, handleRefreshData } = useBookingFilters(
    activeTab,
    filters,
    astrologyBookings,
    regularBookings,
    pujaBookings,
    fetchAstrologyBookings,
    fetchRegularBookings,
    fetchPujaBookings,
    fetchAllBookings
  );

  const {
    handleViewBooking,
    handleEditBooking,
    handleSendMeetLink,
    handleRescheduleBooking,
    handleBookingStatusUpdate,
    getStatusColor,
    getStatusIcon,
  } = useBookingHandlers(setSelectedBooking, setShowBookingDrawer, activeTab, handleRefreshData);

  // Load initial data
  useEffect(() => {
    handleRefreshData();
    fetchAstrologyDashboard();
    fetchRegularDashboard();
    fetchPujaDashboard();
  }, [handleRefreshData, fetchAstrologyDashboard, fetchRegularDashboard, fetchPujaDashboard]);

  // Clear error after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Export handler
  const handleExport = useCallback(async () => {
    try {
      const currentData = getCurrentData();
      if (currentData.length === 0) {
        toast.error('No data to export');
        return;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${activeTab}_bookings_${timestamp}`;
      
      exportToCSV(currentData, `${filename}.csv`);
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  }, [activeTab, getCurrentData]);

  // Calendar handlers
  const handleCalendarDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setFilters(prev => ({
      ...prev,
      dateFrom: date.toISOString().split('T')[0],
      dateTo: date.toISOString().split('T')[0],
    }));
    setShowCalendar(false);
    setTimeout(() => handleRefreshData(), 100);
  }, [handleRefreshData]);

  // Additional handlers for the action bar
  const handleApplyFilters = useCallback(() => {
    handleRefreshData();
    setShowFilters(false);
  }, [handleRefreshData]);

  const handleCalendarToggle = useCallback(() => {
    setShowCalendar(true);
  }, []);

  const handleBulkAction = useCallback(async (action: 'confirm' | 'cancel') => {
    if (selectedBookings.length === 0) return;
    
    try {
      // Implement bulk action logic here
      toast.success(`${action === 'confirm' ? 'Confirmed' : 'Cancelled'} ${selectedBookings.length} booking(s)`);
      setSelectedBookings([]);
      handleRefreshData();
    } catch (error) {
      toast.error(`Failed to ${action} bookings`);
    }
  }, [selectedBookings, handleRefreshData]);

  const updateBookingStatus = useCallback(async (type: 'regular' | 'puja', id: number, status: string, reason?: string) => {
    try {
      // Implement status update logic here
      toast.success('Booking status updated successfully');
      handleRefreshData();
      return true;
    } catch (error) {
      toast.error('Failed to update booking status');
      return false;
    }
  }, [handleRefreshData]);

  const currentData = getCurrentData();

  // Tab configuration
  const tabs = [
    { id: 'all', label: 'All Bookings', icon: ChartBarIconSolid, count: currentData.length },
    { id: 'astrology', label: 'Astrology Services', icon: SparklesIcon, count: astrologyBookings?.length || 0 },
    { id: 'puja', label: 'Puja Services', icon: FireIcon, count: (regularBookings?.length || 0) + (pujaBookings?.length || 0) },
  ];

  return (
    <MUIProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Enhanced Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                Booking Management Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                Comprehensive management for all your astrology and puja service bookings
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                  <span className="text-red-800 flex-1">{error}</span>
                  <button
                    onClick={clearError}
                    className="ml-4 text-red-600 hover:text-red-800 font-medium"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Dashboard Stats */}
            <AdminDashboardStats 
              astrologyData={astrologyDashboard}
              regularData={regularDashboard}
              pujaData={pujaDashboard}
              loading={loading}
            />

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              
              {/* Enhanced Tabs */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          py-4 px-4 border-b-2 font-medium text-sm flex items-center space-x-3 whitespace-nowrap transition-colors
                          ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{tab.label}</span>
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${activeTab === tab.id
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Filters and Actions */}
              <div className="p-4 sm:p-6 border-b border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <BookingFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                      showFilters={showFilters}
                      onToggleFilters={() => setShowFilters(!showFilters)}
                      onApplyFilters={() => {
                        handleRefreshData();
                        setShowFilters(false);
                      }}
                      onRefresh={handleRefreshData}
                      loading={loading}
                    />
                  </div>

                  {/* Right side - View Toggle and Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* View Toggle */}
                    <div className="inline-flex rounded-lg border border-gray-300 p-1 bg-gray-50">
                      <button
                        onClick={() => setViewMode('table')}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          viewMode === 'table'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <TableCellsIcon className="h-4 w-4 mr-1.5" />
                        Table
                      </button>
                      <button
                        onClick={() => setViewMode('card')}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          viewMode === 'card'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <Squares2X2Icon className="h-4 w-4 mr-1.5" />
                        Cards
                      </button>
                    </div>

                    <button
                      onClick={handleExport}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Export</span>
                    </button>

                    <button
                      onClick={() => setShowCalendar(true)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Calendar</span>
                    </button>
                  </div>
                </div>

                {/* Bulk Actions */}
                <BulkActions
                  selectedBookings={selectedBookings}
                  activeTab={activeTab}
                  onClearSelection={() => setSelectedBookings([])}
                />
              </div>

              {/* Data Display */}
              <div className={`${viewMode === 'card' ? 'bg-gradient-to-br from-gray-50 to-white p-6' : 'bg-white p-6'}`}>
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent shadow-lg"></div>
                    <p className="text-gray-600 font-medium">Loading bookings...</p>
                  </div>
                ) : currentData.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                      <ChartBarIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      There are no bookings matching your current filters. Try adjusting your search criteria or check back later.
                    </p>
                    <button 
                      onClick={() => setFilters({ search: '', status: '', dateFrom: '', dateTo: '', serviceType: '' })}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : viewMode === 'table' ? (
                  <EnhancedBookingTable
                    data={currentData}
                    activeTab={activeTab}
                    selectedBookings={selectedBookings}
                    onSelectionChange={setSelectedBookings}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    onUpdateStatus={updateBookingStatus}
                    onViewBooking={handleViewBooking}
                    onEditBooking={handleEditBooking}
                    onSendMeetLink={handleSendMeetLink}
                  />
                ) : (
                  <EnhancedBookingCards
                    data={currentData}
                    activeTab={activeTab}
                    selectedBookings={selectedBookings}
                    onSelectionChange={setSelectedBookings}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    onUpdateStatus={updateBookingStatus}
                    onViewBooking={handleViewBooking}
                    onEditBooking={handleEditBooking}
                    onSendMeetLink={handleSendMeetLink}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Modal */}
        {showCalendar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={handleCalendarDateSelect}
                  bookings={currentData}
                />
              </div>
            </div>
          </div>
        )}

        {/* Booking Details Drawer */}
        <BookingDrawer
          open={showBookingDrawer}
          onClose={() => setShowBookingDrawer(false)}
          booking={selectedBooking}
          bookingType={activeTab as 'astrology' | 'puja' | 'all'}
          onUpdateStatus={handleBookingStatusUpdate}
          onSendMeetLink={handleSendMeetLink}
          onReschedule={handleRescheduleBooking}
        />
      </div>
    </MUIProvider>
  );
};

export default AdminBookingsPage;
