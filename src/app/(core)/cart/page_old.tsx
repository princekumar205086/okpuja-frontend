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
  FaStar
} from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CartPage: React.FC = () => {
  // TODO: Replace with your actual cart state management (e.g., context, Redux, or useState)
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
    // Add any other properties your cart items need
  };
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const removeFromCart = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };
  const clearCart = () => {
    setCartItems([]);
  };
  const [promoCodeId, setPromoCodeId] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartId, setCartId] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const finalTotal = subtotal - discountAmount;

  useEffect(() => {
    // Check if cartId exists in localStorage
    if (typeof window !== "undefined") {
      let storedCartId = localStorage.getItem("cartId");
      if (!storedCartId) {
        // If cartId doesn't exist in localStorage, generate a new one
        storedCartId = "C" + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem("cartId", storedCartId);
      }
      setCartId(storedCartId);

      // Get token from localStorage
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
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
      const response = await axios.post("/api/checkpromo", {
        code: promoCode,
        action: "apply",
      });

      if (response.data && response.data.discount) {
        setAppliedPromoCode(promoCode.toUpperCase());
        setDiscountPercentage(response.data.discount);
        setPromoCodeId(response.data.id);
      } else {
        setPromoError("Failed to apply promo code");
      }
    } catch (error) {
      if (error) {
        const err = error as { response?: { data?: { error?: string } } };
        const apiError = err.response?.data?.error;

        if (apiError === "Promo code is expired") {
          setPromoError("The promo code you entered has expired");
        } else if (apiError === "Promo code does not exist") {
          setPromoError("Invalid promo code");
        } else if (apiError) {
          setPromoError(apiError);
        } else {
          setPromoError("An unexpected error occurred");
        }
      } else {
        setPromoError("An unexpected error occurred");
      }
      console.error("Error applying promo code:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const removePromoCode = async () => {
    try {
      const response = await axios.post("/api/checkpromo", {
        code: appliedPromoCode,
        action: "remove",
      });

      if (response.data && response.data.discount === 0) {
        setAppliedPromoCode(null);
        setDiscountPercentage(0);
        setPromoError("");
        setPromoCode("");
      } else {
        setPromoError("Failed to remove promo code");
      }
    } catch (error) {
      setPromoError("Error removing promo code");
      console.error(error);
    }
  };

  const handleCartData = () => {
    // will do
    // if (!token) return;

    // setIsProcessing(true);
    // type DecodedToken = { userId: number; [key: string]: number | string };
    // const decodedToken = jwtDecode<DecodedToken>(token);
    // const userId = decodedToken.userId;

    // Promise.all(
    //   cartItems.map((item) =>
    //     insertCart({
    //       userId,
    //       cartId,
    //       pujaServiceId: item.id,
    //       packageId: item.packageId,
    //       selected_date: item.date,
    //       selected_time: item.time,
    //       promoCodeId: promoCodeId ?? 0,
    //     })
    //   )
    // )
    //   .then(() => {
    //     if (typeof window !== "undefined") {
    //       localStorage.removeItem("cartId");
    //       window.location.href = `/checkout/${cartId}`;
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error inserting cart data", error);
    //     setIsProcessing(false);
    //   });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Only render after token is loaded */}
      {typeof window !== "undefined" && !token && cartItems.length > 0 ? (
        <div className="min-h-screen flex items-center justify-center p-4">
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
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <Image
                  src="/image/empty.jpeg"
                  width={300}
                  height={300}
                  alt="Empty Cart"
                  className="w-full max-w-md h-auto"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  No matching positions
                Looks like you haven&apos;t added any services yet. Browse our puja
                services to find what you need.
              </p>
              <Link
                href="/pujaservice"
                className="inline-flex items-center justify-center bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                <FaShoppingCart className="mr-2" /> Browse Services
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Items in Your Cart
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      key={item.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="relative w-full sm:w-24 h-24 mb-4 sm:mb-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            className="object-cover rounded-md"
                            fill
                            sizes="(max-width: 640px) 100vw, 96px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>

                        <div className="ml-0 sm:ml-6 flex-grow">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.type} • {item.language}
                          </p>
                          <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-700">
                            <span className="mb-2 sm:mb-0 sm:mr-4">
                              <span className="font-medium">Date:</span>{" "}
                              {item.date}
                            </span>
                            <span className="mb-2 sm:mb-0 sm:mr-4">
                              <span className="font-medium">Time:</span>{" "}
                              {item.time}
                            </span>
                            <span className="mb-2 sm:mb-0">
                              <span className="font-medium">Location:</span>{" "}
                              {item.location}
                            </span>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                              Duration: 2hrs • Pandits: 1
                            </span>
                            <div className="flex items-center">
                              <span className="text-lg font-bold text-indigo-600 mr-4">
                                ₹{item.price.toLocaleString()}
                              </span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium"
                                aria-label={`Remove ${item.name} from cart`}
                              >
                                <FaTrash className="mr-1.5" size={14} />
                                <span className="hidden sm:inline">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-fit sticky top-4">
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b text-gray-800">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-700">
                    <span>
                      Subtotal ({cartItems.length}{" "}
                      {cartItems.length === 1 ? "item" : "items"})
                    </span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center">
                        <FaTag className="mr-2" size={14} />
                        Discount ({discountPercentage}%)
                      </span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-4 mt-4 text-gray-900">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>

                  <div className="mt-6 py-5 border-t border-b border-gray-200">
                    <label
                      htmlFor="promo"
                      className="text-sm font-medium text-gray-700 mb-2 flex items-center"
                    >
                      <FaTag className="mr-2" size={14} /> Promo Code
                    </label>
                    {!appliedPromoCode ? (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          id="promo"
                          value={promoCode.toUpperCase()}
                          onChange={(e) =>
                            setPromoCode(e.target.value.toUpperCase())
                          }
                          className="flex-1 border rounded-md px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
                          placeholder="Enter promo code"
                          disabled={isApplying}
                        />
                        <button
                          onClick={applyPromoCode}
                          disabled={isApplying}
                          className="bg-indigo-100 text-indigo-700 font-medium px-4 py-2 rounded-md hover:bg-indigo-200 transition-colors text-sm disabled:opacity-70"
                        >
                          {isApplying ? "Applying..." : "Apply"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center bg-green-50 p-3 rounded-md">
                        <span className="text-green-600 font-medium flex items-center">
                          <FaTag className="mr-2" size={14} />
                          {appliedPromoCode} ({discountPercentage}% off)
                        </span>
                        <button
                          onClick={removePromoCode}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          aria-label="Remove promo code"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    )}
                    {promoError && (
                      <p className="text-red-500 mt-2 text-sm">{promoError}</p>
                    )}
                  </div>

                  <div className="space-y-3 mt-6">
                    <button
                      className="w-full flex items-center justify-center bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                      onClick={handleCartData}
                      disabled={isProcessing || cartItems.length === 0}
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          Proceed to Checkout <FaArrowRight className="ml-2" />
                        </>
                      )}
                    </button>

                    <button
                      onClick={clearCart}
                      className="mt-4 w-full py-2.5 px-4 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm flex items-center justify-center"
                      disabled={isProcessing}
                    >
                      <FaTrash className="mr-2" size={14} /> Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default CartPage;
