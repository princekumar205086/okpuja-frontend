/**
 * OKPUJA - Robots.txt Auto-Generation
 * Next.js Metadata Route: /robots.txt
 * 
 * Blocks all API, admin, auth, payment, and internal routes.
 * Allows all public content routes.
 * Includes rules for backend API subdomain (api.okpuja.com).
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
          '/pujaservice/',
          '/astrology',
          '/astrology/',
          '/blog',
          '/blog/',
          '/about',
          '/contactus',
          '/gallery',
          '/career',
          '/events',
          '/privacy-policy',
          '/terms-of-service',
          '/cancellation-refund-policy',
        ],
        disallow: [
          '/api/',
          '/api/*',
          '/admin/',
          '/admin/*',
          '/redoc/',
          '/swagger/',
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
          '/dashboard/',
          '/confirmbooking/',
          '/failedbooking/',
          '/astro-booking-failed/',
          '/astro-booking-success/',
          '/*?format=api',
          '/*?format=json',
          '/*?lang=*',
          '/singlepuja',
          '/singlepuja/',
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
          '/astrology/',
          '/blog',
          '/blog/',
          '/about',
          '/contactus',
          '/gallery',
        ],
        disallow: [
          '/api/',
          '/api/*',
          '/admin/',
          '/admin/*',
          '/redoc/',
          '/swagger/',
          '/user/',
          '/employee/',
          '/dashboard/',
          '/checkout/',
          '/cart/',
          '/login/',
          '/register/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/api/*',
          '/admin/',
          '/admin/*',
          '/redoc/',
          '/swagger/',
          '/user/',
          '/dashboard/',
        ],
      },
    ],
    sitemap: [
      `${SITE_CONFIG.url}/sitemap.xml`,
    ],
    host: SITE_CONFIG.url,
  };
}
