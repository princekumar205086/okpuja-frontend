import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import apiClient from '../apiService/globalApiconfig';
import type { 
  GalleryCategory, 
  GalleryItem, 
  GalleryItemFormData, 
  GalleryUploadData,
  GalleryFilters,
  PaginatedResponse 
} from '@/types/gallery';

export type { GalleryCategory, GalleryItem, GalleryItemFormData, GalleryUploadData };

type GalleryState = {
  // Gallery Items
  items: GalleryItem[];
  selectedItems: Set<number>;
  currentItem: GalleryItem | null;
  
  // Categories
  categories: GalleryCategory[];
  
  // Loading states
  loading: boolean;
  uploading: boolean;
  itemsLoading: boolean;
  categoriesLoading: boolean;
  
  // Error handling
  error: string | null;
  lastError: Date | null;
  failureCount: number;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  
  // Filters
  filters: GalleryFilters;
  
  // Sort
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  // Actions
  fetchItems: (page?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchItemById: (id: number) => Promise<GalleryItem | null>;
  uploadItems: (data: GalleryUploadData) => Promise<boolean>;
  updateItem: (id: number, data: Partial<GalleryItemFormData>) => Promise<boolean>;
  deleteItem: (id: number) => Promise<boolean>;
  deleteMultipleItems: (ids: number[]) => Promise<boolean>;
  
  // Category management
  createCategory: (data: { name: string; description?: string; slug: string }) => Promise<boolean>;
  updateCategory: (id: number, data: { name: string; description?: string; slug: string }) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  
  // Selection and UI
  toggleItemSelection: (id: number) => void;
  selectAllItems: () => void;
  clearSelection: () => void;
  setFilters: (filters: Partial<GalleryFilters>) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
  reset: () => void;
};

export const useGalleryStore = create<GalleryState>((set, get) => ({
  // Initial state
  items: [],
  selectedItems: new Set(),
  currentItem: null,
  categories: [],
  loading: false,
  uploading: false,
  itemsLoading: false,
  categoriesLoading: false,
  error: null,
  lastError: null,
  failureCount: 0,
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  pageSize: 20,
  filters: {},
  sortBy: 'created_at',
  sortOrder: 'desc',

  // Fetch gallery items
  fetchItems: async (page = 1) => {
    const state = get();
    
    // Circuit breaker: if we've had recent failures, wait before retrying
    if (state.failureCount >= 3 && state.lastError) {
      const timeSinceLastError = Date.now() - state.lastError.getTime();
      if (timeSinceLastError < 30000) { // Wait 30 seconds after 3 failures
        console.log('Circuit breaker: Too many recent failures, skipping request');
        return;
      }
    }

    set({ itemsLoading: true, error: null });
    try {
      const { filters, sortBy, sortOrder, pageSize } = get();
      
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ordering: sortOrder === 'desc' ? `-${sortBy}` : sortBy,
      });
      
      // Add filters
      if (filters.category) params.append('category', filters.category.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.is_featured !== undefined) params.append('is_featured', filters.is_featured.toString());
      if (filters.search) params.append('search', filters.search);

      const response = await apiClient.get(`/gallery/admin/items/?${params}`);
      
      set({
        items: response.data.results || response.data,
        currentPage: page,
        totalPages: response.data.total_pages || Math.ceil((response.data.count || response.data.length) / pageSize),
        totalItems: response.data.count || response.data.length,
        itemsLoading: false,
        selectedItems: new Set(), // Clear selection on new fetch
        failureCount: 0, // Reset failure count on success
        lastError: null,
      });
    } catch (error: any) {
      console.error('Error fetching gallery items:', error);
      let errorMessage = 'Failed to fetch gallery items';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please login again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to access gallery items.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      set(state => ({
        error: error.response?.data?.detail || errorMessage,
        itemsLoading: false,
        failureCount: state.failureCount + 1,
        lastError: new Date(),
      }));
      
      // Only show toast for first few failures to prevent spam
      if (get().failureCount <= 2) {
        toast.error(errorMessage);
      }
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    const state = get();
    
    // Circuit breaker: if we've had recent failures, wait before retrying
    if (state.failureCount >= 3 && state.lastError) {
      const timeSinceLastError = Date.now() - state.lastError.getTime();
      if (timeSinceLastError < 30000) { // Wait 30 seconds after 3 failures
        console.log('Circuit breaker: Too many recent failures, loading from localStorage');
        // Load from localStorage as fallback
        const localCategories = JSON.parse(localStorage.getItem('gallery_categories') || '[]');
        set({ categories: localCategories, categoriesLoading: false });
        return;
      }
    }

    set({ categoriesLoading: true, error: null });
    try {
      const response = await apiClient.get('/gallery/categories/');
      const categories = response.data.results || response.data;
      
      // Also save to localStorage for offline access
      localStorage.setItem('gallery_categories', JSON.stringify(categories));
      
      set({
        categories,
        categoriesLoading: false,
        failureCount: 0, // Reset failure count on success
        lastError: null,
      });
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      
      // Load from localStorage as fallback
      const localCategories = JSON.parse(localStorage.getItem('gallery_categories') || '[]');
      
      if (localCategories.length > 0) {
        console.log('Loading categories from localStorage (API unavailable)');
        set({
          categories: localCategories,
          categoriesLoading: false,
          failureCount: 0, // Don't count as failure if we have local data
        });
      } else {
        // Create default categories if none exist
        const defaultCategories = [
          {
            id: 1,
            title: 'Durga Puja',
            slug: 'durga-puja',
            description: 'Beautiful moments from Durga Puja celebrations',
            status: 'ACTIVE' as const,
            position: 1,
            item_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: 'Kali Puja',
            slug: 'kali-puja',
            description: 'Sacred Kali Puja ceremonies and rituals',
            status: 'ACTIVE' as const,
            position: 2,
            item_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 3,
            title: 'Saraswati Puja',
            slug: 'saraswati-puja',
            description: 'Goddess Saraswati worship and celebrations',
            status: 'ACTIVE' as const,
            position: 3,
            item_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ];
        
        localStorage.setItem('gallery_categories', JSON.stringify(defaultCategories));
        console.log('Created default categories (API unavailable)');
        
        let errorMessage = 'Failed to fetch categories';
        
        if (error.response?.status === 401) {
          errorMessage = 'Authentication required. Please login again.';
        } else if (error.response?.status === 403) {
          errorMessage = 'You do not have permission to access categories.';
        } else if (error.response?.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (!error.response) {
          errorMessage = 'Network error. Please check your connection.';
        }
        
        set(state => ({
          categories: defaultCategories,
          error: error.response?.data?.detail || errorMessage,
          categoriesLoading: false,
          failureCount: state.failureCount + 1,
          lastError: new Date(),
        }));
        
        // Only show toast for first few failures to prevent spam
        if (get().failureCount <= 2) {
          toast.error(errorMessage);
        }
      }
    }
  },

  // Fetch single item
  fetchItemById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/gallery/admin/items/${id}/`);
      const item = response.data;
      set({
        currentItem: item,
        loading: false,
      });
      return item;
    } catch (error: any) {
      console.error('Error fetching gallery item:', error);
      set({
        error: error.response?.data?.detail || 'Failed to fetch gallery item',
        loading: false,
      });
      toast.error('Failed to fetch gallery item');
      return null;
    }
  },

  // Upload new items
  uploadItems: async (data: GalleryUploadData) => {
    set({ uploading: true, error: null });
    try {
      const formData = new FormData();
      
      // Add files
      data.files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      
      // Add other data
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      formData.append('category_id', data.category_id.toString());
      formData.append('is_featured', data.is_featured.toString());
      formData.append('status', data.status);
      if (data.taken_at) formData.append('taken_at', data.taken_at);

      await apiClient.post('/gallery/admin/items/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set({ uploading: false });
      toast.success('Gallery items uploaded successfully');
      
      // Refresh items list
      get().fetchItems(get().currentPage);
      return true;
    } catch (error: any) {
      console.error('Error uploading gallery items:', error);
      set({
        error: error.response?.data?.detail || 'Failed to upload gallery items',
        uploading: false,
      });
      toast.error('Failed to upload gallery items');
      return false;
    }
  },

  // Update item
  updateItem: async (id: number, data: Partial<GalleryItemFormData>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.patch(`/gallery/admin/items/${id}/`, data);
      
      // Update item in the list
      set(state => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, ...response.data } : item
        ),
        currentItem: state.currentItem?.id === id ? { ...state.currentItem, ...response.data } : state.currentItem,
        loading: false,
      }));
      
      toast.success('Gallery item updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating gallery item:', error);
      set({
        error: error.response?.data?.detail || 'Failed to update gallery item',
        loading: false,
      });
      toast.error('Failed to update gallery item');
      return false;
    }
  },

  // Delete single item
  deleteItem: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/gallery/admin/items/${id}/`);
      
      set(state => ({
        items: state.items.filter(item => item.id !== id),
        selectedItems: new Set([...state.selectedItems].filter(itemId => itemId !== id)),
        totalItems: state.totalItems - 1,
        loading: false,
      }));
      
      toast.success('Gallery item deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      set({
        error: error.response?.data?.detail || 'Failed to delete gallery item',
        loading: false,
      });
      toast.error('Failed to delete gallery item');
      return false;
    }
  },

  // Delete multiple items
  deleteMultipleItems: async (ids: number[]) => {
    set({ loading: true, error: null });
    try {
      // Delete items one by one (if bulk delete endpoint not available)
      await Promise.all(ids.map(id => apiClient.delete(`/gallery/admin/items/${id}/`)));
      
      set(state => ({
        items: state.items.filter(item => !ids.includes(item.id)),
        selectedItems: new Set(),
        totalItems: state.totalItems - ids.length,
        loading: false,
      }));
      
      toast.success(`${ids.length} gallery items deleted successfully`);
      return true;
    } catch (error: any) {
      console.error('Error deleting gallery items:', error);
      set({
        error: error.response?.data?.detail || 'Failed to delete gallery items',
        loading: false,
      });
      toast.error('Failed to delete gallery items');
      return false;
    }
  },

  // Category Management Functions
  createCategory: async (data: { name: string; description?: string; slug: string }) => {
    set({ loading: true, error: null });
    try {
      // Try API first, fall back to local storage
      let newCategory: GalleryCategory;
      
      try {
        const apiData = {
          title: data.name, // Convert name to title for API
          description: data.description || '',
          slug: data.slug,
          status: 'ACTIVE' as const,
          position: 0,
        };
        const response = await apiClient.post('/gallery/categories/', apiData);
        newCategory = response.data;
      } catch (apiError) {
        // Fallback to local storage
        const localCategories = JSON.parse(localStorage.getItem('gallery_categories') || '[]');
        const maxId = localCategories.length > 0 ? Math.max(...localCategories.map((c: any) => c.id)) : 0;
        
        newCategory = {
          id: maxId + 1,
          title: data.name, // Use title field as per type definition
          description: data.description || '',
          slug: data.slug,
          status: 'ACTIVE' as const,
          position: 0,
          item_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        localCategories.push(newCategory);
        localStorage.setItem('gallery_categories', JSON.stringify(localCategories));
        
        console.log('Category created locally (API unavailable)');
      }
      
      set(state => ({
        categories: [...state.categories, newCategory],
        loading: false,
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error creating category:', error);
      set({
        error: error.response?.data?.detail || 'Failed to create category',
        loading: false,
      });
      return false;
    }
  },

  updateCategory: async (id: number, data: { name: string; description?: string; slug: string }) => {
    set({ loading: true, error: null });
    try {
      let updatedCategory: GalleryCategory;
      
      try {
        const apiData = {
          title: data.name, // Convert name to title for API
          description: data.description || '',
          slug: data.slug,
        };
        const response = await apiClient.patch(`/gallery/categories/${id}/`, apiData);
        updatedCategory = response.data;
      } catch (apiError) {
        // Fallback to local storage
        const localCategories = JSON.parse(localStorage.getItem('gallery_categories') || '[]');
        const categoryIndex = localCategories.findIndex((c: any) => c.id === id);
        
        if (categoryIndex === -1) {
          throw new Error('Category not found');
        }
        
        updatedCategory = {
          ...localCategories[categoryIndex],
          title: data.name, // Use title field
          description: data.description || '',
          slug: data.slug,
          updated_at: new Date().toISOString(),
        };
        
        localCategories[categoryIndex] = updatedCategory;
        localStorage.setItem('gallery_categories', JSON.stringify(localCategories));
        
        console.log('Category updated locally (API unavailable)');
      }
      
      set(state => ({
        categories: state.categories.map(cat => 
          cat.id === id ? updatedCategory : cat
        ),
        loading: false,
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error updating category:', error);
      set({
        error: error.response?.data?.detail || 'Failed to update category',
        loading: false,
      });
      return false;
    }
  },

  deleteCategory: async (id: number) => {
    set({ loading: true, error: null });
    try {
      try {
        await apiClient.delete(`/gallery/categories/${id}/`);
      } catch (apiError) {
        // Fallback to local storage
        const localCategories = JSON.parse(localStorage.getItem('gallery_categories') || '[]');
        const filteredCategories = localCategories.filter((c: any) => c.id !== id);
        localStorage.setItem('gallery_categories', JSON.stringify(filteredCategories));
        
        console.log('Category deleted locally (API unavailable)');
      }
      
      set(state => ({
        categories: state.categories.filter(cat => cat.id !== id),
        loading: false,
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting category:', error);
      set({
        error: error.response?.data?.detail || 'Failed to delete category',
        loading: false,
      });
      return false;
    }
  },

  // Selection actions
  toggleItemSelection: (id: number) => {
    set(state => {
      const newSelection = new Set(state.selectedItems);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return { selectedItems: newSelection };
    });
  },

  selectAllItems: () => {
    set(state => ({
      selectedItems: new Set(state.items.map(item => item.id))
    }));
  },

  clearSelection: () => {
    set({ selectedItems: new Set() });
  },

  // Filter and sort actions
  setFilters: (filters: Partial<GalleryFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
      currentPage: 1, // Reset to first page when filtering
    }));
    // Note: fetchItems needs to be called manually after setFilters
  },

  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => {
    set({ sortBy, sortOrder, currentPage: 1 });
    // Note: fetchItems needs to be called manually after setSorting
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    get().fetchItems(page);
  },

  // Utility actions
  clearError: () => set({ error: null }),

  reset: () => set({
    items: [],
    selectedItems: new Set(),
    currentItem: null,
    categories: [],
    loading: false,
    uploading: false,
    itemsLoading: false,
    categoriesLoading: false,
    error: null,
    lastError: null,
    failureCount: 0,
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    filters: {},
    sortBy: 'created_at',
    sortOrder: 'desc',
  }),
}));