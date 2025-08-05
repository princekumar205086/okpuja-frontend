export interface AstrologyService {
  id: number;
  title: string;
  service_type: 'HOROSCOPE' | 'MATCHING' | 'PREDICTION' | 'REMEDIES' | 'GEMSTONE' | 'VAASTU';
  description: string;
  image_url?: string;
  image_thumbnail_url?: string;
  image_card_url?: string;
  price: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AstrologyBooking {
  id?: number;
  user?: string;
  service: number;
  language: string;
  preferred_date: string;
  preferred_time: string;
  birth_place: string;
  birth_date: string;
  birth_time: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  questions?: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'; // PENDING removed as per backend changes
  contact_email: string;
  contact_phone: string;
  created_at?: string;
  updated_at?: string;
  astro_book_id?: string; // New field from backend
  payment_id?: string; // New field from backend
}

export interface AstrologyServiceFilters {
  search: string;
  service_type: string;
  price_range: string;
  duration: string;
  sortBy: 'title' | 'price' | 'duration_minutes' | 'created_at';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ServiceType {
  value: string;
  label: string;
  description: string;
  icon: string;
}

export const SERVICE_TYPES: ServiceType[] = [
  {
    value: 'HOROSCOPE',
    label: 'Horoscope Analysis',
    description: 'Detailed birth chart analysis and predictions',
    icon: '🌟'
  },
  {
    value: 'MATCHING',
    label: 'Kundali Matching',
    description: 'Compatibility analysis for marriage',
    icon: '💑'
  },
  {
    value: 'PREDICTION',
    label: 'Future Prediction',
    description: 'Insights into your future path',
    icon: '🔮'
  },
  {
    value: 'REMEDIES',
    label: 'Astrological Remedies',
    description: 'Solutions for life challenges',
    icon: '🕯️'
  },
  {
    value: 'GEMSTONE',
    label: 'Gemstone Recommendation',
    description: 'Personalized gemstone guidance',
    icon: '💎'
  },
  {
    value: 'VAASTU',
    label: 'Vaastu Consultation',
    description: 'Home and office space harmony',
    icon: '🏠'
  }
];

export const PRICE_RANGES = [
  { value: '', label: 'All Prices' },
  { value: '0-500', label: 'Under ₹500' },
  { value: '500-1000', label: '₹500 - ₹1000' },
  { value: '1000-2000', label: '₹1000 - ₹2000' },
  { value: '2000-5000', label: '₹2000 - ₹5000' },
  { value: '5000+', label: 'Above ₹5000' }
];

export const DURATION_OPTIONS = [
  { value: '', label: 'Any Duration' },
  { value: '15-30', label: '15-30 minutes' },
  { value: '30-45', label: '30-45 minutes' },
  { value: '45-60', label: '45-60 minutes' },
  { value: '60+', label: '60+ minutes' }
];

export const LANGUAGES = [
  'Hindi',
  'English',
  'Bengali',
  'Tamil',
  'Telugu',
  'Marathi',
  'Gujarati',
  'Kannada',
  'Malayalam',
  'Punjabi'
];
