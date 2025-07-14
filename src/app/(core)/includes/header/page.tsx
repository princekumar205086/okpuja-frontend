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
  FaPray,
  FaMagic,
  FaNewspaper,
  FaPhoneAlt,
  FaTachometerAlt,
  FaCog,
  FaHistory,
  FaShoppingCart,
} from "react-icons/fa";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/app/stores/authStore";
import { useCartStore } from "@/app/stores/cartStore";


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get auth store
  const { user, logout } = useAuthStore();
  
  // Get cart store
  const { totalCount: cartCount, fetchCartItems, getLocalCartCount } = useCartStore();

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!user) return '';
    
    if (user.full_name) {
      return user.full_name;
    }
    
    if (user.email) {
      // Extract name from email (before @)
      const emailName = user.email.split('@')[0];
      // Capitalize first letter and replace dots/underscores with spaces
      return emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[._]/g, ' ');
    }
    
    return user.role === 'ADMIN' ? 'Admin' : user.role === 'EMPLOYEE' ? 'Employee' : 'User';
  };

  // Helper function to get dashboard URL based on role
  const getDashboardUrl = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'EMPLOYEE':
        return '/employee/dashboard';
      default:
        return '/user/dashboard';
    }
  };

  // Helper function to get profile URL based on role
  const getProfileUrl = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'ADMIN':
        return '/admin/profile';
      case 'EMPLOYEE':
        return '/employee/profile';
      default:
        return '/user/profile';
    }
  };

  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true);
    
    // Handle scrolling
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    // Event listeners
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pathname]);

  // Fetch cart items when user is available
  useEffect(() => {
    if (user && mounted) {
      fetchCartItems();
    }
  }, [user, mounted, fetchCartItems]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
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
    { name: "Home", link: "/", icon: <FaHome className="mr-3 text-xl" /> },
    {
      name: "All Pujas",
      link: "/pujaservice",
      icon: <FaPray className="mr-3 text-xl" />,
    },
    {
      name: "Astrology",
      link: "/astrology",
      icon: <FaMagic className="mr-3 text-xl" />,
    },
    { name: "Blog", link: "/blog", icon: <FaNewspaper className="mr-3 text-xl" /> },
    {
      name: "Contact",
      link: "/contactus",
      icon: <FaPhoneAlt className="mr-3 text-xl" />,
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? "bg-white/98 backdrop-blur-md shadow-2xl border-b border-orange-100 h-14 sm:h-16" 
            : "bg-trans backdrop-blur-none h-16 sm:h-18 md:h-20 text-cream"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo Section */}
            <div className="flex items-center h-full flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="relative flex items-center h-8 sm:h-10 md:h-12">
                  <Image
                    alt="OKPUJA Logo"
                    src="/image/okpuja logo.png"
                    width={isScrolled ? 140 : 180}
                    height={isScrolled ? 40 : 60}
                    className="object-contain transition-all duration-300"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Menu Links */}
            <div className="hidden lg:flex flex-1 justify-center items-center h-full max-w-2xl mx-8">
              <div className="flex items-center space-x-1 xl:space-x-3">
                {menuData.map((item, index) => (
                  <Link key={index} href={item.link}>
                    <span
                      className={`px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-all duration-300 whitespace-nowrap ${
                        pathname === item.link
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                          : isScrolled 
                            ? "text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:scale-105" 
                            : "text-cream hover:bg-white/20 hover:text-orange-300 hover:scale-105"
                      } cursor-pointer relative group flex items-center`}
                    >
                      {item.name}
                    </span>
                  </Link>
                ))}

                {/* Dashboard/Login Link */}
                {mounted ? (
                  <>
                    {user ? (
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={toggleDropdown}
                          className="flex items-center px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-all duration-300 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 hover:from-orange-100 hover:to-amber-100 border border-orange-200"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mr-2">
                              <span className="text-white font-bold text-sm">
                                {getUserDisplayName().charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="hidden xl:block">
                              <div className="text-left">
                                <div className="text-sm font-semibold text-gray-800">
                                  {getUserDisplayName()}
                                </div>
                                <div className="text-xs text-gray-500 capitalize">
                                  {user.role.toLowerCase()}
                                </div>
                              </div>
                            </div>
                            <FaChevronDown className="ml-2 text-xs text-gray-500" />
                          </div>
                        </button>

                        {showDropdown && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                            <div className="px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-bold">
                                    {getUserDisplayName().charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-800">
                                    {getUserDisplayName()}
                                  </div>
                                  <div className="text-xs text-gray-500">{user.email}</div>
                                  <div className="text-xs text-orange-600 capitalize font-medium">
                                    {user.role.toLowerCase()}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Link href={getDashboardUrl()}>
                              <span className="flex px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors items-center">
                                <FaTachometerAlt className="mr-3 text-orange-500" />
                                My Dashboard
                              </span>
                            </Link>
                            <Link href={getProfileUrl()}>
                              <span className="flex px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors items-center">
                                <FaCog className="mr-3 text-orange-500" />
                                Profile Settings
                              </span>
                            </Link>
                            {user.role === 'USER' && (
                              <Link href="/mybooking">
                                <span className="flex px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors items-center">
                                  <FaHistory className="mr-3 text-orange-500" />
                                  My Bookings
                                </span>
                              </Link>
                            )}
                            <hr className="my-2 border-gray-100" />
                            <button
                              onClick={handleLogout}
                              className="flex w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors items-center"
                            >
                              <FaSignOutAlt className="mr-3 text-red-500" />
                              Logout
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link href="/register">
                        <span className="px-4 xl:px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium text-sm xl:text-base whitespace-nowrap shadow-lg">
                          SignUp/SignIn
                        </span>
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="px-4 xl:px-6 py-2 w-28 h-9 bg-gray-200 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Tablet Menu - Medium screens */}
            <div className="hidden md:flex lg:hidden flex-1 justify-center items-center h-full">
              <div className="flex items-center space-x-2">
                {menuData.slice(0, 3).map((item, index) => (
                  <Link key={index} href={item.link}>
                    <span
                      className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                        pathname === item.link
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                          : isScrolled 
                            ? "text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:scale-105" 
                            : "text-cream hover:bg-white/20 hover:text-orange-300 hover:scale-105"
                      } cursor-pointer whitespace-nowrap`}
                    >
                      {item.name}
                    </span>
                  </Link>
                ))}
                
                {/* More menu for tablet */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center px-2 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300"
                  >
                    More <FaChevronDown className="ml-1 text-xs" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                      {menuData.slice(3).map((item, index) => (
                        <Link key={index} href={item.link}>
                          <span className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                            {item.name}
                          </span>
                        </Link>
                      ))}
                      
                      {user && (
                        <>
                          <hr className="my-2 border-gray-100" />
                          <Link href={getDashboardUrl()}>
                            <span className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                              Dashboard
                            </span>
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {!user && mounted && (
                  <Link href="/register">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium text-sm whitespace-nowrap shadow-lg">
                      SignUp
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* Action Icons - Desktop & Mobile */}
            <div className="flex items-center space-x-2 sm:space-x-3 h-full">
              {/* WhatsApp - Desktop Only */}
              <div className="hidden lg:block">
                <Link
                  href="https://wa.me/+911234567890"
                  target="_blank"
                  aria-label="Contact on WhatsApp"
                >
                  <div className="w-9 h-9 xl:w-10 xl:h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg">
                    <FaWhatsappSquare className="text-lg xl:text-xl" />
                  </div>
                </Link>
              </div>

              {/* Cart Icon */}
              <Link href="/cart" className="relative" aria-label="Go to cart">
                <div className="w-9 h-11 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg">
                  <FaCartPlus className="text-xl sm:text-xl" />
                  {/* Cart Count Badge */}
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-white font-bold">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* User/Logout - Desktop Only */}
              <div className="hidden lg:block">
                {mounted ? (
                  <>
                    {user ? (
                      <button
                        onClick={handleLogout}
                        aria-label="Logout"
                        className="w-9 h-9 xl:w-10 xl:h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
                      >
                        <FaSignOutAlt className="text-base xl:text-lg" />
                      </button>
                    ) : (
                      <Link href="/login" aria-label="Login to account">
                        <div className="w-9 h-9 xl:w-10 xl:h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg">
                          <FaUserCircle className="text-base xl:text-lg" />
                        </div>
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="w-9 h-9 xl:w-10 xl:h-10 bg-gray-200 rounded-full animate-pulse"></div>
                )}
              </div>

              {/* User/Logout - Tablet Only */}
              <div className="hidden md:block lg:hidden">
                {mounted ? (
                  <>
                    {user ? (
                      <button
                        onClick={handleLogout}
                        aria-label="Logout"
                        className="w-9 h-9 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
                      >
                        <FaSignOutAlt className="text-base" />
                      </button>
                    ) : (
                      <Link href="/login" aria-label="Login to account">
                        <div className="w-9 h-9 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg">
                          <FaUserCircle className="text-base" />
                        </div>
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMenu}
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  {isMenuOpen ? (
                    <RiCloseLine className="text-lg sm:text-xl" />
                  ) : (
                    <RiMenu3Line className="text-lg sm:text-xl" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu with Overlay */}
        <div
          className={`md:hidden fixed inset-0 bg-black z-40 transition-all duration-500 ease-in-out ${
            isMenuOpen 
              ? "opacity-60 backdrop-blur-sm" 
              : "opacity-0 pointer-events-none backdrop-blur-none"
          }`}
          onClick={toggleMenu}
        ></div>

        <div
          className={`md:hidden fixed right-0 top-0 w-full max-w-sm h-screen transform transition-all duration-500 ease-in-out z-50 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } bg-white shadow-2xl border-l border-gray-100 flex flex-col`}
        >
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            
            <div className="relative z-10 flex items-center">
              <div>
                <h3 className="text-white font-bold text-lg text-center tracking-wide">OKPUJA</h3>
                <p className="text-white/80 text-xs text-center"><i>Vastu | Puja | Astrology</i></p>
              </div>
            </div>
            
            <button
              onClick={toggleMenu}
              aria-label="Close menu"
              className="relative z-10 w-10 h-10 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/20"
            >
              <RiCloseLine className="text-xl" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
                {menuData.map((item, index) => (
                  <Link key={index} href={item.link} onClick={toggleMenu}>
                    <div
                      className={`p-4 rounded-2xl flex items-center text-base font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                        pathname === item.link
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-600"
                      } relative overflow-hidden group`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/0 to-red-100/0 group-hover:from-orange-100/50 group-hover:to-red-100/30 transition-all duration-300"></div>
                      <div className="relative z-10 flex items-center w-full">
                        {item.icon}
                        <span className="flex-1">{item.name}</span>
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          pathname === item.link ? "bg-white" : "bg-transparent group-hover:bg-orange-400"
                        }`}></div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</h3>
                {mounted ? (
                  <>
                    {user ? (
                      <div className="space-y-2">
                        {/* User Info Card */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-200 mb-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-lg">
                                {getUserDisplayName().charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-800">
                                {getUserDisplayName()}
                              </div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                              <div className="text-xs text-orange-600 capitalize font-medium">
                                {user.role.toLowerCase()}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Link href={getDashboardUrl()} onClick={toggleMenu}>
                          <div className="p-4 rounded-2xl flex items-center text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 text-base font-medium transition-all duration-300 transform hover:scale-[1.02]">
                            <FaTachometerAlt className="mr-3 text-xl" />
                            <span className="flex-1">My Dashboard</span>
                          </div>
                        </Link>
                        <Link href={getProfileUrl()} onClick={toggleMenu}>
                          <div className="p-4 rounded-2xl flex items-center text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 text-base font-medium transition-all duration-300 transform hover:scale-[1.02]">
                            <FaCog className="mr-3 text-xl" />
                            <span className="flex-1">Profile Settings</span>
                          </div>
                        </Link>
                        {user.role === 'USER' && (
                          <Link href="/mybooking" onClick={toggleMenu}>
                            <div className="p-4 rounded-2xl flex items-center text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 text-base font-medium transition-all duration-300 transform hover:scale-[1.02]">
                              <FaHistory className="mr-3 text-xl" />
                              <span className="flex-1">My Bookings</span>
                            </div>
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            toggleMenu();
                          }}
                          className="w-full mt-4 p-4 rounded-2xl flex items-center text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-base font-medium transition-all duration-300 transform hover:scale-[1.02] border border-red-200 hover:border-red-300"
                        >
                          <FaSignOutAlt className="mr-3 text-xl" />
                          <span className="flex-1 text-left">Logout</span>
                        </button>
                      </div>
                    ) : (
                      <Link href="/register" onClick={toggleMenu}>
                        <div className="p-4 rounded-2xl flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-200 text-base font-medium transition-all duration-300 transform hover:scale-[1.02]">
                          <FaUserCircle className="mr-3 text-xl" />
                          SignUp/SignIn
                        </div>
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="p-4 w-full bg-gray-200 rounded-2xl animate-pulse h-16"></div>
                )}
              </div>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-orange-50">
              <div className="text-center mb-4">
                <p className="text-xs font-medium text-gray-600 mb-2">Connect with us</p>
              </div>
              <div className="flex justify-center space-x-4">
                <Link
                  href="https://wa.me/+911234567890"
                  target="_blank"
                  aria-label="WhatsApp"
                  onClick={toggleMenu}
                >
                  <div className="w-14 h-14 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-110 hover:rotate-3">
                    <FaWhatsappSquare className="text-2xl" />
                  </div>
                </Link>
                <Link href="/cart" aria-label="Cart" onClick={toggleMenu}>
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-110 hover:rotate-3 relative">
                    <FaCartPlus className="text-2xl" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white font-bold shadow-lg">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>
                {mounted && !user && (
                  <Link href="/login" aria-label="Login" onClick={toggleMenu}>
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-110 hover:rotate-3">
                      <FaUserCircle className="text-2xl" />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className={`${isScrolled ? "h-14 sm:h-16" : "h-16 sm:h-18 md:h-20"} transition-all duration-300`}></div>
    </>
  );
};

export default Header;
