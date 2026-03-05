/**
 * OKPUJA - SEO Library Index
 * Central export point for all SEO utilities
 */

// Configuration
export { SITE_CONFIG, DEFAULT_ROBOTS, SITEMAP_PRIORITIES, SITEMAP_FREQUENCIES } from './seoConfig';

// Keywords
export {
  INDIA_CITIES,
  PUJA_SERVICES,
  ASTROLOGY_SERVICES,
  KEYWORD_TEMPLATES,
  generateServiceCityKeywords,
  generateServiceKeywords,
  generateCityKeywords,
  getNearMeKeywords,
  getGeneralKeywords,
  getAstrologyKeywords,
  getFestivalKeywords,
  getLongTailKeywords,
  buildKeywordsForPage,
  getTotalKeywordCount,
} from './keywords';
export type { CityData, PujaData } from './keywords';

// Metadata
export {
  generateSEOMetadata,
  getHomeMetadata,
  getPujaListMetadata,
  getAstrologyMetadata,
  getSinglePujaMetadata,
  getCityPageMetadata,
  getBlogPostMetadata,
  getBlogListMetadata,
  getAboutMetadata,
  getContactMetadata,
  getGalleryMetadata,
  buildCanonicalUrl,
  buildOGImageUrl,
  buildCityAlternates,
} from './metadata';
export type { SEOMetadataOptions } from './metadata';

// Schema / JSON-LD
export {
  buildOrganizationSchema,
  buildLocalBusinessSchema,
  buildWebSiteSchema,
  buildServiceSchema,
  buildProductSchema,
  buildFAQSchema,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildHowToSchema,
  buildEventSchema,
  buildGlobalSchemas,
  buildCityPageSchemas,
  buildCityServiceAreaSchema,
  buildPujaPageSchemas,
  serializeSchemas,
} from './schema';
export type {
  SchemaType,
  BreadcrumbItem,
  FAQItem,
  ServiceSchemaOptions,
  ProductSchemaOptions,
  ArticleSchemaOptions,
  EventSchemaOptions,
  HowToStep,
} from './schema';

// City SEO Data
export { 
  CITY_SEO_DATA, 
  getCityFAQs, 
  getCityPujaContent, 
  getCityBySlug,
  getCitiesByState,
  getCitiesByTier,
  getAllCitySlugs,
  getCityKeywords,
  getCityPageTitles,
  // Bihar-specific exports
  BIHAR_PRIORITY_CITIES,
  getBiharCityData,
  isBiharPriorityCity,
  getBiharCityFAQs,
} from './cityData';
export type { BiharCityData, CityContent, CityFAQ } from './cityData';
