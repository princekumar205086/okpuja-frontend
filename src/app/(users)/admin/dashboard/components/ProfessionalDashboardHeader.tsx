"use client";
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Avatar, 
  Chip, 
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  RefreshCw,
  Download,
  Settings,
  Bell,
  User,
  LogOut,
  HelpCircle,
  Menu as MenuIcon
} from 'lucide-react';
import { useAuthStore } from '@/app/stores/authStore';

const ProfessionalDashboardHeader: React.FC = () => {
  const { user } = useAuthStore();
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info'}>({
    open: false,
    message: '',
    severity: 'info'
  });
  
  const currentTime = new Date().toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleRefresh = () => {
    setSnackbar({
      open: true,
      message: 'Dashboard refreshed successfully!',
      severity: 'success'
    });
    // Add actual refresh logic here
    window.location.reload();
  };

  const handleExport = () => {
    setSnackbar({
      open: true,
      message: 'Exporting dashboard data...',
      severity: 'info'
    });
    // Add actual export logic here
  };

  const handleSettings = () => {
    setSnackbar({
      open: true,
      message: 'Opening settings...',
      severity: 'info'
    });
    // Add navigation to settings page
  };

  const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const notifications = [
    { id: 1, title: 'New Puja Booking', message: 'Rajesh Kumar booked Ganesh Puja', time: '5 min ago', type: 'booking' },
    { id: 2, title: 'Payment Received', message: '₹5,000 received for booking PB001', time: '15 min ago', type: 'payment' },
    { id: 3, title: 'Priest Approval', message: 'New priest registration pending', time: '1 hour ago', type: 'approval' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  नमस्ते, {user?.full_name || 'Admin'} 🙏
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Welcome to OKPUJA Admin Dashboard
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Action Buttons */}
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshCw size={16} />}
                  onClick={handleRefresh}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Refresh
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download size={16} />}
                  onClick={handleExport}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Export
                </Button>
                
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Settings size={16} />}
                  onClick={handleSettings}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Settings
                </Button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <IconButton
                  onClick={() => setNotificationDrawerOpen(true)}
                  className="relative p-2 text-gray-600 hover:bg-gray-100"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </IconButton>
              </div>

              {/* Profile */}
              <div className="relative">
                <IconButton
                  onClick={handleProfileMenuClick}
                  className="p-1"
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main',
                      fontSize: '14px'
                    }}
                  >
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                  </Avatar>
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                <Chip
                  label="All Systems Operational"
                  color="success"
                  size="small"
                  className="text-xs font-medium"
                />
                <Chip
                  label="12 Pending Approvals"
                  color="warning"
                  size="small"
                  className="text-xs font-medium"
                />
                <Chip
                  label="456 Active Users"
                  color="info"
                  size="small"
                  className="text-xs font-medium hidden sm:inline-flex"
                />
              </div>
              <Typography variant="caption" className="text-gray-500 text-xs">
                Last updated: {new Date().toLocaleTimeString('en-IN')}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            minWidth: 200
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose} className="flex items-center space-x-2">
          <User size={16} />
          <span>Profile</span>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose} className="flex items-center space-x-2">
          <Settings size={16} />
          <span>Settings</span>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose} className="flex items-center space-x-2">
          <HelpCircle size={16} />
          <span>Help & Support</span>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileMenuClose} className="flex items-center space-x-2 text-red-600">
          <LogOut size={16} />
          <span>Sign Out</span>
        </MenuItem>
      </Menu>

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            borderTopLeftRadius: { xs: 16, sm: 0 },
            borderBottomLeftRadius: { xs: 16, sm: 0 },
          },
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <IconButton
              onClick={() => setNotificationDrawerOpen(false)}
              size="small"
            >
              ×
            </IconButton>
          </div>
          
          <List>
            {notifications.map((notification, index) => (
              <ListItem key={notification.id} className="px-0">
                <div className="w-full">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'booking' ? 'bg-blue-500' :
                      notification.type === 'payment' ? 'bg-green-500' : 'bg-orange-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
          
          <Button
            variant="outlined"
            fullWidth
            className="mt-4"
            onClick={() => setNotificationDrawerOpen(false)}
          >
            View All Notifications
          </Button>
        </div>
      </Drawer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default ProfessionalDashboardHeader;
