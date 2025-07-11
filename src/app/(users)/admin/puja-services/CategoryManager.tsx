import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  Close,
  Add,
  Edit,
  Delete,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { usePujaServiceStore, PujaCategory } from '../../../stores/pujaServiceStore';
import { formatDateTime } from './utils';

interface CategoryManagerProps {
  open: boolean;
  onClose: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ open, onClose }) => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  } = usePujaServiceStore();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<PujaCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<PujaCategory | null>(null);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open, fetchCategories]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    const success = await createCategory(newCategoryName.trim());
    if (success) {
      setNewCategoryName('');
      setAddDialogOpen(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    
    const success = await updateCategory(editingCategory.id, newCategoryName.trim());
    if (success) {
      setEditingCategory(null);
      setNewCategoryName('');
      setEditDialogOpen(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    
    const success = await deleteCategory(deletingCategory.id);
    if (success) {
      setDeletingCategory(null);
      setDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (category: PujaCategory) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (category: PujaCategory) => {
    setDeletingCategory(category);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            height: '80vh',
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
              Manage Categories
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddDialogOpen(true)}
                size="small"
              >
                Add Category
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

          {/* Categories List */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Categories ({categories.length})
            </Typography>
            
            {categories.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                bgcolor: 'grey.50',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'grey.300'
              }}>
                <CategoryIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No categories found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Create your first category to organize your puja services.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddDialogOpen(true)}
                >
                  Add First Category
                </Button>
              </Box>
            ) : (
              <List>
                {categories.map((category, index) => (
                  <React.Fragment key={category.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {category.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              ID: #{category.id} • Created: {formatDateTime(category.created_at)}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(category)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openDeleteDialog(category)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < categories.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Add Category Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddCategory();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddCategory} 
            variant="contained"
            disabled={loading || !newCategoryName.trim()}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleEditCategory();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditCategory} 
            variant="contained"
            disabled={loading || !newCategoryName.trim()}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category &quot;{deletingCategory?.name}&quot;?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone and may affect existing services using this category.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteCategory} 
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

export default CategoryManager;
