import type { User } from "./user";

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  meta_title: string | null;
  meta_keywords: string | null;
  meta_description: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  created_at: string;
  updated_at: string;
}

export interface BlogPostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: User;
  category: BlogCategory | null;
  tags: BlogTag[];
  featured_image_thumbnail_url: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface BlogPost extends BlogPostListItem {
  content: string;
  youtube_url: string | null;
}

export interface BlogComment {
  id: number;
  user: User;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  replies: BlogComment[];
}

export interface CreateBlogPostRequest {
  title: string;
  content: string;
  excerpt?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  is_featured?: boolean;
  category?: number;
  tags?: number[];
}

export interface BlogPostListParams {
  search?: string;
  category?: number;
  tags?: number;
  status?: string;
  is_featured?: boolean;
  ordering?: string;
  page?: number;
}
