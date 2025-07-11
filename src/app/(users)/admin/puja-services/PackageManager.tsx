import React, { useState, useEffect } from 'react';
import {
  Close,
  Add,
  Edit,
  Delete,
  Inventory,
  Warning,
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
  Chip,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { usePujaServiceStore, Package, PujaService } from '../../../stores/pujaServiceStore';
import { languageOptions, packageTypeOptions, formatCurrency, formatDateTime } from './utils';

interface PackageManagerProps {
  open: boolean;
  onClose: () => void;
  service: PujaService | null;
}

const PackageManager: React.FC<PackageManagerProps> = ({ open, onClose, service }) => {
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
    if (!service) return;

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
  };

  if (!service) return null;

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
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Service Packages
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage packages for &quot;{service.title}&quot;
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateNew}
                size="small"
              >
                Add Package
              </Button>
              <IconButton onClick={onClose} size="large">
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* Packages List */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Available Packages ({packages.length})
            </Typography>
            
            {packages.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                bgcolor: 'grey.50',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'grey.300'
              }}>
                <Inventory sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No packages found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Create packages to offer different pricing options for this service.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleCreateNew}
                >
                  Add First Package
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {packages.map((pkg) => (
                  <div className="flex flex-wrap -mx-2" key={pkg.id}>
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4"
                        >
                            <div className="border rounded-lg bg-white shadow-sm p-4 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-bold text-lg">{formatCurrency(pkg.price)}</div>
                                        <div className="text-xs text-gray-500">
                                            {pkg.language} • {pkg.package_type}
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                            pkg.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {pkg.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="text-sm mb-2">{pkg.description}</div>

                                <div className="flex flex-wrap gap-1 mb-2">
                                    <span className="border rounded px-2 py-0.5 text-xs bg-gray-50">
                                        📍 {pkg.location}
                                    </span>
                                    <span className="border rounded px-2 py-0.5 text-xs bg-gray-50">
                                        👥 {pkg.priest_count} priest{pkg.priest_count > 1 ? 's' : ''}
                                    </span>
                                    {pkg.includes_materials && (
                                        <span className="border rounded px-2 py-0.5 text-xs bg-blue-50 text-blue-700">
                                            📦 Materials included
                                        </span>
                                    )}
                                </div>

                                <div className="text-xs text-gray-400 mb-2">
                                    Created: {formatDateTime(pkg.created_at)}
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <button
                                        type="button"
                                        className="px-3 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
                                        onClick={() => handleEdit(pkg)}
                                    >
                                        <Edit fontSize="small" />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="px-3 py-1 text-xs rounded bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-1"
                                        onClick={() => handleDelete(pkg)}
                                    >
                                        <Delete fontSize="small" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Package Form Dialog */}
      <Dialog
        open={packageFormOpen}
        onClose={() => setPackageFormOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          {formMode === 'create' ? 'Create New Package' : 'Edit Package'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              
              {/* Location and Price */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Price (INR)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  fullWidth
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Box>

              {/* Language and Package Type */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={formData.language}
                    label="Language"
                    onChange={(e) => handleInputChange('language', e.target.value)}
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
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Description */}
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
                fullWidth
                required
              />

              {/* Priest Count */}
              <TextField
                label="Number of Priests"
                type="number"
                value={formData.priest_count}
                onChange={(e) => handleInputChange('priest_count', parseInt(e.target.value) || 1)}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />

              {/* Switches */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.includes_materials}
                      onChange={(e) => handleInputChange('includes_materials', e.target.checked)}
                    />
                  }
                  label="Includes puja materials"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    />
                  }
                  label="Active status"
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPackageFormOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading || !formData.location || !formData.price || !formData.description}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading
                ? formMode === 'create' ? 'Creating...' : 'Updating...'
                : formMode === 'create' ? 'Create Package' : 'Update Package'
              }
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
            Are you sure you want to delete this package? This action cannot be undone.
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
    </>
  );
};

export default PackageManager;
