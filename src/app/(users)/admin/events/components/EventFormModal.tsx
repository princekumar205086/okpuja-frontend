'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useEventStore, CreateEventData, UpdateEventData, Event, EventStatus } from '../../../../stores/eventStore';
import { toast } from 'react-hot-toast';
import ImageUploadZone from './ImageUploadZone';

interface EventFormModalProps {
  open: boolean;
  onClose: () => void;
  event?: Event | null;
  mode: 'create' | 'edit';
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  open,
  onClose,
  event,
  mode,
}) => {
  const { createEvent, updateEvent, loading, error } = useEventStore();
  
  const [formData, setFormData] = useState<CreateEventData>({
    title: event?.title || '',
    description: event?.description || '',
    event_date: event?.event_date || '',
    start_time: event?.start_time || '',
    end_time: event?.end_time || '',
    location: event?.location || '',
    registration_link: event?.registration_link || '',
    status: event?.status || 'DRAFT',
    is_featured: event?.is_featured || false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    event?.thumbnail_url || event?.original_image_url || null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      if (mode === 'edit' && event) {
        setFormData({
          title: event.title,
          description: event.description,
          event_date: event.event_date,
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          registration_link: event.registration_link || '',
          status: event.status,
          is_featured: event.is_featured,
        });
        setImagePreview(event.thumbnail_url || event.original_image_url || null);
      } else {
        setFormData({
          title: '',
          description: '',
          event_date: '',
          start_time: '',
          end_time: '',
          location: '',
          registration_link: '',
          status: 'DRAFT',
          is_featured: false,
        });
        setImagePreview(null);
      }
      setImageFile(null);
      setErrors({});
    }
  }, [open, mode, event]);

  const handleInputChange = (field: keyof CreateEventData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.event_date) {
      newErrors.event_date = 'Event date is required';
    }
    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }
    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    // Validate date is not in the past
    if (formData.event_date) {
      const eventDate = new Date(formData.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        newErrors.event_date = 'Event date cannot be in the past';
      }
    }

    // Validate time range
    if (formData.start_time && formData.end_time) {
      if (formData.start_time >= formData.end_time) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    // Validate registration link URL format
    if (formData.registration_link && formData.registration_link.trim()) {
      try {
        new URL(formData.registration_link);
      } catch {
        newErrors.registration_link = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        original_image: imageFile || undefined,
      };

      let result;
      if (mode === 'create') {
        result = await createEvent(submitData);
      } else if (event) {
        result = await updateEvent({
          id: event.id,
          ...submitData,
        } as UpdateEventData);
      }

      if (result) {
        onClose();
        toast.success(`Event ${mode === 'create' ? 'created' : 'updated'} successfully!`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const statusOptions: { value: EventStatus; label: string; color: string }[] = [
    { value: 'DRAFT', label: 'Draft', color: '#9e9e9e' },
    { value: 'PUBLISHED', label: 'Published', color: '#4caf50' },
    { value: 'CANCELLED', label: 'Cancelled', color: '#f44336' },
    { value: 'COMPLETED', label: 'Completed', color: '#2196f3' },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "rounded-2xl overflow-hidden",
        style: { maxHeight: '90vh' }
      }}
    >
      <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 text-white relative">
        <div className="flex items-center justify-between">
          <Typography variant="h6" className="font-bold">
            {mode === 'create' ? '🎉 Create New Event' : '✏️ Edit Event'}
          </Typography>
          <IconButton
            onClick={onClose}
            className="text-white hover:bg-white/20"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent className="p-6 bg-gray-50">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <Alert severity="error" className="rounded-lg">
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <Typography variant="h6" className="text-gray-800 mb-4 flex items-center">
              📝 Basic Information
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Event Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                fullWidth
                required
                className="bg-white"
              />
              
              <TextField
                label="Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
                fullWidth
                required
                className="bg-white"
              />
            </div>

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              fullWidth
              required
              multiline
              rows={4}
              className="mt-4 bg-white"
            />
          </motion.div>

          {/* Date & Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <Typography variant="h6" className="text-gray-800 mb-4 flex items-center">
              📅 Date & Time
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Event Date"
                type="date"
                value={formData.event_date}
                onChange={(e) => handleInputChange('event_date', e.target.value)}
                error={!!errors.event_date}
                helperText={errors.event_date}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                className="bg-white"
              />
              
              <TextField
                label="Start Time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                error={!!errors.start_time}
                helperText={errors.start_time}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                className="bg-white"
              />
              
              <TextField
                label="End Time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
                error={!!errors.end_time}
                helperText={errors.end_time}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                className="bg-white"
              />
            </div>
          </motion.div>

          {/* Additional Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <Typography variant="h6" className="text-gray-800 mb-4 flex items-center">
              ⚙️ Additional Details
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  label="Status"
                  className="bg-white"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: option.color }}
                        />
                        {option.label}
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Registration Link (Optional)"
                value={formData.registration_link}
                onChange={(e) => handleInputChange('registration_link', e.target.value)}
                error={!!errors.registration_link}
                helperText={errors.registration_link}
                fullWidth
                placeholder="https://example.com/register"
                className="bg-white"
              />
            </div>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_featured}
                  onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  color="primary"
                />
              }
              label="⭐ Featured Event"
            />
          </motion.div>

          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <Typography variant="h6" className="text-gray-800 mb-4 flex items-center">
              🖼️ Event Image
            </Typography>
            
            <ImageUploadZone
              onImageSelect={(file) => setImageFile(file)}
              currentImage={imagePreview}
              loading={loading}
              error={null}
              maxSize={10}
              acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
            />
          </motion.div>
        </div>
      </DialogContent>

      <DialogActions className="p-6 bg-gray-50 border-t">
        <Button
          onClick={onClose}
          variant="outlined"
          className="mr-2"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {loading
            ? `${mode === 'create' ? 'Creating' : 'Updating'}...`
            : `${mode === 'create' ? 'Create Event' : 'Update Event'}`
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventFormModal;
