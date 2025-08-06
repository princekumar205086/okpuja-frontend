# User Booking Page - Implementation Guide

## 🎯 Overview
A comprehensive, responsive booking management page for users to view and manage their Puja and Astrology service bookings.

## ✨ Features

### 📱 Responsive Design
- **Mobile-first approach** with responsive grid layout
- **Professional UI/UX** with modern design patterns
- **Optimized for all devices** (mobile, tablet, desktop)

### 🔄 Dual Service Support
- **Puja Bookings** - Traditional religious services
- **Astrology Bookings** - Consultation services
- **Tabbed interface** for easy navigation

### 🔍 Advanced Filtering & Search
- **Real-time search** by service name or booking ID
- **Status filtering** (Pending, Confirmed, Completed, etc.)
- **Date range filtering** (Today, Tomorrow, This Week, etc.)
- **Service type filtering** specific to each category

### 📊 Rich Booking Cards
- **Service images** and detailed information
- **Status indicators** with color-coded badges
- **Payment information** and transaction details
- **Contact details** and scheduling info
- **Google Meet integration** for astrology sessions

### 🔗 Admin Integration
- **Google Meet link sharing** capability for admins
- **Status management** with reason tracking
- **Invoice generation** and download
- **Rescheduling options** where applicable

## 🏗️ Architecture

### 📁 File Structure
```
src/app/(users)/user/bookings/
└── page.tsx                 # Main booking page (single file implementation)

src/app/stores/
├── bookingStore.ts          # Puja booking state management
├── astrologyBookingStore.ts # Astrology booking state management
└── authStore.ts             # Authentication state
```

### 🛠️ Tech Stack
- **React 19** with TypeScript
- **Next.js 15** with App Router
- **Zustand** for state management
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 🔌 API Integration

### Puja Booking Endpoints
```typescript
GET /booking/bookings/              # List user bookings
GET /booking/bookings/{id}/         # Get specific booking
POST /booking/bookings/{id}/status/ # Update booking status
GET /booking/invoice/{book_id}/     # Get invoice
```

### Astrology Booking Endpoints
```typescript
GET /astrology/bookings/                           # List astrology bookings
GET /astrology/bookings/confirmation/?astro_book_id # Get booking confirmation
PATCH /astrology/bookings/{id}/update/             # Update booking (includes Google Meet)
```

## 🔄 State Management

### Booking Store (Puja)
```typescript
interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  currentBooking: Booking | null;
  
  // Actions
  fetchBookings: () => Promise<void>;
  createBooking: (data) => Promise<Booking | null>;
  getBookingById: (id) => Promise<Booking | null>;
  updateBookingStatus: (id, status, reason?) => Promise<boolean>;
}
```

### Astrology Booking Store
```typescript
interface AstrologyBookingState {
  bookings: AstrologyBooking[];
  currentBooking: AstrologyBooking | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchAstrologyBookings: () => Promise<void>;
  getAstrologyBookingConfirmation: (astroBookId) => Promise<AstrologyBooking | null>;
  updateGoogleMeetLink: (bookingId, meetLink) => Promise<boolean>;
}
```

## 🎨 Components Breakdown

### 🏷️ BookingTabs
```typescript
interface TabProps {
  activeTab: 'puja' | 'astrology';
  onTabChange: (tab: 'puja' | 'astrology') => void;
}
```
- Toggles between Puja and Astrology bookings
- Visual active state indication

### 🔍 BookingFilters
```typescript
interface FilterState {
  status: string;
  dateRange: string;
  serviceType: string;
}
```
- Dynamic filtering based on active tab
- Real-time filter application

### 🎴 PujaBookingCard
- **Service details** with images
- **Package information** (priest count, materials)
- **Address and timing** display
- **Payment status** with transaction details
- **Action buttons** (Invoice, Details, Reschedule)

### ⭐ AstrologyBookingCard
- **Birth chart information** (place, date, time)
- **Consultation details** (language, gender, questions)
- **Google Meet integration** with join button
- **Status-specific actions**

## 🎯 Key Features Implementation

### 📅 Date & Time Formatting
```typescript
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (timeString: string) => {
  const time = timeString.includes(':') ? timeString.split(':').slice(0, 2).join(':') : timeString;
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
```

### 🎨 Status Color Mapping
```typescript
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    // ... more statuses
  }
};
```

### 🔍 Advanced Filtering Logic
```typescript
const filterBookings = (bookings: any[], type: 'puja' | 'astrology') => {
  return bookings.filter((booking) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = /* title matching logic */;
      const idMatch = /* ID matching logic */;
      if (!titleMatch && !idMatch) return false;
    }

    // Status filter
    if (filters.status && booking.status !== filters.status) return false;

    // Service type filter
    if (filters.serviceType) {
      const serviceType = /* get service type based on booking type */;
      if (serviceType !== filters.serviceType) return false;
    }

    // Date range filter with complex logic
    if (filters.dateRange) {
      // Implementation for various date ranges
    }

    return true;
  });
};
```

## 🔗 Google Meet Integration

### Admin Functionality
```typescript
updateGoogleMeetLink: async (bookingId: number, meetLink: string): Promise<boolean> => {
  try {
    await apiClient.patch(`/astrology/bookings/${bookingId}/update/`, {
      google_meet_link: meetLink
    });
    
    // Refresh bookings
    await get().fetchAstrologyBookings();
    
    toast.success('Google Meet link updated successfully!');
    return true;
  } catch (err: any) {
    // Error handling
    return false;
  }
}
```

### User Experience
- **Waiting indicator** when meeting link is not available
- **Join Meeting button** when link is provided
- **Visual distinction** for sessions with/without meeting links

## 📱 Responsive Design

### Grid Layout
```css
/* Desktop: 3 columns */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Mobile: Single column with full-width cards */
/* Tablet: 2 columns */
/* Desktop: 3 columns for optimal viewing */
```

### Mobile Optimizations
- **Touch-friendly buttons** with adequate spacing
- **Readable typography** at small sizes
- **Collapsible sections** for detailed information
- **Horizontal scrolling** for filter options

## 🚀 Performance Optimizations

### State Management
- **Persistent storage** for user preferences
- **Optimistic updates** for better UX
- **Error boundary** implementation
- **Loading states** with skeleton screens

### API Optimization
- **Parallel data fetching** for both service types
- **Error handling** with retry mechanisms
- **Token refresh** automatic handling
- **Request deduplication**

## 🔐 Security Features

### Authentication
- **JWT token management** with automatic refresh
- **Role-based access** control
- **Session persistence** across tabs
- **Secure API calls** with authorization headers

### Data Protection
- **Sensitive data filtering** in state persistence
- **Input validation** and sanitization
- **XSS protection** through React's built-in security

## 🎛️ Usage Instructions

### For Users
1. **Navigation**: Use tabs to switch between Puja and Astrology bookings
2. **Search**: Use the search bar to find specific bookings
3. **Filter**: Apply filters to narrow down results
4. **Actions**: Click action buttons for invoices, details, or meeting links
5. **Refresh**: Use the refresh button to get latest booking status

### For Admins
1. **Google Meet Links**: Update meeting links through the admin panel
2. **Status Management**: Change booking statuses with reasons
3. **Invoice Generation**: Generate and manage booking invoices

## 🐛 Error Handling

### User-Friendly Messages
- **Network errors**: "Please check your internet connection"
- **Authentication**: "Please login to view bookings"
- **No data**: Helpful empty states with action buttons
- **API errors**: Specific error messages from backend

### Recovery Mechanisms
- **Retry buttons** for failed operations
- **Automatic token refresh** for expired sessions
- **Fallback states** for missing data
- **Toast notifications** for success/error feedback

## 🔄 Future Enhancements

### Planned Features
- **Real-time updates** with WebSocket integration
- **Push notifications** for booking status changes
- **Export functionality** for booking history
- **Rating and review** system post-service
- **Rescheduling interface** for user-initiated changes

### Technical Improvements
- **Infinite scrolling** for large booking lists
- **Virtual scrolling** for performance
- **Offline support** with service workers
- **PWA features** for mobile app-like experience

## 📞 Support & Documentation

### Help Resources
- **In-app help** tooltips and guides
- **FAQ section** for common questions
- **Contact support** direct integration
- **User manual** with screenshots and tutorials

This implementation provides a comprehensive, professional, and user-friendly booking management interface that scales across all devices and integrates seamlessly with your existing backend infrastructure.
