'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookingFilters from './components/BookingFilters';
import BookingCard from './components/BookingCard';
import BookingDetails from './components/BookingDetails';
import MeetingLinkModal from './components/MeetingLinkModal';
import {
  AdminAstrologyBooking,
  fetchAstrologyBookings,
  updateBookingStatus,
  sendMeetingLink,
  updateAdminNotes
} from './adminAstrologyApiService';

const AstrologyBookingManagementPage = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminAstrologyBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<AdminAstrologyBooking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<AdminAstrologyBooking | null>(null);
  const [showMeetingModal, setShowMeetingModal] = useState<boolean>(false);
  const [filterParams, setFilterParams] = useState({
    status: 'all',
    searchTerm: '',
    dateRange: {
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const applyFilters = React.useCallback(() => {
    let filtered = [...bookings];

    // Filter by status
    if (filterParams.status !== 'all') {
      filtered = filtered.filter(booking => booking.status === filterParams.status);
    }

    // Filter by search term (client name, email, phone, or booking ID)
    if (filterParams.searchTerm) {
      const searchLower = filterParams.searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.user_details.username?.toLowerCase().includes(searchLower) ||
        booking.contact_email?.toLowerCase().includes(searchLower) ||
        booking.contact_phone?.toLowerCase().includes(searchLower) ||
        booking.astro_book_id?.toLowerCase().includes(searchLower) ||
        booking.service_details.title?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date range
    if (filterParams.dateRange.startDate) {
      const startDate = new Date(filterParams.dateRange.startDate);
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.preferred_date);
        return bookingDate >= startDate;
      });
    }

    if (filterParams.dateRange.endDate) {
      const endDate = new Date(filterParams.dateRange.endDate);
      // Set to end of day
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.preferred_date);
        return bookingDate <= endDate;
      });
    }

    setFilteredBookings(filtered);
  }, [bookings, filterParams]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAstrologyBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleFilterChange = (newFilters: any) => {
    setFilterParams(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleSelectBooking = (booking: AdminAstrologyBooking) => {
    setSelectedBooking(booking);
  };

  const handleUpdateStatus = async (bookingId: string, status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    try {
      await updateBookingStatus(bookingId, status);
      
      // Update the local state with the new status
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.astro_book_id === bookingId 
            ? { ...booking, status } 
            : booking
        )
      );
      
      // Also update the selected booking if it's currently displayed
      if (selectedBooking && selectedBooking.astro_book_id === bookingId) {
        setSelectedBooking(prev => prev ? { ...prev, status } : null);
      }
      
    } catch (error) {
      console.error('Failed to update booking status:', error);
      setError('Failed to update booking status. Please try again.');
    }
  };

  const handleSendMeetingLink = (booking: AdminAstrologyBooking) => {
    setSelectedBooking(booking);
    setShowMeetingModal(true);
  };

  const handleSubmitMeetingLink = async (bookingId: string, meetingLink: string, meetingTime?: string) => {
    try {
      await sendMeetingLink(bookingId, meetingLink, meetingTime);
      
      // Update local state
      const updatedBookings = bookings.map(booking => 
        booking.astro_book_id === bookingId 
          ? { 
              ...booking, 
              meeting_link: meetingLink,
              meeting_time: meetingTime || booking.meeting_time 
            } 
          : booking
      );
      
      setBookings(updatedBookings);
      
      // Update selected booking if applicable
      if (selectedBooking && selectedBooking.astro_book_id === bookingId) {
        setSelectedBooking(prev => 
          prev ? { 
            ...prev, 
            meeting_link: meetingLink,
            meeting_time: meetingTime || prev.meeting_time 
          } : null
        );
      }
      
      setShowMeetingModal(false);
    } catch (error) {
      console.error('Failed to send meeting link:', error);
      setError('Failed to send meeting link. Please try again.');
    }
  };

  const handleUpdateNotes = async (bookingId: string, notes: string) => {
    try {
      await updateAdminNotes(bookingId, notes);
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.astro_book_id === bookingId 
            ? { ...booking, admin_notes: notes } 
            : booking
        )
      );
      
      // Update selected booking if applicable
      if (selectedBooking && selectedBooking.astro_book_id === bookingId) {
        setSelectedBooking(prev => prev ? { ...prev, admin_notes: notes } : null);
      }
      
    } catch (error) {
      console.error('Failed to update notes:', error);
      setError('Failed to update notes. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Astrology Booking Management</h1>
        
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
          filterParams={filterParams}
        />
        
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium">No bookings found</p>
                <p className="mt-1">Try adjusting your filters or refresh the page.</p>
                <button 
                  onClick={loadBookings}
                  className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookings.map(booking => (
                <BookingCard
                  key={booking.astro_book_id}
                  booking={booking}
                  onSelect={() => handleSelectBooking(booking)}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {selectedBooking && !showMeetingModal && (
        <BookingDetails
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={handleUpdateStatus}
          onSendMeetingLink={handleSendMeetingLink}
          onUpdateNotes={handleUpdateNotes}
        />
      )}
      
      {selectedBooking && showMeetingModal && (
        <MeetingLinkModal
          booking={selectedBooking}
          onClose={() => setShowMeetingModal(false)}
          onSubmit={handleSubmitMeetingLink}
        />
      )}
    </div>
  );
};

export default AstrologyBookingManagementPage;
