import apiClient from '@/app/apiService/globalApiconfig';
import { AstrologyBooking } from '@/app/(core)/astrology/types';

// Extended booking type for admin view with additional fields
export interface AdminAstrologyBooking extends AstrologyBooking {
  service_details: {
    id: number;
    title: string;
    service_type: string;
    price: string;
    duration_minutes: number;
    image_url?: string;
  };
  user_details: {
    id: number;
    email: string;
    username: string;
    phone: string;
  };
  meeting_link?: string;
  meeting_time?: string;
  admin_notes?: string;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
}

// Filter parameters for booking list
export interface BookingFilters {
  page?: number;
  page_size?: number;
  search?: string;
  status?: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'ALL';
  service_type?: string;
  from_date?: string;
  to_date?: string;
  sorting?: string;
}

// Response structure from booking list API
export interface BookingListResponse {
  results: AdminAstrologyBooking[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Fetch all astrology bookings
export const fetchAstrologyBookings = async (): Promise<AdminAstrologyBooking[]> => {
  try {
    const response = await apiClient.get('/admin/astrology/bookings/');
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching astrology bookings:', error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (
  bookingId: string, 
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
): Promise<AdminAstrologyBooking> => {
  try {
    const response = await apiClient.patch(`/admin/astrology/bookings/${bookingId}/`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${bookingId} status:`, error);
    throw error;
  }
};

// Send meeting link to client
export const sendMeetingLink = async (
  bookingId: string, 
  meetingLink: string, 
  meetingTime?: string
): Promise<AdminAstrologyBooking> => {
  try {
    const data: { meeting_link: string; meeting_time?: string } = { 
      meeting_link: meetingLink 
    };
    
    if (meetingTime) {
      data.meeting_time = meetingTime;
    }
    
    const response = await apiClient.patch(`/admin/astrology/bookings/${bookingId}/update-meeting/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error sending meeting link for booking ${bookingId}:`, error);
    throw error;
  }
};

// Update admin notes for a booking
export const updateAdminNotes = async (
  bookingId: string, 
  notes: string
): Promise<AdminAstrologyBooking> => {
  try {
    const response = await apiClient.patch(`/admin/astrology/bookings/${bookingId}/`, { admin_notes: notes });
    return response.data;
  } catch (error) {
    console.error(`Error updating notes for booking ${bookingId}:`, error);
    throw error;
  }
};

// Utility functions for working with bookings
export const formatBookingDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatBookingTime = (timeString: string): string => {
  if (!timeString) return 'N/A';
  
  // Handle ISO format or time-only format
  let hours, minutes;
  
  if (timeString.includes('T')) {
    // This is an ISO date string
    const date = new Date(timeString);
    hours = date.getHours();
    minutes = date.getMinutes();
  } else {
    // This is a time string like "HH:MM:SS"
    [hours, minutes] = timeString.split(':').map(Number);
  }
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  
  return `${hour12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
};

export const getStatusColor = (status: string): { bg: string; text: string; border?: string } => {
  switch (status) {
    case 'CONFIRMED':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'COMPLETED':
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    case 'CANCELLED':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    case 'PAID':
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    case 'FAILED':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    case 'REFUNDED':
      return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
    case 'PENDING':
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  }
};

// (Removed duplicate utility functions)
