"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaShoppingCart, 
  FaTrash, 
  FaLock, 
  FaArrowRight, 
  FaEdit,
  FaTimes,
  FaPercent,
  FaClock,
  FaMapMarkerAlt,
  FaLanguage,
  FaUser,
  FaCalendarAlt,
  FaTag,
  FaCheckCircle,
  FaCreditCard,
  FaShieldAlt
} from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore, CartItem } from "../../stores/cartStore";
import { toast } from "react-hot-toast";
import moment from "moment";

const CartPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    items: cartItems,
    totalCount,
    totalAmount,
    loading,
    error,
    fetchCartItems,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
    clearError
  } = useCartStore();

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState<number | null>(null);

  // Load cart items when component mounts and user is available
  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user, fetchCartItems]);

  // Clear errors after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleRemoveItem = async (id: number) => {
    const success = await removeFromCart(id);
    if (success) {
      // Item removed successfully
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      const success = await clearCart();
      if (success) {
        // Cart cleared successfully
      }
    }
  };

  const handleApplyPromo = async (cartId: number) => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setIsApplying(true);
    setPromoError("");
    setSelectedCartId(cartId);

    const success = await applyPromoCode(cartId, promoCode);
    if (success) {
      setPromoCode("");
    } else {
      setPromoError("Failed to apply promo code");
    }
    
    setIsApplying(false);
    setSelectedCartId(null);
  };

  const handleRemovePromo = async (cartId: number) => {
    const success = await removePromoCode(cartId);
    if (success) {
      // Promo removed successfully
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(numPrice);
  };

  const formatDate = (date: string) => {
    return moment(date).format('DD MMM YYYY');
  };

  const formatTime = (time: string) => {
    return moment(time, 'HH:mm').format('hh:mm A');
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

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
                onClick={handleClearCart}
                disabled={loading}
                className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                <FaTrash className="text-sm" />
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              <FaTimes />
            </button>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
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
                Please sign in to your account to view your cart and proceed with checkout.
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
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Service Image */}
                      <div className="lg:w-48 flex-shrink-0">
                        <div className="relative w-full h-40 lg:h-32 rounded-xl overflow-hidden bg-gray-100">
                          <Image
                            src={item.puja_service?.image_url || item.astrology_service?.image_url || '/placeholder-service.jpg'}
                            alt={item.puja_service?.title || item.astrology_service?.title || 'Service'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {item.puja_service?.title || item.astrology_service?.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {item.service_type === 'PUJA' ? 'Puja Service' : 'Astrology Service'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={loading}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>

                        {/* Service Info Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaCalendarAlt className="text-orange-500" />
                            <span>{formatDate(item.selected_date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaClock className="text-orange-500" />
                            <span>{item.selected_time}</span>
                          </div>
                          {item.package && (
                            <>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaMapMarkerAlt className="text-orange-500" />
                                <span>{item.package.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaLanguage className="text-orange-500" />
                                <span>{item.package.language}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Package Details for Puja */}
                        {item.package && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Package Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Type:</span> {item.package.package_type}
                              </div>
                              <div>
                                <span className="font-medium">Priests:</span> {item.package.priest_count}
                              </div>
                              <div>
                                <span className="font-medium">Materials:</span> 
                                {item.package.includes_materials ? ' Included' : ' Not Included'}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">{item.package.description}</p>
                          </div>
                        )}

                        {/* Promo Code Section */}
                        <div className="border-t pt-4">
                          {item.promo_code ? (
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <FaCheckCircle className="text-green-500" />
                                <span className="text-green-800 font-medium">
                                  {item.promo_code.code} Applied
                                </span>
                                <span className="text-green-600 text-sm">
                                  ({item.promo_code.discount_type === 'PERCENTAGE' ? item.promo_code.discount + '%' : formatPrice(item.promo_code.discount)} off)
                                </span>
                              </div>
                              <button
                                onClick={() => handleRemovePromo(item.id)}
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Enter promo code"
                                value={selectedCartId === item.id ? promoCode : ''}
                                onChange={(e) => {
                                  setSelectedCartId(item.id);
                                  setPromoCode(e.target.value);
                                  setPromoError('');
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                              />
                              <button
                                onClick={() => handleApplyPromo(item.id)}
                                disabled={isApplying && selectedCartId === item.id}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 text-sm font-medium"
                              >
                                {isApplying && selectedCartId === item.id ? 'Applying...' : 'Apply'}
                              </button>
                            </div>
                          )}
                          {promoError && selectedCartId === item.id && (
                            <p className="text-red-500 text-sm mt-1">{promoError}</p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(item.total_price)}
                          </span>
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
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Items ({totalCount})</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                    
                    {/* Calculate discount if any promo codes are applied */}
                    {cartItems.some(item => item.promo_code) && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount Applied</span>
                        <span>
                          -{formatPrice(
                            cartItems.reduce((total, item) => {
                              if (item.promo_code) {
                                const originalPrice = parseFloat(item.total_price);
                                const discount = item.promo_code.discount_type === 'PERCENTAGE' 
                                  ? (originalPrice * parseFloat(item.promo_code.discount)) / 100
                                  : parseFloat(item.promo_code.discount);
                                return total + discount;
                              }
                              return total;
                            }, 0)
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3">
                    <FaCreditCard />
                    Proceed to Checkout
                    <FaArrowRight />
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <FaShieldAlt className="text-green-500" />
                    Secure and encrypted payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
