import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../apiService/globalApiconfig';
import { toast } from 'react-hot-toast';

export interface Address {
  id: number;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressRequest {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchAddresses: () => Promise<void>;
  createAddress: (address: CreateAddressRequest) => Promise<boolean>;
  updateAddress: (id: number, address: Partial<CreateAddressRequest>) => Promise<boolean>;
  deleteAddress: (id: number) => Promise<boolean>;
  setDefaultAddress: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      loading: false,
      error: null,

      fetchAddresses: async () => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.get('/auth/addresses/');
          const addresses = response.data || [];
          set({ 
            addresses,
            loading: false,
            error: null 
          });
        } catch (err: any) {
          console.error('Fetch addresses error:', err);
          let errorMessage = 'Failed to load addresses';
          
          if (err.response?.status === 401) {
            errorMessage = 'Please login to view addresses';
          }
          
          set({ 
            error: errorMessage,
            loading: false 
          });
        }
      },

      createAddress: async (address: CreateAddressRequest): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.post('/auth/addresses/', address);
          
          // Refresh addresses
          await get().fetchAddresses();
          
          toast.success('Address created successfully!');
          return true;
        } catch (err: any) {
          console.error('Create address error:', err);
          let errorMessage = 'Failed to create address';
          
          if (err.response?.status === 400) {
            const errorData = err.response.data;
            if (typeof errorData === 'object') {
              const firstError = Object.values(errorData)[0];
              if (Array.isArray(firstError)) {
                errorMessage = firstError[0];
              } else if (typeof firstError === 'string') {
                errorMessage = firstError;
              }
            }
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      updateAddress: async (id: number, address: Partial<CreateAddressRequest>): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          await apiClient.patch(`/auth/addresses/${id}/`, address);
          
          // Refresh addresses
          await get().fetchAddresses();
          
          toast.success('Address updated successfully!');
          return true;
        } catch (err: any) {
          console.error('Update address error:', err);
          set({ error: 'Failed to update address', loading: false });
          toast.error('Failed to update address');
          return false;
        }
      },

      deleteAddress: async (id: number): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          await apiClient.delete(`/auth/addresses/${id}/`);
          
          // Refresh addresses
          await get().fetchAddresses();
          
          toast.success('Address deleted successfully!');
          return true;
        } catch (err: any) {
          console.error('Delete address error:', err);
          set({ error: 'Failed to delete address', loading: false });
          toast.error('Failed to delete address');
          return false;
        }
      },

      setDefaultAddress: async (id: number): Promise<boolean> => {
        return await get().updateAddress(id, { is_default: true });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'address-storage',
      partialize: (state) => ({
        // Only persist essential data
        addresses: state.addresses,
      }),
    }
  )
);
