'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  Squares2X2Icon,
  TableCellsIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  ChartBarIcon,
  SparklesIcon,
  UserGroupIcon,
  FireIcon,
} from '@heroicons/react/24/solid';

// Import store
import { useAdminBookingStore } from '../../../stores/adminBookingStore';

// Import custom components
import AdminDashboardStats from './components/AdminDashboardStats';

// Import Calendar component
import Calendar from '../../../components/ui/Calendar';
import BookingDetailsModal from '../../../components/ui/BookingDetailsModal';

// Import utilities
import { exportToCSV, exportToJSON } from '../../../utils/exportUtils';

// Interfaces for components
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface FilterState {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  serviceType: string;
}

const AdminBookingsPage: React.FC = () => {
  // Zustand store
  const {
    // Data
    astrologyBookings,
    regularBookings,
    pujaBookings,
    astrologyDashboard,
    regularDashboard,
    pujaDashboard,
    
    // UI states
    loading,
    error,
    
    // Actions
    fetchAstrologyBookings,
    fetchRegularBookings,
    fetchPujaBookings,
    fetchAllBookings,
    fetchAstrologyDashboard,
    fetchRegularDashboard,
    fetchPujaDashboard,
    generateReport,
    performBulkAction,
    updateBookingStatus,
    clearError,
  } = useAdminBookingStore();

  // Local state
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    serviceType: '',
  });

  // Get current data based on active tab - MOVED TO TOP
  const getCurrentData = useCallback(() => {
    switch (activeTab) {
      case 'astrology':
        return astrologyBookings || [];
      case 'regular':
        return regularBookings || [];
      case 'puja':
        return pujaBookings || [];
      default:
        return [
          ...(astrologyBookings?.map(b => ({ ...b, type: 'astrology' })) || []),
          ...(regularBookings?.map(b => ({ ...b, type: 'regular' })) || []),
          ...(pujaBookings?.map(b => ({ ...b, type: 'puja' })) || []),
        ];
    }
  }, [activeTab, astrologyBookings, regularBookings, pujaBookings]);

  // Refresh data based on active tab
  const handleRefreshData = useCallback(async () => {
    try {
      switch (activeTab) {
        case 'astrology':
          await fetchAstrologyBookings(filters);
          break;
        case 'regular':
          await fetchRegularBookings(filters);
          break;
        case 'puja':
          await fetchPujaBookings(filters);
          break;
        default:
          await fetchAllBookings();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    }
  }, [activeTab, filters, fetchAstrologyBookings, fetchRegularBookings, fetchPujaBookings, fetchAllBookings]);

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

  // Apply filters
  const handleApplyFilters = useCallback(() => {
    handleRefreshData();
    setShowFilters(false);
  }, [handleRefreshData]);

  // Export data
  const handleExport = useCallback(async () => {
    try {
      const currentData = getCurrentData();
      if (currentData.length === 0) {
        toast.error('No data to export');
        return;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${activeTab}_bookings_${timestamp}`;
      
      // Export as CSV
      exportToCSV(currentData, `${filename}.csv`);
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  }, [activeTab, getCurrentData]);

  // Handle bulk actions
  const handleBulkAction = useCallback(async (action: string) => {
    if (selectedBookings.length === 0) {
      toast.error('Please select bookings first');
      return;
    }

    try {
      const bookingIds = selectedBookings.map(id => {
        // Extract numeric ID from string ID
        if (id.includes('-')) {
          return parseInt(id.split('-')[1]);
        }
        return parseInt(id);
      });

      let type: 'astrology' | 'regular' | 'puja';
      if (activeTab === 'astrology') type = 'astrology';
      else if (activeTab === 'regular') type = 'regular';
      else if (activeTab === 'puja') type = 'puja';
      else {
        toast.error('Bulk actions not available for combined view');
        return;
      }

      const success = await performBulkAction(type, {
        action,
        booking_ids: bookingIds,
      });

      if (success) {
        setSelectedBookings([]);
        setShowBulkActions(false);
      }
    } catch (error) {
      console.error('Bulk action error:', error);
    }
  }, [selectedBookings, activeTab, performBulkAction]);

  // Handle calendar date selection
  const handleCalendarDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setFilters(prev => ({
      ...prev,
      dateFrom: date.toISOString().split('T')[0],
      dateTo: date.toISOString().split('T')[0],
    }));
    setShowCalendar(false);
    // Apply the date filter
    handleApplyFilters();
  }, [handleApplyFilters]);

  // Handle calendar toggle
  const handleCalendarToggle = useCallback(() => {
    setShowCalendar(!showCalendar);
  }, [showCalendar]);

  // Handle booking view
  const handleViewBooking = useCallback((booking: any) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  }, []);

  // Handle booking edit
  const handleEditBooking = useCallback((booking: any) => {
    // Close modal and handle edit logic
    setShowBookingModal(false);
    toast.success('Edit functionality will be implemented');
  }, []);

  // Handle booking status update
  const handleBookingStatusUpdate = useCallback(async (status: string, reason?: string) => {
    if (!selectedBooking) return false;
    
    let type: 'regular' | 'puja';
    if (activeTab === 'regular') type = 'regular';
    else if (activeTab === 'puja') type = 'puja';
    else {
      toast.error('Status update not available for this booking type');
      return false;
    }

    const success = await updateBookingStatus(type, selectedBooking.id, status, reason);
    if (success) {
      // Update the booking in selectedBooking state
      setSelectedBooking((prev: any) => ({ ...prev, status, status_display: status }));
    }
    return success;
  }, [selectedBooking, activeTab, updateBookingStatus]);

  // Get status color
  const getStatusColor = useCallback((status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
      case 'REJECTED':
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  // Get status icon
  const getStatusIcon = useCallback((status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <ClockIcon className="h-4 w-4" />;
      case 'CONFIRMED':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'CANCELLED':
      case 'REJECTED':
      case 'FAILED':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4" />;
    }
  }, []);

  // Tab configuration
  const tabs = [
    { id: 'all', label: 'All Bookings', icon: ChartBarIcon, count: getCurrentData().length },
    { id: 'astrology', label: 'Astrology', icon: SparklesIcon, count: astrologyBookings?.length || 0 },
    { id: 'regular', label: 'Regular Services', icon: UserGroupIcon, count: regularBookings?.length || 0 },
    { id: 'puja', label: 'Puja Services', icon: FireIcon, count: pujaBookings?.length || 0 },
  ];

  const currentData = getCurrentData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Management
          </h1>
          <p className="text-gray-600">
            Manage all your bookings, track performance, and handle customer requests
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800">{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="mb-8">
          <AdminDashboardStats 
            astrologyData={astrologyDashboard}
            regularData={regularDashboard}
            pujaData={pujaDashboard}
            loading={loading}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
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

          {/* Action Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Left side - Search and Filters */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDownIcon className={`h-4 w-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <button
                  onClick={handleRefreshData}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Right side - View Toggle and Actions */}
              <div className="flex items-center space-x-4">
                {/* View Toggle */}
                <div className="inline-flex rounded-lg border border-gray-300 p-1 bg-gray-50">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`
                      inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                      ${viewMode === 'table'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                      }
                    `}
                  >
                    <TableCellsIcon className="h-4 w-4 mr-1.5" />
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('card')}
                    className={`
                      inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                      ${viewMode === 'card'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                      }
                    `}
                  >
                    <Squares2X2Icon className="h-4 w-4 mr-1.5" />
                    Cards
                  </button>
                </div>

                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export
                </button>

                <button
                  onClick={handleCalendarToggle}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  Calendar
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={handleApplyFilters}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => setFilters({ search: '', status: '', dateFrom: '', dateTo: '', serviceType: '' })}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Actions Bar */}
            {selectedBookings.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedBookings.length} booking(s) selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleBulkAction('confirm')}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleBulkAction('cancel')}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setSelectedBookings([])}
                      className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Data Display */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-12">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new booking or adjust your filters.
                </p>
              </div>
            ) : (
              <>
                {viewMode === 'table' ? (
                  <BookingTable
                    data={currentData}
                    activeTab={activeTab}
                    selectedBookings={selectedBookings}
                    onSelectionChange={setSelectedBookings}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    onUpdateStatus={updateBookingStatus}
                    onViewBooking={handleViewBooking}
                    onEditBooking={handleEditBooking}
                  />
                ) : (
                  <BookingCards
                    data={currentData}
                    activeTab={activeTab}
                    selectedBookings={selectedBookings}
                    onSelectionChange={setSelectedBookings}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    onUpdateStatus={updateBookingStatus}
                    onViewBooking={handleViewBooking}
                    onEditBooking={handleEditBooking}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
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

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        booking={selectedBooking}
        bookingType={activeTab as 'astrology' | 'regular' | 'puja' | 'all'}
        onUpdateStatus={handleBookingStatusUpdate}
        onEdit={handleEditBooking}
      />
    </div>
  );
};

// Table View Component
const BookingTable: React.FC<{
  data: any[];
  activeTab: string;
  selectedBookings: string[];
  onSelectionChange: (selected: string[]) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  onUpdateStatus: (type: 'regular' | 'puja', id: number, status: string, reason?: string) => Promise<boolean>;
  onViewBooking: (booking: any) => void;
  onEditBooking: (booking: any) => void;
}> = ({ data, activeTab, selectedBookings, onSelectionChange, getStatusColor, getStatusIcon, onUpdateStatus, onViewBooking, onEditBooking }) => {
  
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

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-4 px-6 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => {
              const itemId = item.id?.toString() || '';
              return (
                <tr
                  key={itemId}
                  className={`hover:bg-gray-50 ${isSelected(itemId) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected(itemId)}
                      onChange={(e) => handleSelectItem(itemId, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{item.astro_book_id || item.book_id || item.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activeTab !== 'all' ? activeTab : item.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.customer_name || item.user_name || item.contact_name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.contact_email || item.user_email || 'No email'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.service?.title || item.service_title || 'Unknown Service'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.category_name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{item.service?.price || item.total_amount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status_display || item.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => onViewBooking(item)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onEditBooking(item)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"
                        title="Edit Booking"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                        title="Delete Booking"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
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

// Card View Component
const BookingCards: React.FC<{
  data: any[];
  activeTab: string;
  selectedBookings: string[];
  onSelectionChange: (selected: string[]) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  onUpdateStatus: (type: 'regular' | 'puja', id: number, status: string, reason?: string) => Promise<boolean>;
  onViewBooking: (booking: any) => void;
  onEditBooking: (booking: any) => void;
}> = ({ data, activeTab, selectedBookings, onSelectionChange, getStatusColor, getStatusIcon, onUpdateStatus, onViewBooking, onEditBooking }) => {
  
  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedBookings, id]);
    } else {
      onSelectionChange(selectedBookings.filter(item => item !== id));
    }
  };

  const isSelected = (id: string) => selectedBookings.includes(id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => {
        const itemId = item.id?.toString() || '';
        return (
          <div
            key={itemId}
            className={`bg-white rounded-lg border transition-all duration-200 hover:shadow-lg ${
              isSelected(itemId) ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' : 'border-gray-200'
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isSelected(itemId)}
                    onChange={(e) => handleSelectItem(itemId, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      #{item.astro_book_id || item.book_id || item.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activeTab !== 'all' ? activeTab : item.type}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  <span className="ml-1">{item.status_display || item.status}</span>
                </span>
              </div>

              {/* Customer Info */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900">
                  {item.customer_name || item.user_name || item.contact_name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500">
                  {item.contact_email || item.user_email || 'No email'}
                </p>
              </div>

              {/* Service Info */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900">
                  {item.service?.title || item.service_title || 'Unknown Service'}
                </p>
                <p className="text-sm text-gray-500">
                  {item.category_name || 'N/A'}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  ₹{item.service?.price || item.total_amount || 0}
                </p>
              </div>

              {/* Date */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Created: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onViewBooking(item)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button 
                    onClick={() => onEditBooking(item)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                </div>
                <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminBookingsPage;
