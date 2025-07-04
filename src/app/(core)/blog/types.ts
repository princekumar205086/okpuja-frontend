export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  avatar?: string;
  bio?: string;
  created_at: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  created_at: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  author: User;
  category: BlogCategory;
  tags: BlogTag[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  reading_time?: number;
  meta_title?: string;
  meta_description?: string;
}

export interface BlogComment {
  id: number;
  post: number;
  author: User;
  content: string;
  parent?: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogLike {
  id: number;
  post: number;
  user: number;
  created_at: string;
}

export interface BlogView {
  id: number;
  post: number;
  user?: number;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface BlogFilters {
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  featured?: boolean;
  sortBy?: 'newest' | 'oldest' | 'most_viewed' | 'most_liked';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
