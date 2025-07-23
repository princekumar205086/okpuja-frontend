"use client";
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Chip,
  Autocomplete,
  Alert,
  CircularProgress,
  Divider,
  Paper,
} from '@mui/material';
import {
  Close,
  Save,
  Preview,
  Image as ImageIcon,
  YouTube,
} from '@mui/icons-material';
import { useBlogStore, BlogPost, CreatePostData } from '@/app/stores/blogStore';
import RichTextEditor from '@/app/components/ui/RichTextEditor';

interface PostFormDrawerProps {
  open: boolean;
  onClose: () => void;
  editPost?: BlogPost | null;
}

const PostFormDrawer: React.FC<PostFormDrawerProps> = ({ open, onClose, editPost }) => {
  const {
    categories,
    tags,
    loading,
    error,
    createPost,
    updatePost,
    fetchCategories,
    fetchTags,
    clearError,
  } = useBlogStore();

  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    content: '',
    excerpt: '',
    category: 0,
    tags: [],
    status: 'DRAFT',
    is_featured: false,
    youtube_url: '',
  });
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchTags();
      clearError();
    }
  }, [open]);

  useEffect(() => {
    if (editPost) {
      setFormData({
        title: editPost.title,
        content: editPost.content,
        excerpt: editPost.excerpt || '',
        category: editPost.category.id,
        tags: editPost.tags.map(tag => tag.id),
        status: editPost.status === "ARCHIVED" ? "DRAFT" : editPost.status,
        is_featured: editPost.is_featured,
        youtube_url: editPost.youtube_url || '',
      });
      setSelectedTags(editPost.tags);
      setImagePreview(editPost.featured_image_thumbnail_url || '');
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: 0,
        tags: [],
        status: 'DRAFT',
        is_featured: false,
        youtube_url: '',
      });
      setSelectedTags([]);
      setFeaturedImage(null);
      setImagePreview('');
    }
  }, [editPost, open]);

  const handleInputChange = (field: keyof CreatePostData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagsChange = (event: any, newValue: any[]) => {
    setSelectedTags(newValue);
    setFormData(prev => ({ ...prev, tags: newValue.map(tag => tag.id) }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      return;
    }

    const submitData = { ...formData };
    if (featuredImage) {
      submitData.featured_image = featuredImage;
    }

    const success = editPost 
      ? await updatePost(editPost.slug, submitData)
      : await createPost(submitData);

    if (success) {
      onClose();
    }
  };

  const isFormValid = formData.title.trim() && formData.content.trim() && formData.category;

  return (
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
      <Box className="flex flex-col h-full">
        {/* Header */}
        <Box className="flex items-center justify-between p-4 border-b bg-gray-50">
          <Typography variant="h6" className="font-semibold">
            {editPost ? 'Edit Post' : 'Create New Post'}
          </Typography>
          <Box className="flex items-center gap-2">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Preview />}
              className="hidden sm:flex"
            >
              Preview
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              startIcon={loading ? <CircularProgress size={16} /> : <Save />}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {editPost ? 'Update' : 'Save'} Post
            </Button>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box className="flex-1 overflow-auto">
          <Box className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Error Alert */}
            {error && (
              <Alert 
                severity="error" 
                onClose={clearError}
                sx={{ 
                  borderRadius: 2,
                  mb: 3
                }}
              >
                {error}
              </Alert>
            )}

            {/* Basic Information */}
            <Paper 
              elevation={2} 
              className="p-6 space-y-6"
              sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                Basic Information
              </Typography>

              <TextField
                fullWidth
                label="Post Title *"
                value={formData.title}
                onChange={handleInputChange('title')}
                variant="outlined"
                className="bg-white"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#f97316',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f97316',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#f97316',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Excerpt"
                value={formData.excerpt}
                onChange={handleInputChange('excerpt')}
                multiline
                rows={3}
                variant="outlined"
                helperText="A brief summary of the post (optional)"
                className="bg-white"
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#f97316',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f97316',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#f97316',
                  },
                }}
              />

              <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormControl fullWidth>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category *"
                    onChange={handleInputChange('category')}
                    sx={{
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f97316',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f97316',
                      },
                    }}
                  >
                    {(categories || []).map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Autocomplete
                  multiple
                  options={tags || []}
                  value={selectedTags}
                  onChange={handleTagsChange}
                  getOptionLabel={(option) => option.name}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option.name}
                        {...getTagProps({ index })}
                        key={option.id}
                        className="border-orange-200 text-orange-600 bg-orange-50"
                        sx={{ borderRadius: 2 }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Select tags..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#f97316',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#f97316',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f97316',
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Paper>

            {/* Content Editor */}
            <Paper 
              elevation={2} 
              className="p-6 space-y-6"
              sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                Content *
              </Typography>
              <Box sx={{ mt: 3 }}>
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your blog post content here..."
                  minHeight={400}
                />
              </Box>
            </Paper>

            {/* Media */}
            <Paper 
              elevation={2} 
              className="p-6 space-y-6"
              sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                Media
              </Typography>

              {/* Featured Image */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" className="mb-3 font-medium text-gray-700">
                  Featured Image
                </Typography>
                <Box className="flex flex-col sm:flex-row gap-4 items-start">
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                    className="border-gray-300 hover:border-orange-500"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#f97316',
                        backgroundColor: '#fff7ed',
                      },
                    }}
                  >
                    Choose Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {imagePreview && (
                    <Box className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <IconButton
                        size="small"
                        className="absolute -top-2 -right-2 bg-red-500 text-white hover:bg-red-600 shadow-lg"
                        onClick={() => {
                          setImagePreview('');
                          setFeaturedImage(null);
                        }}
                        sx={{ borderRadius: '50%' }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* YouTube URL */}
              <TextField
                fullWidth
                label="YouTube URL"
                value={formData.youtube_url}
                onChange={handleInputChange('youtube_url')}
                variant="outlined"
                InputProps={{
                  startAdornment: <YouTube className="text-red-500 mr-2" />,
                }}
                helperText="Embed a YouTube video in your post (optional)"
                sx={{
                  mt: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#f97316',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f97316',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#f97316',
                  },
                }}
              />
            </Paper>

            {/* Settings */}
            <Paper 
              elevation={2} 
              className="p-6 space-y-6"
              sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                Publishing Settings
              </Typography>

              <Box className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={handleInputChange('status')}
                    sx={{
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f97316',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f97316',
                      },
                    }}
                  >
                    <MenuItem value="DRAFT">Draft</MenuItem>
                    <MenuItem value="PUBLISHED">Published</MenuItem>
                  </Select>
                </FormControl>

                <Box className="flex items-center justify-center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_featured}
                        onChange={handleInputChange('is_featured')}
                        color="warning"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#f97316',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#f97316',
                          },
                        }}
                      />
                    }
                    label="Featured Post"
                  />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default PostFormDrawer;
