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
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add,
  Visibility,
  Star,
  StarBorder,
  FilterList,
} from '@mui/icons-material';
import { useBlogStore, BlogPost } from '@/app/stores/blogStore';
import { format } from 'date-fns';

interface BlogPostsTableProps {
  onEdit: (post: BlogPost) => void;
  onAdd: () => void;
  onView: (post: BlogPost) => void;
}

const BlogPostsTable: React.FC<BlogPostsTableProps> = ({ onEdit, onAdd, onView }) => {
  const {
    posts,
    categories,
    loading,
    error,
    totalPosts,
    fetchPosts,
    fetchCategories,
    deletePost,
    clearError,
  } = useBlogStore();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPosts(page + 1, searchTerm, categoryFilter, statusFilter);
    fetchCategories();
  }, [page, rowsPerPage, searchTerm, categoryFilter, statusFilter]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(slug);
    }
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  return (
    <Box className="space-y-4">
      {/* Header */}
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Typography variant="h5" className="font-semibold text-gray-800">
          Blog Posts
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Add New Post
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper className="p-4">
        <Box className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <TextField
            placeholder="Search posts..."
            size="small"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            className="flex-1 min-w-[200px]"
          />
          
          <Box className="flex flex-wrap gap-2">
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              className={`${showFilters ? 'bg-orange-100 text-orange-600' : ''}`}
            >
              <FilterList />
            </IconButton>
          </Box>
        </Box>

        {/* Collapsible Filters */}
        {showFilters && (
          <Box className="mt-4 pt-4 border-t flex flex-col sm:flex-row gap-4">
            <FormControl size="small" className="min-w-[150px]">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="PUBLISHED">Published</MenuItem>
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="ARCHIVED">Archived</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" className="min-w-[150px]">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.slug}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={() => {
                setStatusFilter('');
                setCategoryFilter('');
                setSearchTerm('');
              }}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          onClose={clearError}
          className="mb-4"
        >
          {error}
        </Alert>
      )}

      {/* Table */}
      <Paper className="overflow-hidden">
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className="font-semibold bg-gray-50">Title</TableCell>
                <TableCell className="font-semibold bg-gray-50 hidden md:table-cell">Author</TableCell>
                <TableCell className="font-semibold bg-gray-50 hidden lg:table-cell">Category</TableCell>
                <TableCell className="font-semibold bg-gray-50 hidden sm:table-cell">Status</TableCell>
                <TableCell className="font-semibold bg-gray-50 hidden lg:table-cell">Views</TableCell>
                <TableCell className="font-semibold bg-gray-50 hidden xl:table-cell">Created</TableCell>
                <TableCell className="font-semibold bg-gray-50 text-center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <CircularProgress size={40} className="text-orange-500" />
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Typography color="textSecondary">
                      No posts found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id} hover className="cursor-pointer">
                    <TableCell onClick={() => onView(post)}>
                      <Box className="flex items-center gap-3">
                        {post.featured_image_thumbnail_url && (
                          <Avatar
                            src={post.featured_image_thumbnail_url}
                            variant="rounded"
                            className="w-12 h-12"
                          />
                        )}
                        <Box>
                          <Box className="flex items-center gap-1">
                            <Typography
                              variant="subtitle2"
                              className="font-medium text-gray-800 line-clamp-2"
                            >
                              {post.title}
                            </Typography>
                            {post.is_featured && (
                              <Star className="text-yellow-500 w-4 h-4" />
                            )}
                          </Box>
                          {post.excerpt && (
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              className="line-clamp-1 mt-1"
                            >
                              {post.excerpt}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Box className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 text-xs bg-orange-100 text-orange-600">
                          {post.author.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" className="truncate">
                          {post.author.username}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      <Chip
                        label={post.category.name}
                        size="small"
                        variant="outlined"
                        className="border-orange-200 text-orange-600"
                      />
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      <Chip
                        label={post.status}
                        size="small"
                        color={getStatusColor(post.status) as any}
                        variant="filled"
                      />
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      <Box className="flex items-center gap-1">
                        <Visibility className="w-4 h-4 text-gray-400" />
                        <Typography variant="body2">
                          {post.view_count.toLocaleString()}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell className="hidden xl:table-cell">
                      <Typography variant="body2" color="textSecondary">
                        {format(new Date(post.created_at), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box className="flex items-center justify-center gap-1">
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => onView(post)}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(post)}
                            className="text-orange-600 hover:bg-orange-50"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(post.slug)}
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

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalPosts}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="border-t"
        />
      </Paper>
    </Box>
  );
};

export default BlogPostsTable;
