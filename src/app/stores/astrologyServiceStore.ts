import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../apiService/globalApiconfig';
import toast from 'react-hot-toast';

export type AstrologyServiceType = 'HOROSCOPE' | 'MATCHING' | 'PREDICTION' | 'REMEDIES' | 'GEMSTONE' | 'VAASTU';

export interface AstrologyService {
  id: number;
  title: string;
  service_type: AstrologyServiceType;
  description: string;
  image_url?: string;
  image_thumbnail_url?: string;
  image_card_url?: string;
  price: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAstrologyServiceData {
  title: string;
  service_type: AstrologyServiceType;
  description: string;
  price: string;
  duration_minutes: number;
  is_active?: boolean;
  image?: File;
}

export interface UpdateAstrologyServiceData extends Partial<CreateAstrologyServiceData> {
  id: number;
}

export interface AstrologyServiceFilters {
  service_type?: AstrologyServiceType;
  is_active?: boolean;
  price_min?: number;
  price_max?: number;
  duration_min?: number;
  duration_max?: number;
}

export interface PaginationMeta {
  count: number;
  next: string | null;
  previous: string | null;
  page_size: number;
  current_page: number;
  total_pages: number;
}

export interface AstrologyServiceListResponse {
  results: AstrologyService[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface AstrologyServiceState {
  // Data
  services: AstrologyService[];
  
  // UI States
  loading: boolean;
  error: string | null;
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  viewMode: 'table' | 'card';
  selectedService: AstrologyService | null;
  
  // Drawer states
  drawerOpen: boolean;
  drawerMode: 'view' | 'edit' | 'create';
  
  // Filter states
  filters: AstrologyServiceFilters;
  
  // Sort states
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  // Actions
  fetchServices: (params?: { 
    page?: number; 
    search?: string; 
    filters?: AstrologyServiceFilters;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => Promise<void>;
  createService: (data: CreateAstrologyServiceData) => Promise<boolean>;
  updateService: (data: UpdateAstrologyServiceData) => Promise<boolean>;
  deleteService: (id: number) => Promise<boolean>;
  getServiceById: (id: number) => Promise<AstrologyService | null>;
  updateServiceImage: (id: number, image: File) => Promise<boolean>;
  toggleServiceStatus: (id: number) => Promise<boolean>;
  
  // UI Actions
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setViewMode: (mode: 'table' | 'card') => void;
  setSelectedService: (service: AstrologyService | null) => void;
  setFilters: (filters: Partial<AstrologyServiceFilters>) => void;
  clearFilters: () => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  
  // Drawer Actions
  openDrawer: (mode: 'view' | 'edit' | 'create', service?: AstrologyService) => void;
  closeDrawer: () => void;
  
  // Utility Actions
  clearError: () => void;
  resetState: () => void;
}

export const SERVICE_TYPE_OPTIONS = [
  { value: 'HOROSCOPE', label: 'Horoscope Analysis' },
  { value: 'MATCHING', label: 'Kundali Matching' },
  { value: 'PREDICTION', label: 'Future Prediction' },
  { value: 'REMEDIES', label: 'Astrological Remedies' },
  { value: 'GEMSTONE', label: 'Gemstone Recommendation' },
  { value: 'VAASTU', label: 'Vaastu Consultation' },
] as const;

export const useAstrologyServiceStore = create<AstrologyServiceState>()(
  persist(
    (set, get) => ({
      // Initial state
      services: [],
      loading: false,
      error: null,
      searchTerm: '',
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      viewMode: 'table',
      selectedService: null,
      drawerOpen: false,
      drawerMode: 'view',
      filters: {},
      sortBy: 'created_at',
      sortOrder: 'desc',

      // Services Actions
      fetchServices: async (params) => {
        set({ loading: true, error: null });
        try {
          const { 
            currentPage, 
            pageSize, 
            searchTerm, 
            filters, 
            sortBy, 
            sortOrder 
          } = get();
          
          const queryParams = new URLSearchParams();
          
          // Pagination
          queryParams.append('page', (params?.page || currentPage).toString());
          queryParams.append('page_size', pageSize.toString());
          
          // Search
          const search = params?.search !== undefined ? params.search : searchTerm;
          if (search) {
            queryParams.append('search', search);
          }
          
          // Filters
          const activeFilters = params?.filters || filters;
          if (activeFilters.service_type) {
            queryParams.append('service_type', activeFilters.service_type);
          }
          if (activeFilters.is_active !== undefined) {
            queryParams.append('is_active', activeFilters.is_active.toString());
          }
          if (activeFilters.price_min) {
            queryParams.append('price_min', activeFilters.price_min.toString());
          }
          if (activeFilters.price_max) {
            queryParams.append('price_max', activeFilters.price_max.toString());
          }
          if (activeFilters.duration_min) {
            queryParams.append('duration_min', activeFilters.duration_min.toString());
          }
          if (activeFilters.duration_max) {
            queryParams.append('duration_max', activeFilters.duration_max.toString());
          }
          
          // Sorting
          const activeSortBy = params?.sortBy || sortBy;
          const activeSortOrder = params?.sortOrder || sortOrder;
          const ordering = activeSortOrder === 'desc' ? `-${activeSortBy}` : activeSortBy;
          queryParams.append('ordering', ordering);

          const response = await apiClient.get<AstrologyService[] | AstrologyServiceListResponse>(
            `/astrology/services/?${queryParams}`
          );
          
          // Handle different response formats
          let services: AstrologyService[] = [];
          let totalCount = 0;
          
          if (Array.isArray(response.data)) {
            services = response.data;
            totalCount = response.data.length;
          } else {
            services = response.data.results;
            totalCount = response.data.count;
          }
          
          set({
            services,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: params?.page || currentPage,
            searchTerm: search,
            filters: activeFilters,
            sortBy: activeSortBy,
            sortOrder: activeSortOrder,
            loading: false,
          });
        } catch (err: any) {
          console.error("Fetch astrology services error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to fetch astrology services";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },

      createService: async (data: CreateAstrologyServiceData): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('title', data.title);
          formData.append('service_type', data.service_type);
          formData.append('description', data.description);
          formData.append('price', data.price);
          formData.append('duration_minutes', data.duration_minutes.toString());
          formData.append('is_active', (data.is_active ?? true).toString());
          
          if (data.image) {
            formData.append('image', data.image);
          }

          const response = await apiClient.post<AstrologyService>(
            '/astrology/services/create/', 
            formData, 
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          // Refresh services list
          const { fetchServices, currentPage } = get();
          await fetchServices({ page: 1 }); // Go to first page to see new service
          
          set({ loading: false });
          toast.success("Astrology service created successfully!");
          return true;
        } catch (err: any) {
          console.error("Create astrology service error:", err);
          let errorMessage = "Failed to create astrology service";
          
          if (err.response?.data) {
            if (typeof err.response.data === 'object') {
              const errors = err.response.data;
              if (errors.title) {
                errorMessage = `Title: ${errors.title[0] || errors.title}`;
              } else if (errors.service_type) {
                errorMessage = `Service Type: ${errors.service_type[0] || errors.service_type}`;
              } else if (errors.price) {
                errorMessage = `Price: ${errors.price[0] || errors.price}`;
              } else if (errors.detail || errors.message) {
                errorMessage = errors.detail || errors.message;
              }
            }
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      updateService: async (data: UpdateAstrologyServiceData): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          
          if (data.title) formData.append('title', data.title);
          if (data.service_type) formData.append('service_type', data.service_type);
          if (data.description) formData.append('description', data.description);
          if (data.price) formData.append('price', data.price);
          if (data.duration_minutes) formData.append('duration_minutes', data.duration_minutes.toString());
          if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());
          
          if (data.image) {
            formData.append('image', data.image);
          }

          await apiClient.put(`/astrology/services/${data.id}/update/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Refresh services list
          const { fetchServices, currentPage } = get();
          await fetchServices({ page: currentPage });
          
          set({ loading: false });
          toast.success("Astrology service updated successfully!");
          return true;
        } catch (err: any) {
          console.error("Update astrology service error:", err);
          let errorMessage = "Failed to update astrology service";
          
          if (err.response?.data) {
            if (typeof err.response.data === 'object') {
              const errors = err.response.data;
              if (errors.title) {
                errorMessage = `Title: ${errors.title[0] || errors.title}`;
              } else if (errors.detail || errors.message) {
                errorMessage = errors.detail || errors.message;
              }
            }
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      deleteService: async (id: number): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          await apiClient.delete(`/astrology/services/${id}/delete/`);

          // Refresh services list
          const { fetchServices, currentPage } = get();
          await fetchServices({ page: currentPage });
          
          set({ loading: false });
          toast.success("Astrology service deleted successfully!");
          return true;
        } catch (err: any) {
          console.error("Delete astrology service error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to delete astrology service";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      getServiceById: async (id: number): Promise<AstrologyService | null> => {
        try {
          const response = await apiClient.get<AstrologyService>(`/astrology/services/${id}/`);
          return response.data;
        } catch (err: any) {
          console.error("Get astrology service error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to fetch astrology service";
          toast.error(errorMessage);
          return null;
        }
      },

      updateServiceImage: async (id: number, image: File): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('image', image);

          await apiClient.patch(`/astrology/services/${id}/image/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Refresh services list
          const { fetchServices, currentPage } = get();
          await fetchServices({ page: currentPage });
          
          set({ loading: false });
          toast.success("Service image updated successfully!");
          return true;
        } catch (err: any) {
          console.error("Update service image error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to update service image";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      toggleServiceStatus: async (id: number): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const service = get().services.find(s => s.id === id);
          if (!service) {
            throw new Error("Service not found");
          }

          const formData = new FormData();
          formData.append('is_active', (!service.is_active).toString());

          await apiClient.patch(`/astrology/services/${id}/update/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Refresh services list
          const { fetchServices, currentPage } = get();
          await fetchServices({ page: currentPage });
          
          set({ loading: false });
          toast.success(`Service ${service.is_active ? 'deactivated' : 'activated'} successfully!`);
          return true;
        } catch (err: any) {
          console.error("Toggle service status error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to update service status";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      // UI Actions
      setSearchTerm: (term: string) => set({ searchTerm: term }),
      setCurrentPage: (page: number) => set({ currentPage: page }),
      setPageSize: (size: number) => set({ pageSize: size, currentPage: 1 }),
      setViewMode: (mode: 'table' | 'card') => set({ viewMode: mode }),
      setSelectedService: (service: AstrologyService | null) => set({ selectedService: service }),
      setFilters: (newFilters: Partial<AstrologyServiceFilters>) => 
        set({ filters: { ...get().filters, ...newFilters }, currentPage: 1 }),
      clearFilters: () => set({ filters: {}, currentPage: 1 }),
      setSortBy: (sortBy: string) => set({ sortBy, currentPage: 1 }),
      setSortOrder: (order: 'asc' | 'desc') => set({ sortOrder: order, currentPage: 1 }),

      // Drawer Actions
      openDrawer: (mode: 'view' | 'edit' | 'create', service?: AstrologyService) => {
        set({ 
          drawerOpen: true, 
          drawerMode: mode, 
          selectedService: service || null 
        });
      },
      closeDrawer: () => {
        set({ 
          drawerOpen: false, 
          drawerMode: 'view', 
          selectedService: null 
        });
      },

      // Utility Actions
      clearError: () => set({ error: null }),
      resetState: () => set({
        services: [],
        loading: false,
        error: null,
        searchTerm: '',
        currentPage: 1,
        totalCount: 0,
        totalPages: 0,
        selectedService: null,
        drawerOpen: false,
        drawerMode: 'view',
        filters: {},
        sortBy: 'created_at',
        sortOrder: 'desc',
      }),
    }),
    {
      name: 'astrology-service-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        pageSize: state.pageSize,
        filters: state.filters,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);
