/**
 * OKPUJA - Puja Content Generator
 * Auto-generates rich SEO content for puja service pages and puja+city combo pages
 * Each page gets 800+ words of unique, locally-optimized content
 */

import { PUJA_SERVICES, INDIA_CITIES } from './keywords';

export type PujaService = (typeof PUJA_SERVICES)[number];
export type CityData = (typeof INDIA_CITIES)[number];

// ============================================================
// PUJA LOOKUP
// ============================================================

export function getPujaBySlug(slug: string): PujaService | undefined {
  return PUJA_SERVICES.find((p) => p.slug === slug);
}

export function getAllPujaSlugs(): string[] {
  return PUJA_SERVICES.map((p) => p.slug);
}

// ============================================================
// PUJA PAGE CONTENT (Individual Puja)
// ============================================================

export interface PujaPageContent {
  introduction: string;
  benefits: string[];
  procedure: string[];
  materials: string[];
  faq: Array<{ question: string; answer: string }>;
  whyBook: string[];
}

export function getPujaContent(pujaName: string, hindi: string): PujaPageContent {
  return {
    introduction: `${pujaName} (${hindi}) is one of the most sacred and widely performed Hindu rituals in India. This divine puja is performed to invoke blessings for prosperity, peace, and spiritual well-being. At OKPUJA, you can book a verified pandit for ${pujaName} at your home or preferred location across 200+ cities in India. Our experienced pandits perform the ${pujaName} with complete Vedic rituals, authentic mantras, and all required samagri (puja materials). Whether you are in Purnia, Patna, Delhi, Mumbai, or any other city, OKPUJA ensures a seamless and authentic ${pujaName} experience.`,

    benefits: [
      `Brings divine blessings and spiritual peace through ${pujaName}`,
      'Removes negative energies and obstacles from your life',
      'Promotes harmony, prosperity, and well-being in the family',
      'Fulfils wishes and resolves long-standing problems',
      'Strengthens devotion and connects you with the divine',
      `Performed by verified and experienced pandits specialized in ${pujaName}`,
      'Complete samagri (puja materials) included with the booking',
      'Authentic Vedic rituals with proper mantras and procedures',
      'Available at your home, office, or any location across India',
      'Flexible scheduling — choose your preferred date, time, and muhurat',
    ],

    procedure: [
      `Sankalp (संकल्प) — The pandit takes a sacred vow on your behalf, stating the purpose and intent of the ${pujaName}.`,
      `Ganesh Puja — Lord Ganesha is invoked first to remove all obstacles and ensure the smooth completion of ${pujaName}.`,
      `Kalash Sthapna (कलश स्थापना) — A sacred kalash is placed and consecrated as the seat of divine energy.`,
      `Main Puja Vidhi — The core rituals of ${pujaName} are performed with authentic mantras, offerings, and devotion.`,
      `Havan/Homam — A sacred fire offering is performed to amplify the blessings of ${pujaName}.`,
      `Aarti & Prasad — The puja concludes with aarti (devotional prayer) and distribution of sacred prasad.`,
    ],

    materials: [
      'Fresh flowers and garlands (maala)',
      'Fruits and sweets (mithai) for offering',
      'Incense sticks (agarbatti) and camphor (kapur)',
      'Ghee (clarified butter) and coconut',
      'Sindoor, kumkum, haldi (turmeric), and chandan (sandalwood)',
      'Sacred thread (moli/kalava)',
      'Betel leaves (paan) and betel nuts (supari)',
      'Rice (akshat) and other grains',
      'Puja kalash and other ritual items',
      'All samagri is included when you book through OKPUJA',
    ],

    faq: [
      {
        question: `What is ${pujaName} and why is it performed?`,
        answer: `${pujaName} (${hindi}) is a sacred Hindu ritual performed for divine blessings, prosperity, and peace. It is one of the most important pujas in Hindu tradition, performed on auspicious occasions, festivals, and during life events.`,
      },
      {
        question: `How can I book a pandit for ${pujaName} through OKPUJA?`,
        answer: `You can book a pandit for ${pujaName} on okpuja.com in 3 simple steps: 1) Select ${pujaName} from our services, 2) Choose your preferred date, time, and city, 3) Confirm your booking. A verified pandit will arrive at your location with all samagri.`,
      },
      {
        question: `What is the cost of ${pujaName}?`,
        answer: `The cost of ${pujaName} starts from ₹1,100 and varies based on the puja package, location, and whether samagri is included. OKPUJA offers transparent pricing with no hidden charges.`,
      },
      {
        question: `Is samagri included with ${pujaName} booking on OKPUJA?`,
        answer: `Yes, complete puja samagri is included with all ${pujaName} bookings on OKPUJA. Our pandits arrive with all necessary materials. You can also opt to arrange your own samagri.`,
      },
      {
        question: `What is the duration of ${pujaName}?`,
        answer: `${pujaName} typically takes 1.5 to 3 hours depending on the rituals involved. Our pandits perform all rituals thoroughly with proper Vedic procedures.`,
      },
      {
        question: `Can I book ${pujaName} online for any city in India?`,
        answer: `Yes, OKPUJA provides ${pujaName} services across 200+ cities in India including Purnia, Patna, Delhi, Mumbai, Bangalore, Kolkata, Chennai, Hyderabad, and many more.`,
      },
      {
        question: `What is the best muhurat for ${pujaName}?`,
        answer: `The best muhurat for ${pujaName} depends on the Hindu calendar and planetary positions. Our pandits can suggest the most auspicious date and time for your ${pujaName}.`,
      },
      {
        question: `Are your pandits verified for ${pujaName}?`,
        answer: `All OKPUJA pandits are verified with background checks, Vedic education verification, and customer reviews. We ensure only experienced and authentic pandits perform ${pujaName}.`,
      },
    ],

    whyBook: [
      'Verified and experienced pandits with Vedic knowledge',
      'Complete samagri (puja materials) included',
      'Authentic rituals with proper mantras',
      'Transparent pricing — no hidden charges',
      'Available in 200+ cities across India',
      'Easy online booking in 3 simple steps',
      'Flexible scheduling — choose your date and time',
      'Customer support available 7 days a week',
      '4.8★ rating from 2500+ happy customers',
      'Based in Purnia, Bihar — serving all of India',
    ],
  };
}

// ============================================================
// PUJA + CITY COMBO CONTENT
// ============================================================

export interface PujaCityContent {
  introduction: string;
  citySpecificBenefits: string[];
  localInfo: string;
  faq: Array<{ question: string; answer: string }>;
}

export function getPujaCityContent(
  pujaName: string,
  hindi: string,
  cityName: string,
  state: string
): PujaCityContent {
  return {
    introduction: `Looking for ${pujaName} (${hindi}) in ${cityName}, ${state}? OKPUJA is the most trusted platform for booking verified pandits for ${pujaName} in ${cityName}. Our experienced and Vedic-trained pandits perform authentic ${pujaName} at your home, office, or any location in ${cityName} with complete samagri. Whether it's for a special occasion, festival, or life event, book your ${pujaName} in ${cityName} today and experience a seamless, professional puja service.`,

    citySpecificBenefits: [
      `Doorstep ${pujaName} service anywhere in ${cityName}, ${state}`,
      `Verified and experienced pandits available in ${cityName}`,
      `Complete samagri delivery to your location in ${cityName}`,
      `Flexible scheduling — choose your date and time in ${cityName}`,
      `Authentic Vedic ${pujaName} rituals in ${cityName}`,
      `Transparent pricing for ${pujaName} in ${cityName} — no hidden charges`,
      `4.8★ rated service by devotees in ${cityName}`,
      `Available for home, temple, office, and event venues in ${cityName}`,
    ],

    localInfo: `OKPUJA has been providing professional ${pujaName} services in ${cityName}, ${state} with a network of verified pandits. Devotees in ${cityName} trust OKPUJA for authentic rituals, on-time service, and complete satisfaction. Our pandits in ${cityName} are well-versed in local traditions and customs, ensuring your ${pujaName} is performed with proper Vedic procedures and regional customs.`,

    faq: [
      {
        question: `How to book pandit for ${pujaName} in ${cityName}?`,
        answer: `Visit okpuja.com, select ${pujaName}, choose ${cityName} as your location, pick your preferred date and time, and confirm. A verified pandit will arrive at your doorstep in ${cityName} with all samagri.`,
      },
      {
        question: `What is the cost of ${pujaName} in ${cityName}?`,
        answer: `${pujaName} cost in ${cityName} starts from ₹1,100. The price includes the pandit's service and basic samagri. Premium packages with additional rituals are also available.`,
      },
      {
        question: `Do you provide samagri for ${pujaName} in ${cityName}?`,
        answer: `Yes, we provide complete puja samagri for ${pujaName} in ${cityName}. All items needed for the ritual are included in the booking.`,
      },
      {
        question: `Is ${pujaName} available at home in ${cityName}?`,
        answer: `Yes, our verified pandits perform ${pujaName} at your home in ${cityName}. They bring all required items and perform the complete ritual at your doorstep.`,
      },
      {
        question: `Which areas in ${cityName} do you serve for ${pujaName}?`,
        answer: `We serve all areas and localities in ${cityName}, ${state}. Our pandits travel to any location within ${cityName} city limits for ${pujaName}.`,
      },
      {
        question: `Can I choose the pandit for ${pujaName} in ${cityName}?`,
        answer: `We assign the best available verified pandit for ${pujaName} in ${cityName} based on expertise and ratings. All our pandits are experienced in performing ${pujaName}.`,
      },
    ],
  };
}

// ============================================================
// RELATED PUJAS
// ============================================================

export function getRelatedPujas(currentSlug: string, limit: number = 8): PujaService[] {
  const current = getPujaBySlug(currentSlug);
  if (!current) return PUJA_SERVICES.slice(0, limit);

  // Same category first, then other popular ones
  const sameCategory = PUJA_SERVICES.filter(
    (p) => p.category === current.category && p.slug !== currentSlug
  );
  const popular = PUJA_SERVICES.filter(
    (p) => p.category === 'popular' && p.slug !== currentSlug
  );

  const combined = [...sameCategory, ...popular];
  const unique = combined.filter(
    (p, i) => combined.findIndex((x) => x.slug === p.slug) === i
  );
  return unique.slice(0, limit);
}

// ============================================================
// TOP CITIES FOR PUJA COMBOS
// ============================================================

export function getTopCitiesForPuja(limit: number = 12): CityData[] {
  // Bihar priority + metros + tier 2
  const biharPriority = ['purnia', 'patna', 'katihar', 'araria', 'bhagalpur', 'madhepura', 'kishanganj', 'saharsa'];
  const priorityCities = INDIA_CITIES.filter((c) => biharPriority.includes(c.slug));
  const metros = INDIA_CITIES.filter((c) => c.tier === 1 && !biharPriority.includes(c.slug));
  return [...priorityCities, ...metros].slice(0, limit);
}
