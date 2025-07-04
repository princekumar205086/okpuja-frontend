'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '../types';
import { getPostBySlug, getRelatedPosts } from '../mockData';
import { formatDate, sharePost } from '../utils';
import BlogCard from '../components/BlogCard';
import LoadingSkeletons from '../components/LoadingSkeletons';
import '../blog.css';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ params }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    // Resolve params promise for Next.js 15
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      const foundPost = getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        setRelatedPosts(getRelatedPosts(foundPost));
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  // Reading progress
  useEffect(() => {
    const updateReadingProgress = () => {
      const article = document.getElementById('article-content');
      if (article) {
        const scrollTop = window.scrollY;
        const docHeight = article.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const progress = Math.min(100, Math.max(0, scrollPercent * 100));
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div 
          className="reading-progress"
          style={{ transform: `scaleX(${readingProgress / 100})` }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeletons variant="featured" count={1} />
          <div className="mt-8 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp') => {
    sharePost(post, platform);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Reading Progress Bar */}
      <div 
        className="reading-progress fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600 z-50 transition-transform duration-300 ease-out"
        style={{ transform: `scaleX(${readingProgress / 100})`, transformOrigin: 'left' }}
      />

      {/* Enhanced Breadcrumbs */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              <Link 
                href={`/blog/category/${post.category.slug}`}
                className="text-gray-500 hover:text-orange-600 transition-colors"
              >
                {post.category.name}
              </Link>
            </li>
            <li className="text-orange-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </li>
            <li className="text-gray-900 font-medium truncate max-w-xs">
              {post.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Enhanced Article Layout */}
      <article id="article-content" className="relative">
        {/* Hero Section with Enhanced Design */}
        <header className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v30H30z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-amber-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="max-w-4xl">
              {/* Enhanced Category Badge */}
              <div className="mb-6">
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 group"
                >
                  <span className="mr-2 text-lg">{post.category.icon}</span>
                  {post.category.name}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </Link>
              </div>

              {/* Enhanced Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
                {post.title}
              </h1>

              {/* Enhanced Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-white/90 mb-8">
                <div className="flex items-center space-x-3">
                  {post.author.avatar && (
                    <div className="relative">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.full_name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover ring-3 ring-white/30"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg">{post.author.full_name}</p>
                    <p className="text-sm text-white/70">{formatDate(post.published_at || post.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <span className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span>{post.views_count.toLocaleString()}</span>
                  </span>
                  
                  <span className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{post.likes_count}</span>
                  </span>
                  
                  {post.reading_time && (
                    <span className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{post.reading_time} min read</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Wave Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 lg:h-12">
            <svg className="w-full h-full" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L50 110C100 100 200 80 300 70C400 60 500 60 600 65C700 70 800 80 900 85C1000 90 1100 90 1150 90L1200 90V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z" fill="rgb(254 242 242)"/>
            </svg>
          </div>
        </header>

        {/* Main Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 lg:-mt-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Image Card */}
              {post.featured_image && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                  <div className="relative h-64 md:h-96">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              )}

              {/* Excerpt Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border-l-4 border-orange-500">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Article Summary</h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8 lg:p-12">
                  <div 
                    className="blog-content prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Table of Contents */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                    </svg>
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    <a href="#introduction" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors py-1">Introduction</a>
                    <a href="#main-content" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors py-1">Main Content</a>
                    <a href="#conclusion" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors py-1">Conclusion</a>
                  </nav>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                      Book Consultation
                    </button>
                    <button className="w-full border border-orange-500 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium">
                      Save Article
                    </button>
                    <button className="w-full border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Print Article
                    </button>
                  </div>
                </div>

                {/* Author Highlight */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                  <div className="text-center">
                    {post.author.avatar && (
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.full_name}
                          fill
                          className="rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                    )}
                    <h4 className="font-semibold text-gray-900 mb-2">{post.author.full_name}</h4>
                    <p className="text-sm text-gray-600 mb-4">Spiritual Guide & Writer</p>
                    <Link
                      href={`/blog?author=${post.author.username}`}
                      className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      View all articles
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags and Sharing Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                      Related Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/blog/tag/${tag.slug}`}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 border border-gray-200 hover:border-orange-200"
                        >
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Share Section */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                    </svg>
                    Share This Article
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="social-share-btn flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg group"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      <span className="hidden sm:block text-sm font-medium">Twitter</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare('facebook')}
                      className="social-share-btn flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg group"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="hidden sm:block text-sm font-medium">Facebook</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="social-share-btn flex items-center justify-center space-x-2 px-4 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg group"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span className="hidden sm:block text-sm font-medium">LinkedIn</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="social-share-btn flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg group"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      <span className="hidden sm:block text-sm font-medium">WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Enhanced Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-16 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Continue Your Journey</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore more spiritual insights and wisdom from our collection of articles
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="group">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <BlogCard
                      post={relatedPost}
                      variant="default"
                      showExcerpt={false}
                      className="border-0 shadow-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced CTA Section */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v30H30z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-amber-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="text-6xl mb-6">🔮</div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            Need Personal <span className="text-amber-300">Guidance</span>?
          </h2>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get personalized spiritual insights and astrological guidance from our experienced pandits and spiritual advisors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              <span>Book Consultation</span>
            </button>
            <Link
              href="/blog"
              className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center space-x-2"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              <span>More Articles</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
