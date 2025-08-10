// Example: How to use UpcomingEventsCarousel in your home page or any other page

import UpcomingEventsCarousel from '../components/UpcomingEventsCarousel';

export default function HomePage() {
  return (
    <div>
      {/* Other home page content */}
      
      {/* Upcoming Events Section */}
      <UpcomingEventsCarousel 
        limit={8}           // Number of events to fetch (default: 6)
        showHeader={true}   // Show the section header (default: true)
        className="bg-gray-50" // Additional CSS classes
      />
      
      {/* More home page content */}
    </div>
  );
}

// Alternative usage with custom styling
export function HomePageAlternative() {
  return (
    <div>
      {/* Hero section */}
      
      {/* Custom wrapper for the carousel */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Don't Miss These Sacred Events
          </h2>
          
          {/* Carousel without header since we added our own */}
          <UpcomingEventsCarousel 
            limit={6}
            showHeader={false}
          />
        </div>
      </section>
      
      {/* Other sections */}
    </div>
  );
}
