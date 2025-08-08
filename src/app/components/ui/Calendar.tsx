'use client';

import React, { useState } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  bookings?: any[];
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate = new Date(),
  onDateSelect,
  bookings = [],
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const hasBookings = (date: Date | null) => {
    if (!date) return false;
    return bookings.some(booking => {
      const bookingDate = new Date(booking.created_at || booking.date);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  const getBookingCount = (date: Date | null) => {
    if (!date) return 0;
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.created_at || booking.date);
      return bookingDate.toDateString() === date.toDateString();
    }).length;
  };

  const handleDateClick = (date: Date | null) => {
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const bookingCount = getBookingCount(date);
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={!date}
              className={`
                h-10 w-full flex items-center justify-center text-sm relative
                ${!date ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100'}
                ${isToday(date) ? 'bg-blue-100 text-blue-900 font-semibold rounded-lg' : ''}
                ${isSelected(date) ? 'bg-blue-600 text-white rounded-lg' : ''}
                ${!isToday(date) && !isSelected(date) ? 'text-gray-900 hover:bg-gray-50 rounded-lg' : ''}
                transition-colors duration-150
              `}
            >
              {date && (
                <>
                  <span>{date.getDate()}</span>
                  {hasBookings(date) && (
                    <div className="absolute -top-1 -right-1">
                      <div className="h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {bookingCount > 9 ? '9+' : bookingCount}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-red-500 rounded-full"></div>
          <span>Has Bookings</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-blue-100 rounded-full"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
