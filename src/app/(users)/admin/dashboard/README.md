# OKPUJA Admin Dashboard

A comprehensive, responsive admin dashboard for the OKPUJA Hindu Puja and Astrology booking platform.

## Features

### 🏠 Dashboard Overview
- **Real-time Statistics**: Live stats for users, bookings, revenue, and platform health
- **Interactive Charts**: Revenue analytics, booking trends, and service distribution
- **Recent Activities**: Timeline of platform activities and user interactions
- **Quick Actions**: Fast access to common administrative tasks

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for all screen sizes (mobile, tablet, desktop)
- **Touch-Friendly**: Mobile-optimized interactions and gestures
- **Adaptive Components**: Components that adapt to screen size
- **Progressive Enhancement**: Enhanced features for larger screens

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface with Hindu cultural elements
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Color-Coded**: Service types differentiated by colors (Puja: Orange, Astrology: Purple)
- **Accessibility**: WCAG compliant with keyboard navigation support

### 📊 Data Visualization
- **Revenue Charts**: Monthly revenue breakdown with service-wise analysis
- **Booking Trends**: Pie chart showing service distribution
- **Performance Metrics**: Server health and system performance indicators
- **Real-time Updates**: Live data with auto-refresh capabilities

## Component Structure

```
dashboard/
├── components/
│   ├── DashboardHeader.tsx          # Main dashboard header
│   ├── ResponsiveLayout.tsx         # Responsive layout wrapper
│   ├── index.ts                     # Component exports
│   ├── cards/
│   │   ├── StatsCard.tsx           # Desktop stats card
│   │   ├── MobileStatsCard.tsx     # Mobile-optimized stats card
│   │   └── StatsOverview.tsx       # Stats grid container
│   ├── charts/
│   │   ├── RevenueChart.tsx        # Revenue analytics chart
│   │   └── BookingTrendsChart.tsx  # Service distribution chart
│   ├── tables/
│   │   └── RecentBookingsTable.tsx # Recent bookings table
│   └── widgets/
│       ├── QuickActionsWidget.tsx    # Quick action buttons
│       ├── PlatformHealthWidget.tsx  # System health metrics
│       └── RecentActivitiesWidget.tsx # Activity timeline
└── page.tsx                         # Main dashboard page
```

## Key Metrics Tracked

### 📈 Business Metrics
- **Total Users**: Platform user count with growth trends
- **Puja Bookings**: Hindu puja service bookings
- **Astrology Bookings**: Astrology consultation bookings
- **Revenue**: Total platform revenue with service breakdown
- **Active Priests**: Number of active service providers

### 🔧 Technical Metrics
- **System Status**: Overall platform health
- **API Response Time**: Performance monitoring
- **Active Users**: Real-time user activity
- **Server Performance**: CPU, memory, disk usage

### 📋 Activity Tracking
- **Recent Bookings**: Latest service bookings
- **Payment Status**: Payment processing status
- **User Registrations**: New user sign-ups
- **Content Updates**: Blog and gallery updates

## Responsive Breakpoints

- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: 1024px - 1440px (lg)
- **Large Desktop**: > 1440px (xl)

## Color Scheme

### Service Colors
- **Puja Services**: #ff6b35 (Orange)
- **Astrology Services**: #8b5cf6 (Purple)
- **General**: #4f46e5 (Indigo)

### Status Colors
- **Success**: #059669 (Green)
- **Warning**: #f7931e (Orange)
- **Error**: #ef4444 (Red)
- **Info**: #06b6d4 (Cyan)

## API Integration

The dashboard is designed to integrate with the OKPUJA API endpoints:

### Core Endpoints
- `/auth/users/` - User management
- `/puja/bookings/` - Puja service bookings
- `/astrology/bookings/` - Astrology service bookings
- `/payments/payments/` - Payment processing
- `/booking/admin/bookings/` - Admin booking management

### Analytics Endpoints
- Revenue metrics and trends
- User activity statistics
- Service performance data
- System health metrics

## Installation & Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Required Packages**
   ```bash
   pnpm add recharts @mui/x-charts @mui/x-data-grid react-countup
   ```

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

## Usage

### Accessing the Dashboard
Navigate to `/admin/dashboard` after authentication as an admin user.

### Mobile Navigation
- Swipe gestures for chart navigation
- Touch-optimized buttons and interactions
- Collapsible sections for better mobile experience

### Quick Actions
- **Manage Users**: User administration
- **Add Services**: Create new puja/astrology services
- **Manage Priests**: Priest profile management
- **View Reports**: Financial and performance reports

## Customization

### Adding New Metrics
1. Update the stats array in `StatsOverview.tsx`
2. Add corresponding API integration
3. Update color schemes if needed

### Adding New Charts
1. Create new chart component in `charts/` directory
2. Import and add to main dashboard grid
3. Ensure mobile responsiveness

### Custom Widgets
1. Create widget component in `widgets/` directory
2. Follow the existing widget pattern
3. Add to the dashboard layout

## Performance Optimization

- **Code Splitting**: Components are split for better loading
- **Lazy Loading**: Heavy components loaded on demand
- **Memoization**: React.memo for expensive calculations
- **Efficient Rendering**: Optimized re-renders with proper dependencies

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions
- **High Contrast**: Accessible color combinations
- **Focus Management**: Proper focus indicators

## Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+
- **Mobile**: iOS 13+, Android 8+

## Contributing

1. Follow the existing component structure
2. Ensure mobile responsiveness
3. Add proper TypeScript types
4. Include accessibility features
5. Write proper documentation

## License

This dashboard is part of the OKPUJA platform and follows the project's license terms.
