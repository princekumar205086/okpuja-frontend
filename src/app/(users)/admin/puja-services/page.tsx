'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  Snackbar,
  Fade,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { usePujaServiceStore, PujaService } from '../../../stores/pujaServiceStore';
import { useAuthStore } from '../../../stores/authStore';
import ServiceToolbar from './ServiceToolbar';
import SearchAndFilters from './SearchAndFilters';
import ServiceTableView from './ServiceTableView';
import ServiceCardView from './ServiceCardView';
import ServicePagination from './ServicePagination';
import ServiceForm from './ServiceForm';
import ServiceDetails from './ServiceDetails';
import { toast } from 'react-hot-toast';

const PujaServicesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useAuthStore();
  const {
    services = [],
    loading,
    error,
    currentPage,
    totalCount,
    viewMode,
    searchTerm,
    filters,
    fetchServices,
    deleteService,
    clearError,
  } = usePujaServiceStore();

  // UI State
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<PujaService | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<PujaService | null>(null);

  // Memoize loadServices to avoid missing dependency warning
  const loadServices = React.useCallback(async () => {
    try {
      await fetchServices({
        page: currentPage,
        search: searchTerm,
        category: filters.category,
        type: filters.type,
        is_active: filters.is_active,
      });
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  }, [currentPage, searchTerm, filters, fetchServices]);

  // Initial data load
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Reload when filters change
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleFiltersChange = async (newFilters: any) => {
    // When filters change, reload data from page 1
    try {
      await fetchServices({
        page: 1,
        search: newFilters.search,
        category: newFilters.category,
        type: newFilters.type,
        is_active: newFilters.is_active,
      });
    } catch (error) {
      console.error('Failed to apply filters:', error);
    }
  };

  const handlePageChange = async (page: number) => {
    try {
      await fetchServices({
        page,
        search: searchTerm,
        category: filters.category,
        type: filters.type,
        is_active: filters.is_active,
      });
    } catch (error) {
      console.error('Failed to change page:', error);
    }
  };

  const handleCreateNew = () => {
    setSelectedService(null);
    setFormMode('create');
    setFormOpen(true);
  };

  const handleEdit = (service: PujaService) => {
    setSelectedService(service);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleView = (service: PujaService) => {
    setSelectedService(service);
    setDetailsOpen(true);
  };

  const handleDelete = (service: PujaService) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const success = await deleteService(serviceToDelete.id);
      if (success) {
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
        // Reload current page or go to previous page if current page is empty
        await loadServices();
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedService(null);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedService(null);
  };

  const handleEditFromDetails = () => {
    setDetailsOpen(false);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleRefresh = () => {
    loadServices();
  };

  // Check if user has admin access
  if (!user || user.role !== 'ADMIN') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. You need admin privileges to view this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: { xs: 'background.default', md: 'grey.50' },
    }}>
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 2, md: 3 },
          px: { xs: 2, md: 3 },
        }}
      >
        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={clearError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {/* Page Header */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 4 },
            mb: 3,
            borderRadius: { xs: 2, md: 3 },
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}>
            <Box>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight="bold" 
                gutterBottom
                sx={{ color: 'white' }}
              >
                Puja Services Management
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: 600 
                }}
              >
                Manage all puja services, categories, and packages from this centralized dashboard.
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              alignSelf: { xs: 'stretch', sm: 'auto' },
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                {totalCount} Total Services
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Toolbar */}
        <Paper 
          elevation={0}
          sx={{ 
            mb: 3,
            borderRadius: { xs: 2, md: 3 },
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          <ServiceToolbar
            onCreateNew={handleCreateNew}
            onRefresh={handleRefresh}
            totalServices={totalCount}
            filteredServices={Array.isArray(services) ? services.length : 0}
          />
        </Paper>

        {/* Search and Filters */}
        <Paper 
          elevation={0}
          sx={{ 
            mb: 3,
            borderRadius: { xs: 2, md: 3 },
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          <SearchAndFilters 
            onFiltersChange={handleFiltersChange}
            onRefresh={handleRefresh}
          />
        </Paper>

        {/* Loading State */}
        {loading && services.length === 0 && (
          <Paper 
            elevation={0}
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              py: 8,
              borderRadius: { xs: 2, md: 3 },
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary">
                Loading services...
              </Typography>
            </Stack>
          </Paper>
        )}

        {/* Content */}
        <Fade in={!loading || services.length > 0}>
          <Box>
            {/* Data Display */}
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: { xs: 2, md: 3 },
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                mb: 3,
              }}
            >
              {viewMode === 'table' ? (
                <ServiceTableView
                  services={services}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                <ServiceCardView
                  services={services}
                  loading={loading}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </Paper>

            {/* Pagination */}
            {!loading && services.length > 0 && (
              <Paper 
                elevation={0}
                sx={{ 
                  borderRadius: { xs: 2, md: 3 },
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                }}
              >
                <ServicePagination onPageChange={handlePageChange} />
              </Paper>
            )}
          </Box>
        </Fade>

        {/* Empty State */}
        {!loading && services.length === 0 && !error && (
          <Paper 
            elevation={0}
            sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 2,
              borderRadius: { xs: 2, md: 3 },
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No services found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Get started by creating your first puja service.'
              }
            </Typography>
            {!searchTerm && Object.keys(filters).length === 0 && (
              <Button
                variant="contained"
                onClick={handleCreateNew}
                size="large"
                sx={{ borderRadius: 2 }}
              >
                Create First Service
              </Button>
            )}
          </Paper>
        )}

        {/* Service Form Modal */}
        <ServiceForm
          open={formOpen}
          onClose={handleFormClose}
          service={selectedService}
          mode={formMode}
        />

        {/* Service Details Modal */}
        <ServiceDetails
          open={detailsOpen}
          onClose={handleDetailsClose}
          service={selectedService}
          onEdit={handleEditFromDetails}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="error" />
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the service &quot;{serviceToDelete?.title}&quot;? 
              This action cannot be undone and will also affect all associated packages and bookings.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              color="error"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default PujaServicesPage;
