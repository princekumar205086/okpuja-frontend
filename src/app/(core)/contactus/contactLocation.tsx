"use client";
import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaSatellite, FaStreetView } from "react-icons/fa";

const LocationMap = () => {
  const [mapType, setMapType] = useState("roadmap");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleMapLoad = () => {
    setIsLoaded(true);
  };

  const handleMapError = () => {
    setError("Failed to load the map. Please check your internet connection and try again.");
  };

  const toggleMapType = (type: string) => {
    setMapType(type);
  };

  return (
    <section className="max-w-full mx-auto p-3 md:p-6 bg-orange-500 rounded-lg shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-cream flex items-center">
        <FaMapMarkerAlt className="mr-2 text-cream" />
        Our Location
      </h2>
      
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-inner">
        <div className="relative overflow-hidden rounded-lg">
          {!isLoaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <p className="text-red-500 text-center p-4">{error}</p>
            </div>
          )}
          
          <iframe
            title="OKPUJA Location"
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14369.238922855546!2d87.48947373349961!3d25.79335390729325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eff853106a9d3f%3A0xa869de0557562fd4!2sRambagh%2C%20Purnia%2C%20Bihar!5e0!3m2!1sen!2sin!4v1727535356695!5m2!1sen!2sin=${mapType}`}
            width="100%" 
            height={isMobile ? "300" : "450"}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            onLoad={handleMapLoad}
            onError={handleMapError}
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      </div>
      
      <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-2 md:gap-4">
        <button
          onClick={() => toggleMapType("roadmap")}
          className={`flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:text-base ${
            mapType === "roadmap" ? "bg-cream text-orange-500 font-medium" : "bg-white/80 text-gray-700"
          } transition-colors duration-300 hover:shadow-md`}
          aria-label="Show road map view"
        >
          <FaMapMarkerAlt className="mr-1.5 md:mr-2" /> Road Map
        </button>
        
        <button
          onClick={() => toggleMapType("satellite")}
          className={`flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:text-base ${
            mapType === "satellite" ? "bg-cream text-orange-500 font-medium" : "bg-white/80 text-gray-700"
          } transition-colors duration-300 hover:shadow-md`}
          aria-label="Show satellite view"
        >
          <FaSatellite className="mr-1.5 md:mr-2" /> Satellite
        </button>
        
        <button
          onClick={() => toggleMapType("streetview")}
          className={`flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:text-base ${
            mapType === "streetview" ? "bg-cream text-orange-500 font-medium" : "bg-white/80 text-gray-700"
          } transition-colors duration-300 hover:shadow-md`}
          aria-label="Show street view"
        >
          <FaStreetView className="mr-1.5 md:mr-2" /> Street View
        </button>
      </div>
      
      <div className="mt-4 text-sm text-cream/90 text-center px-2">
        <p>Visit us at: Rambagh, Purnia, Bihar, India</p>
      </div>
    </section>
  );
};

export default LocationMap;