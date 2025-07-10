"use client";
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Chip, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import {
  AutoAwesome as PujaIcon,
  Star as AstrologyIcon,
  People as UserIcon,
  Payment as PaymentIcon,
  Create as BlogIcon,
  Image as GalleryIcon,
  ContactMail as ContactIcon,
  MoreHoriz as MoreIcon,
} from '@mui/icons-material';

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

const RecentActivitiesWidget: React.FC = () => {
  const activities: Activity[] = [
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
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'puja':
        return { icon: <PujaIcon />, color: '#ff6b35' };
      case 'astrology':
        return { icon: <AstrologyIcon />, color: '#8b5cf6' };
      case 'user':
        return { icon: <UserIcon />, color: '#4f46e5' };
      case 'payment':
        return { icon: <PaymentIcon />, color: '#059669' };
      case 'blog':
        return { icon: <BlogIcon />, color: '#06b6d4' };
      case 'gallery':
        return { icon: <GalleryIcon />, color: '#84cc16' };
      case 'contact':
        return { icon: <ContactIcon />, color: '#f7931e' };
      default:
        return { icon: <MoreIcon />, color: '#6b7280' };
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return { color: '#059669', bg: '#05966920' };
      case 'pending':
        return { color: '#f7931e', bg: '#f7931e20' };
      case 'failed':
        return { color: '#ef4444', bg: '#ef444420' };
      default:
        return { color: '#6b7280', bg: '#6b728020' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card sx={{ borderRadius: 3, height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Latest platform activities and updates
              </Typography>
            </Box>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <MoreIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 2,
                    px: 1,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                    },
                    transition: 'background-color 0.2s ease',
                    position: 'relative',
                  }}
                >
                  {/* Timeline line */}
                  {index !== activities.length - 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 22,
                        top: 50,
                        width: 2,
                        height: 24,
                        backgroundColor: '#e5e7eb',
                        zIndex: 0,
                      }}
                    />
                  )}

                  {/* Activity Icon */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: `${getActivityIcon(activity.type).color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative',
                      zIndex: 1,
                      border: `2px solid ${getActivityIcon(activity.type).color}30`,
                    }}
                  >
                    {React.cloneElement(getActivityIcon(activity.type).icon, {
                      sx: { fontSize: 18, color: getActivityIcon(activity.type).color },
                    })}
                  </Box>

                  {/* Activity Content */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="medium" noWrap>
                        {activity.title}
                      </Typography>
                      {activity.status && (
                        <Chip
                          label={activity.status}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: 10,
                            backgroundColor: getStatusColor(activity.status).bg,
                            color: getStatusColor(activity.status).color,
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      {activity.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 16, height: 16, fontSize: 10 }}>
                        {activity.avatar}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {activity.user}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        •
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Amount */}
                  {activity.amount && (
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {activity.amount}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              View all activities
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentActivitiesWidget;
