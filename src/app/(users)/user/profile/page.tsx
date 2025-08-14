'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { useProfileStore } from '../../../stores/profileStore';

// Components
import { ProfileHeader } from './components/ProfileHeader';
import { PersonalInfo } from './components/PersonalInfo';
import { AddressManager } from './components/AddressManager';
import { PanCardManager } from './components/PanCardManager';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorBoundary from './components/ErrorBoundary';

export default function UserProfile() {
  const { user, loading: authLoading } = useAuthStore();
  const { 
    fetchProfile, 
    fetchAddresses, 
    fetchPanCard,
    profileLoading,
    addressesLoading,
    panCardLoading,
    profileError,
    addressesError,
    panCardError,
    clearErrors
  } = useProfileStore();
  
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const initializeProfile = async () => {
      if (user) {
        setInitialLoading(true);
        
        // Fetch all profile data in parallel
        await Promise.allSettled([
          fetchProfile(),
          fetchAddresses(),
          fetchPanCard()
        ]);
        
        setInitialLoading(false);
      }
    };

    initializeProfile();
  }, [user, fetchProfile, fetchAddresses, fetchPanCard]);

  const handleRetry = () => {
    clearErrors();
    fetchProfile();
    fetchAddresses();
    fetchPanCard();
  };

  // Show loading skeleton during initial load
  if (authLoading || initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Profile Settings
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account information and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <ProfileHeader />

          {/* Profile Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Personal Information */}
              <ErrorBoundary 
                error={profileError} 
                onRetry={handleRetry}
              >
                <PersonalInfo />
              </ErrorBoundary>

              {/* PAN Card Management */}
              <ErrorBoundary 
                error={panCardError} 
                onRetry={handleRetry}
              >
                <PanCardManager />
              </ErrorBoundary>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Address Management */}
              <ErrorBoundary 
                error={addressesError} 
                onRetry={handleRetry}
              >
                <AddressManager />
              </ErrorBoundary>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                Contact our support team if you need assistance with your profile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@okpuja.com"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  Email Support
                </a>
                <a
                  href="tel:+91-XXX-XXX-XXXX"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  Call Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}