import { BlogPost, BlogFilters, PaginationInfo } from './types';

// Utility functions for blog functionality

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDateShort(dateString);
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = stripHtml(content).split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const filterPosts = (posts: BlogPost[], filters: BlogFilters): BlogPost[] => {
  let filteredPosts = [...posts];

  // Filter by search term
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.author.full_name.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by category
  if (filters.category) {
    filteredPosts = filteredPosts.filter(post =>
      post.category.slug === filters.category
    );
  }

  // Filter by tag
  if (filters.tag) {
    filteredPosts = filteredPosts.filter(post =>
      post.tags.some(tag => tag.slug === filters.tag)
    );
  }

  // Filter by author
  if (filters.author) {
    filteredPosts = filteredPosts.filter(post =>
      post.author.username === filters.author
    );
  }

  // Filter by featured status
  if (filters.featured !== undefined) {
    filteredPosts = filteredPosts.filter(post =>
      post.is_featured === filters.featured
    );
  }

  // Sort posts
  switch (filters.sortBy) {
    case 'oldest':
      filteredPosts.sort((a, b) => new Date(a.published_at || a.created_at).getTime() - new Date(b.published_at || b.created_at).getTime());
      break;
    case 'most_viewed':
      filteredPosts.sort((a, b) => b.views_count - a.views_count);
      break;
    case 'most_liked':
      filteredPosts.sort((a, b) => b.likes_count - a.likes_count);
      break;
    case 'newest':
    default:
      filteredPosts.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
      break;
  }

  return filteredPosts;
};

export const paginatePosts = (
  posts: BlogPost[],
  currentPage: number,
  itemsPerPage: number
): { posts: BlogPost[]; pagination: PaginationInfo } => {
  const totalItems = posts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  const pagination: PaginationInfo = {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
  };

  return {
    posts: paginatedPosts,
    pagination,
  };
};

export const generatePageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  const pages: (number | string)[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is less than or equal to max visible
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage <= 3) {
      // Near the beginning
      for (let i = 2; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }
  }

  return pages;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const getExcerpt = (content: string, maxLength: number = 160): string => {
  const plainText = stripHtml(content);
  return truncateText(plainText, maxLength);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const sharePost = (post: BlogPost, platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp'): void => {
  const url = encodeURIComponent(`${window.location.origin}/blog/${post.slug}`);
  const title = encodeURIComponent(post.title);
  const description = encodeURIComponent(post.excerpt);

  let shareUrl = '';

  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      break;
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${title}%20${url}`;
      break;
  }

  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};
