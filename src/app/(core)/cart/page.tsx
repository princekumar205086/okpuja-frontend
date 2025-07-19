"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import DebugCart from "./debug-cart";
import APITest from "./api-test";
import TokenDiagnostics from "../../components/TokenDiagnostics";

const CartPage: React.FC = () => {
  const router = useRouter();
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
    clearError,
    proceedToCheckout,
    checkDeletionStatus,
    cleanupOldPayments
  } = useCartStore();

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState<number | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Load cart items when component mounts and user is available
  useEffect(() => {
    if (user) {
      console.log('User found, fetching cart items...', user);
      fetchCartItems();
    } else {
      console.log('No user found');
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

  const handleCleanupPayments = async (cartId: number) => {
    const success = await cleanupOldPayments(cartId);
    if (success) {
      // Payments cleaned up successfully
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed with checkout');
      router.push('/login');
      return;
    }

    const canProceed = proceedToCheckout();
    if (canProceed) {
      router.push('/checkout');
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
    console.log('Loading state - showing spinner');
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
        />
        <div className="ml-4 text-gray-600">Loading cart...</div>
      </div>
    );
  }

  console.log('Cart render state:', { 
    user: !!user, 
    cartItemsLength: cartItems.length, 
    loading, 
    error,
    totalCount,
    totalAmount 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 w-full">
          <div className="flex items-center justify-between gap-2 w-full min-w-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 min-w-0">
                <FaShoppingCart className="text-orange-500 flex-shrink-0" />
                <span className="truncate">Shopping Cart</span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base truncate">
                {cartItems.length > 0 ? `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart` : 'Your cart is currently empty'}
              </p>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={loading || cartItems.some(item => !item.can_delete)}
                className={`font-medium flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 text-sm sm:text-base ml-2 ${
                  cartItems.some(item => !item.can_delete)
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                }`}
                title={cartItems.some(item => !item.can_delete) ? 'Cannot clear - some items have pending payments' : 'Clear entire cart'}
              >
                <FaTrash className="text-xs sm:text-sm" />
                <span className="hidden sm:inline">Clear Cart</span>
                <span className="sm:hidden">Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Debug Section */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
          >
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button>
          {showDebug && (
            <div className="mt-4 space-y-4">
              <TokenDiagnostics />
              <APITest />
              <DebugCart />
            </div>
          )}
        </div>
      )}

      {/* Pending Payment Warning */}
      {cartItems.some(item => !item.can_delete) && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <FaLock className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800">Items with Pending Payments</h3>
              <p className="text-amber-700 text-sm mt-1">
                Some items in your cart have pending payments and cannot be removed until the payment is completed or cancelled.
              </p>
            </div>
          </div>
        </motion.div>
      )}

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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 w-full">
        {!user ? (
          <div className="min-h-[60vh] flex items-center justify-center p-3 sm:p-4 w-full">
            <motion.div 
              className="bg-white p-6 sm:p-8 w-full max-w-sm sm:max-w-md mx-auto rounded-2xl shadow-xl text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <FaLock className="text-2xl sm:text-3xl text-orange-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">Account Required</h3>
              <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                Please sign in to your account to view your cart and proceed with checkout.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 sm:px-8 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Sign In <FaArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div 
            className="text-center py-16 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-12 w-full max-w-md mx-auto">
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
          <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6 w-full min-w-0">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 w-full"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full min-w-0">
                      {/* Service Image */}
                      <div className="w-full sm:w-48 flex-shrink-0">
                        <div className="relative w-full h-40 sm:h-32 rounded-xl overflow-hidden bg-gray-100">
                          <Image
                            src={item.puja_service?.image_url || item.astrology_service?.image_url || '/placeholder-service.jpg'}
                            alt={item.puja_service?.title || item.astrology_service?.title || 'Service'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2 w-full min-w-0">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 break-words line-clamp-2">
                              {item.puja_service?.title || item.astrology_service?.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {item.service_type === 'PUJA' ? 'Puja Service' : 'Astrology Service'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={loading || !item.can_delete}
                            className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 flex-shrink-0 ${
                              item.can_delete 
                                ? 'text-red-500 hover:text-red-700 hover:bg-red-50' 
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                            title={item.can_delete ? 'Remove item from cart' : 'Cannot remove - item has pending payments'}
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>

                        {/* Service Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4 w-full">
                          <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                            <FaCalendarAlt className="text-orange-500 flex-shrink-0" />
                            <span className="truncate">{formatDate(item.selected_date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                            <FaClock className="text-orange-500 flex-shrink-0" />
                            <span className="truncate">{item.selected_time}</span>
                          </div>
                          {item.package && (
                            <>
                              <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                                <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
                                <span className="truncate">{item.package.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                                <FaLanguage className="text-orange-500 flex-shrink-0" />
                                <span className="truncate">{item.package.language}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Package Details for Puja */}
                        {item.package && (
                          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 w-full">
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Package Details</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs sm:text-sm w-full">
                              <div className="min-w-0">
                                <span className="font-medium">Type:</span> <span className="break-words">{item.package.package_type}</span>
                              </div>
                              <div className="min-w-0">
                                <span className="font-medium">Priests:</span> <span className="break-words">{item.package.priest_count}</span>
                              </div>
                              <div className="min-w-0">
                                <span className="font-medium">Materials:</span> 
                                <span className="break-words">{item.package.includes_materials ? ' Included' : ' Not Included'}</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm mt-2 break-words">{item.package.description}</p>
                          </div>
                        )}

                        {/* Promo Code Section */}
                        <div className="border-t pt-3 sm:pt-4 w-full">
                          {item.promo_code ? (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-green-50 border border-green-200 rounded-lg p-3 gap-2 w-full">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                <span className="text-green-800 font-medium truncate">
                                  {item.promo_code.code} Applied
                                </span>
                                <span className="text-green-600 text-xs sm:text-sm whitespace-nowrap">
                                  ({item.promo_code.discount_type === 'PERCENTAGE' ? item.promo_code.discount + '%' : formatPrice(item.promo_code.discount)} off)
                                </span>
                              </div>
                              <button
                                onClick={() => handleRemovePromo(item.id)}
                                className="text-green-600 hover:text-green-800 text-xs sm:text-sm whitespace-nowrap self-start sm:self-center"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <input
                                type="text"
                                placeholder="Enter promo code"
                                value={selectedCartId === item.id ? promoCode : ''}
                                onChange={(e) => {
                                  setSelectedCartId(item.id);
                                  setPromoCode(e.target.value);
                                  setPromoError('');
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm min-w-0 w-full"
                              />
                              <button
                                onClick={() => handleApplyPromo(item.id)}
                                disabled={isApplying && selectedCartId === item.id}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                              >
                                {isApplying && selectedCartId === item.id ? 'Applying...' : 'Apply'}
                              </button>
                            </div>
                          )}
                          {promoError && selectedCartId === item.id && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1 break-words">{promoError}</p>
                          )}
                        </div>

                        {/* Price and Status */}
                        <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t w-full">
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                              {formatPrice(item.total_price)}
                            </span>
                            {!item.can_delete && (
                              <div className="flex flex-col gap-1 mt-1">
                                <span className="text-xs text-amber-600 flex items-center gap-1">
                                  <FaLock className="text-xs" />
                                  Has pending payment
                                </span>
                                <button
                                  onClick={() => handleCleanupPayments(item.id)}
                                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline text-left"
                                >
                                  Try cleanup old payments
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1 w-full">
              <div className="sticky top-24 sm:top-32 w-full">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 w-full">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 w-full">
                    <div className="flex justify-between text-gray-600 text-sm sm:text-base w-full">
                      <span>Items ({totalCount})</span>
                      <span className="font-medium">{formatPrice(totalAmount)}</span>
                    </div>
                    
                    {/* Calculate discount if any promo codes are applied */}
                    {cartItems.some(item => item.promo_code) && (
                      <div className="flex justify-between text-green-600 text-sm sm:text-base w-full">
                        <span className="truncate">Discount Applied</span>
                        <span className="font-medium whitespace-nowrap">
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

                  <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6 w-full">
                    <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 w-full">
                      <span>Total</span>
                      <span className="whitespace-nowrap">{formatPrice(totalAmount)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                  >
                    <FaCreditCard className="flex-shrink-0" />
                    <span className="truncate">Proceed to Checkout</span>
                    <FaArrowRight className="flex-shrink-0" />
                  </button>

                  <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 w-full">
                    <FaShieldAlt className="text-green-500 flex-shrink-0" />
                    <span className="text-center">Secure and encrypted payment</span>
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
