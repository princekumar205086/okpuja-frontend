'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '../types';
import { formatDate, getTimeAgo, formatNumber } from '../utils';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact' | 'minimal';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
  showStats?: boolean;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  post,
  variant = 'default',
  showExcerpt = true,
  showAuthor = true,
  showCategory = true,
  showStats = true,
  className = '',
}) => {
  const renderFeaturedCard = () => (
    <article className={`group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 ${className}`}>
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-80 sm:h-96 overflow-hidden">
          {post.featured_image && (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {post.is_featured && (
            <div className="absolute top-6 left-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Featured
              </span>
            </div>
          )}
          
          {showCategory && (
            <div className="absolute top-4 right-4">
              <span 
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.icon} {post.category.name}
              </span>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 leading-tight group-hover:text-amber-200 transition-colors">
              {post.title}
            </h2>
            
            {showExcerpt && (
              <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              {showAuthor && (
                <div className="flex items-center space-x-3">
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.full_name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">{post.author.full_name}</p>
                    <p className="text-xs text-gray-300">{getTimeAgo(post.published_at || post.created_at)}</p>
                  </div>
                </div>
              )}
              
              {showStats && (
                <div className="flex items-center space-x-4 text-xs text-gray-300">
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span>{formatNumber(post.views_count)}</span>
                  </span>
                  
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{formatNumber(post.likes_count)}</span>
                  </span>
                  
                  {post.reading_time && (
                    <span>{post.reading_time} min read</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );

  const renderDefaultCard = () => (
    <article className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-100 ${className}`}>
      <Link href={`/blog/${post.slug}`} className="block">
        {post.featured_image && (
          <div className="relative h-56 overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {showCategory && (
              <div className="absolute top-4 left-4">
                <span 
                  className="inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
                  style={{ backgroundColor: post.category.color }}
                >
                  <span className="mr-1">{post.category.icon}</span>
                  {post.category.name}
                </span>
              </div>
            )}
            
            {post.is_featured && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  Featured
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
            {post.title}
          </h3>
          
          {showExcerpt && (
            <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            {showAuthor && (
              <div className="flex items-center space-x-3">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.full_name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover border-2 border-white shadow-sm"
                  />
                )}
                <div>
                  <p className="text-xs font-medium text-gray-900">{post.author.full_name}</p>
                  <p className="text-xs text-gray-500">{getTimeAgo(post.published_at || post.created_at)}</p>
                </div>
              </div>
            )}
            
            {showStats && (
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>{formatNumber(post.views_count)}</span>
                </span>
                
                <span className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>{formatNumber(post.likes_count)}</span>
                </span>
                
                {post.reading_time && (
                  <span>{post.reading_time}m</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );

  const renderCompactCard = () => (
    <article className={`group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${className}`}>
      <Link href={`/blog/${post.slug}`} className="flex">
        {post.featured_image && (
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="96px"
            />
          </div>
        )}
        
        <div className="flex-1 p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {post.title}
          </h4>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            {showAuthor && (
              <span>{post.author.full_name}</span>
            )}
            <span>{getTimeAgo(post.published_at || post.created_at)}</span>
          </div>
        </div>
      </Link>
    </article>
  );

  const renderMinimalCard = () => (
    <article className={`group ${className}`}>
      <Link href={`/blog/${post.slug}`} className="block">
        <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
          {post.title}
        </h4>
        <p className="text-xs text-gray-500">{getTimeAgo(post.published_at || post.created_at)}</p>
      </Link>
    </article>
  );

  switch (variant) {
    case 'featured':
      return renderFeaturedCard();
    case 'compact':
      return renderCompactCard();
    case 'minimal':
      return renderMinimalCard();
    default:
      return renderDefaultCard();
  }
};

export default BlogCard;
