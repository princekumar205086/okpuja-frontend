"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

const NotificationsWidget = () => {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Payment Received',
      message: 'New payment of ₹5,000 for Ganesh Puja booking',
      time: '2 min ago',
      read: false,
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Priest Unavailable',
      message: 'Pandit Sharma marked unavailable for tomorrow',
      time: '15 min ago',
      read: false,
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      id: 3,
      type: 'info',
      title: 'New Review',
      message: 'Rajesh Kumar left a 5-star review',
      time: '1 hour ago',
      read: true,
      icon: <Info className="w-4 h-4" />,
    },
    {
      id: 4,
      type: 'error',
      title: 'Booking Cancelled',
      message: 'Customer cancelled Kundali matching session',
      time: '2 hours ago',
      read: true,
      icon: <XCircle className="w-4 h-4" />,
    },
  ];

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return { color: '#10b981', bg: '#10b98120' };
      case 'warning': return { color: '#f59e0b', bg: '#f59e0b20' };
      case 'error': return { color: '#ef4444', bg: '#ef444420' };
      case 'info': return { color: '#3b82f6', bg: '#3b82f620' };
      default: return { color: '#6b7280', bg: '#6b728020' };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="h-full"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-600">Recent activity alerts</p>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                {unreadCount} new
              </span>
            )}
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-3 rounded-lg border relative ${
                notification.read ? 'bg-transparent' : getNotificationColor(notification.type).bg
              }`}
              style={{ borderColor: `${getNotificationColor(notification.type).color}30` }}
            >
              {!notification.read && (
                <div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: getNotificationColor(notification.type).color }}
                />
              )}
              
              <div className="flex items-start space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: getNotificationColor(notification.type).color }}
                >
                  {notification.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 truncate mb-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {notification.time}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
            View All Notifications
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationsWidget;
