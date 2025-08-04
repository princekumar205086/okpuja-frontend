import apiClient from '../../apiService/globalApiconfig';
import { toast } from 'react-hot-toast';

export interface AstrologyBookingDetails {
  booking_id: number;
  language: string;
  birth_place: string;
  birth_date: string;
  birth_time: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  questions?: string;
  contact_email: string;
  contact_phone: string;
}

export interface CreateAstrologyBookingDetailsRequest {
  booking_id: number;
  language: string;
  birth_place: string;
  birth_date: string;
  birth_time: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  questions?: string;
  contact_email: string;
  contact_phone: string;
}

export const astrologyBookingApiService = {
  // Create additional astrology booking details after payment success
  createBookingDetails: async (data: CreateAstrologyBookingDetailsRequest): Promise<AstrologyBookingDetails | null> => {
    try {
      const response = await apiClient.post<AstrologyBookingDetails>('/astrology/booking-details/', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating astrology booking details:', error);
      
      let errorMessage = 'Failed to save booking details';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
      return null;
    }
  },

  // Get astrology booking details by booking ID
  getBookingDetails: async (bookingId: number): Promise<AstrologyBookingDetails | null> => {
    try {
      const response = await apiClient.get<AstrologyBookingDetails>(`/astrology/booking-details/${bookingId}/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching astrology booking details:', error);
      return null;
    }
  },

  // Update astrology booking details
  updateBookingDetails: async (bookingId: number, data: Partial<CreateAstrologyBookingDetailsRequest>): Promise<AstrologyBookingDetails | null> => {
    try {
      const response = await apiClient.patch<AstrologyBookingDetails>(`/astrology/booking-details/${bookingId}/`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating astrology booking details:', error);
      
      let errorMessage = 'Failed to update booking details';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast.error(errorMessage);
      return null;
    }
  }
};

// Helper function to process astrology details from session storage after successful payment
export const processAstrologyBookingAfterPayment = async (bookingId: number): Promise<boolean> => {
  try {
    // Get stored astrology details from session storage
    const storedDetails = sessionStorage.getItem('astrology_booking_details');
    if (!storedDetails) {
      console.log('No astrology booking details found in session storage');
      return true; // Not an error, just no additional details to save
    }

    const astrologyDetails = JSON.parse(storedDetails);
    
    // Create the booking details
    const bookingDetailsData: CreateAstrologyBookingDetailsRequest = {
      booking_id: bookingId,
      ...astrologyDetails
    };

    const result = await astrologyBookingApiService.createBookingDetails(bookingDetailsData);
    
    if (result) {
      // Clear the session storage after successful save
      sessionStorage.removeItem('astrology_booking_details');
      toast.success('Astrology consultation details saved successfully!');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error processing astrology booking after payment:', error);
    return false;
  }
};
