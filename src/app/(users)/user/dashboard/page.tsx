"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/app/stores/authStore';
import { useBookingStore } from '@/app/stores/bookingStore';
import { useAstrologyBookingStore } from '@/app/stores/astrologyBookingStore';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import {
  CalendarToday as CalendarIcon,
  AutoAwesome as PujaIcon,
  StarBorder as AstrologyIcon,
  Payment as PaymentIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingUpIcon,
  ErrorOutline as ErrorOutlineIcon,
  History as HistoryIcon,
  AccountBalance as TempleIcon,
  Phone as ContactIcon,
  CheckCircle as CompletionIcon,
  Circle as DefaultIcon,
} from '@mui/icons-material';

// Types
interface DashboardStats {
  totalBookings: number;
  upcomingPujas: number;
  astrologyConsultations: number;
  totalSpent: number;
  monthlyBookings: number;
  monthlySpent: number;
}

interface UpcomingBooking {
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

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  gradient: string;
}

interface ProgressItem {
  title: string;
  description: string;
  progress: number;
  total: number;
  color: string;
}

interface RecentActivity {
  id: number;
  type: 'booking' | 'payment' | 'consultation' | 'completion';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

// Custom Hook
const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    upcomingPujas: 0,
    astrologyConsultations: 0,
    totalSpent: 0,
    monthlyBookings: 0,
    monthlySpent: 0,
  });
  
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { bookings, fetchBookings, loading: bookingLoading } = useBookingStore();
  const { bookings: astrologyBookings, fetchAstrologyBookings, loading: astrologyLoading } = useAstrologyBookingStore();

  const processBookingsData = useCallback(() => {
    try {
      const pujaBookings = bookings || [];
      const astroBookings = astrologyBookings || [];
      
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const totalBookings = pujaBookings.length + astroBookings.length;
      
      const upcomingPujas = pujaBookings.filter(booking => {
        const bookingDate = new Date(booking.selected_date);
        return bookingDate > currentDate && booking.status === 'CONFIRMED';
      }).length;
      
      const astrologyConsultations = astroBookings.length;
      
      const pujaTotal = pujaBookings.reduce((sum, booking) => {
        return sum + parseFloat(booking.total_amount || '0');
      }, 0);
      
      const astroTotal = astroBookings.reduce((sum, booking) => {
        return sum + parseFloat(booking.service?.price || '0');
      }, 0);
      
      const totalSpent = pujaTotal + astroTotal;
      
      const monthlyPujaBookings = pujaBookings.filter(booking => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      });
      
      const monthlyAstroBookings = astroBookings.filter(booking => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      });
      
      const monthlyBookings = monthlyPujaBookings.length + monthlyAstroBookings.length;
      
      const monthlyPujaSpent = monthlyPujaBookings.reduce((sum, booking) => {
        return sum + parseFloat(booking.total_amount || '0');
      }, 0);
      
      const monthlyAstroSpent = monthlyAstroBookings.reduce((sum, booking) => {
        return sum + parseFloat(booking.service?.price || '0');
      }, 0);
      
      const monthlySpent = monthlyPujaSpent + monthlyAstroSpent;

      setStats({
        totalBookings,
        upcomingPujas,
        astrologyConsultations,
        totalSpent,
        monthlyBookings,
        monthlySpent,
      });

      const upcoming: UpcomingBooking[] = [];
      
      pujaBookings
        .filter(booking => {
          const bookingDate = new Date(booking.selected_date);
          return bookingDate > currentDate && ['PENDING', 'CONFIRMED'].includes(booking.status);
        })
        .sort((a, b) => new Date(a.selected_date).getTime() - new Date(b.selected_date).getTime())
        .slice(0, 5)
        .forEach(booking => {
          upcoming.push({
            id: booking.id,
            bookId: booking.book_id,
            title: booking.cart?.puja_service?.title || 'Puja Service',
            type: 'PUJA',
            date: booking.selected_date,
            time: booking.selected_time,
            priest: 'Assigned Priest',
            status: booking.status,
            service: {
              title: booking.cart?.puja_service?.title || 'Puja Service',
              image_url: booking.cart?.puja_service?.image_url,
            },
          });
        });

      astroBookings
        .filter(booking => {
          const bookingDate = new Date(booking.preferred_date);
          return bookingDate > currentDate && ['PENDING', 'CONFIRMED'].includes(booking.status);
        })
        .sort((a, b) => new Date(a.preferred_date).getTime() - new Date(b.preferred_date).getTime())
        .slice(0, 5)
        .forEach(booking => {
          upcoming.push({
            id: booking.id,
            bookId: booking.astro_book_id,
            title: booking.service?.title || 'Astrology Consultation',
            type: 'ASTROLOGY',
            date: booking.preferred_date,
            time: booking.preferred_time,
            consultant: 'Astrology Expert',
            status: booking.status,
            service: {
              title: booking.service?.title || 'Astrology Consultation',
              image_url: booking.service?.image_url,
            },
          });
        });

      upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setUpcomingBookings(upcoming.slice(0, 5));

      const activities: RecentActivity[] = [];
      
      pujaBookings
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
        .forEach(booking => {
          activities.push({
            id: booking.id,
            type: 'booking',
            title: 'Puja Booking Created',
            description: `Booked ${booking.cart?.puja_service?.title || 'Puja Service'}`,
            timestamp: booking.created_at,
            status: booking.status,
          });
        });

      astroBookings
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
        .forEach(booking => {
          activities.push({
            id: booking.id,
            type: 'consultation',
            title: 'Astrology Consultation Booked',
            description: `Booked ${booking.service?.title || 'Astrology Consultation'}`,
            timestamp: booking.created_at,
            status: booking.status,
          });
        });

      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivities(activities.slice(0, 6));

    } catch (err) {
      console.error('Error processing bookings data:', err);
      setError('Failed to process dashboard data');
    }
  }, [bookings, astrologyBookings]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await Promise.all([
          fetchBookings(),
          fetchAstrologyBookings(),
        ]);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchBookings, fetchAstrologyBookings]);

  useEffect(() => {
    if (!loading && !bookingLoading && !astrologyLoading) {
      processBookingsData();
    }
  }, [bookings, astrologyBookings, loading, bookingLoading, astrologyLoading, processBookingsData]);

  const refreshData = async () => {
    try {
      setError(null);
      await Promise.all([
        fetchBookings(),
        fetchAstrologyBookings(),
      ]);
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError('Failed to refresh data');
    }
  };

  return {
    stats,
    upcomingBookings,
    recentActivities,
    loading: loading || bookingLoading || astrologyLoading,
    error,
    refreshData,
  };
};

// Components
const StatCard: React.FC<{
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  gradient: string;
}> = ({ title, value, change, icon, gradient }) => (
  <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-white/80">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className="text-xs text-white/70 mt-2">{change}</p>
      </div>
      <div className="flex-shrink-0 ml-4 opacity-80">
        {icon}
      </div>
    </div>
    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full transform rotate-12"></div>
    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
  </div>
);

const StatsGrid: React.FC<{ stats: DashboardStats; loading?: boolean }> = ({ stats, loading = false }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: loading ? '...' : stats.totalBookings,
      change: loading ? '...' : `+${stats.monthlyBookings} this month`,
      icon: <CalendarIcon className="w-10 h-10" />,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Upcoming Pujas',
      value: loading ? '...' : stats.upcomingPujas,
      change: 'Scheduled services',
      icon: <PujaIcon className="w-10 h-10" />,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Consultations',
      value: loading ? '...' : stats.astrologyConsultations,
      change: 'Astrology sessions',
      icon: <AstrologyIcon className="w-10 h-10" />,
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'Total Spent',
      value: loading ? '...' : formatCurrency(stats.totalSpent),
      change: loading ? '...' : `+${formatCurrency(stats.monthlySpent)} this month`,
      icon: <PaymentIcon className="w-10 h-10" />,
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          change={card.change}
          icon={card.icon}
          gradient={card.gradient}
        />
      ))}
    </div>
  );
};

const WelcomeHeader: React.FC<{
  user: any;
  onRefresh?: () => void;
  loading?: boolean;
}> = ({ user, onRefresh, loading = false }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.first_name) {
      return user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name;
    }
    return 'Devotee';
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {getGreeting()}, {getUserName()}! 🙏
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome to your spiritual journey dashboard
        </p>
      </div>
      
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 
            hover:bg-gray-50 transition-colors duration-200 text-sm font-medium
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          `}
        >
          <RefreshIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      )}
    </div>
  );
};

const UpcomingBookingCard: React.FC<{ booking: UpcomingBooking }> = ({ booking }) => {
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

const UpcomingBookings: React.FC<{ bookings: UpcomingBooking[]; loading?: boolean }> = ({ bookings, loading = false }) => {
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

const QuickActionButton: React.FC<{ action: QuickAction }> = ({ action }) => (
  <Link href={action.href} className="block">
    <div className={`p-4 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {action.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm">{action.title}</h4>
          <p className="text-white/80 text-xs mt-1 line-clamp-2">{action.description}</p>
        </div>
      </div>
    </div>
  </Link>
);

const QuickActions: React.FC<{ loading?: boolean }> = ({ loading = false }) => {
  const quickActions: QuickAction[] = [
    {
      title: 'Book a Puja',
      description: 'Schedule your spiritual ceremonies',
      icon: <PujaIcon className="w-6 h-6" />,
      href: '/puja-services',
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Astrology Consultation',
      description: 'Get guidance from expert astrologers',
      icon: <AstrologyIcon className="w-6 h-6" />,
      href: '/astrology-services',
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'View Calendar',
      description: 'Check your upcoming appointments',
      icon: <CalendarIcon className="w-6 h-6" />,
      href: '/user/bookings',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Booking History',
      description: 'Review your past services',
      icon: <HistoryIcon className="w-6 h-6" />,
      href: '/user/bookings?tab=history',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Temple Services',
      description: 'Explore temple-based pujas',
      icon: <TempleIcon className="w-6 h-6" />,
      href: '/puja-services?type=TEMPLE',
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Contact Support',
      description: 'Get help with your bookings',
      icon: <ContactIcon className="w-6 h-6" />,
      href: '/contact',
      color: 'gray',
      gradient: 'from-gray-500 to-slate-500',
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse mb-6">
          <div className="h-6 bg-gray-200 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <QuickActionButton key={index} action={action} />
        ))}
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{
  progress: number;
  total: number;
  color: string;
  label: string;
}> = ({ progress, total, color, label }) => {
  const percentage = total > 0 ? Math.min((progress / total) * 100, 100) : 0;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">
          {progress}/{total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right mt-1">
        <span className="text-xs text-gray-500">{Math.round(percentage)}% Complete</span>
      </div>
    </div>
  );
};

const SpiritualProgress: React.FC<{ stats: DashboardStats; loading?: boolean }> = ({ stats, loading = false }) => {
  const calculateProgress = () => {
    const targetBookingsPerYear = 12;
    const targetConsultationsPerYear = 6;
    const targetMonthlyBookings = 2;
    
    const progressItems: ProgressItem[] = [
      {
        title: 'Yearly Spiritual Journey',
        description: 'Pujas and ceremonies completed this year',
        progress: stats.totalBookings,
        total: targetBookingsPerYear,
        color: 'from-orange-500 to-red-500',
      },
      {
        title: 'Astrological Guidance',
        description: 'Consultations taken for spiritual growth',
        progress: stats.astrologyConsultations,
        total: targetConsultationsPerYear,
        color: 'from-purple-500 to-indigo-500',
      },
      {
        title: 'Monthly Devotion',
        description: 'Regular spiritual practice this month',
        progress: stats.monthlyBookings,
        total: targetMonthlyBookings,
        color: 'from-green-500 to-emerald-500',
      },
    ];

    return progressItems;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 w-40 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 w-32 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 w-full rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const progressItems = calculateProgress();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUpIcon className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Spiritual Progress</h3>
      </div>

      <div className="space-y-4">
        {progressItems.map((item, index) => (
          <div key={index}>
            <ProgressBar
              progress={item.progress}
              total={item.total}
              color={item.color}
              label={item.title}
            />
            <p className="text-xs text-gray-500 mb-4">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            You&apos;re on a beautiful spiritual journey! 🙏
          </p>
          <p className="text-xs text-gray-500">
            Continue your path with regular pujas and consultations
          </p>
        </div>
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{ activity: RecentActivity }> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'booking':
        return <CalendarIcon className="w-5 h-5 text-orange-500" />;
      case 'payment':
        return <PaymentIcon className="w-5 h-5 text-green-500" />;
      case 'consultation':
        return <AstrologyIcon className="w-5 h-5 text-purple-500" />;
      case 'completion':
        return <CompletionIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <DefaultIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return '';
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600';
      case 'PENDING':
        return 'text-yellow-600';
      case 'COMPLETED':
        return 'text-blue-600';
      case 'CANCELLED':
      case 'FAILED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <div className="flex-shrink-0 mt-0.5">
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
            {activity.title}
          </h4>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
            {formatTimestamp(activity.timestamp)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {activity.description}
        </p>
        {activity.status && (
          <span className={`text-xs font-medium mt-1 inline-block ${getStatusColor(activity.status)}`}>
            Status: {activity.status}
          </span>
        )}
      </div>
    </div>
  );
};

const RecentActivities: React.FC<{ activities: RecentActivity[]; loading?: boolean }> = ({ activities, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse mb-6">
          <div className="h-6 bg-gray-200 w-32 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 w-3/4 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-2">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <DefaultIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent activities</p>
            <p className="text-gray-400 text-xs mt-1">
              Your recent actions will appear here
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Stay updated with your spiritual journey progress
          </p>
        </div>
      )}
    </div>
  );
};

const DashboardError: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
      <ErrorOutlineIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {error || 'We encountered an error while loading your dashboard. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
        >
          <RefreshIcon className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

// Main Dashboard Component
const UserDashboard = () => {
  const { user } = useAuthStore();
  const {
    stats,
    upcomingBookings,
    recentActivities,
    loading,
    error,
    refreshData,
  } = useDashboardData();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <WelcomeHeader user={user} />
          <DashboardError error={error} onRetry={refreshData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <WelcomeHeader user={user} onRefresh={refreshData} loading={loading} />

        {/* Stats Grid */}
        <StatsGrid stats={stats} loading={loading} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Bookings */}
            <UpcomingBookings bookings={upcomingBookings} loading={loading} />
            
            {/* Quick Actions */}
            <QuickActions loading={loading} />
          </div>

          {/* Right Column - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Spiritual Progress */}
            <SpiritualProgress stats={stats} loading={loading} />
            
            {/* Recent Activities */}
            <RecentActivities activities={recentActivities} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
