'use client';

import React, { useState } from 'react';
import { Package } from '../../types';
import { Calendar, Clock, Phone, Mail, MapPin, User } from 'lucide-react';

interface BookingFormProps {
  selectedPackage: Package | null;
  serviceName: string;
  onSubmit: (bookingData: any) => void;
}

export default function BookingForm({ selectedPackage, serviceName, onSubmit }: BookingFormProps) {
  const [formData, setFormData] = useState({
    booking_date: '',
    start_time: '',
    contact_name: '',
    contact_number: '',
    contact_email: '',
    address: '',
    special_instructions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.booking_date) newErrors.booking_date = 'Date is required';
    if (!formData.start_time) newErrors.start_time = 'Time is required';
    if (!formData.contact_name) newErrors.contact_name = 'Name is required';
    if (!formData.contact_number) newErrors.contact_number = 'Phone number is required';
    if (!formData.contact_email) newErrors.contact_email = 'Email is required';
    if (!formData.address) newErrors.address = 'Address is required';

    // Validate email format
    if (formData.contact_email && !/\S+@\S+\.\S+/.test(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email';
    }

    // Validate phone number format (basic)
    if (formData.contact_number && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.contact_number)) {
      newErrors.contact_number = 'Please enter a valid phone number';
    }

    // Validate date (should be future date)
    if (formData.booking_date) {
      const selectedDate = new Date(formData.booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.booking_date = 'Please select a future date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) {
      alert('Please select a package first');
      return;
    }

    if (validateForm()) {
      onSubmit({
        ...formData,
        package_id: selectedPackage.id,
        service_name: serviceName
      });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Book Your Puja</h3>
      
      {selectedPackage ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selected Package Summary */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-orange-900 mb-2">Selected Package</h4>
            <div className="text-sm text-orange-800">
              <p>{serviceName}</p>
              <p className="font-semibold">₹{parseFloat(selectedPackage.price).toLocaleString()} - {selectedPackage.package_type}</p>
              <p>{selectedPackage.location}</p>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Preferred Date *
              </label>
              <input
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleInputChange}
                min={today}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.booking_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.booking_date && (
                <p className="text-red-500 text-sm mt-1">{errors.booking_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Preferred Time *
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.start_time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.start_time && (
                <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Full Name *
            </label>
            <input
              type="text"
              name="contact_name"
              value={formData.contact_name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.contact_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.contact_name && (
              <p className="text-red-500 text-sm mt-1">{errors.contact_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              placeholder="+91 9876543210"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.contact_number ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.contact_number && (
              <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.contact_email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.contact_email && (
              <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Complete Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter your complete address where the puja will be conducted"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              name="special_instructions"
              value={formData.special_instructions}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any special requirements or instructions for the priest"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Book Now - ₹{parseFloat(selectedPackage.price).toLocaleString()}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By booking, you agree to our terms and conditions. 
            You will receive a confirmation call within 2 hours.
          </p>
        </form>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Please select a package to proceed with booking</p>
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
}
