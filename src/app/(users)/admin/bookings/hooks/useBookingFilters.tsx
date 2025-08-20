import { useCallback } from 'react';

interface FilterState {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  serviceType: string;
}

export const useBookingFilters = (
  activeTab: string,
  filters: FilterState,
  astrologyBookings: any[],
  regularBookings: any[],
  pujaBookings: any[],
  fetchAstrologyBookings: (filters: FilterState) => Promise<void>,
  fetchRegularBookings: (filters: FilterState) => Promise<void>,
  fetchPujaBookings: (filters: FilterState) => Promise<void>,
  fetchAllBookings: () => Promise<void>
) => {
  const getCurrentData = useCallback(() => {
    switch (activeTab) {
      case 'astrology':
        return astrologyBookings || [];
      case 'puja':
        return [...(pujaBookings || []), ...(regularBookings || [])].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return [
          ...(astrologyBookings?.map(b => ({ ...b, type: 'astrology' })) || []),
          ...(regularBookings?.map(b => ({ ...b, type: 'puja' })) || []),
          ...(pujaBookings?.map(b => ({ ...b, type: 'puja' })) || []),
        ];
    }
  }, [activeTab, astrologyBookings, regularBookings, pujaBookings]);

  const handleRefreshData = useCallback(async () => {
    try {
      switch (activeTab) {
        case 'astrology':
          await fetchAstrologyBookings(filters);
          break;
        case 'puja':
          await fetchPujaBookings(filters);
          await fetchRegularBookings(filters);
          break;
        default:
          await fetchAllBookings();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [activeTab, filters, fetchAstrologyBookings, fetchRegularBookings, fetchPujaBookings, fetchAllBookings]);

  return {
    getCurrentData,
    handleRefreshData,
  };
};
