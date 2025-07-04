'use client';

import React from 'react';
import Link from 'next/link';
import { BlogPost, BlogCategory, BlogTag } from '../types';
import { mockCategories, mockTags } from '../mockData';
import BlogCard from './BlogCard';

interface BlogSidebarProps {
  recentPosts: BlogPost[];
  popularPosts: BlogPost[];
  className?: string;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  recentPosts,
  popularPosts,
  className = '',
}) => {
  return (
    <aside className={`space-y-8 ${className}`}>
      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
        <p className="text-sm text-orange-100 mb-4">
          Get weekly spiritual insights and updates delivered to your inbox.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="w-full bg-white text-orange-600 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Articles</h3>
          <div className="space-y-4">
            {recentPosts.slice(0, 5).map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                variant="minimal"
                showAuthor={false}
                showCategory={false}
                showStats={false}
              />
            ))}
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 mt-4"
          >
            View all articles
            <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      )}

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h3>
          <div className="space-y-4">
            {popularPosts.slice(0, 5).map((post, index) => (
              <div key={post.id} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </span>
                <BlogCard
                  post={post}
                  variant="minimal"
                  showAuthor={false}
                  showCategory={false}
                  showStats={false}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          {mockCategories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {category.name}
                </span>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {mockTags.slice(0, 8).map((tag) => (
            <Link
              key={tag.id}
              href={`/blog/tag/${tag.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-800 transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Consultation CTA */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="text-center">
          <div className="text-3xl mb-2">🔮</div>
          <h3 className="text-lg font-semibold mb-2">Need Personal Guidance?</h3>
          <p className="text-sm text-purple-100 mb-4">
            Get personalized astrological insights and spiritual guidance from our expert pandits.
          </p>
          <button className="w-full bg-white text-purple-600 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
            Book Consultation
          </button>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
        <div className="flex space-x-3">
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
            aria-label="Twitter"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.596-3.197-1.537-.75-.94-.894-2.17-.394-3.199.5-1.029 1.537-1.682 2.645-1.682 1.108 0 2.145.653 2.645 1.682.5 1.029.356 2.259-.394 3.199-.749.941-1.9 1.537-3.197 1.537zm3.568 0c-1.297 0-2.448-.596-3.197-1.537-.75-.94-.894-2.17-.394-3.199.5-1.029 1.537-1.682 2.645-1.682 1.108 0 2.145.653 2.645 1.682.5 1.029.356 2.259-.394 3.199-.749.941-1.9 1.537-3.197 1.537zm3.568 0c-1.297 0-2.448-.596-3.197-1.537-.75-.94-.894-2.17-.394-3.199.5-1.029 1.537-1.682 2.645-1.682 1.108 0 2.145.653 2.645 1.682.5 1.029.356 2.259-.394 3.199-.749.941-1.9 1.537-3.197 1.537z"/>
            </svg>
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            aria-label="YouTube"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
