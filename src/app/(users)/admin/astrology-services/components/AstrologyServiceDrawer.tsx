'use client';

import React, { useState, useEffect } from 'react';
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
  Switch,
  FormControlLabel,
  Stack,
  Divider,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  CurrencyRupee as CurrencyIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAstrologyServiceStore, SERVICE_TYPE_OPTIONS, AstrologyService, CreateAstrologyServiceData, UpdateAstrologyServiceData } from '@/app/stores/astrologyServiceStore';
import RichTextEditor from './RichTextEditor';
import { format } from 'date-fns';

const AstrologyServiceDrawer: React.FC = () => {
  const {
    drawerOpen,
    drawerMode,
    selectedService,
    loading,
    closeDrawer,
    createService,
    updateService,
  } = useAstrologyServiceStore();

  // Form state
  const [formData, setFormData] = useState<Partial<CreateAstrologyServiceData>>({
    title: '',
    service_type: 'HOROSCOPE',
    description: '',
    price: '',
    duration_minutes: 30,
    is_active: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Initialize form data when drawer opens
  useEffect(() => {
    if (drawerOpen && selectedService && (drawerMode === 'view' || drawerMode === 'edit')) {
      setFormData({
        title: selectedService.title,
        service_type: selectedService.service_type,
        description: selectedService.description,
        price: selectedService.price,
        duration_minutes: selectedService.duration_minutes,
        is_active: selectedService.is_active,
      });
      setImagePreview(selectedService.image_url || '');
    } else if (drawerOpen && drawerMode === 'create') {
      setFormData({
        title: '',
        service_type: 'HOROSCOPE',
        description: '',
        price: '',
        duration_minutes: 30,
        is_active: true,
      });
      setImagePreview('');
    }
    setImageFile(null);
    setFormErrors({});
  }, [drawerOpen, selectedService, drawerMode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }

      setImageFile(file);
      setFormErrors(prev => ({ ...prev, image: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.service_type) {
      errors.service_type = 'Service type is required';
    }

    if (!formData.description?.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Valid price is required';
    }

    if (!formData.duration_minutes || formData.duration_minutes <= 0) {
      errors.duration_minutes = 'Valid duration is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const submitData = {
        ...formData,
        image: imageFile || undefined,
      } as CreateAstrologyServiceData;

      let success = false;

      if (drawerMode === 'create') {
        success = await createService(submitData);
      } else if (drawerMode === 'edit' && selectedService) {
        success = await updateService({
          id: selectedService.id,
          ...submitData,
        } as UpdateAstrologyServiceData);
      }

      if (success) {
        closeDrawer();
      }
    } finally {
      setSaving(false);
    }
  };

  const getServiceTypeLabel = (type: string) => {
    return SERVICE_TYPE_OPTIONS.find(option => option.value === type)?.label || type;
  };

  const isViewMode = drawerMode === 'view';
  const isCreateMode = drawerMode === 'create';
  const isEditMode = drawerMode === 'edit';

  return (
    <Drawer
      anchor="bottom"
      open={drawerOpen}
      onClose={closeDrawer}
      PaperProps={{
        sx: {
          height: '90vh',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        },
      }}
    >
      <Box className="h-full flex flex-col">
        {/* Header */}
        <Box className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <Box className="flex items-center gap-3">
            <Avatar className="bg-purple-100">
              {isViewMode && <ViewIcon className="text-purple-600" />}
              {isCreateMode && <EditIcon className="text-purple-600" />}
              {isEditMode && <EditIcon className="text-purple-600" />}
            </Avatar>
            <Box>
              <Typography variant="h6" className="font-semibold text-gray-900">
                {isViewMode && 'View Service'}
                {isCreateMode && 'Create New Service'}
                {isEditMode && 'Edit Service'}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {isViewMode && selectedService && `Service ID: ${selectedService.id}`}
                {isCreateMode && 'Add a new astrology service to your offerings'}
                {isEditMode && selectedService && `Editing: ${selectedService.title}`}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={closeDrawer} className="text-gray-500">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box className="flex-1 overflow-hidden">
          <Box className="h-full overflow-y-auto p-6">
            <Stack spacing={4}>
              {/* Service Image */}
              <Box>
                <Typography variant="subtitle1" className="font-medium mb-3">
                  Service Image
                </Typography>
                
                {imagePreview ? (
                  <Box className="relative inline-block">
                    <Avatar
                      src={imagePreview}
                      alt="Service preview"
                      className="w-32 h-32 rounded-xl"
                      variant="rounded"
                    >
                      <ImageIcon />
                    </Avatar>
                    {!isViewMode && (
                      <IconButton
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white hover:bg-red-600"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ) : (
                  <Box className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                    <ImageIcon className="text-gray-400" fontSize="large" />
                  </Box>
                )}

                {!isViewMode && (
                  <Box className="mt-3">
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      className="text-gray-700 border-gray-300"
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                    {formErrors.image && (
                      <Typography variant="caption" className="text-red-600 ml-2">
                        {formErrors.image}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>

              <Divider />

              {/* Basic Information */}
              <Box>
                <Typography variant="h6" className="font-semibold mb-4">
                  Basic Information
                </Typography>
                
                <Stack spacing={3}>
                  {/* Title */}
                  <TextField
                    fullWidth
                    label="Service Title"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    error={!!formErrors.title}
                    helperText={formErrors.title}
                    disabled={isViewMode}
                    variant="outlined"
                  />

                  {/* Service Type */}
                  <FormControl fullWidth error={!!formErrors.service_type}>
                    <InputLabel>Service Type</InputLabel>
                    <Select
                      value={formData.service_type || ''}
                      onChange={(e) => handleInputChange('service_type', e.target.value)}
                      label="Service Type"
                      disabled={isViewMode}
                    >
                      {SERVICE_TYPE_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.service_type && (
                      <Typography variant="caption" className="text-red-600 ml-2">
                        {formErrors.service_type}
                      </Typography>
                    )}
                  </FormControl>

                  {/* Price and Duration */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      error={!!formErrors.price}
                      helperText={formErrors.price}
                      disabled={isViewMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CurrencyIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Duration (minutes)"
                      type="number"
                      value={formData.duration_minutes || ''}
                      onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value))}
                      error={!!formErrors.duration_minutes}
                      helperText={formErrors.duration_minutes}
                      disabled={isViewMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TimeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>

                  {/* Status */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active || false}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        disabled={isViewMode}
                      />
                    }
                    label="Active Service"
                  />
                </Stack>
              </Box>

              <Divider />

              {/* Description */}
              <Box>
                <Typography variant="h6" className="font-semibold mb-4">
                  Description
                </Typography>
                
                {isViewMode ? (
                  <Box className="p-4 bg-gray-50 rounded-lg">
                    <Typography variant="body1" className="whitespace-pre-wrap">
                      {formData.description || 'No description provided'}
                    </Typography>
                  </Box>
                ) : (
                  <RichTextEditor
                    content={formData.description || ''}
                    onChange={(content) => handleInputChange('description', content)}
                    placeholder="Enter detailed description of the service..."
                    error={formErrors.description}
                  />
                )}
              </Box>

              {/* Service Details (View Mode Only) */}
              {isViewMode && selectedService && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="h6" className="font-semibold mb-4">
                      Service Details
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Box className="flex justify-between items-center">
                        <Typography variant="body2" className="text-gray-600">Status</Typography>
                        <Chip
                          label={selectedService.is_active ? 'Active' : 'Inactive'}
                          color={selectedService.is_active ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                      
                      <Box className="flex justify-between items-center">
                        <Typography variant="body2" className="text-gray-600">Service Type</Typography>
                        <Chip
                          label={getServiceTypeLabel(selectedService.service_type)}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                      
                      <Box className="flex justify-between items-center">
                        <Typography variant="body2" className="text-gray-600">Created</Typography>
                        <Typography variant="body2" className="font-medium">
                          {format(new Date(selectedService.created_at), 'PPP')}
                        </Typography>
                      </Box>
                      
                      <Box className="flex justify-between items-center">
                        <Typography variant="body2" className="text-gray-600">Last Updated</Typography>
                        <Typography variant="body2" className="font-medium">
                          {format(new Date(selectedService.updated_at), 'PPP')}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </>
              )}
            </Stack>
          </Box>
        </Box>

        {/* Footer */}
        {!isViewMode && (
          <Box className="p-4 border-t border-gray-200 bg-gray-50">
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={closeDrawer}
                disabled={saving}
                className="text-gray-700 border-gray-300"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={saving || loading}
                startIcon={
                  saving ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SaveIcon />
                  )
                }
                className="bg-purple-600 hover:bg-purple-700"
              >
                {saving ? 'Saving...' : isCreateMode ? 'Create Service' : 'Update Service'}
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default AstrologyServiceDrawer;
