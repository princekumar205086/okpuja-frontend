'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Drawer,
  Divider,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Avatar,
  Badge,
  Stack,
  Switch,
  FormControlLabel
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar, GridRowSelectionModel } from '@mui/x-data-grid';
import {
  Dashboard,
  CalendarToday,
  FilterList,
  Search,
  Refresh,
  Download,
  Upload,
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Cancel,
  Schedule,
  Payment,
  Person,
  Phone,
  Email,
  LocationOn,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  NotificationsActive,
  Assignment,
  Group,
  Analytics,
  Settings,
  MoreVert,
  Send,
  Print,
  Share,
  Star,
  Warning,
  Info,
  Error as ErrorIcon,
  Pending,
  EventBusy,
  AccessTime,
  MonetizationOn,
  PersonAdd,
  Business,
  Home,
  Spa,
  Psychology
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

// Import custom components
import AdminDashboardStats from './components/AdminDashboardStats';
import BookingCalendarView from './components/BookingCalendarView';
import AdvancedFilters from './components/AdvancedFilters';
import BookingDetailsModal from './components/BookingDetailsModal';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import StaffAssignmentModal from './components/StaffAssignmentModal';
import PaymentManagementModal from './components/PaymentManagementModal';
import CustomerCommunicationModal from './components/CustomerCommunicationModal';
import ReportsAndAnalytics from './components/ReportsAndAnalytics';

// Types
interface Booking {
  id: string;
  bookingId: string;
  serviceType: 'puja' | 'astrology';
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  scheduledDate: string;
  scheduledTime: string;
  assignedStaff?: string;
  location?: string;
  createdAt: string;
  lastUpdated: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  customerRating?: number;
}

interface FilterState {
  serviceType: string;
  status: string;
  paymentStatus: string;
  dateRange: [Date | null, Date | null];
  assignedStaff: string;
  location: string;
  priority: string;
  amountRange: [number, number];
}

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  pendingPayments: number;
  avgBookingValue: number;
  customerSatisfaction: number;
  staffUtilization: number;
  conversionRate: number;
  growthRate: number;
}

const AdminBookingsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [viewMode, setViewMode] = useState<'dashboard' | 'table' | 'calendar'>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    serviceType: '',
    status: '',
    paymentStatus: '',
    dateRange: [null, null],
    assignedStaff: '',
    location: '',
    priority: '',
    amountRange: [0, 100000]
  });
  
  // Modal and drawer state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [staffAssignmentOpen, setStaffAssignmentOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [communicationModalOpen, setCommunicationModalOpen] = useState(false);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  
  // Bulk actions state
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>('');
  
  // Helper function to get selection count
  const getSelectionCount = (selection: any): number => {
    if (Array.isArray(selection)) {
      return selection.length;
    }
    return 0;
  };
  
  // Helper function to clear selection
  const clearSelection = () => setSelectedRows([]);
  
  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    avgBookingValue: 0,
    customerSatisfaction: 0,
    staffUtilization: 0,
    conversionRate: 0,
    growthRate: 0
  });
  
  // Notification state
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: Date;
  }>>([]);

  // Data fetching
  useEffect(() => {
    fetchBookings();
    fetchDashboardStats();
    setupRealTimeUpdates();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [bookings, searchTerm, filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockBookings: Booking[] = [
        {
          id: '1',
          bookingId: 'BK-001',
          serviceType: 'puja',
          serviceName: 'Grah Shanti Puja',
          customerName: 'Rajesh Kumar',
          customerEmail: 'rajesh@example.com',
          customerPhone: '+91-9876543210',
          amount: 5000,
          status: 'confirmed',
          paymentStatus: 'paid',
          scheduledDate: '2025-08-10',
          scheduledTime: '10:00',
          assignedStaff: 'Pandit Sharma',
          location: 'Customer Home',
          createdAt: '2025-08-07T10:00:00Z',
          lastUpdated: '2025-08-07T11:00:00Z',
          priority: 'medium',
          customerRating: 4.5
        }
        // Add more mock data as needed
      ];
      
      setBookings(mockBookings);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // TODO: Replace with actual API call
      const mockStats: DashboardStats = {
        totalBookings: 1250,
        pendingBookings: 45,
        confirmedBookings: 120,
        completedBookings: 980,
        cancelledBookings: 105,
        totalRevenue: 2450000,
        pendingPayments: 125000,
        avgBookingValue: 3500,
        customerSatisfaction: 4.7,
        staffUtilization: 85,
        conversionRate: 78,
        growthRate: 12.5
      };
      
      setDashboardStats(mockStats);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };

  const setupRealTimeUpdates = () => {
    // TODO: Setup WebSocket connection for real-time updates
    const interval = setInterval(() => {
      // Simulate real-time updates
      fetchBookings();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.bookingId.toLowerCase().includes(searchLower) ||
        booking.customerName.toLowerCase().includes(searchLower) ||
        booking.customerEmail.toLowerCase().includes(searchLower) ||
        booking.serviceName.toLowerCase().includes(searchLower)
      );
    }

    // Apply individual filters
    if (filters.serviceType) {
      filtered = filtered.filter(booking => booking.serviceType === filters.serviceType);
    }
    if (filters.status) {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }
    if (filters.paymentStatus) {
      filtered = filtered.filter(booking => booking.paymentStatus === filters.paymentStatus);
    }
    if (filters.assignedStaff) {
      filtered = filtered.filter(booking => booking.assignedStaff === filters.assignedStaff);
    }
    if (filters.location) {
      filtered = filtered.filter(booking => booking.location?.includes(filters.location));
    }
    if (filters.priority) {
      filtered = filtered.filter(booking => booking.priority === filters.priority);
    }

    // Date range filter
    if (filters.dateRange[0] && filters.dateRange[1]) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.scheduledDate);
        return bookingDate >= filters.dateRange[0]! && bookingDate <= filters.dateRange[1]!;
      });
    }

    // Amount range filter
    filtered = filtered.filter(booking =>
      booking.amount >= filters.amountRange[0] && booking.amount <= filters.amountRange[1]
    );

    setFilteredBookings(filtered);
  };

  const handleBookingAction = async (action: string, bookingId: string) => {
    try {
      // TODO: Implement actual API calls
      switch (action) {
        case 'confirm':
          await updateBookingStatus(bookingId, 'confirmed');
          toast.success('Booking confirmed successfully');
          break;
        case 'cancel':
          await updateBookingStatus(bookingId, 'cancelled');
          toast.success('Booking cancelled successfully');
          break;
        case 'complete':
          await updateBookingStatus(bookingId, 'completed');
          toast.success('Booking marked as completed');
          break;
        default:
          break;
      }
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update booking');
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    // TODO: Implement actual API call
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleBulkAction = async () => {
    try {
      setLoading(true);
      // TODO: Implement bulk actions
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Bulk action "${bulkAction}" applied to ${getSelectionCount(selectedRows)} bookings`);
      setBulkActionDialogOpen(false);
      clearSelection();
      fetchBookings();
    } catch (err) {
      toast.error('Failed to apply bulk action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'grey.50', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          Booking Management System
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive booking management for all services
        </Typography>
      </Box>

      {/* View Mode Toggle */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant={viewMode === 'dashboard' ? 'contained' : 'outlined'}
              startIcon={<Dashboard />}
              onClick={() => setViewMode('dashboard')}
              size="small"
            >
              Dashboard
            </Button>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              startIcon={<FilterList />}
              onClick={() => setViewMode('table')}
              size="small"
            >
              Table View
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
              startIcon={<CalendarToday />}
              onClick={() => setViewMode('calendar')}
              size="small"
            >
              Calendar
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ minWidth: 250 }}
            />
            <IconButton onClick={() => setFiltersDrawerOpen(true)} color="primary">
              <FilterList />
            </IconButton>
            <IconButton onClick={fetchBookings} color="primary">
              <Refresh />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {/* TODO: Open new booking modal */}}
            >
              New Booking
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      {viewMode === 'dashboard' && (
        <AdminDashboardStats stats={dashboardStats} />
      )}

      {viewMode === 'table' && (
        <Box>
          {/* Bulk Actions Toolbar */}
          {getSelectionCount(selectedRows) > 0 && (
            <BulkActionsToolbar
              selectedCount={getSelectionCount(selectedRows)}
              onBulkAction={(action) => {
                setBulkAction(action);
                setBulkActionDialogOpen(true);
              }}
            />
          )}

          {/* Data Grid */}
          <Paper sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredBookings}
              columns={getColumns()}
              loading={loading}
              checkboxSelection
              disableRowSelectionOnClick
              rowSelectionModel={selectedRows as unknown as GridRowSelectionModel}
              onRowSelectionModelChange={(newSelection) => {
                setSelectedRows(Array.isArray(newSelection) ? newSelection : []);
              }}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 }
                }
              }}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid',
                  borderColor: 'grey.200'
                }
              }}
            />
          </Paper>
        </Box>
      )}

      {viewMode === 'calendar' && (
        <BookingCalendarView
          bookings={filteredBookings}
          onBookingClick={(booking) => {
            setSelectedBooking(booking);
            setDetailsModalOpen(true);
          }}
        />
      )}

      {/* Modals and Drawers */}
      <AdvancedFilters
        open={filtersDrawerOpen}
        onClose={() => setFiltersDrawerOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <BookingDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        booking={selectedBooking}
        onAction={handleBookingAction}
      />

      {/* Bulk Action Confirmation Dialog */}
      <Dialog open={bulkActionDialogOpen} onClose={() => setBulkActionDialogOpen(false)}>
        <DialogTitle>Confirm Bulk Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to apply "{bulkAction}" to {getSelectionCount(selectedRows)} selected bookings?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBulkAction} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );

  // DataGrid columns configuration
  function getColumns(): GridColDef[] {
    return [
      {
        field: 'bookingId',
        headerName: 'Booking ID',
        width: 120,
        renderCell: (params: GridRenderCellParams) => (
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
            {params.value}
          </Typography>
        )
      },
      {
        field: 'serviceType',
        headerName: 'Service',
        width: 100,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            icon={params.value === 'puja' ? <Spa /> : <Psychology />}
            label={params.value === 'puja' ? 'Puja' : 'Astrology'}
            size="small"
            color={params.value === 'puja' ? 'primary' : 'secondary'}
          />
        )
      },
      {
        field: 'serviceName',
        headerName: 'Service Name',
        flex: 1,
        minWidth: 200
      },
      {
        field: 'customerName',
        headerName: 'Customer',
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
              {params.row.customerName.charAt(0)}
            </Avatar>
            <Typography variant="body2">{params.value}</Typography>
          </Box>
        )
      },
      {
        field: 'amount',
        headerName: 'Amount',
        width: 120,
        renderCell: (params: GridRenderCellParams) => (
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            ₹{params.value.toLocaleString()}
          </Typography>
        )
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        renderCell: (params: GridRenderCellParams) => {
          const statusColors = {
            pending: 'warning',
            confirmed: 'info',
            in_progress: 'primary',
            completed: 'success',
            cancelled: 'error',
            refunded: 'default'
          };
          return (
            <Chip
              label={params.value.replace('_', ' ')}
              size="small"
              color={statusColors[params.value as keyof typeof statusColors] as any}
            />
          );
        }
      },
      {
        field: 'paymentStatus',
        headerName: 'Payment',
        width: 120,
        renderCell: (params: GridRenderCellParams) => {
          const paymentColors = {
            pending: 'warning',
            paid: 'success',
            failed: 'error',
            refunded: 'default'
          };
          return (
            <Chip
              label={params.value}
              size="small"
              color={paymentColors[params.value as keyof typeof paymentColors] as any}
            />
          );
        }
      },
      {
        field: 'scheduledDate',
        headerName: 'Scheduled',
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
          <Box>
            <Typography variant="body2">
              {new Date(params.value).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.scheduledTime}
            </Typography>
          </Box>
        )
      },
      {
        field: 'priority',
        headerName: 'Priority',
        width: 100,
        renderCell: (params: GridRenderCellParams) => {
          const priorityColors = {
            low: 'success',
            medium: 'warning',
            high: 'error',
            urgent: 'error'
          };
          return (
            <Chip
              label={params.value}
              size="small"
              color={priorityColors[params.value as keyof typeof priorityColors] as any}
              variant={params.value === 'urgent' ? 'filled' : 'outlined'}
            />
          );
        }
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 200,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedBooking(params.row);
                  setDetailsModalOpen(true);
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small">
                <Edit />
              </IconButton>
            </Tooltip>
            {params.row.status === 'pending' && (
              <Tooltip title="Confirm">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => handleBookingAction('confirm', params.row.id)}
                >
                  <CheckCircle />
                </IconButton>
              </Tooltip>
            )}
            {['pending', 'confirmed'].includes(params.row.status) && (
              <Tooltip title="Cancel">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleBookingAction('cancel', params.row.id)}
                >
                  <Cancel />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="More Options">
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    ];
  }
};

export default AdminBookingsPage;