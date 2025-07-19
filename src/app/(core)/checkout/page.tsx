"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import {
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCreditCard,
  FaShoppingCart,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaCheck,
  FaSpinner,
  FaArrowLeft
} from 'react-icons/fa';

import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useAddressStore } from '../../stores/addressStore';
import { usePaymentStore } from '../../stores/paymentStore';
import { useCheckoutStore } from '../../stores/checkoutStore';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items: cartItems, totalAmount, loading: cartLoading, fetchCartItems } = useCartStore();
  const { 
    addresses, 
    loading: addressLoading, 
    fetchAddresses, 
    createAddress, 
    deleteAddress 
  } = useAddressStore();
  const { processCartPayment, loading: paymentLoading } = usePaymentStore();
  const { 
    createCheckoutSession, 
    updateSessionStatus, 
    setPaymentUrl,
    setPaymentId,
    setBookingId,
    currentSession 
  } = useCheckoutStore();

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Address form state
  const [addressForm, setAddressForm] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false
  });

  useEffect(() => {
    if (user) {
      fetchCartItems();
      fetchAddresses();
    }
  }, [user, fetchCartItems, fetchAddresses]);

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else {
        setSelectedAddress(addresses[0].id);
      }
    }
  }, [addresses, selectedAddress]);

  const handleAddressFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!addressForm.address_line1 || !addressForm.city || !addressForm.state || !addressForm.postal_code) {
      toast.error('Please fill in all required fields');
      return;
    }

    const success = await createAddress(addressForm);
    if (success) {
      setShowAddressForm(false);
      setAddressForm({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        is_default: false
      });
      await fetchAddresses();
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const success = await deleteAddress(addressId);
      if (success) {
        if (selectedAddress === addressId) {
          setSelectedAddress(null);
        }
        await fetchAddresses();
      }
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(numPrice);
  };

  const handleProceedToPayment = async () => {
    console.log('handleProceedToPayment called - Payment-First Flow');
    console.log('Selected address:', selectedAddress);
    console.log('Cart items:', cartItems);
    
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!cartItems.length) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate cart items are all Puja services
    const invalidItems = cartItems.filter(item => item.service_type !== 'PUJA');
    if (invalidItems.length > 0) {
      toast.error('Currently, only Puja services are supported for checkout');
      return;
    }

    setProcessingPayment(true);

    try {
      // Step 1: Create checkout session for tracking
      const cartItemIds = cartItems.map(item => item.id);
      const sessionId = createCheckoutSession(cartItemIds, selectedAddress, totalAmount);
      console.log('Created checkout session:', sessionId);

      // Step 2: Process payment for cart (Payment-First Flow)
      // We'll use the first cart item for payment processing
      const firstCartItem = cartItems[0];
      
      console.log('Processing payment for cart:', firstCartItem.id);
      const paymentResponse = await processCartPayment({
        cart_id: firstCartItem.id,
        method: 'PHONEPE'
      });

      console.log('Payment creation result:', paymentResponse);

      if (paymentResponse && paymentResponse.success) {
        // Store payment info and redirect
        setPaymentUrl(sessionId, paymentResponse.payment_url);
        setPaymentId(sessionId, paymentResponse.payment_id);
        updateSessionStatus(sessionId, 'PAYMENT_INITIATED');
        
        console.log('Redirecting to payment URL:', paymentResponse.payment_url);
        
        // Store callback info in session storage for payment completion tracking
        sessionStorage.setItem('checkout_session_id', sessionId);
        sessionStorage.setItem('payment_id', paymentResponse.payment_id);
        
        // Redirect to payment gateway
        window.location.href = paymentResponse.payment_url;
      } else {
        throw new Error('Failed to create payment');
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      
      // Enhanced error handling for production payment gateway issues
      let errorMessage = 'Failed to proceed to payment';
      
      if (error.response?.data) {
        console.error('Error response data:', error.response.data);
        
        // Handle specific error cases
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.details) {
          errorMessage = error.response.data.details;
        } else if (error.response.data.cart_id) {
          errorMessage = 'Invalid cart selected. Please refresh and try again.';
          await fetchCartItems(); // Refresh cart
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(Object.values(error.response.data)[0])) {
          errorMessage = (Object.values(error.response.data)[0] as string[])[0];
        } else {
          const firstValue = Object.values(error.response.data)[0];
          errorMessage = typeof firstValue === 'string' ? firstValue : errorMessage;
        }
        
        // Special handling for production payment gateway connectivity issues
        if (error.response.status === 500) {
          if (errorMessage.includes('Payment initiation failed') || 
              errorMessage.includes('gateway') || 
              errorMessage.includes('PhonePe')) {
            errorMessage = 'Payment service is temporarily unavailable. Our team has been notified. Please try again in a few minutes or contact support.';
            
            // Show additional help for production issues
            setTimeout(() => {
              toast.error('If this issue persists, please contact support with error code: GATEWAY_CONN_ERROR', {
                duration: 8000,
              });
            }, 2000);
          } else {
            errorMessage = 'Server error occurred. Please try again in a moment.';
          }
        } else if (error.response.status === 503) {
          errorMessage = 'Payment service is temporarily down for maintenance. Please try again later.';
        } else if (error.response.status === 502 || error.response.status === 504) {
          errorMessage = 'Payment gateway connection issue. Please try again in a moment.';
        }
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = 'Network connection issue. Please check your internet connection and try again.';
      } else if (error.message) {
        if (error.message.includes('Payment initiation failed')) {
          errorMessage = 'Unable to connect to payment gateway. Please try again or contact support if this persists.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage, {
        duration: 6000,
      });
      
      // Log error for debugging
      console.error('Payment initiation error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to proceed with checkout</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (cartLoading && cartItems.length === 0) {
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some services to your cart to proceed with checkout</p>
          <button
            onClick={() => router.push('/pujaservice')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6 w-full">
          <div className="flex items-center justify-between gap-2 w-full min-w-0">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 min-w-0 flex-1">
              <button
                onClick={() => router.push('/cart')}
                className="text-gray-600 hover:text-orange-600 transition-colors p-1 sm:p-2 -ml-1 sm:-ml-2 flex-shrink-0"
              >
                <FaArrowLeft className="text-base sm:text-lg lg:text-xl" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">Checkout</h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 hidden sm:block truncate">Complete your booking</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
              <p className="text-sm sm:text-lg lg:text-2xl font-bold text-orange-600 break-words">{formatPrice(totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
          {/* Left Side - Address & Cart */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8 w-full min-w-0">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 lg:mb-6 space-y-2 sm:space-y-0 gap-2 w-full min-w-0">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 flex items-center min-w-0 flex-1">
                  <FaMapMarkerAlt className="text-orange-500 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="truncate">Delivery Address</span>
                </h2>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center w-full sm:w-auto"
                >
                  <FaPlus className="mr-2" />
                  Add New
                </button>
              </div>

              {addressLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FaSpinner className="animate-spin text-orange-500 text-2xl" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <FaHome className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No addresses found</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Add your first address
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {addresses.map((address) => (
                    <motion.div
                      key={address.id}
                      className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-all ${
                        selectedAddress === address.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddress(address.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-2 flex-wrap gap-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                              selectedAddress === address.id
                                ? 'border-orange-500 bg-orange-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedAddress === address.id && (
                                <FaCheck className="text-white text-xs m-auto" />
                              )}
                            </div>
                            {address.is_default && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-gray-800 text-sm sm:text-base break-words">{address.address_line1}</p>
                          {address.address_line2 && (
                            <p className="text-gray-600 text-sm break-words">{address.address_line2}</p>
                          )}
                          <p className="text-gray-600 text-sm">
                            {address.city}, {address.state} {address.postal_code}
                          </p>
                          <p className="text-gray-600 text-sm">{address.country}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Edit functionality can be added here
                            }}
                            className="text-gray-400 hover:text-orange-500 transition-colors p-1"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(address.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Add Address Form */}
              {showAddressForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 border-t pt-6"
                >
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Address</h3>
                  <form onSubmit={handleAddressFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.address_line1}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, address_line1: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="House number, building name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={addressForm.address_line2}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, address_line2: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Street, area, landmark"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.state}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.postal_code}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, postal_code: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.country}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.is_default}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, is_default: e.target.checked }))}
                        className="mr-2"
                      />
                      <label htmlFor="isDefault" className="text-sm text-gray-700">
                        Set as default address
                      </label>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={addressLoading}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {addressLoading ? 'Adding...' : 'Add Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <FaShoppingCart className="text-orange-500 mr-2 sm:mr-3 text-lg sm:text-xl" />
                Order Summary ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 text-sm sm:text-base break-words">
                          {item.service_type === 'PUJA' ? item.puja_service?.title : item.astrology_service?.title}
                        </h3>
                        {item.service_type === 'PUJA' && item.package && (
                          <div className="mt-2 text-xs sm:text-sm text-gray-600 space-y-1">
                            <p>📍 {item.package.location}</p>
                            <p>🗣️ {item.package.language}</p>
                            <p>📦 {item.package.package_type}</p>
                          </div>
                        )}
                        <div className="mt-2 flex flex-wrap items-center text-xs sm:text-sm text-gray-600 gap-2 sm:gap-4">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-1 sm:mr-2" />
                            {moment(item.selected_date).format('DD MMM YYYY')}
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-1 sm:mr-2" />
                            {item.selected_time}
                          </div>
                        </div>
                        {item.promo_code && (
                          <div className="mt-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Promo: {item.promo_code.code} (-{item.promo_code.discount}%)
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right sm:ml-4">
                        <p className="text-base sm:text-lg font-bold text-orange-600">{formatPrice(item.total_price)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - User Info & Payment (Mobile: shows at bottom) */}
          <div className="lg:col-span-1 space-y-6 lg:space-y-8">
            {/* User Information */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <FaUser className="text-orange-500 mr-2 sm:mr-3 text-lg sm:text-xl" />
                Contact Information
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center">
                  <FaUser className="text-gray-400 mr-2 sm:mr-3 text-sm sm:text-base" />
                  <span className="text-gray-700 text-sm sm:text-base break-all">{user.full_name || user.email}</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 mr-2 sm:mr-3 text-sm sm:text-base" />
                  <span className="text-gray-700 text-sm sm:text-base break-all">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center">
                    <FaPhone className="text-gray-400 mr-2 sm:mr-3 text-sm sm:text-base" />
                    <span className="text-gray-700 text-sm sm:text-base">{user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <FaCreditCard className="text-orange-500 mr-2 sm:mr-3 text-lg sm:text-xl" />
                Payment Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-base sm:text-lg font-bold text-gray-800">Total</span>
                    <span className="text-base sm:text-lg font-bold text-orange-600">{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={!selectedAddress || processingPayment || paymentLoading}
                className="w-full mt-4 sm:mt-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-colors flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {processingPayment || paymentLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard className="mr-2" />
                    Pay with PhonePe
                  </>
                )}
              </button>

              {/* Validation Message */}
              {!selectedAddress && (
                <p className="text-xs sm:text-sm text-red-500 text-center mt-2">
                  Please select a delivery address to proceed
                </p>
              )}

              <p className="text-xs text-gray-500 text-center mt-3">
                🔒 Secure payment powered by PhonePe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
