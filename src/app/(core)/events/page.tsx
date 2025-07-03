"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { BsChevronLeft, BsChevronRight, BsCalendar3 } from "react-icons/bs";

export default function Events() {
  // Reference to the slider to control it with custom navigation
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
    // Custom dots rendering
    customPaging: () => (
      <div className="custom-dot w-2.5 h-2.5 bg-orange-300 rounded-full mt-8"></div>
    ),
    dotsClass: "slick-dots custom-dots",
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
    <section className="py-12 sm:py-16 bg-gradient-to-b from-cream to-cream/90">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="flex items-center justify-center mb-3">
            <BsCalendar3 className="text-redOrange text-2xl mr-3" />
            <span className="text-redOrange text-sm uppercase font-semibold tracking-wider">
              Religious Calendar
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Upcoming Religious Events
          </h2>
          <div className="w-20 h-1 bg-redOrange mx-auto mb-6 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg">
            Plan ahead for these important religious celebrations and book your
            puja services in advance
          </p>
        </motion.div>

        {/* Custom Navigation */}
        <div className="flex justify-center sm:justify-end mb-6">
          <div className="flex space-x-3">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:text-redOrange hover:shadow-lg transition-all duration-200"
              aria-label="Previous slide"
            >
              <BsChevronLeft size={20} />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:text-redOrange hover:shadow-lg transition-all duration-200"
              aria-label="Next slide"
            >
              <BsChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="event-slider-container">
          <Slider ref={sliderRef} {...settings} className="pb-14">
            {data.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="px-3 py-2"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col transition-transform transform hover:shadow-xl hover:-translate-y-1 duration-300">
                  {/* Date badge */}
                  <div className="absolute top-4 left-4 bg-redOrange text-white text-center p-2 rounded-lg shadow-md z-10">
                    <div className="text-2xl font-bold leading-none">
                      {item.date.number}
                    </div>
                    <div className="text-xs uppercase">{item.date.month}</div>
                  </div>

                  {/* Image */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.imagesrc}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center mb-3">
                      <span className="inline-block bg-orange-100 rounded-full px-2 py-1 text-xs font-medium text-redOrange">
                        {item.date.day}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-800 text-xl mb-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                      {item.content}
                    </p>

                    <button className="text-redOrange font-medium text-sm flex items-center hover:text-redOrange/80 mt-auto">
                      View Details
                      <svg
                        className="w-4 h-4 ml-1"
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
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <a
            href="/calendar"
            className="inline-flex items-center px-6 py-3 bg-redOrange text-white font-medium rounded-lg shadow-md hover:bg-redOrange/90 transition-colors duration-300"
          >
            View Full Calendar
            <svg
              className="w-5 h-5 ml-2"
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
          </a>
        </motion.div>
      </div>

      {/* Custom styles for slider */}
      <style jsx global>{`
        .slick-list {
          margin: 0 -12px;
          padding-bottom: 10px !important;
        }

        .slick-slide > div {
          height: 100%;
        }

        .slick-track {
          display: flex !important;
          height: auto !important;
        }

        .slick-slide {
          height: auto !important;
        }

        .slick-slide > div {
          height: 100%;
        }

        .slick-active .custom-dot {
          background-color: #e25822;
          width: 20px;
          border-radius: 10px;
        }

        /* Mobile-friendly dots positioning */
        .custom-dots {
          bottom: -5px;
        }

        @media (max-width: 640px) {
          .event-slider-container .slick-dots {
            bottom: 0px;
          }
        }
      `}</style>
    </section>
  );
}
