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
    <div className="min-h-screen bg-white overflow-x-hidden">
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

        {/* Upcoming Events — white */}
        <div className="bg-white">
          <UpcomingEvents />
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
      </main>
    </div>
  )
}
