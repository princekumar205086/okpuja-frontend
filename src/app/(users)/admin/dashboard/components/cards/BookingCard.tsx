"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, DollarSign, MoreVertical, Eye, Edit, Download, Trash2 } from 'lucide-react';
import { Avatar, Chip, IconButton, Menu, MenuItem } from '@mui/material';

interface Booking {
  id: string;
  user: string;
  service: string;
  priest: string;
  date: string;
  amount: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  avatar?: string;
  serviceType: 'puja' | 'astrology';
}

interface BookingCardProps {
  booking: Booking;
  index: number;
  onAction: (action: string, booking: Booking) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, index, onAction }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: string) => {
    onAction(action, booking);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' };
      case 'Pending':
        return { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' };
      case 'Cancelled':
        return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' };
      case 'Completed':
        return { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' };
    }
  };

  const getServiceTypeColor = (type: string) => {
    return type === 'puja' ? 'border-l-orange-500' : 'border-l-purple-500';
  };

  const statusColor = getStatusColor(booking.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className={`bg-white rounded-lg shadow-sm border-l-4 ${getServiceTypeColor(booking.serviceType)} border-t border-r border-b border-gray-100 hover:shadow-md transition-all duration-200 p-4`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar
              sx={{ width: 40, height: 40 }}
              src={booking.avatar}
            >
              {booking.user.charAt(0)}
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900 text-sm">{booking.user}</div>
              <div className="text-xs text-gray-500">{booking.id}</div>
            </div>
          </div>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            className="opacity-70 hover:opacity-100"
          >
            <MoreVertical size={16} />
          </IconButton>
        </div>

        {/* Service Info */}
        <div className="mb-3">
          <div className="font-medium text-gray-900 mb-1">{booking.service}</div>
          <div className="text-sm text-gray-600">by {booking.priest}</div>
          <div className="text-xs text-gray-500 mt-1 capitalize">
            {booking.serviceType} Service
          </div>
        </div>

        {/* Details Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-xs text-gray-600">
                {new Date(booking.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-900">{booking.amount}</span>
            </div>
          </div>
          
          {/* Status */}
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
            <div className={`w-2 h-2 rounded-full ${statusColor.dot} mr-1`}></div>
            {booking.status}
          </div>
        </div>
      </div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 0.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <MenuItem onClick={() => handleAction('view')} sx={{ gap: 1, fontSize: 14 }}>
          <Eye size={16} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit')} sx={{ gap: 1, fontSize: 14 }}>
          <Edit size={16} />
          Edit Booking
        </MenuItem>
        <MenuItem onClick={() => handleAction('download')} sx={{ gap: 1, fontSize: 14 }}>
          <Download size={16} />
          Download Receipt
        </MenuItem>
        <MenuItem onClick={() => handleAction('cancel')} sx={{ gap: 1, fontSize: 14, color: 'error.main' }}>
          <Trash2 size={16} />
          Cancel Booking
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default BookingCard;
