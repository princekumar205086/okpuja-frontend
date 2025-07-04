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
import './blog.css';

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
    <div className="min-h-screen bg-gray-50">
      {/* Compact Modern Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v30H30z'/%3E%3Cpath d='M0 30c0-16.569 13.431-30 30-30v30H0z' transform='rotate(90 30 30)'/%3E%3Cpath d='M30 60c0-16.569 13.431-30 30-30v30H30z' transform='rotate(180 30 30)'/%3E%3Cpath d='M60 30c0-16.569 13.431-30 30-30v30H60z' transform='rotate(270 30 30)'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Floating elements for visual appeal */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-amber-300/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/15 rounded-full blur-md animate-pulse delay-500"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl mb-6">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Spiritual <span className="text-amber-300">Blog</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-orange-100 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto">
              Discover ancient wisdom and divine insights from our expert astrologers
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button 
                onClick={() => document.getElementById('blog-content')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto group bg-white text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Explore Articles</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </span>
              </button>
              <button className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Book Consultation
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 lg:h-12">
          <svg className="w-full h-full" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L50 110C100 100 200 80 300 70C400 60 500 60 600 65C700 70 800 80 900 85C1000 90 1100 90 1150 90L1200 90V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 lg:-mt-12 relative z-10">
        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Featured Articles
                </h2>
                <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-3 sm:mb-4"></div>
                <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                  Handpicked insights from our expert astrologers and spiritual guides
                </p>
              </div>
              <FeaturedPosts posts={featuredPosts} />
            </div>
          </section>
        )}

        {/* Category Navigation */}
        <section className="mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <CategoryTabs
              selectedCategory={filters.category}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </section>

        {/* Blog Content */}
        <section id="blog-content">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3">
              {/* Search and Filters */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                <SearchFilter
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>

              {/* Results Header */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {filters.category 
                        ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1).replace('-', ' ')} Articles`
                        : filters.search
                        ? `Search Results`
                        : 'Latest Articles'
                      }
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {paginationInfo.totalItems} {paginationInfo.totalItems === 1 ? 'article' : 'articles'} 
                      {filters.search && ` for "${filters.search}"`}
                    </p>
                  </div>
                  
                  {/* Sort Options */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
                    <select 
                      value={filters.sortBy || 'newest'} 
                      onChange={(e) => handleFiltersChange({...filters, sortBy: e.target.value as any})}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full sm:w-auto"
                    >
                      <option value="newest">Latest</option>
                      <option value="most_viewed">Most Popular</option>
                      <option value="most_liked">Most Liked</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Articles Grid */}
              {filteredPosts.length > 0 ? (
                <div className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {filteredPosts.map((post, index) => (
                      <div key={post.id} className={`${index === 0 && filteredPosts.length > 1 ? 'md:col-span-2' : ''}`}>
                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                          <BlogCard
                            post={post}
                            variant={index === 0 && filteredPosts.length > 1 ? "featured" : "default"}
                            className="h-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                    <Pagination
                      pagination={paginationInfo}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              ) : (
                /* No Results State */
                <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">No articles found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
                    We couldn&apos;t find any articles matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={() => handleFiltersChange({})}
                    className="bg-orange-600 text-white px-6 sm:px-8 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 mt-8 xl:mt-0">
              <div className="sticky top-4 sm:top-6 lg:top-8">
                <div className="bg-white rounded-xl shadow-md">
                  <BlogSidebar
                    recentPosts={sidebarData.recent}
                    popularPosts={sidebarData.popular}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        {/* <section className="mt-12 sm:mt-16 mb-8 sm:mb-12">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Stay Updated
              </h3>
              <p className="text-orange-100 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
                Get the latest spiritual insights and divine guidance delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
                />
                <button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default BlogPage;
