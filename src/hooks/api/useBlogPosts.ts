import { useState, useCallback } from "react";
import { blogService } from "@/lib/services";
import { handleApiError } from "@/lib/api/errorHandler";
import type { BlogPostListItem, BlogPost, BlogComment, BlogPostListParams } from "@/types";

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (params?: BlogPostListParams) => {
    setLoading(true);
    try {
      const { data } = await blogService.getPosts(params);
      setPosts(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { posts, loading, fetch };
}

export function useBlogPost() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const [postRes, commentsRes] = await Promise.all([
        blogService.getPost(slug),
        blogService.getComments(slug),
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(
    async (slug: string, content: string) => {
      try {
        const { data } = await blogService.createComment(slug, content);
        setComments((prev) => [data, ...prev]);
        return data;
      } catch (err) {
        handleApiError(err);
        return null;
      }
    },
    []
  );

  const toggleLike = useCallback(async (slug: string) => {
    try {
      const { data } = await blogService.toggleLike(slug);
      return data.status;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  }, []);

  return { post, comments, loading, fetch, addComment, toggleLike };
}
