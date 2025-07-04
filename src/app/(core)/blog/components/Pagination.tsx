'use client';

import React from 'react';
import { PaginationInfo } from '../types';
import { generatePageNumbers } from '../utils';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  className = '',
}) => {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const pageNumbers = generatePageNumbers(pagination.currentPage, pagination.totalPages);

  return (
    <nav className={`flex items-center justify-between ${className}`} aria-label="Pagination">
      {/* Mobile: Simple Previous/Next */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevious}
          className={`
            relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
            ${pagination.hasPrevious
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
            }
          `}
        >
          Previous
        </button>
        
        <span className="text-sm text-gray-700 self-center">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        
        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNext}
          className={`
            relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
            ${pagination.hasNext
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
            }
          `}
        >
          Next
        </button>
      </div>

      {/* Desktop: Full pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            </span>{' '}
            of{' '}
            <span className="font-medium">{pagination.totalItems}</span>{' '}
            results
          </p>
        </div>

        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevious}
              className={`
                relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0
                ${!pagination.hasPrevious ? 'cursor-not-allowed opacity-50' : 'hover:text-gray-600'}
              `}
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((pageNumber, index) => (
              <React.Fragment key={index}>
                {pageNumber === '...' ? (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => onPageChange(pageNumber as number)}
                    className={`
                      relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0
                      ${pageNumber === pagination.currentPage
                        ? 'z-10 bg-orange-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600'
                        : 'text-gray-900 hover:text-gray-600'
                      }
                    `}
                  >
                    {pageNumber}
                  </button>
                )}
              </React.Fragment>
            ))}

            {/* Next Button */}
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className={`
                relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0
                ${!pagination.hasNext ? 'cursor-not-allowed opacity-50' : 'hover:text-gray-600'}
              `}
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>

      {/* Jump to page (for large datasets) */}
      {pagination.totalPages > 10 && (
        <div className="hidden lg:flex items-center space-x-2 ml-6">
          <label htmlFor="jump-to-page" className="text-sm text-gray-700">
            Jump to:
          </label>
          <select
            id="jump-to-page"
            value={pagination.currentPage}
            onChange={(e) => onPageChange(parseInt(e.target.value))}
            className="block w-20 px-3 py-1 text-sm border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          >
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
};

export default Pagination;
