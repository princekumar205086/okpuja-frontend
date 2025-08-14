import apiClient from './globalApiconfig';

export interface UserProfile {
  first_name: string;
  last_name: string;
  dob?: string | null;
  profile_picture?: string | null;
  profile_thumbnail?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Address {
  id?: number;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PanCard {
  id?: number;
  pan_number: string;
  pan_card_image_url?: string | null;
  pan_card_thumbnail_url?: string | null;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  user?: number;
}

export interface PostalApiResponse {
  Status: string;
  PostOffice?: Array<{
    Name: string;
    Description: string;
    BranchType: string;
    DeliveryStatus: string;
    Circle: string;
    District: string;
    Division: string;
    Region: string;
    State: string;
    Country: string;
    Pincode: string;
  }>;
  Message?: string;
}

class ProfileService {
  // Profile APIs
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get('/auth/profile/');
    return response.data;
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.patch('/auth/profile/', data);
    return response.data;
  }

  async updateProfilePicture(formData: FormData): Promise<any> {
    const response = await apiClient.patch('/auth/profile/picture/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Address APIs
  async getAddresses(): Promise<Address[]> {
    const response = await apiClient.get('/auth/addresses/');
    return response.data;
  }

  async createAddress(data: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<Address> {
    const response = await apiClient.post('/auth/addresses/', data);
    return response.data;
  }

  async updateAddress(id: number, data: Partial<Address>): Promise<Address> {
    const response = await apiClient.patch(`/auth/addresses/${id}/`, data);
    return response.data;
  }

  async deleteAddress(id: number): Promise<void> {
    await apiClient.delete(`/auth/addresses/${id}/`);
  }

  // PAN Card APIs
  async getPanCard(): Promise<PanCard> {
    const response = await apiClient.get('/auth/pancard/');
    return response.data;
  }

  async updatePanCard(data: Partial<PanCard>): Promise<PanCard> {
    const response = await apiClient.patch('/auth/pancard/', data);
    return response.data;
  }

  // Location Services
  async getLocationFromPincode(pincode: string): Promise<PostalApiResponse> {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      return data[0]; // API returns array with single object
    } catch (error) {
      console.error('Error fetching location from pincode:', error);
      throw new Error('Failed to fetch location data');
    }
  }

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Failed to get current location: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000, // 10 minutes
        }
      );
    });
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<any> {
    try {
      // Using OpenStreetMap Nominatim API (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      return await response.json();
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      throw new Error('Failed to get address from coordinates');
    }
  }
}

export const profileService = new ProfileService();
