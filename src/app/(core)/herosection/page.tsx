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
    },
    {
      id: 3,
      videoUrl: "/video/puja_vid.mp4",
      headline: "Celebrate Festivities with Divine Blessings!",
      subtext: "Navratri, Diwali, Ganesh Puja & more at your home or temple",
      primaryCta: "View Festival Pujas",
      primaryLink: "/festival-pujas",
      secondaryCta: "Customize Puja",
      secondaryLink: "/customize",
    },
    {
      id: 4,
      videoUrl: "/video/astro.mp4",
      headline: "Book Now & Get Special Discounts!",
      subtext: "Use code PUJA20 for flat 20% off on your first booking",
      primaryCta: "Apply Offer",
      primaryLink: "/offers",
      secondaryCta: "Browse Pujas",
      secondaryLink: "/pujaservice",
    },
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
      className="relative w-full h-[420px] xs:h-[440px] sm:h-[480px] overflow-hidden bg-gray-900"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 z-30 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-redOrange border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          ref={(el) => handleSlideWrapperRef(el, index)}
          className={`absolute inset-0 transition-opacity duration-700 will-change-transform ${
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Video with consistent object-fit settings to maintain aspect ratio */}
          <video
            ref={(el) => handleVideoRef(el, index)}
            className="h-full w-full object-cover"
            preload={
              index === currentSlide ||
              index === (currentSlide + 1) % slides.length
                ? "auto"
                : "none"
            }
            src={slide.videoUrl}
            loop
            muted={isMuted}
            playsInline
            poster="/image/term.jpeg"
          >
            <source
              src={slide.videoUrl}
              type={
                slide.videoUrl.endsWith("webm") ? "video/webm" : "video/mp4"
              }
            />
            Your browser does not support the video tag.
          </video>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20">
            {/* Content - centered for all screen sizes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-6xl w-full px-4 sm:px-8 md:px-16 lg:px-20 mx-auto">
                <div className="text-center max-w-3xl mx-auto">
                  {/* Dynamic heading size based on text length */}
                  <h1
                    className={`
                    font-bold text-cream leading-tight mb-3 sm:mb-4 md:mb-5
                    ${
                      slide.headline.length > 40
                        ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                        : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                    }
                  `}
                  >
                    {slide.headline}
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-cream mb-6 mx-auto">
                    {slide.subtext}
                  </p>

                  {/* Buttons - always in a row for all screen sizes */}
                  <div className="flex flex-row gap-3 sm:gap-4 justify-center">
                    <Link href={slide.primaryLink}>
                      <span className="inline-block text-center rounded-full bg-redOrange text-cream px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium hover:bg-orange-600 active:translate-y-0.5 transition-all duration-150 shadow-lg">
                        {slide.primaryCta}
                      </span>
                    </Link>
                    <Link href={slide.secondaryLink}>
                      <span className="inline-block text-center rounded-full border-2 border-cream text-cream px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium hover:bg-cream/10 active:translate-y-0.5 transition-all duration-150">
                        {slide.secondaryCta}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all ${
              currentSlide === index
                ? "w-6 md:w-8 bg-redOrange"
                : "w-2.5 bg-cream/50 hover:bg-cream/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Control buttons for mobile: left and right of swipe hint; for desktop: top of right */}
      {/* Mobile: absolute left and right, Desktop: as before */}
      <>
        {/* Mobile pause button (left of center) */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="block sm:hidden absolute bottom-10 left-8 z-50 rounded-full bg-black/60 backdrop-blur-md p-3 text-cream transition-all hover:bg-black/80 active:scale-95 shadow-md border border-redOrange/40"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          style={{transform: 'translateY(50%)'}}
        >
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
        </button>
        {/* Mobile volume button (right of center) */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="block sm:hidden absolute bottom-10 right-8 z-50 rounded-full bg-black/60 backdrop-blur-md p-3 text-cream transition-all hover:bg-black/80 active:scale-95 shadow-md border border-redOrange/40"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          style={{transform: 'translateY(50%)'}}
        >
          {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
        </button>
        {/* Desktop controls as before */}
        <div
          className="hidden sm:flex absolute bottom-6 right-8 space-x-3 z-20"
        >
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-full bg-black/40 backdrop-blur-md p-3 text-cream transition-all hover:bg-black/60 active:scale-95 shadow-md border border-redOrange/40"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="rounded-full bg-black/40 backdrop-blur-md p-3 text-cream transition-all hover:bg-black/60 active:scale-95 shadow-md border border-redOrange/40"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
          </button>
        </div>
      </>

      {/* Navigation arrows */}
      <div className="hidden sm:block">
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-md p-3 text-cream transition-all hover:bg-black/60 active:scale-95 z-20 border border-redOrange/40 shadow-md"
          aria-label="Previous slide"
        >
          <BsChevronLeft size={26} />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-md p-3 text-cream transition-all hover:bg-black/60 active:scale-95 z-20 border border-redOrange/40 shadow-md"
          aria-label="Next slide"
        >
          <BsChevronRight size={26} />
        </button>
      </div>

      {/* Mobile swipe hint */}
      {showSwipeHint && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 sm:hidden z-40 pointer-events-none animate-pulse w-full flex justify-center">
          <div
            className="bg-gradient-to-r from-redOrange/90 via-black/90 to-redOrange/90 backdrop-blur-md text-cream font-semibold rounded-full px-6 py-2 text-base flex items-center shadow-2xl border-2 border-redOrange drop-shadow-lg"
            style={{
              textShadow: '0 2px 8px #000, 0 0px 2px #d97706',
              letterSpacing: '0.02em',
              maxWidth: '90vw',
              justifyContent: 'center',
            }}
          >
            <MdSwipe className="mr-2 text-xl" size={20} />
            <span className="whitespace-nowrap">Swipe to navigate</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;
