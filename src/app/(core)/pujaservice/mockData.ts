import { PujaCategory, PujaService, Package } from './types';

export const mockCategories: PujaCategory[] = [
  { id: 1, name: 'Ganesha Puja', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 2, name: 'Lakshmi Puja', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 3, name: 'Saraswati Puja', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 4, name: 'Shiva Puja', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 5, name: 'Durga Puja', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 6, name: 'Navgraha Puja', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 7, name: 'Satyanarayan Puja', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 8, name: 'Griha Pravesh Puja', created_at: '2024-01-01', updated_at: '2024-01-01' },
];

export const mockPackages: Package[] = [
  {
    id: 1,
    puja_service: 1,
    location: 'Mumbai',
    language: 'HINDI',
    package_type: 'BASIC',
    price: '2500.00',
    description: 'Basic Ganesha Puja with essential rituals',
    includes_materials: false,
    priest_count: 1,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 2,
    puja_service: 1,
    location: 'Mumbai',
    language: 'HINDI',
    package_type: 'PREMIUM',
    price: '5500.00',
    description: 'Premium Ganesha Puja with all materials included',
    includes_materials: true,
    priest_count: 2,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 3,
    puja_service: 2,
    location: 'Delhi',
    language: 'SANSKRIT',
    package_type: 'STANDARD',
    price: '3500.00',
    description: 'Standard Lakshmi Puja for prosperity',
    includes_materials: true,
    priest_count: 1,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
];

export const mockPujaServices: PujaService[] = [
  {
    id: 1,
    title: 'Ganesha Puja - Obstacle Remover',
    image: '/astrology_image/1719873166520-_fb9d8287-b465-4a48-a7b7-7659afd774c4.jpeg',
    image_thumbnail: '/astrology_image/1719873166520-_fb9d8287-b465-4a48-a7b7-7659afd774c4.jpeg',
    image_card: '/astrology_image/1719873166520-_fb9d8287-b465-4a48-a7b7-7659afd774c4.jpeg',
    description: 'Lord Ganesha is worshipped as the remover of obstacles and the patron of arts and sciences. This puja brings prosperity, wisdom, and success in all endeavors.',
    category: mockCategories[0],
    type: 'HOME',
    duration_minutes: 120,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    packages: mockPackages.filter(p => p.puja_service === 1)
  },
  {
    id: 2,
    title: 'Lakshmi Puja - Wealth & Prosperity',
    image: '/astrology_image/1719873424564-kalash.jpg',
    image_thumbnail: '/astrology_image/1719873424564-kalash.jpg',
    image_card: '/astrology_image/1719873424564-kalash.jpg',
    description: 'Goddess Lakshmi puja is performed to attract wealth, prosperity, and abundance. This sacred ritual brings financial stability and material comforts.',
    category: mockCategories[1],
    type: 'HOME',
    duration_minutes: 90,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    packages: mockPackages.filter(p => p.puja_service === 2)
  },
  {
    id: 3,
    title: 'Saraswati Puja - Knowledge & Wisdom',
    image: '/astrology_image/1719873508106-marriage.jpeg',
    image_thumbnail: '/astrology_image/1719873508106-marriage.jpeg',
    image_card: '/astrology_image/1719873508106-marriage.jpeg',
    description: 'Goddess Saraswati puja enhances knowledge, wisdom, and learning abilities. Perfect for students, artists, and knowledge seekers.',
    category: mockCategories[2],
    type: 'TEMPLE',
    duration_minutes: 75,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    packages: []
  },
  {
    id: 4,
    title: 'Mahamrityunjaya Puja - Health & Protection',
    image: '/astrology_image/1719873855062-marriage.jpeg',
    image_thumbnail: '/astrology_image/1719873855062-marriage.jpeg',
    image_card: '/astrology_image/1719873855062-marriage.jpeg',
    description: 'This powerful Shiva puja provides protection from negative energies, promotes healing, and ensures long life and good health.',
    category: mockCategories[3],
    type: 'HOME',
    duration_minutes: 150,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    packages: []
  },
  {
    id: 5,
    title: 'Durga Puja - Divine Protection',
    image: '/astrology_image/1719874036635-_bc717e95-309f-45ca-a716-ee76080d280b.jpeg',
    image_thumbnail: '/astrology_image/1719874036635-_bc717e95-309f-45ca-a716-ee76080d280b.jpeg',
    image_card: '/astrology_image/1719874036635-_bc717e95-309f-45ca-a716-ee76080d280b.jpeg',
    description: 'Goddess Durga puja offers divine protection from all evils and negativity. It empowers devotees with strength and courage.',
    category: mockCategories[4],
    type: 'TEMPLE',
    duration_minutes: 180,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    packages: []
  },
  {
    id: 6,
    title: 'Navgraha Puja - Planetary Peace',
    image: '/astrology_image/1719874152890-_951f3e0d-7cfb-46be-a282-c54c5c4093f1.jpeg',
    image_thumbnail: '/astrology_image/1719874152890-_951f3e0d-7cfb-46be-a282-c54c5c4093f1.jpeg',
    image_card: '/astrology_image/1719874152890-_951f3e0d-7cfb-46be-a282-c54c5c4093f1.jpeg',
    description: 'Navgraha puja pacifies all nine planets and brings harmony in life. It reduces malefic effects and enhances positive planetary influences.',
    category: mockCategories[5],
    type: 'ONLINE',
    duration_minutes: 200,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    packages: []
  },
  {
    id: 7,
    title: 'Satyanarayan Puja - Wish Fulfillment',
    image: '/astrology_image/1719949344992-Astrology Chart Reading.jpeg',
    image_thumbnail: '/astrology_image/1719949344992-Astrology Chart Reading.jpeg',
    image_card: '/astrology_image/1719949344992-Astrology Chart Reading.jpeg',
    description: 'Lord Vishnu\'s Satyanarayan puja fulfills desires and brings happiness, peace, and prosperity to the family.',
    category: mockCategories[6],
    type: 'HOME',
    duration_minutes: 135,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    packages: []
  },
  {
    id: 8,
    title: 'Griha Pravesh Puja - New Home Blessing',
    image: '/astrology_image/1719949430249-Astrology Chart Reading.jpeg',
    image_thumbnail: '/astrology_image/1719949430249-Astrology Chart Reading.jpeg',
    image_card: '/astrology_image/1719949430249-Astrology Chart Reading.jpeg',
    description: 'Sacred ritual performed before entering a new home. It purifies the space and invites positive energies for a happy life.',
    category: mockCategories[7],
    type: 'HOME',
    duration_minutes: 90,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    packages: []
  },
  {
    id: 9,
    title: 'Kaal Sarp Dosh Puja - Remedy Ritual',
    image: '/astrology_image/1719950441017-Astrology Chart Reading.jpeg',
    image_thumbnail: '/astrology_image/1719950441017-Astrology Chart Reading.jpeg',
    image_card: '/astrology_image/1719950441017-Astrology Chart Reading.jpeg',
    description: 'Special puja to neutralize Kaal Sarp Dosh effects. Brings relief from obstacles and promotes spiritual growth.',
    category: mockCategories[3],
    type: 'TEMPLE',
    duration_minutes: 240,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    packages: []
  },
  {
    id: 10,
    title: 'Rudrabhishek Puja - Shiva Blessing',
    image: '/astrology_image/1719950490438-Astrology Chart Reading.jpeg',
    image_thumbnail: '/astrology_image/1719950490438-Astrology Chart Reading.jpeg',
    image_card: '/astrology_image/1719950490438-Astrology Chart Reading.jpeg',
    description: 'Sacred ablution of Lord Shiva for health, prosperity, and spiritual advancement. Removes negativity and grants peace.',
    category: mockCategories[3],
    type: 'HOME',
    duration_minutes: 105,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    packages: []
  }
];

export const typeDisplayNames = {
  HOME: 'At Home',
  TEMPLE: 'At Temple', 
  ONLINE: 'Online'
};

export const languageDisplayNames = {
  HINDI: 'Hindi',
  ENGLISH: 'English',
  SANSKRIT: 'Sanskrit',
  REGIONAL: 'Regional'
};

export const packageTypeDisplayNames = {
  BASIC: 'Basic',
  STANDARD: 'Standard',
  PREMIUM: 'Premium',
  CUSTOM: 'Custom'
};
