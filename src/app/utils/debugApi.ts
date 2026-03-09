// Debug utility to test API endpoints
import { eventsAPI } from '../apiService/eventsApi';

export const debugAPI = {
  async testConnection() {
    console.group('🔧 API Debug Test');
    
    try {
      // Test basic events fetch
      const eventsResponse = await eventsAPI.getEvents({ page_size: 5 });
      // Test upcoming events
      const upcomingEvents = await eventsAPI.getUpcomingEvents(3);
      // Test featured events
      const featuredEvents = await eventsAPI.getFeaturedEvents(3);
      return {
        success: true,
        eventsCount: eventsResponse.count,
        upcomingCount: upcomingEvents.length,
        featuredCount: featuredEvents.length
      };
      
    } catch (error) {
      return {
        success: false,
        error: error
      };
    } finally {
      console.groupEnd();
    }
  },

  async testSpecificEndpoint(endpoint: string) {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  }
};

// Make it available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugAPI = debugAPI;
}
