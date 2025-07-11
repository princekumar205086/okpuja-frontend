import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Paper,
  Typography,
  Collapse,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { usePujaServiceStore, ServiceType } from '../../../stores/pujaServiceStore';
import { serviceTypeOptions, debounce } from './utils';

interface ServiceFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({ onFiltersChange }) => {
  const {
    searchTerm,
    filters,
    categories,
    setSearchTerm,
    setFilters,
    fetchCategories,
  } = usePujaServiceStore();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Debounced search function
  const debouncedSearch = debounce((term: string) => {
    setSearchTerm(term);
    onFiltersChange({ search: term, ...localFilters });
  }, 500);

  // Load categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    setFilters(newFilters);
    onFiltersChange({ search: localSearchTerm, ...newFilters });
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    setLocalSearchTerm('');
    setFilters(clearedFilters);
    setSearchTerm('');
    onFiltersChange({ search: '', ...clearedFilters });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return localSearchTerm || 
           localFilters.category || 
           localFilters.type || 
           localFilters.is_active !== undefined;
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (localSearchTerm) count++;
    if (localFilters.category) count++;
    if (localFilters.type) count++;
    if (localFilters.is_active !== undefined) count++;
    return count;
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search services by title, description, or category..."
          value={localSearchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: localSearchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleSearchChange('')}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Box>

      {/* Filter Toggle Button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          endIcon={filtersExpanded ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          size="small"
        >
          Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
        </Button>

        {hasActiveFilters() && (
          <Button
            variant="text"
            startIcon={<Clear />}
            onClick={handleClearFilters}
            size="small"
            color="error"
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Expanded Filters */}
      <Collapse in={filtersExpanded}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 2,
          mt: 2,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          {/* Category Filter */}
          <FormControl size="small" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={localFilters.category || ''}
              label="Category"
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Service Type Filter */}
          <FormControl size="small" fullWidth>
            <InputLabel>Service Type</InputLabel>
            <Select
              value={localFilters.type || ''}
              label="Service Type"
              onChange={(e) => handleFilterChange('type', e.target.value as ServiceType || undefined)}
            >
              <MenuItem value="">All Types</MenuItem>
              {serviceTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status Filter */}
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={localFilters.is_active !== undefined ? localFilters.is_active.toString() : ''}
              label="Status"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('is_active', value === '' ? undefined : value === 'true');
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Active Filters:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {localSearchTerm && (
                <Chip
                  label={`Search: "${localSearchTerm}"`}
                  size="small"
                  onDelete={() => handleSearchChange('')}
                />
              )}
              {localFilters.category && (
                <Chip
                  label={`Category: ${categories.find(c => c.id === localFilters.category)?.name}`}
                  size="small"
                  onDelete={() => handleFilterChange('category', undefined)}
                />
              )}
              {localFilters.type && (
                <Chip
                  label={`Type: ${serviceTypeOptions.find(t => t.value === localFilters.type)?.label}`}
                  size="small"
                  onDelete={() => handleFilterChange('type', undefined)}
                />
              )}
              {localFilters.is_active !== undefined && (
                <Chip
                  label={`Status: ${localFilters.is_active ? 'Active' : 'Inactive'}`}
                  size="small"
                  onDelete={() => handleFilterChange('is_active', undefined)}
                />
              )}
            </Box>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
};

export default ServiceFilters;
