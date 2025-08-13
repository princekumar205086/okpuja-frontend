export interface DashboardStats {
  totalBookings: number;
  upcomingPujas: number;
  astrologyConsultations: number;
  totalSpent: number;
  monthlyBookings: number;
  monthlySpent: number;
}

export interface UpcomingBooking {
  id: number;
  bookId: string;
  title: string;
  type: 'PUJA' | 'ASTROLOGY';
  date: string;
  time: string;
  priest?: string;
  consultant?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'REJECTED';
  service?: {
    title: string;
    image_url?: string;
  };
  location?: string;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  gradient: string;
}

export interface ProgressItem {
  title: string;
  description: string;
  progress: number;
  total: number;
  color: string;
}

export interface RecentActivity {
  id: number;
  type: 'booking' | 'payment' | 'consultation' | 'completion';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}
