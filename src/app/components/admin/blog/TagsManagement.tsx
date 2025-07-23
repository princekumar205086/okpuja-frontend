"use client";
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  Alert,
  CircularProgress,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add,
  Close,
  Save,
  LocalOffer,
} from '@mui/icons-material';
import { useBlogStore, BlogTag, CreateTagData } from '@/app/stores/blogStore';
import { format } from 'date-fns';

interface TagsManagementProps {
  className?: string;
}

const TagsManagement: React.FC<TagsManagementProps> = ({ className }) => {
  const {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    clearError,
  } = useBlogStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTag, setEditTag] = useState<BlogTag | null>(null);
  const [formData, setFormData] = useState<CreateTagData>({
    name: '',
    description: '',
    status: 'DRAFT',
  });

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (editTag) {
      setFormData({
        name: editTag.name,
        description: editTag.description || '',
        status: editTag.status,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'DRAFT',
      });
    }
  }, [editTag]);

  const filteredTags = (tags || []).filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (tag: BlogTag) => {
    setEditTag(tag);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditTag(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      await deleteTag(slug);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    const success = editTag
      ? await updateTag(editTag.slug, formData)
      : await createTag(formData);

    if (success) {
      setDrawerOpen(false);
      setEditTag(null);
    }
  };

  const handleInputChange = (field: keyof CreateTagData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'warning';
      case 'ARCHIVED':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box className={className}>
      {/* Header */}
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Box className="flex items-center gap-2">
          <LocalOffer className="text-orange-500" />
          <Typography variant="h5" className="font-semibold text-gray-800">
            Tags
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Add Tag
        </Button>
      </Box>

      {/* Search */}
      <Paper className="p-4 mb-4">
        <TextField
          placeholder="Search tags..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="text-gray-400" />
              </InputAdornment>
            ),
          }}
          className="w-full max-w-md"
        />
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={clearError} className="mb-4">
          {error}
        </Alert>
      )}

      {/* Tags Grid for Mobile, Table for Desktop */}
      <Box className="block md:hidden">
        {/* Mobile Grid View */}
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading ? (
            <Box className="col-span-full flex justify-center py-8">
              <CircularProgress size={40} className="text-orange-500" />
            </Box>
          ) : filteredTags.length === 0 ? (
            <Box className="col-span-full text-center py-8">
              <Typography color="textSecondary">No tags found</Typography>
            </Box>
          ) : (
            filteredTags.map((tag) => (
              <Paper key={tag.id} className="p-4 hover:shadow-md transition-shadow">
                <Box className="flex items-start justify-between mb-2">
                  <Box className="flex items-center gap-2">
                    <LocalOffer className="text-orange-500 text-sm" />
                    <Typography variant="subtitle1" className="font-medium">
                      {tag.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={tag.status}
                    size="small"
                    color={getStatusColor(tag.status) as any}
                    variant="filled"
                  />
                </Box>
                
                {tag.description && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="mb-2 line-clamp-2"
                  >
                    {tag.description}
                  </Typography>
                )}
                
                <Box className="flex items-center justify-between">
                  <Typography variant="caption" color="textSecondary">
                    Created {format(new Date(tag.created_at), 'MMM dd, yyyy')}
                  </Typography>
                  <Box className="flex gap-1">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(tag)}
                      className="text-orange-600 hover:bg-orange-50"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(tag.slug)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))
          )}
        </Box>
      </Box>

      {/* Desktop Table View */}
      <Paper className="hidden md:block">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="font-semibold bg-gray-50">Name</TableCell>
                <TableCell className="font-semibold bg-gray-50">Description</TableCell>
                <TableCell className="font-semibold bg-gray-50">Status</TableCell>
                <TableCell className="font-semibold bg-gray-50">Created</TableCell>
                <TableCell className="font-semibold bg-gray-50 text-center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <CircularProgress size={40} className="text-orange-500" />
                  </TableCell>
                </TableRow>
              ) : filteredTags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Typography color="textSecondary">
                      No tags found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTags.map((tag) => (
                  <TableRow key={tag.id} hover>
                    <TableCell>
                      <Box className="flex items-center gap-2">
                        <LocalOffer className="text-orange-500 text-sm" />
                        <Box>
                          <Typography variant="subtitle2" className="font-medium">
                            {tag.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            /{tag.slug}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="line-clamp-2 max-w-xs"
                      >
                        {tag.description || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={tag.status}
                        size="small"
                        color={getStatusColor(tag.status) as any}
                        variant="filled"
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {format(new Date(tag.created_at), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box className="flex items-center justify-center gap-1">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(tag)}
                            className="text-orange-600 hover:bg-orange-50"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(tag.slug)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Form Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            height: '60vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <Box className="flex flex-col h-full">
          {/* Header */}
          <Box className="flex items-center justify-between p-4 border-b bg-gray-50">
            <Typography variant="h6" className="font-semibold">
              {editTag ? 'Edit Tag' : 'Create New Tag'}
            </Typography>
            <Box className="flex items-center gap-2">
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!formData.name.trim() || loading}
                startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {editTag ? 'Update' : 'Save'} Tag
              </Button>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Form Content */}
          <Box className="flex-1 overflow-auto p-4">
            <Box className="max-w-2xl mx-auto space-y-4">
              <TextField
                fullWidth
                label="Tag Name *"
                value={formData.name}
                onChange={handleInputChange('name')}
                variant="outlined"
                placeholder="e.g., Astrology, Spirituality, Meditation"
              />

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                multiline
                rows={3}
                variant="outlined"
                placeholder="Brief description of this tag..."
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={handleInputChange('status')}
                >
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                  <MenuItem value="ARCHIVED">Archived</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default TagsManagement;
