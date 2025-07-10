"use client";
import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Chip, Avatar, AvatarGroup } from '@mui/material';
import { motion } from 'framer-motion';
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const PlatformHealthWidget: React.FC = () => {
  const healthMetrics = [
    {
      label: 'System Status',
      value: 'Operational',
      status: 'success',
      icon: <CheckIcon />,
      description: 'All systems running smoothly',
    },
    {
      label: 'API Response Time',
      value: '245ms',
      status: 'success',
      icon: <TrendingUpIcon />,
      description: 'Average response time',
    },
    {
      label: 'Active Users (24h)',
      value: '456',
      status: 'info',
      icon: <PeopleIcon />,
      description: 'Users online in last 24h',
    },
    {
      label: 'Pending Reviews',
      value: '12',
      status: 'warning',
      icon: <StarIcon />,
      description: 'Priest applications pending',
    },
  ];

  const serverMetrics = [
    { name: 'CPU Usage', value: 45, color: '#4f46e5' },
    { name: 'Memory Usage', value: 67, color: '#ff6b35' },
    { name: 'Disk Usage', value: 34, color: '#059669' },
    { name: 'Network I/O', value: 78, color: '#8b5cf6' },
  ];

  const recentActivity = [
    { user: 'Rajesh K.', action: 'New puja booking', time: '2 min ago', avatar: 'R' },
    { user: 'Priya S.', action: 'Astrology consultation', time: '5 min ago', avatar: 'P' },
    { user: 'Admin', action: 'System backup complete', time: '1 hour ago', avatar: 'A' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return { color: '#059669', bg: '#05966920' };
      case 'warning':
        return { color: '#f7931e', bg: '#f7931e20' };
      case 'error':
        return { color: '#ef4444', bg: '#ef444420' };
      default:
        return { color: '#6b7280', bg: '#6b728020' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card sx={{ borderRadius: 3, height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Platform Health
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System status and performance
              </Typography>
            </Box>
            <Chip
              label="Live"
              size="small"
              sx={{
                backgroundColor: '#05966920',
                color: '#059669',
                fontWeight: 'bold',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                },
              }}
            />
          </Box>

          {/* Health Metrics */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Health Metrics
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {healthMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: getStatusColor(metric.status).bg,
                      border: `1px solid ${getStatusColor(metric.status).color}30`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: getStatusColor(metric.status).color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        {React.cloneElement(metric.icon, { sx: { fontSize: 16 } })}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="medium">
                            {metric.label}
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" color={getStatusColor(metric.status).color}>
                            {metric.value}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {metric.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>

          {/* Server Metrics */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Server Performance
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {serverMetrics.map((metric, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {metric.name}
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {metric.value}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: `${metric.color}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: metric.color,
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Recent Activity */}
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      {activity.avatar}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="caption" color="text.primary">
                        <strong>{activity.user}</strong> {activity.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlatformHealthWidget;
