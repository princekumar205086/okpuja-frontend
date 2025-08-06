'use client';

import React from 'react';
import {
  Box,
  Paper,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule,
  Payment,
  Send,
  Delete,
  MoreVert,
  Assignment,
  Print,
  Download,
  Email
} from '@mui/icons-material';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  onBulkAction
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: string) => {
    onBulkAction(action);
    handleMenuClose();
  };

  return (
    <Paper 
      sx={{ 
        mb: 2, 
        bgcolor: 'primary.main', 
        color: 'white',
        borderRadius: 2
      }}
    >
      <Toolbar sx={{ minHeight: '56px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {selectedCount} booking{selectedCount !== 1 ? 's' : ''} selected
          </Typography>
          
          <Chip 
            label={`${selectedCount} items`} 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontWeight: 600 
            }} 
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Quick Actions */}
          <Tooltip title="Confirm Selected">
            <Button
              startIcon={<CheckCircle />}
              onClick={() => handleAction('confirm')}
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { 
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
              variant="outlined"
              size="small"
            >
              Confirm
            </Button>
          </Tooltip>

          <Tooltip title="Cancel Selected">
            <Button
              startIcon={<Cancel />}
              onClick={() => handleAction('cancel')}
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { 
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
              variant="outlined"
              size="small"
            >
              Cancel
            </Button>
          </Tooltip>

          <Tooltip title="Reschedule Selected">
            <Button
              startIcon={<Schedule />}
              onClick={() => handleAction('reschedule')}
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { 
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
              variant="outlined"
              size="small"
            >
              Reschedule
            </Button>
          </Tooltip>

          {/* More Actions Menu */}
          <Tooltip title="More Actions">
            <IconButton 
              onClick={handleMenuOpen}
              sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <MoreVert />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { minWidth: 200 }
            }}
          >
            <MenuItem onClick={() => handleAction('assign_staff')}>
              <Assignment sx={{ mr: 1 }} />
              Assign Staff
            </MenuItem>
            
            <MenuItem onClick={() => handleAction('update_payment')}>
              <Payment sx={{ mr: 1 }} />
              Update Payment
            </MenuItem>
            
            <MenuItem onClick={() => handleAction('send_notification')}>
              <Send sx={{ mr: 1 }} />
              Send Notification
            </MenuItem>
            
            <MenuItem onClick={() => handleAction('send_email')}>
              <Email sx={{ mr: 1 }} />
              Send Email
            </MenuItem>
            
            <Divider />
            
            <MenuItem onClick={() => handleAction('export_selected')}>
              <Download sx={{ mr: 1 }} />
              Export Selected
            </MenuItem>
            
            <MenuItem onClick={() => handleAction('print_selected')}>
              <Print sx={{ mr: 1 }} />
              Print Selected
            </MenuItem>
            
            <Divider />
            
            <MenuItem 
              onClick={() => handleAction('delete_selected')}
              sx={{ color: 'error.main' }}
            >
              <Delete sx={{ mr: 1 }} />
              Delete Selected
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </Paper>
  );
};

export default BulkActionsToolbar;
