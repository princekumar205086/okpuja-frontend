/**
 * OKPUJA - Main Sitemap (Index)
 * Next.js Metadata Route: /sitemap.xml
 * 
 * Generates comprehensive sitemap covering all page types:
 * - Static pages (home, about, contact, policies)
 * - Puja service pages (100+)
 * - City landing pages (200+)
 * - Puja × City combos (top 15 pujas × top 50 cities = 750+)
 * - Astrology services (20+)
 * - Astrology × City combos
 * 
 * Total: 2600+ URLs
 */

import type { MetadataRoute } from 'next';
import { INDIA_CITIES, PUJA_SERVICES, ASTROLOGY_SERVICES } from '@/lib/seo/keywords';
import { SITE_CONFIG, SITEMAP_PRIORITIES, SITEMAP_FREQUENCIES } from '@/lib/seo/seoConfig';

const BASE_URL = SITE_CONFIG.url;

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
  // PUJA SERVICE PAGES (100+) - Individual puja landing pages
  // e.g., /puja/ganesh-puja, /puja/satyanarayan-puja
  // ============================================================
  const pujaPages: MetadataRoute.Sitemap = PUJA_SERVICES.map((puja) => ({
    url: `${BASE_URL}/puja/${puja.slug}`,
    lastModified: now,
    changeFrequency: SITEMAP_FREQUENCIES.puja as 'weekly',
    priority: puja.category === 'popular' ? 0.9 : 0.85,
  }));

  // ============================================================
  // CITY LANDING PAGES (200+) - City-specific puja pages
  // e.g., /puja/delhi, /puja/purnia
  // Bihar priority cities get highest priority (0.98)
  // ============================================================
  const cityPages: MetadataRoute.Sitemap = INDIA_CITIES.map((city) => {
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
  // PUJA × CITY COMBINATION PAGES (top pujas × top cities)
  // e.g., /puja/ganesh-puja/delhi, /puja/satyanarayan-puja/purnia
  // ============================================================
  const topPujas = PUJA_SERVICES.filter((p) => p.category === 'popular').slice(0, 15);
  const allCities = INDIA_CITIES;

  const pujaCityPages: MetadataRoute.Sitemap = [];
  topPujas.forEach((puja) => {
    allCities.forEach((city) => {
      const isBiharPriority = BIHAR_PRIORITY_CITIES.includes(city.slug);
      pujaCityPages.push({
        url: `${BASE_URL}/puja/${puja.slug}/${city.slug}`,
        lastModified: now,
        changeFrequency: isBiharPriority ? 'daily' as const : 'weekly',
        priority: isBiharPriority ? 0.88 : city.tier <= 1 ? 0.8 : 0.75,
      });
    });
  });

  // Also add non-popular pujas for Bihar priority cities
  const nonPopularPujas = PUJA_SERVICES.filter((p) => p.category !== 'popular');
  const biharCities = INDIA_CITIES.filter((c) => BIHAR_PRIORITY_CITIES.includes(c.slug));
  nonPopularPujas.forEach((puja) => {
    biharCities.forEach((city) => {
      pujaCityPages.push({
        url: `${BASE_URL}/puja/${puja.slug}/${city.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.78,
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
  const topCities = INDIA_CITIES.filter((c) => c.tier <= 2);
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
    ...pujaPages,
    ...cityPages,
    ...pujaCityPages,
    ...astrologyPages,
    ...astroCityPages,
  ];
}
