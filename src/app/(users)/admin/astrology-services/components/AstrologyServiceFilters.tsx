'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Collapse,
  Stack,
  Button,
  Slider,
  Typography,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAstrologyServiceStore, SERVICE_TYPE_OPTIONS } from '@/app/stores/astrologyServiceStore';
import { useDebounce } from '@/app/hooks/useDebounce';

const AstrologyServiceFilters: React.FC = () => {
  const {
    searchTerm,
    filters,
    loading,
    setSearchTerm,
    setFilters,
    clearFilters,
    fetchServices,
    currentPage,
  } = useAstrologyServiceStore();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [durationRange, setDurationRange] = useState<number[]>([15, 180]);

  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  // Handle search
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setSearchTerm(debouncedSearchTerm);
      fetchServices({ page: 1, search: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm, searchTerm, setSearchTerm, fetchServices]);

  // Initialize price and duration ranges from filters
  useEffect(() => {
    if (filters.price_min !== undefined || filters.price_max !== undefined) {
      setPriceRange([filters.price_min || 0, filters.price_max || 10000]);
    }
    if (filters.duration_min !== undefined || filters.duration_max !== undefined) {
      setDurationRange([filters.duration_min || 15, filters.duration_max || 180]);
    }
  }, [filters]);

  const handleServiceTypeChange = (value: string) => {
    setFilters({ service_type: value as any });
    fetchServices({ page: 1 });
  };

  const handleStatusChange = (value: string) => {
    const isActive = value === 'active' ? true : value === 'inactive' ? false : undefined;
    setFilters({ is_active: isActive });
    fetchServices({ page: 1 });
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handlePriceRangeCommitted = (event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setFilters({ price_min: min, price_max: max });
    fetchServices({ page: 1 });
  };

  const handleDurationRangeChange = (event: Event, newValue: number | number[]) => {
    setDurationRange(newValue as number[]);
  };

  const handleDurationRangeCommitted = (event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setFilters({ duration_min: min, duration_max: max });
    fetchServices({ page: 1 });
  };

  const handleClearFilters = () => {
    setLocalSearchTerm('');
    setPriceRange([0, 10000]);
    setDurationRange([15, 180]);
    clearFilters();
    fetchServices({ page: 1, search: '' });
  };

  const activeFiltersCount = Object.keys(filters).length + (searchTerm ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper elevation={0} className="border border-gray-200">
        {/* Search and Quick Filters */}
        <Box className="p-4">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            {/* Search */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search services by title, type, or description..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: localSearchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setLocalSearchTerm('')}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="bg-white"
            />

            {/* Service Type Filter */}
            <FormControl variant="outlined" className="min-w-[180px]">
              <InputLabel>Service Type</InputLabel>
              <Select
                value={filters.service_type || ''}
                onChange={(e) => handleServiceTypeChange(e.target.value)}
                label="Service Type"
                disabled={loading}
              >
                <MenuItem value="">
                  <em>All Types</em>
                </MenuItem>
                {SERVICE_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl variant="outlined" className="min-w-[140px]">
              <InputLabel>Status</InputLabel>
              <Select
                value={
                  filters.is_active === true 
                    ? 'active' 
                    : filters.is_active === false 
                    ? 'inactive' 
                    : ''
                }
                onChange={(e) => handleStatusChange(e.target.value)}
                label="Status"
                disabled={loading}
              >
                <MenuItem value="">
                  <em>All Status</em>
                </MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            {/* Advanced Filters Toggle */}
            <Box className="flex items-center gap-2">
              <Button
                startIcon={<FilterIcon />}
                endIcon={expandedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setExpandedFilters(!expandedFilters)}
                variant={activeFiltersCount > 0 ? "contained" : "outlined"}
                size="small"
                className={activeFiltersCount > 0 ? "bg-purple-600" : ""}
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>

              {activeFiltersCount > 0 && (
                <IconButton
                  onClick={handleClearFilters}
                  size="small"
                  className="text-gray-500 hover:text-red-500"
                >
                  <ClearIcon />
                </IconButton>
              )}
            </Box>
          </Stack>
        </Box>

        {/* Advanced Filters */}
        <Collapse in={expandedFilters}>
          <Box className="px-4 pb-4 border-t border-gray-100">
            <Stack spacing={3} className="pt-4">
              {/* Price Range */}
              <Box>
                <Typography variant="subtitle2" className="mb-2 text-gray-700">
                  Price Range (₹)
                </Typography>
                <Box className="px-2">
                  <Slider
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    onChangeCommitted={handlePriceRangeCommitted}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10000}
                    step={100}
                    marks={[
                      { value: 0, label: '₹0' },
                      { value: 2500, label: '₹2.5K' },
                      { value: 5000, label: '₹5K' },
                      { value: 7500, label: '₹7.5K' },
                      { value: 10000, label: '₹10K' },
                    ]}
                    className="text-purple-600"
                  />
                </Box>
              </Box>

              {/* Duration Range */}
              <Box>
                <Typography variant="subtitle2" className="mb-2 text-gray-700">
                  Duration Range (minutes)
                </Typography>
                <Box className="px-2">
                  <Slider
                    value={durationRange}
                    onChange={handleDurationRangeChange}
                    onChangeCommitted={handleDurationRangeCommitted}
                    valueLabelDisplay="auto"
                    min={15}
                    max={180}
                    step={15}
                    marks={[
                      { value: 15, label: '15m' },
                      { value: 60, label: '1h' },
                      { value: 120, label: '2h' },
                      { value: 180, label: '3h' },
                    ]}
                    className="text-purple-600"
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        </Collapse>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <Box className="px-4 pb-4">
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => {
                    setLocalSearchTerm('');
                    setSearchTerm('');
                    fetchServices({ page: 1, search: '' });
                  }}
                  size="small"
                  variant="outlined"
                  className="bg-blue-50 border-blue-200 text-blue-700"
                />
              )}
              {filters.service_type && (
                <Chip
                  label={`Type: ${SERVICE_TYPE_OPTIONS.find(opt => opt.value === filters.service_type)?.label}`}
                  onDelete={() => {
                    setFilters({ service_type: undefined });
                    fetchServices({ page: 1 });
                  }}
                  size="small"
                  variant="outlined"
                  className="bg-purple-50 border-purple-200 text-purple-700"
                />
              )}
              {filters.is_active !== undefined && (
                <Chip
                  label={`Status: ${filters.is_active ? 'Active' : 'Inactive'}`}
                  onDelete={() => {
                    setFilters({ is_active: undefined });
                    fetchServices({ page: 1 });
                  }}
                  size="small"
                  variant="outlined"
                  className="bg-green-50 border-green-200 text-green-700"
                />
              )}
              {(filters.price_min !== undefined || filters.price_max !== undefined) && (
                <Chip
                  label={`Price: ₹${filters.price_min || 0} - ₹${filters.price_max || 10000}`}
                  onDelete={() => {
                    setFilters({ price_min: undefined, price_max: undefined });
                    setPriceRange([0, 10000]);
                    fetchServices({ page: 1 });
                  }}
                  size="small"
                  variant="outlined"
                  className="bg-yellow-50 border-yellow-200 text-yellow-700"
                />
              )}
              {(filters.duration_min !== undefined || filters.duration_max !== undefined) && (
                <Chip
                  label={`Duration: ${filters.duration_min || 15}m - ${filters.duration_max || 180}m`}
                  onDelete={() => {
                    setFilters({ duration_min: undefined, duration_max: undefined });
                    setDurationRange([15, 180]);
                    fetchServices({ page: 1 });
                  }}
                  size="small"
                  variant="outlined"
                  className="bg-orange-50 border-orange-200 text-orange-700"
                />
              )}
            </Stack>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default AstrologyServiceFilters;
