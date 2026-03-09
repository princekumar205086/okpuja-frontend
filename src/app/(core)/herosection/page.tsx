"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { MdSwipe } from "react-icons/md";
// â”€â”€â”€ redesigned â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import Link from "next/link";

interface Slide {
  id: number;
  videoUrl: string;
  badge: string;
  headline: string;
  subtext: string;
  primaryCta: string;
  primaryLink: string;
  secondaryCta: string;
  secondaryLink: string;
  accentColor: string;
}

const SLIDE_DURATION = 10000;

const VideoCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const slideWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  const slides: Slide[] = [
    {
      id: 1,
      videoUrl: "/video/puja.webm",
      badge: "India's Most Trusted Platform",
      headline: "Book Your Puja with Verified Pandits",
      subtext: "Customized rituals as per your tradition and needs",
      primaryCta: "Book Now",
      primaryLink: "/pujaservice",
      secondaryCta: "Explore Services",
      secondaryLink: "/pujaservice",
      accentColor: "orange",
    },
    {
      id: 2,
      videoUrl: "/video/astro.mp4",
      badge: "Expert Astrology Guidance",
      headline: "Your Destiny, Decoded by Experts",
      subtext: "Accurate guidance on career, marriage & finances",
      primaryCta: "Consult Now",
      primaryLink: "/astrology",
      secondaryCta: "View Astrologers",
      secondaryLink: "/astrology",
      accentColor: "purple",
    },
  ];

  // Hide swipe hint after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Progress animation + auto-advance (reliable on mobile / throttled tabs)
  useEffect(() => {
    setProgress(0);
    if (!isPlaying) return;

    let rafId: number;
    let startTime: number | null = null;

    const advanceTimer = setTimeout(() => {
      setCurrentSlide((s) => (s + 1) % slides.length);
    }, SLIDE_DURATION);

    const animateProgress = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100));
      if (elapsed < SLIDE_DURATION) {
        rafId = requestAnimationFrame(animateProgress);
      }
    };
    rafId = requestAnimationFrame(animateProgress);

    return () => {
      clearTimeout(advanceTimer);
      cancelAnimationFrame(rafId);
    };
  }, [isPlaying, currentSlide, slides.length]);

  // Video loading state
  useEffect(() => {
    const currentVideo = videoRefs.current[currentSlide];
    if (currentVideo && currentVideo.readyState >= 3) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    const videosSnapshot = [...videoRefs.current];
    const handler = () => setIsLoading(false);
    videosSnapshot.forEach((v) => v?.addEventListener("canplay", handler));
    return () => videosSnapshot.forEach((v) => v?.removeEventListener("canplay", handler));
  }, [currentSlide]);

  // Video play/pause per slide – always keep muted so mobile autoplay works
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === currentSlide) {
        video.muted = isMuted;
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Retry once muted for browsers that block autoplay
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      } else {
        video.pause();
      }
    });
  }, [currentSlide, isMuted]);

  // Preload next video
  useEffect(() => {
    const nextIndex = (currentSlide + 1) % slides.length;
    const next = videoRefs.current[nextIndex];
    if (next && next.networkState === 0) next.load();
  }, [currentSlide, slides.length]);

  const handlePrevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);
  const handleNextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    setTouchEnd(e.targetTouches[0].clientX);
    const wrapper = slideWrapperRefs.current[currentSlide];
    if (wrapper && touchEnd) {
      const delta = touchEnd - touchStart;
      if (Math.abs(delta) < 100) wrapper.style.transform = `translateX(${delta * 0.25}px)`;
    }
  };
  const handleTouchEnd = () => {
    const wrapper = slideWrapperRefs.current[currentSlide];
    if (wrapper) wrapper.style.transform = "";
    if (!touchStart || !touchEnd) return;
    const dist = touchStart - touchEnd;
    if (Math.abs(dist) > 65) dist > 0 ? handleNextSlide() : handlePrevSlide();
    setTouchStart(null);
    setTouchEnd(null);
    setShowSwipeHint(false);
  };

  const trustBadges = [
    { icon: "🙏", text: "2,300+ Pujas" },
    { icon: "⭐", text: "4.9 Rating" },
    { icon: "🙇", text: "500+ Pandits" },
  ];

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-950"
      style={{ height: "80svh", minHeight: "420px", maxHeight: "900px" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-950 z-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50 text-xs tracking-widest uppercase">Loadingâ€¦</p>
          </div>
        </div>
      )}

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          ref={(el) => { slideWrapperRefs.current[index] = el; }}
          className={`absolute inset-0 transition-opacity duration-700 will-change-transform ${
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background video */}
          <video
            ref={(el) => { videoRefs.current[index] = el; }}
            className="absolute inset-0 h-full w-full object-cover"
            preload={index === currentSlide ? "auto" : "none"}
            src={slide.videoUrl}
            autoPlay={index === currentSlide}
            loop
            muted
            playsInline
            poster="/image/term.jpeg"
          >
            <source src={slide.videoUrl} type={slide.videoUrl.endsWith("webm") ? "video/webm" : "video/mp4"} />
          </video>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 pt-14 pb-14 sm:pt-0 sm:pb-0">
              <div className="max-w-xl xl:max-w-2xl">

                {/* Badge */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full mb-3 border backdrop-blur-sm transition-all duration-600 delay-150 ${
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  } ${
                    slide.accentColor === "orange"
                      ? "bg-orange-500/15 border-orange-400/35"
                      : "bg-violet-500/15 border-violet-400/35"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      slide.accentColor === "orange" ? "bg-orange-400" : "bg-violet-400"
                    }`}
                  />
                  <span
                    className={`text-[10px] sm:text-[11px] font-semibold tracking-wider sm:tracking-widest uppercase ${
                      slide.accentColor === "orange" ? "text-orange-300" : "text-violet-300"
                    }`}
                  >
                    {slide.badge}
                  </span>
                </div>

                {/* Headline */}
                <h1
                  className={`font-extrabold text-white leading-[1.1] tracking-tight mb-2 sm:mb-3 transition-all duration-600 delay-200 ${
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  } text-[clamp(1.3rem,5.5vw,3.25rem)]`}
                >
                  {slide.headline}
                </h1>

                {/* Subtext */}
                <p
                  className={`text-white/70 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-5 transition-all duration-600 delay-300 ${
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  {slide.subtext}
                </p>

                {/* CTAs */}
                <div
                  className={`flex flex-col min-[400px]:flex-row flex-wrap gap-2 sm:gap-2.5 mb-4 sm:mb-5 transition-all duration-600 delay-[380ms] ${
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <Link href={slide.primaryLink} className="w-full min-[400px]:w-auto">
                    <span
                      className={`inline-flex w-full min-[400px]:w-auto justify-center items-center gap-1.5 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 active:scale-95 ${
                        slide.accentColor === "orange"
                          ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"
                          : "bg-violet-600 hover:bg-violet-700 shadow-violet-500/30"
                      }`}
                    >
                      {slide.primaryCta}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                  <Link href={slide.secondaryLink} className="w-full min-[400px]:w-auto">
                    <span className="inline-flex w-full min-[400px]:w-auto justify-center items-center gap-1.5 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/[0.18] border border-white/25 backdrop-blur-sm transition-all duration-200 active:scale-95">
                      {slide.secondaryCta}
                    </span>
                  </Link>
                </div>

                {/* Trust badges */}
                <div
                  className={`flex flex-wrap items-center gap-3 sm:gap-4 transition-all duration-600 delay-[460ms] ${
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                >
                  {trustBadges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-sm">{badge.icon}</span>
                      <span className="text-white/55 text-[11px] font-medium">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* â”€â”€ Animated progress bars (bottom) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-10 lg:px-16 pb-5 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className="relative flex-1 h-[3px] rounded-full overflow-hidden bg-white/20 max-w-[80px]"
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === currentSlide ? (
              <div
                className="absolute inset-y-0 left-0 bg-orange-400 rounded-full"
                style={{ width: `${progress}%`, transition: "width 50ms linear" }}
              />
            ) : i < currentSlide ? (
              <div className="absolute inset-0 bg-white/45 rounded-full" />
            ) : null}
          </button>
        ))}
      </div>

      {/* Desktop nav arrows */}
      <button
        onClick={handlePrevSlide}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/25 backdrop-blur-md border border-white/12 text-white hover:bg-black/45 transition-all duration-200"
        aria-label="Previous slide"
      >
        <BsChevronLeft size={20} />
      </button>
      <button
        onClick={handleNextSlide}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/25 backdrop-blur-md border border-white/12 text-white hover:bg-black/45 transition-all duration-200"
        aria-label="Next slide"
      >
        <BsChevronRight size={20} />
      </button>

      {/* Slide counter â€” top right */}
      <div className="absolute top-5 right-6 z-20 flex items-center gap-1 bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
        <span className="text-white text-xs font-semibold tabular-nums">{currentSlide + 1}</span>
        <span className="text-white/35 text-xs">/</span>
        <span className="text-white/50 text-xs tabular-nums">{slides.length}</span>
      </div>

      {/* Playback controls â€” top right, next to counter */}
      <div className="absolute top-5 right-[72px] z-20 flex items-center gap-1.5">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/12 text-white hover:bg-black/50 transition-all"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <FaPause size={11} /> : <FaPlay size={11} />}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/12 text-white hover:bg-black/50 transition-all"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <FaVolumeMute size={11} /> : <FaVolumeUp size={11} />}
        </button>
      </div>

      {/* Mobile swipe hint */}
      {showSwipeHint && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 sm:hidden z-30 pointer-events-none">
          <div className="bg-black/55 backdrop-blur-md text-white/85 text-[11px] font-medium rounded-full px-4 py-2 flex items-center gap-1.5 border border-white/15">
            <MdSwipe size={14} />
            Swipe to navigate
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;

