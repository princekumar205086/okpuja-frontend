import React from 'react'
import type { Metadata } from 'next'
import VideoCarousel from './herosection/page'
import ServiceCard from './servicecard/page'
import FeaturedPujas from './featurescard/page'
import ServiceRange from './servicerange/page'
import HowItWorks from './howitworks/page'
import UpcomingEvents from './upcoming/page'
import Events from './events/page'
import CustomerReviews from './customerreview/page'
import QualifiedPandit from './qualifiedpandit/page'
import { SchemaScript } from '@/lib/seo/SchemaScript'
import { buildFAQSchema, buildBreadcrumbSchema } from '@/lib/seo/schema'
import { InternalLinks } from '@/app/components/seo/InternalLinks'

export const metadata: Metadata = {
  title: 'Book Pandit Online in India | Puja & Astrology Services',
  description:
    'Book verified pandits for puja, havan, and astrology consultation across India. Trusted puja services in Purnia Bihar 854301. 100+ services, 200+ cities.',
  keywords: [
    'puja booking online',
    'book pandit online',
    'online puja service india',
    'puja near me',
    'pandit near me',
    'havan booking online',
    'astrologer consultation online',
    'puja service purnia',
    'pandit in purnia',
    'best pandit india',
    'hindu puja booking',
    'verified pandit online',
    'puja at home',
    'online pandit booking india',
    'trusted puja service',
    'book pandit near me',
    'havan near me',
    'astrologer near me',
    'satyanarayan puja booking',
    'griha pravesh puja',
  ].join(', '),
}

const homeFAQs = [
  {
    question: 'How to book a pandit online on OKPUJA?',
    answer: 'Visit okpuja.com, browse 100+ puja services, select your desired puja, choose date & time, and confirm booking. A verified pandit will arrive at your doorstep with all samagri.',
  },
  {
    question: 'What puja services does OKPUJA offer?',
    answer: 'OKPUJA offers 100+ puja services including Satyanarayan Puja, Griha Pravesh, Ganesh Puja, Lakshmi Puja, Havan, Navagraha Shanti, Mundan, Wedding Puja, and many more.',
  },
  {
    question: 'Does OKPUJA provide puja services across India?',
    answer: 'Yes, OKPUJA provides puja services in 200+ cities across India including Delhi, Mumbai, Bangalore, Kolkata, Patna, Purnia, and more.',
  },
  {
    question: 'Are pandits on OKPUJA verified?',
    answer: 'Yes, all pandits on OKPUJA are thoroughly verified for their Vedic education, experience, and background. We ensure only certified and experienced pandits serve our customers.',
  },
  {
    question: 'How much does a puja cost on OKPUJA?',
    answer: 'Puja prices on OKPUJA range from ₹500 to ₹50,000 depending on the type and complexity. All prices are transparent with no hidden charges, and samagri is included in most packages.',
  },
]

export default function page() {
  const schemas = [
    buildFAQSchema(homeFAQs),
    buildBreadcrumbSchema([
      { name: 'Home', url: '/' },
    ]),
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SchemaScript schemas={schemas} />
      <main id="main-content">
        {/* Hero — full-screen video carousel */}
        <VideoCarousel />

        {/* Trust / Stats bar */}
        <div className="bg-white border-b border-stone-100">
          <ServiceCard />
        </div>

        {/* Featured Pujas — warm off-white */}
        <div className="bg-[#fffbf7]">
          <FeaturedPujas />
        </div>

        {/* Service Range — pure white */}
        <div className="bg-white">
          <ServiceRange />
        </div>

        {/* How It Works — warm off-white */}
        <div className="bg-[#fffbf7]">
          <HowItWorks />
        </div>

        {/* Events Calendar — warm off-white */}
        <div className="bg-[#fffbf7]">
          <Events />
        </div>

        {/* Testimonials — white */}
        <div className="bg-white">
          <CustomerReviews />
        </div>

        {/* Join as Pandit — rich dark background */}
        <QualifiedPandit />

        {/* Internal Links for SEO */}
        <InternalLinks />
      </main>
    </div>
  )
}
