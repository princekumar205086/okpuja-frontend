import React from 'react';
import {
  Box,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { usePujaServiceStore } from '../../../stores/pujaServiceStore';

interface ServicePaginationProps {
  onPageChange: (page: number) => void;
}

const ServicePagination: React.FC<ServicePaginationProps> = ({ onPageChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    setPageSize,
    services,
  } = usePujaServiceStore();

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    // Reset to first page when changing page size
    onPageChange(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  // Calculate range of items being displayed
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  if (totalCount === 0) {
    return null;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 2,
      mt: 3,
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 1,
    }}>
      {/* Results Info */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: 2,
        order: { xs: 2, sm: 1 }
      }}>
        <Typography variant="body2" color="text.secondary">
          Showing {startItem}-{endItem} of {totalCount} services
        </Typography>
        
        {/* Page Size Selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            Items per page:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 70 }}>
            <Select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              displayEmpty
              sx={{ 
                '& .MuiSelect-select': { 
                  py: 0.5,
                  fontSize: '0.875rem'
                }
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Pagination */}
      <Box sx={{ order: { xs: 1, sm: 2 } }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
          size={isMobile ? 'small' : 'medium'}
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={isMobile ? 1 : 2}
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 'medium',
            },
            '& .Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ServicePagination;
