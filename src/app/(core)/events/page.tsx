"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { BsChevronLeft, BsChevronRight, BsCalendar3, BsClock } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function Events() {
  // Reference to the slider to control it with custom navigation
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0px",
        },
      },
    ],
    customPaging: () => (
      <div className="w-3 h-3 bg-orange-200 rounded-full mt-8 transition-all duration-300 hover:bg-orange-400"></div>
    ),
    dotsClass: "slick-dots custom-dots flex justify-center space-x-2",
  };

  const data = [
    {
      imagesrc: "/calander/1.png",
      title: "Republic Day",
      date: { day: "Friday", number: "26", month: "January" },
      content:
        "January 26 2024, Friday. Republic Day is celebrated to mark the day when the Constitution of India came into effect on January 26, 1950. It is a national holiday in India.",
    },
    {
      imagesrc: "/calander/2.png",
      title: "Vasant Panchami",
      date: { day: "Thursday", number: "1", month: "February" },
      content:
        "February 1 2024, Thursday. Vasant Panchami, also known as Saraswati Puja, is dedicated to Goddess Saraswati, the Hindu deity of learning, wisdom, and knowledge. It marks the onset of the spring season.",
    },
    {
      imagesrc: "/calander/3.png",
      title: "Guru Ravidas Jayanti",
      date: { day: "Sunday", number: "4", month: "February" },
      content:
        "February 4 2024, Sunday. Guru Ravidas Jayanti celebrates the birth anniversary of Guru Ravidas, a saint, poet, and social reformer in the Bhakti movement during the 15th century.",
    },
    {
      imagesrc: "/calander/4.png",
      title: "Swami Dayanand Saraswati Jayanti",
      date: { day: "Sunday", number: "11", month: "February" },
      content:
        "February 11 2024, Sunday. Swami Dayanand Saraswati Jayanti marks the birth anniversary of Swami Dayanand Saraswati, an important Hindu religious scholar, reformer, and founder of the Arya Samaj.",
    },
    {
      imagesrc: "/calander/5.png",
      title: "Maha Shivaratri",
      date: { day: "Tuesday", number: "13", month: "February" },
      content:
        "February 13 2024, Tuesday. Maha Shivaratri is a Hindu festival dedicated to Lord Shiva, celebrated annually in honor of the god's marriage to Goddess Parvati. It is a day of fasting, prayer, and devotion.",
    },
    {
      imagesrc: "/calander/6.png",
      title: "Holika Dahan",
      date: { day: "Wednesday", number: "14", month: "February" },
      content:
        "February 14 2024, Wednesday. Holika Dahan, also known as Choti Holi, commemorates the victory of good over evil and the burning of demoness Holika.",
    },
    {
      imagesrc: "/calander/7.png",
      title: "Holi",
      date: { day: "Thursday", number: "15", month: "February" },
      content:
        "February 15 2024, Thursday. Holi, also known as the Festival of Colors, celebrates the arrival of spring and the victory of good over evil.",
    },
    {
      imagesrc: "/calander/8.png",
      title: "Maha Navami",
      date: { day: "Thursday", number: "29", month: "February" },
      content:
        "February 29 2024, Thursday. Maha Navami, or Navami Puja, is celebrated on the ninth day of Navratri, dedicated to worshipping Goddess Durga.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
              <BsCalendar3 className="text-white text-2xl" />
            </div>
          </div>
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-sm font-semibold uppercase tracking-wider rounded-full mb-4">
            Religious Calendar
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
            <span className="text-gray-900">Upcoming Sacred Events</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-6 rounded-full"></div>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
            Discover and prepare for important religious celebrations. Book your puja services 
            in advance to ensure spiritual guidance on these auspicious occasions.
          </p>
        </motion.div>

        {/* Custom Navigation */}
        <div className="flex justify-center sm:justify-end mb-8">
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sliderRef.current?.slickPrev()}
              className="p-3 rounded-full bg-white shadow-lg text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition-all duration-300 border border-orange-100"
              aria-label="Previous slide"
            >
              <BsChevronLeft size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sliderRef.current?.slickNext()}
              className="p-3 rounded-full bg-white shadow-lg text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition-all duration-300 border border-orange-100"
              aria-label="Next slide"
            >
              <BsChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <Slider ref={sliderRef} {...settings} className="events-slider">
            {data.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="px-3"
              >
                <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full">
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center p-3 rounded-xl shadow-lg">
                      <div className="text-2xl font-bold leading-none mb-1">
                        {item.date.number}
                      </div>
                      <div className="text-xs font-medium uppercase tracking-wide">
                        {item.date.month.slice(0, 3)}
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={item.imagesrc}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="flex items-center px-3 py-1 bg-orange-100 rounded-full">
                        <BsClock className="text-orange-600 text-sm mr-2" />
                        <span className="text-orange-700 text-sm font-medium">
                          {item.date.day}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-800 text-xl mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {item.content}
                    </p>

                    <motion.button 
                      whileHover={{ x: 5 }}
                      className="flex items-center text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors duration-300"
                    >
                      Learn More
                      <svg
                        className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <motion.a
            href="/calendar"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaRegCalendarAlt className="mr-3 text-lg" />
            View Complete Calendar
            <svg
              className="w-5 h-5 ml-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </motion.a>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .events-slider .slick-list {
          margin: 0 -12px;
          padding-bottom: 20px !important;
        }

        .events-slider .slick-slide > div {
          height: 100%;
        }

        .events-slider .slick-track {
          display: flex !important;
        }

        .events-slider .slick-slide {
          height: auto !important;
        }

        .events-slider .slick-slide > div > div {
          height: 100%;
        }

        .custom-dots {
          bottom: -10px !important;
        }

        .custom-dots li {
          margin: 0 4px !important;
        }

        .custom-dots li div {
          transition: all 0.3s ease !important;
        }

        .custom-dots li.slick-active div {
          background: linear-gradient(135deg, #f97316, #dc2626) !important;
          transform: scale(1.3);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
