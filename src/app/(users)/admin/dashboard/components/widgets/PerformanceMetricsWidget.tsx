"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Clock, Users } from 'lucide-react';

const PerformanceMetricsWidget = () => {
  const metrics = [
    {
      label: 'Server Uptime',
      value: '99.9%',
      current: 99.9,
      target: 99.5,
      color: '#10b981',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      label: 'Response Time',
      value: '245ms',
      current: 245,
      target: 500,
      color: '#3b82f6',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      label: 'User Satisfaction',
      value: '4.8/5',
      current: 4.8,
      target: 4.5,
      color: '#8b5cf6',
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: 'Growth Rate',
      value: '+12.5%',
      current: 12.5,
      target: 10,
      color: '#f59e0b',
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="h-full"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Performance Metrics</h3>
            <p className="text-sm text-gray-600">Key performance indicators</p>
          </div>
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Real-time
          </span>
        </div>

        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${metric.color}20`, color: metric.color }}
                  >
                    {metric.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                </div>
                <span className="text-lg font-bold" style={{ color: metric.color }}>
                  {metric.value}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: metric.color,
                    width: `${Math.min((metric.current / metric.target) * 100, 100)}%`
                  }}
                />
              </div>
              
              <div className="text-xs text-gray-500">
                Target: {metric.target}{metric.label.includes('Rate') ? '%' : metric.label.includes('Time') ? 'ms' : metric.label.includes('Uptime') ? '%' : ''}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceMetricsWidget;
