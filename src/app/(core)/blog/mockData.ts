import { User, BlogCategory, BlogTag, BlogPost } from './types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'pandit_sharma',
    email: 'pandit.sharma@okpuja.com',
    full_name: 'Pandit Rajesh Sharma',
    avatar: '/astrology_image/1720043029710-Vedic Astrology.jpeg',
    bio: 'Experienced Vedic astrologer with 20+ years of practice in spiritual guidance.',
    created_at: '2022-01-15T10:30:00Z',
  },
  {
    id: 2,
    username: 'astro_priya',
    email: 'priya.astrologer@okpuja.com',
    full_name: 'Dr. Priya Acharya',
    avatar: '/astrology_image/1720023693989-Birth Chart Analysis.jpeg',
    bio: 'PhD in Astrology, specializing in relationship compatibility and career guidance.',
    created_at: '2022-03-20T14:15:00Z',
  },
  {
    id: 3,
    username: 'spiritual_guru',
    email: 'guru.anand@okpuja.com',
    full_name: 'Guru Anand Das',
    avatar: '/astrology_image/1720042207969-Spiritual Healing.jpeg',
    bio: 'Master of spiritual healing and meditation practices.',
    created_at: '2021-11-05T09:45:00Z',
  },
];

// Mock Categories
export const mockCategories: BlogCategory[] = [
  {
    id: 1,
    name: 'Astrology',
    slug: 'astrology',
    description: 'Insights into Vedic astrology and celestial influences',
    color: '#8B5CF6',
    icon: '⭐',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Festivals',
    slug: 'festivals',
    description: 'Hindu festivals, their significance and celebrations',
    color: '#F59E0B',
    icon: '🎉',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Pujas & Rituals',
    slug: 'pujas-rituals',
    description: 'Traditional pujas, their procedures and benefits',
    color: '#EF4444',
    icon: '🙏',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'Spiritual Growth',
    slug: 'spiritual-growth',
    description: 'Guidance for personal spiritual development',
    color: '#10B981',
    icon: '🧘',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    name: 'Vastu Shastra',
    slug: 'vastu-shastra',
    description: 'Ancient architectural principles for harmony',
    color: '#6366F1',
    icon: '🏠',
    created_at: '2024-01-01T00:00:00Z',
  },
];

// Mock Tags
export const mockTags: BlogTag[] = [
  { id: 1, name: 'Vedic Astrology', slug: 'vedic-astrology', created_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Birth Chart', slug: 'birth-chart', created_at: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Diwali', slug: 'diwali', created_at: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'Navratri', slug: 'navratri', created_at: '2024-01-01T00:00:00Z' },
  { id: 5, name: 'Meditation', slug: 'meditation', created_at: '2024-01-01T00:00:00Z' },
  { id: 6, name: 'Mantras', slug: 'mantras', created_at: '2024-01-01T00:00:00Z' },
  { id: 7, name: 'Gemstones', slug: 'gemstones', created_at: '2024-01-01T00:00:00Z' },
  { id: 8, name: 'Palmistry', slug: 'palmistry', created_at: '2024-01-01T00:00:00Z' },
  { id: 9, name: 'Numerology', slug: 'numerology', created_at: '2024-01-01T00:00:00Z' },
  { id: 10, name: 'Chakras', slug: 'chakras', created_at: '2024-01-01T00:00:00Z' },
];

// Mock Blog Posts
export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Understanding Your Birth Chart: A Complete Guide to Vedic Astrology',
    slug: 'understanding-birth-chart-vedic-astrology-guide',
    content: `
      <h2>Introduction to Birth Charts</h2>
      <p>Your birth chart, also known as a natal chart or horoscope, is a map of the sky at the exact moment and location of your birth. In Vedic astrology, this celestial snapshot reveals profound insights about your personality, life path, and spiritual journey.</p>
      
      <h3>The 12 Houses</h3>
      <p>Each birth chart is divided into 12 houses, each governing different aspects of life:</p>
      <ul>
        <li><strong>1st House (Ascendant):</strong> Your personality, appearance, and life approach</li>
        <li><strong>2nd House:</strong> Wealth, family, and speech</li>
        <li><strong>3rd House:</strong> Communication, siblings, and short journeys</li>
        <li><strong>4th House:</strong> Home, mother, and emotional foundation</li>
        <li><strong>5th House:</strong> Creativity, children, and romance</li>
        <li><strong>6th House:</strong> Health, service, and daily routines</li>
        <li><strong>7th House:</strong> Marriage, partnerships, and business</li>
        <li><strong>8th House:</strong> Transformation, secrets, and shared resources</li>
        <li><strong>9th House:</strong> Higher learning, spirituality, and long journeys</li>
        <li><strong>10th House:</strong> Career, reputation, and public image</li>
        <li><strong>11th House:</strong> Friends, gains, and aspirations</li>
        <li><strong>12th House:</strong> Spirituality, losses, and foreign connections</li>
      </ul>
      
      <h3>Planetary Influences</h3>
      <p>The nine planets (Navagrahas) in Vedic astrology each bring unique energies to your chart. Understanding their positions and relationships helps decode your life's patterns and potential.</p>
      
      <h3>Getting Started</h3>
      <p>To create your birth chart, you'll need your exact birth date, time, and location. Even a few minutes difference can significantly change your chart, so accuracy is crucial.</p>
    `,
    excerpt: 'Discover the ancient wisdom of Vedic astrology through your birth chart. Learn how planetary positions at your birth reveal your personality, life path, and spiritual destiny.',
    featured_image: '/astrology_image/1719949344992-Astrology Chart Reading.jpeg',
    author: mockUsers[0],
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[1]],
    status: 'published',
    is_featured: true,
    published_at: '2024-01-15T10:30:00Z',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    views_count: 1248,
    likes_count: 89,
    comments_count: 23,
    reading_time: 8,
    meta_title: 'Birth Chart Guide - Vedic Astrology Basics | OKPuja',
    meta_description: 'Learn to read your birth chart with our comprehensive guide to Vedic astrology. Understand houses, planets, and their influence on your life.',
  },
  {
    id: 2,
    title: 'Diwali 2024: Complete Puja Guide and Significance',
    slug: 'diwali-2024-complete-puja-guide-significance',
    content: `
      <h2>The Festival of Lights</h2>
      <p>Diwali, the festival of lights, is one of the most significant celebrations in Hindu culture. This five-day festival symbolizes the victory of light over darkness, good over evil, and knowledge over ignorance.</p>
      
      <h3>Five Days of Diwali</h3>
      <ol>
        <li><strong>Dhanteras:</strong> Worship of wealth and prosperity</li>
        <li><strong>Naraka Chaturdashi:</strong> Elimination of negativity</li>
        <li><strong>Lakshmi Puja:</strong> Main Diwali celebration</li>
        <li><strong>Govardhan Puja:</strong> Worship of nature and gratitude</li>
        <li><strong>Bhai Dooj:</strong> Celebration of sibling bond</li>
      </ol>
      
      <h3>Lakshmi Puja Vidhi</h3>
      <p>The main Diwali puja is performed in the evening when Goddess Lakshmi is believed to visit homes:</p>
      <ul>
        <li>Clean and decorate your home</li>
        <li>Create beautiful rangoli patterns</li>
        <li>Light diyas and candles</li>
        <li>Offer prayers to Goddess Lakshmi and Lord Ganesha</li>
        <li>Share sweets and gifts with family</li>
      </ul>
      
      <h3>Spiritual Significance</h3>
      <p>Beyond the celebration, Diwali represents inner transformation. The lights we kindle outside should reflect the divine light we nurture within ourselves.</p>
    `,
    excerpt: 'Complete guide to Diwali celebrations including puja procedures, significance of each day, and spiritual meaning behind the festival of lights.',
    featured_image: '/astrology_image/1719873166520-_fb9d8287-b465-4a48-a7b7-7659afd774c4.jpeg',
    author: mockUsers[1],
    category: mockCategories[1],
    tags: [mockTags[2], mockTags[5]],
    status: 'published',
    is_featured: true,
    published_at: '2024-01-10T14:20:00Z',
    created_at: '2024-01-10T14:20:00Z',
    updated_at: '2024-01-10T14:20:00Z',
    views_count: 2156,
    likes_count: 156,
    comments_count: 45,
    reading_time: 6,
  },
  {
    id: 3,
    title: 'Meditation Practices for Spiritual Growth: A Beginner\'s Journey',
    slug: 'meditation-practices-spiritual-growth-beginners-guide',
    content: `
      <h2>The Path to Inner Peace</h2>
      <p>Meditation is an ancient practice that connects us with our inner wisdom and divine consciousness. Whether you're seeking stress relief, spiritual growth, or deeper self-understanding, meditation offers a pathway to transformation.</p>
      
      <h3>Types of Meditation</h3>
      <p>Different meditation techniques suit different personalities and goals:</p>
      <ul>
        <li><strong>Mindfulness Meditation:</strong> Observing thoughts without judgment</li>
        <li><strong>Mantra Meditation:</strong> Repetition of sacred sounds</li>
        <li><strong>Breath Awareness:</strong> Focus on natural breathing patterns</li>
        <li><strong>Loving-Kindness:</strong> Cultivating compassion for all beings</li>
        <li><strong>Chakra Meditation:</strong> Balancing energy centers</li>
      </ul>
      
      <h3>Getting Started</h3>
      <p>Begin with just 5-10 minutes daily:</p>
      <ol>
        <li>Find a quiet, comfortable space</li>
        <li>Sit with spine straight but relaxed</li>
        <li>Close your eyes and breathe naturally</li>
        <li>When mind wanders, gently return to focus</li>
        <li>End with gratitude and intention</li>
      </ol>
      
      <h3>Benefits of Regular Practice</h3>
      <p>Consistent meditation practice brings numerous benefits including reduced stress, improved focus, emotional balance, and spiritual awakening.</p>
    `,
    excerpt: 'Explore different meditation techniques for beginners. Learn how to start your spiritual journey with simple practices that bring peace and inner growth.',
    featured_image: '/astrology_image/1720042207969-Spiritual Healing.jpeg',
    author: mockUsers[2],
    category: mockCategories[3],
    tags: [mockTags[4], mockTags[9]],
    status: 'published',
    is_featured: false,
    published_at: '2024-01-08T09:15:00Z',
    created_at: '2024-01-08T09:15:00Z',
    updated_at: '2024-01-08T09:15:00Z',
    views_count: 892,
    likes_count: 67,
    comments_count: 18,
    reading_time: 7,
  },
  {
    id: 4,
    title: 'Vastu Shastra Tips for Your Home: Creating Harmony and Prosperity',
    slug: 'vastu-shastra-tips-home-harmony-prosperity',
    content: `
      <h2>Ancient Wisdom for Modern Living</h2>
      <p>Vastu Shastra, the traditional Indian system of architecture, offers timeless principles for creating harmonious living spaces that promote health, wealth, and happiness.</p>
      
      <h3>Basic Vastu Principles</h3>
      <ul>
        <li><strong>Direction:</strong> Each direction has specific energies and purposes</li>
        <li><strong>Five Elements:</strong> Earth, water, fire, air, and space must be balanced</li>
        <li><strong>Energy Flow:</strong> Positive energy should flow freely throughout the space</li>
        <li><strong>Symmetry:</strong> Balanced proportions create harmony</li>
      </ul>
      
      <h3>Room-wise Vastu Guidelines</h3>
      <h4>Entrance</h4>
      <p>The main entrance should face north, east, or northeast for maximum positive energy flow.</p>
      
      <h4>Living Room</h4>
      <p>Place heavy furniture in the south or west directions. Keep the northeast corner light and airy.</p>
      
      <h4>Kitchen</h4>
      <p>Ideal location is southeast. Cook facing east for best results. Keep the kitchen clean and clutter-free.</p>
      
      <h4>Bedroom</h4>
      <p>Master bedroom should be in southwest. Sleep with head towards south or east for peaceful rest.</p>
      
      <h3>Simple Vastu Remedies</h3>
      <p>Small changes can make big differences in your home's energy flow and your life's prosperity.</p>
    `,
    excerpt: 'Transform your home with ancient Vastu Shastra principles. Learn simple tips to create spaces that promote harmony, health, and prosperity.',
    featured_image: '/astrology_image/1720041573459-Vastu Shastra Consultation.jpeg',
    author: mockUsers[0],
    category: mockCategories[4],
    tags: [mockTags[6]],
    status: 'published',
    is_featured: false,
    published_at: '2024-01-05T16:45:00Z',
    created_at: '2024-01-05T16:45:00Z',
    updated_at: '2024-01-05T16:45:00Z',
    views_count: 756,
    likes_count: 52,
    comments_count: 12,
    reading_time: 5,
  },
  {
    id: 5,
    title: 'Palmistry Basics: Reading the Lines of Your Destiny',
    slug: 'palmistry-basics-reading-lines-destiny',
    content: `
      <h2>The Ancient Art of Palm Reading</h2>
      <p>Palmistry, or chiromancy, is the practice of interpreting the lines, shapes, and features of the hands to understand personality traits and predict future events.</p>
      
      <h3>Major Lines</h3>
      <ul>
        <li><strong>Life Line:</strong> Indicates vitality and life force</li>
        <li><strong>Heart Line:</strong> Reveals emotional nature and relationships</li>
        <li><strong>Head Line:</strong> Shows intellectual capacity and thinking style</li>
        <li><strong>Fate Line:</strong> Represents career and life path</li>
      </ul>
      
      <h3>Hand Shapes and Meanings</h3>
      <p>The shape of your hand provides insights into your elemental nature:</p>
      <ul>
        <li><strong>Earth Hands:</strong> Square palms, practical nature</li>
        <li><strong>Air Hands:</strong> Rectangular palms, intellectual approach</li>
        <li><strong>Water Hands:</strong> Oval palms, emotional sensitivity</li>
        <li><strong>Fire Hands:</strong> Square palms with long fingers, energetic personality</li>
      </ul>
      
      <h3>Reading Tips for Beginners</h3>
      <p>Start with the dominant hand for current state and the passive hand for inherited traits. Look at the overall pattern before focusing on specific lines.</p>
    `,
    excerpt: 'Discover the ancient art of palmistry. Learn to read the major lines and hand shapes to understand personality traits and life patterns.',
    featured_image: '/astrology_image/1720024869036-Palmistry.jpeg',
    author: mockUsers[1],
    category: mockCategories[0],
    tags: [mockTags[7]],
    status: 'published',
    is_featured: false,
    published_at: '2024-01-03T11:30:00Z',
    created_at: '2024-01-03T11:30:00Z',
    updated_at: '2024-01-03T11:30:00Z',
    views_count: 634,
    likes_count: 41,
    comments_count: 8,
    reading_time: 4,
  },
  {
    id: 6,
    title: 'Navratri 2024: Nine Days of Divine Feminine Energy',
    slug: 'navratri-2024-nine-days-divine-feminine-energy',
    content: `
      <h2>Celebrating the Divine Mother</h2>
      <p>Navratri, meaning "nine nights," is a festival dedicated to worshipping the nine forms of Goddess Durga. Each day represents a different aspect of divine feminine energy.</p>
      
      <h3>The Nine Forms of Devi</h3>
      <ol>
        <li><strong>Shailaputri:</strong> Daughter of the mountains</li>
        <li><strong>Brahmacharini:</strong> The unmarried one</li>
        <li><strong>Chandraghanta:</strong> The bell-shaped moon</li>
        <li><strong>Kushmanda:</strong> Creator of the universe</li>
        <li><strong>Skandamata:</strong> Mother of Kartikeya</li>
        <li><strong>Katyayani:</strong> Warrior goddess</li>
        <li><strong>Kalaratri:</strong> Dark night</li>
        <li><strong>Mahagauri:</strong> The fair one</li>
        <li><strong>Siddhidatri:</strong> Granter of supernatural powers</li>
      </ol>
      
      <h3>Daily Rituals and Observances</h3>
      <p>Each day of Navratri has specific colors, mantras, and offerings that honor the particular form of the goddess being worshipped.</p>
      
      <h3>Spiritual Significance</h3>
      <p>Navratri represents the triumph of good over evil and the awakening of divine consciousness within us.</p>
    `,
    excerpt: 'Celebrate Navratri with understanding of the nine divine forms of Goddess Durga. Learn about daily rituals and the spiritual significance of this sacred festival.',
    featured_image: '/astrology_image/1719873424564-kalash.jpg',
    author: mockUsers[2],
    category: mockCategories[1],
    tags: [mockTags[3], mockTags[5]],
    status: 'published',
    is_featured: true,
    published_at: '2024-01-01T08:00:00Z',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-01T08:00:00Z',
    views_count: 1845,
    likes_count: 123,
    comments_count: 34,
    reading_time: 6,
  },
];

// Helper functions
export const getFeaturedPosts = (): BlogPost[] => {
  return mockBlogPosts.filter(post => post.is_featured && post.status === 'published');
};

export const getPostsByCategory = (categorySlug: string): BlogPost[] => {
  return mockBlogPosts.filter(post => 
    post.category.slug === categorySlug && post.status === 'published'
  );
};

export const getPostsByTag = (tagSlug: string): BlogPost[] => {
  return mockBlogPosts.filter(post => 
    post.tags.some(tag => tag.slug === tagSlug) && post.status === 'published'
  );
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return mockBlogPosts.find(post => post.slug === slug && post.status === 'published');
};

export const getRelatedPosts = (currentPost: BlogPost, limit: number = 3): BlogPost[] => {
  return mockBlogPosts
    .filter(post => 
      post.id !== currentPost.id && 
      post.status === 'published' &&
      (post.category.id === currentPost.category.id || 
       post.tags.some(tag => currentPost.tags.some(currentTag => currentTag.id === tag.id)))
    )
    .slice(0, limit);
};
