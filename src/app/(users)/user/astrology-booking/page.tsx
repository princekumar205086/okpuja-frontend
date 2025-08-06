'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookingCard from './components/BookingCard';
import BookingDetails from './components/BookingDetails';
import BookingFilters from './components/BookingFilters';
import EmptyBookingState from './components/EmptyBookingState';
import ConfirmDialog from './components/ConfirmDialog';
import { fetchUserBookings, cancelBooking, UserAstrologyBooking } from './userAstrologyApiService';

const UserAstrologyBookingPage = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<UserAstrologyBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<UserAstrologyBooking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<UserAstrologyBooking | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [cancelBookingId, setCancelBookingId] = useState<string>('');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: {
      startDate: '',
      endDate: ''
    }
  });

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  const loadBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUserBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load your bookings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Filter by date range (preferred_date)
    if (filters.dateRange.startDate) {
      const startDate = new Date(filters.dateRange.startDate);
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.preferred_date);
        return bookingDate >= startDate;
      });
    }

    if (filters.dateRange.endDate) {
      const endDate = new Date(filters.dateRange.endDate);
      // Set to end of day
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.preferred_date);
        return bookingDate <= endDate;
      });
    }

    setFilteredBookings(filtered);
  };

  const handleViewDetails = (booking: UserAstrologyBooking) => {
    setSelectedBooking(booking);
  };

  const handleCancelBooking = (bookingId: string) => {
    setCancelBookingId(bookingId);
    setShowCancelDialog(true);
  };

  const confirmCancelBooking = async () => {
    if (!cancelBookingId) return;
    
    setIsCancelling(true);
    try {
      const updatedBooking = await cancelBooking(cancelBookingId);
      
      // Update bookings list with the cancelled booking
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.astro_book_id === cancelBookingId 
            ? { ...booking, status: 'CANCELLED' } 
            : booking
        )
      );
      
      // Update selected booking if it's currently displayed
      if (selectedBooking && selectedBooking.astro_book_id === cancelBookingId) {
        setSelectedBooking(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
      }
      
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      setError('Failed to cancel booking. Please try again or contact support.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Sort bookings by created_at date (newest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
  });

  // Group bookings by status for better organization
  const upcomingBookings = sortedBookings.filter(booking => 
    booking.status === 'CONFIRMED' && booking.meeting_link
  );
  
  const confirmedBookings = sortedBookings.filter(booking => 
    booking.status === 'CONFIRMED' && !booking.meeting_link
  );
  
  const completedBookings = sortedBookings.filter(booking => 
    booking.status === 'COMPLETED'
  );
  
  const cancelledBookings = sortedBookings.filter(booking => 
    booking.status === 'CANCELLED'
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Astrology Bookings</h1>
        <p className="text-gray-600 mb-6">View and manage your astrology consultation bookings</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
            <button 
              className="ml-2 underline"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}
        
        <BookingFilters 
          onFilterChange={handleFilterChange} 
          onRefresh={loadBookings}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : sortedBookings.length === 0 ? (
          <EmptyBookingState />
        ) : (
          <div className="space-y-8">
            {/* Upcoming Bookings (with meeting link) */}
            {upcomingBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Upcoming Sessions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingBookings.map(booking => (
                    <BookingCard
                      key={booking.astro_book_id}
                      booking={booking}
                      onViewDetails={() => handleViewDetails(booking)}
                      onCancelBooking={handleCancelBooking}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Confirmed Bookings (waiting for meeting link) */}
            {confirmedBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Confirmed Bookings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {confirmedBookings.map(booking => (
                    <BookingCard
                      key={booking.astro_book_id}
                      booking={booking}
                      onViewDetails={() => handleViewDetails(booking)}
                      onCancelBooking={handleCancelBooking}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Completed Bookings */}
            {completedBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                  Completed Bookings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedBookings.map(booking => (
                    <BookingCard
                      key={booking.astro_book_id}
                      booking={booking}
                      onViewDetails={() => handleViewDetails(booking)}
                      onCancelBooking={handleCancelBooking}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Cancelled Bookings */}
            {cancelledBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Cancelled Bookings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cancelledBookings.map(booking => (
                    <BookingCard
                      key={booking.astro_book_id}
                      booking={booking}
                      onViewDetails={() => handleViewDetails(booking)}
                      onCancelBooking={handleCancelBooking}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onCancelBooking={handleCancelBooking}
        />
      )}
      
      <ConfirmDialog
        isOpen={showCancelDialog}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        cancelText="No, Keep Booking"
        onConfirm={confirmCancelBooking}
        onCancel={() => setShowCancelDialog(false)}
        isLoading={isCancelling}
      />
    </div>
  );
};

export default UserAstrologyBookingPage;
