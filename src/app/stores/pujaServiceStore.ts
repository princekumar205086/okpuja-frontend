import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../apiService/globalApiconfig";
import { toast } from "react-hot-toast";

export type ServiceType = 'HOME' | 'TEMPLE' | 'ONLINE';
export type Language = 'HINDI' | 'ENGLISH' | 'SANSKRIT' | 'REGIONAL';
export type PackageType = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'CUSTOM';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';

export interface PujaCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface PujaService {
  id: number;
  title: string;
  image?: File | null;
  image_url?: string;
  description: string;
  category: number;
  category_detail?: PujaCategory;
  type: ServiceType;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: number;
  puja_service: PujaService;
  location: string;
  language: Language;
  package_type: PackageType;
  price: number;
  description: string;
  includes_materials: boolean;
  priest_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PujaBooking {
  id: number;
  user?: number;
  puja_service: PujaService;
  package: Package;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  contact_name: string;
  contact_number: string;
  contact_email: string;
  address: string;
  special_instructions?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePujaServiceData {
  title: string;
  image?: File;
  description: string;
  category: number;
  type: ServiceType;
  duration_minutes: number;
  is_active: boolean;
}

export interface UpdatePujaServiceData extends Partial<CreatePujaServiceData> {
  id: number;
}

export interface PaginationMeta {
  count: number;
  next: string | null;
  previous: string | null;
  page_size: number;
  current_page: number;
  total_pages: number;
}

export interface PujaServiceListResponse {
  results: PujaService[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface PujaServiceState {
  // Data
  services: PujaService[];
  categories: PujaCategory[];
  packages: Package[];
  bookings: PujaBooking[];
  
  // UI States
  loading: boolean;
  error: string | null;
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  viewMode: 'table' | 'card';
  selectedService: PujaService | null;
  
  // Filter states
  filters: {
    category?: number;
    type?: ServiceType;
    location?: string;
    language?: Language;
    is_active?: boolean;
    date_from?: string;
    date_to?: string;
    sortBy?: 'title' | 'price' | 'duration' | 'created_at';
    sortOrder?: 'asc' | 'desc';
  };
  
  // Actions
  // Services
  fetchServices: (params?: { 
    page?: number; 
    search?: string; 
    category?: number; 
    type?: ServiceType; 
    location?: string;
    language?: Language;
    is_active?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) => Promise<void>;
  createService: (data: CreatePujaServiceData) => Promise<boolean>;
  updateService: (data: UpdatePujaServiceData) => Promise<boolean>;
  deleteService: (id: number) => Promise<boolean>;
  getServiceById: (id: number) => Promise<PujaService | null>;
  
  // Categories
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<boolean>;
  updateCategory: (id: number, name: string) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  
  // Packages
  fetchPackages: (serviceId?: number) => Promise<void>;
  createPackage: (data: any) => Promise<boolean>;
  updatePackage: (id: number, data: any) => Promise<boolean>;
  deletePackage: (id: number) => Promise<boolean>;
  
  // Bookings
  fetchBookings: (params?: { page?: number; search?: string; status?: BookingStatus }) => Promise<void>;
  updateBookingStatus: (id: number, status: BookingStatus, reason?: string) => Promise<boolean>;
  
  // UI Actions
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setViewMode: (mode: 'table' | 'card') => void;
  setSelectedService: (service: PujaService | null) => void;
  setFilters: (filters: any) => void;
  clearError: () => void;
  resetState: () => void;
}

export const usePujaServiceStore = create<PujaServiceState>()(
  persist(
    (set, get) => ({
      // Initial state
      services: [],
      categories: [],
      packages: [],
      bookings: [],
      loading: false,
      error: null,
      searchTerm: '',
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      viewMode: 'table',
      selectedService: null,
      filters: {},

      // Services Actions
      fetchServices: async (params) => {
        set({ loading: true, error: null });
        try {
          const queryParams = new URLSearchParams();
          
          if (params?.page) queryParams.append('page', params.page.toString());
          if (params?.search) queryParams.append('search', params.search);
          if (params?.category) queryParams.append('category', params.category.toString());
          if (params?.type) queryParams.append('type', params.type);
          if (params?.location) queryParams.append('location', params.location);
          if (params?.language) queryParams.append('language', params.language);
          if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
          if (params?.sortBy) queryParams.append('ordering', params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy);
          
          const { pageSize } = get();
          queryParams.append('page_size', pageSize.toString());

          const response = await apiClient.get<PujaService[] | PujaServiceListResponse>(`/puja/services/?${queryParams}`);
          
          // Handle different response formats
          let services: PujaService[] = [];
          let totalCount = 0;
          
          if (Array.isArray(response.data)) {
            // Direct array response (current API format)
            services = response.data;
            totalCount = response.data.length;
          } else {
            // Paginated response format
            services = response.data.results;
            totalCount = response.data.count;
          }
          
          set({
            services,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: params?.page || 1,
            loading: false,
          });
        } catch (err: any) {
          console.error("Fetch services error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to fetch services";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },

      createService: async (data: CreatePujaServiceData): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('title', data.title);
          formData.append('description', data.description);
          formData.append('category', data.category.toString());
          formData.append('type', data.type);
          formData.append('duration_minutes', data.duration_minutes.toString());
          formData.append('is_active', data.is_active.toString());
          
          if (data.image) {
            formData.append('image', data.image);
          }

          const response = await apiClient.post<PujaService>('/puja/services/create/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Refresh services list
          const { fetchServices, currentPage } = get();
          await fetchServices({ page: currentPage });
          
          set({ loading: false });
          toast.success("Service created successfully!");
          return true;
        } catch (err: any) {
          console.error("Create service error:", err);
          let errorMessage = "Failed to create service";
          
          if (err.response?.data) {
            if (typeof err.response.data === 'object') {
              const errors = err.response.data;
              if (errors.title) errorMessage = `Title: ${errors.title[0] || errors.title}`;
              else if (errors.image) errorMessage = `Image: ${errors.image[0] || errors.image}`;
              else if (errors.detail) errorMessage = errors.detail;
            }
          }
          
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      updateService: async (data: UpdatePujaServiceData): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          
          if (data.title) formData.append('title', data.title);
          if (data.description) formData.append('description', data.description);
          if (data.category) formData.append('category', data.category.toString());
          if (data.type) formData.append('type', data.type);
          if (data.duration_minutes) formData.append('duration_minutes', data.duration_minutes.toString());
          if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());
          
          if (data.image) {
            formData.append('image', data.image);
          }

          await apiClient.patch(`/puja/services/${data.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Refresh services list
          const { fetchServices, currentPage } = get();
          await fetchServices({ page: currentPage });
          
          set({ loading: false });
          toast.success("Service updated successfully!");
          return true;
        } catch (err: any) {
          console.error("Update service error:", err);
          let errorMessage = "Failed to update service";
          
          if (err.response?.data) {
            if (typeof err.response.data === 'object') {
              const errors = err.response.data;
              if (errors.title) errorMessage = `Title: ${errors.title[0] || errors.title}`;
              else if (errors.image) errorMessage = `Image: ${errors.image[0] || errors.image}`;
              else if (errors.detail) errorMessage = errors.detail;
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
          await apiClient.delete(`/puja/services/${id}/`);
          
          // Refresh services list
          const { fetchServices, currentPage } = get();
          await fetchServices({ page: currentPage });
          
          set({ loading: false });
          toast.success("Service deleted successfully!");
          return true;
        } catch (err: any) {
          console.error("Delete service error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to delete service";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      getServiceById: async (id: number): Promise<PujaService | null> => {
        try {
          const response = await apiClient.get<PujaService>(`/puja/services/${id}/`);
          return response.data;
        } catch (err: any) {
          console.error("Get service by ID error:", err);
          return null;
        }
      },

      // Categories Actions
      fetchCategories: async () => {
        try {
          const response = await apiClient.get<PujaCategory[] | { results: PujaCategory[] }>('/puja/categories/');
          
          // Handle different response formats
          let categories: PujaCategory[] = [];
          if (Array.isArray(response.data)) {
            categories = response.data;
          } else {
            categories = response.data.results || [];
          }
          
          set({ categories });
        } catch (err: any) {
          console.error("Fetch categories error:", err);
          toast.error("Failed to fetch categories");
        }
      },

      createCategory: async (name: string): Promise<boolean> => {
        try {
          await apiClient.post('/puja/categories/create/', { name });
          const { fetchCategories } = get();
          await fetchCategories();
          toast.success("Category created successfully!");
          return true;
        } catch (err: any) {
          console.error("Create category error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to create category";
          toast.error(errorMessage);
          return false;
        }
      },

      updateCategory: async (id: number, name: string): Promise<boolean> => {
        try {
          await apiClient.patch(`/puja/categories/${id}/`, { name });
          const { fetchCategories } = get();
          await fetchCategories();
          toast.success("Category updated successfully!");
          return true;
        } catch (err: any) {
          console.error("Update category error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to update category";
          toast.error(errorMessage);
          return false;
        }
      },

      deleteCategory: async (id: number): Promise<boolean> => {
        try {
          await apiClient.delete(`/puja/categories/${id}/`);
          const { fetchCategories } = get();
          await fetchCategories();
          toast.success("Category deleted successfully!");
          return true;
        } catch (err: any) {
          console.error("Delete category error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to delete category";
          toast.error(errorMessage);
          return false;
        }
      },

      // Packages Actions
      fetchPackages: async (serviceId) => {
        try {
          const url = serviceId ? `/puja/packages/?puja_service=${serviceId}` : '/puja/packages/';
          const response = await apiClient.get<{ results: Package[] }>(url);
          set({ packages: response.data.results || response.data });
        } catch (err: any) {
          console.error("Fetch packages error:", err);
          toast.error("Failed to fetch packages");
        }
      },

      createPackage: async (data: any): Promise<boolean> => {
        try {
          await apiClient.post('/puja/packages/create/', data);
          const { fetchPackages } = get();
          // Re-fetch packages for the specific service to maintain filtering
          await fetchPackages(data.puja_service);
          toast.success("Package created successfully!");
          return true;
        } catch (err: any) {
          console.error("Create package error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to create package";
          toast.error(errorMessage);
          return false;
        }
      },

      updatePackage: async (id: number, data: any): Promise<boolean> => {
        try {
          await apiClient.patch(`/puja/packages/${id}/`, data);
          const { fetchPackages } = get();
          // Re-fetch packages for the specific service to maintain filtering
          await fetchPackages(data.puja_service);
          toast.success("Package updated successfully!");
          return true;
        } catch (err: any) {
          console.error("Update package error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to update package";
          toast.error(errorMessage);
          return false;
        }
      },

      deletePackage: async (id: number): Promise<boolean> => {
        try {
          // Get the current package to find its service ID before deletion
          const { packages } = get();
          const packageToDelete = packages.find(pkg => pkg.id === id);
          // Ensure serviceId is always a number
          const serviceId = typeof packageToDelete?.puja_service === 'number'
            ? packageToDelete?.puja_service
            : packageToDelete?.puja_service?.id;
          
          await apiClient.delete(`/puja/packages/${id}/`);
          const { fetchPackages } = get();
          // Re-fetch packages for the specific service to maintain filtering
          if (typeof serviceId === 'number') {
            await fetchPackages(serviceId);
          } else {
            await fetchPackages();
          }
          toast.success("Package deleted successfully!");
          return true;
        } catch (err: any) {
          console.error("Delete package error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to delete package";
          toast.error(errorMessage);
          return false;
        }
      },

      // Bookings Actions
      fetchBookings: async (params) => {
        try {
          const queryParams = new URLSearchParams();
          if (params?.page) queryParams.append('page', params.page.toString());
          if (params?.search) queryParams.append('search', params.search);
          if (params?.status) queryParams.append('status', params.status);

          const response = await apiClient.get<{ results: PujaBooking[] }>(`/puja/bookings/?${queryParams}`);
          set({ bookings: response.data.results || response.data });
        } catch (err: any) {
          console.error("Fetch bookings error:", err);
          toast.error("Failed to fetch bookings");
        }
      },

      updateBookingStatus: async (id: number, status: BookingStatus, reason?: string): Promise<boolean> => {
        try {
          const data: any = { status };
          if (reason) data.cancellation_reason = reason;
          
          await apiClient.patch(`/puja/bookings/${id}/`, data);
          const { fetchBookings } = get();
          await fetchBookings();
          toast.success("Booking status updated successfully!");
          return true;
        } catch (err: any) {
          console.error("Update booking status error:", err);
          const errorMessage = err.response?.data?.detail || "Failed to update booking status";
          toast.error(errorMessage);
          return false;
        }
      },

      // UI Actions
      setSearchTerm: (term: string) => set({ searchTerm: term }),
      setCurrentPage: (page: number) => set({ currentPage: page }),
      setPageSize: (size: number) => set({ pageSize: size }),
      setViewMode: (mode: 'table' | 'card') => set({ viewMode: mode }),
      setSelectedService: (service: PujaService | null) => set({ selectedService: service }),
      setFilters: (filters: any) => set({ filters: { ...get().filters, ...filters } }),
      clearError: () => set({ error: null }),
      resetState: () => set({
        services: [],
        categories: [],
        packages: [],
        bookings: [],
        loading: false,
        error: null,
        searchTerm: '',
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        selectedService: null,
        filters: {},
      }),
    }),
    {
      name: 'puja-service-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        pageSize: state.pageSize,
        filters: state.filters,
      }),
    }
  )
);
