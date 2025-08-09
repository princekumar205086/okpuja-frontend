'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fab,
  Tooltip,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import {
  Add as AddIcon,
  Event as EventIcon,
  Star as StarIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

interface FloatingActionMenuProps {
  onCreateEvent: () => void;
  onCreateFeaturedEvent: () => void;
  onRefresh: () => void;
  onToggleFilters: () => void;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  onCreateEvent,
  onCreateFeaturedEvent,
  onRefresh,
  onToggleFilters,
  position = 'bottom-right',
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateEvent = () => {
    onCreateEvent();
    handleClose();
  };

  const handleCreateFeaturedEvent = () => {
    onCreateFeaturedEvent();
    handleClose();
  };

  const handleRefresh = () => {
    onRefresh();
    handleClose();
  };

  const handleToggleFilters = () => {
    onToggleFilters();
    handleClose();
  };

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
  };

  const actions = [
    {
      icon: <EventIcon />,
      name: 'Create Event',
      onClick: handleCreateEvent,
      color: 'primary' as const,
    },
    {
      icon: <StarIcon />,
      name: 'Create Featured Event',
      onClick: handleCreateFeaturedEvent,
      color: 'secondary' as const,
    },
    {
      icon: <RefreshIcon />,
      name: 'Refresh Events',
      onClick: handleRefresh,
      color: 'default' as const,
    },
    {
      icon: <FilterIcon />,
      name: 'Toggle Filters',
      onClick: handleToggleFilters,
      color: 'default' as const,
    },
  ];

  return (
    <div className={`${positionClasses[position]} z-50 ${className}`}>
      <SpeedDial
        ariaLabel="Event Actions"
        sx={{
          '& .MuiFab-primary': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              transform: 'scale(1.1)',
            },
          },
        }}
        icon={
          <SpeedDialIcon
            icon={<AddIcon />}
            openIcon={<AddIcon style={{ transform: 'rotate(45deg)' }} />}
          />
        }
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction="up"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {action.icon}
              </motion.div>
            }
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
            sx={{
              '& .MuiFab-root': {
                backgroundColor: action.color === 'primary' ? '#667eea' : 
                                action.color === 'secondary' ? '#f59e0b' : '#6b7280',
                '&:hover': {
                  backgroundColor: action.color === 'primary' ? '#5a67d8' : 
                                  action.color === 'secondary' ? '#d97706' : '#4b5563',
                  transform: 'scale(1.05)',
                },
              },
            }}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default FloatingActionMenu;
