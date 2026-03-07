/**
 * OKPUJA - Unified Dynamic Page
 * Route: /puja/[city]
 * 
 * Handles TWO types of slugs:
 * 1. City slugs (delhi, patna, purnia) → City landing page with local SEO
 * 2. Puja slugs (ganesh-puja, satyanarayan-puja) → Individual puja service page
 * 
 * Auto-detects the slug type and renders the appropriate page.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INDIA_CITIES, PUJA_SERVICES } from '@/lib/seo/keywords';
import { getCityPageMetadata, getSinglePujaMetadata } from '@/lib/seo/metadata';
import { buildCityPageSchemas, buildPujaPageSchemas } from '@/lib/seo/schema';
import { getCityFAQs, getCityPujaContent, getCityBySlug } from '@/lib/seo/cityData';
import { getPujaBySlug, getPujaContent, getRelatedPujas, getTopCitiesForPuja } from '@/lib/seo/pujaContent';
import { SchemaScript } from '@/lib/seo/SchemaScript';
import Link from 'next/link';

// ============================================================
// STATIC PARAMS - Pre-generate all city + puja pages
// ============================================================
export async function generateStaticParams() {
  const cityParams = INDIA_CITIES.map((city) => ({ city: city.slug }));
  const pujaParams = PUJA_SERVICES.map((puja) => ({ city: puja.slug }));
  return [...cityParams, ...pujaParams];
}

// ============================================================
// DYNAMIC METADATA
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;

  // Check if it's a puja slug first (more specific)
  const pujaData = getPujaBySlug(slug);
  if (pujaData) {
    return getSinglePujaMetadata(pujaData.name, pujaData.slug);
  }

  // Otherwise check if it's a city slug
  const cityData = getCityBySlug(slug);
  if (cityData) {
    return getCityPageMetadata(cityData.name, slug, cityData.state);
  }

  return { title: 'Page Not Found | OKPUJA' };
}

// ============================================================
// PAGE COMPONENT
// ============================================================
export default async function DynamicPujaPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;

  // Try puja slug first
  const pujaData = getPujaBySlug(slug);
  if (pujaData) {
    return <PujaServicePage puja={pujaData} />;
  }

  // Try city slug
  const cityData = getCityBySlug(slug);
  if (cityData) {
    return <CityLandingPage citySlug={slug} cityData={cityData} />;
  }

  notFound();
}

// ============================================================
// PUJA SERVICE PAGE COMPONENT
// ============================================================
function PujaServicePage({ puja }: { puja: (typeof PUJA_SERVICES)[number] }) {
  const content = getPujaContent(puja.name, puja.hindi);
  const relatedPujas = getRelatedPujas(puja.slug, 8);
  const topCities = getTopCitiesForPuja(12);

  const schemas = buildPujaPageSchemas(
    {
      name: puja.name,
      description: `Book verified pandit for ${puja.name} online. Authentic Vedic rituals with complete samagri across 200+ cities in India.`,
      url: `https://okpuja.com/puja/${puja.slug}`,
      category: 'Puja Service',
      rating: { value: 4.8, count: 2500 },
    },
    [
      { name: 'Home', url: '/' },
      { name: 'Puja Services', url: '/puja' },
      { name: puja.name, url: `/puja/${puja.slug}` },
    ],
    content.faq,
    [
      { name: 'Sankalp', text: `The pandit takes a sacred vow for ${puja.name}` },
      { name: 'Ganesh Puja', text: 'Lord Ganesha is invoked to remove obstacles' },
      { name: 'Main Rituals', text: `Core ${puja.name} rituals with Vedic mantras` },
      { name: 'Havan & Aarti', text: 'Sacred fire offering followed by aarti and prasad' },
    ]
  );

  return (
    <>
      <SchemaScript schemas={schemas} />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center justify-center gap-2">
                <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
                <li>/</li>
                <li><Link href="/puja" className="hover:text-orange-600">Puja Services</Link></li>
                <li>/</li>
                <li className="text-orange-600 font-medium">{puja.name}</li>
              </ol>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {puja.name} Booking Online
            </h1>
            <p className="text-lg text-gray-500 mb-2">{puja.hindi}</p>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Book verified pandit for {puja.name} at your home. Authentic Vedic rituals with complete samagri.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">⭐ 4.8 Rating</span>
              <span>•</span>
              <span>2500+ Happy Customers</span>
              <span>•</span>
              <span>200+ Cities</span>
            </div>
            <Link
              href="/pujaservice"
              className="inline-block mt-6 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Book {puja.name} Now
            </Link>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              About {puja.name} ({puja.hindi})
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {content.introduction}
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 px-4 bg-orange-50/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Benefits of {puja.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-white shadow-sm">
                  <span className="text-green-600 mt-0.5 font-bold">✓</span>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Procedure */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              {puja.name} Procedure (Vidhi)
            </h2>
            <div className="space-y-6">
              {content.procedure.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-2">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Materials */}
        <section className="py-12 px-4 bg-amber-50/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Samagri Required for {puja.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.materials.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white">
                  <span className="text-amber-600">•</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Book in Your City - Internal Linking */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Book {puja.name} in Your City
            </h2>
            <p className="text-gray-600 mb-8">
              {puja.name} is available in 200+ cities across India. Select your city:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {topCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/puja/${puja.slug}/${city.slug}`}
                  className="bg-white rounded-lg p-4 border border-orange-100 hover:border-orange-400 hover:shadow-md transition-all text-center group"
                >
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {puja.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">in {city.name}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {INDIA_CITIES.filter((c) => c.tier <= 2 && !topCities.find((t) => t.slug === c.slug)).slice(0, 20).map((city) => (
                <Link
                  key={city.slug}
                  href={`/puja/${puja.slug}/${city.slug}`}
                  className="text-sm text-gray-500 hover:text-orange-600 underline decoration-dotted"
                >
                  {puja.name} in {city.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Book on OKPUJA */}
        <section className="py-12 px-4 bg-green-50/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Why Book {puja.name} on OKPUJA?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.whyBook.map((reason, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-gray-700">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Pujas - Internal Linking */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Puja Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedPujas.map((related) => (
                <Link
                  key={related.slug}
                  href={`/puja/${related.slug}`}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {related.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{related.hindi}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4 bg-orange-50/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions about {puja.name}
            </h2>
            <div className="space-y-4">
              {content.faq.map((faq, index) => (
                <details
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden group"
                >
                  <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 flex items-center justify-between">
                    {faq.question}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-6 py-4 text-gray-600 border-t border-gray-100 bg-gray-50/50">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Text Block */}
        <section className="py-8 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs text-gray-400 leading-relaxed">
              Book {puja.name} ({puja.hindi}) online on OKPUJA. Verified pandits for {puja.name} at your home in Purnia, Patna, Delhi, 
              Mumbai, Bangalore, Kolkata, Chennai, Hyderabad, and 200+ cities. {puja.name} vidhi, samagri, cost, benefits, 
              and best muhurat. Authentic {puja.name} with complete Vedic rituals. Trusted by 2500+ customers. 
              Book pandit for {puja.name} near me. Best pandit for {puja.name} in India. {puja.name} booking at home.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

// ============================================================
// CITY LANDING PAGE COMPONENT (Original functionality)
// ============================================================
function CityLandingPage({
  citySlug,
  cityData,
}: {
  citySlug: string;
  cityData: (typeof INDIA_CITIES)[number];
}) {
  const content = getCityPujaContent(cityData.name, cityData.state);
  const faqs = getCityFAQs(cityData.name, cityData.state);
  const popularPujas = PUJA_SERVICES.filter((p) => p.category === 'popular').slice(0, 12);
  const festivalPujas = PUJA_SERVICES.filter((p) => p.category === 'festival').slice(0, 8);
  const astrologyPujas = PUJA_SERVICES.filter((p) => p.category === 'astrology').slice(0, 6);

  const schemas = buildCityPageSchemas(
    cityData.name,
    cityData.state,
    [
      { name: 'Home', url: '/' },
      { name: 'Puja Services', url: '/puja' },
      { name: `Puja in ${cityData.name}`, url: `/puja/${citySlug}` },
    ],
    faqs
  );

  const nearbyCities = INDIA_CITIES.filter(
    (c) => c.state === cityData.state && c.slug !== citySlug
  ).slice(0, 8);

  return (
    <>
      <SchemaScript schemas={schemas} />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center justify-center gap-2">
                <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
                <li>/</li>
                <li><Link href="/puja" className="hover:text-orange-600">Puja Services</Link></li>
                <li>/</li>
                <li className="text-orange-600 font-medium">{cityData.name}</li>
              </ol>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Book Pandit in {cityData.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Trusted Puja & Astrology Services in {cityData.name}, {cityData.state}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">⭐ 4.8 Rating</span>
              <span>•</span>
              <span>2500+ Happy Customers</span>
              <span>•</span>
              <span>100+ Services</span>
            </div>
          </div>
        </section>

        {/* City Introduction */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Puja Services in {cityData.name}, {cityData.state}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {content.intro}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {content.description}
            </p>
          </div>
        </section>

        {/* Popular Puja Services */}
        <section className="py-12 px-4 bg-orange-50/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Popular Puja Services in {cityData.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {popularPujas.map((puja) => (
                <Link
                  key={puja.slug}
                  href={`/puja/${puja.slug}/${citySlug}`}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-orange-100"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{puja.name}</h3>
                  <p className="text-sm text-gray-500">{puja.hindi}</p>
                  <p className="text-xs text-orange-600 mt-2">
                    Book in {cityData.name} →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Festival Pujas */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Festival Puja Bookings in {cityData.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {festivalPujas.map((puja) => (
                <Link
                  key={puja.slug}
                  href={`/puja/${puja.slug}/${citySlug}`}
                  className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100 hover:border-orange-300 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">{puja.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Book for {cityData.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Astrology Services */}
        <section className="py-12 px-4 bg-indigo-50/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Astrology Services in {cityData.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {astrologyPujas.map((puja) => (
                <Link
                  key={puja.slug}
                  href={`/astrology`}
                  className="bg-white rounded-lg p-4 border border-indigo-100 hover:border-indigo-300 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">{puja.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{puja.hindi} - {cityData.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose OKPUJA */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Choose OKPUJA in {cityData.name}?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.whyChoose.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50"
                >
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-gray-700">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 px-4 bg-orange-50/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              How to Book Puja in {cityData.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Select Puja', desc: `Browse 100+ puja services available in ${cityData.name}. Choose the puja you need.` },
                { step: '2', title: 'Choose Date & Time', desc: `Pick a convenient date, time, or muhurat for your puja in ${cityData.name}.` },
                { step: '3', title: 'Confirm Booking', desc: `Our verified pandit arrives at your doorstep in ${cityData.name} with all samagri.` },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions - Puja in {cityData.name}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden group"
                >
                  <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 flex items-center justify-between">
                    {faq.question}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-6 py-4 text-gray-600 border-t border-gray-100 bg-gray-50/50">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby Cities - Internal Linking */}
        {nearbyCities.length > 0 && (
          <section className="py-12 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Puja Services in Nearby Cities
              </h2>
              <div className="flex flex-wrap gap-3">
                {nearbyCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/puja/${city.slug}`}
                    className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-700 hover:border-orange-400 hover:text-orange-600 transition-colors"
                  >
                    Puja in {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All India Cities Link Cloud */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Puja Services Across India
            </h2>
            <div className="flex flex-wrap gap-2">
              {INDIA_CITIES.filter((c) => c.tier <= 2).slice(0, 30).map((city) => (
                <Link
                  key={city.slug}
                  href={`/puja/${city.slug}`}
                  className="text-sm text-gray-500 hover:text-orange-600 underline decoration-dotted"
                >
                  {city.name}
                </Link>
              ))}
              <span className="text-sm text-gray-400">& 170+ more cities</span>
            </div>
          </div>
        </section>

        {/* SEO Text Block */}
        <section className="py-8 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs text-gray-400 leading-relaxed">
              OKPUJA - Book verified pandits for puja, havan, and astrology services in {cityData.name}, {cityData.state}. 
              We offer Satyanarayan Puja, Griha Pravesh, Ganesh Puja, Lakshmi Puja, Navgraha Shanti, Havan, Mundan, 
              Wedding Puja, and 100+ more services. Our pandits are verified, experienced, and bring all necessary 
              samagri. Available for home, office, and temple puja in {cityData.name}. Book puja near me in {cityData.name}. 
              Best pandit in {cityData.name}. Trusted puja service {cityData.state}. Astrologer in {cityData.name}. 
              Kundli matching in {cityData.name}. Vastu consultant {cityData.name}. OKPUJA serves {cityData.name} and 
              all nearby areas with doorstep puja services.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
