import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Button,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  Close,
  Edit,
  Delete,
  Schedule,
  Category,
  LocationOn,
  Visibility,
  Warning,
  Inventory,
} from '@mui/icons-material';
import { usePujaServiceStore, PujaService } from '../../../stores/pujaServiceStore';
import { formatDuration, formatDateTime, getImageUrl, serviceTypeOptions } from './utils';
import PackageManager from './PackageManager';

interface ServiceDetailsProps {
  open: boolean;
  onClose: () => void;
  service: PujaService | null;
  onEdit: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  open,
  onClose,
  service,
  onEdit,
}) => {
  const { deleteService, loading } = usePujaServiceStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packageManagerOpen, setPackageManagerOpen] = useState(false);

  if (!service) return null;

  const serviceTypeLabel = serviceTypeOptions.find(
    option => option.value === service.type
  )?.label || service.type;

  const handleDelete = async () => {
    const success = await deleteService(service.id);
    if (success) {
      setDeleteDialogOpen(false);
      onClose();
    }
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            height: '90vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h5" fontWeight="bold">
              Service Details
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                onClick={() => setPackageManagerOpen(true)} 
                color="primary"
                title="Manage Packages"
              >
                <Inventory />
              </IconButton>
              <IconButton onClick={onEdit} color="primary">
                <Edit />
              </IconButton>
              <IconButton 
                onClick={() => setDeleteDialogOpen(true)} 
                color="error"
              >
                <Delete />
              </IconButton>
              <IconButton onClick={onClose} size="large">
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Service Image and Basic Info */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              alignItems: { xs: 'center', sm: 'flex-start' }
            }}>
              <Avatar
                src={getImageUrl(service.image_url)}
                sx={{ 
                  width: { xs: 120, sm: 150 }, 
                  height: { xs: 120, sm: 150 },
                  borderRadius: 2,
                }}
                variant="rounded"
              />
              
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {service.title}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  <Chip
                    label={service.is_active ? 'Active' : 'Inactive'}
                    color={service.is_active ? 'success' : 'error'}
                    size="small"
                  />
                  <Chip
                    label={serviceTypeLabel}
                    variant="outlined"
                    size="small"
                    icon={<LocationOn fontSize="small" />}
                  />
                  <Chip
                    label={service.category_detail?.name || 'No Category'}
                    variant="outlined"
                    size="small"
                    icon={<Category fontSize="small" />}
                  />
                  <Chip
                    label={formatDuration(service.duration_minutes)}
                    variant="outlined"
                    size="small"
                    icon={<Schedule fontSize="small" />}
                  />
                </Box>

                <Typography variant="body1" color="text.secondary">
                  {service.description}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Detailed Information */}
          <Grid container spacing={3}>
            <div className="w-full md:w-1/2 px-2 mb-6">
              <div className="border rounded-lg shadow-sm bg-white">
                <div className="p-6">
                  <Typography variant="h6" gutterBottom color="primary">
                    Service Information
                  </Typography>
                  <div className="flex flex-col gap-4">
                    <div>
                      <Typography variant="subtitle2" color="text.secondary">
                        Service ID
                      </Typography>
                      <Typography variant="body1">#{service.id}</Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1">
                        {service.category_detail?.name || 'No Category'}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="text.secondary">
                        Service Type
                      </Typography>
                      <Typography variant="body1">{serviceTypeLabel}</Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="body1">
                        {formatDuration(service.duration_minutes)} ({service.duration_minutes} minutes)
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={service.is_active ? 'Active' : 'Inactive'}
                        color={service.is_active ? 'success' : 'error'}
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 px-2 mb-6">
              <div className="border rounded-lg shadow-sm bg-white">
                <div className="p-6">
                  <Typography variant="h6" gutterBottom color="primary">
                    Timestamps
                  </Typography>
                  <div className="flex flex-col gap-4">
                    <div>
                      <Typography variant="subtitle2" color="text.secondary">
                        Created At
                      </Typography>
                      <Typography variant="body1">
                        {formatDateTime(service.created_at)}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {formatDateTime(service.updated_at)}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-2 mb-6">
                <div className="border rounded-lg shadow-sm bg-white">
                    <div className="p-6">
                        <Typography variant="h6" gutterBottom color="primary">
                            Description
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.6,
                            }}
                        >
                            {service.description}
                        </Typography>
                    </div>
                </div>
            </div>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 4,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'flex-end'
          }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ minWidth: 120 }}
            >
              Close
            </Button>
            <Button
              variant="outlined"
              onClick={() => setPackageManagerOpen(true)}
              startIcon={<Inventory />}
              sx={{ minWidth: 120 }}
            >
              Packages
            </Button>
            <Button
              variant="contained"
              onClick={onEdit}
              startIcon={<Edit />}
              sx={{ minWidth: 120 }}
            >
              Edit Service
            </Button>
          </Box>
        </Box>
      </Drawer>

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
            Are you sure you want to delete the service &quot;{service.title}&quot;? 
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
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Package Manager */}
      <PackageManager
        open={packageManagerOpen}
        onClose={() => setPackageManagerOpen(false)}
        service={service}
      />
    </>
  );
};

export default ServiceDetails;
