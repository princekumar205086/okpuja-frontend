'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { EventFilters, EventStatus } from '../../../../stores/eventStore';

interface EventFiltersBarProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  onRefresh: () => void;
  loading: boolean;
  totalCount: number;
}

const EventFiltersBar: React.FC<EventFiltersBarProps> = ({
  filters,
  onFiltersChange,
  onRefresh,
  loading,
  totalCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState<EventFilters>(filters);

  const statusOptions: { value: EventStatus; label: string; color: string }[] = [
    { value: 'DRAFT', label: 'Draft', color: '#9e9e9e' },
    { value: 'PUBLISHED', label: 'Published', color: '#4caf50' },
    { value: 'CANCELLED', label: 'Cancelled', color: '#f44336' },
    { value: 'COMPLETED', label: 'Completed', color: '#2196f3' },
  ];

  const handleLocalFilterChange = (key: keyof EventFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Apply filters immediately for search
    if (key === 'search') {
      onFiltersChange(newFilters);
    }
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters: EventFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof EventFilters];
    return value !== undefined && value !== '' && value !== null;
  });

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.status) count++;
    if (filters.is_featured !== undefined) count++;
    if (filters.date_range) count++;
    if (filters.search) count++;
    return count;
  };

  return (
    <Paper elevation={2} className="p-4 mb-6 bg-gradient-to-r from-white to-gray-50">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FilterIcon className="text-gray-600" />
            <Typography variant="h6" className="font-semibold text-gray-800">
              Filters & Search
            </Typography>
            {hasActiveFilters && (
              <Chip
                label={`${getActiveFilterCount()} active`}
                size="small"
                color="primary"
                className="ml-2"
              />
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Typography variant="body2" className="text-gray-600">
              {totalCount} events found
            </Typography>
            <Tooltip title="Refresh events">
              <IconButton
                onClick={onRefresh}
                disabled={loading}
                size="small"
                className={loading ? 'animate-spin' : ''}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          <TextField
            placeholder="Search events by title, description, location..."
            value={localFilters.search || ''}
            onChange={(e) => handleLocalFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: localFilters.search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleLocalFilterChange('search', '')}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className="flex-1 bg-white"
            size="small"
          />

          <Button
            variant="outlined"
            onClick={() => setShowAdvanced(!showAdvanced)}
            startIcon={<FilterIcon />}
            className="whitespace-nowrap"
          >
            Advanced Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Divider className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <FormControl size="small" fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={localFilters.status || ''}
                    onChange={(e) => handleLocalFilterChange('status', e.target.value || undefined)}
                    label="Status"
                    className="bg-white"
                  >
                    <MenuItem value="">
                      <em>All Statuses</em>
                    </MenuItem>
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: option.color }}
                          />
                          {option.label}
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Featured Filter */}
                <FormControl size="small" fullWidth>
                  <InputLabel>Featured</InputLabel>
                  <Select
                    value={localFilters.is_featured !== undefined ? localFilters.is_featured.toString() : ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleLocalFilterChange('is_featured', value === '' ? undefined : value === 'true');
                    }}
                    label="Featured"
                    className="bg-white"
                  >
                    <MenuItem value="">
                      <em>All Events</em>
                    </MenuItem>
                    <MenuItem value="true">
                      <div className="flex items-center">
                        <StarIcon className="text-yellow-500 mr-2" fontSize="small" />
                        Featured Only
                      </div>
                    </MenuItem>
                    <MenuItem value="false">
                      Regular Events
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* Date Range Start */}
                <TextField
                  label="From Date"
                  type="date"
                  value={localFilters.date_range?.start || ''}
                  onChange={(e) => {
                    const start = e.target.value;
                    handleLocalFilterChange('date_range', {
                      start,
                      end: localFilters.date_range?.end || '',
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  className="bg-white"
                />

                {/* Date Range End */}
                <TextField
                  label="To Date"
                  type="date"
                  value={localFilters.date_range?.end || ''}
                  onChange={(e) => {
                    const end = e.target.value;
                    handleLocalFilterChange('date_range', {
                      start: localFilters.date_range?.start || '',
                      end,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  className="bg-white"
                />
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  startIcon={<ClearIcon />}
                  size="small"
                >
                  Clear All
                </Button>
                
                <Button
                  variant="contained"
                  onClick={applyFilters}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="small"
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {filters.status && (
              <Chip
                label={`Status: ${filters.status}`}
                onDelete={() => handleLocalFilterChange('status', undefined)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filters.is_featured !== undefined && (
              <Chip
                label={filters.is_featured ? 'Featured Events' : 'Regular Events'}
                onDelete={() => handleLocalFilterChange('is_featured', undefined)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filters.date_range && (filters.date_range.start || filters.date_range.end) && (
              <Chip
                label={`Date: ${filters.date_range.start || 'Any'} to ${filters.date_range.end || 'Any'}`}
                onDelete={() => handleLocalFilterChange('date_range', undefined)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filters.search && (
              <Chip
                label={`Search: "${filters.search}"`}
                onDelete={() => handleLocalFilterChange('search', '')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </motion.div>
        )}
      </div>
    </Paper>
  );
};

export default EventFiltersBar;
