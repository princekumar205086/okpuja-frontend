"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { MdSwipe } from "react-icons/md";
import Link from "next/link";

interface Slide {
  id: number;
  videoUrl: string;
  headline: string;
  subtext: string;
  primaryCta: string;
  primaryLink: string;
  secondaryCta: string;
  secondaryLink: string;
}

const VideoCarousel: React.FC = () => {
  // State definitions remain the same
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const slideWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  const slides: Slide[] = [
    {
      id: 1,
      videoUrl: "/video/puja.webm",
      headline: "Book Your Puja with Verified Pandits",
      subtext: "Customized rituals as per your tradition and needs",
      primaryCta: "Book Now",
      primaryLink: "/pujaservice",
      secondaryCta: "Explore Services",
      secondaryLink: "/services",
    },
    {
      id: 2,
      videoUrl: "/video/astro.mp4",
      headline: "Your Destiny, Decoded by Experts!",
      subtext: "Get accurate guidance on career, marriage & finance",
      primaryCta: "Consult Now",
      primaryLink: "/astrology",
      secondaryCta: "View Astrologers",
      secondaryLink: "/astrologers",
    }
  ];

  // Hide swipe hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance carousel when playing
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, slides.length]);

  // Handle video loading
  useEffect(() => {
    const checkAllVideosLoaded = () => {
      // Only check the current video for better mobile performance
      const currentVideo = videoRefs.current[currentSlide];
      if (currentVideo && (currentVideo.readyState >= 3 || !isLoading)) {
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
    };

    checkAllVideosLoaded();

    // Take a snapshot of the refs to avoid stale closure issues
    const videosSnapshot = [...videoRefs.current];

    videosSnapshot.forEach((video) => {
      if (video) {
        video.addEventListener("canplay", checkAllVideosLoaded);
      }
    });

    return () => {
      videosSnapshot.forEach((video) => {
        if (video) {
          video.removeEventListener("canplay", checkAllVideosLoaded);
        }
      });
    };
  }, [currentSlide, isLoading]);

  // Handle video playback based on current slide
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentSlide) {
          video.currentTime = 0;
          video
            .play()
            .catch((error) => console.log("Video play error:", error));
        } else {
          video.pause();
        }
      }
    });
  }, [currentSlide]);

  // Preload videos for smoother transitions
  useEffect(() => {
    const preloadNextSlide = (currentIndex: number) => {
      const nextIndex = (currentIndex + 1) % slides.length;
      const nextVideo = videoRefs.current[nextIndex];
      if (nextVideo && nextVideo.networkState === 0) {
        // NETWORK_EMPTY
        nextVideo.load();
      }
    };

    preloadNextSlide(currentSlide);
  }, [currentSlide, slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleVideoRef = (element: HTMLVideoElement | null, index: number) => {
    videoRefs.current[index] = element;
  };

  const handleSlideWrapperRef = (
    element: HTMLDivElement | null,
    index: number
  ) => {
    slideWrapperRefs.current[index] = element;
  };

  // Enhanced touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    setTouchEnd(e.targetTouches[0].clientX);

    // Apply live feedback during swipe
    const currentWrapper = slideWrapperRefs.current[currentSlide];
    if (currentWrapper && touchStart && touchEnd) {
      const delta = touchEnd - touchStart;
      // Limit the translation for visual feedback, but don't actually move the slide yet
      if (Math.abs(delta) < 100) {
        currentWrapper.style.transform = `translateX(${delta * 0.3}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    // Reset any translation applied during touch move
    const currentWrapper = slideWrapperRefs.current[currentSlide];
    if (currentWrapper) {
      currentWrapper.style.transform = "";
    }

    const distance = touchStart - touchEnd;
    const isSignificantSwipe = Math.abs(distance) > 70; // Slightly increased threshold for intentional swipes

    if (isSignificantSwipe) {
      if (distance > 0) {
        // Swipe left -> next slide
        handleNextSlide();
      } else {
        // Swipe right -> previous slide
        handlePrevSlide();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);

    if (showSwipeHint) {
      setShowSwipeHint(false);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen h-[100svh] overflow-hidden bg-gray-950"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-950 z-30 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/60 text-sm tracking-wide">Loading...</p>
          </div>
        </div>
      )}

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          ref={(el) => handleSlideWrapperRef(el, index)}
          className={`absolute inset-0 transition-opacity duration-1000 will-change-transform ${
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Video */}
          <video
            ref={(el) => handleVideoRef(el, index)}
            className="h-full w-full object-cover"
            preload={
              index === currentSlide || index === (currentSlide + 1) % slides.length
                ? "auto"
                : "none"
            }
            src={slide.videoUrl}
            loop
            muted={isMuted}
            playsInline
            poster="/image/term.jpeg"
          >
            <source src={slide.videoUrl} type={slide.videoUrl.endsWith("webm") ? "video/webm" : "video/mp4"} />
          </video>

          {/* Multi-layer gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
              <div className="max-w-2xl xl:max-w-3xl">
                {/* Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-400/40 backdrop-blur-sm mb-6 transition-all duration-700 delay-200 ${
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                  <span className="text-orange-300 text-xs font-semibold tracking-widest uppercase">
                    India&apos;s Trusted Puja Platform
                  </span>
                </div>

                {/* Headline */}
                <h1
                  className={`font-bold text-white leading-[1.1] tracking-tight mb-5 transition-all duration-700 delay-300 ${
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  } text-3xl sm:text-4xl md:text-5xl xl:text-6xl`}
                >
                  {slide.headline}
                </h1>

                {/* Sub-text */}
                <p
                  className={`text-white/75 text-base sm:text-lg md:text-xl leading-relaxed mb-8 transition-all duration-700 delay-[400ms] ${
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  {slide.subtext}
                </p>

                {/* CTA Buttons */}
                <div
                  className={`flex flex-wrap gap-3 mb-10 transition-all duration-700 delay-500 ${
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <Link href={slide.primaryLink}>
                    <span className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-8 py-3.5 rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-orange-500/30 transition-all duration-200">
                      {slide.primaryCta}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                  <Link href={slide.secondaryLink}>
                    <span className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-xl text-sm font-semibold tracking-wide backdrop-blur-sm transition-all duration-200">
                      {slide.secondaryCta}
                    </span>
                  </Link>
                </div>

                {/* Trust badges */}
                <div
                  className={`flex flex-wrap items-center gap-5 transition-all duration-700 delay-[600ms] ${
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  {[
                    { icon: "🏆", text: "2,300+ Pujas Completed" },
                    { icon: "⭐", text: "4.9 / 5 Rating" },
                    { icon: "🕉️", text: "500+ Verified Pandits" },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-base">{badge.icon}</span>
                      <span className="text-white/65 text-xs font-medium">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              currentSlide === index ? "w-8 bg-orange-400" : "w-2.5 bg-white/35 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Desktop navigation arrows */}
      <div className="hidden sm:flex absolute top-1/2 -translate-y-1/2 left-5 z-20">
        <button
          onClick={handlePrevSlide}
          className="p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-white hover:bg-black/50 transition-all duration-200"
          aria-label="Previous slide"
        >
          <BsChevronLeft size={22} />
        </button>
      </div>
      <div className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-5 z-20">
        <button
          onClick={handleNextSlide}
          className="p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-white hover:bg-black/50 transition-all duration-200"
          aria-label="Next slide"
        >
          <BsChevronRight size={22} />
        </button>
      </div>

      {/* Playback controls — bottom right */}
      <div className="absolute bottom-7 right-6 flex items-center gap-2.5 z-20">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-white hover:bg-black/50 transition-all duration-200"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <FaPause size={13} /> : <FaPlay size={13} />}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-white hover:bg-black/50 transition-all duration-200"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <FaVolumeMute size={13} /> : <FaVolumeUp size={13} />}
        </button>
      </div>

      {/* Mobile swipe hint */}
      {showSwipeHint && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 sm:hidden z-40 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md text-white/90 text-xs font-medium rounded-full px-5 py-2.5 flex items-center gap-2 border border-white/20">
            <MdSwipe size={16} />
            <span>Swipe to navigate</span>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-6 hidden md:flex items-center gap-2 z-20">
        <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
      </div>
    </div>
  );
};

export default VideoCarousel;
