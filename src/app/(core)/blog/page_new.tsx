'use client';

import React, { useState, useMemo } from 'react';
import { BlogFilters } from './types';
import { mockBlogPosts, getFeaturedPosts } from './mockData';
import { filterPosts, paginatePosts } from './utils';
import BlogCard from './components/BlogCard';
import SearchFilter from './components/SearchFilter';
import CategoryTabs from './components/CategoryTabs';
import FeaturedPosts from './components/FeaturedPosts';
import BlogSidebar from './components/BlogSidebar';
import Pagination from './components/Pagination';
import LoadingSkeletons, { 
  HeroSkeleton, 
  CategoryTabsSkeleton 
} from './components/LoadingSkeletons';

const POSTS_PER_PAGE = 9;

const BlogPage = () => {
  const [filters, setFilters] = useState<BlogFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Get published posts
  const publishedPosts = useMemo(() => 
    mockBlogPosts.filter(post => post.status === 'published'),
    []
  );

  // Get featured posts
  const featuredPosts = useMemo(() => getFeaturedPosts(), []);

  // Filter and paginate posts
  const { filteredPosts, paginationInfo } = useMemo(() => {
    const filtered = filterPosts(publishedPosts, filters);
    const { posts, pagination } = paginatePosts(filtered, currentPage, POSTS_PER_PAGE);
    
    return {
      filteredPosts: posts,
      paginationInfo: pagination,
    };
  }, [publishedPosts, filters, currentPage]);

  // Get sidebar data
  const sidebarData = useMemo(() => {
    const recent = publishedPosts
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
    
    const popular = publishedPosts
      .sort((a, b) => b.views_count - a.views_count)
      .slice(0, 5);

    return { recent, popular };
  }, [publishedPosts]);

  const handleFiltersChange = (newFilters: BlogFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleCategoryChange = (categorySlug?: string) => {
    handleFiltersChange({ ...filters, category: categorySlug });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of blog section
    document.getElementById('blog-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HeroSkeleton className="mb-12" />
          <CategoryTabsSkeleton className="mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <LoadingSkeletons variant="card" count={6} />
            </div>
            <div className="space-y-8">
              <LoadingSkeletons variant="sidebar" count={3} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Spiritual <span className="text-amber-300">Wisdom</span>
              <br />
              <span className="text-3xl md:text-5xl lg:text-6xl font-medium text-orange-100">
                & Divine Guidance
              </span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-orange-100 mb-10 leading-relaxed">
              Discover ancient wisdom, spiritual practices, and divine insights to guide your journey towards enlightenment and inner peace. Our expert astrologers share their knowledge through carefully crafted articles.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span className="flex items-center space-x-2">
                  <span>Explore Articles</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </span>
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Articles
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Handpicked insights from our expert astrologers and spiritual guides
              </p>
            </div>
            <FeaturedPosts posts={featuredPosts} />
          </section>
        )}

        {/* Category Navigation */}
        <section className="py-8 border-b border-gray-200">
          <CategoryTabs
            selectedCategory={filters.category}
            onCategoryChange={handleCategoryChange}
          />
        </section>

        {/* Blog Content */}
        <section id="blog-content" className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Filters */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <SearchFilter
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>

              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {filters.category 
                      ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1).replace('-', ' ')} Articles`
                      : filters.search
                      ? `Search Results`
                      : 'Latest Articles'
                    }
                  </h2>
                  <p className="text-gray-600">
                    {paginationInfo.totalItems} {paginationInfo.totalItems === 1 ? 'article' : 'articles'} 
                    {filters.search && ` for "${filters.search}"`}
                  </p>
                </div>
                
                {/* Sort Options */}
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select 
                    value={filters.sortBy || 'newest'} 
                    onChange={(e) => handleFiltersChange({...filters, sortBy: e.target.value as any})}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="newest">Latest</option>
                    <option value="most_viewed">Most Popular</option>
                    <option value="most_liked">Most Liked</option>
                  </select>
                </div>
              </div>

              {/* Articles Grid */}
              {filteredPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {filteredPosts.map((post, index) => (
                      <div key={post.id} className={`${index === 0 && filteredPosts.length > 1 ? 'md:col-span-2' : ''}`}>
                        <BlogCard
                          post={post}
                          variant={index === 0 && filteredPosts.length > 1 ? "featured" : "default"}
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    pagination={paginationInfo}
                    onPageChange={handlePageChange}
                    className="mt-16"
                  />
                </>
              ) : (
                /* No Results State */
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No articles found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We couldn&apos;t find any articles matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={() => handleFiltersChange({})}
                    className="bg-orange-600 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BlogSidebar
                  recentPosts={sidebarData.recent}
                  popularPosts={sidebarData.popular}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
