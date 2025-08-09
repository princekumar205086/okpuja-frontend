'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { Event, EventStatus } from '../../../../stores/eventStore';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
  onView: (event: Event) => void;
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onView,
  index,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(event);
    handleMenuClose();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(event.id);
    handleMenuClose();
  };

  const handleView = () => {
    onView(event);
  };

  const getStatusColor = (status: EventStatus): string => {
    switch (status) {
      case 'PUBLISHED':
        return '#4caf50';
      case 'DRAFT':
        return '#9e9e9e';
      case 'CANCELLED':
        return '#f44336';
      case 'COMPLETED':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusIcon = (status: EventStatus): string => {
    switch (status) {
      case 'PUBLISHED':
        return '🟢';
      case 'DRAFT':
        return '🟡';
      case 'CANCELLED':
        return '🔴';
      case 'COMPLETED':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string): string => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'h:mm a');
    } catch {
      return timeString;
    }
  };

  const getDaysUntil = (): string => {
    if (event.days_until === undefined) return '';
    
    if (event.days_until < 0) {
      return `${Math.abs(event.days_until)} days ago`;
    } else if (event.days_until === 0) {
      return 'Today';
    } else if (event.days_until === 1) {
      return 'Tomorrow';
    } else {
      return `In ${event.days_until} days`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card
        className="h-full cursor-pointer hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative"
        onClick={handleView}
      >
        {/* Featured Badge */}
        {event.is_featured && (
          <div className="absolute top-3 left-3 z-10">
            <Chip
              icon={<StarIcon className="text-yellow-400" />}
              label="Featured"
              size="small"
              className="bg-yellow-100 text-yellow-800 font-semibold"
            />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-12 z-10">
          <Chip
            label={
              <span className="flex items-center">
                <span className="mr-1">{getStatusIcon(event.status)}</span>
                {event.status}
              </span>
            }
            size="small"
            style={{ 
              backgroundColor: getStatusColor(event.status),
              color: 'white'
            }}
            className="font-semibold"
          />
        </div>

        {/* Menu Button */}
        <div className="absolute top-3 right-3 z-10">
          <IconButton
            size="small"
            onClick={handleMenuClick}
            className="bg-white/80 hover:bg-white shadow-sm"
          >
            <MoreVertIcon />
          </IconButton>
        </div>

        {/* Event Image */}
        <div className="relative overflow-hidden">
          <CardMedia
            component="img"
            height="200"
            image={event.thumbnail_url || event.banner_url || event.original_image_url || '/placeholder-service.jpg'}
            alt={event.title}
            className="h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Days Until */}
          {event.days_until !== undefined && (
            <div className="absolute bottom-3 left-3">
              <Chip
                label={getDaysUntil()}
                size="small"
                className="bg-white/90 text-gray-800 font-semibold"
              />
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Title */}
          <Typography 
            variant="h6" 
            className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]"
          >
            {event.title}
          </Typography>

          {/* Description */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            className="mb-3 line-clamp-3 flex-1"
          >
            {event.description}
          </Typography>

          {/* Event Details */}
          <div className="space-y-2">
            {/* Date and Time */}
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">{formatDate(event.event_date)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <ScheduleIcon className="w-4 h-4 mr-2 text-green-500" />
              <span>
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center text-sm text-gray-600">
              <LocationIcon className="w-4 h-4 mr-2 text-red-500" />
              <span className="truncate">{event.location}</span>
            </div>

            {/* Registration Link */}
            {event.registration_link && (
              <div className="flex items-center text-sm text-blue-600">
                <LinkIcon className="w-4 h-4 mr-2" />
                <span className="truncate">Registration Available</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <span>Updated {format(new Date(event.updated_at), 'MMM dd')}</span>
            <span>#{event.id}</span>
          </div>
        </CardContent>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
          PaperProps={{
            className: 'shadow-xl border'
          }}
        >
          <MenuItem onClick={handleView} className="text-blue-600">
            <ViewIcon className="mr-2" fontSize="small" />
            View Details
          </MenuItem>
          <MenuItem onClick={handleEdit} className="text-green-600">
            <EditIcon className="mr-2" fontSize="small" />
            Edit Event
          </MenuItem>
          <MenuItem onClick={handleDelete} className="text-red-600">
            <DeleteIcon className="mr-2" fontSize="small" />
            Delete Event
          </MenuItem>
        </Menu>
      </Card>
    </motion.div>
  );
};

export default EventCard;
