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
