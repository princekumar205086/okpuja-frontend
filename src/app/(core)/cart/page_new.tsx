"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  FaTrash, 
  FaTag, 
  FaShoppingCart, 
  FaArrowRight, 
  FaMinus, 
  FaPlus,
  FaGift,
  FaLock,
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaCreditCard,
  FaShieldAlt
} from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CartPage: React.FC = () => {
  type CartItem = {
    id: number;
    name: string;
    image: string;
    type: string;
    language: string;
    date: string;
    time: string;
    location: string;
    price: number;
    packageId: number;
  };

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCodeId, setPromoCodeId] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartId, setCartId] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const removeFromCart = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const finalTotal = subtotal - discountAmount;

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedCartId = localStorage.getItem("cartId");
      if (!storedCartId) {
        storedCartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("cartId", storedCartId);
      }
      setCartId(storedCartId);

      const storedToken = localStorage.getItem("authToken");
      setToken(storedToken);

      // Simulate cart items for demo
      const mockItems: CartItem[] = [
        {
          id: 1,
          name: "Ganesh Chaturthi Puja",
          image: "/astrology_image/1720042815335-Kundali Matching.jpeg",
          type: "Festival Puja",
          language: "Hindi",
          date: "2024-01-15",
          time: "10:00 AM",
          location: "Mumbai, Maharashtra",
          price: 2500,
          packageId: 101
        },
        {
          id: 2,
          name: "Saraswati Puja",
          image: "/astrology_image/1720024869036-Palmistry.jpeg",
          type: "Goddess Puja",
          language: "Sanskrit",
          date: "2024-01-20",
          time: "6:00 AM",
          location: "Delhi, India",
          price: 1800,
          packageId: 102
        }
      ];
      setCartItems(mockItems);
    }
  }, []);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setIsApplying(true);
    setPromoError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (promoCode.toLowerCase() === 'save10') {
        setAppliedPromoCode(promoCode);
        setDiscountPercentage(10);
        setPromoCode("");
      } else {
        setPromoError("Invalid promo code");
      }
    } catch (error) {
      setPromoError("Error applying promo code");
    } finally {
      setIsApplying(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromoCode(null);
    setDiscountPercentage(0);
    setPromoError("");
    setPromoCode("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FaShoppingCart className="text-orange-500" />
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {cartItems.length > 0 ? `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart` : 'Your cart is currently empty'}
              </p>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-200"
              >
                <FaTrash className="text-sm" />
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {typeof window !== "undefined" && !token && cartItems.length > 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center p-4">
            <motion.div 
              className="bg-white p-8 max-w-md mx-auto rounded-2xl shadow-xl text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <FaLock className="text-3xl text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Account Required</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Please sign in to your account to proceed with checkout and complete your spiritual journey.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Sign In <FaArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 bg-orange-100 rounded-full flex items-center justify-center">
                <FaShoppingCart className="text-5xl text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Discover our beautiful collection of authentic puja services and add them to your cart to get started.
              </p>
              <Link
                href="/pujaservice"
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 px-8 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaShoppingCart className="mr-3" />
                Browse Services
                <FaArrowRight className="ml-3" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {cartItems.length}
                  </div>
                  Items in Your Cart
                </h2>
                <div className="text-sm text-gray-500">
                  Total: ₹{subtotal.toLocaleString()}
                </div>
              </div>
              
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 group transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Image */}
                      <div className="relative w-full lg:w-32 h-48 lg:h-32 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 1024px) 100vw, 128px"
                        />
                        <div className="absolute top-3 right-3">
                          <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            ₹{item.price.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                                {item.type}
                              </span>
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                {item.language}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
                            title="Remove item"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt className="text-orange-500" />
                            <span className="text-sm">{item.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaClock className="text-blue-500" />
                            <span className="text-sm">{item.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaMapMarkerAlt className="text-green-500" />
                            <span className="text-sm truncate">{item.location}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FaStar className="text-yellow-400" />
                            <span className="text-sm text-gray-600">Premium Service</span>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              ₹{item.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">per service</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="sticky top-32">
                <motion.div 
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaCreditCard className="text-orange-500" />
                    Order Summary
                  </h3>

                  {/* Promo Code */}
                  {!appliedPromoCode ? (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Promo Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <button
                          onClick={applyPromoCode}
                          disabled={isApplying}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 font-medium transition-colors"
                        >
                          {isApplying ? "..." : "Apply"}
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-red-500 text-sm mt-2">{promoError}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-2">Try &quot;SAVE10&quot; for 10% off</p>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaGift className="text-green-500" />
                          <span className="font-medium text-green-800">
                            {appliedPromoCode} Applied
                          </span>
                        </div>
                        <button
                          onClick={removePromoCode}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discountPercentage}%)</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Service Fee</span>
                      <span>₹0</span>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-lg">
                    <FaShieldAlt className="text-green-500" />
                    <span>Secure checkout with 256-bit SSL encryption</span>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href="/confirmbooking"
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
                  >
                    Proceed to Checkout
                    <FaArrowRight />
                  </Link>

                  {/* Continue Shopping */}
                  <Link
                    href="/pujaservice"
                    className="w-full mt-4 bg-white border-2 border-orange-500 text-orange-500 py-3 px-6 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart />
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
