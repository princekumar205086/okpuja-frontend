import React from 'react'

export default function page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              OKPUJA
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the divine connection through authentic Hindu pujas and expert astrology services. 
            Book your spiritual journey with certified pandits and astrologers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Book a Puja
            </button>
            <button className="bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Consult Astrologer
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl mb-4 text-center">🕉</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Authentic Pujas</h3>
            <p className="text-gray-600 text-center">Traditional Hindu rituals performed by certified pandits</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl mb-4 text-center">⭐</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Expert Astrology</h3>
            <p className="text-gray-600 text-center">Personalized readings and consultations from experienced astrologers</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl mb-4 text-center">🏠</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Home Service</h3>
            <p className="text-gray-600 text-center">Convenient at-home puja services for your comfort</p>
          </div>
        </div>
      </div>
    </div>
  )
}
