"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FaWhatsappSquare,
  FaUserCircle,
  FaCartPlus,
  FaSignOutAlt,
  FaChevronDown,
  FaHome,
  FaBookOpen,
  FaStar,
  FaBlog,
  FaEnvelope,
} from "react-icons/fa";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const cartItems: number[] = [];
  const cartCount = cartItems.length;
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle scrolling
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    // Get auth token
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }

    // Close menu when route changes
    // const closeMenuOnRouteChange = () => {
    //   setIsMenuOpen(false);
    //   setShowDropdown(false);
    // };

    // Event listeners
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pathname]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    toast.success("Successfully logged out");
    setToken(null);
    router.push("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const menuData = [
    { name: "Home", link: "/", icon: <FaHome className="mr-2" /> },
    {
      name: "All Pujas",
      link: "/pujaservice",
      icon: <FaStar className="mr-2" />,
    },
    {
      name: "Astrology",
      link: "/astrology",
      icon: <FaBookOpen className="mr-2" />,
    },
    { name: "Blog", link: "/blog", icon: <FaBlog className="mr-2" /> },
    {
      name: "Contact",
      link: "/contactus",
      icon: <FaEnvelope className="mr-2" />,
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-cream shadow-lg h-16" : "bg-trans h-20"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo Section */}
            <div className="w-3/12 md:w-2/12 flex items-center h-full">
              <Link href="/">
                <div className="relative logo-wrapper h-full flex items-center">
                  <Image
                    alt="OKPUJA Logo"
                    src="/image/okpuja logo.png"
                    width={220}
                    height={120}
                    className="logo-image object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Menu Links */}
            <div className="hidden md:flex flex-1 justify-center space-x-1 lg:space-x-4 text-sm lg:text-md font-bold items-center h-full">
              {menuData.map((item, index) => (
                <Link key={index} href={item.link}>
                  <span
                    className={`px-3 py-1 rounded-md transition-all duration-300 ${
                      pathname === item.link
                        ? "bg-redOrange text-cream"
                        : "text-orangeRed hover:bg-orange-100"
                    } cursor-pointer relative group flex items-center`}
                  >
                    {item.name}
                    <span className="block h-1 bg-orange-400 w-0 transition-all duration-300 group-hover:w-full absolute bottom-0 left-0" />
                  </span>
                </Link>
              ))}

              {/* Dashboard/Login Link */}
              {token ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center px-3 py-1 rounded-md text-orangeRed hover:bg-orange-100 transition-all duration-200"
                  >
                    Dashboard <FaChevronDown className="ml-1 text-xs" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-cream rounded-md shadow-lg py-1 z-50 border border-orange-200">
                      <Link href="/dashboard">
                        <span className="block px-4 py-2 text-sm text-orangeRed hover:bg-orange-100">
                          My Dashboard
                        </span>
                      </Link>
                      <Link href="/profile">
                        <span className="block px-4 py-2 text-sm text-orangeRed hover:bg-orange-100">
                          Profile Settings
                        </span>
                      </Link>
                      <Link href="/mybooking">
                        <span className="block px-4 py-2 text-sm text-orangeRed hover:bg-orange-100">
                          My Bookings
                        </span>
                      </Link>
                      <hr className="my-1 border-orange-200" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/register">
                  <span className="px-4 py-1.5 bg-redOrange text-cream rounded-full hover:bg-orange-600 transition-colors duration-300 flex items-center">
                    SignUp/SignIn
                  </span>
                </Link>
              )}
            </div>

            {/* Social Media & Action Icons */}
            <div className="hidden md:flex w-3/12 md:w-2/12 justify-end space-x-1 lg:space-x-4 items-center">
              <Link
                href="https://wa.me/+911234567890"
                target="_blank"
                aria-label="Contact on WhatsApp"
              >
                <div className="p-1.5 lg:p-2 bg-green-600 text-cream rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-110">
                  <FaWhatsappSquare className="text-lg lg:text-xl" />
                </div>
              </Link>

              <Link href="/cart" className="relative" aria-label="Go to cart">
                <div className="p-1.5 lg:p-2 bg-redOrange text-cream rounded-full hover:bg-orange-800 transition-all duration-300 transform hover:scale-110">
                  <FaCartPlus className="text-lg lg:text-xl" />
                  {/* Cart Count Badge */}
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-redOrange text-cream rounded-full w-5 h-5 flex items-center justify-center border-2 border-cream">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </div>
              </Link>

              {token ? (
                <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="p-1.5 lg:p-2 bg-red-600 text-cream rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-110"
                >
                  <FaSignOutAlt className="text-lg lg:text-xl" />
                </button>
              ) : (
                <Link href="/login" aria-label="Login to account">
                  <div className="p-1.5 lg:p-2 bg-redOrange text-cream rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-110">
                    <FaUserCircle className="text-lg lg:text-xl" />
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile Menu & Actions */}
            <div className="md:hidden flex items-center space-x-3 h-full">
              {/* Mobile Cart Icon */}
              <Link href="/cart" className="relative" aria-label="Go to cart">
                <div className="p-1.5 bg-redOrange text-cream rounded-full">
                  <FaCartPlus className="text-lg" />
                  {/* Cart Count Badge for Mobile */}
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-cream rounded-full w-5 h-5 flex items-center justify-center border-2 border-cream">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Menu Button */}
              <button
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="p-1.5 bg-redOrange text-cream rounded-md focus:outline-none"
              >
                {isMenuOpen ? (
                  <RiCloseLine className="h-5 w-5" />
                ) : (
                  <RiMenu3Line className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu with Overlay */}
        <div
          className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleMenu}
        ></div>

        <div
          className={`md:hidden fixed right-0 top-0 w-72 h-full transform transition-transform duration-300 ease-in-out z-50 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } bg-cream shadow-xl`}
        >
          <div className="flex justify-between items-center p-4 border-b border-orange-200">
            <div className="relative w-32 h-12">
              <Image
                alt="OKPUJA Logo"
                src="/image/okpuja logo.png"
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={toggleMenu}
              aria-label="Close menu"
              className="p-1.5 bg-redOrange text-cream rounded-md"
            >
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-2">
            {menuData.map((item, index) => (
              <Link key={index} href={item.link} onClick={toggleMenu}>
                <div
                  className={`p-3 rounded-lg flex items-center ${
                    pathname === item.link
                      ? "bg-redOrange text-cream"
                      : "text-orangeRed hover:bg-orange-100"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            ))}

            <div className="pt-4 border-t border-orange-200 mt-4">
              {token ? (
                <>
                  <Link href="/dashboard" onClick={toggleMenu}>
                    <div className="p-3 rounded-lg flex items-center text-orangeRed hover:bg-orange-100">
                      <FaUserCircle className="mr-2" />
                      My Dashboard
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="w-full mt-2 p-3 rounded-lg flex items-center text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/register" onClick={toggleMenu}>
                  <div className="p-3 rounded-lg flex items-center justify-center bg-redOrange text-cream hover:bg-orange-600">
                    SignUp/SignIn
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Social Media Links in Mobile Menu */}
          <div className="absolute bottom-8 left-0 w-full px-4">
            <div className="flex justify-center space-x-6">
              <Link
                href="https://wa.me/+911234567890"
                target="_blank"
                aria-label="WhatsApp"
              >
                <div className="p-2 bg-green-600 text-cream rounded-full hover:bg-green-700">
                  <FaWhatsappSquare className="text-lg" />
                </div>
              </Link>
              <Link href="/cart" aria-label="Cart">
                <div className="p-2 bg-orange-700 text-cream rounded-full hover:bg-orange-800 relative">
                  <FaCartPlus className="text-lg" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-cream rounded-full w-5 h-5 flex items-center justify-center border-2 border-cream">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
              {!token && (
                <Link href="/login" aria-label="Login">
                  <div className="p-2 bg-redOrange text-cream rounded-full hover:bg-orange-600">
                    <FaUserCircle className="text-lg" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className={`${isScrolled ? "h-16" : "h-20"}`}></div>

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .logo-wrapper {
            width: 150px;
            height: 60px;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .logo-wrapper {
            width: 180px;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
