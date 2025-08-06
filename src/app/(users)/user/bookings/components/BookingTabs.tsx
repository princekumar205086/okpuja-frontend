'use client';

import React from 'react';

interface TabProps {
  activeTab: 'puja' | 'astrology';
  onTabChange: (tab: 'puja' | 'astrology') => void;
}

const BookingTabs: React.FC<TabProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex space-x-1 p-1.5 bg-gray-100 rounded-xl shadow-inner">
        <button
          onClick={() => onTabChange('puja')}
          className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-300 ${
            activeTab === 'puja'
              ? 'bg-white text-orange-600 shadow-md ring-1 ring-orange-100'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🙏</span>
            <span className="hidden sm:inline">Puja Bookings</span>
            <span className="sm:hidden">Puja</span>
          </div>
        </button>
        <button
          onClick={() => onTabChange('astrology')}
          className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-300 ${
            activeTab === 'astrology'
              ? 'bg-white text-purple-600 shadow-md ring-1 ring-purple-100'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">⭐</span>
            <span className="hidden sm:inline">Astrology Bookings</span>
            <span className="sm:hidden">Astrology</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default BookingTabs;
