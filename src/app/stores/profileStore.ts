import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Address, PanCard, profileService } from '../apiService/profileService';
import toast from 'react-hot-toast';

interface ProfileState {
  // Profile data
  profile: UserProfile | null;
  addresses: Address[];
  panCard: PanCard | null;
  
  // Loading states
  profileLoading: boolean;
  addressesLoading: boolean;
  panCardLoading: boolean;
  
  // Error states
  profileError: string | null;
  addressesError: string | null;
  panCardError: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<boolean>;
  
  fetchAddresses: () => Promise<void>;
  createAddress: (data: Omit<Address, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateAddress: (id: number, data: Partial<Address>) => Promise<boolean>;
  deleteAddress: (id: number) => Promise<boolean>;
  
  fetchPanCard: () => Promise<void>;
  updatePanCard: (data: Partial<PanCard>) => Promise<boolean>;
  
  // Utility actions
  clearErrors: () => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      addresses: [],
      panCard: null,
      
      profileLoading: false,
      addressesLoading: false,
      panCardLoading: false,
      
      profileError: null,
      addressesError: null,
      panCardError: null,

      // Profile actions
      fetchProfile: async () => {
        set({ profileLoading: true, profileError: null });
        try {
          const profile = await profileService.getProfile();
          set({ profile, profileLoading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to fetch profile';
          set({ profileError: errorMessage, profileLoading: false });
          console.error('Error fetching profile:', error);
        }
      },

      updateProfile: async (data: Partial<UserProfile>): Promise<boolean> => {
        set({ profileLoading: true, profileError: null });
        try {
          const updatedProfile = await profileService.updateProfile(data);
          set({ profile: updatedProfile, profileLoading: false });
          toast.success('Profile updated successfully');
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to update profile';
          set({ profileError: errorMessage, profileLoading: false });
          toast.error(errorMessage);
          console.error('Error updating profile:', error);
          return false;
        }
      },

      updateProfilePicture: async (file: File): Promise<boolean> => {
        set({ profileLoading: true, profileError: null });
        try {
          const formData = new FormData();
          formData.append('profile_picture', file);
          
          await profileService.updateProfilePicture(formData);
          
          // Refresh profile to get updated picture URLs
          await get().fetchProfile();
          
          toast.success('Profile picture updated successfully');
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to update profile picture';
          set({ profileError: errorMessage, profileLoading: false });
          toast.error(errorMessage);
          console.error('Error updating profile picture:', error);
          return false;
        }
      },

      // Address actions
      fetchAddresses: async () => {
        set({ addressesLoading: true, addressesError: null });
        try {
          const addresses = await profileService.getAddresses();
          set({ addresses, addressesLoading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to fetch addresses';
          set({ addressesError: errorMessage, addressesLoading: false });
          console.error('Error fetching addresses:', error);
        }
      },

      createAddress: async (data: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
        set({ addressesLoading: true, addressesError: null });
        try {
          const newAddress = await profileService.createAddress(data);
          const { addresses } = get();
          set({ 
            addresses: [...addresses, newAddress],
            addressesLoading: false 
          });
          toast.success('Address added successfully');
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to add address';
          set({ addressesError: errorMessage, addressesLoading: false });
          toast.error(errorMessage);
          console.error('Error creating address:', error);
          return false;
        }
      },

      updateAddress: async (id: number, data: Partial<Address>): Promise<boolean> => {
        set({ addressesLoading: true, addressesError: null });
        try {
          const updatedAddress = await profileService.updateAddress(id, data);
          const { addresses } = get();
          const updatedAddresses = addresses.map(addr => 
            addr.id === id ? updatedAddress : addr
          );
          set({ 
            addresses: updatedAddresses,
            addressesLoading: false 
          });
          toast.success('Address updated successfully');
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to update address';
          set({ addressesError: errorMessage, addressesLoading: false });
          toast.error(errorMessage);
          console.error('Error updating address:', error);
          return false;
        }
      },

      deleteAddress: async (id: number): Promise<boolean> => {
        set({ addressesLoading: true, addressesError: null });
        try {
          await profileService.deleteAddress(id);
          const { addresses } = get();
          const filteredAddresses = addresses.filter(addr => addr.id !== id);
          set({ 
            addresses: filteredAddresses,
            addressesLoading: false 
          });
          toast.success('Address deleted successfully');
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to delete address';
          set({ addressesError: errorMessage, addressesLoading: false });
          toast.error(errorMessage);
          console.error('Error deleting address:', error);
          return false;
        }
      },

      // PAN Card actions
      fetchPanCard: async () => {
        set({ panCardLoading: true, panCardError: null });
        try {
          const panCard = await profileService.getPanCard();
          set({ panCard, panCardLoading: false });
        } catch (error: any) {
          // Don't show error if PAN card doesn't exist yet
          if (error.response?.status !== 404) {
            const errorMessage = error.response?.data?.detail || 'Failed to fetch PAN card';
            set({ panCardError: errorMessage, panCardLoading: false });
            console.error('Error fetching PAN card:', error);
          } else {
            set({ panCardLoading: false });
          }
        }
      },

      updatePanCard: async (data: Partial<PanCard>): Promise<boolean> => {
        set({ panCardLoading: true, panCardError: null });
        try {
          const updatedPanCard = await profileService.updatePanCard(data);
          set({ panCard: updatedPanCard, panCardLoading: false });
          toast.success('PAN card updated successfully');
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to update PAN card';
          set({ panCardError: errorMessage, panCardLoading: false });
          toast.error(errorMessage);
          console.error('Error updating PAN card:', error);
          return false;
        }
      },

      // Utility actions
      clearErrors: () => {
        set({
          profileError: null,
          addressesError: null,
          panCardError: null,
        });
      },

      reset: () => {
        set({
          profile: null,
          addresses: [],
          panCard: null,
          profileLoading: false,
          addressesLoading: false,
          panCardLoading: false,
          profileError: null,
          addressesError: null,
          panCardError: null,
        });
      },
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({
        // Only persist essential data, not loading/error states
        profile: state.profile,
        addresses: state.addresses,
        panCard: state.panCard,
      }),
    }
  )
);
