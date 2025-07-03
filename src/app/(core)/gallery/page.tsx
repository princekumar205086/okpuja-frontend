"use client";
import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import {
  FaSearch,
  FaSort,
  FaExpand,
  FaTimes,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaShareAlt,
  FaDownload,
  FaCalendarAlt,
  FaEye,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

type GalleryItem = {
  id: number;
  title: string;
  image: string;
  category: string;
  date: string;
  popularity: number;
};

const categories = [
  "Durga Puja",
  "Saraswati Puja",
  "Kali Puja",
  "Ganesh Chaturthi",
  "Lakshmi Puja",
] as const;

const galleryItems: GalleryItem[] = [
  {
    id: 13,
    title: "Godh Bharai / Seemantham Puja",
    image: "/uploads/godh bharai.jpeg",
    category: "Lakshmi Puja",
    popularity: 1,
    date: "2024-09-14",
  },
  {
    id: 14,
    title: "Maha Ganapati Homa",
    image: "/uploads/Maha ganpati.jpg",
    category: "Ganesh Chaturthi",
    popularity: 1,
    date: "2024-08-20",
  },
  {
    id: 9,
    title: "Mundan Puja or Chola Sanskar",
    image: "/uploads/Mundan Puja.png",
    category: "Kali Puja",
    popularity: 1,
    date: "2024-07-15",
  },
  {
    id: 11,
    title: "Engagement Puja",
    image: "/uploads/ring exchange.jpeg",
    category: "Durga Puja",
    popularity: 1,
    date: "2024-09-05",
  },
  {
    id: 12,
    title: "Marriage Anniversary Puja",
    image: "/uploads/marriage puja.jpeg",
    category: "Saraswati Puja",
    popularity: 1,
    date: "2024-08-10",
  },
  {
    id: 15,
    title: "Satyanarayan Puja",
    image: "/uploads/satya narayan puja.jpeg",
    category: "Lakshmi Puja",
    popularity: 1,
    date: "2024-07-25",
  },
  {
    id: 16,
    title: "Griha Pravesh Puja",
    image: "/uploads/Griha Pravesh puja.jpeg",
    category: "Lakshmi Puja",
    popularity: 1,
    date: "2024-09-18",
  },
  {
    id: 17,
    title: "Ayushya Homa / Havan",
    image: "/uploads/aayush homa.jpeg",
    category: "Saraswati Puja",
    popularity: 1,
    date: "2024-07-30",
  },
  {
    id: 10,
    title: "Vehicle Puja / Car Puja",
    image: "/uploads/car vehicle puja.jpeg",
    category: "Ganesh Chaturthi",
    popularity: 1,
    date: "2024-08-12",
  },
  {
    id: 18,
    title: "Navagraha Puja And Homa",
    image: "/uploads/navgraha puja.jpeg",
    category: "Durga Puja",
    popularity: 1,
    date: "2024-09-01",
  },
  {
    id: 19,
    title: "Shuddhi Puja And Havan",
    image: "/uploads/suddhi puja.jpeg",
    category: "Durga Puja",
    popularity: 1,
    date: "2024-08-25",
  },
  {
    id: 20,
    title: "Maha Mrityunjaya Homa/ Havan",
    image: "/uploads/maha mritunjay.jpeg",
    category: "Kali Puja",
    popularity: 1,
    date: "2024-07-05",
  },
];

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(galleryItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortCriteria, setSortCriteria] = useState("date");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullScreen]);

  // Apply body style when fullscreen
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFullScreen]);

  // Filter and sort items
  const filterAndSortItems = useCallback(() => {
    const filteredItems = galleryItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filteredItems.sort((a, b) => {
      if (sortCriteria === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortCriteria === "popularity") {
        return b.popularity - a.popularity;
      } else if (sortCriteria === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    setItems(filteredItems);
  }, [searchQuery, selectedCategory, sortCriteria]);

  // Apply filters when dependencies change
  useEffect(() => {
    filterAndSortItems();
  }, [searchQuery, selectedCategory, sortCriteria, filterAndSortItems]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (criteria: string) => {
    setSortCriteria(criteria);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const increasePopularity = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other click events
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, popularity: item.popularity + 1 } : item
      )
    );
  };

  const viewImage = (index: number) => {
    setCurrentSlide(index);
    setIsFullScreen(true);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleFilters = () => {
    setActiveFilters(!activeFilters);
  };

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  };

  return (
    <>
      <div className="bg-gradient-to-b from-orange-50 to-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Spiritual Memories Gallery
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our collection of sacred ceremonies performed by
              our experienced pandits across various traditions.
            </p>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="md:hidden mb-6">
            <button
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg shadow-md flex items-center justify-between"
              onClick={toggleFilters}
            >
              <span className="flex items-center">
                <FaFilter className="mr-2" />
                Filter & Sort Options
              </span>
              {activeFilters ? <FaTimes /> : <FaChevronRight />}
            </button>
          </div>

          {/* Search, Filter, and Sort Section */}
          <div
            className={`mb-8 transition-all duration-300 ${
              isMobile && !activeFilters ? "hidden" : "block"
            }`}
          >
            <div className="bg-white p-4 rounded-xl shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Box */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title or category"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 pl-10"
                    value={searchQuery}
                    onChange={handleSearch}
                    aria-label="Search ceremonies"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Filter by Category
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    aria-label="Filter by category"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Sort by
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                        sortCriteria === "date"
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleSortChange("date")}
                      aria-label="Sort by date"
                    >
                      <span className="flex items-center justify-center">
                        <FaCalendarAlt className="mr-1" /> Date
                      </span>
                    </button>
                    <button
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                        sortCriteria === "popularity"
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleSortChange("popularity")}
                      aria-label="Sort by popularity"
                    >
                      <span className="flex items-center justify-center">
                        <FaHeart className="mr-1" /> Likes
                      </span>
                    </button>
                    <button
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                        sortCriteria === "title"
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleSortChange("title")}
                      aria-label="Sort by title"
                    >
                      <span className="flex items-center justify-center">
                        <FaSort className="mr-1" /> A-Z
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Counter */}
              <div className="mt-4 text-gray-600 text-sm">
                Showing {items.length}{" "}
                {items.length === 1 ? "result" : "results"}
                {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
                {searchQuery ? ` for "${searchQuery}"` : ""}
              </div>
            </div>
          </div>

          {/* No Results Message */}
          {items.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-orange-500 text-5xl mb-4">
                <FaSearch className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn&apos;t find any ceremonies matching your criteria. Please
                try a different search or filter.
              </p>
              <button
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition shadow-md"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSortCriteria("date");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured Image Viewer */}
              {isFullScreen ? (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                  <div className="relative w-full max-w-6xl mx-auto">
                    {/* Close button */}
                    <button
                      className="absolute top-0 right-0 bg-white bg-opacity-80 p-3 rounded-full z-10 hover:bg-opacity-100 transition"
                      onClick={toggleFullScreen}
                      aria-label="Close fullscreen view"
                    >
                      <FaTimes className="text-gray-800" />
                    </button>

                    {/* Navigation buttons */}
                    <button
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-3 m-4 rounded-full hover:bg-opacity-80 transition z-10"
                      onClick={handlePrevSlide}
                      aria-label="Previous image"
                    >
                      <FaChevronLeft className="text-gray-800" />
                    </button>
                    <button
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-3 m-4 rounded-full hover:bg-opacity-80 transition z-10"
                      onClick={handleNextSlide}
                      aria-label="Next image"
                    >
                      <FaChevronRight className="text-gray-800" />
                    </button>

                    {/* Current Image with animation */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="aspect-video relative bg-black rounded-lg overflow-hidden"
                      >
                        <Image
                          width={800}
                          height={450}
                          src={items[currentSlide].image}
                          alt={items[currentSlide].title}
                          className="w-full h-full object-contain"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Image Details */}
                    <div className="bg-white bg-opacity-90 p-4 mt-4 rounded-lg">
                      <h2 className="text-xl font-bold text-gray-800">
                        {items[currentSlide].title}
                      </h2>
                      <div className="flex flex-wrap items-center justify-between mt-2">
                        <div className="flex items-center text-gray-600">
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                            {items[currentSlide].category}
                          </span>
                          <span className="ml-4 flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            {formatDate(items[currentSlide].date)}
                          </span>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                          <button
                            className="flex items-center bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-full mr-2"
                            onClick={(e) =>
                              increasePopularity(items[currentSlide].id, e)
                            }
                          >
                            <FaHeart className="mr-1" />
                            <span>{items[currentSlide].popularity}</span>
                          </button>
                          <button
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 p-2 rounded-full"
                            aria-label="Share image"
                          >
                            <FaShareAlt />
                          </button>
                          <button
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 p-2 rounded-full ml-2"
                            aria-label="Download image"
                          >
                            <FaDownload />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Image Count Stats */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Recent Ceremonies
                </h2>
                <div className="flex items-center text-gray-600">
                  <FaEye className="mr-2" />
                  <span>{items.length} photos</span>
                </div>
              </div>

              {/* Gallery Grid with Masonry Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {items.map((item, index) => {
                  const isLoaded = loadedImages.has(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: isLoaded ? 1 : 0,
                        y: isLoaded ? 0 : 20,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: isLoaded ? index * 0.05 : 0,
                      }}
                      className="group"
                      onClick={() => viewImage(index)}
                    >
                      <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-64 sm:h-72">
                        {/* Placeholder while image loads */}
                        {!isLoaded && (
                          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        {/* Actual image */}
                        <Image
                          width={400}
                          height={300}
                          src={item.image}
                          alt={item.title}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                            isLoaded ? "opacity-100" : "opacity-0"
                          }`}
                          onLoad={() => handleImageLoad(item.id)}
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent opacity-90"></div>

                        {/* Image content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium line-clamp-2 mb-1 group-hover:text-orange-300 transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-sm opacity-90">
                                {formatDate(item.date)}
                              </p>
                            </div>
                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Like button overlay */}
                        <button
                          className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transform transition-transform duration-300 opacity-0 group-hover:opacity-100 z-10"
                          onClick={(e) => increasePopularity(item.id, e)}
                          aria-label={`Like ${item.title}`}
                        >
                          <FaHeart
                            className={`${
                              item.popularity > 0
                                ? "text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>

                        {/* View button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-black/40 p-3 rounded-full">
                            <FaExpand className="text-xl text-white" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
