// Indian States and Union Territories list
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// Package duration and priest configuration based on package type
export const PACKAGE_CONFIG = {
  BASIC: {
    priests: 1,
    duration: 1.5, // hours
    description: '1 Priest, 1.5 hours duration'
  },
  STANDARD: {
    priests: 2,
    duration: 2.5, // hours
    description: '2 Priests, 2.5 hours duration'
  },
  PREMIUM: {
    priests: 4,
    duration: 4, // hours
    description: '4+ Priests, 4+ hours duration'
  },
  CUSTOM: {
    priests: 'Variable',
    duration: 'Variable',
    description: 'Custom configuration as per requirements'
  }
} as const;

export type PackageConfigType = keyof typeof PACKAGE_CONFIG;
