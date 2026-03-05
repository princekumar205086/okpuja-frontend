/**
 * OKPUJA - Robots.txt Auto-Generation
 * Next.js Metadata Route: /robots.txt
 * 
 * Configuration:
 * - Allow all crawlers for main content
 * - Block admin, payment, and user authentication routes
 * - Specific rules for Googlebot
 */

import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo/seoConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/puja',
          '/puja/',
          '/pujaservice',
          '/astrology',
          '/blog',
          '/about',
          '/contactus',
          '/gallery',
          '/career',
          '/events',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/checkout/',
          '/cart/',
          '/payment-debug/',
          '/payment-pending/',
          '/test-payment/',
          '/test-payment-new/',
          '/login/',
          '/register/',
          '/forgot-password/',
          '/reset-password/',
          '/verify-email/',
          '/verify-otp/',
          '/user/',
          '/employee/',
          '/confirmbooking/',
          '/failedbooking/',
          '/astro-booking-failed/',
          '/astro-booking-success/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/puja',
          '/puja/',
          '/pujaservice',
          '/astrology',
          '/blog',
        ],
        disallow: ['/api/', '/admin/', '/user/', '/checkout/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/user/'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
