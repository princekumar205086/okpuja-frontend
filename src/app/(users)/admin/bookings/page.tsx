'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Badge,
  Stack,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import {
  Dashboard,
  Psychology,
  Groups,
  Spa,
  Refresh,
  FilterList,
  CalendarToday,
  Download,
  Visibility,
  Edit,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

// Import store
import { useAdminBookingStore } from '../../../stores/adminBookingStore';

// Import custom components
import AdminDashboardStats from './components/AdminDashboardStats';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `booking-tab-${index}`,
    'aria-controls': `booking-tabpanel-${index}`,
  };
}

const AdminBookingsPage: React.FC = () => {
  // Zustand store
  const {
    // Data
    astrologyBookings,
    regularBookings,
    pujaBookings,
    astrologyDashboard,
    regularDashboard,
    pujaDashboard,
    
    // UI states
    loading,
    error,
    
    // Actions
    fetchAstrologyBookings,
    fetchRegularBookings,
    fetchPujaBookings,
    fetchAllBookings,
    fetchAstrologyDashboard,
    fetchRegularDashboard,
    fetchPujaDashboard,
    clearError,
  } = useAdminBookingStore();

  // Local state
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Load initial data
    handleRefreshData();
    
    // Load dashboards
    fetchAstrologyDashboard();
    fetchRegularDashboard();
    fetchPujaDashboard();
  }, [fetchAstrologyDashboard, fetchRegularDashboard, fetchPujaDashboard]);

  useEffect(() => {
    // Clear error after 5 seconds
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefreshData = async () => {
    try {
      if (tabValue === 0) {
        await fetchAllBookings();
      } else if (tabValue === 1) {
        await fetchAstrologyBookings();
      } else if (tabValue === 2) {
        await fetchRegularBookings();
      } else if (tabValue === 3) {
        await fetchPujaBookings();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Column definitions for different booking types
  const getAstrologyColumns = (): GridColDef[] => [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight="bold">
          #{params.value}
        </Typography>
      ),
    },
    {
      field: 'astro_book_id',
      headerName: 'Booking ID',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value || 'N/A'} 
          size="small" 
          variant="outlined" 
          color="primary"
        />
      ),
    },
    {
      field: 'customer_name',
      headerName: 'Customer',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row;
        return (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {row.customer_name || row.user?.username || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.contact_email || row.user?.email || 'No email'}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'service',
      headerName: 'Service',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const service = params.row.service;
        return (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {service?.title || 'Unknown Service'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ₹{service?.price || '0'}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value;
        const getStatusColor = (status: string) => {
          switch (status?.toUpperCase()) {
            case 'PENDING': return 'warning';
            case 'CONFIRMED': return 'info';
            case 'COMPLETED': return 'success';
            case 'CANCELLED': return 'error';
            case 'REJECTED': return 'error';
            default: return 'default';
          }
        };
        
        return (
          <Chip
            label={status || 'Unknown'}
            size="small"
            color={getStatusColor(status) as any}
            variant="filled"
          />
        );
      },
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const date = params.value ? new Date(params.value).toLocaleDateString() : 'N/A';
        return <Typography variant="body2">{date}</Typography>;
      },
    },
  ];

  const getRegularColumns = (): GridColDef[] => [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight="bold">
          #{params.value}
        </Typography>
      ),
    },
    {
      field: 'book_id',
      headerName: 'Booking ID',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value || 'N/A'} 
          size="small" 
          variant="outlined" 
          color="primary"
        />
      ),
    },
    {
      field: 'user_name',
      headerName: 'Customer',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row;
        return (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {row.user_name || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.user_email || 'No email'}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'total_amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight="medium">
          ₹{params.value || 0}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value;
        const getStatusColor = (status: string) => {
          switch (status?.toUpperCase()) {
            case 'PENDING': return 'warning';
            case 'CONFIRMED': return 'info';
            case 'COMPLETED': return 'success';
            case 'CANCELLED': return 'error';
            case 'FAILED': return 'error';
            case 'REJECTED': return 'error';
            default: return 'default';
          }
        };
        
        return (
          <Chip
            label={params.row.status_display || status || 'Unknown'}
            size="small"
            color={getStatusColor(status) as any}
            variant="filled"
          />
        );
      },
    },
  ];

  const getPujaColumns = (): GridColDef[] => [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight="bold">
          #{params.value}
        </Typography>
      ),
    },
    {
      field: 'service_title',
      headerName: 'Service',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row;
        return (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {row.service_title || 'Unknown Service'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.category_name || 'N/A'}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'contact_name',
      headerName: 'Customer',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row;
        return (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {row.contact_name || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.contact_email || 'No email'}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value;
        const getStatusColor = (status: string) => {
          switch (status?.toUpperCase()) {
            case 'PENDING': return 'warning';
            case 'CONFIRMED': return 'info';
            case 'COMPLETED': return 'success';
            case 'CANCELLED': return 'error';
            case 'FAILED': return 'error';
            default: return 'default';
          }
        };
        
        return (
          <Chip
            label={params.row.status_display || status || 'Unknown'}
            size="small"
            color={getStatusColor(status) as any}
            variant="filled"
          />
        );
      },
    },
  ];

  // Get current data based on tab
  const getCurrentData = () => {
    switch (tabValue) {
      case 1: // Astrology
        return astrologyBookings?.map(booking => ({ ...booking, id: booking.id.toString() })) || [];
      case 2: // Regular
        return regularBookings?.map(booking => ({ ...booking, id: booking.id.toString() })) || [];
      case 3: // Puja
        return pujaBookings?.map(booking => ({ ...booking, id: booking.id.toString() })) || [];
      default: // All
        const allBookings = [
          ...(astrologyBookings?.map(b => ({ ...b, id: `astro-${b.id}`, type: 'astrology' })) || []),
          ...(regularBookings?.map(b => ({ ...b, id: `regular-${b.id}`, type: 'regular' })) || []),
          ...(pujaBookings?.map(b => ({ ...b, id: `puja-${b.id}`, type: 'puja' })) || []),
        ];
        return allBookings;
    }
  };

  const getCurrentColumns = () => {
    switch (tabValue) {
      case 1: // Astrology
        return getAstrologyColumns();
      case 2: // Regular
        return getRegularColumns();
      case 3: // Puja
        return getPujaColumns();
      default: // All - simplified columns
        return [
          { field: 'id', headerName: 'ID', width: 120 },
          { field: 'type', headerName: 'Type', width: 100 },
          { field: 'status', headerName: 'Status', width: 120 },
          { field: 'created_at', headerName: 'Created', width: 130 },
        ];
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Booking Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage all your bookings, track performance, and handle customer requests
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Action Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefreshData}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalendarToday />}
            >
              Calendar
            </Button>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Download />}
            >
              Export
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Dashboard Stats */}
      <AdminDashboardStats 
        astrologyData={astrologyDashboard}
        regularData={regularDashboard}
        pujaData={pujaDashboard}
        loading={loading}
      />

      {/* Main Content */}
      <Paper sx={{ flexGrow: 1, mt: 3 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="booking tabs"
            sx={{ px: 2 }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Dashboard />
                  All Bookings
                </Box>
              } 
              {...a11yProps(0)} 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology />
                  Astrology
                  <Badge badgeContent={astrologyBookings?.length || 0} color="primary" />
                </Box>
              } 
              {...a11yProps(1)} 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Groups />
                  Regular Services
                  <Badge badgeContent={regularBookings?.length || 0} color="primary" />
                </Box>
              } 
              {...a11yProps(2)} 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Spa />
                  Puja Services
                  <Badge badgeContent={pujaBookings?.length || 0} color="primary" />
                </Box>
              } 
              {...a11yProps(3)} 
            />
          </Tabs>
        </Box>

        {/* Data Grid */}
        <TabPanel value={tabValue} index={tabValue}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 400 
            }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={getCurrentData()}
              columns={getCurrentColumns()}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                height: 600,
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 25 },
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
            />
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AdminBookingsPage;
