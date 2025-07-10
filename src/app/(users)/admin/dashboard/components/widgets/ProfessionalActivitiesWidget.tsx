"use client";
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar, 
  Chip, 
  IconButton,
  Drawer,
  List,
  ListItem,
  Button,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Calendar,
  Star,
  Users,
  DollarSign,
  FileText,
  Image as LucideImage,
  MessageCircle,
  MoreHorizontal,
  Activity,
  TrendingUp
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'puja' | 'astrology' | 'user' | 'payment' | 'blog' | 'gallery' | 'contact';
  title: string;
  description: string;
  time: string;
  user: string;
  avatar?: string;
  amount?: string;
  status?: 'success' | 'pending' | 'failed';
}

const ProfessionalActivitiesWidget: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const recentActivities: Activity[] = [
    {
      id: '1',
      type: 'puja',
      title: 'New Puja Booking',
      description: 'Ganesh Puja booked for Dec 15th',
      time: '2 minutes ago',
      user: 'Rajesh Kumar',
      avatar: 'R',
      amount: '₹5,000',
      status: 'success',
    },
    {
      id: '2',
      type: 'astrology',
      title: 'Astrology Consultation',
      description: 'Birth chart reading scheduled',
      time: '5 minutes ago',
      user: 'Priya Singh',
      avatar: 'P',
      amount: '₹2,000',
      status: 'pending',
    },
    {
      id: '3',
      type: 'user',
      title: 'New User Registration',
      description: 'User profile created and verified',
      time: '15 minutes ago',
      user: 'Amit Patel',
      avatar: 'A',
      status: 'success',
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Received',
      description: 'Satyanarayan Puja payment confirmed',
      time: '30 minutes ago',
      user: 'Sunita Devi',
      avatar: 'S',
      amount: '₹8,000',
      status: 'success',
    },
    {
      id: '5',
      type: 'blog',
      title: 'New Blog Post',
      description: 'Article about Diwali preparations published',
      time: '1 hour ago',
      user: 'Admin',
      avatar: 'A',
      status: 'success',
    },
  ];

  const allActivities: Activity[] = [
    ...recentActivities,
    {
      id: '6',
      type: 'gallery',
      title: 'Gallery Updated',
      description: 'New puja images added to gallery',
      time: '2 hours ago',
      user: 'Content Team',
      avatar: 'C',
      status: 'success',
    },
    {
      id: '7',
      type: 'contact',
      title: 'Contact Inquiry',
      description: 'Wedding puja inquiry received',
      time: '3 hours ago',
      user: 'Vikram Sharma',
      avatar: 'V',
      status: 'pending',
    },
    {
      id: '8',
      type: 'puja',
      title: 'Booking Completed',
      description: 'Griha Pravesh Puja successfully completed',
      time: '4 hours ago',
      user: 'Meera Joshi',
      avatar: 'M',
      amount: '₹15,000',
      status: 'success',
    },
    {
      id: '9',
      type: 'astrology',
      title: 'Consultation Completed',
      description: 'Kundali matching session finished',
      time: '5 hours ago',
      user: 'Rahul Gupta',
      avatar: 'R',
      amount: '₹3,500',
      status: 'success',
    },
    {
      id: '10',
      type: 'payment',
      title: 'Refund Processed',
      description: 'Refund issued for cancelled booking',
      time: '6 hours ago',
      user: 'System',
      avatar: 'S',
      amount: '₹2,500',
      status: 'success',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'puja':
        return { icon: <Calendar size={16} />, color: 'bg-orange-500' };
      case 'astrology':
        return { icon: <Star size={16} />, color: 'bg-purple-500' };
      case 'user':
        return { icon: <Users size={16} />, color: 'bg-blue-500' };
      case 'payment':
        return { icon: <DollarSign size={16} />, color: 'bg-green-500' };
      case 'blog':
        return { icon: <FileText size={16} />, color: 'bg-cyan-500' };
      case 'gallery':
        return { icon: <LucideImage size={16} aria-label="Gallery" />, color: 'bg-lime-500' };
      case 'contact':
        return { icon: <MessageCircle size={16} />, color: 'bg-yellow-500' };
      default:
        return { icon: <Activity size={16} />, color: 'bg-gray-500' };
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="shadow-sm border border-gray-100 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Recent Activities</h3>
                <p className="text-sm text-gray-600">Latest platform activities and updates</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  <span className="text-xs font-medium">Live</span>
                </div>
                <IconButton size="small" className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={16} />
                </IconButton>
              </div>
            </div>

            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity, index) => {
                const activityConfig = getActivityIcon(activity.type);
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-3 relative group"
                  >
                    {/* Timeline line */}
                    {index !== recentActivities.slice(0, 5).length - 1 && (
                      <div className="absolute left-5 top-12 w-0.5 h-8 bg-gray-200"></div>
                    )}

                    {/* Activity Icon */}
                    <div className={`${activityConfig.color} text-white rounded-full p-2 flex-shrink-0 relative z-10`}>
                      {activityConfig.icon}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                            {activity.status && (
                              <Chip
                                label={activity.status}
                                size="small"
                                color={getStatusColor(activity.status) as any}
                                className="h-5 text-xs"
                              />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Avatar className="w-4 h-4 text-xs">
                                {activity.avatar}
                              </Avatar>
                              <span className="text-xs text-gray-500">{activity.user}</span>
                            </div>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                        </div>
                        {activity.amount && (
                          <div className="text-right flex-shrink-0 ml-2">
                            <span className="text-sm font-semibold text-blue-600">{activity.amount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setDrawerOpen(true)}
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                View All Activities
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activities Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '85vh',
          },
        }}
      >
        <div className="p-6">
          {/* Drawer Handle */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">All Activities</h2>
              <p className="text-sm text-gray-600 mt-1">Complete timeline of platform activities</p>
            </div>
            <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <TrendingUp size={14} />
              <span className="text-sm font-medium">Live Updates</span>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-4">
            {allActivities.map((activity, index) => {
              const activityConfig = getActivityIcon(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`${activityConfig.color} text-white rounded-full p-2 flex-shrink-0`}>
                    {activityConfig.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                          {activity.status && (
                            <Chip
                              label={activity.status}
                              size="small"
                              color={getStatusColor(activity.status) as any}
                              className="h-5 text-xs"
                            />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Avatar className="w-4 h-4 text-xs">
                              {activity.avatar}
                            </Avatar>
                            <span className="text-xs text-gray-500">{activity.user}</span>
                          </div>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                      {activity.amount && (
                        <div className="text-right flex-shrink-0 ml-2">
                          <span className="text-sm font-semibold text-blue-600">{activity.amount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Button
              variant="contained"
              fullWidth
              onClick={() => setDrawerOpen(false)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Close
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ProfessionalActivitiesWidget;
