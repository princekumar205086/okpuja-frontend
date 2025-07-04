'use client';

import React from 'react';
import { BlogPost } from '../types';
import BlogCard from './BlogCard';

interface FeaturedPostsProps {
  posts: BlogPost[];
  className?: string;
}

const FeaturedPosts: React.FC<FeaturedPostsProps> = ({
  posts,
  className = '',
}) => {
  if (posts.length === 0) {
    return null;
  }

  const mainFeatured = posts[0];
  const secondaryFeatured = posts.slice(1, 4);

  return (
    <section className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Featured Post - Takes 2 columns */}
        <div className="lg:col-span-2">
          <BlogCard
            post={mainFeatured}
            variant="featured"
            className="h-full"
          />
        </div>

        {/* Secondary Featured Posts - Stacked in right column */}
        <div className="space-y-6">
          {secondaryFeatured.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              variant="compact"
              showExcerpt={false}
              className="h-auto"
            />
          ))}
          
          {/* If we have space, add a promotional card */}
          {secondaryFeatured.length < 3 && (
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
              <div className="flex items-center mb-3">
                <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <h3 className="text-lg font-bold">Personalized Guidance</h3>
              </div>
              <p className="text-sm text-orange-100 mb-4 leading-relaxed">
                Connect with our experienced astrologers and spiritual guides for personalized insights tailored to your journey.
              </p>
              <button className="bg-white text-orange-600 px-6 py-3 rounded-full text-sm font-semibold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Book Consultation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Show additional featured posts on mobile if any */}
      {posts.length > 4 && (
        <div className="mt-12 lg:hidden">
          <h3 className="text-xl font-bold text-gray-900 mb-6">More Featured Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.slice(4).map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                variant="compact"
                className="h-full"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedPosts;
