'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  Add as AddIcon,
  EventNote as EventNoteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface EventListHeaderProps {
  onCreateNew: () => void;
  onRefresh: () => void;
  loading: boolean;
  totalCount: number;
}

const EventListHeader: React.FC<EventListHeaderProps> = ({
  onCreateNew,
  onRefresh,
  loading,
  totalCount,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Paper
        elevation={3}
        className="p-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white rounded-2xl overflow-hidden relative"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Side - Title and Description */}
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <EventNoteIcon className="w-8 h-8 mr-3" />
                <Typography variant="h4" className="font-bold">
                  Festive Events Calendar
                </Typography>
              </div>
              
              <Typography variant="h6" className="opacity-90 mb-1">
                Enterprise Event Management System
              </Typography>
              
              <Typography variant="body1" className="opacity-80 max-w-2xl">
                Manage your year-round festive calendar with professional tools. 
                Create, organize, and track events with advanced filtering and analytics.
              </Typography>
              
              {/* Stats */}
              <div className="mt-4 flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  <Typography variant="body2" className="opacity-90">
                    {loading ? (
                      <Skeleton width={80} className="bg-white/20" />
                    ) : (
                      `${totalCount} Total Events`
                    )}
                  </Typography>
                </div>
                
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                  <Typography variant="body2" className="opacity-90">
                    Live Management
                  </Typography>
                </div>
                
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                  <Typography variant="body2" className="opacity-90">
                    Real-time Updates
                  </Typography>
                </div>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outlined"
                onClick={onRefresh}
                disabled={loading}
                className="text-white border-white/30 hover:border-white hover:bg-white/10"
                startIcon={
                  <RefreshIcon className={loading ? 'animate-spin' : ''} />
                }
              >
                Refresh
              </Button>
              
              <Button
                variant="contained"
                onClick={onCreateNew}
                className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
                startIcon={<AddIcon />}
                size="large"
              >
                Create New Event
              </Button>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="opacity-80">
                <Typography variant="h6" className="font-bold">
                  🎯
                </Typography>
                <Typography variant="caption" className="block">
                  Smart Filtering
                </Typography>
              </div>
              
              <div className="opacity-80">
                <Typography variant="h6" className="font-bold">
                  📊
                </Typography>
                <Typography variant="caption" className="block">
                  Analytics
                </Typography>
              </div>
              
              <div className="opacity-80">
                <Typography variant="h6" className="font-bold">
                  🔄
                </Typography>
                <Typography variant="caption" className="block">
                  Real-time Sync
                </Typography>
              </div>
              
              <div className="opacity-80">
                <Typography variant="h6" className="font-bold">
                  📱
                </Typography>
                <Typography variant="caption" className="block">
                  Responsive
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    </motion.div>
  );
};

export default EventListHeader;
