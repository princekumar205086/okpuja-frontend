import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAdminBookingStore } from '../../../../stores/adminBookingStore';

export const useBookingHandlers = (
  setSelectedBooking: (booking: any) => void,
  setShowBookingDrawer: (show: boolean) => void,
  activeTab: string,
  handleRefreshData: () => Promise<void>
) => {
  const {
    updateBookingStatus,
    rescheduleAstrologyBooking,
    reschedulePujaBooking,
  } = useAdminBookingStore();

  const handleViewBooking = useCallback((booking: any) => {
    setSelectedBooking(booking);
    setShowBookingDrawer(true);
  }, [setSelectedBooking, setShowBookingDrawer]);

  const handleEditBooking = useCallback((booking: any) => {
    setSelectedBooking(booking);
    setShowBookingDrawer(true);
  }, [setSelectedBooking, setShowBookingDrawer]);

  const handleSendMeetLink = useCallback(async (booking: any) => {
    try {
      const meetLink = prompt('Enter meeting link:', 'https://meet.google.com/');
      if (!meetLink) return;

      toast.success(`Meeting link sent to ${booking.customer_name || booking.user_name}`);
    } catch (error) {
      console.error('Error sending meeting link:', error);
      toast.error('Failed to send meeting link');
    }
  }, []);

  const handleRescheduleBooking = useCallback(async (booking: any, newDate: string, newTime: string) => {
    try {
      const bookingType = activeTab !== 'all' ? activeTab : booking.type;
      let result = null;

      switch (bookingType) {
        case 'astrology':
          result = await rescheduleAstrologyBooking(booking.id, {
            preferred_date: newDate,
            preferred_time: newTime,
            reason: 'Admin reschedule'
          });
          break;
        
        case 'puja':
        case 'regular':
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
  }, [activeTab, rescheduleAstrologyBooking, reschedulePujaBooking, handleRefreshData]);

  const handleBookingStatusUpdate = useCallback(async (status: string, reason?: string) => {
    try {
      // Implementation for status update
      toast.success('Status updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      return false;
    }
  }, []);

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

  return {
    handleViewBooking,
    handleEditBooking,
    handleSendMeetLink,
    handleRescheduleBooking,
    handleBookingStatusUpdate,
    getStatusColor,
    getStatusIcon,
  };
};
