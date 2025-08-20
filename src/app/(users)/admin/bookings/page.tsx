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
  CalendarIcon,
  LinkIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
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
import { BookingDrawer } from '../../../components/ui/BookingDrawer';
import { MUIProvider } from '../../../components/providers/MUIProvider';

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
    rescheduleAstrologyBooking,
    rescheduleRegularBooking,
    reschedulePujaBooking,
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
  const [showBookingDrawer, setShowBookingDrawer] = useState(false);
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
      case 'puja':
        // Changed from 'regular' to 'puja' - now showing only puja services
        return [...(pujaBookings || []), ...(regularBookings || [])].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return [
          ...(astrologyBookings?.map(b => ({ ...b, type: 'astrology' })) || []),
          ...(regularBookings?.map(b => ({ ...b, type: 'puja' })) || []),
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
        case 'puja':
          // Fetch both puja and regular services for "Puja Services" tab
          await fetchPujaBookings(filters);
          await fetchRegularBookings(filters);
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
    setShowBookingDrawer(true);
  }, []);

  // Handle booking edit
  const handleEditBooking = useCallback((booking: any) => {
    // Open booking drawer for editing
    setSelectedBooking(booking);
    setShowBookingDrawer(true);
  }, []);

  // Handle sending meeting link for astrology sessions
  const handleSendMeetLink = useCallback(async (booking: any) => {
    try {
      const meetLink = prompt('Enter meeting link:', 'https://meet.google.com/');
      if (!meetLink) return;

      // Here you would implement the API call to send the meeting link
      toast.success(`Meeting link sent to ${booking.customer_name || booking.user_name}`);
    } catch (error) {
      console.error('Error sending meeting link:', error);
      toast.error('Failed to send meeting link');
    }
  }, []);

  // Fixed reschedule booking handler based on backend test results
  const handleRescheduleBooking = useCallback(async (booking: any, newDate: string, newTime: string) => {
    try {
      const bookingType = activeTab !== 'all' ? activeTab : booking.type;
      let result = null;

      switch (bookingType) {
        case 'astrology':
          // Use PATCH method for astrology bookings
          result = await rescheduleAstrologyBooking(booking.id, {
            preferred_date: newDate,
            preferred_time: newTime,
            reason: 'Admin reschedule'
          });
          break;
        
        case 'puja':
        case 'regular':
          // Use POST method for puja bookings
          result = await reschedulePujaBooking(booking.id, {
            new_date: newDate,
            new_time: newTime,
            reason: 'Admin reschedule'
          });
          break;
        
        default:
          toast.error('Unknown booking type');
          return false;
      }

      if (result) {
        // Update the selected booking if it's currently open
        if (selectedBooking && selectedBooking.id === booking.id) {
          setSelectedBooking({ ...selectedBooking, ...result.booking });
        }
        // Refresh data to show updated booking
        await handleRefreshData();
        toast.success('Booking rescheduled successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      toast.error('Failed to reschedule booking');
      return false;
    }
  }, [activeTab, rescheduleAstrologyBooking, reschedulePujaBooking, selectedBooking, handleRefreshData]);

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

  // Tab configuration - Updated to reflect proper service names
  const tabs = [
    { id: 'all', label: 'All Bookings', icon: ChartBarIcon, count: getCurrentData().length },
    { id: 'astrology', label: 'Astrology Services', icon: SparklesIcon, count: astrologyBookings?.length || 0 },
    { id: 'puja', label: 'Puja Services', icon: FireIcon, count: (regularBookings?.length || 0) + (pujaBookings?.length || 0) },
  ];

  const currentData = getCurrentData();

  return (
    <MUIProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-2 sm:p-3 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                Booking Management Dashboard
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg">
                Comprehensive management for all your astrology and puja service bookings
              </p>
            </div>
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

        {/* Enhanced Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-4 sm:mb-6 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <nav className="flex space-x-1 xs:space-x-2 sm:space-x-4 md:space-x-8 px-4 sm:px-6 md:px-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      py-4 sm:py-5 px-2 sm:px-4 border-b-3 font-semibold text-sm sm:text-base flex items-center space-x-2 sm:space-x-3 whitespace-nowrap transition-all duration-300
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                    <span className="font-medium">{tab.label}</span>
                    <span className={`
                      inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm
                      ${activeTab === tab.id
                        ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-200'
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
          <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Left side - Search and Filters */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                <div className="relative flex-grow max-w-full sm:max-w-xs">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
                >
                  <FunnelIcon className="h-4 w-4 mr-1 sm:mr-2" />
                  Filters
                  <ChevronDownIcon className={`h-4 w-4 ml-1 sm:ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <button
                  onClick={handleRefreshData}
                  disabled={loading}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 whitespace-nowrap"
                >
                  <ArrowPathIcon className={`h-4 w-4 mr-1 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Right side - View Toggle and Actions */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                {/* View Toggle */}
                <div className="inline-flex rounded-lg border border-gray-300 p-1 bg-gray-50 shrink-0">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`
                      inline-flex items-center px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors
                      ${viewMode === 'table'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                      }
                    `}
                  >
                    <TableCellsIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('card')}
                    className={`
                      inline-flex items-center px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors
                      ${viewMode === 'card'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                      }
                    `}
                  >
                    <Squares2X2Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                    Cards
                  </button>
                </div>

                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
                >
                  <ArrowDownTrayIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Export</span>
                </button>

                <button
                  onClick={handleCalendarToggle}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
                >
                  <CalendarDaysIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Calendar</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-end space-x-2 sm:space-x-3">
                    <button
                      onClick={handleApplyFilters}
                      className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => setFilters({ search: '', status: '', dateFrom: '', dateTo: '', serviceType: '' })}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Actions Bar */}
            {selectedBookings.length > 0 && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between space-y-2 xs:space-y-0">
                  <span className="text-xs sm:text-sm font-medium text-blue-900">
                    {selectedBookings.length} booking(s) selected
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleBulkAction('confirm')}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-600 text-white text-xs sm:text-sm rounded-md hover:bg-green-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleBulkAction('cancel')}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-600 text-white text-xs sm:text-sm rounded-md hover:bg-red-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setSelectedBookings([])}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-600 text-white text-xs sm:text-sm rounded-md hover:bg-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Data Display */}
          <div className={`${viewMode === 'card' ? 'bg-gradient-to-br from-gray-50 to-white' : 'bg-white'} ${viewMode === 'card' ? 'p-6 sm:p-8' : 'p-6'}`}>
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
            ) : (
              <>
                {viewMode === 'table' ? (
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
                  <div className="space-y-6">
                    {viewMode === 'card' && (
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                          {activeTab === 'all' ? 'All Bookings' : 
                           activeTab === 'astrology' ? 'Astrology Services' :
                           'Puja Services'}
                        </h2>
                        <p className="text-gray-600 text-lg">
                          Showing {currentData.length} {currentData.length === 1 ? 'booking' : 'bookings'}
                        </p>
                      </div>
                    )}
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
                  </div>
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

      {/* Enhanced Booking Details Drawer */}
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

export default AdminBookingsPage;
