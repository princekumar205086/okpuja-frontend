"use client";
import React from 'react';
import { Card, CardContent, Typography, Box, Button, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import {
  People as UsersIcon,
  AutoAwesome as PujaIcon,
  Star as StarIcon,
  Payment as PaymentIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

const QuickActionsWidget: React.FC = () => {
  const quickActions = [
    {
      title: 'Add New Puja Service',
      subtitle: 'Create new puja packages',
      icon: <AddIcon />,
      color: '#ff6b35',
      gradient: 'linear-gradient(45deg, #ff6b35, #ff8a65)',
    },
    {
      title: 'Manage Priests',
      subtitle: 'Add or update priest profiles',
      icon: <StarIcon />,
      color: '#f7931e',
      gradient: 'linear-gradient(45deg, #f7931e, #ffb74d)',
    },
    {
      title: 'User Management',
      subtitle: 'View and manage users',
      icon: <UsersIcon />,
      color: '#4f46e5',
      gradient: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
    },
    {
      title: 'Payment Reports',
      subtitle: 'View financial reports',
      icon: <PaymentIcon />,
      color: '#059669',
      gradient: 'linear-gradient(45deg, #059669, #10b981)',
    },
    {
      title: 'Analytics Dashboard',
      subtitle: 'Detailed insights',
      icon: <ReportsIcon />,
      color: '#06b6d4',
      gradient: 'linear-gradient(45deg, #06b6d4, #0891b2)',
    },
    {
      title: 'System Settings',
      subtitle: 'Configure platform',
      icon: <SettingsIcon />,
      color: '#6b7280',
      gradient: 'linear-gradient(45deg, #6b7280, #9ca3af)',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card sx={{ borderRadius: 3, height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Common administrative tasks
              </Typography>
            </Box>
            <Box 
              sx={{ 
                p: 1, 
                borderRadius: 2, 
                backgroundColor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <NotificationsIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    border: `1px solid ${action.color}30`,
                    backgroundColor: `${action.color}05`,
                    '&:hover': {
                      backgroundColor: `${action.color}10`,
                      borderColor: `${action.color}50`,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: action.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0,
                      }}
                    >
                      {React.cloneElement(action.icon, { sx: { fontSize: 20 } })}
                    </Box>
                    <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                      <Typography variant="body2" fontWeight="medium" color="text.primary">
                        {action.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {action.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                </Button>
              </motion.div>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Need help with something else?
            </Typography>
            <Button
              variant="contained"
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4338ca, #6d28d9)',
                },
              }}
            >
              Contact Support
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickActionsWidget;
