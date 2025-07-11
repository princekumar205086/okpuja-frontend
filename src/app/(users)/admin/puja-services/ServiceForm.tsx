import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
  Grid
} from '@mui/material';
import { Close, CloudUpload, Delete } from '@mui/icons-material';
import { usePujaServiceStore, PujaService, CreatePujaServiceData, UpdatePujaServiceData } from '../../../stores/pujaServiceStore';
import { serviceTypeOptions, getImageUrl } from './utils';
import RichTextEditor from './RichTextEditor';

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  service?: PujaService | null;
  mode: 'create' | 'edit';
}

const ServiceForm: React.FC<ServiceFormProps> = ({ open, onClose, service, mode }) => {
  const {
    loading,
    error,
    categories,
    createService,
    updateService,
    fetchCategories,
    clearError,
  } = usePujaServiceStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    type: PujaService['type'];
    duration_minutes: number;
    is_active: boolean;
  }>({
    title: '',
    description: '',
    category: '',
    type: 'HOME',
    duration_minutes: 60,
    is_active: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialize form data when service changes or component mounts
  useEffect(() => {
    if (mode === 'edit' && service) {
      setFormData({
        title: service.title || '',
        description: service.description || '',
        category: service.category ? service.category.toString() : '',
        type: service.type || 'HOME',
        duration_minutes: service.duration_minutes || 60,
        is_active: service.is_active ?? true,
      });
      setImagePreview(service.image_url || '');
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        description: '',
        category: '',
        type: 'HOME',
        duration_minutes: 60,
        is_active: true,
      });
      setImagePreview('');
    }
    setImageFile(null);
    setFormErrors({});
    clearError();
  }, [mode, service, clearError]);

  // Fetch categories on mount and when drawer opens
  useEffect(() => {
    if (open) {
      console.log('Form opened, categories length:', categories.length);
      if (categories.length === 0) {
        console.log('Fetching categories...');
        fetchCategories();
      }
    }
  }, [open, fetchCategories, categories.length]);

  // Log categories when they change
  useEffect(() => {
    console.log('Categories updated:', categories);
  }, [categories]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate image file (basic example: type and size)
  const validateImageFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!validTypes.includes(file.type)) {
      return 'Only JPG, PNG, GIF, or WEBP images are allowed';
    }
    if (file.size > maxSize) {
      return 'Image size must be less than 2MB';
    }
    return null;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setFormErrors(prev => ({ ...prev, image: validationError }));
      return;
    }

    setImageFile(file);
    setFormErrors(prev => ({ ...prev, image: '' }));

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(mode === 'edit' && service?.image_url ? service.image_url : '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      errors.title = 'Title must be less than 255 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (!formData.duration_minutes || formData.duration_minutes <= 0) {
      errors.duration_minutes = 'Duration must be greater than 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const serviceData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: parseInt(formData.category),
      type: formData.type,
      duration_minutes: formData.duration_minutes,
      is_active: formData.is_active,
      ...(imageFile && { image: imageFile }),
    };

    let success = false;

    if (mode === 'create') {
      success = await createService(serviceData as CreatePujaServiceData);
    } else if (service) {
      success = await updateService({
        id: service.id,
        ...serviceData,
      } as UpdatePujaServiceData);
    }

    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      type: 'HOME',
      duration_minutes: 60,
      is_active: true,
    });
    setImageFile(null);
    setImagePreview('');
    setFormErrors({});
    clearError();
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
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
            {mode === 'create' ? 'Create New Service' : 'Edit Service'}
          </Typography>
          <IconButton onClick={handleClose} size="large">
            <Close />
          </IconButton>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Image Upload Section */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Service Image
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {imagePreview && (
                <Box sx={{ position: 'relative', width: 'fit-content' }}>
                <Avatar
                  src={imagePreview}
                  sx={{ width: 120, height: 120, border: '2px solid #e0e0e0' }}
                  variant="rounded"
                />
                <IconButton
                  size="small"
                  sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'error.dark' },
                  }}
                  onClick={handleRemoveImage}
                >
                  <Delete fontSize="small" />
                </IconButton>
                </Box>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ width: 'fit-content' }}
              >
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </Button>
              
              {formErrors.image && (
                <Typography color="error" variant="caption">
                {formErrors.image}
                </Typography>
              )}
              </Box>
            </Box>

            {/* Title */}
            <TextField
              label="Service Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!formErrors.title}
              helperText={formErrors.title}
              fullWidth
              required
            />

            {/* Description with Rich Text Editor */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
              Description *
              </Typography>
              <RichTextEditor
              content={formData.description}
              onChange={(content) => handleInputChange('description', content)}
              placeholder="Enter service description..."
              error={!!formErrors.description}
              helperText={formErrors.description}
              maxLength={2000}
              />
            </Box>

            {/* Category and Type in responsive flex layout */}
            <div className="w-full flex flex-col gap-4 md:flex-row">
              <div className="w-full md:w-1/2">
              <FormControl fullWidth error={!!formErrors.category} required>
                <InputLabel>Category</InputLabel>
                <Select
                value={formData.category}
                label="Category"
                onChange={(e) => handleInputChange('category', e.target.value)}
                >
                {categories.length === 0 ? (
                  <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    Loading categories...
                  </Typography>
                  </MenuItem>
                ) : (
                  categories.map((category) => (
                  <MenuItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </MenuItem>
                  ))
                )}
                </Select>
                {formErrors.category && (
                <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                  {formErrors.category}
                </Typography>
                )}
              </FormControl>
              </div>

              <div className="w-full md:w-1/2">
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                value={formData.type}
                label="Service Type"
                onChange={(e) => handleInputChange('type', e.target.value)}
                >
                {serviceTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {option.icon}
                    {option.label}
                  </Box>
                  </MenuItem>
                ))}
                </Select>
              </FormControl>
              </div>
            </div>

            {/* Duration and Status in responsive flex layout */}
            <div className="w-full flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-2/3">
              <TextField
                label="Duration (minutes)"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 0)}
                error={!!formErrors.duration_minutes}
                helperText={formErrors.duration_minutes}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
              </div>
              <div className="w-full md:w-1/3 flex items-center justify-start md:justify-center">
              <FormControlLabel
                control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                />
                }
                label="Active Status"
              />
              </div>
            </div>

            {/* Submit Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              pt: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'flex-end'
            }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ minWidth: 120 }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 120 }}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {loading
                  ? mode === 'create' ? 'Creating...' : 'Updating...'
                  : mode === 'create' ? 'Create Service' : 'Update Service'
                }
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default ServiceForm;
