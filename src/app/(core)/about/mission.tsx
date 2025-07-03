// components/MissionVision.js
import React from 'react';

const MissionVision = () => {
  return (
    <section className="py-16 bg-cream">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Mission Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-orange-600 mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-orange-500 max-w-4xl mx-auto">
            At OKPUJA, our mission is to provide authentic and accessible spiritual experiences
            through online puja services, astrology consultations, and personalized spiritual
            guidance. We aim to bridge the gap between devotees and trusted, experienced
            practitioners, helping you lead a life of peace, prosperity, and well-being.
          </p>
        </div>

        {/* Vision Section */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-orange-600 mb-4">
            Our Vision
          </h2>
          <p className="text-lg text-orange-500 max-w-4xl mx-auto">
            Our vision is to be the global leader in delivering online spiritual services, offering
            a seamless and trustworthy platform that connects individuals to ancient rituals,
            astrological insights, and spiritual guidance. We aspire to empower people worldwide
            to discover and embrace their spiritual journeys, no matter where they are.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
