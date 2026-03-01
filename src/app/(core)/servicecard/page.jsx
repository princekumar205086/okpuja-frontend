"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const stats = [
  {
    image: "/image/havan kund.jpeg",
    number: 2300,
    suffix: "+",
    label: "Sacred Pujas & Homas",
    subLabel: "Performed with full tradition",
    icon: "🙏",
    accent: "#d97706",
  },
  {
    image: "/image/pandits.jpeg",
    number: 500,
    suffix: "+",
    label: "Verified Pandits",
    subLabel: "Certified & experienced",
    icon: "",
    accent: "#7c3aed",
  },
  {
    image: "/image/deep.jpeg",
    number: 230,
    suffix: "+",
    label: "Spiritual Services",
    subLabel: "Covering every occasion",
    icon: "✨",
    accent: "#059669",
  },
];

export default function ServiceCard() {
  const [started, setStarted] = useState(false);
  const [counters, setCounters] = useState({ 0: 0, 1: 0, 2: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    stats.forEach((item, index) => {
      let current = 0;
      const step = item.number / 80;
      const timer = setInterval(() => {
        current += step;
        if (current >= item.number) {
          current = item.number;
          clearInterval(timer);
        }
        setCounters(prev => ({ ...prev, [index]: Math.floor(current) }));
      }, 18);
    });
  }, [started]);

  return (
    <section ref={ref} className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold tracking-widest uppercase mb-5">
            Our Impact in Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Transforming Lives Through{" "}
            <span className="text-orange-600">Devotion</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Connecting hearts to divine blessings through authentic spiritual practices guided by centuries-old Vedic traditions.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden p-8 flex flex-col items-center text-center">
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ background: item.accent }}
                />

                {/* Image */}
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-6 shadow-md ring-4 ring-gray-50 group-hover:ring-orange-50 transition-all duration-300">
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="80px"
                  />
                </div>

                {/* Counter */}
                <div className="mb-3">
                  <span
                    className="text-5xl lg:text-6xl font-black tabular-nums"
                    style={{ color: item.accent }}
                  >
                    {started ? counters[index].toLocaleString() : "0"}
                    {item.suffix}
                  </span>
                </div>

                {/* Label */}
                <h3 className="text-xl font-bold text-gray-900 mb-1.5">{item.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.subLabel}</p>

                {/* Emoji badge */}
                <div className="absolute top-5 right-5 text-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                  {item.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-10 border-t border-gray-100 flex flex-wrap justify-center gap-x-12 gap-y-4"
        >
          {[
            { dot: "bg-green-400", text: "Trusted by 40,000+ devotees" },
            { dot: "bg-orange-400", text: "Available in 100+ cities" },
            { dot: "bg-purple-400", text: "100% Satisfaction Guaranteed" },
            { dot: "bg-blue-400", text: "Secure & easy booking" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-gray-500">
              <span className={`w-2 h-2 rounded-full ${item.dot}`} />
              {item.text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

