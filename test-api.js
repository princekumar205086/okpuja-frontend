// Simple test script to verify API integration
import { astrologyApiService } from '../src/app/(core)/astrology/apiService';

async function testAstrologyAPI() {
  try {
    console.log('Testing Astrology API...');
    
    // Test fetching all services
    const services = await astrologyApiService.fetchServices();
    console.log(`Successfully fetched ${services.length} services`);
    
    if (services.length > 0) {
      console.log('First service:', {
        id: services[0].id,
        title: services[0].title,
        service_type: services[0].service_type,
        price: services[0].price
      });
      
      // Test fetching a single service
      try {
        const singleService = await astrologyApiService.fetchServiceById(services[0].id);
        console.log('Successfully fetched single service:', singleService.title);
      } catch (error) {
        console.error('Error fetching single service:', error);
      }
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Only run if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  testAstrologyAPI();
}

export { testAstrologyAPI };
