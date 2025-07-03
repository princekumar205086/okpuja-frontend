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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      {/* Hero Content */}
      <VideoCarousel />
      <ServiceCard />
      <FeaturedPujas />
      <ServiceRange />
      <HowItWorks />
      <UpcomingEvents />
      <Events />
      <CustomerReviews />
      <QualifiedPandit />
    </div>
  )
}
