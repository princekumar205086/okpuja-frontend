'use client';

import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Eye, Download, X, Video, Calendar, Clock, IndianRupee } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface BookingDataTableProps {
  bookings: any[];
  type: 'puja' | 'astrology';
  onViewDetails: (booking: any) => void;
  onCancel: (booking: any) => void;
  loading: boolean;
}

const canCancelBooking = (selectedDate: string, selectedTime: string): boolean => {
  if (!selectedDate || !selectedTime) return false;
  const bookingDateTime = new Date(`${selectedDate}T${selectedTime}`);
  const now = new Date();
  const timeDiff = bookingDateTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  return hoursDiff >= 24;
};

const formatDateTime = (date: string, time: string) => {
  if (!date || !time) return 'TBD';
  try {
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = time.includes(':') 
      ? new Date(`2000-01-01T${time.split(':').slice(0, 2).join(':')}`).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      : time;
    return `${formattedDate} at ${formattedTime}`;
  } catch (error) {
    return `${date} at ${time}`;
  }
};

const BookingDataTable: React.FC<BookingDataTableProps> = ({
  bookings,
  type,
  onViewDetails,
  onCancel,
  loading
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getColumns = (): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      {
        field: 'id',
        headerName: 'Booking ID',
        width: 140,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'text.secondary' }}>
            {type === 'puja' ? params.row.book_id : params.row.astro_book_id || params.row.book_id}
          </Box>
        ),
      },
      {
        field: 'service',
        headerName: 'Service',
        flex: 1,
        minWidth: 200,
        renderCell: (params: GridRenderCellParams) => {
          const title = type === 'puja' 
            ? params.row.cart?.puja_service?.title 
            : params.row.service?.title;
          
          return (
            <Box>
              <Box sx={{ fontWeight: 600, fontSize: '0.875rem', mb: 0.5 }}>
                {title || 'Service'}
              </Box>
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                {type === 'puja' 
                  ? params.row.cart?.puja_service?.category_detail?.name || 'N/A'
                  : params.row.service?.service_type || 'N/A'
                }
              </Box>
            </Box>
          );
        },
      },
      {
        field: 'datetime',
        headerName: 'Date & Time',
        width: 180,
        renderCell: (params: GridRenderCellParams) => {
          const date = type === 'puja' ? params.row.selected_date : params.row.preferred_date;
          const time = type === 'puja' ? params.row.selected_time : params.row.preferred_time;
          
          return (
            <Box sx={{ fontSize: '0.75rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <Calendar className="w-3 h-3 text-blue-600" />
                {date ? new Date(date).toLocaleDateString('en-IN') : 'TBD'}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Clock className="w-3 h-3 text-orange-600" />
                {time || 'TBD'}
              </Box>
            </Box>
          );
        },
      },
      {
        field: 'amount',
        headerName: 'Amount',
        width: 100,
        renderCell: (params: GridRenderCellParams) => {
          const amount = type === 'puja' 
            ? params.row.total_amount 
            : params.row.service?.price || params.row.total_amount;
          
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="text-sm">{amount}</span>
            </Box>
          );
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params: GridRenderCellParams) => (
          <StatusBadge status={params.row.status} size="sm" />
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 180,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams) => {
          const date = type === 'puja' ? params.row.selected_date : params.row.preferred_date;
          const time = type === 'puja' ? params.row.selected_time : params.row.preferred_time;
          const canCancel = canCancelBooking(date, time);
          
          return (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() => onViewDetails(params.row)}
                  sx={{ color: 'primary.main' }}
                >
                  <Eye className="w-4 h-4" />
                </IconButton>
              </Tooltip>
              
              {params.row.google_meet_link && type === 'astrology' && (
                <Tooltip title="Join Meeting">
                  <IconButton
                    size="small"
                    onClick={() => window.open(params.row.google_meet_link, '_blank')}
                    sx={{ color: 'success.main' }}
                  >
                    <Video className="w-4 h-4" />
                  </IconButton>
                </Tooltip>
              )}
              
              <Tooltip title="Download Invoice">
                <IconButton
                  size="small"
                  onClick={() => {
                    const bookingId = type === 'puja' ? params.row.book_id : params.row.astro_book_id;
                    if (bookingId) {
                      window.open(`/confirmbooking?book_id=${bookingId}/`, '_blank');
                    }
                  }}
                  sx={{ color: 'text.secondary' }}
                >
                  <Download className="w-4 h-4" />
                </IconButton>
              </Tooltip>
              
              {params.row.status?.toLowerCase() === 'confirmed' && (
                <Tooltip title={canCancel ? 'Cancel Booking' : 'Cannot cancel (less than 24 hours)'}>
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => onCancel(params.row)}
                      disabled={!canCancel}
                      sx={{ 
                        color: canCancel ? 'error.main' : 'text.disabled',
                        '&.Mui-disabled': {
                          color: 'text.disabled'
                        }
                      }}
                    >
                      <X className="w-4 h-4" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </Box>
          );
        },
      },
    ];

    // For mobile, show fewer columns
    if (isMobile) {
      return baseColumns.filter(col => 
        ['service', 'datetime', 'status', 'actions'].includes(col.field)
      );
    }

    return baseColumns;
  };

  const rows = bookings.map((booking, index) => ({
    id: booking.id || booking.book_id || booking.astro_book_id || index,
    ...booking,
  }));

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={getColumns()}
        loading={loading}
        pagination
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-main': {
            backgroundColor: 'white',
            borderRadius: 2,
            overflow: 'hidden',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'grey.50',
            borderBottom: '1px solid',
            borderColor: 'divider',
            fontSize: '0.875rem',
            fontWeight: 600,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid',
            borderColor: 'grey.100',
            fontSize: '0.875rem',
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: 'grey.50',
            },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'grey.50',
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: 2,
            backgroundColor: 'white',
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
        }}
        disableRowSelectionOnClick
        autoHeight={false}
      />
    </Box>
  );
};

export default BookingDataTable;
