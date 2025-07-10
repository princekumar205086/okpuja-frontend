"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import CountUp from 'react-countup';

interface ResponsiveStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
  index: number;
}

const ResponsiveStatsCard: React.FC<ResponsiveStatsCardProps> = ({
  title,
  value,
  icon,
  change,
  trend,
  color,
  index
}) => {
  const isNumeric = typeof value === 'number';
  
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500'
  };

  const trendBgColors = {
    up: 'bg-green-50',
    down: 'bg-red-50',
    neutral: 'bg-gray-50'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group h-full">
        {/* Top border indicator */}
        <div className="h-1" style={{ backgroundColor: color }}></div>
        
        <div className="p-3 sm:p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: color }}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 text-white">
                {icon}
              </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          {/* Value */}
          <div className="mb-2">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 break-words">
              {isNumeric ? (
                <CountUp 
                  end={value as number} 
                  duration={2} 
                  separator="," 
                  prefix={title.includes('Revenue') ? '₹' : ''}
                />
              ) : (
                value
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium truncate">
              {title}
            </div>
          </div>
          
          {/* Trend */}
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${trendBgColors[trend]} ${trendColors[trend]}`}>
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : trend === 'down' ? (
              <TrendingDown className="w-3 h-3 mr-1" />
            ) : null}
            <span className="truncate">{change}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResponsiveStatsCard;
