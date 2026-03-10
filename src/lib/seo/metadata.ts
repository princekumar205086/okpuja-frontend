/**
 * OKPUJA - Enterprise Metadata Builder
 * Dynamic metadata generation for all pages with full SEO optimization
 */

import type { Metadata } from 'next';
import { SITE_CONFIG, DEFAULT_ROBOTS } from './seoConfig';
import { buildKeywordsForPage } from './keywords';

// ============================================================
// TYPES
// ============================================================
export interface SEOMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  city?: string;
  service?: string;
  category?: 'puja' | 'astrology' | 'festival' | 'vastu' | 'havan' | 'general';
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  additionalKeywords?: string[];
}

// ============================================================
// METADATA BUILDER
// ============================================================

/**
 * Generate enterprise-grade SEO metadata for any page
 * Handles title, description, keywords, OG, Twitter, canonical, robots
 */
export function generateSEOMetadata(options: SEOMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords: customKeywords,
    path = '',
    city,
    service,
    category = 'general',
    image,
    imageAlt,
    noindex = false,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    additionalKeywords = [],
  } = options;

  // Build full title with brand
  const fullTitle = title.includes('OKPUJA') ? title : `${title} | OKPUJA`;
  
  // Build canonical URL
  const canonical = buildCanonicalUrl(path);
  
  // Build keywords
  const keywords = customKeywords || buildKeywordsForPage({
    service,
    city,
    category,
    additionalKeywords,
  });
  
  // Build OG image URL
  const ogImage = image || buildOGImageUrl({ title, city, service });
  
  // Build description with local SEO signals
  const seoDescription = city
    ? `${description} Trusted puja services in ${city}. Book verified pandits on OKPUJA.`
    : description;

  const metadata: Metadata = {
    title: fullTitle,
    description: seoDescription,
    keywords: keywords.join(', '),
    
    // Canonical — single canonical, no fake language alternates
    alternates: {
      canonical,
    },
    
    // Robots
    robots: noindex
      ? { index: false, follow: false }
      : DEFAULT_ROBOTS,
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description: seoDescription,
      url: canonical,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: type as 'website' | 'article',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt || fullTitle,
          type: 'image/png',
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
      }),
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: seoDescription,
      images: [ogImage],
      creator: SITE_CONFIG.twitterHandle,
      site: SITE_CONFIG.twitterHandle,
    },
    
    // Additional meta
    other: {
      'geo.region': 'IN-BR',
      'geo.placename': city || 'Purnia',
      'geo.position': `${SITE_CONFIG.business.geo.latitude};${SITE_CONFIG.business.geo.longitude}`,
      'ICBM': `${SITE_CONFIG.business.geo.latitude}, ${SITE_CONFIG.business.geo.longitude}`,
      'revisit-after': '3 days',
      'rating': 'general',
      'distribution': 'global',
      'language': 'English',
      'content-language': 'en-IN',
      'audience': 'all',
      'coverage': 'India',
      'target': 'all',
    },
    
    // Verification (add your IDs)
    verification: {
      google: 'your-google-verification-id',
      // yandex: '',
      // yahoo: '',
    },
    
    // App metadata
    applicationName: SITE_CONFIG.name,
    referrer: 'origin-when-cross-origin',
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    category: 'Religion, Spirituality, Astrology',
    
    // Icons
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    
    // Manifest
    manifest: '/site.webmanifest',
  };

  return metadata;
}

// ============================================================
// PAGE-SPECIFIC METADATA GENERATORS
// ============================================================

/**
 * Home page metadata
 */
export function getHomeMetadata(): Metadata {
  return generateSEOMetadata({
    title: 'Book Pandit Online in India | Puja & Astrology Services',
    description:
      'Book verified pandits for puja, havan, and astrology consultation across India. Trusted puja services in Purnia Bihar 854301. 100+ puja services, 200+ cities.',
    path: '/',
    category: 'general',
    additionalKeywords: [
      'puja booking online',
      'book pandit online',
      'online puja service india',
      'puja near me',
      'pandit near me',
      'havan booking',
      'astrologer consultation',
      'puja service purnia',
      'pandit purnia',
      'best pandit india',
      'hindu puja booking',
      'verified pandit',
      'trusted puja service',
      'okpuja',
      'puja at home',
    ],
  });
}

/**
 * All Pujas listing page metadata
 */
export function getPujaListMetadata(): Metadata {
  return generateSEOMetadata({
    title: 'Book Puja Services Online in India | 100+ Pujas Available',
    description:
      'Browse and book 100+ puja services online. Satyanarayan Puja, Griha Pravesh, Havan, Navgraha Puja & more. Verified pandits across India. Book now on OKPUJA.',
    path: '/pujaservice',
    category: 'puja',
    additionalKeywords: [
      'all puja services',
      'puja list',
      'book puja online india',
      'puja seva',
      'hindu puja services',
      'complete puja list',
    ],
  });
}

/**
 * Astrology page metadata
 */
export function getAstrologyMetadata(): Metadata {
  return generateSEOMetadata({
    title: 'Online Astrology Consultation India | Talk to Astrologer',
    description:
      'Consult with experienced astrologers online. Kundli matching, horoscope reading, vastu consultation, numerology & more. Talk to verified astrologers on OKPUJA.',
    path: '/astrology',
    category: 'astrology',
    additionalKeywords: [
      'online astrology',
      'talk to astrologer',
      'kundli matching online',
      'horoscope reading',
      'vastu consultation',
      'jyotish consultation',
      'best astrologer india',
    ],
  });
}

/**
 * Single puja page metadata generator
 */
export function getSinglePujaMetadata(pujaName: string, pujaSlug: string): Metadata {
  return generateSEOMetadata({
    title: `${pujaName} Booking Online | Pandit for ${pujaName}`,
    description:
      `Book ${pujaName} online with verified pandits. Know ${pujaName} vidhi, samagri, cost, benefits & best muhurat. Trusted puja service across India by OKPUJA.`,
    path: `/puja/${pujaSlug}`,
    service: pujaName,
    category: 'puja',
    additionalKeywords: [
      `${pujaName.toLowerCase()} booking`,
      `${pujaName.toLowerCase()} at home`,
      `${pujaName.toLowerCase()} vidhi`,
      `${pujaName.toLowerCase()} cost`,
      `pandit for ${pujaName.toLowerCase()}`,
      `${pujaName.toLowerCase()} benefits`,
    ],
  });
}

/**
 * City landing page metadata generator
 */
export function getCityPageMetadata(cityName: string, citySlug: string, state?: string): Metadata {
  const stateStr = state ? `, ${state}` : '';
  return generateSEOMetadata({
    title: `Book Pandit in ${cityName} | Puja Services in ${cityName}`,
    description:
      `Book verified pandits for puja, havan and rituals in ${cityName}${stateStr}. 100+ puja services available. Trusted astrology & puja services near you. OKPUJA ${cityName}.`,
    path: `/puja/${citySlug}`,
    city: cityName,
    category: 'puja',
    additionalKeywords: [
      `puja service ${cityName.toLowerCase()}`,
      `pandit in ${cityName.toLowerCase()}`,
      `best pandit ${cityName.toLowerCase()}`,
      `havan in ${cityName.toLowerCase()}`,
      `astrologer ${cityName.toLowerCase()}`,
      `puja near me ${cityName.toLowerCase()}`,
      `book pandit ${cityName.toLowerCase()}`,
    ],
  });
}

/**
 * Blog post metadata generator
 */
export function getBlogPostMetadata(
  title: string,
  description: string,
  slug: string,
  publishedTime?: string,
  author?: string
): Metadata {
  return generateSEOMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    type: 'article',
    publishedTime,
    author,
    section: 'Spirituality & Puja',
    category: 'general',
  });
}

/**
 * Blog listing page metadata
 */
export function getBlogListMetadata(): Metadata {
  return generateSEOMetadata({
    title: 'Puja Guides, Astrology Tips & Spiritual Blog',
    description:
      'Read expert guides on puja vidhi, astrology tips, festival calendar, vastu shastra, and spiritual wellness. Learn from verified pandits and astrologers on OKPUJA.',
    path: '/blog',
    category: 'general',
    additionalKeywords: [
      'puja guide',
      'astrology blog',
      'puja vidhi',
      'festival guide',
      'spiritual blog',
      'hindu puja articles',
    ],
  });
}

/**
 * About page metadata
 */
export function getAboutMetadata(): Metadata {
  return generateSEOMetadata({
    title: 'About OKPUJA | India\'s Trusted Puja & Astrology Platform',
    description:
      'OKPUJA is India\'s leading platform for booking verified pandits for puja, havan, and astrology consultations. Based in Purnia, Bihar, serving all of India.',
    path: '/about',
    category: 'general',
  });
}

/**
 * Contact page metadata
 */
export function getContactMetadata(): Metadata {
  return generateSEOMetadata({
    title: 'Contact OKPUJA | Get Help with Puja Booking',
    description:
      'Contact OKPUJA for puja booking assistance, pandit enquiries, astrology consultation, and customer support. Located in Purnia, Bihar 854301.',
    path: '/contactus',
    category: 'general',
  });
}

/**
 * Gallery page metadata
 */
export function getGalleryMetadata(): Metadata {
  return generateSEOMetadata({
    title: 'Puja Gallery | Photos of Hindu Puja & Havan Ceremonies',
    description:
      'Browse photos and videos of puja ceremonies, havan rituals, and astrology sessions performed by verified pandits on OKPUJA.',
    path: '/gallery',
    category: 'general',
  });
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Build canonical URL from path
 * Always uses production HTTPS domain, strips ports and dev URLs
 */
export function buildCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Always use production URL - never include ports or dev domains
  const url = `${SITE_CONFIG.url}${cleanPath}`;
  return url.replace(/:\d{4,5}/, '');
}

/**
 * Build OG Image URL with dynamic parameters
 */
export function buildOGImageUrl(params: {
  title?: string;
  city?: string;
  service?: string;
}): string {
  const searchParams = new URLSearchParams();
  if (params.title) searchParams.set('title', params.title);
  if (params.city) searchParams.set('city', params.city);
  if (params.service) searchParams.set('service', params.service);
  
  return `${SITE_CONFIG.url}/api/og?${searchParams.toString()}`;
}

/**
 * Build alternates for city variations
 */
export function buildCityAlternates(
  basePath: string,
  cities: Array<{ slug: string; name: string }>
): Record<string, string> {
  const alternates: Record<string, string> = {};
  cities.forEach(({ slug }) => {
    alternates[slug] = `${SITE_CONFIG.url}${basePath}/${slug}`;
  });
  return alternates;
}

/**
 * Puja + City combo page metadata generator
 */
export function getPujaCityMetadata(
  pujaName: string,
  pujaSlug: string,
  cityName: string,
  citySlug: string,
  state?: string
): Metadata {
  const stateStr = state ? `, ${state}` : '';
  return generateSEOMetadata({
    title: `${pujaName} in ${cityName} | Book Pandit for ${pujaName} in ${cityName}`,
    description: `Book verified pandit for ${pujaName} in ${cityName}${stateStr}. Authentic ${pujaName} at your home with complete samagri. Trusted by 2500+ customers. Book on OKPUJA.`,
    path: `/puja/${pujaSlug}/${citySlug}`,
    city: cityName,
    service: pujaName,
    category: 'puja',
    additionalKeywords: [
      `${pujaName.toLowerCase()} in ${cityName.toLowerCase()}`,
      `pandit for ${pujaName.toLowerCase()} ${cityName.toLowerCase()}`,
      `${pujaName.toLowerCase()} booking ${cityName.toLowerCase()}`,
      `${pujaName.toLowerCase()} cost ${cityName.toLowerCase()}`,
      `${pujaName.toLowerCase()} at home ${cityName.toLowerCase()}`,
      `best pandit ${pujaName.toLowerCase()} ${cityName.toLowerCase()}`,
      `${pujaName.toLowerCase()} vidhi ${cityName.toLowerCase()}`,
      `book ${pujaName.toLowerCase()} ${cityName.toLowerCase()}`,
    ],
  });
}
