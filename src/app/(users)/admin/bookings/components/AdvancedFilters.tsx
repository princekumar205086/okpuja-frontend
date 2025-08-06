'use client';

import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Divider,
  Slider,
  IconButton,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import {
  Close,
  FilterList,
  Clear,
  ExpandMore,
  CalendarToday,
  Person,
  Payment,
  LocationOn,
  Star,
  Business
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';

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

interface AdvancedFiltersProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  open,
  onClose,
  filters,
  onFiltersChange
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [expanded, setExpanded] = useState<string[]>(['basic']);

  // Mock data for filter options
  const serviceTypes = [
    { value: 'puja', label: 'Puja Services' },
    { value: 'astrology', label: 'Astrology Services' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'confirmed', label: 'Confirmed', color: 'info' },
    { value: 'in_progress', label: 'In Progress', color: 'primary' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'error' },
    { value: 'refunded', label: 'Refunded', color: 'default' }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'paid', label: 'Paid', color: 'success' },
    { value: 'failed', label: 'Failed', color: 'error' },
    { value: 'refunded', label: 'Refunded', color: 'default' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' },
    { value: 'urgent', label: 'Urgent', color: 'error' }
  ];

  const staffMembers = [
    'Pandit Sharma',
    'Pandit Kumar',
    'Dr. Astrologer Gupta',
    'Pandit Singh',
    'Dr. Joshi'
  ];

  const locations = [
    'Customer Home',
    'Temple',
    'Office',
    'Online',
    'Community Hall'
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      serviceType: '',
      status: '',
      paymentStatus: '',
      dateRange: [null, null],
      assignedStaff: '',
      location: '',
      priority: '',
      amountRange: [0, 100000]
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleAccordionToggle = (panel: string) => {
    setExpanded(prev =>
      prev.includes(panel)
        ? prev.filter(p => p !== panel)
        : [...prev, panel]
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.serviceType) count++;
    if (localFilters.status) count++;
    if (localFilters.paymentStatus) count++;
    if (localFilters.dateRange[0] || localFilters.dateRange[1]) count++;
    if (localFilters.assignedStaff) count++;
    if (localFilters.location) count++;
    if (localFilters.priority) count++;
    if (localFilters.amountRange[0] > 0 || localFilters.amountRange[1] < 100000) count++;
    return count;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          p: 0
        }
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ 
            p: 3, 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: 'primary.main',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Advanced Filters
                </Typography>
                {getActiveFiltersCount() > 0 && (
                  <Chip 
                    label={getActiveFiltersCount()} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                )}
              </Box>
              <IconButton onClick={onClose} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Filter Content */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {/* Basic Filters */}
            <Accordion 
              expanded={expanded.includes('basic')}
              onChange={() => handleAccordionToggle('basic')}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Basic Filters
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {/* Service Type */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Service Type</InputLabel>
                    <Select
                      value={localFilters.serviceType}
                      label="Service Type"
                      onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                    >
                      <MenuItem value="">All Services</MenuItem>
                      {serviceTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Status */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={localFilters.status}
                      label="Status"
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      {statusOptions.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={status.label} 
                              size="small" 
                              color={status.color as any}
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Payment Status */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment Status</InputLabel>
                    <Select
                      value={localFilters.paymentStatus}
                      label="Payment Status"
                      onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                    >
                      <MenuItem value="">All Payment Statuses</MenuItem>
                      {paymentStatusOptions.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Payment sx={{ fontSize: 16 }} />
                            <Chip 
                              label={status.label} 
                              size="small" 
                              color={status.color as any}
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Date & Time Filters */}
            <Accordion 
              expanded={expanded.includes('datetime')}
              onChange={() => handleAccordionToggle('datetime')}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Date & Time
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {/* Date Range */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Scheduled Date Range
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Box sx={{ flex: 1 }}>
                        <MuiDatePicker
                          label="From Date"
                          value={localFilters.dateRange[0]}
                          onChange={(date) => 
                            handleFilterChange('dateRange', [date, localFilters.dateRange[1]])
                          }
                          slotProps={{ 
                            textField: { 
                              size: 'small', 
                              fullWidth: true 
                            } 
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <MuiDatePicker
                          label="To Date"
                          value={localFilters.dateRange[1]}
                          onChange={(date) => 
                            handleFilterChange('dateRange', [localFilters.dateRange[0], date])
                          }
                          slotProps={{ 
                            textField: { 
                              size: 'small', 
                              fullWidth: true 
                            } 
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Staff & Location */}
            <Accordion 
              expanded={expanded.includes('staff')}
              onChange={() => handleAccordionToggle('staff')}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Staff & Location
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {/* Assigned Staff */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Assigned Staff</InputLabel>
                    <Select
                      value={localFilters.assignedStaff}
                      label="Assigned Staff"
                      onChange={(e) => handleFilterChange('assignedStaff', e.target.value)}
                    >
                      <MenuItem value="">All Staff</MenuItem>
                      {staffMembers.map((staff) => (
                        <MenuItem key={staff} value={staff}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person sx={{ fontSize: 16 }} />
                            {staff}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Location */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Location</InputLabel>
                    <Select
                      value={localFilters.location}
                      label="Location"
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    >
                      <MenuItem value="">All Locations</MenuItem>
                      {locations.map((location) => (
                        <MenuItem key={location} value={location}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ fontSize: 16 }} />
                            {location}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Advanced Filters */}
            <Accordion 
              expanded={expanded.includes('advanced')}
              onChange={() => handleAccordionToggle('advanced')}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Priority & Amount
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {/* Priority */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={localFilters.priority}
                      label="Priority"
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                      <MenuItem value="">All Priorities</MenuItem>
                      {priorityOptions.map((priority) => (
                        <MenuItem key={priority.value} value={priority.value}>
                          <Chip 
                            label={priority.label} 
                            size="small" 
                            color={priority.color as any}
                            variant={priority.value === 'urgent' ? 'filled' : 'outlined'}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Amount Range */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                      Amount Range: ₹{localFilters.amountRange[0].toLocaleString()} - ₹{localFilters.amountRange[1].toLocaleString()}
                    </Typography>
                    <Slider
                      value={localFilters.amountRange}
                      onChange={(_, value) => handleFilterChange('amountRange', value)}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
                      min={0}
                      max={100000}
                      step={1000}
                      marks={[
                        { value: 0, label: '₹0' },
                        { value: 25000, label: '₹25K' },
                        { value: 50000, label: '₹50K' },
                        { value: 75000, label: '₹75K' },
                        { value: 100000, label: '₹1L' }
                      ]}
                    />
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Footer Actions */}
          <Box sx={{ 
            p: 3, 
            borderTop: 1, 
            borderColor: 'divider',
            bgcolor: 'grey.50'
          }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Clear />}
                onClick={handleClearFilters}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<FilterList />}
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </Stack>
            
            {getActiveFiltersCount() > 0 && (
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  mt: 1, 
                  color: 'text.secondary' 
                }}
              >
                {getActiveFiltersCount()} filter(s) active
              </Typography>
            )}
          </Box>
        </Box>
      </LocalizationProvider>
    </Drawer>
  );
};

export default AdvancedFilters;
