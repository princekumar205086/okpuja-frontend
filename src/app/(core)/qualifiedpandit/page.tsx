"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const QualifiedPandit = () => {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background with proper overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/astrologer.jpeg"
          alt="Qualified Pandits background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/10">
            {/* Main Section Content */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
              {/* Left Content */}
              <div className="md:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-block bg-redOrange/20 px-3 py-1 rounded-full mb-4">
                    <span className="text-xs font-medium tracking-wider text-orange-600 uppercase">
                      Join Our Network
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                    Are you a qualified{" "}
                    <span className="text-redOrange">Pandit</span> or{" "}
                    <span className="text-redOrange">Astrologer</span>?
                  </h2>

                  <p className="text-white/80 mb-6 text-base sm:text-lg">
                    Join our platform to connect with devotees across India. We
                    help qualified pandits and astrologers reach more clients
                    and grow their practice.
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      "Expand your client base across major Indian cities",
                      "Flexible scheduling that fits your availability",
                      "Secure and timely payments for your services",
                      "Build your professional reputation with client reviews",
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <div className="mr-3 mt-1 text-orange-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-white/90 text-sm sm:text-base">
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link href="/join-as-pandit">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-6 py-3 bg-redOrange hover:bg-redOrange/90 text-white font-medium rounded-lg shadow-lg transition-all duration-300"
                      >
                        Apply to Join
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </motion.span>
                    </Link>
                    <Link href="/pandit-requirements">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg shadow-lg border border-white/20 transition-all duration-300"
                      >
                        Learn More
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </motion.span>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Right Content - Testimonial */}
              <div className="md:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <svg
                    className="h-10 w-10 text-orange-700 mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <p className="text-white/80 italic mb-5 text-sm sm:text-base">
                    &quot;Joining OKPUJA has transformed my career as a pandit. I can
                    now reach devotees across India and have increased my
                    monthly income significantly. The platform is easy to use
                    and the team is very supportive.&quot;
                  </p>

                  <div className="flex items-center">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-redOrange">
                      <Image
                        src="/image/policy.jpeg"
                        alt="Pandit testimonial"
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        Pandit Rajesh Sharma
                      </p>
                      <p className="text-white/70 text-xs">
                        Joined 2 years ago • Delhi
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* SEO Keywords Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 pt-6 border-t border-white/10"
            >
              <p className="text-xs sm:text-sm text-white/60 text-center leading-relaxed">
                <span className="font-medium text-white/80 block mb-2">
                  Find qualified pandits across major cities:
                </span>
                North Indian Pandit in Bangalore, Pandit near me, Hindi Pandit
                in Bangalore, Purohit in Bangalore, Bihari Pandit in Bangalore,
                Best Pandit in Bangalore, Pandit for Puja in Mumbai, Pandit for
                Puja near me, Best Pandit in Mumbai, Marathi Pandit in Mumbai,
                North Indian Pandit in Mumbai, Pandit for Puja in Chennai, Best
                Pandit in Chennai, Tamil Iyer near me, North Indian Pandit in
                Chennai, Pandit for Puja in Hyderabad, Best Pandit in Hyderabad,
                Telugu Pujari in Hyderabad, Hindi Pandit in Hyderabad, Bihari
                Pandit in Hyderabad, North Indian Pandit in Hyderabad.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualifiedPandit;
