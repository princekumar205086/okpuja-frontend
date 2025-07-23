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
} from '@mui/icons-material';
import { useBlogStore, BlogCategory, CreateCategoryData } from '@/app/stores/blogStore';
import { format } from 'date-fns';

interface CategoriesManagementProps {
  className?: string;
}

const CategoriesManagement: React.FC<CategoriesManagementProps> = ({ className }) => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  } = useBlogStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<BlogCategory | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    description: '',
    meta_title: '',
    meta_keywords: '',
    meta_description: '',
    status: 'DRAFT',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editCategory) {
      setFormData({
        name: editCategory.name,
        description: editCategory.description || '',
        meta_title: editCategory.meta_title || '',
        meta_keywords: editCategory.meta_keywords || '',
        meta_description: editCategory.meta_description || '',
        status: editCategory.status,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        meta_title: '',
        meta_keywords: '',
        meta_description: '',
        status: 'DRAFT',
      });
    }
  }, [editCategory]);

  const filteredCategories = (categories || []).filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (category: BlogCategory) => {
    setEditCategory(category);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditCategory(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(slug);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    const success = editCategory
      ? await updateCategory(editCategory.slug, formData)
      : await createCategory(formData);

    if (success) {
      setDrawerOpen(false);
      setEditCategory(null);
    }
  };

  const handleInputChange = (field: keyof CreateCategoryData) => (
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
        <Typography variant="h5" className="font-semibold text-gray-800">
          Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Add Category
        </Button>
      </Box>

      {/* Search */}
      <Paper className="p-4 mb-4">
        <TextField
          placeholder="Search categories..."
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

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="font-semibold bg-gray-50">Name</TableCell>
                <TableCell className="font-semibold bg-gray-50 hidden md:table-cell">Description</TableCell>
                <TableCell className="font-semibold bg-gray-50 hidden sm:table-cell">Status</TableCell>
                <TableCell className="font-semibold bg-gray-50 hidden lg:table-cell">Created</TableCell>
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
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Typography color="textSecondary">
                      No categories found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" className="font-medium">
                        {category.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        /{category.slug}
                      </Typography>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="line-clamp-2 max-w-xs"
                      >
                        {category.description || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      <Chip
                        label={category.status}
                        size="small"
                        color={getStatusColor(category.status) as any}
                        variant="filled"
                      />
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      <Typography variant="body2" color="textSecondary">
                        {format(new Date(category.created_at), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box className="flex items-center justify-center gap-1">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(category)}
                            className="text-orange-600 hover:bg-orange-50"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(category.slug)}
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
            height: '80vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <Box className="flex flex-col h-full">
          {/* Header */}
          <Box className="flex items-center justify-between p-4 border-b bg-gray-50">
            <Typography variant="h6" className="font-semibold">
              {editCategory ? 'Edit Category' : 'Create New Category'}
            </Typography>
            <Box className="flex items-center gap-2">
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!formData.name.trim() || loading}
                startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {editCategory ? 'Update' : 'Save'} Category
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
                label="Category Name *"
                value={formData.name}
                onChange={handleInputChange('name')}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                multiline
                rows={3}
                variant="outlined"
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

              {/* SEO Fields */}
              <Typography variant="h6" className="font-medium text-gray-800 pt-4">
                SEO Settings
              </Typography>

              <TextField
                fullWidth
                label="Meta Title"
                value={formData.meta_title}
                onChange={handleInputChange('meta_title')}
                variant="outlined"
                helperText="SEO title for search engines"
              />

              <TextField
                fullWidth
                label="Meta Keywords"
                value={formData.meta_keywords}
                onChange={handleInputChange('meta_keywords')}
                variant="outlined"
                helperText="Comma-separated keywords"
              />

              <TextField
                fullWidth
                label="Meta Description"
                value={formData.meta_description}
                onChange={handleInputChange('meta_description')}
                multiline
                rows={3}
                variant="outlined"
                helperText="SEO description for search engines"
              />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CategoriesManagement;
