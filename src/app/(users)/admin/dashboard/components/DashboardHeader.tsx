"use client";
import React from 'react';
import { Box, Typography, Button, Avatar, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  GetApp as ExportIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/app/stores/authStore';

const DashboardHeader: React.FC = () => {
  const { user } = useAuthStore();
  
  const currentTime = new Date().toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        {/* Responsive layout using Tailwind instead of MUI Grid */}
        <div className="flex flex-wrap -mx-3 items-center">
          <div className="w-full md:w-8/12 px-3">
            <div className="flex items-center gap-3">
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  नमस्ते, {user?.full_name || 'Admin'} 🙏
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Welcome to OKPUJA Admin Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentTime}
                </Typography>
              </Box>
            </div>
          </div>

          <div className="w-full md:w-4/12 px-3">
            <div className="flex items-center gap-2 justify-start md:justify-end">
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                className="hidden sm:flex"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Refresh
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<ExportIcon />}
                className="hidden sm:flex"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Export
              </Button>
              
              <Button
                variant="contained"
                size="small"
                startIcon={<SettingsIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #4338ca, #6d28d9)',
                  },
                }}
              >
                Settings
              </Button>
              
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  cursor: 'pointer',
                  border: '2px solid #4f46e5',
                }}
              >
                {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
              </Avatar>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <Box 
          sx={{ 
            mt: 3, 
            p: 2, 
            borderRadius: 2, 
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Chip
            label="All Systems Operational"
            color="success"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          <Chip
            label="12 Pending Approvals"
            color="warning"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          <Chip
            label="456 Active Users"
            color="info"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleTimeString('en-IN')}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default DashboardHeader;
