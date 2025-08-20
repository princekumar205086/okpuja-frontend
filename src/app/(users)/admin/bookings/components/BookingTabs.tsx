'use client';

import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  count: number;
}

interface BookingTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const BookingTabs: React.FC<BookingTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
      <nav className="flex space-x-1 xs:space-x-2 sm:space-x-4 md:space-x-8 px-4 sm:px-6 md:px-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                py-4 sm:py-5 px-2 sm:px-4 border-b-3 font-semibold text-sm sm:text-base flex items-center space-x-2 sm:space-x-3 whitespace-nowrap transition-all duration-300
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                }
              `}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
              <span className="font-medium">{tab.label}</span>
              <span className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm
                ${activeTab === tab.id
                  ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-200'
                  : 'bg-gray-100 text-gray-800'
                }
              `}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BookingTabs;
