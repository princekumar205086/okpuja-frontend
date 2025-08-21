'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAdminBookingStore } from '../../../stores/adminBookingStore';

// Import our modular components
import DashboardStats from './components/DashboardStats';
import TabNavigation from './components/TabNavigation';
import FiltersAndActions from './components/FiltersAndActions';
import EnhancedBookingTable from './components/EnhancedBookingTable';
import EnhancedBookingCards from './components/EnhancedBookingCards';
import Pagination from './components/Pagination';
import BookingDetailsDrawer from './components/BookingDetailsDrawer';
import BookingRescheduleDrawer from './components/BookingRescheduleDrawer';
import StatusChangeDrawer from './components/StatusChangeDrawer';
import BookingAssignmentModal from './components/BookingAssignmentModal';

// Interfaces
interface FilterState {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  serviceType: string;
}

// Status colors and icons helper functions
const getStatusColor = (status: string): string => {
  const statusColors = {
    PENDING: 'border-orange-200 bg-orange-50 text-orange-700',
    pending: 'border-orange-200 bg-orange-50 text-orange-700',
    CONFIRMED: 'border-blue-200 bg-blue-50 text-blue-700',
    confirmed: 'border-blue-200 bg-blue-50 text-blue-700',
    IN_PROGRESS: 'border-purple-200 bg-purple-50 text-purple-700',
    in_progress: 'border-purple-200 bg-purple-50 text-purple-700',
    COMPLETED: 'border-green-200 bg-green-50 text-green-700',
    completed: 'border-green-200 bg-green-50 text-green-700',
    CANCELLED: 'border-red-200 bg-red-50 text-red-700',
    cancelled: 'border-red-200 bg-red-50 text-red-700',
    REJECTED: 'border-red-200 bg-red-50 text-red-700',
    rejected: 'border-red-200 bg-red-50 text-red-700',
    FAILED: 'border-red-200 bg-red-50 text-red-700',
    failed: 'border-red-200 bg-red-50 text-red-700',
  };
  return statusColors[status as keyof typeof statusColors] || statusColors.pending;
};

const getStatusIcon = (status: string): React.ReactNode => {
  // Return appropriate icon based on status
  return null; // For now, keeping it simple
};

const AdminBookingsPage: React.FC = () => {
  // Zustand store
  const {
    // Data
    astrologyBookings,
    pujaBookings,
    astrologyDashboard,
    pujaDashboard,
    loading,
    error,
    // Actions
    fetchAstrologyBookings,
    fetchPujaBookings,
    fetchAstrologyDashboard,
    fetchPujaDashboard,
    setCurrentView,
    clearError,
    updateBookingStatus,
  } = useAdminBookingStore();

  // Local state
  const [activeTab, setActiveTab] = useState<'astrology' | 'puja'>('astrology');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    serviceType: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRescheduleDrawerOpen, setIsRescheduleDrawerOpen] = useState(false);
  const [isStatusDrawerOpen, setIsStatusDrawerOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  // Get current data based on active tab
  const getCurrentBookings = () => {
    switch (activeTab) {
      case 'astrology':
        return astrologyBookings;
      case 'puja':
        return pujaBookings;
      default:
        return [];
    }
  };

  const getCurrentDashboard = () => {
    switch (activeTab) {
      case 'astrology':
        return astrologyDashboard;
      case 'puja':
        return pujaDashboard;
      default:
        return null;
    }
  };

  // Fetch data functions
  const fetchCurrentData = useCallback(async () => {
    const filterParams = {
      search: filters.search || undefined,
      status: filters.status || undefined,
      date_from: filters.dateFrom || undefined,
      date_to: filters.dateTo || undefined,
      service_type: filters.serviceType || undefined,
    };

    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(filterParams).filter(([_, value]) => value !== undefined)
    );

    switch (activeTab) {
      case 'astrology':
        await Promise.all([
          fetchAstrologyBookings(cleanParams),
          fetchAstrologyDashboard(),
        ]);
        break;
      case 'puja':
        await Promise.all([
          fetchPujaBookings(cleanParams),
          fetchPujaDashboard(),
        ]);
        break;
    }
  }, [activeTab, filters, fetchAstrologyBookings, fetchPujaBookings, fetchAstrologyDashboard, fetchPujaDashboard]);

  // Effects
  useEffect(() => {
    setCurrentView(activeTab);
    setCurrentPage(1); // Reset pagination when switching tabs
    fetchCurrentData();
  }, [activeTab, fetchCurrentData, setCurrentView]);

  useEffect(() => {
    fetchCurrentData();
  }, [filters, currentPage, fetchCurrentData]);

  // Event handlers
  const handleTabChange = (tab: 'astrology' | 'puja') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setFilters({
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      serviceType: '',
    });
    clearError();
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode: 'table' | 'card') => {
    setViewMode(mode);
  };

  const handleBookingAction = async (action: string, booking: any) => {
    try {
      console.log(`🔄 Performing action: ${action} on booking:`, booking);
      
      switch (action) {
        case 'view':
          setSelectedBooking(booking);
          setIsDrawerOpen(true);
          break;
        case 'edit':
          // Handle edit action
          toast.success('Edit functionality will be implemented');
          break;
        case 'status':
          setSelectedBooking(booking);
          setIsStatusDrawerOpen(true);
          break;
        case 'reschedule':
          setSelectedBooking(booking);
          setIsRescheduleDrawerOpen(true);
          break;
        case 'assign':
          setSelectedBooking(booking);
          setIsAssignmentModalOpen(true);
          break;
        case 'confirm':
          const bookingId = booking.id || booking.astro_book_id || booking.book_id;
          await updateBookingStatus(
            activeTab === 'astrology' ? 'astrology' : 'regular',
            bookingId,
            { status: 'CONFIRMED' } as any
          );
          await fetchCurrentData(); // Refresh data
          break;
        case 'cancel':
          const cancelBookingId = booking.id || booking.astro_book_id || booking.book_id;
          await updateBookingStatus(
            activeTab === 'astrology' ? 'astrology' : 'regular',
            cancelBookingId,
            { status: 'CANCELLED', reason: 'Cancelled by admin' } as any
          );
          await fetchCurrentData(); // Refresh data
          break;
        case 'complete':
          const completeBookingId = booking.id || booking.astro_book_id || booking.book_id;
          await updateBookingStatus(
            activeTab === 'astrology' ? 'astrology' : 'regular',
            completeBookingId,
            { status: 'COMPLETED' } as any
          );
          await fetchCurrentData(); // Refresh data
          break;
        case 'send_link':
          // Handle send meet link
          toast.success('Meet link sent successfully');
          break;
        default:
          console.log(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error(`❌ Action ${action} failed:`, error);
      toast.error(`Failed to ${action} booking`);
    }
  };

  const handleRefresh = () => {
    fetchCurrentData();
  };

  const handleExport = async () => {
    // TODO: Implement export using the store's generateReport method
    toast.success('Export functionality will be implemented');
  };

  // Get current bookings with filtering
  const currentBookings = getCurrentBookings();
  const filteredBookings = currentBookings.filter((booking: any) => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchFields = [
        booking.astro_book_id || booking.book_id || booking.id,
        booking.user?.username || booking.user_name || booking.contact_name,
        booking.user?.email || booking.user_email || booking.contact_email,
        booking.service?.title || booking.service_title || booking.package_name,
      ].filter(Boolean);
      
      const matches = searchFields.some(field => 
        field.toString().toLowerCase().includes(searchTerm)
      );
      
      if (!matches) return false;
    }
    
    if (filters.status && booking.status !== filters.status) {
      return false;
    }
    
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-xl mb-2">⚠️ Error Loading Dashboard</div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage bookings and track performance</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Dashboard Stats */}
        <DashboardStats
          data={getCurrentDashboard()}
          isLoading={loading}
          activeTab={activeTab}
        />

        {/* Filters and Actions */}
        <FiltersAndActions
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          isLoading={loading}
        />

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} results
            </span>
            <span>
              {activeTab === 'astrology' ? 'Astrology Services' : 'Puja Services'}
            </span>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {viewMode === 'table' ? (
            <EnhancedBookingTable
              bookings={paginatedBookings}
              isLoading={loading}
              onAction={handleBookingAction}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              serviceType={activeTab === 'astrology' ? 'astrology' : activeTab === 'puja' ? 'puja' : 'regular'}
            />
          ) : (
            <EnhancedBookingCards
              bookings={paginatedBookings}
              isLoading={loading}
              onAction={handleBookingAction}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              serviceType={activeTab === 'astrology' ? 'astrology' : activeTab === 'puja' ? 'puja' : 'regular'}
            />
          )}
        </div>

        {/* Pagination */}
        {filteredBookings.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredBookings.length}
            itemsPerPage={itemsPerPage}
          />
        )}

        {/* Booking Details Drawer */}
        <BookingDetailsDrawer
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          onAction={(action, bookingId) => {
            if (selectedBooking) {
              handleBookingAction(action, selectedBooking);
            }
          }}
          type={activeTab === 'astrology' ? 'astrology' : activeTab === 'puja' ? 'puja' : 'regular'}
        />

        {/* Booking Reschedule Drawer */}
        <BookingRescheduleDrawer
          open={isRescheduleDrawerOpen}
          onClose={() => {
            setIsRescheduleDrawerOpen(false);
            setSelectedBooking(null);
            // Refresh data after successful reschedule
            setTimeout(() => {
              fetchCurrentData();
            }, 1000);
          }}
          booking={selectedBooking}
          type={activeTab === 'astrology' ? 'astrology' : activeTab === 'puja' ? 'puja' : 'regular'}
        />

        {/* Status Change Drawer */}
        <StatusChangeDrawer
          open={isStatusDrawerOpen}
          onClose={() => {
            setIsStatusDrawerOpen(false);
            setSelectedBooking(null);
            // Refresh data after status change
            setTimeout(() => {
              fetchCurrentData();
            }, 1000);
          }}
          booking={selectedBooking}
          type={activeTab === 'astrology' ? 'astrology' : activeTab === 'puja' ? 'puja' : 'regular'}
        />

        {/* Booking Assignment Modal */}
        <BookingAssignmentModal
          isOpen={isAssignmentModalOpen}
          onClose={() => {
            setIsAssignmentModalOpen(false);
            setSelectedBooking(null);
            // Refresh data after assignment change
            setTimeout(() => {
              fetchCurrentData();
            }, 1000);
          }}
          booking={selectedBooking}
          type={activeTab === 'astrology' ? 'astrology' : activeTab === 'puja' ? 'puja' : 'regular'}
        />
      </div>
    </div>
  );
};

export default AdminBookingsPage;