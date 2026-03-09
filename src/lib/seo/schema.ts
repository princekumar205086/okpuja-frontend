/**
 * OKPUJA - Structured Data / JSON-LD Schema Builders
 * Enterprise-grade structured data for Google rich results
 */

import { SITE_CONFIG } from './seoConfig';

// ============================================================
// TYPES
// ============================================================
export type SchemaType =
  | 'Organization'
  | 'LocalBusiness'
  | 'Service'
  | 'Product'
  | 'FAQPage'
  | 'BreadcrumbList'
  | 'WebSite'
  | 'WebPage'
  | 'Article'
  | 'HowTo'
  | 'Event'
  | 'Person'
  | 'Review'
  | 'AggregateRating';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceSchemaOptions {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string;
  priceRange?: string;
  category?: string;
  areaServed?: string | string[];
  rating?: { value: number; count: number };
}

export interface ProductSchemaOptions {
  name: string;
  description: string;
  url: string;
  image?: string;
  price: string;
  currency?: string;
  availability?: string;
  rating?: { value: number; count: number };
  brand?: string;
}

export interface ArticleSchemaOptions {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

export interface EventSchemaOptions {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url: string;
  image?: string;
  price?: string;
}

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

// ============================================================
// SCHEMA BUILDERS
// ============================================================

/**
 * Organization Schema - Site-wide
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.business.name,
    legalName: SITE_CONFIG.business.legalName,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.business.description,
    foundingDate: SITE_CONFIG.business.foundingDate,
    email: SITE_CONFIG.business.email,
    telephone: SITE_CONFIG.business.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.business.address.streetAddress,
      addressLocality: SITE_CONFIG.business.address.addressLocality,
      addressRegion: SITE_CONFIG.business.address.addressRegion,
      postalCode: SITE_CONFIG.business.address.postalCode,
      addressCountry: SITE_CONFIG.business.address.addressCountry,
    },
    sameAs: Object.values(SITE_CONFIG.social),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.business.telephone,
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
    ],
  };
}

/**
 * LocalBusiness Schema - For local SEO dominance
 * 
 * IMPORTANT: aggregateRating is NOT included here to prevent Google's
 * "Review has multiple aggregate ratings" error. Keep aggregateRating
 * only in Service/Product schemas - ONE per page.
 * 
 * @param cityOverride - Optional city override for city-specific pages
 * @param includeRating - Whether to include aggregateRating (default: false)
 */
export function buildLocalBusinessSchema(
  cityOverride?: {
    name: string;
    state?: string;
    postalCode?: string;
  },
  includeRating: boolean = false
) {
  const address = cityOverride
    ? {
        '@type': 'PostalAddress',
        addressLocality: cityOverride.name,
        addressRegion: cityOverride.state || SITE_CONFIG.business.address.addressRegion,
        postalCode: cityOverride.postalCode || '',
        addressCountry: 'IN',
      }
    : {
        '@type': 'PostalAddress',
        streetAddress: SITE_CONFIG.business.address.streetAddress,
        addressLocality: SITE_CONFIG.business.address.addressLocality,
        addressRegion: SITE_CONFIG.business.address.addressRegion,
        postalCode: SITE_CONFIG.business.address.postalCode,
        addressCountry: SITE_CONFIG.business.address.addressCountry,
      };

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_CONFIG.url}/#localbusiness`,
    name: SITE_CONFIG.business.name,
    description: SITE_CONFIG.business.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    image: `${SITE_CONFIG.url}/og-default.jpg`,
    telephone: SITE_CONFIG.business.telephone,
    email: SITE_CONFIG.business.email,
    address,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_CONFIG.business.geo.latitude,
      longitude: SITE_CONFIG.business.geo.longitude,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '06:00',
      closes: '22:00',
    },
    priceRange: SITE_CONFIG.business.priceRange,
    paymentAccepted: SITE_CONFIG.business.paymentAccepted.join(', '),
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: SITE_CONFIG.business.geo.latitude,
        longitude: SITE_CONFIG.business.geo.longitude,
      },
      geoRadius: '2000',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Puja & Astrology Services',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Puja Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Satyanarayan Puja' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Griha Pravesh Puja' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ganesh Puja' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Lakshmi Puja' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Havan' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Astrology Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Kundli Matching' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Horoscope Reading' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Vastu Consultation' } },
          ],
        },
      ],
    },
  };

  // Only add aggregateRating if explicitly requested (to prevent duplicates)
  if (includeRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '2500',
      bestRating: '5',
      worstRating: '1',
    };
  }

  return schema;
}

/**
 * WebSite Schema with SearchAction - For sitelinks search box
 */
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.business.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-IN',
  };
}

/**
 * Service Schema - For individual puja/astrology services
 */
export function buildServiceSchema(options: ServiceSchemaOptions) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: options.name,
    description: options.description,
    url: options.url,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.business.name,
      url: SITE_CONFIG.url,
    },
    areaServed: options.areaServed || {
      '@type': 'Country',
      name: 'India',
    },
    serviceType: options.category || 'Puja Service',
  };

  if (options.image) {
    schema.image = options.image;
  }

  if (options.price || options.priceRange) {
    schema.offers = {
      '@type': 'Offer',
      price: options.price,
      priceCurrency: 'INR',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'INR',
        price: options.price,
      },
      availability: 'https://schema.org/InStock',
    };
  }

  if (options.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: options.rating.value.toString(),
      reviewCount: options.rating.count.toString(),
      bestRating: '5',
      worstRating: '1',
    };
  }

  return schema;
}

/**
 * Product Schema - For puja packages/products
 */
export function buildProductSchema(options: ProductSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: options.name,
    description: options.description,
    url: options.url,
    image: options.image || `${SITE_CONFIG.url}/og-default.jpg`,
    brand: {
      '@type': 'Brand',
      name: options.brand || SITE_CONFIG.name,
    },
    offers: {
      '@type': 'Offer',
      price: options.price,
      priceCurrency: options.currency || 'INR',
      availability: options.availability || 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.business.name,
      },
    },
    ...(options.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: options.rating.value.toString(),
        reviewCount: options.rating.count.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };
}

/**
 * FAQ Schema - For rich FAQ snippets
 */
export function buildFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

/**
 * Breadcrumb Schema - For breadcrumb rich results
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

/**
 * Article Schema - For blog posts
 */
export function buildArticleSchema(options: ArticleSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.title,
    description: options.description,
    url: options.url,
    image: options.image || `${SITE_CONFIG.url}/og-default.jpg`,
    datePublished: options.publishedTime,
    dateModified: options.modifiedTime || options.publishedTime,
    author: {
      '@type': 'Person',
      name: options.author || 'OKPUJA Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.business.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': options.url,
    },
    articleSection: options.section || 'Spirituality & Puja',
    inLanguage: 'en-IN',
  };
}

/**
 * HowTo Schema - For puja procedure pages
 */
export function buildHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[],
  totalTime?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  };
}

/**
 * Event Schema - For upcoming puja events
 */
export function buildEventSchema(options: EventSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: options.name,
    description: options.description,
    startDate: options.startDate,
    ...(options.endDate && { endDate: options.endDate }),
    url: options.url,
    image: options.image || `${SITE_CONFIG.url}/og-default.jpg`,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    organizer: {
      '@type': 'Organization',
      name: SITE_CONFIG.business.name,
      url: SITE_CONFIG.url,
    },
    location: {
      '@type': 'VirtualLocation',
      url: options.url,
    },
    ...(options.price && {
      offers: {
        '@type': 'Offer',
        price: options.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: options.url,
      },
    }),
  };
}

// ============================================================
// COMPOSITE SCHEMAS
// ============================================================

/**
 * Build all global schemas (for root layout)
 */
export function buildGlobalSchemas() {
  return [
    buildOrganizationSchema(),
    buildLocalBusinessSchema(),
    buildWebSiteSchema(),
  ];
}

/**
 * Build city page schemas
 * NOTE: LocalBusiness is NOT included here as it's already in the global layout.
 * Including it here would cause duplicate entities which Google penalizes.
 */
export function buildCityPageSchemas(
  cityName: string,
  cityState: string,
  breadcrumbs: BreadcrumbItem[],
  faqs: FAQItem[]
) {
  return [
    // City-specific Service schema (not LocalBusiness to avoid duplicates)
    buildCityServiceAreaSchema(cityName, cityState),
    buildBreadcrumbSchema(breadcrumbs),
    buildFAQSchema(faqs),
  ];
}

/**
 * Build city-specific ServiceArea schema
 * This provides location context without duplicating LocalBusiness
 */
export function buildCityServiceAreaSchema(cityName: string, cityState: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Puja & Astrology Services in ${cityName}`,
    description: `Book verified pandits for puja, havan, and astrology services in ${cityName}, ${cityState}. OKPUJA offers trusted puja services with complete samagri.`,
    url: `${SITE_CONFIG.url}/puja/${cityName.toLowerCase().replace(/\s+/g, '-')}`,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.business.name,
      url: SITE_CONFIG.url,
    },
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: {
        '@type': 'State',
        name: cityState,
        containedInPlace: {
          '@type': 'Country',
          name: 'India',
        },
      },
    },
    serviceType: 'Religious Services',
    category: 'Puja Services',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${SITE_CONFIG.url}/puja/${cityName.toLowerCase().replace(/\s+/g, '-')}`,
      servicePhone: SITE_CONFIG.business.telephone,
    },
  };
}

/**
 * Build puja page schemas
 */
export function buildPujaPageSchemas(
  service: ServiceSchemaOptions,
  breadcrumbs: BreadcrumbItem[],
  faqs: FAQItem[],
  howToSteps?: HowToStep[]
) {
  const schemas = [
    buildServiceSchema(service),
    buildBreadcrumbSchema(breadcrumbs),
    buildFAQSchema(faqs),
  ];
  
  if (howToSteps && howToSteps.length > 0) {
    schemas.push(
      buildHowToSchema(
        `How to perform ${service.name}`,
        `Step by step guide to ${service.name}`,
        howToSteps
      )
    );
  }

  return schemas;
}

/**
 * Build puja + city combo page schemas
 */
export function buildPujaCitySchemas(
  pujaName: string,
  pujaSlug: string,
  cityName: string,
  citySlug: string,
  state: string,
  faqs: FAQItem[]
) {
  return [
    buildServiceSchema({
      name: `${pujaName} in ${cityName}`,
      description: `Book verified pandit for ${pujaName} in ${cityName}, ${state}. Authentic Vedic rituals with complete samagri at your doorstep.`,
      url: `${SITE_CONFIG.url}/puja/${pujaSlug}/${citySlug}`,
      category: 'Puja Service',
      areaServed: cityName,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Puja Services', url: '/puja' },
      { name: pujaName, url: `/puja/${pujaSlug}` },
      { name: `${pujaName} in ${cityName}`, url: `/puja/${pujaSlug}/${citySlug}` },
    ]),
    buildFAQSchema(faqs),
  ];
}

// ============================================================
// JSON-LD SERIALIZER
// ============================================================

/**
 * Serialize schema(s) to JSON-LD script tag content
 */
export function serializeSchemas(schemas: unknown | unknown[]): string {
  if (Array.isArray(schemas)) {
    return schemas.map((s) => JSON.stringify(s)).join('\n');
  }
  return JSON.stringify(schemas);
}
