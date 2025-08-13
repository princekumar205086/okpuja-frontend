import { useState, useEffect, useCallback } from 'react';
import { useBookingStore } from '@/app/stores/bookingStore';
import { useAstrologyBookingStore } from '@/app/stores/astrologyBookingStore';
import { DashboardStats, UpcomingBooking, RecentActivity } from './types';

export const useDashboardData = () => {
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
