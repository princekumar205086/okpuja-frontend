/**
 * OKPUJA - Automated SEO Validation Tests
 * Verifies: canonical URLs, schema validity, no port URLs, valid review schema
 * 
 * Run: npx tsx test/seo-validation.test.ts
 */

import {
  buildOrganizationSchema,
  buildLocalBusinessSchema,
  buildWebSiteSchema,
  buildServiceSchema,
  buildProductSchema,
  buildFAQSchema,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildGlobalSchemas,
  buildPujaPageSchemas,
  buildPujaCitySchemas,
  buildCityPageSchemas,
} from '../src/lib/seo/schema';
import { buildProductSchemaFromService } from '../src/lib/seo/schema';
import { SITE_CONFIG } from '../src/lib/seo/seoConfig';
import { buildCanonicalUrl } from '../src/lib/seo/metadata';

// ============================================================
// HELPERS
// ============================================================
let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

function assertNoDevUrls(obj: unknown, context: string) {
  const str = JSON.stringify(obj);
  const devPatterns = [':3000', ':8000', ':5173', ':4200', 'localhost', '127.0.0.1'];
  for (const pattern of devPatterns) {
    assert(!str.includes(pattern), `${context}: No "${pattern}" found`);
  }
}

function assertValidSchemaType(schema: Record<string, unknown>, expectedType: string, context: string) {
  assert(schema['@context'] === 'https://schema.org', `${context}: @context is schema.org`);
  assert(schema['@type'] === expectedType, `${context}: @type is "${expectedType}"`);
}

// Google-supported parent types for Review/AggregateRating rich results
const GOOGLE_REVIEW_SUPPORTED_TYPES = [
  'Book', 'Course', 'CreativeWorkSeason', 'Episode', 'Event', 'Game',
  'HowTo', 'LocalBusiness', 'MediaObject', 'Movie', 'MusicPlaylist',
  'MusicRecording', 'Organization', 'Product', 'Recipe', 'SoftwareApplication',
];

function assertReviewOnValidParent(schema: Record<string, unknown>, context: string) {
  if (schema['aggregateRating'] || schema['review']) {
    const type = schema['@type'] as string;
    assert(
      GOOGLE_REVIEW_SUPPORTED_TYPES.includes(type),
      `${context}: aggregateRating/review on supported type "${type}" (not Service/WebPage)`
    );
  }
}

// ============================================================
// TEST SUITES
// ============================================================

console.log('\n========================================');
console.log('OKPUJA SEO VALIDATION TESTS');
console.log('========================================\n');

// --- Test 1: SITE_CONFIG ---
console.log('📋 Test Suite: SITE_CONFIG');
assert(SITE_CONFIG.url === 'https://okpuja.com', 'Production URL is HTTPS without port');
assert(!SITE_CONFIG.url.includes(':3000'), 'No :3000 in site URL');
assert(!SITE_CONFIG.url.includes('www.'), 'No www prefix (canonical is non-www)');
assert(SITE_CONFIG.url.startsWith('https://'), 'URL uses HTTPS');

// --- Test 2: Canonical URL Builder ---
console.log('\n📋 Test Suite: Canonical URLs');
assert(buildCanonicalUrl('/puja') === 'https://okpuja.com/puja', 'Canonical URL for /puja');
assert(buildCanonicalUrl('/puja/ganesh-puja') === 'https://okpuja.com/puja/ganesh-puja', 'Canonical URL for puja page');
assert(buildCanonicalUrl('') === 'https://okpuja.com/', 'Canonical URL for homepage');
assert(!buildCanonicalUrl('/puja').includes(':3000'), 'No port in canonical URL');
assert(buildCanonicalUrl('/puja').startsWith('https://'), 'Canonical uses HTTPS');

// --- Test 3: Organization Schema ---
console.log('\n📋 Test Suite: Organization Schema');
const orgSchema = buildOrganizationSchema();
assertValidSchemaType(orgSchema, 'Organization', 'Organization');
assert(!!orgSchema.name, 'Organization has name');
assert(!!orgSchema.url, 'Organization has url');
assert(!!orgSchema.logo, 'Organization has logo');
assert(!!orgSchema.contactPoint, 'Organization has contactPoint');
assertNoDevUrls(orgSchema, 'Organization');

// --- Test 4: LocalBusiness Schema ---
console.log('\n📋 Test Suite: LocalBusiness Schema');
const localBiz = buildLocalBusinessSchema();
assertValidSchemaType(localBiz as Record<string, unknown>, 'LocalBusiness', 'LocalBusiness');
assert(!(localBiz as Record<string, unknown>)['aggregateRating'], 'LocalBusiness: No aggregateRating by default (prevents duplicates)');
assertNoDevUrls(localBiz, 'LocalBusiness');

const localBizWithRating = buildLocalBusinessSchema(undefined, true);
assert(!!(localBizWithRating as Record<string, unknown>)['aggregateRating'], 'LocalBusiness with rating: Has aggregateRating when requested');
assertReviewOnValidParent(localBizWithRating as Record<string, unknown>, 'LocalBusiness with rating');

// --- Test 5: WebSite Schema ---
console.log('\n📋 Test Suite: WebSite Schema');
const websiteSchema = buildWebSiteSchema();
assertValidSchemaType(websiteSchema, 'WebSite', 'WebSite');
assert(!!websiteSchema.potentialAction, 'WebSite has SearchAction');
assertNoDevUrls(websiteSchema, 'WebSite');

// --- Test 6: Service Schema (NO aggregateRating) ---
console.log('\n📋 Test Suite: Service Schema');
const serviceSchema = buildServiceSchema({
  name: 'Test Puja',
  description: 'Test description',
  url: 'https://okpuja.com/puja/test',
  rating: { value: 4.8, count: 100 },
});
assertValidSchemaType(serviceSchema as Record<string, unknown>, 'Service', 'Service');
assert(!(serviceSchema as Record<string, unknown>)['aggregateRating'], 'Service: NO aggregateRating (Google rejects it on Service type)');
assertNoDevUrls(serviceSchema, 'Service');

// --- Test 7: Product Schema from Service (WITH aggregateRating) ---
console.log('\n📋 Test Suite: ProductSchemaFromService');
const productFromService = buildProductSchemaFromService({
  name: 'Navratri Puja',
  description: 'Book Navratri Puja online',
  url: 'https://okpuja.com/puja/navratri-puja',
  price: '2100',
  rating: { value: 4.9, count: 124 },
});
assertValidSchemaType(productFromService as Record<string, unknown>, 'Product', 'ProductFromService');
assert(!!(productFromService as Record<string, unknown>)['aggregateRating'], 'ProductFromService: Has aggregateRating');
assert(!!(productFromService as Record<string, unknown>)['review'], 'ProductFromService: Has review');
assertReviewOnValidParent(productFromService as Record<string, unknown>, 'ProductFromService');
const aggRating = (productFromService as Record<string, unknown>)['aggregateRating'] as Record<string, string>;
assert(aggRating['@type'] === 'AggregateRating', 'AggregateRating has correct @type');
assert(aggRating['ratingValue'] === '4.9', 'AggregateRating has correct ratingValue');
assert(aggRating['reviewCount'] === '124', 'AggregateRating has correct reviewCount');
const review = (productFromService as Record<string, unknown>)['review'] as Record<string, unknown>;
assert(review['@type'] === 'Review', 'Review has correct @type');
assert(!!(review['author'] as Record<string, unknown>)['@type'], 'Review author has @type');
assert(!!(review['reviewRating'] as Record<string, unknown>)['@type'], 'Review reviewRating has @type');
assertNoDevUrls(productFromService, 'ProductFromService');

// --- Test 8: Product Schema ---
console.log('\n📋 Test Suite: Product Schema');
const productSchema = buildProductSchema({
  name: 'Satyanarayan Puja Package',
  description: 'Complete puja package',
  url: 'https://okpuja.com/puja/satyanarayan-puja',
  price: '3100',
  rating: { value: 4.8, count: 500 },
});
assertValidSchemaType(productSchema, 'Product', 'Product');
assert(!!productSchema.aggregateRating, 'Product has aggregateRating');
assertReviewOnValidParent(productSchema, 'Product');
assertNoDevUrls(productSchema, 'Product');

// --- Test 9: FAQ Schema ---
console.log('\n📋 Test Suite: FAQ Schema');
const faqSchema = buildFAQSchema([
  { question: 'How to book?', answer: 'Visit okpuja.com' },
  { question: 'What is the cost?', answer: 'Starting from ₹1100' },
]);
assertValidSchemaType(faqSchema, 'FAQPage', 'FAQ');
assert(Array.isArray(faqSchema.mainEntity), 'FAQ has mainEntity array');
assert(faqSchema.mainEntity.length === 2, 'FAQ has 2 questions');
assertNoDevUrls(faqSchema, 'FAQ');

// --- Test 10: Breadcrumb Schema ---
console.log('\n📋 Test Suite: Breadcrumb Schema');
const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Puja', url: '/puja' },
  { name: 'Ganesh Puja', url: '/puja/ganesh-puja' },
]);
assertValidSchemaType(breadcrumbSchema, 'BreadcrumbList', 'Breadcrumb');
assert(breadcrumbSchema.itemListElement.length === 3, 'Breadcrumb has 3 items');
assert(breadcrumbSchema.itemListElement[0].position === 1, 'First breadcrumb position is 1');
assertNoDevUrls(breadcrumbSchema, 'Breadcrumb');

// --- Test 11: Global Schemas ---
console.log('\n📋 Test Suite: Global Schemas (Root Layout)');
const globalSchemas = buildGlobalSchemas();
assert(Array.isArray(globalSchemas), 'Global schemas is array');
assert(globalSchemas.length === 3, 'Global schemas has 3 items (Org, LocalBiz, WebSite)');
const globalTypes = globalSchemas.map((s: Record<string, unknown>) => s['@type']);
assert(globalTypes.includes('Organization'), 'Global includes Organization');
assert(globalTypes.includes('LocalBusiness'), 'Global includes LocalBusiness');
assert(globalTypes.includes('WebSite'), 'Global includes WebSite');
// Ensure no aggregateRating in global schemas (prevents parent_node error)
for (const schema of globalSchemas) {
  assert(
    !(schema as Record<string, unknown>)['aggregateRating'],
    `Global ${(schema as Record<string, unknown>)['@type']}: No aggregateRating in global schema`
  );
}
assertNoDevUrls(globalSchemas, 'Global schemas');

// --- Test 12: Puja Page Schemas ---
console.log('\n📋 Test Suite: Puja Page Schemas');
const pujaSchemas = buildPujaPageSchemas(
  {
    name: 'Ganesh Puja',
    description: 'Book Ganesh Puja',
    url: 'https://okpuja.com/puja/ganesh-puja',
    rating: { value: 4.8, count: 2500 },
  },
  [
    { name: 'Home', url: '/' },
    { name: 'Puja', url: '/puja' },
    { name: 'Ganesh Puja', url: '/puja/ganesh-puja' },
  ],
  [{ question: 'Q?', answer: 'A' }],
);
assert(Array.isArray(pujaSchemas), 'Puja schemas is array');
// The main schema should be Product (not Service) since rating is provided
const mainPujaSchema = pujaSchemas[0] as Record<string, unknown>;
assert(mainPujaSchema['@type'] === 'Product', 'Puja page main schema is Product (supports Review rich results)');
assert(!!mainPujaSchema['aggregateRating'], 'Puja page has aggregateRating on Product');
assertReviewOnValidParent(mainPujaSchema, 'Puja page main schema');
assertNoDevUrls(pujaSchemas, 'Puja page schemas');

// --- Test 13: Puja+City Combo Schemas ---
console.log('\n📋 Test Suite: Puja+City Combo Schemas');
const comboSchemas = buildPujaCitySchemas(
  'Ganesh Puja', 'ganesh-puja', 'Delhi', 'delhi', 'Delhi', [{ question: 'Q?', answer: 'A' }]
);
const mainComboSchema = comboSchemas[0] as Record<string, unknown>;
assert(mainComboSchema['@type'] === 'Product', 'Combo page main schema is Product');
assert(!!mainComboSchema['aggregateRating'], 'Combo page has aggregateRating');
assertReviewOnValidParent(mainComboSchema, 'Combo page main schema');
assertNoDevUrls(comboSchemas, 'Combo page schemas');

// --- Test 14: City Page Schemas ---
console.log('\n📋 Test Suite: City Page Schemas');
const citySchemas = buildCityPageSchemas(
  'Purnia', 'Bihar',
  [{ name: 'Home', url: '/' }, { name: 'Puja', url: '/puja' }, { name: 'Purnia', url: '/puja/purnia' }],
  [{ question: 'Q?', answer: 'A' }]
);
// City pages use Service type WITHOUT rating - should not have aggregateRating
for (const schema of citySchemas) {
  const s = schema as Record<string, unknown>;
  if (s['@type'] === 'Service') {
    assert(!s['aggregateRating'], 'City Service schema: No aggregateRating');
  }
}
assertNoDevUrls(citySchemas, 'City page schemas');

// --- Test 15: No Development URLs in Any Schema ---
console.log('\n📋 Test Suite: Development URL Sweep');
const allSchemas = [
  ...buildGlobalSchemas(),
  ...buildPujaPageSchemas(
    { name: 'Test', description: 'Test', url: 'https://okpuja.com/puja/test', rating: { value: 4.5, count: 100 } },
    [{ name: 'Home', url: '/' }],
    [{ question: 'Q', answer: 'A' }]
  ),
  ...buildPujaCitySchemas('Test', 'test', 'Delhi', 'delhi', 'Delhi', [{ question: 'Q', answer: 'A' }]),
];
const allStr = JSON.stringify(allSchemas);
assert(!allStr.includes(':3000'), 'No :3000 in any schema');
assert(!allStr.includes(':8000'), 'No :8000 in any schema');
assert(!allStr.includes('localhost'), 'No localhost in any schema');
assert(!allStr.includes('127.0.0.1'), 'No 127.0.0.1 in any schema');
assert(!allStr.includes('http://'), 'No http:// URLs in schemas (all HTTPS)');

// ============================================================
// RESULTS
// ============================================================
console.log('\n========================================');
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}
