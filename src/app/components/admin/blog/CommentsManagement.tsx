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
  Avatar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  Alert,
  CircularProgress,
  Drawer,
  Switch,
  FormControlLabel,
  Link,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Close,
  Save,
  Person,
  Comment as CommentIcon,
  Article,
} from '@mui/icons-material';
import { useBlogStore, BlogComment } from '@/app/stores/blogStore';
import { format } from 'date-fns';

interface CommentsManagementProps {
  className?: string;
}

const CommentsManagement: React.FC<CommentsManagementProps> = ({ className }) => {
  const {
    comments,
    posts,
    loading,
    error,
    fetchComments,
    fetchPosts,
    updateComment,
    deleteComment,
    clearError,
  } = useBlogStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editComment, setEditComment] = useState<BlogComment | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editApproved, setEditApproved] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      // Find the post slug from the title
      const post = posts.find(p => p.title === selectedPost);
      if (post) {
        fetchComments(post.slug);
      }
    }
  }, [selectedPost]);

  useEffect(() => {
    if (editComment) {
      setEditContent(editComment.content);
      setEditApproved(editComment.is_approved);
    } else {
      setEditContent('');
      setEditApproved(false);
    }
  }, [editComment]);

  const filteredComments = comments.filter(comment =>
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (comment: BlogComment) => {
    setEditComment(comment);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(id);
    }
  };

  const handleSubmit = async () => {
    if (!editComment) return;

    const success = await updateComment(editComment.id, {
      content: editContent,
      is_approved: editApproved,
    });

    if (success) {
      setDrawerOpen(false);
      setEditComment(null);
      // Refresh comments
      if (selectedPost) {
        const post = posts.find(p => p.title === selectedPost);
        if (post) {
          fetchComments(post.slug);
        }
      }
    }
  };

  const toggleApproval = async (comment: BlogComment) => {
    await updateComment(comment.id, {
      is_approved: !comment.is_approved,
    });
    
    // Refresh comments
    if (selectedPost) {
      const post = posts.find(p => p.title === selectedPost);
      if (post) {
        fetchComments(post.slug);
      }
    }
  };

  return (
    <Box className={className}>
      {/* Header */}
      <Box className="flex items-center gap-2 mb-6">
        <CommentIcon className="text-orange-500" />
        <Typography variant="h5" className="font-semibold text-gray-800">
          Comments Management
        </Typography>
      </Box>

      {/* Filters */}
      <Paper className="p-4 mb-4">
        <Box className="flex flex-col lg:flex-row gap-4">
          <TextField
            select
            label="Select Post"
            value={selectedPost}
            onChange={(e) => setSelectedPost(e.target.value)}
            SelectProps={{ native: true }}
            className="flex-1 min-w-[250px]"
          >
            <option value="">Select a post to view comments</option>
            {posts.map((post) => (
              <option key={post.id} value={post.title}>
                {post.title}
              </option>
            ))}
          </TextField>

          {selectedPost && (
            <TextField
              placeholder="Search comments..."
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
              className="flex-1 max-w-md"
            />
          )}
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={clearError} className="mb-4">
          {error}
        </Alert>
      )}

      {!selectedPost ? (
        <Paper className="p-8 text-center">
          <Article className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <Typography variant="h6" color="textSecondary" className="mb-2">
            Select a Post
          </Typography>
          <Typography color="textSecondary">
            Choose a blog post from the dropdown above to view and manage its comments.
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold bg-gray-50">Comment</TableCell>
                  <TableCell className="font-semibold bg-gray-50 hidden md:table-cell">Author</TableCell>
                  <TableCell className="font-semibold bg-gray-50 hidden sm:table-cell">Status</TableCell>
                  <TableCell className="font-semibold bg-gray-50 hidden lg:table-cell">Date</TableCell>
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
                ) : filteredComments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Typography color="textSecondary">
                        No comments found for this post
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComments.map((comment) => (
                    <TableRow key={comment.id} hover>
                      <TableCell>
                        <Typography
                          variant="body2"
                          className="line-clamp-3 max-w-md"
                        >
                          {comment.content}
                        </Typography>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <Box className="flex items-center gap-2">
                          <Avatar className="w-8 h-8 text-xs bg-orange-100 text-orange-600">
                            {comment.user.username?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" className="font-medium">
                              {comment.user.username}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {comment.user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        <Chip
                          label={comment.is_approved ? 'Approved' : 'Pending'}
                          size="small"
                          color={comment.is_approved ? 'success' : 'warning'}
                          variant="filled"
                        />
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        <Typography variant="body2" color="textSecondary">
                          {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box className="flex items-center justify-center gap-1">
                          <Tooltip title={comment.is_approved ? 'Unapprove' : 'Approve'}>
                            <IconButton
                              size="small"
                              onClick={() => toggleApproval(comment)}
                              className={
                                comment.is_approved
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-orange-600 hover:bg-orange-50'
                              }
                            >
                              {comment.is_approved ? (
                                <CheckCircle fontSize="small" />
                              ) : (
                                <Cancel fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(comment)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(comment.id)}
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
      )}

      {/* Edit Comment Drawer */}
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
              Edit Comment
            </Typography>
            <Box className="flex items-center gap-2">
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!editContent.trim() || loading}
                startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Update Comment
              </Button>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Form Content */}
          <Box className="flex-1 overflow-auto p-4">
            <Box className="max-w-2xl mx-auto space-y-4">
              {editComment && (
                <>
                  {/* Comment Info */}
                  <Paper className="p-4 bg-gray-50">
                    <Box className="flex items-center gap-2 mb-2">
                      <Person className="text-gray-500" />
                      <Typography variant="subtitle2" className="font-medium">
                        {editComment.user.username}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ({editComment.user.email})
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      Posted on {format(new Date(editComment.created_at), 'MMMM dd, yyyy at HH:mm')}
                    </Typography>
                  </Paper>

                  {/* Edit Form */}
                  <TextField
                    fullWidth
                    label="Comment Content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    multiline
                    rows={6}
                    variant="outlined"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={editApproved}
                        onChange={(e) => setEditApproved(e.target.checked)}
                        color="success"
                      />
                    }
                    label="Approve this comment"
                  />
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CommentsManagement;
