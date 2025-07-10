"use client";
import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  IconButton, 
  Chip, 
  Avatar, 
  Drawer, 
  Typography,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  MenuItem,
  Divider,
  TextField
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Edit, 
  Download, 
  Trash2, 
  Grid3x3, 
  List,
  MoreVertical,
  Search,
  X,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import BookingCard from '../cards/BookingCard';

interface Booking {
  id: string;
  user: string;
  service: string;
  priest: string;
  date: string;
  amount: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  serviceType: 'puja' | 'astrology';
  avatar?: string;
}

const ResponsiveBookingsTable: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info'}>({
    open: false,
    message: '',
    severity: 'info'
  });

  const recentBookings: Booking[] = [
    {
      id: 'PB001',
      user: 'Rajesh Kumar',
      service: 'Ganesh Puja',
      priest: 'Pandit Sharma',
      date: '2024-12-07',
      amount: '₹5,000',
      status: 'Confirmed',
      serviceType: 'puja',
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 'AB002',
      user: 'Priya Singh',
      service: 'Birth Chart Reading',
      priest: 'Jyotish Acharya',
      date: '2024-12-08',
      amount: '₹2,000',
      status: 'Pending',
      serviceType: 'astrology',
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 'PB003',
      user: 'Amit Patel',
      service: 'Satyanarayan Puja',
      priest: 'Pandit Kumar',
      date: '2024-12-10',
      amount: '₹8,000',
      status: 'Completed',
      serviceType: 'puja',
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 'AB004',
      user: 'Sunita Devi',
      service: 'Kundali Matching',
      priest: 'Pandit Verma',
      date: '2024-12-12',
      amount: '₹3,500',
      status: 'Pending',
      serviceType: 'astrology',
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 'PB005',
      user: 'Vikash Singh',
      service: 'Lakshmi Puja',
      priest: 'Pandit Gupta',
      date: '2024-12-15',
      amount: '₹6,000',
      status: 'Confirmed',
      serviceType: 'puja',
      avatar: '/api/placeholder/40/40',
    },
  ];

  // Filter bookings based on search and filters
  const filteredBookings = recentBookings.filter(booking => {
    const matchesSearch = searchQuery === '' || 
      booking.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.priest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    const matchesService = serviceFilter === 'All' || booking.serviceType === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'info';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      case 'Completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleAction = (action: string, booking: Booking) => {
    setSelectedBooking(booking);
    
    switch (action) {
      case 'view':
        setDrawerOpen(true);
        break;
      case 'edit':
        setSnackbar({
          open: true,
          message: `Editing booking ${booking.id}`,
          severity: 'info'
        });
        break;
      case 'download':
        setSnackbar({
          open: true,
          message: `Downloading invoice for ${booking.id}`,
          severity: 'success'
        });
        break;
      case 'delete':
        setSnackbar({
          open: true,
          message: `Booking ${booking.id} deleted`,
          severity: 'error'
        });
        break;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'user',
      headerName: 'User',
      width: 180,
      renderCell: (params) => (
        <div className="flex items-center space-x-3">
          <Avatar src={params.row.avatar} sx={{ width: 32, height: 32 }}>
            {params.value.charAt(0)}
          </Avatar>
          <span className="font-medium">{params.value}</span>
        </div>
      ),
    },
    {
      field: 'service',
      headerName: 'Service',
      width: 200,
      renderCell: (params) => (
        <div>
          <div className="font-medium">{params.value}</div>
          <div className="text-xs text-gray-500">by {params.row.priest}</div>
        </div>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 100,
      renderCell: (params) => (
        <span className="font-semibold text-green-600">{params.value}</span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div className="flex space-x-1">
          <IconButton
            size="small"
            onClick={() => handleAction('view', params.row)}
            sx={{ color: 'primary.main' }}
          >
            <Eye size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleAction('edit', params.row)}
            sx={{ color: 'warning.main' }}
          >
            <Edit size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleAction('download', params.row)}
            sx={{ color: 'success.main' }}
          >
            <Download size={16} />
          </IconButton>
        </div>
      ),
    },
  ];

  const statusOptions = ['All', 'Confirmed', 'Pending', 'Cancelled', 'Completed'];
  const serviceOptions = ['All', 'puja', 'astrology'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
                <p className="text-sm text-gray-600 mt-1">Latest service bookings and their status</p>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* View Toggle */}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(_, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                >
                  <ToggleButton value="grid" className="p-2">
                    <Grid3x3 size={16} />
                  </ToggleButton>
                  <ToggleButton value="table" className="p-2">
                    <List size={16} />
                  </ToggleButton>
                </ToggleButtonGroup>
                
                {/* Filter Button */}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SlidersHorizontal size={16} />}
                  onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                >
                  Filter
                </Button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search bookings by name, service, priest, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Active Filters Display */}
            {(statusFilter !== 'All' || serviceFilter !== 'All' || searchQuery) && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Chip
                    label={`Search: ${searchQuery}`}
                    onDelete={() => setSearchQuery('')}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {statusFilter !== 'All' && (
                  <Chip
                    label={`Status: ${statusFilter}`}
                    onDelete={() => setStatusFilter('All')}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                )}
                {serviceFilter !== 'All' && (
                  <Chip
                    label={`Service: ${serviceFilter}`}
                    onDelete={() => setServiceFilter('All')}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {viewMode === 'table' && !isMobile ? (
            /* Desktop Table View */
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={filteredBookings}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
              />
            </div>
          ) : (
            /* Mobile Card View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <BookingCard
                    booking={booking}
                    onAction={handleAction}
                    index={index}
                  />
                </motion.div>
              ))}
            </div>
          )}
          
          {/* No Results */}
          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        PaperProps={{
          sx: { minWidth: 200, p: 1 }
        }}
      >
        <div className="p-2">
          <Typography variant="subtitle2" className="font-medium mb-2">Status</Typography>
          {statusOptions.map((status) => (
            <MenuItem
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setFilterMenuAnchor(null);
              }}
              selected={statusFilter === status}
              sx={{ fontSize: '0.875rem' }}
            >
              {status}
            </MenuItem>
          ))}
          
          <Divider sx={{ my: 1 }} />
          
          <Typography variant="subtitle2" className="font-medium mb-2">Service Type</Typography>
          {serviceOptions.map((service) => (
            <MenuItem
              key={service}
              onClick={() => {
                setServiceFilter(service);
                setFilterMenuAnchor(null);
              }}
              selected={serviceFilter === service}
              sx={{ fontSize: '0.875rem' }}
            >
              {service === 'All' ? 'All Services' : service.charAt(0).toUpperCase() + service.slice(1)}
            </MenuItem>
          ))}
        </div>
      </Menu>

      {/* Bottom Drawer for Mobile Booking Details */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '80vh',
          },
        }}
      >
        {selectedBooking && (
          <div className="p-6">
            {/* Drawer Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Header with Close Button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
                <p className="text-sm text-gray-600">ID: {selectedBooking.id}</p>
              </div>
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{ color: 'text.secondary' }}
              >
                <X size={20} />
              </IconButton>
            </div>
            
            {/* Booking Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar src={selectedBooking.avatar} sx={{ width: 48, height: 48 }}>
                  {selectedBooking.user.charAt(0)}
                </Avatar>
                <div>
                  <h4 className="font-medium text-gray-900">{selectedBooking.user}</h4>
                  <p className="text-sm text-gray-600">{selectedBooking.service}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Priest</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedBooking.priest}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedBooking.date}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</label>
                  <p className="mt-1 text-lg font-semibold text-green-600">{selectedBooking.amount}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                  <div className="mt-1">
                    <Chip
                      label={selectedBooking.status}
                      color={getStatusColor(selectedBooking.status) as any}
                      size="small"
                    />
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="contained"
                  startIcon={<Edit size={16} />}
                  onClick={() => handleAction('edit', selectedBooking)}
                  sx={{ flex: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download size={16} />}
                  onClick={() => handleAction('download', selectedBooking)}
                  sx={{ flex: 1 }}
                >
                  Invoice
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Snackbar for Actions */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default ResponsiveBookingsTable;
