'use client';

import React from 'react';
import {
  EyeIcon,
  CalendarIcon,
  LinkIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  SparklesIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

interface BookingTableProps {
  data: any[];
  activeTab: string;
  selectedBookings: string[];
  onSelectionChange: (selected: string[]) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  onViewBooking: (booking: any) => void;
  onEditBooking: (booking: any) => void;
  onSendMeetLink: (booking: any) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({
  data,
  activeTab,
  selectedBookings,
  onSelectionChange,
  getStatusColor,
  getStatusIcon,
  onViewBooking,
  onEditBooking,
  onSendMeetLink,
}) => {
  // ...existing helper functions...

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* ...existing table implementation with mobile-responsive design... */}
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
