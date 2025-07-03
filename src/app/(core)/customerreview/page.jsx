"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { motion } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    image: "https://randomuser.me/api/portraits/men/31.jpg",
    review: "The puja I booked was conducted beautifully. The pandit explained all the rituals and the process was seamless. Highly recommend this service!",
    rating: 5,
    location: "Mumbai, Maharashtra",
    service: "Griha Pravesh Puja",
  },
  {
    id: 2,
    name: "Priya Singh",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    review: "I consulted an astrologer through the platform, and the advice I received was insightful. It was a smooth experience, and the customer support was very helpful.",
    rating: 4,
    location: "Delhi, NCR",
    service: "Astrology Consultation",
  },
  {
    id: 3,
    name: "Anjali Patel",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    review: "The booking process was easy, and the puja was done on time. However, I faced some delays in receiving the prasad.",
    rating: 3,
    location: "Ahmedabad, Gujarat",
    service: "Saraswati Puja",
  },
  {
    id: 4,
    name: "Vikram Reddy",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    review: "Fantastic experience! The online astrology consultation was detailed, and the astrologer was very knowledgeable. Would definitely use this service again.",
    rating: 5,
    location: "Hyderabad, Telangana",
    service: "Kundali Matching",
  },
  {
    id: 5,
    name: "Sneha Kapoor",
    image: "https://randomuser.me/api/portraits/women/35.jpg",
    review: "I booked a Griha Pravesh puja through the website, and the arrangements were excellent. The pandit was professional and the entire process went smoothly.",
    rating: 4,
    location: "Jaipur, Rajasthan",
    service: "Griha Pravesh Puja",
  },
  {
    id: 6,
    name: "Rohan Gupta",
    image: "https://randomuser.me/api/portraits/men/36.jpg",
    review: "I consulted an astrologer for career guidance. The consultation was thorough, and I found it to be very beneficial. Great service!",
    rating: 5,
    location: "Kolkata, West Bengal",
    service: "Career Astrology",
  },
  {
    id: 7,
    name: "Neha Iyer",
    image: "https://randomuser.me/api/portraits/women/37.jpg",
    review: "The puja service was good, but I think the process could be a bit more streamlined, especially when it comes to booking slots.",
    rating: 3,
    location: "Chennai, Tamil Nadu",
    service: "Lakshmi Puja",
  },
  {
    id: 8,
    name: "Raj Mehta",
    image: "https://randomuser.me/api/portraits/men/38.jpg",
    review: "I booked a Navagraha Shanti puja, and the process was hassle-free. The pandit was punctual, and the entire experience was fulfilling.",
    rating: 4,
    location: "Pune, Maharashtra",
    service: "Navagraha Shanti Puja",
  },
];

export default function CustomerReviews() {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
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
          centerPadding: '40px',
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
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-block px-3 py-1 bg-redOrange/10 text-redOrange rounded-full text-sm font-medium mb-4">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">What Our Clients Say</h2>
          <div className="w-20 h-1 bg-redOrange mx-auto mb-6 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Discover why thousands of clients trust OKPUJA for their spiritual needs and religious ceremonies
          </p>
        </motion.div>

        {/* Highlighted Review */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 max-w-4xl mx-auto"
        >
          <div className="p-1 bg-gradient-to-r from-redOrange to-orange-400 rounded-2xl">
            <div className="bg-white p-6 sm:p-8 rounded-xl relative flex flex-col sm:flex-row items-center gap-6">
              <div className="absolute -top-5 left-8 bg-white rounded-full p-3 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-redOrange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>

              <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                <Image
                  src="https://randomuser.me/api/portraits/women/35.jpg"
                  alt="Featured customer"
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                  fill
                  sizes="(max-width: 768px) 96px, 128px"
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex justify-center sm:justify-start mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-lg sm:text-xl italic mb-4">
                  "Thanks to OKPUJA, I was able to arrange a beautiful Griha Pravesh ceremony for our new home. The pandit was knowledgeable, punctual, and guided us through every ritual with patience. The experience was truly divine!"
                </p>
                <div>
                  <p className="font-semibold text-gray-800">Sneha Kapoor</p>
                  <p className="text-sm text-gray-500">Jaipur, Rajasthan • Griha Pravesh Puja</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Custom Navigation */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold text-gray-800">Client Experiences</h3>
          <div className="flex space-x-3">
            <button
              onClick={goToPrev}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-cream transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-cream transition-all duration-200"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="testimonials-slider mb-10">
          <Slider ref={sliderRef} {...settings} className="pb-14">
            {reviews.map((review) => (
              <div key={review.id} className="px-3 py-2 h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 sm:p-7 h-full flex flex-col"
                >
                  <div className="mb-5 text-redOrange">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  <p className="text-gray-700 mb-6 text-base flex-grow">
                    {review.review}
                  </p>

                  <div className="flex items-center">
                    <div className="relative w-12 h-12 mr-4">
                      <Image
                        src={review.image}
                        alt={review.name}
                        className="rounded-full object-cover"
                        fill
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <div className="flex items-center mt-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{review.service}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mt-4 sm:mt-8"
        >
          <p className="text-gray-600 mb-5 text-lg">
            Join thousands of satisfied clients who have experienced our sacred services
          </p>
          <a
            href="/pujaservice"
            className="inline-flex items-center px-6 py-3 bg-redOrange text-white font-medium rounded-lg hover:bg-redOrange/90 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Book Your Puja Today
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Custom styles for slider */}
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
        
        .custom-dots {
          bottom: -5px;
        }
        
        .custom-dot {
          width: 8px;
          height: 8px;
          background-color: #E9DBCF;
          border-radius: 50%;
          display: inline-block;
          transition: all 0.3s ease;
          margin: 0 4px;
        }
        
        .slick-active .custom-dot {
          background-color: #E25822;
          width: 24px;
          border-radius: 10px;
        }

        @media (max-width: 640px) {
          .testimonials-slider {
            margin: 0 -16px;
            width: calc(100% + 32px);
          }
        }
      `}</style>
    </section>
  );
}