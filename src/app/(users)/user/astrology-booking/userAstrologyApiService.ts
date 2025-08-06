import apiClient from '@/app/apiService/globalApiconfig';
import { AstrologyBooking } from '@/app/(core)/astrology/types';

// Extended booking type for user view with additional fields
export interface UserAstrologyBooking extends AstrologyBooking {
  service_details: {
    id: number;
    title: string;
    service_type: string;
    price: string;
    duration_minutes: number;
    image_url?: string;
  };
  meeting_link?: string;
  meeting_time?: string;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
}

// Fetch all astrology bookings for the logged-in user
export const fetchUserBookings = async (): Promise<UserAstrologyBooking[]> => {
  try {
    const response = await apiClient.get('/user/astrology/bookings/');
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching user astrology bookings:', error);
    throw error;
  }
};

// Fetch a single booking by ID
export const fetchBookingById = async (bookingId: string): Promise<UserAstrologyBooking> => {
  try {
    const response = await apiClient.get(`/user/astrology/bookings/${bookingId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking ${bookingId}:`, error);
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string): Promise<UserAstrologyBooking> => {
  try {
    const response = await apiClient.patch(`/user/astrology/bookings/${bookingId}/cancel/`);
    return response.data;
  } catch (error) {
    console.error(`Error cancelling booking ${bookingId}:`, error);
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
