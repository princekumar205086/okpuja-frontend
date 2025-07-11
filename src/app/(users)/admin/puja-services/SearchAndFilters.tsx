import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  IconButton,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  ExpandMore,
  Refresh,
} from '@mui/icons-material';
import { usePujaServiceStore, ServiceType } from '../../../stores/pujaServiceStore';
import { serviceTypeOptions, debounce } from './utils';

interface SearchAndFiltersProps {
  onFiltersChange: (filters: any) => void;
  onRefresh: () => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({ 
  onFiltersChange,
  onRefresh 
}) => {
  const {
    searchTerm,
    filters,
    categories,
    loading,
    setSearchTerm,
    setFilters,
    fetchCategories,
  } = usePujaServiceStore();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localFilters, setLocalFilters] = useState(filters);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);

  // Debounced search function
  const debouncedSearch = debounce((term: string) => {
    setSearchTerm(term);
    onFiltersChange({ search: term, ...localFilters });
  }, 300);

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
    setFilterMenuAnchor(null);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    setLocalSearchTerm('');
    setFilters(clearedFilters);
    setSearchTerm('');
    onFiltersChange({ search: '', ...clearedFilters });
    setFilterMenuAnchor(null);
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
    if (localFilters.category) count++;
    if (localFilters.type) count++;
    if (localFilters.is_active !== undefined) count++;
    return count;
  };

  const openFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const closeFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  return (
    <Paper 
      elevation={1}
      sx={{ 
        p: 2.5, 
        mb: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', md: 'center' }
      }}>
        {/* Search Field */}
        <Box sx={{ 
          flex: 1,
          minWidth: { xs: '100%', md: 300 }
        }}>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.default',
              }
            }}
          />
        </Box>

        {/* Filter Actions */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          flexWrap: { xs: 'wrap', md: 'nowrap' }
        }}>
          {/* Active Filters Display */}
          {hasActiveFilters() && (
            <Stack direction="row" spacing={1} sx={{ 
              display: { xs: 'none', sm: 'flex' },
              mr: 1 
            }}>
              {localFilters.category && (
                <Chip
                  label={`Category: ${categories.find(c => c.id === localFilters.category)?.name || localFilters.category}`}
                  size="small"
                  onDelete={() => handleFilterChange('category', '')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {localFilters.type && (
                <Chip
                  label={`Type: ${serviceTypeOptions.find(t => t.value === localFilters.type)?.label || localFilters.type}`}
                  size="small"
                  onDelete={() => handleFilterChange('type', '')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {localFilters.is_active !== undefined && (
                <Chip
                  label={`Status: ${localFilters.is_active ? 'Active' : 'Inactive'}`}
                  size="small"
                  onDelete={() => handleFilterChange('is_active', undefined)}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          )}

          {/* Filter Button */}
          <Button
            variant={getActiveFilterCount() > 0 ? "contained" : "outlined"}
            startIcon={<FilterList />}
            endIcon={<ExpandMore />}
            onClick={openFilterMenu}
            size="small"
            sx={{ 
              minWidth: 100,
              textTransform: 'none'
            }}
          >
            Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </Button>

          {/* Refresh Button */}
          <IconButton
            onClick={onRefresh}
            disabled={loading}
            size="small"
            sx={{
              bgcolor: 'action.hover',
              '&:hover': {
                bgcolor: 'action.selected',
              }
            }}
          >
            <Refresh />
          </IconButton>

          {/* Clear Filters Button */}
          {hasActiveFilters() && (
            <Button
              variant="text"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              size="small"
              color="error"
              sx={{ textTransform: 'none' }}
            >
              Clear
            </Button>
          )}
        </Box>
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={closeFilterMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { 
            width: 280,
            mt: 1
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Category Filter */}
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={localFilters.category || ''}
              label="Category"
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Service Type Filter */}
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Service Type</InputLabel>
            <Select
              value={localFilters.type || ''}
              label="Service Type"
              onChange={(e) => handleFilterChange('type', e.target.value as ServiceType)}
            >
              <MenuItem value="">
                <em>All Types</em>
              </MenuItem>
              {serviceTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <ListItemText>{option.label}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status Filter */}
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={localFilters.is_active === undefined ? '' : localFilters.is_active.toString()}
              label="Status"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('is_active', value === '' ? undefined : value === 'true');
              }}
            >
              <MenuItem value="">
                <em>All Status</em>
              </MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>

          <Divider sx={{ my: 1 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearFilters}
              startIcon={<Clear />}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={closeFilterMenu}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Menu>
    </Paper>
  );
};

export default SearchAndFilters;
