'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationParams } from '../types';

interface PaginationProps {
  pagination: PaginationParams;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total } = pagination;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pages = generatePageNumbers();
  const startItem = (page - 1) * pagination.limit + 1;
  const endItem = Math.min(page * pagination.limit, total);

  return (
    <div className="bg-white px-4 py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Pagination */}
        <div className="flex justify-between items-center sm:hidden">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* Desktop Pagination */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startItem}</span> to{' '}
              <span className="font-medium">{endItem}</span> of{' '}
              <span className="font-medium">{total}</span> results
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* First Page */}
            {pages[0] > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                >
                  1
                </button>
                {pages[0] > 2 && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                    ...
                  </span>
                )}
              </>
            )}

            {/* Page Numbers */}
            {pages.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                  pageNum === page
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Last Page */}
            {pages[pages.length - 1] < totalPages && (
              <>
                {pages[pages.length - 1] < totalPages - 1 && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                    ...
                  </span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next Button */}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
