'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BlogCategory } from '../types';
import { mockCategories } from '../mockData';

interface CategoryTabsProps {
  selectedCategory?: string;
  onCategoryChange: (categorySlug?: string) => void;
  className?: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange,
  className = '',
}) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check if arrows should be shown
  const updateArrowVisibility = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    updateArrowVisibility();
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateArrowVisibility);
      window.addEventListener('resize', updateArrowVisibility);
      
      return () => {
        container.removeEventListener('scroll', updateArrowVisibility);
        window.removeEventListener('resize', updateArrowVisibility);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const categories = [
    { id: 0, name: 'All', slug: '', icon: '📚', color: '#6B7280' },
    ...mockCategories,
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Scroll left"
        >
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* Category Tabs */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-2 overflow-x-auto scrollbar-hide py-3 px-4 sm:px-12"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.slug || undefined)}
            className={`
              flex-shrink-0 flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 whitespace-nowrap border-2
              ${selectedCategory === category.slug
                ? 'text-white shadow-lg transform scale-105 border-transparent'
                : 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900'
              }
            `}
            style={{
              backgroundColor: selectedCategory === category.slug ? category.color : undefined,
            }}
          >
            <span className="text-lg sm:text-xl">{category.icon}</span>
            <span className="hidden xs:inline">{category.name}</span>
            <span className="xs:hidden">{category.name.slice(0, 3)}</span>
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Scroll right"
        >
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CategoryTabs;
