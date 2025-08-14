/**
 * Example usage of the Profile Management System
 * This file demonstrates how to use the profile components
 */

'use client';

import React from 'react';
import {
  ProfileHeader,
  PersonalInfo,
  AddressManager,
  PanCardManager,
  LoadingSkeleton,
  ErrorBoundary,
  useResponsive
} from '../index';

// Example 1: Full Profile Page
export function FullProfilePage() {
  const { isMobile } = useResponsive();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <ProfileHeader />

          {/* Profile Sections */}
          <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {/* Left Column */}
            <div className="space-y-8">
              <ErrorBoundary>
                <PersonalInfo />
              </ErrorBoundary>
              
              <ErrorBoundary>
                <PanCardManager />
              </ErrorBoundary>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <ErrorBoundary>
                <AddressManager />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 2: Individual Component Usage
export function IndividualComponentExample() {
  return (
    <div className="space-y-6 p-6">
      {/* Just the profile header */}
      <ProfileHeader className="mb-6" />
      
      {/* Just personal info */}
      <PersonalInfo className="max-w-2xl" />
      
      {/* Just address manager */}
      <AddressManager className="max-w-4xl" />
    </div>
  );
}

// Example 3: Custom Layout with Error Boundaries
export function CustomLayoutExample() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
      {/* Sidebar - Profile Header */}
      <div className="xl:col-span-1">
        <ErrorBoundary error={null}>
          <ProfileHeader />
        </ErrorBoundary>
      </div>

      {/* Main Content */}
      <div className="xl:col-span-2 space-y-6">
        <ErrorBoundary error={null}>
          <PersonalInfo />
        </ErrorBoundary>
        
        <ErrorBoundary error={null}>
          <AddressManager />
        </ErrorBoundary>
        
        <ErrorBoundary error={null}>
          <PanCardManager />
        </ErrorBoundary>
      </div>
    </div>
  );
}

// Example 4: Mobile-First Responsive Layout
export function MobileFirstExample() {
  const { screenSize } = useResponsive();

  const getLayout = () => {
    switch (screenSize) {
      case 'mobile':
        return 'space-y-4';
      case 'tablet':
        return 'space-y-6';
      case 'desktop':
        return 'grid grid-cols-2 gap-8';
      default:
        return 'space-y-6';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Always full width on mobile */}
      <ProfileHeader className="mb-6" />
      
      <div className={getLayout()}>
        <div className="space-y-6">
          <PersonalInfo />
          {screenSize === 'mobile' && <PanCardManager />}
        </div>
        
        <div className="space-y-6">
          <AddressManager />
          {screenSize !== 'mobile' && <PanCardManager />}
        </div>
      </div>
    </div>
  );
}

// Example 5: With Loading States
export function WithLoadingStatesExample() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <ProfileHeader />
      <PersonalInfo />
      <AddressManager />
      <PanCardManager />
    </div>
  );
}

// Example 6: With Custom Error Handling
export function WithCustomErrorHandlingExample() {
  const [hasError, setHasError] = React.useState(false);

  const handleRetry = () => {
    setHasError(false);
    // Implement retry logic
  };

  if (hasError) {
    return (
      <ErrorBoundary
        error="Failed to load profile data"
        onRetry={handleRetry}
        className="m-6"
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <ProfileHeader />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalInfo />
        <AddressManager />
      </div>
      <PanCardManager />
    </div>
  );
}

// Example 7: Integration with Custom Form
export function CustomFormIntegrationExample() {
  const [activeTab, setActiveTab] = React.useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'address', label: 'Addresses' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <div className="p-6">
      {/* Profile Header */}
      <ProfileHeader className="mb-8" />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl">
        {activeTab === 'personal' && <PersonalInfo />}
        {activeTab === 'address' && <AddressManager />}
        {activeTab === 'documents' && <PanCardManager />}
      </div>
    </div>
  );
}

export default {
  FullProfilePage,
  IndividualComponentExample,
  CustomLayoutExample,
  MobileFirstExample,
  WithLoadingStatesExample,
  WithCustomErrorHandlingExample,
  CustomFormIntegrationExample,
};
