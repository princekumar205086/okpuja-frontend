'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  TableRows as TableIcon,
  ViewModule as CardIcon,
  Refresh as RefreshIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAstrologyServiceStore } from '@/app/stores/astrologyServiceStore';

const AstrologyServiceHeader: React.FC = () => {
  const {
    services,
    totalCount,
    loading,
    viewMode,
    setViewMode,
    openDrawer,
    fetchServices,
    currentPage,
  } = useAstrologyServiceStore();

  const activeServices = services.filter(service => service.is_active);
  const inactiveServices = services.filter(service => !service.is_active);

  const handleRefresh = () => {
    fetchServices({ page: currentPage });
  };

  const handleCreateNew = () => {
    openDrawer('create');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={0} 
        className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100"
      >
        <Box className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Stats */}
          <Box className="flex-1">
            <Box className="flex items-center gap-3 mb-2">
              <Box className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <AnalyticsIcon className="text-purple-600" fontSize="large" />
              </Box>
              <Box>
                <Typography 
                  variant="h4" 
                  className="font-bold text-gray-800 flex items-center gap-2"
                >
                  Astrology Services
                  <motion.div
                    animate={{ rotate: loading ? 360 : 0 }}
                    transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
                  >
                    <Tooltip title="Refresh">
                      <IconButton 
                        onClick={handleRefresh}
                        disabled={loading}
                        size="small"
                        className="text-gray-600 hover:text-purple-600"
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </motion.div>
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Manage your astrology services and offerings
                </Typography>
              </Box>
            </Box>

            {/* Stats */}
            <Stack direction="row" spacing={2} className="mt-4 flex-wrap">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Chip
                  label={`Total: ${totalCount}`}
                  variant="outlined"
                  className="bg-white border-gray-300 text-gray-700 font-medium"
                />
              </motion.div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Chip
                  label={`Active: ${activeServices.length}`}
                  variant="outlined"
                  className="bg-green-50 border-green-300 text-green-700 font-medium"
                />
              </motion.div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Chip
                  label={`Inactive: ${inactiveServices.length}`}
                  variant="outlined"
                  className="bg-red-50 border-red-300 text-red-700 font-medium"
                />
              </motion.div>
            </Stack>
          </Box>

          {/* Actions */}
          <Box className="flex flex-col sm:flex-row gap-3">
            {/* View Mode Toggle */}
            <Box className="flex bg-white rounded-lg p-1 border border-gray-200">
              <Tooltip title="Table View">
                <IconButton
                  onClick={() => setViewMode('table')}
                  className={`transition-all duration-200 ${
                    viewMode === 'table'
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                  size="small"
                >
                  <TableIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Card View">
                <IconButton
                  onClick={() => setViewMode('card')}
                  className={`transition-all duration-200 ${
                    viewMode === 'card'
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                  size="small"
                >
                  <CardIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Create Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2.5 font-medium"
              >
                Add Service
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default AstrologyServiceHeader;
