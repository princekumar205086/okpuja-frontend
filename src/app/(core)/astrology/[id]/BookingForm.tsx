'use client';

import React, { useState } from 'react';
import { AstrologyBooking, LANGUAGES } from '../types';

interface BookingFormProps {
  serviceId: string;
  serviceTitle: string;
  servicePrice: number;
  onBookingSubmit: (booking: Omit<AstrologyBooking, 'id' | 'created_at' | 'updated_at'>) => void;
  isLoading?: boolean;
}

export default function BookingForm({
  serviceId,
  serviceTitle,
  servicePrice,
  onBookingSubmit,
  isLoading = false
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    language: 'Hindi',
    preferred_date: '',
    preferred_time: '',
    birth_place: '',
    birth_date: '',
    birth_time: '',
    gender: 'MALE' as const,
    questions: '',
    contact_email: '',
    contact_phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.preferred_date) newErrors.preferred_date = 'Preferred date is required';
    if (!formData.preferred_time) newErrors.preferred_time = 'Preferred time is required';
    if (!formData.birth_place) newErrors.birth_place = 'Birth place is required';
    if (!formData.birth_date) newErrors.birth_date = 'Birth date is required';
    if (!formData.birth_time) newErrors.birth_time = 'Birth time is required';
    if (!formData.contact_email) newErrors.contact_email = 'Email is required';
    if (!formData.contact_phone) newErrors.contact_phone = 'Phone number is required';

    // Email validation
    if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.contact_phone && !/^[6-9]\d{9}$/.test(formData.contact_phone)) {
      newErrors.contact_phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const bookingData: Omit<AstrologyBooking, 'id' | 'created_at' | 'updated_at'> = {
      service: serviceId,
      status: 'PENDING',
      ...formData
    };

    onBookingSubmit(bookingData);
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Session</h2>
        <p className="text-gray-600">Fill in your details to book a consultation</p>
        <div className="mt-3 p-3 bg-orange-50 rounded-lg">
          <p className="text-sm font-medium text-orange-800">
            Service: {serviceTitle}
          </p>
          <p className="text-sm text-orange-600">
            Price: ₹{servicePrice.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Language *
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Date *
            </label>
            <input
              type="date"
              name="preferred_date"
              value={formData.preferred_date}
              onChange={handleChange}
              min={today}
              max={maxDateStr}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.preferred_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.preferred_date && (
              <p className="mt-1 text-sm text-red-600">{errors.preferred_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Time *
            </label>
            <input
              type="time"
              name="preferred_time"
              value={formData.preferred_time}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.preferred_time ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.preferred_time && (
              <p className="mt-1 text-sm text-red-600">{errors.preferred_time}</p>
            )}
          </div>
        </div>

        {/* Birth Details */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Birth Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Place *
            </label>
            <input
              type="text"
              name="birth_place"
              value={formData.birth_place}
              onChange={handleChange}
              placeholder="e.g., Mumbai, Maharashtra, India"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.birth_place ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.birth_place && (
              <p className="mt-1 text-sm text-red-600">{errors.birth_place}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date *
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.birth_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.birth_date && (
                <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Time *
              </label>
              <input
                type="time"
                name="birth_time"
                value={formData.birth_time}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.birth_time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.birth_time && (
                <p className="mt-1 text-sm text-red-600">{errors.birth_time}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* Contact Details */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.contact_email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.contact_email && (
                <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="9876543210"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.contact_phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.contact_phone && (
                <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Questions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specific Questions (Optional)
          </label>
          <textarea
            name="questions"
            value={formData.questions}
            onChange={handleChange}
            rows={3}
            placeholder="Any specific questions or areas you'd like to focus on during the consultation..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            `Book Now - ₹${servicePrice.toLocaleString('en-IN')}`
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By booking, you agree to our terms and conditions. You will receive a confirmation email shortly.
        </p>
      </form>
    </div>
  );
}
