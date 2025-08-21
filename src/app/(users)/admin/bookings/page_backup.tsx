'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  BanknotesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { ChartBarIcon as ChartBarIconSolid, SparklesIcon, FireIcon } from '@heroicons/react/24/solid';

interface FilterState {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  serviceType: string;
}

interface DashboardData {
  overview: {
    total_bookings: number;
    confirmed_bookings: number;
    completed_bookings: number;
    cancelled_bookings: number;
    pending_sessions?: number;
    pending_bookings?: number;
    total_revenue: string;
    average_booking_value: string;
    bookings_this_period: number;
    active_services: number;
    assigned_bookings?: number;
    unassigned_bookings?: number;
    today_bookings?: number;
    overdue_bookings?: number;
  };
  recent_bookings: any[];
  pending_sessions?: any[];
  upcoming_sessions?: any[];
  upcoming_bookings?: any[];
  service_performance?: any[];
  status_distribution?: any;
  monthly_trends?: any[];
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

// API Service Functions
const fetchWithAuth = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      // Add authentication headers if needed
      // 'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const apiService = {
  // Fetch Astrology Dashboard
  fetchAstrologyDashboard: async (): Promise<DashboardData> => {
    try {
      const data = await fetchWithAuth('https://api.okpuja.com/api/astrology/admin/dashboard/');
      return data.data;
    } catch (error) {
      console.error('Error fetching astrology dashboard:', error);
      throw error;
    }
  },

  // Fetch Regular Bookings Dashboard
  fetchRegularDashboard: async (): Promise<DashboardData> => {
    try {
      const data = await fetchWithAuth('https://api.okpuja.com/api/booking/admin/dashboard/');
      return data.data;
    } catch (error) {
      console.error('Error fetching regular dashboard:', error);
      throw error;
    }
  },

  // Fetch All Regular Bookings
  fetchRegularBookings: async (): Promise<any[]> => {
    try {
      const data = await fetchWithAuth('https://api.okpuja.com/api/booking/admin/bookings/');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching regular bookings:', error);
      throw error;
    }
  },
};

// Professional Pagination Component
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        
        {totalPages > 1 && (
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              {visiblePages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && onPageChange(page)}
                  disabled={page === '...'}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : page === '...'
                      ? 'border-gray-300 bg-white text-gray-500 cursor-default'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Dashboard Stats Component
const DashboardStats: React.FC<{ 
  astrologyData?: DashboardData;
  regularData?: DashboardData;
  loading: boolean;
}> = ({ astrologyData, regularData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg border animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const astroOverview = astrologyData?.overview;
  const regularOverview = regularData?.overview;

  const totalBookings = (astroOverview?.total_bookings || 0) + (regularOverview?.total_bookings || 0);
  const totalRevenue = parseFloat(astroOverview?.total_revenue || '0') + parseFloat(regularOverview?.total_revenue || '0');
  const totalConfirmed = (astroOverview?.confirmed_bookings || 0) + (regularOverview?.confirmed_bookings || 0);
  const totalCompleted = (astroOverview?.completed_bookings || 0) + (regularOverview?.completed_bookings || 0);
  const totalCancelled = (astroOverview?.cancelled_bookings || 0) + (regularOverview?.cancelled_bookings || 0);
  const totalPending = (astroOverview?.pending_sessions || 0) + (regularOverview?.pending_bookings || 0);
  const totalActiveServices = (astroOverview?.active_services || 0) + (regularOverview?.active_services || 0);
  const totalAvgBookingValue = totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : '0';

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings.toLocaleString(),
      icon: ChartBarIconSolid,
      color: 'from-blue-500 to-blue-600',
      change: '+12% from last month',
      changeType: 'increase' as const,
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: BanknotesIcon,
      color: 'from-green-500 to-green-600',
      change: '+8% from last month',
      changeType: 'increase' as const,
    },
    {
      title: 'Confirmed Bookings',
      value: totalConfirmed.toLocaleString(),
      icon: CheckCircleIcon,
      color: 'from-emerald-500 to-emerald-600',
      change: '0% confirmation rate',
      changeType: 'neutral' as const,
    },
    {
      title: 'Pending Sessions',
      value: totalPending.toLocaleString(),
      icon: ClockIcon,
      color: 'from-yellow-500 to-yellow-600',
      change: 'Requires attention',
      changeType: 'neutral' as const,
    },
    {
      title: 'Completed Sessions',
      value: totalCompleted.toLocaleString(),
      icon: CheckCircleIcon,
      color: 'from-blue-500 to-blue-600',
      change: '0% completion rate',
      changeType: 'neutral' as const,
    },
    {
      title: 'Cancelled Bookings',
      value: totalCancelled.toLocaleString(),
      icon: XMarkIcon,
      color: 'from-red-500 to-red-600',
      change: '-3% from last month',
      changeType: 'decrease' as const,
    },
    {
      title: 'Avg Booking Value',
      value: `₹${totalAvgBookingValue}`,
      icon: BanknotesIcon,
      color: 'from-purple-500 to-purple-600',
      change: '+5% from last month',
      changeType: 'increase' as const,
    },
    {
      title: 'Active Services',
      value: totalActiveServices.toLocaleString(),
      icon: SparklesIcon,
      color: 'from-indigo-500 to-indigo-600',
      change: 'All services operational',
      changeType: 'neutral' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Key Metrics Overview</h2>
          <p className="text-sm text-gray-500">Real-time insights into your booking performance and revenue metrics</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center text-xs">
                    <span className={`inline-flex items-center font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' :
                      stat.changeType === 'decrease' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
// Enhanced Table View Component with better information display
const EnhancedBookingTable: React.FC<{
  data: any[];
  activeTab: string;
  selectedBookings: string[];
  onSelectionChange: (selected: string[]) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  onViewBooking: (booking: any) => void;
  onEditBooking: (booking: any) => void;
  onSendMeetLink: (booking: any) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}> = ({ 
  data, 
  activeTab, 
  selectedBookings, 
  onSelectionChange, 
  getStatusColor, 
  getStatusIcon, 
  onViewBooking, 
  onEditBooking, 
  onSendMeetLink,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  
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
    // For astrology bookings
    if (activeTab === 'astrology' || item.astro_book_id) {
      return item.service?.title || 'Astrology Consultation';
    }
    
    // For regular/puja bookings
    if (item.cart_items_count > 0) {
      return `Puja Service (${item.cart_items_count} items)`;
    }
    
    return item.service?.title || item.service_name || item.puja_name || 'Service';
  };

  // Enhanced helper function to get contact information with more fallbacks
  const getContactInfo = (item: any) => {
    const phone = item.user_phone || item.contact_phone || item.phone || 'No phone';
    const name = item.user_name || item.customer_name || item.contact_name || item.user?.email || 'Unknown Customer';
    const email = item.user_email || item.contact_email || item.user?.email || 'No email';
    const address = item.address_full || item.address || item.contact_address || 'No address';

    return { name, email, phone, address };
  };

  // Get amount with proper formatting
  const getAmount = (item: any) => {
    return item.total_amount || item.service?.price || item.amount || item.price || 0;
  };

  // Get booking date
  const getBookingDate = (item: any) => {
    const dateStr = item.selected_date || item.preferred_date || item.created_at;
    return dateStr ? new Date(dateStr) : null;
  };

  // Get booking time
  const getBookingTime = (item: any) => {
    return item.selected_time || item.preferred_time || 'Not scheduled';
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
              const amount = getAmount(item);
              const bookingDate = getBookingDate(item);
              const bookingTime = getBookingTime(item);
              const isAstrology = activeTab === 'astrology' || item.astro_book_id;
              
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
                        {isAstrology ? (
                          <SparklesIcon className="h-4 w-4 text-purple-500" />
                        ) : (
                          <FireIcon className="h-4 w-4 text-orange-500" />
                        )}
                        <span className="text-xs font-medium text-gray-600 capitalize">
                          {isAstrology ? 'Astrology' : 'Puja'} Service
                        </span>
                      </div>
                      {item.booking_age && (
                        <div className="text-xs text-gray-500">
                          Created {item.booking_age}
                        </div>
                      )}
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
                        ₹{amount.toLocaleString()}
                      </div>
                      {item.cart_items_count > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {item.cart_items_count} items
                        </span>
                      )}
                      {item.payment_info?.status && (
                        <div className={`text-xs font-medium ${
                          item.payment_info.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          Payment: {item.payment_info.status}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3 md:px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1.5">{item.status_display || item.status}</span>
                    </span>
                    {item.is_overdue && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Overdue
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Date & Time */}
                  <td className="hidden md:table-cell px-3 md:px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {bookingDate ? bookingDate.toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {bookingTime}
                      </div>
                      {item.time_until_service && (
                        <div className="text-xs text-blue-600 font-medium">
                          {item.time_until_service}
                        </div>
                      )}
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
                      {isAstrology && (
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
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
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
  onViewBooking: (booking: any) => void;
  onEditBooking: (booking: any) => void;
  onSendMeetLink: (booking: any) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}> = ({ 
  data, 
  activeTab, 
  selectedBookings, 
  onSelectionChange, 
  getStatusColor, 
  getStatusIcon, 
  onViewBooking, 
  onEditBooking, 
  onSendMeetLink,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  
  // Enhanced helper functions with better data mapping
  const getServiceName = (item: any) => {
    // For astrology bookings
    if (activeTab === 'astrology' || item.astro_book_id) {
      return item.service?.title || 'Astrology Consultation';
    }
    
    // For regular/puja bookings
    if (item.cart_items_count > 0) {
      return `Puja Service (${item.cart_items_count} items)`;
    }
    
    return item.service?.title || item.service_name || item.puja_name || 'Service';
  };

  const getContactInfo = (item: any) => {
    const phone = item.user_phone || item.contact_phone || item.phone || 'No phone';
    const name = item.user_name || item.customer_name || item.contact_name || item.user?.email || 'Unknown Customer';
    const email = item.user_email || item.contact_email || item.user?.email || 'No email';
    const address = item.address_full || item.address || item.contact_address || 'No address';

    return { name, email, phone, address };
  };

  // Get amount with proper formatting
  const getAmount = (item: any) => {
    return item.total_amount || item.service?.price || item.amount || item.price || 0;
  };

  // Get booking date
  const getBookingDate = (item: any) => {
    const dateStr = item.selected_date || item.preferred_date || item.created_at;
    return dateStr ? new Date(dateStr) : null;
  };

  // Get booking time
  const getBookingTime = (item: any) => {
    return item.selected_time || item.preferred_time || 'Not scheduled';
  };

  const handleSelectItem = (itemId: any, checked: boolean): void => {
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

  const isSelected = (itemId: any) => {
    const id = itemId !== undefined && itemId !== null ? String(itemId) : '';
    return selectedBookings.includes(id);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map((item, index) => {
          const itemId = item.id?.toString() || item.astro_book_id?.toString() || item.book_id?.toString() || `item-${index}`;
          const uniqueKey = `${activeTab}-${itemId}-${index}`;
          const isAstrology = activeTab === 'astrology' || item.astro_book_id;
          const contact = getContactInfo(item);
          const serviceName = getServiceName(item);
          const amount = getAmount(item);
          const bookingDate = getBookingDate(item);
          const bookingTime = getBookingTime(item);
          
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
                      {isAstrology ? 'Astrology' : 'Puja'} Service
                    </span>
                  </div>
                  {item.booking_age && (
                    <div className="text-xs opacity-75 mt-2">
                      Created {item.booking_age}
                    </div>
                  )}
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
                        {item.cart_items_count > 0 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-200 text-orange-800">
                            {item.cart_items_count} items
                          </span>
                        )}
                        {item.payment_info?.status && (
                          <div className={`text-xs font-medium mt-2 ${
                            item.payment_info.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            Payment: {item.payment_info.status}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-green-600">
                          ₹{amount.toLocaleString()}
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
                      <p className="text-gray-500 font-semibold mb-2 text-xs uppercase tracking-wide">Service Date</p>
                      <p className="text-gray-900 font-bold text-sm">
                        {bookingDate ? bookingDate.toLocaleDateString() : 'Not scheduled'}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <p className="text-gray-500 font-semibold mb-2 text-xs uppercase tracking-wide">Time</p>
                      <p className="text-gray-900 font-bold text-sm">
                        {bookingTime}
                      </p>
                    </div>
                  </div>
                  {item.time_until_service && (
                    <div className="mt-2 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.time_until_service}
                      </span>
                    </div>
                  )}
                  {item.is_overdue && (
                    <div className="mt-2 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        Overdue
                      </span>
                    </div>
                  )}
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
      
      {/* Pagination for Card View */}
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

const AdminBookingsPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBookingDrawer, setShowBookingDrawer] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [astrologyDashboard, setAstrologyDashboard] = useState<DashboardData | undefined>();
  const [regularDashboard, setRegularDashboard] = useState<DashboardData | undefined>();
  const [allRegularBookings, setAllRegularBookings] = useState<any[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    serviceType: '',
  });

  // Load data functions
  const loadAstrologyData = useCallback(async () => {
    try {
      const data = await apiService.fetchAstrologyDashboard();
      setAstrologyDashboard(data);
    } catch (error) {
      console.error('Error loading astrology data:', error);
      setError('Failed to load astrology data');
    }
  }, []);

  const loadRegularData = useCallback(async () => {
    try {
      const [dashboardData, bookingsData] = await Promise.all([
        apiService.fetchRegularDashboard(),
        apiService.fetchRegularBookings()
      ]);
      setRegularDashboard(dashboardData);
      setAllRegularBookings(bookingsData);
    } catch (error) {
      console.error('Error loading regular data:', error);
      setError('Failed to load booking data');
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadAstrologyData(), loadRegularData()]);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [loadAstrologyData, loadRegularData]);

  // Filter data based on active tab and filters
  const getFilteredData = useMemo(() => {
    let data: any[] = [];

    // Get base data based on active tab
    if (activeTab === 'astrology') {
      data = astrologyDashboard?.recent_bookings || [];
    } else if (activeTab === 'puja') {
      data = allRegularBookings || [];
    } else {
      // Combine all data for 'all' tab
      const astrologyBookings = astrologyDashboard?.recent_bookings || [];
      const regularBookings = allRegularBookings || [];
      data = [...astrologyBookings, ...regularBookings];
    }

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(item => 
        (item.astro_book_id && item.astro_book_id.toLowerCase().includes(searchLower)) ||
        (item.book_id && item.book_id.toLowerCase().includes(searchLower)) ||
        (item.user_name && item.user_name.toLowerCase().includes(searchLower)) ||
        (item.user_email && item.user_email.toLowerCase().includes(searchLower)) ||
        (item.customer_name && item.customer_name.toLowerCase().includes(searchLower)) ||
        (item.contact_email && item.contact_email.toLowerCase().includes(searchLower))
      );
    }

    if (filters.status) {
      data = data.filter(item => item.status === filters.status);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      data = data.filter(item => {
        const itemDate = new Date(item.created_at || item.selected_date);
        return itemDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      data = data.filter(item => {
        const itemDate = new Date(item.created_at || item.selected_date);
        return itemDate <= toDate;
      });
    }

    // Sort by created date (newest first)
    data.sort((a, b) => {
      const dateA = new Date(a.created_at || a.selected_date || 0);
      const dateB = new Date(b.created_at || b.selected_date || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return data;
  }, [activeTab, filters, astrologyDashboard, allRegularBookings]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return getFilteredData.slice(startIndex, endIndex);
  }, [getFilteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(getFilteredData.length / itemsPerPage);

  // Status management functions
  const getStatusColor = useCallback((status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'FAILED':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return <CheckCircleIcon className="h-3 w-3" />;
      case 'PENDING':
        return <ClockIcon className="h-3 w-3" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="h-3 w-3" />;
      case 'CANCELLED':
        return <XMarkIcon className="h-3 w-3" />;
      case 'FAILED':
        return <XMarkIcon className="h-3 w-3" />;
      default:
        return <ClockIcon className="h-3 w-3" />;
    }
  }, []);

  // Event handlers
  const handleViewBooking = useCallback((booking: any) => {
    setSelectedBooking(booking);
    setShowBookingDrawer(true);
  }, []);

  const handleEditBooking = useCallback((booking: any) => {
    // Implement edit booking logic
    toast.success('Edit booking functionality will be implemented');
  }, []);

  const handleSendMeetLink = useCallback((booking: any) => {
    // Implement send meet link logic
    toast.success('Send meet link functionality will be implemented');
  }, []);

  const handleExport = useCallback(async () => {
    try {
      if (getFilteredData.length === 0) {
        toast.error('No data to export');
        return;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${activeTab}_bookings_${timestamp}`;
      
      // Convert data to CSV format
      const headers = [
        'Booking ID',
        'Customer Name', 
        'Email',
        'Phone',
        'Service',
        'Amount',
        'Status',
        'Date',
        'Address'
      ];

      const csvData = getFilteredData.map(item => [
        item.astro_book_id || item.book_id || item.id,
        item.user_name || item.customer_name || 'N/A',
        item.user_email || item.contact_email || 'N/A',
        item.user_phone || item.contact_phone || 'N/A',
        item.service?.title || 'Service',
        item.total_amount || item.service?.price || 0,
        item.status || 'N/A',
        item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
        item.address_full || item.address || 'N/A'
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  }, [activeTab, getFilteredData]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Reset to first page when changing tabs
    setSelectedBookings([]); // Clear selections
  }, []);

  const handleRefresh = useCallback(() => {
    loadAllData();
    setCurrentPage(1);
    setSelectedBookings([]);
    toast.success('Data refreshed');
  }, [loadAllData]);

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Clear error after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Tab configuration
  const tabs = [
    { 
      id: 'all', 
      label: 'All Bookings', 
      icon: ChartBarIconSolid, 
      count: getFilteredData.length 
    },
    { 
      id: 'astrology', 
      label: 'Astrology Services', 
      icon: SparklesIcon, 
      count: astrologyDashboard?.recent_bookings?.length || 0 
    },
    { 
      id: 'puja', 
      label: 'Puja Services', 
      icon: FireIcon, 
      count: allRegularBookings?.length || 0 
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all bookings and services from one place
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleRefresh}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        <DashboardStats 
          astrologyData={astrologyDashboard}
          regularData={regularDashboard}
          loading={loading}
        />

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`group relative min-w-0 flex-1 sm:flex-none overflow-hidden py-4 px-4 text-center text-sm font-medium hover:text-gray-700 focus:z-10 ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600 border-b-2'
                        : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                      {tab.count > 0 && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activeTab === tab.id
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-lg">
              <MagnifyingGlassIcon className="absolute inset-y-0 left-0 pl-3 h-full w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Search by ID, name, email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md transition-colors ${
                showFilters
                  ? 'text-orange-700 bg-orange-50 border-orange-300'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
              {Object.values(filters).some(v => v && v !== '') && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <TableCellsIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'card'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={filters.serviceType}
                  onChange={(e) => setFilters(prev => ({ ...prev, serviceType: e.target.value }))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">All Services</option>
                  <option value="astrology">Astrology</option>
                  <option value="puja">Puja</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setFilters({
                    search: '',
                    status: '',
                    dateFrom: '',
                    dateTo: '',
                    serviceType: '',
                  });
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {paginatedData.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="text-center py-12">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {Object.values(filters).some(v => v && v !== '') 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Get started by managing existing bookings or check back later.'}
              </p>
              {Object.values(filters).some(v => v && v !== '') && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setFilters({
                        search: '',
                        status: '',
                        dateFrom: '',
                        dateTo: '',
                        serviceType: '',
                      });
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Data Display */}
            {viewMode === 'table' ? (
              <EnhancedBookingTable
                data={paginatedData}
                activeTab={activeTab}
                selectedBookings={selectedBookings}
                onSelectionChange={setSelectedBookings}
                onViewBooking={handleViewBooking}
                onEditBooking={handleEditBooking}
                onSendMeetLink={handleSendMeetLink}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                totalItems={getFilteredData.length}
                onPageChange={handlePageChange}
              />
            ) : (
              <EnhancedBookingCards
                data={paginatedData}
                activeTab={activeTab}
                selectedBookings={selectedBookings}
                onSelectionChange={setSelectedBookings}
                onViewBooking={handleViewBooking}
                onEditBooking={handleEditBooking}
                onSendMeetLink={handleSendMeetLink}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                totalItems={getFilteredData.length}
                onPageChange={handlePageChange}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={getFilteredData.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {/* Booking Details - Simple Modal for now */}
        {showBookingDrawer && selectedBooking && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => {
              setShowBookingDrawer(false);
              setSelectedBooking(null);
            }} />
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Booking Details</h2>
                <button
                  onClick={() => {
                    setShowBookingDrawer(false);
                    setSelectedBooking(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <p><strong>ID:</strong> {selectedBooking.astro_book_id || selectedBooking.book_id || selectedBooking.id}</p>
                <p><strong>Customer:</strong> {selectedBooking.user_name || selectedBooking.customer_name || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedBooking.user_email || selectedBooking.contact_email || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedBooking.user_phone || selectedBooking.contact_phone || 'N/A'}</p>
                <p><strong>Status:</strong> {selectedBooking.status || 'N/A'}</p>
                <p><strong>Amount:</strong> ₹{selectedBooking.total_amount || selectedBooking.service?.price || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
