import React from 'react';
import {
  ChartBarIcon as ChartBarIconSolid,
  SparklesIcon,
  FireIcon,
} from '@heroicons/react/24/solid';

interface Tab {
  id: 'astrology' | 'puja';
  label: string;
  icon: React.ComponentType<any>;
  count: number;
}

interface TabNavigationProps {
  activeTab: 'astrology' | 'puja';
  onTabChange: (tab: 'astrology' | 'puja') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: Tab[] = [
    { 
      id: 'astrology', 
      label: 'Astrology Services', 
      icon: SparklesIcon, 
      count: 0 
    },
    { 
      id: 'puja', 
      label: 'Puja Services', 
      icon: FireIcon, 
      count: 0
    },
  ];

  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group relative min-w-0 flex-1 sm:flex-none overflow-hidden py-4 px-4 text-center text-sm font-medium hover:text-gray-700 focus:z-10 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600 border-b-2'
                    : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  {tab.count > 0 && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;