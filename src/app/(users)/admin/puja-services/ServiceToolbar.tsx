import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import {
  Add,
  FileDownload,
  ViewModule,
  TableRows,
  MoreVert,
  Refresh,
  FilterList,
  Category,
} from '@mui/icons-material';
import { usePujaServiceStore } from '../../../stores/pujaServiceStore';
import { exportServicesToExcel } from './utils';
import { toast } from 'react-hot-toast';
import CategoryManager from './CategoryManager';

interface ServiceToolbarProps {
  onCreateNew: () => void;
  onRefresh: () => void;
  totalServices: number;
  filteredServices: number;
}

const ServiceToolbar: React.FC<ServiceToolbarProps> = ({
  onCreateNew,
  onRefresh,
  totalServices,
  filteredServices,
}) => {
  const { 
    viewMode, 
    setViewMode, 
    services, 
    loading,
    searchTerm,
    filters,
  } = usePujaServiceStore();

  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);

  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportServices = async () => {
    try {
      if (!services || services.length === 0) {
        toast.error('No services to export');
        return;
      }
      
      exportServicesToExcel(services);
      toast.success('Services exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export services');
    }
    handleExportMenuClose();
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: 'table' | 'card',
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const hasActiveFilters = () => {
    return searchTerm || 
           filters.category || 
           filters.type || 
           filters.is_active !== undefined;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'stretch', sm: 'center' },
      gap: 2,
      mb: 3,
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 1,
    }}>
      {/* Left Section - Title and Stats */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h5" fontWeight="bold">
          Puja Services
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredServices} of {totalServices} services
          </Typography>
          
          {hasActiveFilters() && (
            <Chip
              icon={<FilterList fontSize="small" />}
              label="Filtered"
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          
          {loading && (
            <Chip
              label="Loading..."
              size="small"
              color="info"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {/* Right Section - Actions */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        width: { xs: '100%', sm: 'auto' }
      }}>
        
        {/* View Mode Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
          sx={{ 
            '& .MuiToggleButton-root': {
              px: 2,
              py: 1,
            }
          }}
        >
          <ToggleButton value="table" aria-label="table view">
            <Tooltip title="Table View">
              <TableRows fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="card" aria-label="card view">
            <Tooltip title="Card View">
              <ViewModule fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Refresh Button */}
        <Tooltip title="Refresh">
          <IconButton
            onClick={onRefresh}
            disabled={loading}
            size="small"
          >
            <Refresh />
          </IconButton>
        </Tooltip>

        {/* Categories Button */}
        <Tooltip title="Manage Categories">
          <IconButton
            onClick={() => setCategoryManagerOpen(true)}
            disabled={loading}
            size="small"
          >
            <Category />
          </IconButton>
        </Tooltip>

        {/* Export Button */}
        <Tooltip title="Export">
          <IconButton
            onClick={handleExportMenuOpen}
            disabled={loading || !services || services.length === 0}
            size="small"
          >
            <FileDownload />
          </IconButton>
        </Tooltip>

        {/* Create New Service Button */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onCreateNew}
          disabled={loading}
          sx={{ 
            minWidth: { xs: '100%', sm: 'auto' },
            whiteSpace: 'nowrap'
          }}
        >
          Add Service
        </Button>
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={handleExportMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleExportServices}>
          <ListItemIcon>
            <FileDownload fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Export Services</Typography>
            <Typography variant="caption" color="text.secondary">
              Excel format (.xlsx)
            </Typography>
          </ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem disabled>
          <ListItemIcon>
            <FileDownload fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" color="text.secondary">
              Export Packages
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Coming soon
            </Typography>
          </ListItemText>
        </MenuItem>
        
        <MenuItem disabled>
          <ListItemIcon>
            <FileDownload fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" color="text.secondary">
              Export Bookings
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Coming soon
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Category Manager */}
      <CategoryManager
        open={categoryManagerOpen}
        onClose={() => setCategoryManagerOpen(false)}
      />
    </Box>
  );
};

export default ServiceToolbar;
