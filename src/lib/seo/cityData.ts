/**
 * OKPUJA - City SEO Data & Content Generator
 * Auto-generates city-specific content, FAQs, and keywords
 * for local SEO dominance across 200+ Indian cities
 */

import { INDIA_CITIES, PUJA_SERVICES, type CityData } from './keywords';

// ============================================================
// CITY CONTENT TEMPLATES
// ============================================================

export interface CityContent {
  intro: string;
  description: string;
  whyChoose: string[];
  popularPujas: string[];
  nearMePhrases: string[];
}

export interface CityFAQ {
  question: string;
  answer: string;
}

/**
 * Generate intro content for a city page
 */
export function getCityPujaContent(cityName: string, state: string): CityContent {
  const popularPujas = PUJA_SERVICES.filter((p) => p.category === 'popular')
    .slice(0, 10)
    .map((p) => p.name);

  return {
    intro: `Looking for trusted puja services in ${cityName}, ${state}? OKPUJA is your one-stop platform to book verified pandits for all types of Hindu puja, havan, and astrology consultations in ${cityName}. Whether it's a Satyanarayan Puja, Griha Pravesh, Navagraha Shanti, or any festival puja — we connect you with experienced and certified pandits right in ${cityName}.`,

    description: `OKPUJA offers 100+ puja services in ${cityName}, ${state}. From daily worship to grand ceremonies, our verified pandits perform all rituals with proper Vedic vidhi. Book puja online in ${cityName} and get doorstep service with all samagri included. We serve ${cityName} and surrounding areas with same-day and advance booking options.`,

    whyChoose: [
      `Verified & experienced pandits in ${cityName}`,
      `100+ puja services available at your doorstep`,
      `All puja samagri included in the package`,
      `Transparent pricing with no hidden charges`,
      `Online booking with instant confirmation`,
      `Available for home, office, and temple pujas`,
      `Muhurat consultation included free`,
      `Serving ${cityName}, ${state} and nearby areas`,
      `4.8★ rated service with 2500+ happy customers`,
      `Same-day booking available in ${cityName}`,
    ],

    popularPujas,

    nearMePhrases: [
      `puja near me in ${cityName}`,
      `pandit near me ${cityName}`,
      `best pandit near ${cityName}`,
      `havan near me ${cityName}`,
      `puja service near me ${cityName}`,
      `book pandit near ${cityName}`,
      `astrologer near me ${cityName}`,
      `local pandit ${cityName}`,
      `trusted pandit ${cityName}`,
    ],
  };
}

/**
 * Generate FAQ content for a city page
 */
export function getCityFAQs(cityName: string, state: string): CityFAQ[] {
  return [
    {
      question: `How to book a pandit in ${cityName}?`,
      answer: `You can book a verified pandit in ${cityName} through OKPUJA in 3 simple steps: 1) Select your desired puja service, 2) Choose a convenient date and time, 3) Confirm your booking. Our pandit will arrive at your doorstep in ${cityName} with all required samagri.`,
    },
    {
      question: `What puja services are available in ${cityName}?`,
      answer: `OKPUJA offers 100+ puja services in ${cityName}, ${state} including Satyanarayan Puja, Griha Pravesh Puja, Ganesh Puja, Lakshmi Puja, Navgraha Shanti, Havan, Mundan, Wedding Puja, and many more. All services come with verified pandits and complete samagri.`,
    },
    {
      question: `How much does a pandit charge in ${cityName}?`,
      answer: `Pandit charges in ${cityName} vary by puja type. On OKPUJA, prices start from ₹500 and go up to ₹50,000 depending on the puja. All prices are transparent with no hidden charges. Samagri is included in most packages.`,
    },
    {
      question: `Can I book online puja from ${cityName}?`,
      answer: `Yes! OKPUJA offers both at-home pandit booking in ${cityName} and online/live puja services. You can watch the puja live via video call or book a pandit to visit your home in ${cityName}.`,
    },
    {
      question: `Is puja samagri included in ${cityName} bookings?`,
      answer: `Yes, most puja bookings on OKPUJA in ${cityName} include all necessary samagri (puja materials). Our pandits bring everything needed for the ritual. You can also add extra samagri items during booking.`,
    },
    {
      question: `Do you provide astrology consultation in ${cityName}?`,
      answer: `Yes, OKPUJA provides online astrology consultation services accessible from ${cityName}. Services include Kundli making, Kundli matching, Horoscope reading, Vastu consultation, Muhurat consultation, and more.`,
    },
    {
      question: `What is the best puja service in ${cityName}?`,
      answer: `OKPUJA is rated 4.8★ by 2500+ customers and is one of the most trusted puja services in ${cityName}, ${state}. We offer verified pandits, transparent pricing, complete samagri, and doorstep service across ${cityName}.`,
    },
    {
      question: `Can I book same-day puja in ${cityName}?`,
      answer: `Yes, OKPUJA offers same-day puja booking in ${cityName} for most services, subject to pandit availability. For best results, we recommend booking at least 24 hours in advance.`,
    },
    {
      question: `Are your pandits verified in ${cityName}?`,
      answer: `All pandits on OKPUJA, including those serving ${cityName}, are thoroughly verified. We check their Vedic education, experience, background, and customer reviews before onboarding them to our platform.`,
    },
    {
      question: `Do you serve areas near ${cityName}?`,
      answer: `Yes, OKPUJA serves ${cityName} and all nearby areas in ${state}. Our pandits travel to your location within ${cityName} and surrounding towns for doorstep puja services.`,
    },
  ];
}

/**
 * Generate SEO-optimized city page title variations
 */
export function getCityPageTitles(cityName: string): string[] {
  return [
    `Book Pandit in ${cityName} | Puja Services in ${cityName} | OKPUJA`,
    `Puja Service in ${cityName} | Book Verified Pandit Online | OKPUJA`,
    `Best Pandit in ${cityName} | Havan & Puja Booking | OKPUJA`,
    `${cityName} Puja Services | Book Pandit Online | OKPUJA`,
  ];
}

/**
 * Generate city-specific keywords
 */
export function getCityKeywords(cityName: string, state: string): string[] {
  const keywords = [
    `puja service in ${cityName.toLowerCase()}`,
    `pandit in ${cityName.toLowerCase()}`,
    `best pandit in ${cityName.toLowerCase()}`,
    `book pandit ${cityName.toLowerCase()}`,
    `havan in ${cityName.toLowerCase()}`,
    `astrologer ${cityName.toLowerCase()}`,
    `puja near me ${cityName.toLowerCase()}`,
    `pandit near me ${cityName.toLowerCase()}`,
    `puja booking ${cityName.toLowerCase()}`,
    `online puja ${cityName.toLowerCase()}`,
    `${cityName.toLowerCase()} puja service`,
    `${cityName.toLowerCase()} pandit`,
    `${cityName.toLowerCase()} havan`,
    `puja at home ${cityName.toLowerCase()}`,
    `vedic pandit ${cityName.toLowerCase()}`,
    `trusted pandit ${cityName.toLowerCase()}`,
    `verified pandit ${cityName.toLowerCase()}`,
    `pandit for puja ${cityName.toLowerCase()}`,
    `puja service ${state.toLowerCase()}`,
    `okpuja ${cityName.toLowerCase()}`,
    `pooja service ${cityName.toLowerCase()}`,
    `pooja pandit ${cityName.toLowerCase()}`,
    `hindu pandit ${cityName.toLowerCase()}`,
    `brahmin pandit ${cityName.toLowerCase()}`,
    `puja seva ${cityName.toLowerCase()}`,
  ];

  // Add puja-specific city keywords
  const topPujas = PUJA_SERVICES.filter((p) => p.category === 'popular').slice(0, 5);
  topPujas.forEach((puja) => {
    keywords.push(`${puja.name.toLowerCase()} in ${cityName.toLowerCase()}`);
    keywords.push(`${puja.name.toLowerCase()} ${cityName.toLowerCase()}`);
  });

  return keywords;
}

/**
 * Pre-generated city SEO data for top cities
 * Used for static generation and sitemap
 */
export const CITY_SEO_DATA = INDIA_CITIES.map((city) => ({
  ...city,
  title: `Book Pandit in ${city.name} | Puja Services in ${city.name} | OKPUJA`,
  description: `Book verified pandits for puja, havan and rituals in ${city.name}, ${city.state}. 100+ puja services available. Trusted astrology & puja services near you. OKPUJA ${city.name}.`,
  keywords: getCityKeywords(city.name, city.state),
  url: `/puja/${city.slug}`,
}));

/**
 * Get all city slugs for static generation
 */
export function getAllCitySlugs(): string[] {
  return INDIA_CITIES.map((city) => city.slug);
}

/**
 * Find city data by slug
 */
export function getCityBySlug(slug: string): CityData | undefined {
  return INDIA_CITIES.find((city) => city.slug === slug);
}

/**
 * Get cities by state
 */
export function getCitiesByState(state: string): CityData[] {
  return INDIA_CITIES.filter((city) => city.state === state);
}

/**
 * Get cities by tier
 */
export function getCitiesByTier(tier: number): CityData[] {
  return INDIA_CITIES.filter((city) => city.tier === tier);
}

// ============================================================
// BIHAR SPECIAL SEO DATA
// Enhanced content for primary target market: Purnia, Katihar, Araria, etc.
// ============================================================

export interface BiharCityData {
  slug: string;
  name: string;
  postalCode: string;
  landmarks: string[];
  nearbyAreas: string[];
  specialContent: string;
  localKeywords: string[];
  coordinates: { lat: number; lng: number };
}

export const BIHAR_PRIORITY_CITIES: BiharCityData[] = [
  {
    slug: 'purnia',
    name: 'Purnia',
    postalCode: '854301',
    landmarks: ['Purnia Junction', 'Gulabbagh', 'Bhatta Bazar', 'Ram Ratan Ji Nagar', 'Rambagh', 'Line Bazar'],
    nearbyAreas: ['Kasba', 'Banmankhi', 'Dagarua', 'Baisi', 'Dhamdaha', 'Rupauli'],
    specialContent: 'OKPUJA is headquartered in Purnia, Bihar 854301, making it the most trusted puja service provider in the region. Our pandits have deep roots in the local community and understand the traditional Mithila puja vidhi preferred in this region.',
    localKeywords: [
      'pandit in purnia bihar',
      'puja service purnia 854301',
      'best pandit purnia',
      'havan booking purnia',
      'satyanarayan puja purnia',
      'griha pravesh puja purnia',
      'pandit near me purnia',
      'puja booking purnia bihar',
      'verified pandit purnia',
      'astrologer in purnia',
      'kundli making purnia',
      'mundan ceremony purnia',
      'wedding pandit purnia',
      'puja service purnia city',
      'okpuja purnia',
      'home puja purnia',
      'office puja purnia',
      'pandit ji purnia',
      'brahmin pandit purnia',
      'vedic pandit purnia bihar',
    ],
    coordinates: { lat: 25.7771, lng: 87.4753 },
  },
  {
    slug: 'katihar',
    name: 'Katihar',
    postalCode: '854105',
    landmarks: ['Katihar Junction', 'Barsoi', 'Manihari', 'Kadwa'],
    nearbyAreas: ['Barsoi', 'Manihari', 'Kadwa', 'Azamnagar', 'Pranpur', 'Barari'],
    specialContent: 'Book trusted pandits for puja services in Katihar, Bihar. OKPUJA serves Katihar district with experienced local pandits who perform all rituals according to traditional Bihar customs.',
    localKeywords: [
      'pandit in katihar',
      'puja service katihar',
      'best pandit katihar bihar',
      'havan booking katihar',
      'astrologer katihar',
      'puja near me katihar',
      'pandit ji katihar',
      'wedding pandit katihar',
      'mundan katihar',
      'griha pravesh katihar',
    ],
    coordinates: { lat: 25.5410, lng: 87.5680 },
  },
  {
    slug: 'araria',
    name: 'Araria',
    postalCode: '854311',
    landmarks: ['Araria Town', 'Forbesganj', 'Kursakatta', 'Jokihat'],
    nearbyAreas: ['Forbesganj', 'Kursakatta', 'Jokihat', 'Raniganj', 'Palasi', 'Narpatganj'],
    specialContent: 'Find verified pandits for puja services in Araria, Bihar. Our pandits serve all areas of Araria district including Forbesganj and nearby towns.',
    localKeywords: [
      'pandit in araria',
      'puja service araria bihar',
      'best pandit araria',
      'havan araria',
      'astrologer araria',
      'puja booking araria',
      'pandit forbesganj',
      'wedding pandit araria',
    ],
    coordinates: { lat: 26.1498, lng: 87.5140 },
  },
  {
    slug: 'bhagalpur',
    name: 'Bhagalpur',
    postalCode: '812001',
    landmarks: ['Bhagalpur Junction', 'Tilka Manjhi Chowk', 'Sabour', 'Nathnagar'],
    nearbyAreas: ['Sabour', 'Nathnagar', 'Kahalgaon', 'Sultanganj', 'Naugacchia', 'Goradih'],
    specialContent: 'Book experienced pandits for puja services in Bhagalpur, Bihar. Known as the Silk City, Bhagalpur has a rich tradition of Hindu rituals that our pandits expertly perform.',
    localKeywords: [
      'pandit in bhagalpur',
      'puja service bhagalpur',
      'best pandit bhagalpur bihar',
      'havan bhagalpur',
      'astrologer bhagalpur',
      'wedding pandit bhagalpur',
      'griha pravesh bhagalpur',
      'puja near me bhagalpur',
    ],
    coordinates: { lat: 25.2425, lng: 86.9842 },
  },
  {
    slug: 'madhepura',
    name: 'Madhepura',
    postalCode: '852113',
    landmarks: ['Madhepura Town', 'Singheshwar', 'Shankarpur', 'Bihariganj'],
    nearbyAreas: ['Singheshwar', 'Bihariganj', 'Murliganj', 'Alamnagar', 'Gamharia', 'Uda Kishunganj'],
    specialContent: 'Book pandits for puja in Madhepura, Bihar. Our services cover all of Madhepura district including the famous Singheshwar temple area.',
    localKeywords: [
      'pandit in madhepura',
      'puja service madhepura',
      'pandit near singheshwar',
      'havan madhepura',
      'astrologer madhepura',
      'wedding pandit madhepura',
    ],
    coordinates: { lat: 25.9221, lng: 86.7928 },
  },
  {
    slug: 'kishanganj',
    name: 'Kishanganj',
    postalCode: '855107',
    landmarks: ['Kishanganj Town', 'Bahadurganj', 'Thakurganj', 'Pothia'],
    nearbyAreas: ['Bahadurganj', 'Thakurganj', 'Pothia', 'Kochadhaman', 'Terhagachh', 'Dighalbank'],
    specialContent: 'Find trusted pandits for puja services in Kishanganj, Bihar. Located at the border of West Bengal and Nepal, our pandits serve the diverse community of Kishanganj.',
    localKeywords: [
      'pandit in kishanganj',
      'puja service kishanganj',
      'best pandit kishanganj bihar',
      'havan kishanganj',
      'astrologer kishanganj',
      'wedding pandit kishanganj',
      'puja booking kishanganj',
    ],
    coordinates: { lat: 26.0922, lng: 87.9466 },
  },
  {
    slug: 'saharsa',
    name: 'Saharsa',
    postalCode: '852201',
    landmarks: ['Saharsa Town', 'Simri Bakhtiarpur', 'Salkhua', 'Mahishi'],
    nearbyAreas: ['Simri Bakhtiarpur', 'Salkhua', 'Mahishi', 'Nauhatta', 'Sattar Katiya', 'Bangaon'],
    specialContent: 'Book verified pandits for puja services in Saharsa, Bihar. Our experienced pandits serve all areas of Saharsa district with authentic Vedic rituals.',
    localKeywords: [
      'pandit in saharsa',
      'puja service saharsa',
      'best pandit saharsa bihar',
      'havan saharsa',
      'astrologer saharsa',
      'wedding pandit saharsa',
      'griha pravesh saharsa',
    ],
    coordinates: { lat: 25.8748, lng: 86.5964 },
  },
];

/**
 * Get Bihar priority city data by slug
 */
export function getBiharCityData(slug: string): BiharCityData | undefined {
  return BIHAR_PRIORITY_CITIES.find((city) => city.slug === slug);
}

/**
 * Check if a city slug is a Bihar priority city
 */
export function isBiharPriorityCity(slug: string): boolean {
  return BIHAR_PRIORITY_CITIES.some((city) => city.slug === slug);
}

/**
 * Get enhanced FAQs for Bihar priority cities
 */
export function getBiharCityFAQs(cityData: BiharCityData): CityFAQ[] {
  return [
    {
      question: `What is the best puja service in ${cityData.name}, Bihar?`,
      answer: `OKPUJA is the highest-rated puja service in ${cityData.name}, Bihar ${cityData.postalCode}. We are locally based and offer 100+ puja services with verified pandits. Our services cover ${cityData.nearbyAreas.join(', ')} and surrounding areas.`,
    },
    {
      question: `How to book a pandit in ${cityData.name} ${cityData.postalCode}?`,
      answer: `Book a pandit in ${cityData.name} easily through OKPUJA. Visit our website, select your puja type, choose your preferred date, and confirm. Our verified pandits will come to your location near ${cityData.landmarks.slice(0, 3).join(', ')} or anywhere in ${cityData.name}.`,
    },
    {
      question: `What areas does OKPUJA serve in ${cityData.name}?`,
      answer: `OKPUJA serves all areas of ${cityData.name} district including ${cityData.nearbyAreas.join(', ')} and surrounding villages. Our pandits can travel to your location for doorstep puja services.`,
    },
    {
      question: `Is same-day puja booking available in ${cityData.name}?`,
      answer: `Yes, same-day puja booking is available in ${cityData.name}, ${cityData.postalCode}, subject to pandit availability. For best service, we recommend booking 24 hours in advance.`,
    },
    {
      question: `What is the cost of puja services in ${cityData.name}?`,
      answer: `Puja prices in ${cityData.name} start from ₹500 and vary based on the type of puja. All prices on OKPUJA are transparent with no hidden charges. Samagri is included with most bookings.`,
    },
  ];
}

