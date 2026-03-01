/**
 * OKPUJA - Robots.txt Auto-Generation
 * Next.js Metadata Route: /robots.txt
 */

import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo/seoConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
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
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
