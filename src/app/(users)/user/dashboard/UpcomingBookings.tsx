"use client";
import React from 'react';
import Image from 'next/image';
import { UpcomingBooking } from './types';
import {
  AutoAwesome as PujaIcon,
  StarBorder as AstrologyIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

interface UpcomingBookingCardProps {
  booking: UpcomingBooking;
}

const UpcomingBookingCard: React.FC<UpcomingBookingCardProps> = ({ booking }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = () => {
    return booking.type === 'PUJA' ? (
      <PujaIcon className="w-5 h-5 text-orange-500" />
    ) : (
      <AstrologyIcon className="w-5 h-5 text-purple-500" />
    );
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getTypeIcon()}
          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
            {booking.title}
          </h4>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ScheduleIcon className="w-4 h-4" />
          <span>{formatDate(booking.date)} at {formatTime(booking.time)}</span>
        </div>

        {(booking.priest || booking.consultant) && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <PersonIcon className="w-4 h-4" />
            <span>{booking.priest || booking.consultant}</span>
          </div>
        )}

        {booking.location && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <LocationIcon className="w-4 h-4" />
            <span className="line-clamp-1">{booking.location}</span>
          </div>
        )}
      </div>

      {booking.service?.image_url && (
        <div className="mt-3">
          <Image
            src={booking.service.image_url}
            alt={booking.title}
            width={400}
            height={96}
            className="w-full h-24 object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

interface UpcomingBookingsProps {
  bookings: UpcomingBooking[];
  loading?: boolean;
}

export const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({
  bookings,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h3>
          <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h3>
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No upcoming bookings</p>
            <p className="text-gray-400 text-xs mt-1">
              Book a puja or consultation to see them here
            </p>
          </div>
        ) : (
          bookings.map((booking) => (
            <UpcomingBookingCard key={`${booking.type}-${booking.id}`} booking={booking} />
          ))
        )}
      </div>
    </div>
  );
};
