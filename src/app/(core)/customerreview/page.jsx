"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    image: "https://randomuser.me/api/portraits/men/31.jpg",
    review: "The puja was conducted beautifully. The pandit explained all the rituals clearly and the entire process was seamless. Highly recommend OKPUJA!",
    rating: 5,
    location: "Mumbai, Maharashtra",
    service: "Griha Pravesh Puja",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Priya Singh",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    review: "The astrology consultation was deeply insightful. The guidance I received helped me make a life-changing decision. Excellent platform!",
    rating: 5,
    location: "Delhi, NCR",
    service: "Astrology Consultation",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Vikram Reddy",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    review: "Fantastic experience! The online astrology consultation was detailed and accurate. The astrologer was highly knowledgeable. Will use again.",
    rating: 5,
    location: "Hyderabad, Telangana",
    service: "Kundali Matching",
    date: "1 week ago",
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    image: "https://randomuser.me/api/portraits/women/35.jpg",
    review: "The Griha Pravesh puja arrangements were excellent. The pandit was professional and guided us through every ritual with patience and devotion.",
    rating: 5,
    location: "Jaipur, Rajasthan",
    service: "Griha Pravesh Puja",
    date: "2 months ago",
  },
  {
    id: 5,
    name: "Rohan Gupta",
    image: "https://randomuser.me/api/portraits/men/36.jpg",
    review: "Consulted for career astrology and found it extremely valuable. Thorough, detailed readings with practical remedies. Great service!",
    rating: 5,
    location: "Kolkata, West Bengal",
    service: "Career Astrology",
    date: "3 days ago",
  },
  {
    id: 6,
    name: "Raj Mehta",
    image: "https://randomuser.me/api/portraits/men/38.jpg",
    review: "Booked a Navagraha Shanti puja and the entire experience was fulfilling. The pandit was punctual and everything was arranged immaculately.",
    rating: 4,
    location: "Pune, Maharashtra",
    service: "Navagraha Shanti Puja",
    date: "2 weeks ago",
  },
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <FaStar key={i} className={`text-xs ${i < rating ? "text-amber-400" : "text-gray-200"}`} />
    ))}
  </div>
);

export default function CustomerReviews() {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerMode: true, centerPadding: "20px" } },
      { breakpoint: 640, settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold tracking-widest uppercase mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
              What Our <span className="text-orange-600">Clients Say</span>
            </h2>
            <p className="text-gray-500 text-base max-w-xl leading-relaxed">
              Trusted by thousands of devotees across India for authentic spiritual services and genuine guidance.
            </p>
          </div>

          {/* Nav + Rating summary */}
          <div className="flex flex-col items-end gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-amber-400 text-sm" />
                ))}
              </div>
              <span className="font-bold text-gray-900 text-sm">4.9</span>
              <span className="text-gray-400 text-sm">/ 5.0 from 2,300+ reviews</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-orange-500 hover:text-orange-600 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="Previous"
              >
                <FaChevronLeft size={14} />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-orange-500 hover:text-orange-600 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="Next"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Slider */}
        <div className="mb-12">
          <Slider ref={sliderRef} {...settings}>
            {reviews.map((review) => (
              <div key={review.id} className="px-3">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6 h-full flex flex-col"
                >
                  {/* Quote */}
                  <FaQuoteLeft className="text-orange-200 text-2xl mb-4 flex-shrink-0" />

                  {/* Stars */}
                  <div className="mb-3">
                    <StarRating rating={review.rating} />
                  </div>

                  {/* Review text */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-5 line-clamp-4">
                    &ldquo;{review.review}&rdquo;
                  </p>

                  {/* Service badge */}
                  <span className="inline-block text-xs bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1 rounded-full font-medium mb-4">
                    {review.service}
                  </span>

                  {/* Reviewer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-orange-100 flex-shrink-0">
                        <Image src={review.image} alt={review.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <FaMapMarkerAlt size={10} className="text-orange-400" />
                          {review.location.split(",")[0]}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
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
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-500 text-base mb-6">
            Join 40,000+ devotees who trust OKPUJA for authentic spiritual experiences.
          </p>
          <Link href="/pujaservice">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-md shadow-orange-200 transition-all duration-200"
            >
              Book Your Puja Today
              <FaArrowRight size={13} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
