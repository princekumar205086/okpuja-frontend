'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  Paper,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { Event } from '../../../../stores/eventStore';
import EventCard from './EventCard';

interface EventGridProps {
  events: Event[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCreateNew: () => void;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
  onView: (event: Event) => void;
  onRefresh: () => void;
}

const EventGrid: React.FC<EventGridProps> = ({
  events,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onCreateNew,
  onEdit,
  onDelete,
  onView,
  onRefresh,
}) => {
  // Loading skeleton
  if (loading && events.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Paper className="h-full overflow-hidden">
                <Skeleton
                  variant="rectangular"
                  height={200}
                  className="w-full"
                />
                <div className="p-4 space-y-2">
                  <Skeleton variant="text" height={32} width="80%" />
                  <Skeleton variant="text" height={20} width="100%" />
                  <Skeleton variant="text" height={20} width="100%" />
                  <Skeleton variant="text" height={20} width="60%" />
                  <div className="flex justify-between items-center mt-4">
                    <Skeleton variant="text" height={20} width="40%" />
                    <Skeleton variant="text" height={20} width="30%" />
                  </div>
                </div>
              </Paper>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Alert
          severity="error"
          className="mb-6 text-left"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={onRefresh}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </motion.div>
    );
  }

  // Empty state
  if (!loading && events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <Paper elevation={2} className="p-12 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-md mx-auto">
            {/* Empty State Illustration */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Typography variant="h2" className="text-purple-400">
                  🎉
                </Typography>
              </div>
            </div>

            <Typography variant="h5" className="font-bold text-gray-700 mb-3">
              No Events Found
            </Typography>
            
            <Typography variant="body1" className="text-gray-500 mb-6">
              Start building your festive calendar by creating your first event. 
              You can add images, set dates, and manage everything from here.
            </Typography>

            <div className="space-y-3">
              <Button
                variant="contained"
                size="large"
                onClick={onCreateNew}
                startIcon={<AddIcon />}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
              >
                Create Your First Event
              </Button>
              
              <div className="text-center">
                <Button
                  variant="text"
                  size="small"
                  onClick={onRefresh}
                  startIcon={<RefreshIcon />}
                  className="text-gray-500"
                >
                  Refresh Events
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Loading Overlay for Pagination */}
      {loading && events.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
        >
          <Paper elevation={3} className="p-6 rounded-2xl">
            <div className="flex items-center space-x-4">
              <CircularProgress size={32} />
              <Typography variant="body1" className="font-medium">
                Loading events...
              </Typography>
            </div>
          </Paper>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-8"
        >
          <Paper elevation={2} className="p-4 rounded-xl">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => onPageChange(page)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              className="flex justify-center"
            />
          </Paper>
        </motion.div>
      )}

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <Typography variant="body2" className="text-gray-500">
          Showing {events.length} events
          {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
        </Typography>
      </motion.div>
    </div>
  );
};

export default EventGrid;
