import React, { useState, useEffect } from 'react';
import {
  Close,
  Add,
  Edit,
  Delete,
  Inventory,
  Warning,
  LocationOn,
  Language,
  Person,
  AttachMoney,
  CheckCircle,
  Cancel,
  Inventory2,
} from '@mui/icons-material';
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Divider,
  Stack,
  Container,
  Fab,
  Slide,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { usePujaServiceStore, Package, PujaService } from '../../../stores/pujaServiceStore';
import { languageOptions, packageTypeOptions, formatCurrency, formatDateTime } from './utils';
import RichTextEditor from './RichTextEditor';

interface PackageManagerProps {
  open: boolean;
  onClose: () => void;
  service: PujaService | null;
}

const PackageManager: React.FC<PackageManagerProps> = ({ open, onClose, service }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    packages,
    loading,
    error,
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    clearError,
  } = usePujaServiceStore();

  const [packageFormOpen, setPackageFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<Package | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<{
    location: string;
    language: Package['language'] | string;
    package_type: Package['package_type'];
    price: string;
    description: string;
    includes_materials: boolean;
    priest_count: number;
    is_active: boolean;
  }>({
    location: '',
    language: languageOptions[0].value,
    package_type: 'STANDARD',
    price: '',
    description: '',
    includes_materials: false,
    priest_count: 1,
    is_active: true,
  });

  useEffect(() => {
    if (open && service) {
      fetchPackages(service.id);
    }
  }, [open, service, fetchPackages]);

  const resetForm = () => {
    setFormData({
      location: '',
      language: languageOptions[0].value,
      package_type: 'STANDARD',
      price: '',
      description: '',
      includes_materials: false,
      priest_count: 1,
      is_active: true,
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Valid price is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (formData.priest_count < 1) {
      errors.priest_count = 'At least 1 priest is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateNew = () => {
    resetForm();
    setEditingPackage(null);
    setFormMode('create');
    setPackageFormOpen(true);
  };

  const handleEdit = (pkg: Package) => {
    setFormData({
      location: pkg.location,
      language: pkg.language,
      package_type: pkg.package_type,
      price: pkg.price.toString(),
      description: pkg.description,
      includes_materials: pkg.includes_materials,
      priest_count: pkg.priest_count,
      is_active: pkg.is_active,
    });
    setEditingPackage(pkg);
    setFormMode('edit');
    setPackageFormOpen(true);
  };

  const handleDelete = (pkg: Package) => {
    setDeletingPackage(pkg);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!service || !validateForm()) return;

    const packageData = {
      puja_service: service.id,
      location: formData.location.trim(),
      language: formData.language,
      package_type: formData.package_type,
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      includes_materials: formData.includes_materials,
      priest_count: formData.priest_count,
      is_active: formData.is_active,
    };

    let success = false;
    if (formMode === 'create') {
      success = await createPackage(packageData);
    } else if (editingPackage) {
      success = await updatePackage(editingPackage.id, packageData);
    }

    if (success) {
      setPackageFormOpen(false);
      resetForm();
      setEditingPackage(null);
    }
  };

  const confirmDelete = async () => {
    if (!deletingPackage) return;

    const success = await deletePackage(deletingPackage.id);
    if (success) {
      setDeleteDialogOpen(false);
      setDeletingPackage(null);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const PackageCard: React.FC<{ pkg: Package }> = ({ pkg }) => (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
          boxShadow: 2,
        },
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Status Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: -8,
          right: 12,
          zIndex: 1,
        }}
      >
        <Chip
          size="small"
          icon={pkg.is_active ? <CheckCircle /> : <Cancel />}
          label={pkg.is_active ? 'Active' : 'Inactive'}
          color={pkg.is_active ? 'success' : 'error'}
          sx={{ 
            fontWeight: 600,
            '& .MuiChip-icon': { fontSize: 16 }
          }}
        />
      </Box>

      <CardContent sx={{ p: 3, pb: 1 }}>
        {/* Price Header */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
            {formatCurrency(pkg.price)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              size="small" 
              label={pkg.package_type} 
              color="primary" 
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip 
              size="small" 
              label={pkg.language} 
              sx={{ bgcolor: 'grey.100' }}
            />
          </Box>
        </Box>

        {/* Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: pkg.description }}
        />

        {/* Details */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {pkg.location}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {pkg.priest_count} Priest{pkg.priest_count > 1 ? 's' : ''}
            </Typography>
          </Box>
          
          {pkg.includes_materials && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Inventory2 sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="body2" color="success.main" fontWeight={500}>
                Materials Included
              </Typography>
            </Box>
          )}
        </Stack>

        <Typography variant="caption" color="text.disabled">
          Created: {formatDateTime(pkg.created_at)}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Edit />}
          onClick={() => handleEdit(pkg)}
          sx={{ flex: 1 }}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => handleDelete(pkg)}
          sx={{ flex: 1 }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );

  if (!service) return null;

  return (
    <>
      {/* Main Package Manager Drawer */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            height: { xs: '95vh', md: '90vh' },
            borderTopLeftRadius: { xs: 20, md: 16 },
            borderTopRightRadius: { xs: 20, md: 16 },
            maxWidth: { md: 'calc(100vw - 64px)' },
            mx: { md: 'auto' },
          },
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100%', p: 0 }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ 
              p: { xs: 2, md: 3 },
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                gap: 2,
              }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Service Packages
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    Manage packages for &quot;{service?.title}&quot;
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      size="small" 
                      label={`${packages.length} Package${packages.length !== 1 ? 's' : ''}`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {!isMobile && (
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleCreateNew}
                      size="medium"
                      sx={{ borderRadius: 2 }}
                    >
                      Add Package
                    </Button>
                  )}
                  <IconButton 
                    onClick={onClose} 
                    size="large"
                    sx={{ 
                      bgcolor: 'grey.100',
                      '&:hover': { bgcolor: 'grey.200' }
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Content */}
            <Box sx={{ 
              flex: 1, 
              overflow: 'auto',
              p: { xs: 2, md: 3 },
            }}>
              {/* Error Alert */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: 2 }} 
                  onClose={clearError}
                  action={
                    <IconButton size="small" onClick={clearError}>
                      <Close fontSize="small" />
                    </IconButton>
                  }
                >
                  {error}
                </Alert>
              )}

              {/* Packages Grid */}
              {packages.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{ 
                    textAlign: 'center', 
                    py: { xs: 6, md: 8 },
                    px: 3,
                    bgcolor: 'grey.50',
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: 'grey.300'
                  }}
                >
                  <Inventory sx={{ fontSize: { xs: 64, md: 80 }, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No packages found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                    Create different package options to offer varied pricing and services for this puja.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Add />}
                    onClick={handleCreateNew}
                    sx={{ borderRadius: 2 }}
                  >
                    Create First Package
                  </Button>
                </Paper>
              ) : (
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                  mb: { xs: 10, md: 0 }, // Space for FAB on mobile
                }}>
                  {packages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Mobile Floating Action Button */}
          {isMobile && packages.length > 0 && (
            <Fab
              color="primary"
              onClick={handleCreateNew}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1000,
              }}
            >
              <Add />
            </Fab>
          )}
        </Container>
      </Drawer>

      {/* Package Form Drawer */}
      <Drawer
        anchor="bottom"
        open={packageFormOpen}
        onClose={() => setPackageFormOpen(false)}
        PaperProps={{
          sx: {
            height: { xs: '95vh', md: '85vh' },
            borderTopLeftRadius: { xs: 20, md: 16 },
            borderTopRightRadius: { xs: 20, md: 16 },
            maxWidth: { md: 800 },
            mx: { md: 'auto' },
          },
        }}
      >
        <Container maxWidth="md" sx={{ height: '100%', p: 0 }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Form Header */}
            <Box sx={{ 
              p: { xs: 2, md: 3 },
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
              }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {formMode === 'create' ? 'Create New Package' : 'Edit Package'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formMode === 'create' ? 'Add a new pricing package' : 'Update package details'}
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => setPackageFormOpen(false)}
                  disabled={loading}
                  sx={{ 
                    bgcolor: 'grey.100',
                    '&:hover': { bgcolor: 'grey.200' }
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            </Box>

            {/* Form Content */}
            <Box sx={{ 
              flex: 1, 
              overflow: 'auto',
              p: { xs: 2, md: 3 },
            }}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Location and Price Row */}
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}>
                    <TextField
                      label="Service Location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      error={!!formErrors.location}
                      helperText={formErrors.location}
                      fullWidth
                      required
                      placeholder="e.g., Delhi, Mumbai"
                    />
                    <TextField
                      label="Price (INR)"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      error={!!formErrors.price}
                      helperText={formErrors.price}
                      fullWidth
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                      InputProps={{
                        startAdornment: <AttachMoney sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Box>

                  {/* Language and Package Type Row */}
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={formData.language}
                        label="Language"
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        startAdornment={<Language sx={{ color: 'text.secondary', mr: 1 }} />}
                      >
                        {languageOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Package Type</InputLabel>
                      <Select
                        value={formData.package_type}
                        label="Package Type"
                        onChange={(e) => handleInputChange('package_type', e.target.value)}
                      >
                        {packageTypeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {option.icon}
                              {option.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Description with Rich Text Editor */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom fontWeight={500}>
                      Package Description *
                    </Typography>
                    <RichTextEditor
                      content={formData.description}
                      onChange={(content) => handleInputChange('description', content)}
                      placeholder="Describe what's included in this package..."
                      error={!!formErrors.description}
                      helperText={formErrors.description}
                      maxLength={500}
                    />
                  </Box>

                  {/* Priest Count */}
                  <TextField
                    label="Number of Priests"
                    type="number"
                    value={formData.priest_count}
                    onChange={(e) => handleInputChange('priest_count', parseInt(e.target.value) || 1)}
                    error={!!formErrors.priest_count}
                    helperText={formErrors.priest_count}
                    fullWidth
                    required
                    inputProps={{ min: 1 }}
                    InputProps={{
                      startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} />,
                    }}
                  />

                  {/* Toggle Options */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'grey.50', 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom fontWeight={500}>
                      Package Options
                    </Typography>
                    <Stack spacing={1}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.includes_materials}
                            onChange={(e) => handleInputChange('includes_materials', e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Inventory2 sx={{ fontSize: 18 }} />
                            <Typography variant="body2">
                              Include puja materials and supplies
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.is_active}
                            onChange={(e) => handleInputChange('is_active', e.target.checked)}
                            color="success"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle sx={{ fontSize: 18 }} />
                            <Typography variant="body2">
                              Active and available for booking
                            </Typography>
                          </Box>
                        }
                      />
                    </Stack>
                  </Paper>
                </Stack>
              </form>
            </Box>

            {/* Form Actions */}
            <Box sx={{ 
              p: { xs: 2, md: 3 },
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  onClick={() => setPackageFormOpen(false)}
                  disabled={loading}
                  sx={{ order: { xs: 2, sm: 1 } }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={loading || !formData.location || !formData.price || !formData.description}
                  startIcon={loading ? <CircularProgress size={16} /> : null}
                  sx={{ 
                    order: { xs: 1, sm: 2 },
                    minWidth: 140 
                  }}
                >
                  {loading
                    ? formMode === 'create' ? 'Creating...' : 'Updating...'
                    : formMode === 'create' ? 'Create Package' : 'Update Package'
                  }
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          pb: 1
        }}>
          <Warning color="error" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to delete this package? This action cannot be undone.
          </DialogContentText>
          {deletingPackage && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                {formatCurrency(deletingPackage.price)} - {deletingPackage.package_type}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {deletingPackage.location} • {deletingPackage.language}
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            disabled={loading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Delete />}
          >
            {loading ? 'Deleting...' : 'Delete Package'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PackageManager;
