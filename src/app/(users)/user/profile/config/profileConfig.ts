/**
 * Profile Management System Configuration
 * Enterprise-level configuration for the user profile system
 */

export const ProfileConfig = {
  // File upload constraints
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB in bytes
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    allowedImageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    maxImageDimensions: {
      width: 2048,
      height: 2048
    },
    thumbnailSize: {
      width: 300,
      height: 300
    }
  },

  // Form validation settings
  validation: {
    name: {
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s]+$/
    },
    pan: {
      pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      length: 10
    },
    pincode: {
      pattern: /^\d{6}$/,
      length: 6
    },
    address: {
      minLength: 5,
      maxLength: 255
    },
    age: {
      min: 13,
      max: 120
    }
  },

  // API configuration
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.okpuja.com/api',
    endpoints: {
      profile: '/auth/profile/',
      addresses: '/auth/addresses/',
      pancard: '/auth/pancard/',
      profilePicture: '/auth/profile/picture/'
    },
    external: {
      postalAPI: 'https://api.postalpincode.in/pincode',
      nominatimAPI: 'https://nominatim.openstreetmap.org/reverse'
    }
  },

  // UI/UX settings
  ui: {
    animations: {
      duration: 200, // milliseconds
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1280
    },
    notifications: {
      duration: 5000, // 5 seconds
      position: 'top-right'
    },
    skeleton: {
      animationDuration: 1200 // milliseconds
    }
  },

  // Feature flags
  features: {
    enableProfilePicture: true,
    enableAddressGeolocation: true,
    enablePanCardUpload: true,
    enableRealTimeValidation: true,
    enableOfflineSupport: false,
    enableAnalytics: false,
    enableA11yMode: true
  },

  // Security settings
  security: {
    enableCSRF: true,
    enableXSSProtection: true,
    sanitizeInputs: true,
    validateFileTypes: true,
    maxUploadAttempts: 3
  },

  // Localization
  localization: {
    defaultLocale: 'en-IN',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    timezone: 'Asia/Kolkata'
  },

  // Performance settings
  performance: {
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCaching: true,
    cacheTimeout: 300000, // 5 minutes
    debounceDelay: 300 // milliseconds for search inputs
  },

  // Default values
  defaults: {
    country: 'India',
    profilePictureAlt: 'Profile Picture',
    maxAddresses: 5,
    addressTypes: ['Home', 'Work', 'Other']
  },

  // Error messages
  errorMessages: {
    network: 'Network error. Please check your connection and try again.',
    server: 'Server error. Please try again later.',
    validation: 'Please check your input and try again.',
    upload: 'File upload failed. Please try again.',
    generic: 'Something went wrong. Please try again.'
  },

  // Success messages
  successMessages: {
    profileUpdated: 'Profile updated successfully!',
    addressAdded: 'Address added successfully!',
    addressUpdated: 'Address updated successfully!',
    addressDeleted: 'Address deleted successfully!',
    panCardUpdated: 'PAN card updated successfully!',
    pictureUploaded: 'Profile picture updated successfully!'
  }
};

// Type definitions for configuration
export type ProfileConfigType = typeof ProfileConfig;

// Environment-specific overrides
export const getProfileConfig = (): ProfileConfigType => {
  const config = { ...ProfileConfig };
  
  // Development environment overrides
  if (process.env.NODE_ENV === 'development') {
    config.api.timeout = 60000; // Longer timeout for development
    config.performance.enableCaching = false; // Disable caching in development
  }
  
  // Production environment overrides
  if (process.env.NODE_ENV === 'production') {
    config.features.enableAnalytics = true; // Enable analytics in production
    config.security.enableCSRF = true; // Ensure CSRF is enabled
  }
  
  // Test environment overrides
  if (process.env.NODE_ENV === 'test') {
    config.api.timeout = 5000; // Shorter timeout for tests
    config.ui.animations.duration = 0; // Disable animations in tests
    config.ui.notifications.duration = 100; // Faster notifications in tests
  }
  
  return config;
};

export default ProfileConfig;
