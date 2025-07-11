import React, { useMemo } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridActionsCellItem,
  GridRowParams,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  Edit,
  Delete,
  Visibility,
  MoreVert,
  Schedule,
  Category,
  LocationOn,
  Image as ImageIcon,
} from '@mui/icons-material';
import { usePujaServiceStore, PujaService } from '../../../stores/pujaServiceStore';
import { 
  formatDuration, 
  formatDateTime, 
  getImageUrl, 
  serviceTypeOptions, 
  truncateText 
} from './utils';

interface ServiceTableViewProps {
  services: PujaService[];
  onView: (service: PujaService) => void;
  onEdit: (service: PujaService) => void;
  onDelete: (service: PujaService) => void;
}

const ServiceTableView: React.FC<ServiceTableViewProps> = ({
  services,
  onView,
  onEdit,
  onDelete,
}) => {
  const { loading, currentPage, pageSize, totalCount, setCurrentPage, setPageSize } = usePujaServiceStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedService, setSelectedService] = React.useState<PujaService | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, service: PujaService) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedService(null);
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'delete') => {
    if (!selectedService) return;
    
    switch (action) {
      case 'view':
        onView(selectedService);
        break;
      case 'edit':
        onEdit(selectedService);
        break;
      case 'delete':
        onDelete(selectedService);
        break;
    }
    handleMenuClose();
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight="medium">
          #{params.value}
        </Typography>
      ),
    },
    {
      field: 'image_url',
      headerName: 'Image',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar
          src={getImageUrl(params.value)}
          sx={{ width: 40, height: 40 }}
          variant="rounded"
        >
          <ImageIcon />
        </Avatar>
      ),
    },
    {
      field: 'title',
      headerName: 'Service Title',
      minWidth: 200,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography 
            variant="body2" 
            fontWeight="medium"
            sx={{ 
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' }
            }}
            onClick={() => onView(params.row)}
          >
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {truncateText(params.row.description, 60)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'category_detail',
      headerName: 'Category',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          icon={<Category fontSize="small" />}
          label={params.value?.name || 'No Category'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const typeLabel = serviceTypeOptions.find(
          option => option.value === params.value
        )?.label || params.value;
        
        return (
          <Chip
            icon={<LocationOn fontSize="small" />}
            label={typeLabel}
            size="small"
            variant="outlined"
            color="primary"
          />
        );
      },
    },
    {
      field: 'duration_minutes',
      headerName: 'Duration',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          icon={<Schedule fontSize="small" />}
          label={formatDuration(params.value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" color="text.secondary">
          {formatDateTime(params.value)}
        </Typography>
      ),
    },
    {
      field: 'updated_at',
      headerName: 'Updated',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" color="text.secondary">
          {formatDateTime(params.value)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onView(params.row);
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(params.row);
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Actions">
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, params.row)}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], [onView, onEdit]);

  const handleRowClick = (params: GridRowParams) => {
    onView(params.row as PujaService);
  };

  const handlePaginationModelChange = (model: { page: number; pageSize: number }) => {
    setCurrentPage(model.page + 1); // DataGrid is 0-indexed, our API is 1-indexed
    setPageSize(model.pageSize);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 300px)', minHeight: 400, width: '100%' }}>
      <DataGrid
        rows={services}
        columns={columns}
        loading={loading}
        pagination
        paginationMode="server"
        rowCount={totalCount || 0}
        paginationModel={{
          page: currentPage - 1, // DataGrid is 0-indexed
          pageSize: pageSize,
        }}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        onRowClick={handleRowClick}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'grey.50',
            borderBottom: '2px solid',
            borderColor: 'divider',
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              created_at: false, // Hide created_at by default on smaller screens
            },
          },
        }}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Service</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Service</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ServiceTableView;
