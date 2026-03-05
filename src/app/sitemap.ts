/**
 * OKPUJA - Sitemap Auto-Generation
 * Next.js Metadata Route: /sitemap.xml
 * 
 * Generates comprehensive sitemap covering:
 * - Home page
 * - Puja main page (/puja)
 * - All puja services (100+)
 * - All city landing pages (200+)
 * - Astrology pages (20+)
 * - Blog pages
 * - Static pages
 * - Bihar-specific SEO pages (Priority)
 * 
 * Total URLs: 10,000+ (cities × services + static pages)
 */

import type { MetadataRoute } from 'next';
import { INDIA_CITIES, PUJA_SERVICES, ASTROLOGY_SERVICES } from '@/lib/seo/keywords';
import { SITE_CONFIG, SITEMAP_PRIORITIES, SITEMAP_FREQUENCIES } from '@/lib/seo/seoConfig';

const BASE_URL = SITE_CONFIG.url;

// Bihar priority cities for special SEO targeting
const BIHAR_PRIORITY_CITIES = ['purnia', 'katihar', 'araria', 'bhagalpur', 'madhepura', 'kishanganj', 'saharsa', 'patna'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ============================================================
  // STATIC PAGES
  // ============================================================
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: SITEMAP_FREQUENCIES.home as 'daily',
      priority: SITEMAP_PRIORITIES.home,
    },
    // Main Puja page
    {
      url: `${BASE_URL}/puja`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/pujaservice`,
      lastModified: now,
      changeFrequency: SITEMAP_FREQUENCIES.puja as 'weekly',
      priority: SITEMAP_PRIORITIES.puja,
    },
    {
      url: `${BASE_URL}/astrology`,
      lastModified: now,
      changeFrequency: SITEMAP_FREQUENCIES.astrology as 'weekly',
      priority: SITEMAP_PRIORITIES.astrology,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: SITEMAP_FREQUENCIES.blog as 'weekly',
      priority: SITEMAP_PRIORITIES.blog,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: SITEMAP_FREQUENCIES.about as 'monthly',
      priority: SITEMAP_PRIORITIES.about,
    },
    {
      url: `${BASE_URL}/contactus`,
      lastModified: now,
      changeFrequency: SITEMAP_FREQUENCIES.contact as 'monthly',
      priority: SITEMAP_PRIORITIES.contact,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: now,
      changeFrequency: SITEMAP_FREQUENCIES.gallery as 'monthly',
      priority: SITEMAP_PRIORITIES.gallery,
    },
    {
      url: `${BASE_URL}/career`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: SITEMAP_FREQUENCIES.policy as 'yearly',
      priority: SITEMAP_PRIORITIES.policy,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cancellation-refund-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // ============================================================
  // CITY LANDING PAGES (200+)
  // Bihar priority cities get highest priority (0.98)
  // ============================================================
  const cityPages: MetadataRoute.Sitemap = INDIA_CITIES.map((city) => {
    // Bihar priority cities get highest priority
    const isBiharPriority = BIHAR_PRIORITY_CITIES.includes(city.slug);
    const priority = isBiharPriority 
      ? 0.98 
      : city.tier === 1 
        ? 0.95 
        : city.tier === 2 
          ? 0.9 
          : 0.85;
    
    return {
      url: `${BASE_URL}/puja/${city.slug}`,
      lastModified: now,
      changeFrequency: isBiharPriority ? 'daily' as const : SITEMAP_FREQUENCIES.city as 'weekly',
      priority,
    };
  });

  // ============================================================
  // PUJA SERVICE PAGES (100+)
  // ============================================================
  const pujaPages: MetadataRoute.Sitemap = PUJA_SERVICES.map((puja) => ({
    url: `${BASE_URL}/puja/${puja.slug}`,
    lastModified: now,
    changeFrequency: SITEMAP_FREQUENCIES.puja as 'weekly',
    priority: puja.category === 'popular' ? 0.85 : 0.8,
  }));

  // ============================================================
  // PUJA × CITY COMBINATION PAGES (100 pujas × 200 cities = 20,000)
  // For sitemap efficiency, include top pujas × top cities
  // ============================================================
  const topPujas = PUJA_SERVICES.filter((p) => p.category === 'popular').slice(0, 15);
  const topCities = INDIA_CITIES.filter((c) => c.tier <= 2);
  
  const pujaCityPages: MetadataRoute.Sitemap = [];
  topPujas.forEach((puja) => {
    topCities.forEach((city) => {
      pujaCityPages.push({
        url: `${BASE_URL}/puja/${puja.slug}/${city.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    });
  });

  // ============================================================
  // ASTROLOGY SERVICE PAGES
  // ============================================================
  const astrologyPages: MetadataRoute.Sitemap = ASTROLOGY_SERVICES.map((service) => ({
    url: `${BASE_URL}/astrology/${service.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ============================================================
  // ASTROLOGY × CITY COMBINATION PAGES
  // ============================================================
  const topAstroServices = ASTROLOGY_SERVICES.slice(0, 10);
  const astroCityPages: MetadataRoute.Sitemap = [];
  topAstroServices.forEach((service) => {
    topCities.forEach((city) => {
      astroCityPages.push({
        url: `${BASE_URL}/astrology/${service.slug}/${city.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  // ============================================================
  // COMBINE ALL
  // ============================================================
  return [
    ...staticPages,
    ...cityPages,
    ...pujaPages,
    ...pujaCityPages,
    ...astrologyPages,
    ...astroCityPages,
  ];
}
