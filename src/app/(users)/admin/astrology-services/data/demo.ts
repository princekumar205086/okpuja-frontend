/**
 * Demo data for testing the Astrology Services interface
 * This file contains sample data that matches the backend API structure
 */

import { AstrologyService } from '@/app/stores/astrologyServiceStore';

export const demoAstrologyServices: AstrologyService[] = [
  {
    id: 1,
    title: "Complete Birth Chart Analysis",
    service_type: "HOROSCOPE",
    description: "Comprehensive analysis of your birth chart including planetary positions, houses, and their effects on your life. Our expert astrologers will provide detailed insights into your personality, strengths, weaknesses, and life path.",
    image_url: "https://ik.imagekit.io/okpuja/astrology/services/service_1_horoscope.png",
    image_thumbnail_url: "https://ik.imagekit.io/okpuja/astrology/services/thumbnails/thumb_service_1_horoscope.png",
    image_card_url: "https://ik.imagekit.io/okpuja/astrology/services/cards/card_service_1_horoscope.png",
    price: "999.00",
    duration_minutes: 60,
    is_active: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:45:00Z"
  },
  {
    id: 2,
    title: "Kundali Matching for Marriage",
    service_type: "MATCHING",
    description: "Traditional Kundali matching service for prospective couples. We analyze compatibility based on Ashtakoota method, Mangal Dosha, and other important factors to ensure a harmonious married life.",
    image_url: "https://ik.imagekit.io/okpuja/astrology/services/service_2_matching.png",
    image_thumbnail_url: "https://ik.imagekit.io/okpuja/astrology/services/thumbnails/thumb_service_2_matching.png",
    image_card_url: "https://ik.imagekit.io/okpuja/astrology/services/cards/card_service_2_matching.png",
    price: "750.00",
    duration_minutes: 45,
    is_active: true,
    created_at: "2024-01-16T09:15:00Z",
    updated_at: "2024-01-22T11:30:00Z"
  },
  {
    id: 3,
    title: "Career and Business Predictions",
    service_type: "PREDICTION",
    description: "Get insights into your career path, business opportunities, and financial prospects. Our predictions help you make informed decisions about job changes, business ventures, and investment timing.",
    image_url: "https://ik.imagekit.io/okpuja/astrology/services/service_3_prediction.png",
    image_thumbnail_url: "https://ik.imagekit.io/okpuja/astrology/services/thumbnails/thumb_service_3_prediction.png",
    image_card_url: "https://ik.imagekit.io/okpuja/astrology/services/cards/card_service_3_prediction.png",
    price: "1250.00",
    duration_minutes: 75,
    is_active: true,
    created_at: "2024-01-17T16:20:00Z",
    updated_at: "2024-01-25T09:10:00Z"
  },
  {
    id: 4,
    title: "Astrological Remedies & Solutions",
    service_type: "REMEDIES",
    description: "Personalized remedies to overcome obstacles and challenges in life. Includes gemstone recommendations, mantra suggestions, puja guidance, and lifestyle modifications based on your planetary positions.",
    image_url: "https://ik.imagekit.io/okpuja/astrology/services/service_4_remedies.png",
    image_thumbnail_url: "https://ik.imagekit.io/okpuja/astrology/services/thumbnails/thumb_service_4_remedies.png",
    image_card_url: "https://ik.imagekit.io/okpuja/astrology/services/cards/card_service_4_remedies.png",
    price: "850.00",
    duration_minutes: 50,
    is_active: false,
    created_at: "2024-01-18T13:45:00Z",
    updated_at: "2024-01-26T15:20:00Z"
  },
  {
    id: 5,
    title: "Gemstone Consultation",
    service_type: "GEMSTONE",
    description: "Expert guidance on selecting the right gemstones based on your birth chart. Learn about the benefits, wearing methods, and activation rituals for maximum positive impact on your life.",
    image_url: "https://ik.imagekit.io/okpuja/astrology/services/service_5_gemstone.png",
    image_thumbnail_url: "https://ik.imagekit.io/okpuja/astrology/services/thumbnails/thumb_service_5_gemstone.png",
    image_card_url: "https://ik.imagekit.io/okpuja/astrology/services/cards/card_service_5_gemstone.png",
    price: "650.00",
    duration_minutes: 40,
    is_active: true,
    created_at: "2024-01-19T11:00:00Z",
    updated_at: "2024-01-27T12:15:00Z"
  },
  {
    id: 6,
    title: "Vaastu Shastra Consultation",
    service_type: "VAASTU",
    description: "Comprehensive Vaastu analysis for your home or office. Get recommendations for optimal energy flow, room arrangements, and architectural modifications to enhance prosperity and well-being.",
    image_url: "https://ik.imagekit.io/okpuja/astrology/services/service_6_vaastu.png",
    image_thumbnail_url: "https://ik.imagekit.io/okpuja/astrology/services/thumbnails/thumb_service_6_vaastu.png",
    image_card_url: "https://ik.imagekit.io/okpuja/astrology/services/cards/card_service_6_vaastu.png",
    price: "1500.00",
    duration_minutes: 90,
    is_active: true,
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-28T10:45:00Z"
  },
  {
    id: 7,
    title: "Love and Relationship Reading",
    service_type: "PREDICTION",
    description: "Detailed analysis of your romantic relationships, compatibility with partners, and timing for marriage. Get insights into love life challenges and how to overcome them for lasting happiness.",
    image_url: "https://ik.imagekit.io/okpuja/astrology/services/service_7_love.png",
    image_thumbnail_url: "https://ik.imagekit.io/okpuja/astrology/services/thumbnails/thumb_service_7_love.png",
    image_card_url: "https://ik.imagekit.io/okpuja/astrology/services/cards/card_service_7_love.png",
    price: "800.00",
    duration_minutes: 55,
    is_active: true,
    created_at: "2024-01-21T08:15:00Z",
    updated_at: "2024-01-29T16:30:00Z"
  },
  {
    id: 8,
    title: "Health Astrology Analysis",
    service_type: "HOROSCOPE",
    description: "Health-focused astrological reading to identify potential health issues, favorable periods for medical treatments, and preventive measures based on planetary influences on your well-being.",
    image_url: "https://ik.imagekit.io/okpuja/astrology/services/service_8_health.png",
    image_thumbnail_url: "https://ik.imagekit.io/okpuja/astrology/services/thumbnails/thumb_service_8_health.png",
    image_card_url: "https://ik.imagekit.io/okpuja/astrology/services/cards/card_service_8_health.png",
    price: "700.00",
    duration_minutes: 45,
    is_active: false,
    created_at: "2024-01-22T12:45:00Z",
    updated_at: "2024-01-30T11:20:00Z"
  },
  {
    id: 9,
    title: "Child Naming Consultation",
    service_type: "REMEDIES",
    description: "Get the perfect name for your child based on astrological calculations, numerology, and favorable sound vibrations. Ensure your child's name supports their destiny and success in life.",
    image_url: "https://ik.imagekit.io/okpuja/astrology/services/service_9_naming.png",
    image_thumbnail_url: "https://ik.imagekit.io/okpuja/astrology/services/thumbnails/thumb_service_9_naming.png",
    image_card_url: "https://ik.imagekit.io/okpuja/astrology/services/cards/card_service_9_naming.png",
    price: "500.00",
    duration_minutes: 30,
    is_active: true,
    created_at: "2024-01-23T15:10:00Z",
    updated_at: "2024-01-31T13:40:00Z"
  },
  {
    id: 10,
    title: "Muhurat Selection Service",
    service_type: "PREDICTION",
    description: "Find the most auspicious timing for important life events like marriage, business launch, house warming, or any significant ceremony. Maximize success with perfect cosmic timing.",
    image_url: "https://ik.imagekit.io/okpuja/astrology/services/service_10_muhurat.png",
    image_thumbnail_url: "https://ik.imagekit.io/okpuja/astrology/services/thumbnails/thumb_service_10_muhurat.png",
    image_card_url: "https://ik.imagekit.io/okpuja/astrology/services/cards/card_service_10_muhurat.png",
    price: "400.00",
    duration_minutes: 25,
    is_active: true,
    created_at: "2024-01-24T09:30:00Z",
    updated_at: "2024-02-01T14:15:00Z"
  }
];

export const servicePaginationResponse = {
  count: 25,
  next: "http://127.0.0.1:8000/api/astrology/services/?page=2",
  previous: null,
  results: demoAstrologyServices.slice(0, 10)
};

export const serviceTypeStats = {
  HOROSCOPE: 8,
  MATCHING: 4,
  PREDICTION: 6,
  REMEDIES: 3,
  GEMSTONE: 2,
  VAASTU: 2
};

export const mockApiResponses = {
  // GET /astrology/services/
  getServices: (page = 1, pageSize = 10) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      count: demoAstrologyServices.length,
      next: endIndex < demoAstrologyServices.length ? `http://127.0.0.1:8000/api/astrology/services/?page=${page + 1}` : null,
      previous: page > 1 ? `http://127.0.0.1:8000/api/astrology/services/?page=${page - 1}` : null,
      results: demoAstrologyServices.slice(startIndex, endIndex)
    };
  },

  // POST /astrology/services/create/
  createService: (data: any) => ({
    id: Math.max(...demoAstrologyServices.map(s => s.id)) + 1,
    ...data,
    image_url: "https://ik.imagekit.io/okpuja/astrology/services/service_new.png",
    image_thumbnail_url: "https://ik.imagekit.io/okpuja/astrology/services/thumbnails/thumb_service_new.png",
    image_card_url: "https://ik.imagekit.io/okpuja/astrology/services/cards/card_service_new.png",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }),

  // GET /astrology/services/{id}/
  getService: (id: number) => {
    return demoAstrologyServices.find(s => s.id === id) || null;
  },

  // PUT /astrology/services/{id}/update/
  updateService: (id: number, data: any) => ({
    ...demoAstrologyServices.find(s => s.id === id),
    ...data,
    updated_at: new Date().toISOString()
  }),

  // DELETE /astrology/services/{id}/delete/
  deleteService: (id: number) => ({
    message: "Service deleted successfully"
  })
};
