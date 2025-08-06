'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Star, 
  IndianRupee, 
  Video, 
  Filter, 
  Search, 
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock4,
  Sparkles,
  Phone as PhoneIcon,
  CalendarDays,
  Timer
} from 'lucide-react';
import { useBookingStore } from '../../../stores/bookingStore';
import { useAstrologyBookingStore } from '../../../stores/astrologyBookingStore';
import { useAuthStore } from '../../../stores/authStore';
import { toast } from 'react-hot-toast';

// Types
interface TabProps {
  activeTab: 'puja' | 'astrology';
  onTabChange: (tab: 'puja' | 'astrology') => void;
}

interface FilterState {
  status: string;
  dateRange: string;
  serviceType: string;
}

// Status color mappings
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'rejected':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return <CheckCircle className="w-4 h-4" />;
    case 'pending':
      return <Clock4 className="w-4 h-4" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4" />;
    case 'rejected':
      return <XCircle className="w-4 h-4" />;
    case 'failed':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

// Format date and time
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (timeString: string) => {
  // Handle both HH:MM:SS and HH:MM formats
  const time = timeString.includes(':') ? timeString.split(':').slice(0, 2).join(':') : timeString;
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Tab Component
const BookingTabs: React.FC<TabProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-6">
      <button
        onClick={() => onTabChange('puja')}
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
          activeTab === 'puja'
            ? 'bg-white text-orange-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        🙏 Puja Bookings
      </button>
      <button
        onClick={() => onTabChange('astrology')}
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
          activeTab === 'astrology'
            ? 'bg-white text-purple-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        ⭐ Astrology Bookings
      </button>
    </div>
  );
};

// Filter Component
const BookingFilters: React.FC<{
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  activeTab: 'puja' | 'astrology';
}> = ({ filters, onFilterChange, activeTab }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="font-medium text-gray-900">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="past">Past Bookings</option>
          </select>
        </div>

        {/* Service Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {activeTab === 'puja' ? 'Service Type' : 'Astrology Type'}
          </label>
          <select
            value={filters.serviceType}
            onChange={(e) => onFilterChange({ ...filters, serviceType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {activeTab === 'puja' ? (
              <>
                <option value="HOME">Home Service</option>
                <option value="TEMPLE">Temple Service</option>
                <option value="ONLINE">Online Service</option>
              </>
            ) : (
              <>
                <option value="HOROSCOPE">Horoscope Analysis</option>
                <option value="MATCHING">Kundali Matching</option>
                <option value="PREDICTION">Future Prediction</option>
                <option value="REMEDIES">Astrological Remedies</option>
                <option value="GEMSTONE">Gemstone Recommendation</option>
                <option value="VAASTU">Vaastu Consultation</option>
              </>
            )}
          </select>
        </div>
      </div>
    </div>
  );
};

// Puja Booking Card Component
const PujaBookingCard: React.FC<{ booking: any }> = ({ booking }) => {
  const handleViewInvoice = () => {
    if (booking.book_id) {
      window.open(`/booking/invoice/${booking.book_id}/`, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {booking.cart?.puja_service?.title || 'Puja Service'}
            </h3>
            <p className="text-sm text-gray-600">Booking ID: {booking.book_id}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
              <div className="flex items-center gap-1">
                {getStatusIcon(booking.status)}
                {booking.status}
              </div>
            </span>
            <span className="text-lg font-bold text-gray-900 flex items-center">
              <IndianRupee className="w-4 h-4" />
              {booking.total_amount}
            </span>
          </div>
        </div>
      </div>

      {/* Service Image */}
      {booking.cart?.puja_service?.image_url && (
        <div className="aspect-video relative overflow-hidden">
          <img
            src={booking.cart.puja_service.image_url}
            alt={booking.cart.puja_service.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Date and Time */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="w-4 h-4" />
            <span>{formatDate(booking.selected_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(booking.selected_time)}</span>
          </div>
        </div>

        {/* Service Details */}
        {booking.cart?.puja_service && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Category:</span>
              <span className="ml-2 font-medium">
                {booking.cart.puja_service.category_detail?.name}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium">{booking.cart.puja_service.type}</span>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-medium">
                {booking.cart.puja_service.duration_minutes} mins
              </span>
            </div>
            <div>
              <span className="text-gray-600">Language:</span>
              <span className="ml-2 font-medium">{booking.cart.package?.language}</span>
            </div>
          </div>
        )}

        {/* Address */}
        {booking.address && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              {booking.address.address_line1}
              {booking.address.address_line2 && `, ${booking.address.address_line2}`}
              <br />
              {booking.address.city}, {booking.address.state} - {booking.address.postal_code}
            </span>
          </div>
        )}

        {/* Package Details */}
        {booking.cart?.package && (
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2">Package Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Package:</span>
                <span className="ml-2 font-medium">{booking.cart.package.package_type}</span>
              </div>
              <div>
                <span className="text-gray-600">Priests:</span>
                <span className="ml-2 font-medium">{booking.cart.package.priest_count}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Materials:</span>
                <span className="ml-2 font-medium">
                  {booking.cart.package.includes_materials ? 'Included' : 'Not Included'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Info */}
        {booking.payment_details && (
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="font-medium text-green-900 mb-2">Payment Information</h4>
            <div className="text-sm text-green-800">
              <div>Status: <span className="font-medium">{booking.payment_details.status}</span></div>
              <div>Transaction ID: <span className="font-medium">{booking.payment_details.transaction_id}</span></div>
              <div>Payment Date: <span className="font-medium">
                {new Date(booking.payment_details.payment_date).toLocaleDateString('en-IN')}
              </span></div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={handleViewInvoice}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Invoice
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              <Eye className="w-4 h-4" />
              Details
            </button>
          </div>
          
          {booking.can_be_rescheduled && (
            <button className="px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors">
              Reschedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Astrology Booking Card Component
const AstrologyBookingCard: React.FC<{ booking: any }> = ({ booking }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {booking.service?.title}
            </h3>
            <p className="text-sm text-gray-600">Booking ID: {booking.astro_book_id}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
              <div className="flex items-center gap-1">
                {getStatusIcon(booking.status)}
                {booking.status}
              </div>
            </span>
            <span className="text-lg font-bold text-gray-900 flex items-center">
              <IndianRupee className="w-4 h-4" />
              {booking.service?.price}
            </span>
          </div>
        </div>
      </div>

      {/* Service Image */}
      {booking.service?.image_url && (
        <div className="aspect-video relative overflow-hidden">
          <img
            src={booking.service.image_url}
            alt={booking.service.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Date and Time */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="w-4 h-4" />
            <span>{formatDate(booking.preferred_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(booking.preferred_time)}</span>
          </div>
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Service Type:</span>
            <span className="ml-2 font-medium">{booking.service?.service_type}</span>
          </div>
          <div>
            <span className="text-gray-600">Duration:</span>
            <span className="ml-2 font-medium">{booking.service?.duration_minutes} mins</span>
          </div>
          <div>
            <span className="text-gray-600">Language:</span>
            <span className="ml-2 font-medium">{booking.language}</span>
          </div>
          <div>
            <span className="text-gray-600">Gender:</span>
            <span className="ml-2 font-medium">{booking.gender}</span>
          </div>
        </div>

        {/* Birth Details */}
        <div className="bg-purple-50 rounded-lg p-3">
          <h4 className="font-medium text-purple-900 mb-2">Birth Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-purple-800">
            <div>
              <span className="text-purple-600">Place:</span>
              <span className="ml-2 font-medium">{booking.birth_place}</span>
            </div>
            <div>
              <span className="text-purple-600">Date:</span>
              <span className="ml-2 font-medium">{formatDate(booking.birth_date)}</span>
            </div>
            <div className="col-span-2">
              <span className="text-purple-600">Time:</span>
              <span className="ml-2 font-medium">{formatTime(booking.birth_time)}</span>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{booking.contact_email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <PhoneIcon className="w-4 h-4" />
            <span>{booking.contact_phone}</span>
          </div>
        </div>

        {/* Questions */}
        {booking.questions && (
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2">Questions/Concerns</h4>
            <p className="text-sm text-gray-700">{booking.questions}</p>
          </div>
        )}

        {/* Google Meet Link */}
        {booking.google_meet_link && (
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Video className="w-4 h-4" />
              Google Meet Session
            </h4>
            <a 
              href={booking.google_meet_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Video className="w-4 h-4" />
              Join Meeting
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              <Eye className="w-4 h-4" />
              Details
            </button>
            {booking.status === 'CONFIRMED' && !booking.google_meet_link && (
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                <Video className="w-4 h-4" />
                Waiting for Meeting Link
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC<{ activeTab: 'puja' | 'astrology' }> = ({ activeTab }) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {activeTab === 'puja' ? (
          <span className="text-2xl">🙏</span>
        ) : (
          <Sparkles className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No {activeTab === 'puja' ? 'Puja' : 'Astrology'} Bookings Found
      </h3>
      <p className="text-gray-600 mb-6">
        {activeTab === 'puja' 
          ? "You haven't booked any puja services yet."
          : "You haven't booked any astrology consultations yet."
        }
      </p>
      <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Browse {activeTab === 'puja' ? 'Puja' : 'Astrology'} Services
      </button>
    </div>
  );
};

// Loading Component
const LoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
          <div className="p-4 border-b border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="aspect-video bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Bookings Page Component
const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'puja' | 'astrology'>('puja');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    dateRange: '',
    serviceType: ''
  });

  // Store hooks
  const { user } = useAuthStore();
  const { 
    bookings: pujaBookings, 
    loading: pujaLoading, 
    error: pujaError, 
    fetchBookings: fetchPujaBookings 
  } = useBookingStore();
  
  const { 
    bookings: astrologyBookings, 
    loading: astrologyLoading, 
    error: astrologyError, 
    fetchAstrologyBookings 
  } = useAstrologyBookingStore();

  // Load data on component mount
  useEffect(() => {
    if (user) {
      fetchPujaBookings();
      fetchAstrologyBookings();
    }
  }, [user, fetchPujaBookings, fetchAstrologyBookings]);

  // Filter bookings based on search and filters
  const filterBookings = (bookings: any[], type: 'puja' | 'astrology') => {
    return bookings.filter((booking) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = type === 'puja' 
          ? booking.cart?.puja_service?.title?.toLowerCase().includes(searchLower)
          : booking.service?.title?.toLowerCase().includes(searchLower);
        const idMatch = type === 'puja' 
          ? booking.book_id?.toLowerCase().includes(searchLower)
          : booking.astro_book_id?.toLowerCase().includes(searchLower);
        
        if (!titleMatch && !idMatch) return false;
      }

      // Status filter
      if (filters.status && booking.status !== filters.status) {
        return false;
      }

      // Service type filter
      if (filters.serviceType) {
        const serviceType = type === 'puja' 
          ? booking.cart?.puja_service?.type
          : booking.service?.service_type;
        if (serviceType !== filters.serviceType) return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const bookingDate = new Date(type === 'puja' ? booking.selected_date : booking.preferred_date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        switch (filters.dateRange) {
          case 'today':
            if (bookingDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'tomorrow':
            if (bookingDate.toDateString() !== tomorrow.toDateString()) return false;
            break;
          case 'this_week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            if (bookingDate < weekStart || bookingDate > weekEnd) return false;
            break;
          case 'this_month':
            if (bookingDate.getMonth() !== today.getMonth() || 
                bookingDate.getFullYear() !== today.getFullYear()) return false;
            break;
          case 'past':
            if (bookingDate >= today) return false;
            break;
        }
      }

      return true;
    });
  };

  const handleRefresh = () => {
    if (activeTab === 'puja') {
      fetchPujaBookings();
    } else {
      fetchAstrologyBookings();
    }
  };

  const filteredBookings = activeTab === 'puja' 
    ? filterBookings(pujaBookings, 'puja')
    : filterBookings(astrologyBookings, 'astrology');

  const isLoading = activeTab === 'puja' ? pujaLoading : astrologyLoading;
  const hasError = activeTab === 'puja' ? pujaError : astrologyError;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600 mt-1">Manage your puja and astrology service bookings</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTab} bookings...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <BookingFilters 
          filters={filters} 
          onFilterChange={setFilters} 
          activeTab={activeTab}
        />

        {/* Error State */}
        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{hasError}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <LoadingState />
        ) : filteredBookings.length === 0 ? (
          <EmptyState activeTab={activeTab} />
        ) : (
          <>
            {/* Bookings Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {filteredBookings.length} of {activeTab === 'puja' ? pujaBookings.length : astrologyBookings.length} bookings
              </p>
            </div>

            {/* Bookings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                activeTab === 'puja' ? (
                  <PujaBookingCard key={booking.id} booking={booking} />
                ) : (
                  <AstrologyBookingCard key={booking.id} booking={booking} />
                )
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;