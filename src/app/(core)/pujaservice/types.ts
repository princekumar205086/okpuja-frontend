export interface PujaCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface PujaService {
  id: number;
  title: string;
  image?: string;
  image_url?: string;
  image_thumbnail?: string;
  image_card?: string;
  description: string;
  category?: PujaCategory;
  category_detail?: PujaCategory;
  type: 'HOME' | 'TEMPLE' | 'ONLINE';
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  packages?: Package[];
}

export interface Package {
  id: number;
  puja_service?: number;
  puja_service_detail?: PujaService;
  location: string;
  language: 'HINDI' | 'ENGLISH' | 'SANSKRIT' | 'REGIONAL';
  package_type: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'CUSTOM';
  price: string;
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
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  contact_name: string;
  contact_number: string;
  contact_email: string;
  address: string;
  special_instructions: string;
  cancellation_reason: string;
  created_at: string;
  updated_at: string;
}

export interface PujaServiceFilters {
  category?: string;
  type?: string;
  search?: string;
  location?: string;
  language?: string;
  priceRange?: [number, number];
  sortBy?: 'title' | 'price' | 'duration' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
