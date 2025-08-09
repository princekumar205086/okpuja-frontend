'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Link as LinkIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Event, EventStatus } from '../../../../stores/eventStore';
import { format } from 'date-fns';
import Image from 'next/image';

interface EventDetailModalProps {
  open: boolean;
  onClose: () => void;
  event: Event | null;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  open,
  onClose,
  event,
  onEdit,
  onDelete,
}) => {
  if (!event) return null;

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
      return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
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

  const handleEdit = () => {
    onEdit(event);
    onClose();
  };

  const handleDelete = () => {
    onDelete(event.id);
    onClose();
  };

  const handleRegistrationLink = () => {
    if (event.registration_link) {
      window.open(event.registration_link, '_blank');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "rounded-2xl overflow-hidden max-h-[90vh]",
      }}
    >
      <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 text-white relative p-0">
        {/* Header Image */}
        {(event.banner_url || event.thumbnail_url || event.original_image_url) && (
          <div className="relative h-64 overflow-hidden">
            <Image
              src={
                event.banner_url ||
                event.thumbnail_url ||
                event.original_image_url ||
                '/default-image.png'
              }
              alt={event.title}
              className="w-full h-full object-cover"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Close Button */}
            <IconButton
              onClick={onClose}
              className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50"
              size="small"
            >
              <CloseIcon />
            </IconButton>

            {/* Featured Badge */}
            {event.is_featured && (
              <div className="absolute top-4 left-4">
                <Chip
                  icon={<StarIcon className="text-yellow-400" />}
                  label="Featured"
                  className="bg-yellow-100 text-yellow-800 font-semibold"
                />
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 right-16">
              <Chip
                label={
                  <span className="flex items-center">
                    <span className="mr-1">{getStatusIcon(event.status)}</span>
                    {event.status}
                  </span>
                }
                style={{ 
                  backgroundColor: getStatusColor(event.status),
                  color: 'white'
                }}
                className="font-semibold"
              />
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <Typography variant="h4" className="text-white font-bold mb-2">
                {event.title}
              </Typography>
              
              {/* Days Until */}
              {event.days_until !== undefined && (
                <Chip
                  label={getDaysUntil()}
                  className="bg-white/90 text-gray-800 font-semibold"
                />
              )}
            </div>
          </div>
        )}

        {/* Fallback Header without Image */}
        {!(event.banner_url || event.thumbnail_url || event.original_image_url) && (
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Typography variant="h5" className="font-bold mb-2">
                  {event.title}
                </Typography>
                {event.is_featured && (
                  <Chip
                    icon={<StarIcon className="text-yellow-400" />}
                    label="Featured"
                    className="bg-yellow-100 text-yellow-800 font-semibold mr-2"
                  />
                )}
                <Chip
                  label={
                    <span className="flex items-center">
                      <span className="mr-1">{getStatusIcon(event.status)}</span>
                      {event.status}
                    </span>
                  }
                  style={{ 
                    backgroundColor: getStatusColor(event.status),
                    color: 'white'
                  }}
                  className="font-semibold"
                />
              </div>
              <IconButton
                onClick={onClose}
                className="text-white hover:bg-white/20"
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        )}
      </DialogTitle>

      <DialogContent className="p-6 bg-gray-50">
        <div className="space-y-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <Typography variant="h6" className="text-gray-800 mb-3 flex items-center">
              📋 Description
            </Typography>
            <Typography variant="body1" className="text-gray-700 leading-relaxed">
              {event.description}
            </Typography>
          </motion.div>

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <Typography variant="h6" className="text-gray-800 mb-4 flex items-center">
              📅 Event Details
            </Typography>
            
            <div className="space-y-4">
              {/* Date */}
              <div className="flex items-center">
                <CalendarIcon className="text-blue-500 mr-3" />
                <div>
                  <Typography variant="subtitle2" className="text-gray-600">
                    Date
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {formatDate(event.event_date)}
                  </Typography>
                </div>
              </div>

              <Divider />

              {/* Time */}
              <div className="flex items-center">
                <ScheduleIcon className="text-green-500 mr-3" />
                <div>
                  <Typography variant="subtitle2" className="text-gray-600">
                    Time
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </Typography>
                </div>
              </div>

              <Divider />

              {/* Location */}
              <div className="flex items-center">
                <LocationIcon className="text-red-500 mr-3" />
                <div>
                  <Typography variant="subtitle2" className="text-gray-600">
                    Location
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {event.location}
                  </Typography>
                </div>
              </div>

              {/* Registration Link */}
              {event.registration_link && (
                <>
                  <Divider />
                  <div className="flex items-center">
                    <LinkIcon className="text-purple-500 mr-3" />
                    <div className="flex-1">
                      <Typography variant="subtitle2" className="text-gray-600">
                        Registration
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleRegistrationLink}
                        className="mt-1"
                      >
                        Open Registration Link
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <Typography variant="h6" className="text-gray-800 mb-4 flex items-center">
              ℹ️ Meta Information
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Typography variant="subtitle2" className="text-gray-600">
                  Event ID
                </Typography>
                <Typography variant="body2" className="font-mono">
                  #{event.id}
                </Typography>
              </div>
              
              <div>
                <Typography variant="subtitle2" className="text-gray-600">
                  Slug
                </Typography>
                <Typography variant="body2" className="font-mono">
                  {event.slug}
                </Typography>
              </div>
              
              <div>
                <Typography variant="subtitle2" className="text-gray-600">
                  Created
                </Typography>
                <Typography variant="body2">
                  {format(new Date(event.created_at), 'MMM dd, yyyy at h:mm a')}
                </Typography>
              </div>
              
              <div>
                <Typography variant="subtitle2" className="text-gray-600">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {format(new Date(event.updated_at), 'MMM dd, yyyy at h:mm a')}
                </Typography>
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>

      <DialogActions className="p-6 bg-gray-50 border-t">
        <Button
          onClick={onClose}
          variant="outlined"
          className="mr-auto"
        >
          Close
        </Button>
        
        <div className="space-x-2">
          <Button
            onClick={handleEdit}
            variant="outlined"
            startIcon={<EditIcon />}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Edit Event
          </Button>
          
          <Button
            onClick={handleDelete}
            variant="outlined"
            startIcon={<DeleteIcon />}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Delete Event
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailModal;
