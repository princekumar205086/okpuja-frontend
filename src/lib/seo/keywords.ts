/**
 * OKPUJA - Master Keyword Database
 * Enterprise-grade keyword strategy targeting 10,000+ keywords
 * Covers: Puja services, Astrology, Cities, Festivals, Near Me, Long-tail
 */

// ============================================================
// CITY DATABASE - 200+ Indian Cities
// ============================================================
export const INDIA_CITIES = [
  // Primary Target
  { name: 'Purnia', state: 'Bihar', tier: 1, slug: 'purnia' },
  
  // Bihar Cities
  { name: 'Patna', state: 'Bihar', tier: 1, slug: 'patna' },
  { name: 'Gaya', state: 'Bihar', tier: 2, slug: 'gaya' },
  { name: 'Bhagalpur', state: 'Bihar', tier: 2, slug: 'bhagalpur' },
  { name: 'Muzaffarpur', state: 'Bihar', tier: 2, slug: 'muzaffarpur' },
  { name: 'Darbhanga', state: 'Bihar', tier: 2, slug: 'darbhanga' },
  { name: 'Arrah', state: 'Bihar', tier: 3, slug: 'arrah' },
  { name: 'Begusarai', state: 'Bihar', tier: 3, slug: 'begusarai' },
  { name: 'Chhapra', state: 'Bihar', tier: 3, slug: 'chhapra' },
  { name: 'Katihar', state: 'Bihar', tier: 3, slug: 'katihar' },
  { name: 'Samastipur', state: 'Bihar', tier: 3, slug: 'samastipur' },
  { name: 'Munger', state: 'Bihar', tier: 3, slug: 'munger' },
  { name: 'Saharsa', state: 'Bihar', tier: 3, slug: 'saharsa' },
  { name: 'Hajipur', state: 'Bihar', tier: 3, slug: 'hajipur' },
  { name: 'Dehri', state: 'Bihar', tier: 3, slug: 'dehri' },
  { name: 'Siwan', state: 'Bihar', tier: 3, slug: 'siwan' },
  { name: 'Motihari', state: 'Bihar', tier: 3, slug: 'motihari' },
  { name: 'Nawada', state: 'Bihar', tier: 3, slug: 'nawada' },
  { name: 'Bettiah', state: 'Bihar', tier: 3, slug: 'bettiah' },
  { name: 'Kishanganj', state: 'Bihar', tier: 3, slug: 'kishanganj' },
  { name: 'Araria', state: 'Bihar', tier: 3, slug: 'araria' },
  { name: 'Madhepura', state: 'Bihar', tier: 3, slug: 'madhepura' },
  { name: 'Supaul', state: 'Bihar', tier: 3, slug: 'supaul' },

  // Metro Cities
  { name: 'Delhi', state: 'Delhi', tier: 1, slug: 'delhi' },
  { name: 'Mumbai', state: 'Maharashtra', tier: 1, slug: 'mumbai' },
  { name: 'Bangalore', state: 'Karnataka', tier: 1, slug: 'bangalore' },
  { name: 'Kolkata', state: 'West Bengal', tier: 1, slug: 'kolkata' },
  { name: 'Chennai', state: 'Tamil Nadu', tier: 1, slug: 'chennai' },
  { name: 'Hyderabad', state: 'Telangana', tier: 1, slug: 'hyderabad' },
  { name: 'Pune', state: 'Maharashtra', tier: 1, slug: 'pune' },
  { name: 'Ahmedabad', state: 'Gujarat', tier: 1, slug: 'ahmedabad' },
  { name: 'Jaipur', state: 'Rajasthan', tier: 1, slug: 'jaipur' },
  { name: 'Lucknow', state: 'Uttar Pradesh', tier: 1, slug: 'lucknow' },

  // Tier 2 Cities
  { name: 'Noida', state: 'Uttar Pradesh', tier: 2, slug: 'noida' },
  { name: 'Gurgaon', state: 'Haryana', tier: 2, slug: 'gurgaon' },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', tier: 2, slug: 'ghaziabad' },
  { name: 'Faridabad', state: 'Haryana', tier: 2, slug: 'faridabad' },
  { name: 'Chandigarh', state: 'Punjab', tier: 2, slug: 'chandigarh' },
  { name: 'Indore', state: 'Madhya Pradesh', tier: 2, slug: 'indore' },
  { name: 'Bhopal', state: 'Madhya Pradesh', tier: 2, slug: 'bhopal' },
  { name: 'Nagpur', state: 'Maharashtra', tier: 2, slug: 'nagpur' },
  { name: 'Surat', state: 'Gujarat', tier: 2, slug: 'surat' },
  { name: 'Vadodara', state: 'Gujarat', tier: 2, slug: 'vadodara' },
  { name: 'Rajkot', state: 'Gujarat', tier: 2, slug: 'rajkot' },
  { name: 'Varanasi', state: 'Uttar Pradesh', tier: 2, slug: 'varanasi' },
  { name: 'Kanpur', state: 'Uttar Pradesh', tier: 2, slug: 'kanpur' },
  { name: 'Agra', state: 'Uttar Pradesh', tier: 2, slug: 'agra' },
  { name: 'Prayagraj', state: 'Uttar Pradesh', tier: 2, slug: 'prayagraj' },
  { name: 'Meerut', state: 'Uttar Pradesh', tier: 2, slug: 'meerut' },
  { name: 'Ranchi', state: 'Jharkhand', tier: 2, slug: 'ranchi' },
  { name: 'Jamshedpur', state: 'Jharkhand', tier: 2, slug: 'jamshedpur' },
  { name: 'Dhanbad', state: 'Jharkhand', tier: 2, slug: 'dhanbad' },
  { name: 'Bhubaneswar', state: 'Odisha', tier: 2, slug: 'bhubaneswar' },
  { name: 'Cuttack', state: 'Odisha', tier: 2, slug: 'cuttack' },
  { name: 'Coimbatore', state: 'Tamil Nadu', tier: 2, slug: 'coimbatore' },
  { name: 'Madurai', state: 'Tamil Nadu', tier: 2, slug: 'madurai' },
  { name: 'Thiruvananthapuram', state: 'Kerala', tier: 2, slug: 'thiruvananthapuram' },
  { name: 'Kochi', state: 'Kerala', tier: 2, slug: 'kochi' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', tier: 2, slug: 'visakhapatnam' },
  { name: 'Vijayawada', state: 'Andhra Pradesh', tier: 2, slug: 'vijayawada' },
  { name: 'Mysore', state: 'Karnataka', tier: 2, slug: 'mysore' },
  { name: 'Mangalore', state: 'Karnataka', tier: 2, slug: 'mangalore' },
  { name: 'Hubli', state: 'Karnataka', tier: 2, slug: 'hubli' },
  { name: 'Nashik', state: 'Maharashtra', tier: 2, slug: 'nashik' },
  { name: 'Aurangabad', state: 'Maharashtra', tier: 2, slug: 'aurangabad' },
  { name: 'Solapur', state: 'Maharashtra', tier: 2, slug: 'solapur' },
  { name: 'Kolhapur', state: 'Maharashtra', tier: 2, slug: 'kolhapur' },
  { name: 'Dehradun', state: 'Uttarakhand', tier: 2, slug: 'dehradun' },
  { name: 'Haridwar', state: 'Uttarakhand', tier: 2, slug: 'haridwar' },
  { name: 'Rishikesh', state: 'Uttarakhand', tier: 2, slug: 'rishikesh' },
  { name: 'Guwahati', state: 'Assam', tier: 2, slug: 'guwahati' },
  { name: 'Raipur', state: 'Chhattisgarh', tier: 2, slug: 'raipur' },
  { name: 'Jodhpur', state: 'Rajasthan', tier: 2, slug: 'jodhpur' },
  { name: 'Udaipur', state: 'Rajasthan', tier: 2, slug: 'udaipur' },
  { name: 'Kota', state: 'Rajasthan', tier: 2, slug: 'kota' },
  { name: 'Ajmer', state: 'Rajasthan', tier: 2, slug: 'ajmer' },
  { name: 'Amritsar', state: 'Punjab', tier: 2, slug: 'amritsar' },
  { name: 'Ludhiana', state: 'Punjab', tier: 2, slug: 'ludhiana' },
  { name: 'Jalandhar', state: 'Punjab', tier: 2, slug: 'jalandhar' },
  { name: 'Jammu', state: 'Jammu & Kashmir', tier: 2, slug: 'jammu' },
  { name: 'Siliguri', state: 'West Bengal', tier: 2, slug: 'siliguri' },
  { name: 'Asansol', state: 'West Bengal', tier: 2, slug: 'asansol' },
  { name: 'Durgapur', state: 'West Bengal', tier: 2, slug: 'durgapur' },
  { name: 'Bokaro', state: 'Jharkhand', tier: 2, slug: 'bokaro' },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', tier: 2, slug: 'gorakhpur' },
  { name: 'Bareilly', state: 'Uttar Pradesh', tier: 2, slug: 'bareilly' },
  { name: 'Aligarh', state: 'Uttar Pradesh', tier: 2, slug: 'aligarh' },
  { name: 'Moradabad', state: 'Uttar Pradesh', tier: 2, slug: 'moradabad' },
  { name: 'Mathura', state: 'Uttar Pradesh', tier: 2, slug: 'mathura' },
  { name: 'Ayodhya', state: 'Uttar Pradesh', tier: 2, slug: 'ayodhya' },
  { name: 'Ujjain', state: 'Madhya Pradesh', tier: 2, slug: 'ujjain' },
  { name: 'Jabalpur', state: 'Madhya Pradesh', tier: 2, slug: 'jabalpur' },
  { name: 'Gwalior', state: 'Madhya Pradesh', tier: 2, slug: 'gwalior' },
  { name: 'Bilaspur', state: 'Chhattisgarh', tier: 2, slug: 'bilaspur' },
  { name: 'Panaji', state: 'Goa', tier: 2, slug: 'panaji' },
  { name: 'Shimla', state: 'Himachal Pradesh', tier: 2, slug: 'shimla' },
  { name: 'Imphal', state: 'Manipur', tier: 3, slug: 'imphal' },
  { name: 'Shillong', state: 'Meghalaya', tier: 3, slug: 'shillong' },
  { name: 'Agartala', state: 'Tripura', tier: 3, slug: 'agartala' },
  { name: 'Gangtok', state: 'Sikkim', tier: 3, slug: 'gangtok' },
  { name: 'Itanagar', state: 'Arunachal Pradesh', tier: 3, slug: 'itanagar' },
  { name: 'Dimapur', state: 'Nagaland', tier: 3, slug: 'dimapur' },
  { name: 'Aizawl', state: 'Mizoram', tier: 3, slug: 'aizawl' },
  { name: 'Navi Mumbai', state: 'Maharashtra', tier: 2, slug: 'navi-mumbai' },
  { name: 'Thane', state: 'Maharashtra', tier: 2, slug: 'thane' },
  { name: 'Pimpri Chinchwad', state: 'Maharashtra', tier: 2, slug: 'pimpri-chinchwad' },
  { name: 'Greater Noida', state: 'Uttar Pradesh', tier: 2, slug: 'greater-noida' },
  { name: 'Howrah', state: 'West Bengal', tier: 2, slug: 'howrah' },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', tier: 2, slug: 'tiruchirappalli' },
  { name: 'Salem', state: 'Tamil Nadu', tier: 2, slug: 'salem' },
  { name: 'Tiruppur', state: 'Tamil Nadu', tier: 2, slug: 'tiruppur' },
  { name: 'Warangal', state: 'Telangana', tier: 2, slug: 'warangal' },
  { name: 'Guntur', state: 'Andhra Pradesh', tier: 2, slug: 'guntur' },
  { name: 'Nellore', state: 'Andhra Pradesh', tier: 2, slug: 'nellore' },
  { name: 'Tirupati', state: 'Andhra Pradesh', tier: 2, slug: 'tirupati' },
  { name: 'Rajahmundry', state: 'Andhra Pradesh', tier: 2, slug: 'rajahmundry' },
  { name: 'Bellary', state: 'Karnataka', tier: 3, slug: 'bellary' },
  { name: 'Gulbarga', state: 'Karnataka', tier: 3, slug: 'gulbarga' },
  { name: 'Davangere', state: 'Karnataka', tier: 3, slug: 'davangere' },
  { name: 'Shimoga', state: 'Karnataka', tier: 3, slug: 'shimoga' },
  { name: 'Sangli', state: 'Maharashtra', tier: 3, slug: 'sangli' },
  { name: 'Jalgaon', state: 'Maharashtra', tier: 3, slug: 'jalgaon' },
  { name: 'Akola', state: 'Maharashtra', tier: 3, slug: 'akola' },
  { name: 'Latur', state: 'Maharashtra', tier: 3, slug: 'latur' },
  { name: 'Dhule', state: 'Maharashtra', tier: 3, slug: 'dhule' },
  { name: 'Ahmednagar', state: 'Maharashtra', tier: 3, slug: 'ahmednagar' },
  { name: 'Bhavnagar', state: 'Gujarat', tier: 3, slug: 'bhavnagar' },
  { name: 'Jamnagar', state: 'Gujarat', tier: 3, slug: 'jamnagar' },
  { name: 'Junagadh', state: 'Gujarat', tier: 3, slug: 'junagadh' },
  { name: 'Anand', state: 'Gujarat', tier: 3, slug: 'anand' },
  { name: 'Hisar', state: 'Haryana', tier: 3, slug: 'hisar' },
  { name: 'Panipat', state: 'Haryana', tier: 3, slug: 'panipat' },
  { name: 'Sonipat', state: 'Haryana', tier: 3, slug: 'sonipat' },
  { name: 'Karnal', state: 'Haryana', tier: 3, slug: 'karnal' },
  { name: 'Rohtak', state: 'Haryana', tier: 3, slug: 'rohtak' },
  { name: 'Patiala', state: 'Punjab', tier: 3, slug: 'patiala' },
  { name: 'Bathinda', state: 'Punjab', tier: 3, slug: 'bathinda' },
  { name: 'Pathankot', state: 'Punjab', tier: 3, slug: 'pathankot' },
  { name: 'Hoshiarpur', state: 'Punjab', tier: 3, slug: 'hoshiarpur' },
  { name: 'Bikaner', state: 'Rajasthan', tier: 3, slug: 'bikaner' },
  { name: 'Alwar', state: 'Rajasthan', tier: 3, slug: 'alwar' },
  { name: 'Bharatpur', state: 'Rajasthan', tier: 3, slug: 'bharatpur' },
  { name: 'Bhilwara', state: 'Rajasthan', tier: 3, slug: 'bhilwara' },
  { name: 'Sri Ganganagar', state: 'Rajasthan', tier: 3, slug: 'sri-ganganagar' },
  { name: 'Sikar', state: 'Rajasthan', tier: 3, slug: 'sikar' },
  { name: 'Pali', state: 'Rajasthan', tier: 3, slug: 'pali' },
  { name: 'Tonk', state: 'Rajasthan', tier: 3, slug: 'tonk' },
  { name: 'Firozabad', state: 'Uttar Pradesh', tier: 3, slug: 'firozabad' },
  { name: 'Muzaffarnagar', state: 'Uttar Pradesh', tier: 3, slug: 'muzaffarnagar' },
  { name: 'Saharanpur', state: 'Uttar Pradesh', tier: 3, slug: 'saharanpur' },
  { name: 'Jhansi', state: 'Uttar Pradesh', tier: 3, slug: 'jhansi' },
  { name: 'Sultanpur', state: 'Uttar Pradesh', tier: 3, slug: 'sultanpur' },
  { name: 'Mirzapur', state: 'Uttar Pradesh', tier: 3, slug: 'mirzapur' },
  { name: 'Etawah', state: 'Uttar Pradesh', tier: 3, slug: 'etawah' },
  { name: 'Rampur', state: 'Uttar Pradesh', tier: 3, slug: 'rampur' },
  { name: 'Shahjahanpur', state: 'Uttar Pradesh', tier: 3, slug: 'shahjahanpur' },
  { name: 'Sitapur', state: 'Uttar Pradesh', tier: 3, slug: 'sitapur' },
  { name: 'Hazaribagh', state: 'Jharkhand', tier: 3, slug: 'hazaribagh' },
  { name: 'Deoghar', state: 'Jharkhand', tier: 3, slug: 'deoghar' },
  { name: 'Giridih', state: 'Jharkhand', tier: 3, slug: 'giridih' },
  { name: 'Rourkela', state: 'Odisha', tier: 3, slug: 'rourkela' },
  { name: 'Sambalpur', state: 'Odisha', tier: 3, slug: 'sambalpur' },
  { name: 'Berhampur', state: 'Odisha', tier: 3, slug: 'berhampur' },
  { name: 'Korba', state: 'Chhattisgarh', tier: 3, slug: 'korba' },
  { name: 'Durg', state: 'Chhattisgarh', tier: 3, slug: 'durg' },
  { name: 'Bhilai', state: 'Chhattisgarh', tier: 3, slug: 'bhilai' },
  { name: 'Sagar', state: 'Madhya Pradesh', tier: 3, slug: 'sagar' },
  { name: 'Rewa', state: 'Madhya Pradesh', tier: 3, slug: 'rewa' },
  { name: 'Satna', state: 'Madhya Pradesh', tier: 3, slug: 'satna' },
  { name: 'Haldwani', state: 'Uttarakhand', tier: 3, slug: 'haldwani' },
  { name: 'Roorkee', state: 'Uttarakhand', tier: 3, slug: 'roorkee' },
  { name: 'Kashipur', state: 'Uttarakhand', tier: 3, slug: 'kashipur' },
  { name: 'Dibrugarh', state: 'Assam', tier: 3, slug: 'dibrugarh' },
  { name: 'Jorhat', state: 'Assam', tier: 3, slug: 'jorhat' },
  { name: 'Silchar', state: 'Assam', tier: 3, slug: 'silchar' },
  { name: 'Tezpur', state: 'Assam', tier: 3, slug: 'tezpur' },
] as const;

export type CityData = (typeof INDIA_CITIES)[number];

// ============================================================
// PUJA SERVICES DATABASE - 100+ Pujas
// ============================================================
export const PUJA_SERVICES = [
  // Most Popular Pujas
  { name: 'Satyanarayan Puja', slug: 'satyanarayan-puja', category: 'popular', hindi: 'सत्यनारायण पूजा' },
  { name: 'Griha Pravesh Puja', slug: 'griha-pravesh-puja', category: 'popular', hindi: 'गृह प्रवेश पूजा' },
  { name: 'Ganesh Puja', slug: 'ganesh-puja', category: 'popular', hindi: 'गणेश पूजा' },
  { name: 'Lakshmi Puja', slug: 'lakshmi-puja', category: 'popular', hindi: 'लक्ष्मी पूजा' },
  { name: 'Durga Puja', slug: 'durga-puja', category: 'popular', hindi: 'दुर्गा पूजा' },
  { name: 'Saraswati Puja', slug: 'saraswati-puja', category: 'popular', hindi: 'सरस्वती पूजा' },
  { name: 'Shiv Puja', slug: 'shiv-puja', category: 'popular', hindi: 'शिव पूजा' },
  { name: 'Hanuman Puja', slug: 'hanuman-puja', category: 'popular', hindi: 'हनुमान पूजा' },
  { name: 'Ram Puja', slug: 'ram-puja', category: 'popular', hindi: 'राम पूजा' },
  { name: 'Krishna Janmashtami Puja', slug: 'krishna-janmashtami-puja', category: 'festival', hindi: 'कृष्ण जन्माष्टमी पूजा' },
  
  // Grah Shanti & Navagraha
  { name: 'Grah Shanti Puja', slug: 'grah-shanti-puja', category: 'astrology', hindi: 'ग्रह शांति पूजा' },
  { name: 'Navagraha Puja', slug: 'navagraha-puja', category: 'astrology', hindi: 'नवग्रह पूजा' },
  { name: 'Shani Shanti Puja', slug: 'shani-shanti-puja', category: 'astrology', hindi: 'शनि शांति पूजा' },
  { name: 'Rahu Ketu Puja', slug: 'rahu-ketu-puja', category: 'astrology', hindi: 'राहु केतु पूजा' },
  { name: 'Mangal Dosh Nivaran Puja', slug: 'mangal-dosh-nivaran-puja', category: 'astrology', hindi: 'मंगल दोष निवारण पूजा' },
  { name: 'Kaal Sarp Dosh Puja', slug: 'kaal-sarp-dosh-puja', category: 'astrology', hindi: 'काल सर्प दोष पूजा' },
  { name: 'Pitra Dosh Puja', slug: 'pitra-dosh-puja', category: 'astrology', hindi: 'पितृ दोष पूजा' },
  
  // Havan & Yagna
  { name: 'Havan', slug: 'havan', category: 'havan', hindi: 'हवन' },
  { name: 'Gayatri Havan', slug: 'gayatri-havan', category: 'havan', hindi: 'गायत्री हवन' },
  { name: 'Maha Mrityunjay Havan', slug: 'maha-mrityunjay-havan', category: 'havan', hindi: 'महा मृत्युंजय हवन' },
  { name: 'Rudra Abhishek', slug: 'rudra-abhishek', category: 'havan', hindi: 'रुद्र अभिषेक' },
  { name: 'Sudarshan Havan', slug: 'sudarshan-havan', category: 'havan', hindi: 'सुदर्शन हवन' },
  { name: 'Vastu Shanti Havan', slug: 'vastu-shanti-havan', category: 'havan', hindi: 'वास्तु शांति हवन' },
  { name: 'Agnihotra', slug: 'agnihotra', category: 'havan', hindi: 'अग्निहोत्र' },
  
  // Life Events
  { name: 'Mundan Ceremony', slug: 'mundan-ceremony', category: 'life-events', hindi: 'मुंडन संस्कार' },
  { name: 'Namkaran Puja', slug: 'namkaran-puja', category: 'life-events', hindi: 'नामकरण पूजा' },
  { name: 'Annaprashan Puja', slug: 'annaprashan-puja', category: 'life-events', hindi: 'अन्नप्राशन पूजा' },
  { name: 'Upanayana Sanskar', slug: 'upanayana-sanskar', category: 'life-events', hindi: 'उपनयन संस्कार' },
  { name: 'Wedding Puja', slug: 'wedding-puja', category: 'life-events', hindi: 'विवाह पूजा' },
  { name: 'Engagement Ceremony', slug: 'engagement-ceremony', category: 'life-events', hindi: 'सगाई पूजा' },
  { name: 'Baby Shower Puja', slug: 'baby-shower-puja', category: 'life-events', hindi: 'गोद भराई पूजा' },
  { name: 'Shraddh Puja', slug: 'shraddh-puja', category: 'life-events', hindi: 'श्राद्ध पूजा' },
  { name: 'Tarpan Vidhi', slug: 'tarpan-vidhi', category: 'life-events', hindi: 'तर्पण विधि' },
  { name: 'Pind Daan', slug: 'pind-daan', category: 'life-events', hindi: 'पिण्ड दान' },
  
  // Festival Pujas
  { name: 'Diwali Puja', slug: 'diwali-puja', category: 'festival', hindi: 'दिवाली पूजा' },
  { name: 'Navratri Puja', slug: 'navratri-puja', category: 'festival', hindi: 'नवरात्रि पूजा' },
  { name: 'Chhath Puja', slug: 'chhath-puja', category: 'festival', hindi: 'छठ पूजा' },
  { name: 'Maha Shivratri Puja', slug: 'maha-shivratri-puja', category: 'festival', hindi: 'महा शिवरात्रि पूजा' },
  { name: 'Ganesh Chaturthi Puja', slug: 'ganesh-chaturthi-puja', category: 'festival', hindi: 'गणेश चतुर्थी पूजा' },
  { name: 'Ram Navami Puja', slug: 'ram-navami-puja', category: 'festival', hindi: 'राम नवमी पूजा' },
  { name: 'Hanuman Jayanti Puja', slug: 'hanuman-jayanti-puja', category: 'festival', hindi: 'हनुमान जयंती पूजा' },
  { name: 'Makar Sankranti Puja', slug: 'makar-sankranti-puja', category: 'festival', hindi: 'मकर संक्रांति पूजा' },
  { name: 'Holi Puja', slug: 'holi-puja', category: 'festival', hindi: 'होली पूजा' },
  { name: 'Raksha Bandhan Puja', slug: 'raksha-bandhan-puja', category: 'festival', hindi: 'रक्षा बंधन पूजा' },
  { name: 'Karwa Chauth Puja', slug: 'karwa-chauth-puja', category: 'festival', hindi: 'करवा चौथ पूजा' },
  { name: 'Dhanteras Puja', slug: 'dhanteras-puja', category: 'festival', hindi: 'धनतेरस पूजा' },
  { name: 'Akshaya Tritiya Puja', slug: 'akshaya-tritiya-puja', category: 'festival', hindi: 'अक्षय तृतीया पूजा' },
  { name: 'Basant Panchami Puja', slug: 'basant-panchami-puja', category: 'festival', hindi: 'बसंत पंचमी पूजा' },
  { name: 'Sharad Purnima Puja', slug: 'sharad-purnima-puja', category: 'festival', hindi: 'शरद पूर्णिमा पूजा' },
  { name: 'Guru Purnima Puja', slug: 'guru-purnima-puja', category: 'festival', hindi: 'गुरु पूर्णिमा पूजा' },
  
  // Vastu
  { name: 'Vastu Puja', slug: 'vastu-puja', category: 'vastu', hindi: 'वास्तु पूजा' },
  { name: 'Vastu Shanti Puja', slug: 'vastu-shanti-puja', category: 'vastu', hindi: 'वास्तु शांति पूजा' },
  { name: 'Bhoomi Puja', slug: 'bhoomi-puja', category: 'vastu', hindi: 'भूमि पूजा' },
  { name: 'Office Opening Puja', slug: 'office-opening-puja', category: 'vastu', hindi: 'ऑफिस उद्घाटन पूजा' },
  { name: 'Shop Opening Puja', slug: 'shop-opening-puja', category: 'vastu', hindi: 'दुकान उद्घाटन पूजा' },
  { name: 'Factory Opening Puja', slug: 'factory-opening-puja', category: 'vastu', hindi: 'फैक्ट्री उद्घाटन पूजा' },
  { name: 'Vehicle Puja', slug: 'vehicle-puja', category: 'vastu', hindi: 'वाहन पूजा' },
  
  // Wellness & Healing
  { name: 'Ayushya Homam', slug: 'ayushya-homam', category: 'wellness', hindi: 'आयुष्य होमम' },
  { name: 'Maha Mrityunjay Jaap', slug: 'maha-mrityunjay-jaap', category: 'wellness', hindi: 'महा मृत्युंजय जाप' },
  { name: 'Dhanvantari Puja', slug: 'dhanvantari-puja', category: 'wellness', hindi: 'धन्वंतरि पूजा' },
  { name: 'Santan Gopal Puja', slug: 'santan-gopal-puja', category: 'wellness', hindi: 'संतान गोपाल पूजा' },
  { name: 'Baglamukhi Puja', slug: 'baglamukhi-puja', category: 'wellness', hindi: 'बगलामुखी पूजा' },
  { name: 'Chandi Path', slug: 'chandi-path', category: 'wellness', hindi: 'चण्डी पाठ' },
  { name: 'Sunderkand Path', slug: 'sunderkand-path', category: 'wellness', hindi: 'सुन्दरकाण्ड पाठ' },
  { name: 'Vishnu Sahasranam Path', slug: 'vishnu-sahasranam-path', category: 'wellness', hindi: 'विष्णु सहस्रनाम पाठ' },
  
  // Prosperity
  { name: 'Kubera Puja', slug: 'kubera-puja', category: 'prosperity', hindi: 'कुबेर पूजा' },
  { name: 'Lakshmi Narayan Puja', slug: 'lakshmi-narayan-puja', category: 'prosperity', hindi: 'लक्ष्मी नारायण पूजा' },
  { name: 'Mahalakshmi Vrat Puja', slug: 'mahalakshmi-vrat-puja', category: 'prosperity', hindi: 'महालक्ष्मी व्रत पूजा' },
  { name: 'Shree Yantra Puja', slug: 'shree-yantra-puja', category: 'prosperity', hindi: 'श्री यंत्र पूजा' },
  { name: 'Navaratna Puja', slug: 'navaratna-puja', category: 'prosperity', hindi: 'नवरत्न पूजा' },
  
  // Additional Popular
  { name: 'Sunderkand Puja', slug: 'sunderkand-puja', category: 'popular', hindi: 'सुंदरकांड पूजा' },
  { name: 'Rudrabhishek Puja', slug: 'rudrabhishek-puja', category: 'popular', hindi: 'रुद्राभिषेक पूजा' },
  { name: 'Mata ki Chowki', slug: 'mata-ki-chowki', category: 'popular', hindi: 'माता की चौकी' },
  { name: 'Jagran', slug: 'jagran', category: 'popular', hindi: 'जागरण' },
  { name: 'Akhand Ramayan Path', slug: 'akhand-ramayan-path', category: 'popular', hindi: 'अखंड रामायण पाठ' },
  { name: 'Bhagwat Katha', slug: 'bhagwat-katha', category: 'popular', hindi: 'भागवत कथा' },
  { name: 'Shrimad Bhagwat Saptah', slug: 'shrimad-bhagwat-saptah', category: 'popular', hindi: 'श्रीमद भागवत सप्ताह' },
  { name: 'Vishnu Puja', slug: 'vishnu-puja', category: 'popular', hindi: 'विष्णु पूजा' },
  { name: 'Surya Puja', slug: 'surya-puja', category: 'popular', hindi: 'सूर्य पूजा' },
  { name: 'Budh Puja', slug: 'budh-puja', category: 'astrology', hindi: 'बुध पूजा' },
  { name: 'Guru Puja', slug: 'guru-puja', category: 'astrology', hindi: 'गुरु पूजा' },
  { name: 'Shukra Puja', slug: 'shukra-puja', category: 'astrology', hindi: 'शुक्र पूजा' },
  { name: 'Chandra Puja', slug: 'chandra-puja', category: 'astrology', hindi: 'चंद्र पूजा' },
  { name: 'Mangal Puja', slug: 'mangal-puja', category: 'astrology', hindi: 'मंगल पूजा' },
  
  // E-Puja / Online
  { name: 'Online Puja', slug: 'online-puja', category: 'online', hindi: 'ऑनलाइन पूजा' },
  { name: 'Live Puja', slug: 'live-puja', category: 'online', hindi: 'लाइव पूजा' },
  { name: 'Temple Puja Booking', slug: 'temple-puja-booking', category: 'online', hindi: 'मंदिर पूजा बुकिंग' },
  
  // Special
  { name: 'Grahan Dosh Nivaran', slug: 'grahan-dosh-nivaran', category: 'astrology', hindi: 'ग्रहण दोष निवारण' },
  { name: 'Vastu Dosh Nivaran', slug: 'vastu-dosh-nivaran', category: 'vastu', hindi: 'वास्तु दोष निवारण' },
  { name: 'Narayan Bali Puja', slug: 'narayan-bali-puja', category: 'life-events', hindi: 'नारायण बलि पूजा' },
  { name: 'Nagbali Puja', slug: 'nagbali-puja', category: 'life-events', hindi: 'नागबलि पूजा' },
  { name: 'Tripindi Shraddh', slug: 'tripindi-shraddh', category: 'life-events', hindi: 'त्रिपिंडी श्राद्ध' },
  { name: 'Pitru Paksha Puja', slug: 'pitru-paksha-puja', category: 'life-events', hindi: 'पितृ पक्ष पूजा' },
] as const;

export type PujaData = (typeof PUJA_SERVICES)[number];

// ============================================================
// ASTROLOGY SERVICES
// ============================================================
export const ASTROLOGY_SERVICES = [
  { name: 'Kundli Making', slug: 'kundli-making', hindi: 'कुंडली बनाना' },
  { name: 'Kundli Matching', slug: 'kundli-matching', hindi: 'कुंडली मिलान' },
  { name: 'Horoscope Reading', slug: 'horoscope-reading', hindi: 'राशिफल' },
  { name: 'Jyotish Consultation', slug: 'jyotish-consultation', hindi: 'ज्योतिष परामर्श' },
  { name: 'Vastu Consultation', slug: 'vastu-consultation', hindi: 'वास्तु परामर्श' },
  { name: 'Palmistry', slug: 'palmistry', hindi: 'हस्तरेखा' },
  { name: 'Numerology', slug: 'numerology', hindi: 'अंक शास्त्र' },
  { name: 'Face Reading', slug: 'face-reading', hindi: 'मुख शास्त्र' },
  { name: 'Tarot Reading', slug: 'tarot-reading', hindi: 'टैरो रीडिंग' },
  { name: 'Prashna Kundli', slug: 'prashna-kundli', hindi: 'प्रश्न कुंडली' },
  { name: 'Muhurat Consultation', slug: 'muhurat-consultation', hindi: 'मुहूर्त परामर्श' },
  { name: 'Marriage Muhurat', slug: 'marriage-muhurat', hindi: 'विवाह मुहूर्त' },
  { name: 'Career Astrology', slug: 'career-astrology', hindi: 'करियर ज्योतिष' },
  { name: 'Health Astrology', slug: 'health-astrology', hindi: 'स्वास्थ्य ज्योतिष' },
  { name: 'Wealth Astrology', slug: 'wealth-astrology', hindi: 'धन ज्योतिष' },
  { name: 'Love Astrology', slug: 'love-astrology', hindi: 'प्रेम ज्योतिष' },
  { name: 'Gemstone Recommendation', slug: 'gemstone-recommendation', hindi: 'रत्न सुझाव' },
  { name: 'Rudraksha Recommendation', slug: 'rudraksha-recommendation', hindi: 'रुद्राक्ष सुझाव' },
  { name: 'Yantra Consultation', slug: 'yantra-consultation', hindi: 'यंत्र परामर्श' },
  { name: 'Dasha Analysis', slug: 'dasha-analysis', hindi: 'दशा विश्लेषण' },
] as const;

// ============================================================
// KEYWORD TEMPLATES - Generates 10,000+ keyword combinations
// ============================================================

/**
 * Primary keyword templates
 * {service} and {city} are replaced dynamically
 */
export const KEYWORD_TEMPLATES = {
  // Service + booking (per service = ~90 templates × 200 cities = 18,000+)
  serviceBooking: [
    '{service} booking online',
    '{service} booking near me',
    'book {service} online',
    'book pandit for {service}',
    '{service} pandit booking',
    '{service} at home',
    '{service} vidhi',
    '{service} cost',
    '{service} price',
    '{service} samagri list',
    '{service} benefits',
    '{service} procedure',
    '{service} mantra',
    '{service} muhurat',
    'best pandit for {service}',
    '{service} online booking india',
  ],
  
  // Service + City (per service × city)
  serviceCity: [
    '{service} in {city}',
    '{service} {city}',
    '{service} pandit in {city}',
    'book {service} in {city}',
    '{service} booking {city}',
    'best {service} pandit {city}',
    '{service} near me {city}',
    '{service} cost in {city}',
    '{service} at home in {city}',
  ],
  
  // Near Me keywords (high intent)
  nearMe: [
    'puja near me',
    'pandit near me',
    'havan near me',
    'astrologer near me',
    'pandit ji near me',
    'puja pandit near me',
    'best pandit near me',
    'pandit for puja near me',
    'book pandit near me',
    'online puja near me',
    'puja booking near me',
    'hindu pandit near me',
    'brahmin pandit near me',
    'puja services near me',
    'havan booking near me',
    'vedic pandit near me',
    'priest near me',
    'hindu priest near me',
    'pooja pandit near me',
    'pooja services near me',
  ],
  
  // City-level keywords (per city)
  cityLevel: [
    'puja service in {city}',
    'pandit in {city}',
    'best pandit in {city}',
    'astrologer in {city}',
    'puja near me {city}',
    'havan in {city}',
    'book pandit in {city}',
    'online puja in {city}',
    'puja booking {city}',
    'best puja service {city}',
    'verified pandit {city}',
    'trusted pandit {city}',
    'pandit ji in {city}',
    'pooja service {city}',
    'hindu puja {city}',
    'puja at home {city}',
    'puja pandit {city}',
    'pandit for havan {city}',
    'astrology consultation {city}',
    'vastu consultant {city}',
    'jyotish {city}',
    'kundli {city}',
  ],
  
  // General puja keywords
  general: [
    'puja booking online',
    'book pandit online',
    'online puja service india',
    'pandit booking online india',
    'online puja booking',
    'puja service online',
    'best puja service in india',
    'book pandit online india',
    'hindu puja service',
    'puja at home',
    'havan at home',
    'pandit for puja at home',
    'online pandit booking',
    'verified pandit online',
    'certified pandit online',
    'experienced pandit online',
    'professional pandit booking',
    'pandit ji online booking',
    'pooja booking online',
    'pooja service online',
    'hindu pooja booking',
    'book priest online india',
  ],
  
  // Astrology keywords
  astrology: [
    'astrologer consultation online',
    'online jyotish consultation',
    'vastu consultation india',
    'kundli matching online',
    'horoscope reading online',
    'talk to astrologer online',
    'chat with astrologer',
    'best astrologer online india',
    'astrology consultation india',
    'kundli making online',
    'janam kundli online',
    'free kundli',
    'kundli milan',
    'marriage matching',
    'gun milan',
    'astrologer near me',
    'best jyotish in india',
    'vedic astrology consultation',
    'astrologer for career',
    'astrologer for marriage',
    'numerology consultation',
    'vastu shastra consultant',
    'palmistry online',
    'tarot reading online',
  ],
  
  // Festival-specific
  festival: [
    'diwali puja booking',
    'navratri puja pandit',
    'durga puja pandit booking',
    'ganesh chaturthi puja booking',
    'chhath puja pandit',
    'maha shivratri puja booking',
    'holi puja booking',
    'ram navami puja pandit',
    'hanuman jayanti puja',
    'makar sankranti puja',
    'basant panchami puja',
    'karwa chauth puja',
    'dhanteras puja booking',
    'akshaya tritiya puja',
    'guru purnima puja',
    'raksha bandhan puja',
    'janmashtami puja booking',
    'navratri puja booking online',
    'diwali lakshmi puja booking',
    'festival puja booking india',
  ],
  
  // Long-tail / Question keywords
  longTail: [
    'how to book pandit online',
    'how to perform puja at home',
    'best time for satyanarayan puja',
    'griha pravesh muhurat',
    'what is needed for havan',
    'puja samagri list online',
    'cost of pandit for puja',
    'pandit charges for puja at home',
    'how much does pandit charge',
    'difference between puja and havan',
    'benefits of satyanarayan puja',
    'when to do griha pravesh puja',
    'how to choose good pandit',
    'online puja vs offline puja',
    'is online puja effective',
    'can we do puja online',
    'best day for lakshmi puja',
    'shubh muhurat for puja',
    'puja vidhi in hindi',
    'havan kund setup at home',
  ],
};

// ============================================================
// KEYWORD GENERATION ENGINE
// ============================================================

/**
 * Generate all keyword variations for a given service and city
 */
export function generateServiceCityKeywords(
  service: string,
  city: string
): string[] {
  return KEYWORD_TEMPLATES.serviceCity.map((template) =>
    template.replace('{service}', service.toLowerCase()).replace('{city}', city.toLowerCase())
  );
}

/**
 * Generate all keywords for a specific service
 */
export function generateServiceKeywords(service: string): string[] {
  return KEYWORD_TEMPLATES.serviceBooking.map((template) =>
    template.replace('{service}', service.toLowerCase())
  );
}

/**
 * Generate all keywords for a specific city
 */
export function generateCityKeywords(city: string): string[] {
  return KEYWORD_TEMPLATES.cityLevel.map((template) =>
    template.replace('{city}', city.toLowerCase())
  );
}

/**
 * Get all near-me keywords
 */
export function getNearMeKeywords(): string[] {
  return [...KEYWORD_TEMPLATES.nearMe];
}

/**
 * Get all general keywords
 */
export function getGeneralKeywords(): string[] {
  return [...KEYWORD_TEMPLATES.general];
}

/**
 * Get all astrology keywords
 */
export function getAstrologyKeywords(): string[] {
  return [...KEYWORD_TEMPLATES.astrology];
}

/**
 * Get all festival keywords
 */
export function getFestivalKeywords(): string[] {
  return [...KEYWORD_TEMPLATES.festival];
}

/**
 * Get long-tail question keywords
 */
export function getLongTailKeywords(): string[] {
  return [...KEYWORD_TEMPLATES.longTail];
}

/**
 * Build the top keyword set for a page
 * Returns 15-25 keywords optimized for the given context
 */
export function buildKeywordsForPage(options: {
  service?: string;
  city?: string;
  category?: 'puja' | 'astrology' | 'festival' | 'vastu' | 'havan' | 'general';
  additionalKeywords?: string[];
}): string[] {
  const { service, city, category = 'general', additionalKeywords = [] } = options;
  const keywords: Set<string> = new Set();
  
  // Always include brand
  keywords.add('okpuja');
  keywords.add('puja booking online');
  keywords.add('book pandit online');
  
  // Service-specific
  if (service) {
    generateServiceKeywords(service).slice(0, 8).forEach((k) => keywords.add(k));
  }
  
  // City-specific
  if (city) {
    generateCityKeywords(city).slice(0, 8).forEach((k) => keywords.add(k));
  }
  
  // Service + City combo
  if (service && city) {
    generateServiceCityKeywords(service, city).slice(0, 5).forEach((k) => keywords.add(k));
  }
  
  // Category-specific
  switch (category) {
    case 'astrology':
      getAstrologyKeywords().slice(0, 5).forEach((k) => keywords.add(k));
      break;
    case 'festival':
      getFestivalKeywords().slice(0, 5).forEach((k) => keywords.add(k));
      break;
    case 'puja':
    case 'havan':
    case 'vastu':
      getNearMeKeywords().slice(0, 5).forEach((k) => keywords.add(k));
      break;
    default:
      getGeneralKeywords().slice(0, 5).forEach((k) => keywords.add(k));
  }
  
  // Additional
  additionalKeywords.forEach((k) => keywords.add(k));
  
  // Return 15-25 keywords
  return Array.from(keywords).slice(0, 25);
}

/**
 * Calculate total indexable keyword count
 * This function demonstrates the 10,000+ keyword reach
 */
export function getTotalKeywordCount(): {
  total: number;
  breakdown: Record<string, number>;
} {
  const cities = INDIA_CITIES.length;
  const pujas = PUJA_SERVICES.length;
  const astroServices = ASTROLOGY_SERVICES.length;
  
  const serviceCityKeywords = pujas * cities * KEYWORD_TEMPLATES.serviceCity.length;
  const serviceKeywords = pujas * KEYWORD_TEMPLATES.serviceBooking.length;
  const cityKeywords = cities * KEYWORD_TEMPLATES.cityLevel.length;
  const nearMeKeywords = KEYWORD_TEMPLATES.nearMe.length;
  const generalKeywords = KEYWORD_TEMPLATES.general.length;
  const astrologyKeywords = KEYWORD_TEMPLATES.astrology.length;
  const festivalKeywords = KEYWORD_TEMPLATES.festival.length;
  const longTailKeywords = KEYWORD_TEMPLATES.longTail.length;
  const astrologyCityKeywords = astroServices * cities * 3; // 3 templates per astro service per city
  
  const total =
    serviceCityKeywords +
    serviceKeywords +
    cityKeywords +
    nearMeKeywords +
    generalKeywords +
    astrologyKeywords +
    festivalKeywords +
    longTailKeywords +
    astrologyCityKeywords;
  
  return {
    total,
    breakdown: {
      'Service × City Keywords': serviceCityKeywords,
      'Service Keywords': serviceKeywords,
      'City Keywords': cityKeywords,
      'Near Me Keywords': nearMeKeywords,
      'General Keywords': generalKeywords,
      'Astrology Keywords': astrologyKeywords,
      'Festival Keywords': festivalKeywords,
      'Long-tail Keywords': longTailKeywords,
      'Astrology × City Keywords': astrologyCityKeywords,
    },
  };
}
