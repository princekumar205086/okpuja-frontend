'use client';

import { useState } from 'react';
import { XMarkIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAdminBookingStore } from '@/app/stores/adminBookingStore';
import { toast } from 'react-hot-toast';

interface BookingRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  type: 'astrology' | 'regular' | 'puja';
}

export default function BookingRescheduleModal({
  isOpen,
  onClose,
  booking,
  type
}: BookingRescheduleModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    rescheduleAstrologyBooking,
    rescheduleRegularBooking,
    reschedulePujaBooking
  } = useAdminBookingStore();

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      toast.error('Please select both date and time');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let success = false;
      const bookingId = booking.id || booking.astro_book_id || booking.book_id;
      
      switch (type) {
        case 'astrology':
          // Use PATCH method with preferred_date and preferred_time
          const astrologyResult = await rescheduleAstrologyBooking(bookingId, {
            preferred_date: formData.date,
            preferred_time: formData.time + ':00', // Add seconds
            reason: formData.reason
          });
          success = !!astrologyResult;
          break;
          
        case 'puja':
          // Use POST method with new_date and new_time
          const pujaResult = await reschedulePujaBooking(bookingId, {
            new_date: formData.date,
            new_time: formData.time + ':00', // Add seconds
            reason: formData.reason
          });
          success = !!pujaResult;
          break;
          
        case 'regular':
          // Use POST method with selected_date and selected_time
          const regularResult = await rescheduleRegularBooking(bookingId, {
            selected_date: formData.date,
            selected_time: formData.time + ':00', // Add seconds
            reason: formData.reason
          });
          success = !!regularResult;
          break;
      }
      
      if (success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} booking rescheduled successfully!`);
        onClose();
        setFormData({ date: '', time: '', reason: '' });
        
        // Refresh data after successful reschedule
        setTimeout(() => {
          if (type === 'astrology') {
            useAdminBookingStore.getState().fetchAstrologyBookings();
          } else if (type === 'puja') {
            useAdminBookingStore.getState().fetchPujaBookings();
          } else {
            useAdminBookingStore.getState().fetchRegularBookings();
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Reschedule error:', error);
      toast.error(`Failed to reschedule ${type} booking`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Reschedule {type.charAt(0).toUpperCase() + type.slice(1)} Booking
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              ID: {booking.id || booking.astro_book_id || booking.book_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Booking Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Current Booking Details</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Booking ID:</strong> {booking.book_id || booking.astro_book_id || booking.id}</p>
              <p><strong>Service:</strong> {booking.service?.title || booking.service_title || booking.package_name || 'N/A'}</p>
              <p><strong>Customer:</strong> {
                booking.user?.username || booking.user_name || booking.customer_name || 
                booking.contact_name || booking.contact_email || booking.user?.email || 'N/A'
              }</p>
              <p><strong>Current Date:</strong> {
                booking.selected_date || booking.preferred_date || booking.booking_date || 'N/A'
              }</p>
              <p><strong>Current Time:</strong> {
                booking.selected_time || booking.preferred_time || booking.start_time || 'N/A'
              }</p>
              <p><strong>Status:</strong> <span className="capitalize font-medium text-orange-600">{booking.status || 'N/A'}</span></p>
            </div>
          </div>

          {/* New Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              New Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {/* New Time */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              <ClockIcon className="h-4 w-4 inline mr-1" />
              New Time
            </label>
            <input
              type="time"
              id="time"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason (Optional)
            </label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Reason for rescheduling..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Rescheduling...' : 'Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}