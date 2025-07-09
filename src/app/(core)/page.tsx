import React from 'react'
import VideoCarousel from './herosection/page'
import ServiceCard from './servicecard/page'
import FeaturedPujas from './featurescard/page'
import ServiceRange from './servicerange/page'
import HowItWorks from './howitworks/page'
import UpcomingEvents from './upcoming/page'
import Events from './events/page'
import CustomerReviews from './customerreview/page'
import QualifiedPandit from './qualifiedpandit/page'

export default function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-x-hidden">
      {/* Main Content */}
      <main id="main-content" className="relative">
        {/* Hero Section */}
        <section className="relative">
          <VideoCarousel />
        </section>

        {/* Service Statistics */}
        <section className="relative z-10">
          <ServiceCard />
        </section>

        {/* Featured Services */}
        <section className="relative z-10">
          <FeaturedPujas />
        </section>

        {/* Service Range */}
        <section className="relative z-10">
          <ServiceRange />
        </section>

        {/* Process Flow */}
        <section className="relative z-10">
          <HowItWorks />
        </section>

        {/* Upcoming Events */}
        <section className="relative z-10">
          <UpcomingEvents />
        </section>

        {/* Events Gallery */}
        <section className="relative z-10">
          <Events />
        </section>

        {/* Customer Testimonials */}
        <section className="relative z-10">
          <CustomerReviews />
        </section>

        {/* Expert Team */}
        <section className="relative z-10">
          <QualifiedPandit />
        </section>
      </main>
    </div>
  )
}
