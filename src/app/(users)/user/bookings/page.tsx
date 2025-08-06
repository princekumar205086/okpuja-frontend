'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Store imports
import { useBookingStore } from '../../../stores/bookingStore';
import { useAstrologyBookingStore } from '../../../stores/astrologyBookingStore';
import { useAuthStore } from '../../../stores/authStore';

// Component imports
import BookingHeader from './components/BookingHeader';
import BookingTabs from './components/BookingTabs';
import BookingFilters from './components/BookingFilters';
import PujaBookingCard from './components/PujaBookingCard';
import AstrologyBookingCard from './components/AstrologyBookingCard';
import PujaDetailDrawer from './components/PujaDetailDrawer';
import AstrologyDetailDrawer from './components/AstrologyDetailDrawer';
import LoadingSkeleton from './components/LoadingSkeleton';
import EmptyState from './components/EmptyState';
import CancelBookingModal from './components/CancelBookingModal';
import ViewToggle from './components/ViewToggle';
import BookingDataTable from './components/BookingDataTable';

// Types
interface FilterState {
  status: string;
  dateRange: string;
  serviceType: string;
}

interface Booking {
  id: string;
  book_id: string;
  astro_book_id?: string;
  status: string;
  selected_date?: string;
  selected_time?: string;
  preferred_date?: string;
  preferred_time?: string;
  total_amount?: number;
  google_meet_link?: string;
  cart?: any;
  address?: any;
  service?: any;
}

const BookingsPage: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'puja' | 'astrology'>('puja');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    dateRange: '',
    serviceType: ''
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Store hooks
  const { user } = useAuthStore();
  const { 
    bookings: pujaBookings, 
    loading: pujaLoading, 
    error: pujaError, 
    fetchBookings: fetchPujaBookings 
  } = useBookingStore();
  
  const { 
    bookings: astrologyBookings, 
    loading: astrologyLoading, 
    error: astrologyError, 
    fetchAstrologyBookings 
  } = useAstrologyBookingStore();

  // Effects
  useEffect(() => {
    if (user) {
      fetchPujaBookings();
      fetchAstrologyBookings();
    }
  }, [user, fetchPujaBookings, fetchAstrologyBookings]);

  // Filter bookings based on search and filters
  const filterBookings = (bookings: Booking[], type: 'puja' | 'astrology') => {
    if (!Array.isArray(bookings)) return [];
    
    return bookings.filter((booking) => {
      if (!booking) return false;
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = type === 'puja' 
          ? booking.cart?.puja_service?.title?.toLowerCase()?.includes(searchLower)
          : booking.service?.title?.toLowerCase()?.includes(searchLower);
        const idMatch = type === 'puja' 
          ? booking.book_id?.toLowerCase()?.includes(searchLower)
          : booking.astro_book_id?.toLowerCase()?.includes(searchLower);
        
        if (!titleMatch && !idMatch) return false;
      }

      // Status filter
      if (filters.status && booking.status !== filters.status) {
        return false;
      }

      // Service type filter
      if (filters.serviceType) {
        const serviceType = type === 'puja' 
          ? booking.cart?.puja_service?.type
          : booking.service?.service_type;
        if (serviceType !== filters.serviceType) return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const bookingDateStr = type === 'puja' ? booking.selected_date : booking.preferred_date;
        if (!bookingDateStr) return false;
        
        const bookingDate = new Date(bookingDateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        switch (filters.dateRange) {
          case 'today':
            if (bookingDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'tomorrow':
            if (bookingDate.toDateString() !== tomorrow.toDateString()) return false;
            break;
          case 'this_week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            if (bookingDate < weekStart || bookingDate > weekEnd) return false;
            break;
          case 'this_month':
            if (bookingDate.getMonth() !== today.getMonth() || 
                bookingDate.getFullYear() !== today.getFullYear()) return false;
            break;
          case 'past':
            if (bookingDate >= today) return false;
            break;
        }
      }

      return true;
    });
  };

  // Handlers
  const handleRefresh = () => {
    if (activeTab === 'puja') {
      fetchPujaBookings();
    } else {
      fetchAstrologyBookings();
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleCardCancelAction = (booking: Booking) => {
    // Open the cancel modal directly
    setBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  const handleCancelBooking = async (booking: Booking, reason: string, requestRefund: boolean) => {
    try {
      setIsLoading(true);
      
      // For now, just show a success message without making the API call
      // TODO: Implement actual API call when backend is ready
      console.log('Cancel booking:', { booking, reason, requestRefund });
      
      toast.success(requestRefund 
        ? 'Booking cancelled and refund requested successfully!' 
        : 'Booking cancelled successfully!');
      
      // Close the cancel modal
      handleCloseCancelModal();
      
      // Refresh bookings to show updated status
      handleRefresh();
    } catch (error: any) {
      console.error('Cancellation error:', error);
      toast.error('Failed to cancel booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseCancelModal = () => {
    setCancelModalOpen(false);
    setBookingToCancel(null);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

  // Computed values with proper null safety
  const pujaBookingsMapped: Booking[] = Array.isArray(pujaBookings) 
    ? pujaBookings.map((b: any) => ({
        ...b,
        id: b?.id?.toString?.() ?? b?.book_id?.toString?.() ?? Math.random().toString(),
      }))
    : [];
    
  const astrologyBookingsMapped: Booking[] = Array.isArray(astrologyBookings) 
    ? astrologyBookings.map((b: any) => ({
        ...b,
        id: b?.id?.toString?.() ?? b?.astro_book_id?.toString?.() ?? Math.random().toString(),
      }))
    : [];

  const filteredBookings = activeTab === 'puja' 
    ? filterBookings(pujaBookingsMapped, 'puja')
    : filterBookings(astrologyBookingsMapped, 'astrology');

  // Pagination for card view
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = viewMode === 'card' 
    ? filteredBookings.slice(startIndex, startIndex + itemsPerPage)
    : filteredBookings;

  const isDataLoading = activeTab === 'puja' ? pujaLoading : astrologyLoading;
  const hasError = activeTab === 'puja' ? pujaError : astrologyError;

  // Reset pagination when changing tabs or filters
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, filters, viewMode]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <BookingHeader 
          onRefresh={handleRefresh}
          isLoading={isDataLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeTab={activeTab}
        />

        {/* Tabs */}
        <BookingTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTab} bookings...`}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Filters */}
        <BookingFilters 
          filters={filters} 
          onFilterChange={setFilters} 
          activeTab={activeTab}
        />

        {/* Error State */}
        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{hasError}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {isDataLoading ? (
          <LoadingSkeleton count={6} />
        ) : filteredBookings.length === 0 ? (
          <EmptyState 
            title={`No ${activeTab === 'puja' ? 'Puja' : 'Astrology'} Bookings Found`}
            description={activeTab === 'puja' 
              ? "You haven't booked any puja services yet."
              : "You haven't booked any astrology consultations yet."
            }
            actionText={`Browse ${activeTab === 'puja' ? 'Puja' : 'Astrology'} Services`}
            onAction={() => window.location.href = activeTab === 'puja' ? '/services/puja' : '/services/astrology'}
          />
        ) : (
          <>
            {/* View Toggle & Results Count */}
            <ViewToggle
              view={viewMode}
              onViewChange={setViewMode}
              totalItems={activeTab === 'puja' ? pujaBookings.length : astrologyBookings.length}
              filteredItems={filteredBookings.length}
            />

            {/* Content Based on View Mode */}
            {viewMode === 'table' ? (
              <BookingDataTable
                bookings={filteredBookings}
                type={activeTab}
                onViewDetails={handleViewDetails}
                onCancel={handleCardCancelAction}
                loading={isDataLoading}
              />
            ) : (
              <>
                {/* Bookings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
                  {paginatedBookings.map((booking) => (
                    activeTab === 'puja' ? (
                      <PujaBookingCard 
                        key={booking.id || booking.book_id} 
                        booking={booking} 
                        onViewDetails={handleViewDetails}
                        onCancel={handleCardCancelAction}
                      />
                    ) : (
                      <AstrologyBookingCard 
                        key={booking.id || booking.astro_book_id} 
                        booking={booking} 
                        onViewDetails={handleViewDetails}
                        onCancel={handleCardCancelAction}
                      />
                    )
                  ))}
                </div>

                {/* Pagination for Card View */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} results
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        {totalPages > 5 && (
                          <>
                            <span className="px-2 text-gray-400">...</span>
                            <button
                              onClick={() => setCurrentPage(totalPages)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === totalPages
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Detail Drawers */}
        {selectedBooking && (
          <>
            {activeTab === 'puja' ? (
              <PujaDetailDrawer
                open={drawerOpen}
                onClose={handleCloseDrawer}
                booking={selectedBooking}
                onCancel={handleCancelBooking}
              />
            ) : (
              <AstrologyDetailDrawer
                open={drawerOpen}
                onClose={handleCloseDrawer}
                booking={selectedBooking}
                onCancel={handleCancelBooking}
              />
            )}
          </>
        )}

        {/* Cancel Booking Modal */}
        {bookingToCancel && (
          <CancelBookingModal
            open={cancelModalOpen}
            onClose={handleCloseCancelModal}
            booking={bookingToCancel}
            type={activeTab}
            onCancel={handleCancelBooking}
          />
        )}
      </div>
    </div>
  );
};

export default BookingsPage;