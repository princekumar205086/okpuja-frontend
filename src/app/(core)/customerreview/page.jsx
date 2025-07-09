"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar, FaMapMarkerAlt } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    image: "https://randomuser.me/api/portraits/men/31.jpg",
    review: "The puja I booked was conducted beautifully. The pandit explained all the rituals and the process was seamless. Highly recommend this service!",
    rating: 5,
    location: "Mumbai, Maharashtra",
    service: "Griha Pravesh Puja",
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "Priya Singh",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    review: "I consulted an astrologer through the platform, and the advice I received was insightful. It was a smooth experience, and the customer support was very helpful.",
    rating: 4,
    location: "Delhi, NCR",
    service: "Astrology Consultation",
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Anjali Patel",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    review: "The booking process was easy, and the puja was done on time. However, I faced some delays in receiving the prasad.",
    rating: 3,
    location: "Ahmedabad, Gujarat",
    service: "Saraswati Puja",
    date: "3 weeks ago"
  },
  {
    id: 4,
    name: "Vikram Reddy",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    review: "Fantastic experience! The online astrology consultation was detailed, and the astrologer was very knowledgeable. Would definitely use this service again.",
    rating: 5,
    location: "Hyderabad, Telangana",
    service: "Kundali Matching",
    date: "1 week ago"
  },
  {
    id: 5,
    name: "Sneha Kapoor",
    image: "https://randomuser.me/api/portraits/women/35.jpg",
    review: "I booked a Griha Pravesh puja through the website, and the arrangements were excellent. The pandit was professional and the entire process went smoothly.",
    rating: 4,
    location: "Jaipur, Rajasthan",
    service: "Griha Pravesh Puja",
    date: "2 months ago"
  },
  {
    id: 6,
    name: "Rohan Gupta",
    image: "https://randomuser.me/api/portraits/men/36.jpg",
    review: "I consulted an astrologer for career guidance. The consultation was thorough, and I found it to be very beneficial. Great service!",
    rating: 5,
    location: "Kolkata, West Bengal",
    service: "Career Astrology",
    date: "3 days ago"
  },
  {
    id: 7,
    name: "Neha Iyer",
    image: "https://randomuser.me/api/portraits/women/37.jpg",
    review: "The puja service was good, but I think the process could be a bit more streamlined, especially when it comes to booking slots.",
    rating: 3,
    location: "Chennai, Tamil Nadu",
    service: "Lakshmi Puja",
    date: "1 month ago"
  },
  {
    id: 8,
    name: "Raj Mehta",
    image: "https://randomuser.me/api/portraits/men/38.jpg",
    review: "I booked a Navagraha Shanti puja, and the process was hassle-free. The pandit was punctual, and the entire experience was fulfilling.",
    rating: 4,
    location: "Pune, Maharashtra",
    service: "Navagraha Shanti Puja",
    date: "2 weeks ago"
  },
];

export default function CustomerReviews() {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '20px',
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
    customPaging: () => (
      <div className="custom-dot"></div>
    ),
    dotsClass: "slick-dots custom-dots"
  };

  // Next/Prev functions
  const goToPrev = () => {
    sliderRef.current.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current.slickNext();
  };

  // Star rendering helper function
  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-2xl"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-32 right-20 w-6 h-6 bg-orange-400 rounded-full animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-40 left-16 w-4 h-4 bg-amber-400 rounded-full animate-pulse hidden lg:block"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm uppercase tracking-wider font-semibold rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-gray-900">What Our </span>
            <span className="block sm:inline bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ml-0 sm:ml-3">
              Clients Say
            </span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover why thousands of clients trust OKPUJA for their spiritual needs and sacred ceremonies
          </p>
        </motion.div>

        {/* Enhanced Highlighted Review */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20 max-w-5xl mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur-xl opacity-20"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20">
              {/* Quote icon */}
              <div className="absolute -top-6 left-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 shadow-lg">
                <FaQuoteLeft className="h-6 w-6 text-white" />
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 relative">
                    <Image
                      src="https://randomuser.me/api/portraits/women/35.jpg"
                      alt="Featured customer"
                      className="rounded-2xl object-cover shadow-lg"
                      fill
                      sizes="128px"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-green-500 rounded-xl p-2 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="h-6 w-6 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-gray-700 text-xl md:text-2xl italic mb-6 leading-relaxed">
                    "Thanks to OKPUJA, I was able to arrange a beautiful Griha Pravesh ceremony for our new home. The pandit was knowledgeable, punctual, and guided us through every ritual with patience. The experience was truly divine!"
                  </blockquote>
                  <div>
                    <p className="font-bold text-xl text-gray-900">Sneha Kapoor</p>
                    <div className="flex items-center justify-center lg:justify-start mt-2 text-gray-600">
                      <FaMapMarkerAlt className="h-4 w-4 mr-2 text-orange-500" />
                      <span>Jaipur, Rajasthan</span>
                      <span className="mx-2">•</span>
                      <span>Griha Pravesh Puja</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Navigation and Slider */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Client Experiences</h3>
          <div className="flex space-x-3">
            <button
              onClick={goToPrev}
              className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white transition-all duration-300 group"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button
              onClick={goToNext}
              className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white transition-all duration-300 group"
              aria-label="Next testimonial"
            >
              <FaChevronRight className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Enhanced Testimonials Slider */}
        <div className="testimonials-slider mb-12">
          <Slider ref={sliderRef} {...settings} className="pb-16">
            {reviews.map((review) => (
              <div key={review.id} className="px-3 py-2 h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 md:p-8 h-full flex flex-col border border-white/20"
                >
                  {/* Quote icon */}
                  <div className="mb-6 text-orange-500 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                    <FaQuoteLeft className="h-8 w-8" />
                  </div>

                  {/* Review text */}
                  <p className="text-gray-700 mb-6 text-base leading-relaxed flex-grow">
                    {review.review}
                  </p>

                  {/* Customer info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 mr-4">
                        <Image
                          src={review.image}
                          alt={review.name}
                          className="rounded-xl object-cover"
                          fill
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <div className="flex items-center mt-1 mb-1">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-xs text-gray-500">{review.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{review.date}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <FaMapMarkerAlt className="h-3 w-3 mr-1 text-orange-500" />
                        {review.location.split(',')[0]}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have experienced our sacred services and spiritual guidance
          </p>
          <a
            href="/pujaservice"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
          >
            Book Your Puja Today
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Enhanced Custom styles for slider */}
      <style jsx global>{`
        .testimonials-slider .slick-track {
          display: flex !important;
        }
        
        .testimonials-slider .slick-slide {
          height: inherit !important;
        }

        .testimonials-slider .slick-slide > div {
          height: 100%;
        }
        
        .testimonials-slider .slick-dots {
          bottom: -40px;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .testimonials-slider .slick-dots li {
          margin: 0;
        }
        
        .custom-dot {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #d1d5db, #9ca3af);
          border-radius: 50%;
          display: inline-block;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slick-active .custom-dot {
          background: linear-gradient(135deg, #f97316, #dc2626);
          width: 32px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
        }

        @media (max-width: 640px) {
          .testimonials-slider .slick-dots {
            bottom: -35px;
          }

          .custom-dot {
            width: 10px;
            height: 10px;
          }

          .slick-active .custom-dot {
            width: 24px;
          }
        }
      `}</style>
    </section>
  );
}

