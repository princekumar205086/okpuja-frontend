'use client';

import React from 'react';
import {
  Box,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAstrologyServiceStore, AstrologyService, SERVICE_TYPE_OPTIONS } from '@/app/stores/astrologyServiceStore';
import { format } from 'date-fns';

const AstrologyServiceTable: React.FC = () => {
  const {
    services,
    loading,
    currentPage,
    pageSize,
    totalCount,
    setCurrentPage,
    setPageSize,
    openDrawer,
    deleteService,
    toggleServiceStatus,
  } = useAstrologyServiceStore();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedService, setSelectedService] = React.useState<AstrologyService | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, service: AstrologyService) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedService(null);
  };

  const handleView = (service: AstrologyService) => {
    openDrawer('view', service);
    handleMenuClose();
  };

  const handleEdit = (service: AstrologyService) => {
    openDrawer('edit', service);
    handleMenuClose();
  };

  const handleDelete = async (service: AstrologyService) => {
    if (window.confirm(`Are you sure you want to delete "${service.title}"?`)) {
      await deleteService(service.id);
    }
    handleMenuClose();
  };

  const handleToggleStatus = async (service: AstrologyService) => {
    await toggleServiceStatus(service.id);
    handleMenuClose();
  };

  const getServiceTypeLabel = (type: string) => {
    return SERVICE_TYPE_OPTIONS.find(option => option.value === type)?.label || type;
  };

  const columns: GridColDef[] = [
    {
      field: 'image_url',
      headerName: 'Image',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box className="flex items-center justify-center h-full">
          {params.value ? (
            <Avatar
              src={params.row.image_thumbnail_url || params.value}
              alt={params.row.title}
              className="w-10 h-10 rounded-lg"
              variant="rounded"
            >
              <ImageIcon />
            </Avatar>
          ) : (
            <Avatar className="w-10 h-10 rounded-lg bg-gray-100" variant="rounded">
              <ImageIcon className="text-gray-400" />
            </Avatar>
          )}
        </Box>
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" className="font-medium text-gray-900 truncate">
            {params.value}
          </Typography>
          <Typography variant="caption" className="text-gray-500 truncate">
            ID: {params.row.id}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'service_type',
      headerName: 'Type',
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={getServiceTypeLabel(params.value)}
          size="small"
          variant="outlined"
          className="bg-blue-50 border-blue-200 text-blue-700"
        />
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      type: 'number',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" className="font-medium text-green-600">
          ₹{parseFloat(params.value).toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'duration_minutes',
      headerName: 'Duration',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" className="text-gray-700">
          {params.value} min
        </Typography>
      ),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          size="small"
          color={params.value ? 'success' : 'error'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="caption" className="text-gray-600">
          {format(new Date(params.value), 'MMM dd, yyyy')}
        </Typography>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 80,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="menu"
          icon={
            <Tooltip title="More actions">
              <MoreVertIcon />
            </Tooltip>
          }
          label="More"
          onClick={(event) => handleMenuOpen(event, params.row)}
        />,
      ],
    },
  ];

  const rows = services.map((service) => ({
    ...service,
    id: service.id,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={0} className="border border-gray-200 overflow-hidden">
        <Box className="h-[600px] w-full">
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            paginationMode="server"
            rowCount={totalCount}
            pagination
            paginationModel={{ page: currentPage - 1, pageSize }}
            onPaginationModelChange={({ page, pageSize }) => {
              setCurrentPage(page + 1);
              setPageSize(pageSize);
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            disableRowSelectionOnClick
            disableColumnMenu
            className="border-0"
            sx={{
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f3f4f6',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f8fafc',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
              },
            }}
            onRowClick={(params) => handleView(params.row)}
          />
        </Box>
      </Paper>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          className: 'shadow-lg border border-gray-200',
        }}
      >
        <MenuItem onClick={() => selectedService && handleView(selectedService)}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedService && handleEdit(selectedService)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Service</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedService && handleToggleStatus(selectedService)}>
          <ListItemIcon>
            {selectedService?.is_active ? (
              <ToggleOffIcon fontSize="small" />
            ) : (
              <ToggleOnIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedService?.is_active ? 'Deactivate' : 'Activate'}
          </ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => selectedService && handleDelete(selectedService)}
          className="text-red-600"
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" className="text-red-600" />
          </ListItemIcon>
          <ListItemText>Delete Service</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default AstrologyServiceTable;
