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
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Error Alert */}
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
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Puja Services Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all puja services, categories, and bookings from this centralized dashboard.
          </Typography>
        </Box>

        {/* Toolbar */}
        <ServiceToolbar
          onCreateNew={handleCreateNew}
          onRefresh={handleRefresh}
          totalServices={totalCount}
          filteredServices={Array.isArray(services) ? services.length : 0}
        />

        {/* Search and Filters */}
        <SearchAndFilters 
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
        />

        {/* Loading State */}
        {loading && services.length === 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 8 
          }}>
            <CircularProgress size={40} />
          </Box>
        )}

        {/* Content */}
        <Fade in={!loading || services.length > 0}>
          <Box>
            {/* Data Display */}
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
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            {/* Pagination */}
            {!loading && services.length > 0 && (
              <ServicePagination onPageChange={handlePageChange} />
            )}
          </Box>
        </Fade>

        {/* Empty State */}
        {!loading && services.length === 0 && !error && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            px: 2,
          }}>
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
              >
                Create First Service
              </Button>
            )}
          </Box>
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
