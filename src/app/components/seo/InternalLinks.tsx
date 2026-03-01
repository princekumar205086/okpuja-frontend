/**
 * OKPUJA - Internal Linking Component
 * SEO-optimized internal links for puja pages, city pages, astrology, and blog
 * Improves crawlability, link equity distribution, and keyword relevance
 */

import React from 'react';
import Link from 'next/link';
import { INDIA_CITIES, PUJA_SERVICES, ASTROLOGY_SERVICES } from '@/lib/seo/keywords';

interface InternalLinksProps {
  currentPath?: string;
  showCities?: boolean;
  showPujas?: boolean;
  showAstrology?: boolean;
  maxCities?: number;
  maxPujas?: number;
  className?: string;
}

/**
 * Renders a block of internal links for SEO
 * Include on puja pages, city pages, and blog pages
 */
export function InternalLinks({
  currentPath = '',
  showCities = true,
  showPujas = true,
  showAstrology = true,
  maxCities = 20,
  maxPujas = 15,
  className = '',
}: InternalLinksProps) {
  const topCities = INDIA_CITIES.filter((c) => c.tier <= 2).slice(0, maxCities);
  const topPujas = PUJA_SERVICES.filter((p) => p.category === 'popular').slice(0, maxPujas);
  const topAstrology = ASTROLOGY_SERVICES.slice(0, 8);

  return (
    <div className={`py-8 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Related Puja Services */}
        {showPujas && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Popular Puja Services
            </h3>
            <div className="flex flex-wrap gap-2">
              {topPujas.map((puja) => (
                <Link
                  key={puja.slug}
                  href={`/singlepuja?service=${puja.slug}`}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    currentPath.includes(puja.slug)
                      ? 'bg-orange-100 border-orange-300 text-orange-700'
                      : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  {puja.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* City Pages */}
        {showCities && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Puja Services in Your City
            </h3>
            <div className="flex flex-wrap gap-2">
              {topCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/puja/${city.slug}`}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    currentPath.includes(city.slug)
                      ? 'bg-orange-100 border-orange-300 text-orange-700'
                      : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Astrology Services */}
        {showAstrology && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Astrology & Consultation
            </h3>
            <div className="flex flex-wrap gap-2">
              {topAstrology.map((service) => (
                <Link
                  key={service.slug}
                  href={`/astrology`}
                  className="text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Quick Links
          </h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/" className="text-gray-600 hover:text-orange-600 underline decoration-dotted">
              Home
            </Link>
            <Link href="/pujaservice" className="text-gray-600 hover:text-orange-600 underline decoration-dotted">
              All Puja Services
            </Link>
            <Link href="/astrology" className="text-gray-600 hover:text-orange-600 underline decoration-dotted">
              Astrology
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-orange-600 underline decoration-dotted">
              Blog & Guides
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-orange-600 underline decoration-dotted">
              About Us
            </Link>
            <Link href="/contactus" className="text-gray-600 hover:text-orange-600 underline decoration-dotted">
              Contact
            </Link>
            <Link href="/gallery" className="text-gray-600 hover:text-orange-600 underline decoration-dotted">
              Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact city links for footer or sidebar
 */
export function CityLinksCompact({ maxCities = 30 }: { maxCities?: number }) {
  const cities = INDIA_CITIES.filter((c) => c.tier <= 2).slice(0, maxCities);
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1">
      {cities.map((city) => (
        <Link
          key={city.slug}
          href={`/puja/${city.slug}`}
          className="text-xs text-gray-500 hover:text-orange-600 py-0.5"
        >
          Puja in {city.name}
        </Link>
      ))}
    </div>
  );
}

/**
 * Related pujas sidebar for single puja page
 */
export function RelatedPujas({
  currentSlug,
  category,
  maxItems = 8,
}: {
  currentSlug: string;
  category?: string;
  maxItems?: number;
}) {
  const related = PUJA_SERVICES
    .filter((p) => p.slug !== currentSlug && (category ? p.category === category : true))
    .slice(0, maxItems);

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-800 mb-3">Related Puja Services</h3>
      {related.map((puja) => (
        <Link
          key={puja.slug}
          href={`/singlepuja?service=${puja.slug}`}
          className="block text-sm text-gray-600 hover:text-orange-600 py-1 border-b border-gray-100"
        >
          {puja.name} <span className="text-gray-400">({puja.hindi})</span>
        </Link>
      ))}
    </div>
  );
}

export default InternalLinks;
