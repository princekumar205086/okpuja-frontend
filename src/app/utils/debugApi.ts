// Debug utility to test API endpoints
import { eventsAPI } from '../apiService/eventsApi';

export const debugAPI = {
  async testConnection() {
    console.group('🔧 API Debug Test');
    
    try {
      console.log('📡 Testing events API connection...');
      
      // Test basic events fetch
      const eventsResponse = await eventsAPI.getEvents({ page_size: 5 });
      console.log('✅ Events API Response:', eventsResponse);
      
      // Test upcoming events
      const upcomingEvents = await eventsAPI.getUpcomingEvents(3);
      console.log('✅ Upcoming Events:', upcomingEvents);
      
      // Test featured events
      const featuredEvents = await eventsAPI.getFeaturedEvents(3);
      console.log('✅ Featured Events:', featuredEvents);
      
      console.log('🎉 API connection test completed successfully!');
      return {
        success: true,
        eventsCount: eventsResponse.count,
        upcomingCount: upcomingEvents.length,
        featuredCount: featuredEvents.length
      };
      
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      return {
        success: false,
        error: error
      };
    } finally {
      console.groupEnd();
    }
  },

  async testSpecificEndpoint(endpoint: string) {
    console.log(`🔍 Testing specific endpoint: ${endpoint}`);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log('✅ Endpoint response:', data);
      return data;
    } catch (error) {
      console.error('❌ Endpoint test failed:', error);
      return null;
    }
  }
};

// Make it available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugAPI = debugAPI;
  console.log('🛠️ Debug API available globally as window.debugAPI');
}
