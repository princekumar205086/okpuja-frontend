'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlogFilters } from '../../types';
import { mockCategories, getPostsByCategory } from '../../mockData';
import { filterPosts, paginatePosts } from '../../utils';
import BlogCard from '../../components/BlogCard';
import SearchFilter from '../../components/SearchFilter';
import Pagination from '../../components/Pagination';
import LoadingSkeletons from '../../components/LoadingSkeletons';
import '../../blog.css';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const POSTS_PER_PAGE = 12;

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
  const [filters, setFilters] = useState<BlogFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use React.use() to unwrap the params promise (Next.js 15)
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  // Set initial filters
  useEffect(() => {
    setFilters({ category: slug });
  }, [slug]);

  // Find the category
  const category = useMemo(() => {
    const foundCategory = mockCategories.find(cat => cat.slug === slug);
    return foundCategory;
  }, [slug]);

  // Get posts for this category
  const categoryPosts = useMemo(() => {
    const posts = getPostsByCategory(slug);
    return posts;
  }, [slug]);

  // Filter and paginate posts
  const { filteredPosts, paginationInfo } = useMemo(() => {
    const filtered = filterPosts(categoryPosts, filters);
    const { posts, pagination } = paginatePosts(filtered, currentPage, POSTS_PER_PAGE);
    
    return {
      filteredPosts: posts,
      paginationInfo: pagination,
    };
  }, [categoryPosts, filters, currentPage]);

  if (!category) {
    notFound();
  }

  const handleFiltersChange = (newFilters: BlogFilters) => {
    setFilters({ ...newFilters, category: slug }); // Keep category filter
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/blog" className="text-gray-500 hover:text-gray-700">
                Blog
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">
              {category.name}
            </li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center px-6 py-3 rounded-full text-white text-lg font-semibold mb-4"
            style={{ backgroundColor: category.color }}
          >
            <span className="text-2xl mr-2">{category.icon}</span>
            {category.name}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category.name} Articles
          </h1>
          {category.description && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
          <div className="mt-6">
            <span className="text-gray-500">
              {paginationInfo.totalItems} {paginationInfo.totalItems === 1 ? 'article' : 'articles'} in this category
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Filters */}
          <div className="lg:col-span-1">
            <SearchFilter
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />

            {/* Other Categories */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Categories</h3>
              <div className="space-y-2">
                {mockCategories.filter(cat => cat.slug !== slug).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog/category/${cat.slug}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {cat.name}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Back to All Articles */}
            <div className="mt-6">
              <Link
                href="/blog"
                className="flex items-center justify-center w-full px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                All Articles
              </Link>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="lg:col-span-3">
            {filteredPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      variant="default"
                      showCategory={false} // Don't show category since we're in category view
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  pagination={paginationInfo}
                  onPageChange={handlePageChange}
                  className="mt-12"
                />
              </>
            ) : (
              /* No Results */
              <div className="text-center py-16">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No articles found in {category.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or check back later for new content.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handleFiltersChange({ category: slug })}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                  <Link
                    href="/blog"
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
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

export default CategoryPage;
