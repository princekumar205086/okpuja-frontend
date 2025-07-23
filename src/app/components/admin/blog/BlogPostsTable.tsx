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
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
  useTheme,
  alpha,
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
  MoreVert,
  TableView,
  ViewModule,
  SelectAll,
  DeleteSweep,
  Publish,
  Archive,
  StarOutline,
  CheckCircle,
  Schedule,
  VisibilityOff,
  MoreHoriz,
  ThumbUp,
  Comment,
  Share,
} from '@mui/icons-material';
import { useBlogStore, BlogPost } from '@/app/stores/blogStore';
import { format } from 'date-fns';

interface BlogPostsTableProps {
  onEdit: (post: BlogPost) => void;
  onAdd: () => void;
  onView: (post: BlogPost) => void;
}

const BlogPostsTable: React.FC<BlogPostsTableProps> = ({ onEdit, onAdd, onView }) => {
  const theme = useTheme();
  const {
    posts,
    categories,
    loading,
    error,
    totalPosts,
    fetchPosts,
    fetchCategories,
    deletePost,
    updatePost,
    clearError,
  } = useBlogStore();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [bulkActionAnchor, setBulkActionAnchor] = useState<null | HTMLElement>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPosts(page + 1, searchTerm, categoryFilter, statusFilter);
    fetchCategories();
  }, [page, rowsPerPage, searchTerm, categoryFilter, statusFilter, fetchPosts, fetchCategories]);

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

  const handleSelectAll = () => {
    if (selectedPosts.length === posts?.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts?.map(post => post.id) || []);
    }
  };

  const handleSelectPost = (postId: number) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedPosts.length === 0) return;
    
    setActionLoading(true);
    try {
      const selectedPostObjects = posts?.filter(post => selectedPosts.includes(post.id)) || [];
      
      switch (action) {
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) {
            for (const post of selectedPostObjects) {
              await deletePost(post.slug);
            }
          }
          break;
        case 'publish':
          for (const post of selectedPostObjects) {
            if (post.status !== 'PUBLISHED') {
              await updatePost(post.slug, { status: 'PUBLISHED' });
            }
          }
          break;
        case 'draft':
          for (const post of selectedPostObjects) {
            if (post.status !== 'DRAFT') {
              await updatePost(post.slug, { status: 'DRAFT' });
            }
          }
          break;
        case 'feature':
          for (const post of selectedPostObjects) {
            await updatePost(post.slug, { is_featured: true });
          }
          break;
        case 'unfeature':
          for (const post of selectedPostObjects) {
            await updatePost(post.slug, { is_featured: false });
          }
          break;
      }
      setSelectedPosts([]);
    } catch (error) {
      console.error('Bulk action error:', error);
    } finally {
      setActionLoading(false);
      setBulkActionAnchor(null);
    }
  };

  const PostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <Card 
      className="h-full transition-all duration-200 hover:shadow-lg border"
      sx={{
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: theme.palette.primary.main,
        }
      }}
    >
      <CardContent className="p-4">
        <Box className="flex items-start justify-between mb-3">
          <Checkbox
            checked={selectedPosts.includes(post.id)}
            onChange={() => handleSelectPost(post.id)}
            className="p-1"
          />
          <Box className="flex items-center gap-1">
            {post.is_featured && (
              <Star className="text-yellow-500 w-4 h-4" />
            )}
            <Chip
              label={post.status}
              size="small"
              color={getStatusColor(post.status) as any}
              variant="filled"
              className="text-xs"
            />
          </Box>
        </Box>

        {post.featured_image_thumbnail_url && (
          <Box className="mb-3">
            <img
              src={post.featured_image_thumbnail_url}
              alt={post.title}
              className="w-full h-32 object-cover rounded-lg"
            />
          </Box>
        )}

        <Typography 
          variant="h6" 
          className="font-semibold text-gray-900 mb-2 line-clamp-2"
          style={{ fontSize: '1.1rem', lineHeight: '1.3' }}
        >
          {post.title}
        </Typography>

        {post.excerpt && (
          <Typography 
            variant="body2" 
            color="textSecondary" 
            className="mb-3 line-clamp-3"
          >
            {post.excerpt}
          </Typography>
        )}

        <Box className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6 text-xs bg-orange-100 text-orange-600">
            {post.author.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" className="text-gray-600 text-sm">
            {post.author.username}
          </Typography>
        </Box>

        <Chip
          label={post.category.name}
          size="small"
          variant="outlined"
          className="border-orange-200 text-orange-600 mb-3"
        />

        <Box className="flex items-center justify-between text-sm text-gray-500">
          <Box className="flex items-center gap-1">
            <Visibility className="w-4 h-4" />
            <span>{post.view_count.toLocaleString()}</span>
          </Box>
          <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
        </Box>
      </CardContent>

      <CardActions className="px-4 pb-4 pt-0">
        <Button
          size="small"
          onClick={() => onView(post)}
          startIcon={<Visibility />}
          className="text-blue-600 hover:bg-blue-50"
        >
          View
        </Button>
        <Button
          size="small"
          onClick={() => onEdit(post)}
          startIcon={<Edit />}
          className="text-orange-600 hover:bg-orange-50"
        >
          Edit
        </Button>
        <Button
          size="small"
          onClick={() => handleDelete(post.slug)}
          startIcon={<Delete />}
          className="text-red-600 hover:bg-red-50"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box className="space-y-6">
      {/* Enhanced Header */}
      <Box className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-900 mb-1">
            Blog Posts
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage and organize your blog content
          </Typography>
        </Box>
        <Box className="flex items-center gap-3">
          {selectedPosts.length > 0 && (
            <Fade in={selectedPosts.length > 0}>
              <Box className="flex items-center gap-2">
                <Typography variant="body2" className="text-gray-600">
                  {selectedPosts.length} selected
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => setBulkActionAnchor(e.currentTarget)}
                  startIcon={actionLoading ? <CircularProgress size={16} /> : <MoreVert />}
                  disabled={actionLoading}
                  className="border-gray-300"
                >
                  Bulk Actions
                </Button>
              </Box>
            </Fade>
          )}
          
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
            className="border"
          >
            <ToggleButton value="table" aria-label="table view">
              <TableView />
            </ToggleButton>
            <ToggleButton value="cards" aria-label="card view">
              <ViewModule />
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAdd}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
            }}
          >
            Add New Post
          </Button>
        </Box>
      </Box>

      {/* Enhanced Search and Filters */}
      <Paper 
        elevation={0} 
        className="p-6 border border-gray-200 bg-gradient-to-r from-gray-50 to-white"
        sx={{ borderRadius: 3 }}
      >
        <Box className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <TextField
            placeholder="Search posts, authors, or content..."
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
            className="flex-1 min-w-[300px]"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'white',
                },
              },
            }}
          />
          
          <Box className="flex flex-wrap gap-3 items-center">
            <Button
              variant={showFilters ? "contained" : "outlined"}
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterList />}
              className={showFilters ? 'bg-orange-500 text-white' : 'border-gray-300 text-gray-600'}
              sx={{ borderRadius: 2 }}
            >
              Filters
            </Button>

            {(statusFilter || categoryFilter || searchTerm) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setStatusFilter('');
                  setCategoryFilter('');
                  setSearchTerm('');
                }}
                className="border-gray-300 text-gray-600"
                sx={{ borderRadius: 2 }}
              >
                Clear All
              </Button>
            )}
          </Box>
        </Box>

        {/* Collapsible Filters */}
        {showFilters && (
          <Fade in={showFilters}>
            <Box className="mt-6 pt-6 border-t border-gray-200">
              <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ borderRadius: 2, backgroundColor: 'white' }}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="PUBLISHED">
                      <Box className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Published
                      </Box>
                    </MenuItem>
                    <MenuItem value="DRAFT">
                      <Box className="flex items-center gap-2">
                        <Schedule className="w-4 h-4 text-orange-500" />
                        Draft
                      </Box>
                    </MenuItem>
                    <MenuItem value="ARCHIVED">
                      <Box className="flex items-center gap-2">
                        <VisibilityOff className="w-4 h-4 text-gray-500" />
                        Archived
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    sx={{ borderRadius: 2, backgroundColor: 'white' }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {(categories || []).map((category) => (
                      <MenuItem key={category.id} value={category.slug}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Fade>
        )}
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          onClose={clearError}
          className="border-l-4 border-l-red-500"
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Content Area */}
      {viewMode === 'table' ? (
        <Paper 
          elevation={0} 
          className="overflow-hidden border border-gray-200"
          sx={{ borderRadius: 3 }}
        >
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" className="bg-gray-50">
                    <Checkbox
                      indeterminate={selectedPosts.length > 0 && selectedPosts.length < (posts?.length || 0)}
                      checked={posts?.length > 0 && selectedPosts.length === posts.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell className="font-semibold bg-gray-50 text-gray-700">Post</TableCell>
                  <TableCell className="font-semibold bg-gray-50 text-gray-700 hidden md:table-cell">Author</TableCell>
                  <TableCell className="font-semibold bg-gray-50 text-gray-700 hidden lg:table-cell">Category</TableCell>
                  <TableCell className="font-semibold bg-gray-50 text-gray-700 hidden sm:table-cell">Status</TableCell>
                  <TableCell className="font-semibold bg-gray-50 text-gray-700 hidden lg:table-cell">Views</TableCell>
                  <TableCell className="font-semibold bg-gray-50 text-gray-700 hidden xl:table-cell">Created</TableCell>
                  <TableCell className="font-semibold bg-gray-50 text-gray-700 text-center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <CircularProgress size={50} className="text-orange-500" />
                      <Typography variant="body2" className="mt-2 text-gray-500">
                        Loading posts...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : !posts || posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <Box className="flex flex-col items-center gap-3">
                        <Box className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Add className="w-8 h-8 text-gray-400" />
                        </Box>
                        <Typography variant="h6" className="text-gray-600">
                          No posts found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Create your first blog post to get started
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={onAdd}
                          className="bg-orange-500 hover:bg-orange-600 mt-2"
                        >
                          Create Post
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow 
                      key={post.id} 
                      hover 
                      className="cursor-pointer transition-colors duration-150"
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        }
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedPosts.includes(post.id)}
                          onChange={() => handleSelectPost(post.id)}
                        />
                      </TableCell>
                      
                      <TableCell onClick={() => onView(post)}>
                        <Box className="flex items-center gap-3">
                          {post.featured_image_thumbnail_url && (
                            <Avatar
                              src={post.featured_image_thumbnail_url}
                              variant="rounded"
                              className="w-14 h-14"
                              sx={{ borderRadius: 2 }}
                            />
                          )}
                          <Box className="min-w-0 flex-1">
                            <Box className="flex items-center gap-2 mb-1">
                              <Typography
                                variant="subtitle1"
                                className="font-semibold text-gray-900 line-clamp-1"
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
                                className="line-clamp-2"
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
                          <Typography variant="body2" className="text-gray-700">
                            {post.author.username}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        <Chip
                          label={post.category.name}
                          size="small"
                          variant="outlined"
                          className="border-orange-200 text-orange-600 bg-orange-50"
                        />
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        <Chip
                          label={post.status}
                          size="small"
                          color={getStatusColor(post.status) as any}
                          variant="filled"
                          icon={
                            post.status === 'PUBLISHED' ? <CheckCircle className="w-3 h-3" /> :
                            post.status === 'DRAFT' ? <Schedule className="w-3 h-3" /> :
                            <VisibilityOff className="w-3 h-3" />
                          }
                        />
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        <Box className="flex items-center gap-1 text-gray-600">
                          <Visibility className="w-4 h-4" />
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
                          <Tooltip title="View Post">
                            <IconButton
                              size="small"
                              onClick={() => onView(post)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Post">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(post)}
                              className="text-orange-600 hover:bg-orange-50"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Post">
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

          {/* Enhanced Pagination */}
          <Box className="border-t border-gray-200 bg-gray-50 px-6 py-3">
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalPosts}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
              }
            />
          </Box>
        </Paper>
      ) : (
        <Box>
          {/* Cards Header */}
          <Box className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="text-gray-800">
              {posts?.length || 0} Posts
            </Typography>
            {selectedPosts.length > 0 && (
              <Typography variant="body2" className="text-gray-600">
                {selectedPosts.length} selected
              </Typography>
            )}
          </Box>

          {/* Cards Grid */}
          {loading ? (
            <Box className="flex justify-center items-center py-12">
              <CircularProgress size={50} className="text-orange-500" />
            </Box>
          ) : !posts || posts.length === 0 ? (
            <Paper className="p-12 text-center border border-gray-200" sx={{ borderRadius: 3 }}>
              <Box className="flex flex-col items-center gap-3">
                <Box className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Add className="w-8 h-8 text-gray-400" />
                </Box>
                <Typography variant="h6" className="text-gray-600">
                  No posts found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Create your first blog post to get started
                </Typography>
                <Button
                  variant="contained"
                  onClick={onAdd}
                  className="bg-orange-500 hover:bg-orange-600 mt-2"
                >
                  Create Post
                </Button>
              </Box>
            </Paper>
          ) : (
            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Box>
          )}

          {/* Cards Pagination */}
          {posts && posts.length > 0 && (
            <Box className="mt-6 flex justify-center">
              <Paper elevation={0} className="border border-gray-200" sx={{ borderRadius: 3 }}>
                <TablePagination
                  rowsPerPageOptions={[8, 16, 24, 32]}
                  component="div"
                  count={totalPosts}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Cards per page:"
                />
              </Paper>
            </Box>
          )}
        </Box>
      )}

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkActionAnchor}
        open={Boolean(bulkActionAnchor)}
        onClose={() => setBulkActionAnchor(null)}
        PaperProps={{
          sx: { minWidth: 200, mt: 1, borderRadius: 2 }
        }}
      >
        <MenuItem onClick={() => handleBulkAction('publish')}>
          <ListItemIcon>
            <Publish className="text-green-600" />
          </ListItemIcon>
          <ListItemText>Publish Selected</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('draft')}>
          <ListItemIcon>
            <Schedule className="text-orange-600" />
          </ListItemIcon>
          <ListItemText>Move to Draft</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('feature')}>
          <ListItemIcon>
            <Star className="text-yellow-600" />
          </ListItemIcon>
          <ListItemText>Feature Posts</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('unfeature')}>
          <ListItemIcon>
            <StarOutline className="text-gray-600" />
          </ListItemIcon>
          <ListItemText>Unfeature Posts</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('delete')} className="text-red-600">
          <ListItemIcon>
            <DeleteSweep className="text-red-600" />
          </ListItemIcon>
          <ListItemText>Delete Selected</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default BlogPostsTable;
