'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlogFilters } from '../../types';
import { mockTags, getPostsByTag } from '../../mockData';
import { filterPosts, paginatePosts } from '../../utils';
import BlogCard from '../../components/BlogCard';
import SearchFilter from '../../components/SearchFilter';
import Pagination from '../../components/Pagination';
import '../../blog.css';

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const POSTS_PER_PAGE = 12;

const TagPage: React.FC<TagPageProps> = ({ params }) => {
  const [filters, setFilters] = useState<BlogFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use React.use() to unwrap the params promise (Next.js 15)
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  // Set initial filters
  useEffect(() => {
    setFilters({ tag: slug });
  }, [slug]);

  // Find the tag
  const tag = useMemo(() => {
    const foundTag = mockTags.find(t => t.slug === slug);
    return foundTag;
  }, [slug]);

  // Get posts for this tag
  const tagPosts = useMemo(() => {
    const posts = getPostsByTag(slug);
    return posts;
  }, [slug]);

  // Filter and paginate posts
  const { filteredPosts, paginationInfo } = useMemo(() => {
    const filtered = filterPosts(tagPosts, filters);
    const { posts, pagination } = paginatePosts(filtered, currentPage, POSTS_PER_PAGE);
    
    return {
      filteredPosts: posts,
      paginationInfo: pagination,
    };
  }, [tagPosts, filters, currentPage]);

  if (!tag) {
    notFound();
  }

  const handleFiltersChange = (newFilters: BlogFilters) => {
    setFilters({ ...newFilters, tag: slug }); // Keep tag filter
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Enhanced Breadcrumbs */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-orange-600 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                Home
              </Link>
            </li>
            <li className="text-orange-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </li>
            <li>
              <Link href="/blog" className="text-gray-500 hover:text-orange-600 transition-colors">
                Blog
              </Link>
            </li>
            <li className="text-orange-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </li>
            <li>
              <span className="text-gray-500">Tags</span>
            </li>
            <li className="text-orange-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </li>
            <li className="text-gray-900 font-medium truncate max-w-xs">
              {tag.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 overflow-hidden py-16 sm:py-20 lg:py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v30H30z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-amber-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tag Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-lg font-semibold mb-6">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
            {tag.name}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Articles about <span className="text-amber-300">{tag.name}</span>
          </h1>

          {/* Description */}
          {tag.description && (
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              {tag.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 8a1 1 0 011-1h4a1 1 0 011 1v4H7v-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">
                {paginationInfo.totalItems} {paginationInfo.totalItems === 1 ? 'article' : 'articles'}
              </span>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 lg:h-12">
          <svg className="w-full h-full" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L50 110C100 100 200 80 300 70C400 60 500 60 600 65C700 70 800 80 900 85C1000 90 1100 90 1150 90L1200 90V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z" fill="rgb(254 242 242)"/>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 lg:-mt-12 relative z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search Filters */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <SearchFilter
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                  </svg>
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockTags.filter(t => t.slug !== slug).slice(0, 10).map((t) => (
                    <Link
                      key={t.id}
                      href={`/blog/tag/${t.slug}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 border border-gray-200 hover:border-orange-200"
                    >
                      #{t.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related Tags */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                  </svg>
                  Related Topics
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Explore similar topics and expand your spiritual knowledge.
                  </p>
                  <div className="space-y-2">
                    {mockTags.filter(t => t.slug !== slug).slice(0, 6).map((t) => (
                      <Link
                        key={t.id}
                        href={`/blog/tag/${t.slug}`}
                        className="flex items-center text-sm text-gray-700 hover:text-orange-600 transition-colors py-1"
                      >
                        <svg className="w-3 h-3 mr-2 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                        </svg>
                        {t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Back to All Articles */}
              <Link
                href="/blog"
                className="flex items-center justify-center w-full px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
                All Articles
              </Link>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="lg:col-span-3">
            {filteredPosts.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      <BlogCard
                        post={post}
                        variant="default"
                        className="border-0 shadow-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <Pagination
                    pagination={paginationInfo}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            ) : (
              /* Enhanced No Results */
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  No articles found with tag &ldquo;{tag.name}&rdquo;
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search terms or explore other tags to discover more spiritual content.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handleFiltersChange({ tag: slug })}
                    className="bg-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Clear Filters
                  </button>
                  <Link
                    href="/blog"
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Browse All Articles
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagPage;
