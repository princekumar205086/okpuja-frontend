import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const EmptyBookingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-6">
        <div className="relative w-32 h-32">
          <Image
            src="/image/astrology-empty.png"
            alt="No bookings"
            fill
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-service.jpg';
            }}
          />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        You haven't made any astrology bookings yet. Explore our astrology services and book a consultation with our experts.
      </p>
      <Link 
        href="/astrology"
        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium transition-colors"
      >
        Browse Astrology Services
      </Link>
    </div>
  );
};

export default EmptyBookingState;
