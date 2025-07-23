import { create } from 'zustand';
import apiClient from '../apiService/globalApiconfig';
import toast from 'react-hot-toast';

// Types
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  phone?: string;
  role: string;
  account_status: string;
  is_active: boolean;
  date_joined: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: User;
  category: BlogCategory;
  tags: BlogTag[];
  featured_image_thumbnail_url?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  youtube_url?: string;
}

export interface BlogComment {
  id: number;
  user: User;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  replies: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  category: number;
  tags?: number[];
  featured_image?: File;
  status: 'DRAFT' | 'PUBLISHED';
  is_featured?: boolean;
  youtube_url?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface CreateTagData {
  name: string;
  description?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

interface BlogStore {
  // State
  posts: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
  comments: BlogComment[];
  selectedPost: BlogPost | null;
  selectedCategory: BlogCategory | null;
  selectedTag: BlogTag | null;
  loading: boolean;
  error: string | null;

  // Pagination
  postsPage: number;
  postsHasNext: boolean;
  totalPosts: number;

  // Actions
  fetchPosts: (page?: number, search?: string, category?: string, status?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;
  fetchComments: (postSlug: string) => Promise<void>;
  
  // Post management
  createPost: (data: CreatePostData) => Promise<boolean>;
  updatePost: (slug: string, data: Partial<CreatePostData>) => Promise<boolean>;
  deletePost: (slug: string) => Promise<boolean>;
  getPost: (slug: string) => Promise<void>;
  
  // Category management
  createCategory: (data: CreateCategoryData) => Promise<boolean>;
  updateCategory: (slug: string, data: Partial<CreateCategoryData>) => Promise<boolean>;
  deleteCategory: (slug: string) => Promise<boolean>;
  
  // Tag management
  createTag: (data: CreateTagData) => Promise<boolean>;
  updateTag: (slug: string, data: Partial<CreateTagData>) => Promise<boolean>;
  deleteTag: (slug: string) => Promise<boolean>;
  
  // Comment management
  updateComment: (id: number, data: { content?: string; is_approved?: boolean }) => Promise<boolean>;
  deleteComment: (id: number) => Promise<boolean>;
  
  // Utility
  clearError: () => void;
  setSelectedPost: (post: BlogPost | null) => void;
  setSelectedCategory: (category: BlogCategory | null) => void;
  setSelectedTag: (tag: BlogTag | null) => void;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  // Initial state
  posts: [],
  categories: [],
  tags: [],
  comments: [],
  selectedPost: null,
  selectedCategory: null,
  selectedTag: null,
  loading: false,
  error: null,
  postsPage: 1,
  postsHasNext: false,
  totalPosts: 0,

  // Fetch posts with pagination and filters
  fetchPosts: async (page = 1, search = '', category = '', status = '') => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (status) params.append('status', status);

      const response = await apiClient.get(`/blog/posts/?${params.toString()}`);
      const { results, next, count } = response.data;
      
      set({
        posts: page === 1 ? results : [...get().posts, ...results],
        postsPage: page,
        postsHasNext: !!next,
        totalPosts: count,
        loading: false
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch posts',
        loading: false 
      });
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/blog/categories/');
      set({ categories: response.data.results || response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch categories',
        loading: false 
      });
    }
  },

  // Fetch tags
  fetchTags: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/blog/tags/');
      set({ tags: response.data.results || response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch tags',
        loading: false 
      });
    }
  },

  // Fetch comments for a post
  fetchComments: async (postSlug: string) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/blog/posts/${postSlug}/comments/`);
      set({ comments: response.data.results || response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch comments',
        loading: false 
      });
    }
  },

  // Create post
  createPost: async (data: CreatePostData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('category', data.category.toString());
      formData.append('status', data.status);
      
      if (data.excerpt) formData.append('excerpt', data.excerpt);
      if (data.featured_image) formData.append('featured_image', data.featured_image);
      if (data.is_featured) formData.append('is_featured', 'true');
      if (data.youtube_url) formData.append('youtube_url', data.youtube_url);
      if (data.tags) {
        data.tags.forEach(tagId => formData.append('tags', tagId.toString()));
      }

      await apiClient.post('/blog/posts/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      set({ loading: false });
      toast.success('Post created successfully!');
      // Refresh posts
      get().fetchPosts();
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create post',
        loading: false 
      });
      return false;
    }
  },

  // Update post
  updatePost: async (slug: string, data: Partial<CreatePostData>) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'tags' && Array.isArray(value)) {
            value.forEach(tagId => formData.append('tags', tagId.toString()));
          } else if (key === 'category') {
            formData.append(key, value.toString());
          } else if (key === 'is_featured') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, value as string);
          }
        }
      });

      await apiClient.put(`/blog/posts/${slug}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      set({ loading: false });
      toast.success('Post updated successfully!');
      // Refresh posts
      get().fetchPosts();
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update post',
        loading: false 
      });
      return false;
    }
  },

  // Delete post
  deletePost: async (slug: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/blog/posts/${slug}/`);
      set({ 
        posts: get().posts.filter(post => post.slug !== slug),
        loading: false 
      });
      toast.success('Post deleted successfully!');
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete post',
        loading: false 
      });
      return false;
    }
  },

  // Get single post
  getPost: async (slug: string) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/blog/posts/${slug}/`);
      set({ selectedPost: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch post',
        loading: false 
      });
    }
  },

  // Create category
  createCategory: async (data: CreateCategoryData) => {
    set({ loading: true, error: null });
    try {
      await apiClient.post('/blog/categories/', data);
      set({ loading: false });
      toast.success('Category created successfully!');
      // Refresh categories
      get().fetchCategories();
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create category',
        loading: false 
      });
      return false;
    }
  },

  // Update category
  updateCategory: async (slug: string, data: Partial<CreateCategoryData>) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put(`/blog/categories/${slug}/`, data);
      set({ loading: false });
      toast.success('Category updated successfully!');
      // Refresh categories
      get().fetchCategories();
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update category',
        loading: false 
      });
      return false;
    }
  },

  // Delete category
  deleteCategory: async (slug: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/blog/categories/${slug}/`);
      set({ 
        categories: get().categories.filter(cat => cat.slug !== slug),
        loading: false 
      });
      toast.success('Category deleted successfully!');
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete category',
        loading: false 
      });
      return false;
    }
  },

  // Create tag
  createTag: async (data: CreateTagData) => {
    set({ loading: true, error: null });
    try {
      await apiClient.post('/blog/tags/', data);
      set({ loading: false });
      toast.success('Tag created successfully!');
      // Refresh tags
      get().fetchTags();
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create tag',
        loading: false 
      });
      return false;
    }
  },

  // Update tag
  updateTag: async (slug: string, data: Partial<CreateTagData>) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put(`/blog/tags/${slug}/`, data);
      set({ loading: false });
      toast.success('Tag updated successfully!');
      // Refresh tags
      get().fetchTags();
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update tag',
        loading: false 
      });
      return false;
    }
  },

  // Delete tag
  deleteTag: async (slug: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/blog/tags/${slug}/`);
      set({ 
        tags: get().tags.filter(tag => tag.slug !== slug),
        loading: false 
      });
      toast.success('Tag deleted successfully!');
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete tag',
        loading: false 
      });
      return false;
    }
  },

  // Update comment
  updateComment: async (id: number, data: { content?: string; is_approved?: boolean }) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put(`/blog/comments/${id}/`, data);
      set({ loading: false });
      toast.success('Comment updated successfully!');
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update comment',
        loading: false 
      });
      return false;
    }
  },

  // Delete comment
  deleteComment: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/blog/comments/${id}/`);
      set({ 
        comments: get().comments.filter(comment => comment.id !== id),
        loading: false 
      });
      toast.success('Comment deleted successfully!');
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete comment',
        loading: false 
      });
      return false;
    }
  },

  // Utility functions
  clearError: () => set({ error: null }),
  setSelectedPost: (post: BlogPost | null) => set({ selectedPost: post }),
  setSelectedCategory: (category: BlogCategory | null) => set({ selectedCategory: category }),
  setSelectedTag: (tag: BlogTag | null) => set({ selectedTag: tag }),
}));
