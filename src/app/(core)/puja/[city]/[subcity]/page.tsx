/**
 * OKPUJA - Puja + City Combo Page
 * Route: /puja/[slug]/[city]
 * Example: /puja/ganesh-puja/delhi, /puja/satyanarayan-puja/purnia
 * 
 * Generates hyper-local SEO-optimized pages for each puja+city combination.
 * Each page includes: local intro, benefits, procedure, FAQ, breadcrumbs, JSON-LD
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { INDIA_CITIES, PUJA_SERVICES } from '@/lib/seo/keywords';
import { getPujaCityMetadata } from '@/lib/seo/metadata';
import { buildPujaCitySchemas } from '@/lib/seo/schema';
import { getCityBySlug } from '@/lib/seo/cityData';
import { getPujaBySlug, getPujaContent, getPujaCityContent, getRelatedPujas } from '@/lib/seo/pujaContent';
import { SchemaScript } from '@/lib/seo/SchemaScript';

// ============================================================
// STATIC PARAMS - Pre-generate top puja × city combos
// ============================================================
export async function generateStaticParams() {
  const topPujas = PUJA_SERVICES.filter((p) => p.category === 'popular').slice(0, 15);
  const topCities = INDIA_CITIES.filter((c) => c.tier <= 2);

  const params: Array<{ city: string; subcity: string }> = [];
  topPujas.forEach((puja) => {
    topCities.forEach((city) => {
      params.push({ city: puja.slug, subcity: city.slug });
    });
  });

  return params;
}

// ============================================================
// DYNAMIC METADATA
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; subcity: string }>;
}): Promise<Metadata> {
  const { city: pujaSlug, subcity: citySlug } = await params;

  const pujaData = getPujaBySlug(pujaSlug);
  const cityData = getCityBySlug(citySlug);

  if (!pujaData || !cityData) {
    return { title: 'Page Not Found | OKPUJA' };
  }

  return getPujaCityMetadata(pujaData.name, pujaData.slug, cityData.name, cityData.slug, cityData.state);
}

// ============================================================
// PAGE COMPONENT
// ============================================================
export default async function PujaCityPage({
  params,
}: {
  params: Promise<{ city: string; subcity: string }>;
}) {
  const { city: pujaSlug, subcity: citySlug } = await params;

  const pujaData = getPujaBySlug(pujaSlug);
  const cityData = getCityBySlug(citySlug);

  if (!pujaData || !cityData) {
    notFound();
  }

  const pujaContent = getPujaContent(pujaData.name, pujaData.hindi);
  const cityContent = getPujaCityContent(pujaData.name, pujaData.hindi, cityData.name, cityData.state);
  const relatedPujas = getRelatedPujas(pujaData.slug, 6);

  const schemas = buildPujaCitySchemas(
    pujaData.name,
    pujaData.slug,
    cityData.name,
    cityData.slug,
    cityData.state,
    cityContent.faq
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
              <ol className="flex items-center justify-center gap-2 flex-wrap">
                <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
                <li>/</li>
                <li><Link href="/puja" className="hover:text-orange-600">Puja Services</Link></li>
                <li>/</li>
                <li><Link href={`/puja/${pujaData.slug}`} className="hover:text-orange-600">{pujaData.name}</Link></li>
                <li>/</li>
                <li className="text-orange-600 font-medium">{cityData.name}</li>
              </ol>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {pujaData.name} in {cityData.name}
            </h1>
            <p className="text-lg text-gray-500 mb-2">{pujaData.hindi}</p>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Book verified pandit for {pujaData.name} at your doorstep in {cityData.name}, {cityData.state}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">⭐ 4.8 Rating</span>
              <span>•</span>
              <span>Trusted in {cityData.name}</span>
              <span>•</span>
              <span>Complete Samagri</span>
            </div>
            <Link
              href="/pujaservice"
              className="inline-block mt-6 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Book {pujaData.name} in {cityData.name}
            </Link>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {pujaData.name} in {cityData.name}, {cityData.state}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              {cityContent.introduction}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {cityContent.localInfo}
            </p>
          </div>
        </section>

        {/* City-specific Benefits */}
        <section className="py-12 px-4 bg-orange-50/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Why Book {pujaData.name} in {cityData.name} with OKPUJA?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cityContent.citySpecificBenefits.map((benefit, index) => (
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
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {pujaData.name} Procedure (Vidhi) in {cityData.name}
            </h2>
            <div className="space-y-6">
              {pujaContent.procedure.map((step, index) => (
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

        {/* Samagri */}
        <section className="py-12 px-4 bg-amber-50/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Samagri for {pujaData.name} in {cityData.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pujaContent.materials.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white">
                  <span className="text-amber-600">•</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              FAQ: {pujaData.name} in {cityData.name}
            </h2>
            <div className="space-y-4">
              {cityContent.faq.map((faq, index) => (
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

        {/* Related Pujas in same city */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Other Puja Services in {cityData.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {relatedPujas.map((related) => (
                <Link
                  key={related.slug}
                  href={`/puja/${related.slug}/${citySlug}`}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {related.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{related.hindi} in {cityData.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Same Puja in Nearby Cities */}
        {nearbyCities.length > 0 && (
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {pujaData.name} in Nearby Cities
              </h2>
              <div className="flex flex-wrap gap-3">
                {nearbyCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/puja/${pujaData.slug}/${city.slug}`}
                    className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-700 hover:border-orange-400 hover:text-orange-600 transition-colors"
                  >
                    {pujaData.name} in {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Cities Cloud */}
        <section className="py-8 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {pujaData.name} Across India
            </h2>
            <div className="flex flex-wrap gap-2">
              {INDIA_CITIES.filter((c) => c.tier <= 2).slice(0, 25).map((city) => (
                <Link
                  key={city.slug}
                  href={`/puja/${pujaData.slug}/${city.slug}`}
                  className="text-sm text-gray-500 hover:text-orange-600 underline decoration-dotted"
                >
                  {city.name}
                </Link>
              ))}
              <span className="text-sm text-gray-400">&amp; 170+ more cities</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Book {pujaData.name} in {cityData.name} Today
            </h2>
            <p className="text-orange-100 mb-8">
              Verified pandits • Complete samagri • At your doorstep in {cityData.name}
            </p>
            <Link
              href="/pujaservice"
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Book Now
            </Link>
          </div>
        </section>

        {/* SEO Text Block */}
        <section className="py-8 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs text-gray-400 leading-relaxed">
              Book {pujaData.name} ({pujaData.hindi}) in {cityData.name}, {cityData.state} on OKPUJA. Verified pandits for {pujaData.name} at your home in {cityData.name}. 
              {pujaData.name} vidhi, samagri, cost, benefits, and best muhurat in {cityData.name}. 
              Best pandit for {pujaData.name} near me in {cityData.name}. Book pandit for {pujaData.name} {cityData.name}.
              {pujaData.name} booking online {cityData.name}. Trusted puja service in {cityData.name}, {cityData.state}.
              OKPUJA serves all areas in {cityData.name} with doorstep puja services including {pujaData.name}.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
