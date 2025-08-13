// Export all dashboard components
export { WelcomeHeader } from './WelcomeHeader';
export { StatsGrid } from './StatsGrid';
export { UpcomingBookings } from './UpcomingBookings';
export { QuickActions } from './QuickActions';
export { SpiritualProgress } from './SpiritualProgress';
export { RecentActivities } from './RecentActivities';
export { DashboardError } from './DashboardError';

// Export hooks
export { useDashboardData } from './hooks';

// Export types
export type {
  DashboardStats,
  UpcomingBooking,
  QuickAction,
  ProgressItem,
  RecentActivity,
} from './types';
