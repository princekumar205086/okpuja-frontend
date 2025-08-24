// Gallery related types
export interface GalleryCategory {
  id: number;
  title: string;
  slug: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  position: number;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  category: GalleryCategory;
  thumbnail_url: string;
  medium_url: string;
  large_url: string;
  web_url: string;
  original_url: string;
  popularity: number;
  is_featured: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  taken_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryItemFormData {
  title: string;
  description?: string;
  category_id: number;
  is_featured: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  taken_at?: string;
}

export interface GalleryUploadData {
  files: File[];
  title: string;
  description?: string;
  category_id: number;
  is_featured: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  taken_at?: string;
}

export interface GalleryFilters {
  category?: number;
  status?: string;
  is_featured?: boolean;
  search?: string;
}

// API Response types
export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
  total_pages?: number;
}

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}