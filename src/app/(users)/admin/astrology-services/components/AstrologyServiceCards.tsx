'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  Stack,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  Grid,
  CardActions,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  AccessTime as TimeIcon,
  CurrencyRupee as CurrencyIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAstrologyServiceStore, AstrologyService, SERVICE_TYPE_OPTIONS } from '@/app/stores/astrologyServiceStore';
import { format } from 'date-fns';

const AstrologyServiceCards: React.FC = () => {
  const {
    services,
    loading,
    currentPage,
    pageSize,
    totalPages,
    setCurrentPage,
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  if (loading && services.length === 0) {
    return (
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <Box className="h-48 bg-gray-200" />
            <CardContent>
              <Box className="h-4 bg-gray-200 rounded mb-2" />
              <Box className="h-3 bg-gray-200 rounded mb-4" />
              <Box className="flex gap-2">
                <Box className="h-6 w-16 bg-gray-200 rounded" />
                <Box className="h-6 w-20 bg-gray-200 rounded" />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="space-y-6">
        {/* Cards Grid */}
        <Grid container spacing={3}>
          {services.map((service, index) => (
            <div
              key={service.id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 flex"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full w-full flex"
              >
                <Card
                  className="h-full w-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200"
                  onClick={() => handleView(service)}
                >
                  {/* Image */}
                  <Box className="relative">
                    {service.image_card_url || service.image_url ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={service.image_card_url || service.image_url}
                        alt={service.title}
                        className="h-48 object-cover"
                      />
                    ) : (
                      <Box className="h-48 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                        <Avatar className="w-16 h-16 bg-purple-200">
                          <ImageIcon className="text-purple-600" fontSize="large" />
                        </Avatar>
                      </Box>
                    )}

                    {/* Status Badge */}
                    <Chip
                      label={service.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={service.is_active ? 'success' : 'error'}
                      className="absolute top-2 left-2 shadow-sm"
                    />

                    {/* Menu Button */}
                    <Tooltip title="More actions">
                      <IconButton
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white shadow-sm"
                        size="small"
                        onClick={(e) => handleMenuOpen(e, service)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Content */}
                  <CardContent className="flex-1 p-4">
                    <Stack spacing={2}>
                      {/* Title and Type */}
                      <Box>
                        <Typography
                          variant="h6"
                          className="font-semibold text-gray-900 mb-1 line-clamp-2"
                          title={service.title}
                        >
                          {service.title}
                        </Typography>
                        <Chip
                          label={getServiceTypeLabel(service.service_type)}
                          size="small"
                          variant="outlined"
                          className="bg-blue-50 border-blue-200 text-blue-700"
                        />
                      </Box>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        className="text-gray-600 line-clamp-3"
                        title={service.description}
                      >
                        {service.description}
                      </Typography>

                      {/* Price and Duration */}
                      <div className="flex justify-between items-center">
                        <Box className="flex items-center gap-1">
                          <CurrencyIcon className="text-green-600" fontSize="small" />
                          <Typography variant="body2" className="font-semibold text-green-600">
                            ₹{parseFloat(service.price).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box className="flex items-center gap-1">
                          <TimeIcon className="text-gray-500" fontSize="small" />
                          <Typography variant="body2" className="text-gray-600">
                            {service.duration_minutes}m
                          </Typography>
                        </Box>
                      </div>

                      {/* Created Date */}
                      <Typography variant="caption" className="text-gray-500">
                        Created: {format(new Date(service.created_at), 'MMM dd, yyyy')}
                      </Typography>
                    </Stack>
                  </CardContent>

                  {/* Actions */}
                  <CardActions className="px-4 pb-4 pt-0">
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(service);
                      }}
                      className="text-purple-600 hover:bg-purple-50"
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(service);
                      }}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </div>
          ))}
        </Grid>

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box className="text-center py-16">
              <Avatar className="w-20 h-20 mx-auto mb-4 bg-gray-100">
                <ImageIcon className="text-gray-400" fontSize="large" />
              </Avatar>
              <Typography variant="h6" className="text-gray-600 mb-2">
                No services found
              </Typography>
              <Typography variant="body2" className="text-gray-500 mb-4">
                Try adjusting your search or filter criteria
              </Typography>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => openDrawer('create')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Create First Service
              </Button>
            </Box>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box className="flex justify-center mt-8">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-2"
            />
          </Box>
        )}
      </Box>

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

export default AstrologyServiceCards;
