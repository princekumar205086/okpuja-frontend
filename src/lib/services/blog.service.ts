import api from "@/lib/api/client";
import type {
  BlogPostListItem,
  BlogPost,
  BlogComment,
  CreateBlogPostRequest,
  BlogPostListParams,
  BlogCategory,
  BlogTag,
} from "@/types";

export const blogService = {
  // --- Categories ---
  getCategories: () =>
    api.get<BlogCategory[]>("/api/blog/categories/"),

  getCategory: (slug: string) =>
    api.get<BlogCategory>(`/api/blog/categories/${slug}/`),

  createCategory: (data: Partial<BlogCategory>) =>
    api.post<BlogCategory>("/api/blog/categories/", data),

  updateCategory: (slug: string, data: Partial<BlogCategory>) =>
    api.patch<BlogCategory>(`/api/blog/categories/${slug}/`, data),

  deleteCategory: (slug: string) =>
    api.delete(`/api/blog/categories/${slug}/`),

  // --- Tags ---
  getTags: () =>
    api.get<BlogTag[]>("/api/blog/tags/"),

  createTag: (data: Partial<BlogTag>) =>
    api.post<BlogTag>("/api/blog/tags/", data),

  updateTag: (slug: string, data: Partial<BlogTag>) =>
    api.patch<BlogTag>(`/api/blog/tags/${slug}/`, data),

  deleteTag: (slug: string) =>
    api.delete(`/api/blog/tags/${slug}/`),

  // --- Posts ---
  getPosts: (params?: BlogPostListParams) =>
    api.get<BlogPostListItem[]>("/api/blog/posts/", { params }),

  getPopularPosts: () =>
    api.get<BlogPostListItem[]>("/api/blog/posts/popular/"),

  getPost: (slug: string) =>
    api.get<BlogPost>(`/api/blog/posts/${slug}/`),

  getRelatedPosts: (slug: string) =>
    api.get<BlogPostListItem[]>(`/api/blog/posts/${slug}/related/`),

  createPost: (data: CreateBlogPostRequest) =>
    api.post<BlogPost>("/api/blog/posts/create/", data),

  updatePost: (slug: string, data: Partial<CreateBlogPostRequest>) =>
    api.patch<BlogPost>(`/api/blog/posts/${slug}/`, data),

  deletePost: (slug: string) =>
    api.delete(`/api/blog/posts/${slug}/`),

  // --- Comments ---
  getComments: (slug: string) =>
    api.get<BlogComment[]>(`/api/blog/posts/${slug}/comments/`),

  createComment: (slug: string, content: string) =>
    api.post<BlogComment>(`/api/blog/posts/${slug}/comments/`, { content }),

  // --- Likes ---
  toggleLike: (slug: string) =>
    api.post<{ status: "liked" | "unliked" }>(
      `/api/blog/posts/${slug}/like/`
    ),
};
