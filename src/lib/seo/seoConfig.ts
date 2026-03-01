/**
 * OKPUJA - Enterprise SEO Configuration
 * Central configuration for all SEO settings across the platform
 */

export const SITE_CONFIG = {
  name: 'OKPUJA',
  tagline: 'Book Pandit Online | Puja & Astrology Services',
  url: 'https://okpuja.com',
  defaultImage: 'https://okpuja.com/og-default.jpg',
  locale: 'en_IN',
  language: 'en',
  country: 'IN',
  currency: 'INR',
  twitterHandle: '@okpuja',
  facebookAppId: '',
  gtmId: '',
  
  // Business Details
  business: {
    name: 'OKPUJA',
    legalName: 'OKPUJA Pvt Ltd',
    type: 'Hindu Puja & Astrology Booking Marketplace',
    description: 'India\'s trusted platform for booking verified pandits, puja services, havan, and astrology consultations online.',
    foundingDate: '2024',
    email: 'contact@okpuja.com',
    telephone: '+91-XXXXXXXXXX',
    priceRange: '₹500 - ₹50,000',
    openingHours: 'Mo-Su 06:00-22:00',
    paymentAccepted: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'PhonePe', 'Google Pay'],
    
    // Primary Location
    address: {
      streetAddress: 'Ram Ratan Ji Nagar, Rambagh',
      addressLocality: 'Purnia',
      addressRegion: 'Bihar',
      postalCode: '854301',
      addressCountry: 'IN',
    },
    
    geo: {
      latitude: 25.7771,
      longitude: 87.4753,
    },
    
    // Service area
    areaServed: 'India',
    serviceArea: {
      type: 'Country',
      name: 'India',
    },
  },
  
  // Social Profiles
  social: {
    facebook: 'https://facebook.com/okpuja',
    instagram: 'https://instagram.com/okpuja',
    twitter: 'https://twitter.com/okpuja',
    youtube: 'https://youtube.com/@okpuja',
    linkedin: 'https://linkedin.com/company/okpuja',
  },
} as const;

/**
 * Default meta robots configuration
 */
export const DEFAULT_ROBOTS = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large' as const,
    'max-snippet': -1,
  },
};

/**
 * Sitemap priority configuration by route type
 */
export const SITEMAP_PRIORITIES: Record<string, number> = {
  home: 1.0,
  city: 0.9,
  puja: 0.8,
  astrology: 0.8,
  blog: 0.7,
  about: 0.6,
  contact: 0.6,
  gallery: 0.5,
  policy: 0.3,
};

/**
 * Sitemap change frequency by route type
 */
export const SITEMAP_FREQUENCIES: Record<string, 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'> = {
  home: 'daily',
  city: 'weekly',
  puja: 'weekly',
  astrology: 'weekly',
  blog: 'weekly',
  about: 'monthly',
  contact: 'monthly',
  gallery: 'monthly',
  policy: 'yearly',
};
