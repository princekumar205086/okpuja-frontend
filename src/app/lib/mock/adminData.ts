// ─── Mock data for admin panel ───────────────────────────────────────────────
// Used as fallback when backend APIs are unavailable.

export const mockEmployees = [
  { id: 1, name: "Pt. Ramesh Shastri", email: "ramesh.shastri@okpuja.com", phone: "+91-9871230001", role: "pandit", city: "Purnia", specialization: "Satyanarayan & Griha Pravesh", status: "active", joinDate: "2024-01-10", assignedBookings: 34, completedBookings: 31, rating: 4.8, salary: 25000, availability: "available" },
  { id: 2, name: "Pt. Suresh Kumar", email: "suresh.kumar@okpuja.com", phone: "+91-9871230002", role: "pandit", city: "Patna", specialization: "Navratri & Festival Pujas", status: "active", joinDate: "2024-02-15", assignedBookings: 28, completedBookings: 26, rating: 4.7, salary: 22000, availability: "busy" },
  { id: 3, name: "Jyotish Acharya Manoj", email: "manoj.jyotish@okpuja.com", phone: "+91-9871230003", role: "astrologer", city: "Online", specialization: "Vedic Astrology & Kundali", status: "active", joinDate: "2024-03-20", assignedBookings: 56, completedBookings: 54, rating: 4.9, salary: 35000, availability: "available" },
  { id: 4, name: "Vastu Acharya Rajiv", email: "rajiv.vastu@okpuja.com", phone: "+91-9871230004", role: "astrologer", city: "Bhagalpur", specialization: "Vastu & Numerology", status: "active", joinDate: "2024-04-05", assignedBookings: 22, completedBookings: 20, rating: 4.6, salary: 28000, availability: "available" },
  { id: 5, name: "Pt. Dinesh Dubey", email: "dinesh.dubey@okpuja.com", phone: "+91-9871230005", role: "pandit", city: "Begusarai", specialization: "Sunderkand & Rudrabhishek", status: "active", joinDate: "2024-05-12", assignedBookings: 19, completedBookings: 18, rating: 4.7, salary: 20000, availability: "busy" },
  { id: 6, name: "Pt. Ashok Tripathi", email: "ashok.tripathi@okpuja.com", phone: "+91-9871230006", role: "pandit", city: "Darbhanga", specialization: "Vivah & Mundan", status: "inactive", joinDate: "2024-06-01", assignedBookings: 8, completedBookings: 7, rating: 4.3, salary: 18000, availability: "unavailable" },
  { id: 7, name: "Acharya Vikash Tiwari", email: "vikash.tiwari@okpuja.com", phone: "+91-9871230007", role: "astrologer", city: "Muzaffarpur", specialization: "Tarot & Crystal Healing", status: "active", joinDate: "2024-07-18", assignedBookings: 41, completedBookings: 39, rating: 4.5, salary: 30000, availability: "available" },
  { id: 8, name: "Pt. Govind Prasad", email: "govind.prasad@okpuja.com", phone: "+91-9871230008", role: "pandit", city: "Samastipur", specialization: "Kali & Durga Puja", status: "active", joinDate: "2024-08-22", assignedBookings: 15, completedBookings: 14, rating: 4.8, salary: 21000, availability: "available" },
  { id: 9, name: "Pt. Mohan Jha", email: "mohan.jha@okpuja.com", phone: "+91-9871230009", role: "pandit", city: "Sitamarhi", specialization: "Ganesh & Laxmi Puja", status: "pending", joinDate: "2025-02-28", assignedBookings: 0, completedBookings: 0, rating: 0, salary: 18000, availability: "unavailable" },
  { id: 10, name: "Acharya Sanjeev Mishra", email: "sanjeev.mishra@okpuja.com", phone: "+91-9871230010", role: "astrologer", city: "Online", specialization: "Palmistry & Face Reading", status: "active", joinDate: "2024-09-10", assignedBookings: 33, completedBookings: 32, rating: 4.6, salary: 27000, availability: "busy" },
  { id: 11, name: "Pt. Ravi Shankar", email: "ravi.shankar@okpuja.com", phone: "+91-9871230011", role: "pandit", city: "Purnia", specialization: "Satyanarayan & Akhand Path", status: "active", joinDate: "2024-10-05", assignedBookings: 12, completedBookings: 11, rating: 4.4, salary: 19000, availability: "available" },
  { id: 12, name: "Pt. Kailash Sharma", email: "kailash.sharma@okpuja.com", phone: "+91-9871230012", role: "pandit", city: "Patna", specialization: "All Puja Services", status: "pending", joinDate: "2025-03-01", assignedBookings: 0, completedBookings: 0, rating: 0, salary: 20000, availability: "unavailable" },
];

export const mockBookingsForAssignment = [
  { id: "BK001", customer: "Rahul Sharma", service: "Satyanarayan Puja", city: "Purnia", date: "2025-03-15", time: "10:00 AM", amount: 2100, status: "unassigned" },
  { id: "BK002", customer: "Priya Singh", service: "Griha Pravesh Puja", city: "Patna", date: "2025-03-18", time: "09:00 AM", amount: 5100, status: "unassigned" },
  { id: "BK003", customer: "Meera Joshi", service: "Navratri Special Puja", city: "Bhagalpur", date: "2025-03-20", time: "07:00 AM", amount: 3500, status: "unassigned" },
  { id: "BK004", customer: "Deepak Gupta", service: "Kali Puja", city: "Darbhanga", date: "2025-03-22", time: "08:00 AM", amount: 4200, status: "unassigned" },
  { id: "BK005", customer: "Anita Pandey", service: "Rudrabhishek Puja", city: "Muzaffarpur", date: "2025-03-25", time: "06:00 AM", amount: 6000, status: "unassigned" },
  { id: "BK006", customer: "Manish Roy", service: "Ganesh Puja", city: "Samastipur", date: "2025-03-28", time: "09:00 AM", amount: 1800, status: "unassigned" },
  { id: "BK007", customer: "Pooja Das", service: "Vivah Puja", city: "Purnia", date: "2025-04-02", time: "10:00 AM", amount: 8500, status: "unassigned" },
];

export const mockDashboardStats = {
  totalRevenue: 125000,
  totalBookings: 517,
  activeEmployees: 9,
  pendingBookings: 12,
  openTickets: 3,
  completionRate: 94.8,
  monthlyRevenue: [
    { month: "Sep", puja: 28000, astrology: 17000 },
    { month: "Oct", puja: 38000, astrology: 24000 },
    { month: "Nov", puja: 52000, astrology: 26000 },
    { month: "Dec", puja: 61000, astrology: 34000 },
    { month: "Jan", puja: 55000, astrology: 33000 },
    { month: "Feb", puja: 67000, astrology: 38000 },
    { month: "Mar", puja: 78000, astrology: 47000 },
  ],
  recentBookings: [
    { id: "BK081", customer: "Vikram Patel", service: "Astrology Consultation", employee: "Jyotish Acharya Manoj", amount: 1500, status: "completed", date: "2025-03-06" },
    { id: "BK082", customer: "Rahul Sharma", service: "Satyanarayan Puja", employee: "Pt. Ramesh Shastri", amount: 2100, status: "upcoming", date: "2025-03-07" },
    { id: "BK083", customer: "Priya Singh", service: "Griha Pravesh Puja", employee: null, amount: 5100, status: "pending", date: "2025-03-08" },
    { id: "BK084", customer: "Deepak Gupta", service: "Kali Puja", employee: null, amount: 4200, status: "pending", date: "2025-03-09" },
    { id: "BK085", customer: "Anita Pandey", service: "Navratri Puja", employee: "Pt. Suresh Kumar", amount: 3500, status: "confirmed", date: "2025-03-10" },
  ],
  recentActivity: [
    { type: "booking", message: "New booking for Satyanarayan Puja – Rahul Sharma", time: "2 min ago", color: "#3b82f6" },
    { type: "payment", message: "Payment ₹5,100 received – Priya Singh", time: "15 min ago", color: "#10b981" },
    { type: "employee", message: "Pt. Mohan Jha submitted registration request", time: "1 hr ago", color: "#f59e0b" },
    { type: "support", message: "New support ticket opened – TKT007", time: "2 hr ago", color: "#ef4444" },
    { type: "booking", message: "Booking BK080 marked as completed", time: "3 hr ago", color: "#10b981" },
    { type: "payment", message: "Refund processed ₹3,100 – Rekha Verma", time: "5 hr ago", color: "#8b5cf6" },
  ],
};

export const mockUsers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com", phone: "+91-9876543210", role: "customer", status: "active", joined: "2024-10-15", bookings: 5 },
  { id: 2, name: "Priya Singh", email: "priya@gmail.com", phone: "+91-9876543211", role: "customer", status: "active", joined: "2024-11-20", bookings: 3 },
  { id: 3, name: "Amit Kumar", email: "amit@gmail.com", phone: "+91-9876543212", role: "employee", status: "active", joined: "2024-09-01", bookings: 0 },
  { id: 4, name: "Sunita Devi", email: "sunita@gmail.com", phone: "+91-9876543213", role: "customer", status: "inactive", joined: "2024-08-10", bookings: 1 },
  { id: 5, name: "Vikram Patel", email: "vikram@gmail.com", phone: "+91-9876543214", role: "customer", status: "active", joined: "2024-12-05", bookings: 7 },
  { id: 6, name: "Meera Joshi", email: "meera@gmail.com", phone: "+91-9876543215", role: "customer", status: "active", joined: "2025-01-10", bookings: 2 },
  { id: 7, name: "Rajan Mishra", email: "rajan@gmail.com", phone: "+91-9876543216", role: "employee", status: "active", joined: "2024-07-22", bookings: 0 },
  { id: 8, name: "Kavita Yadav", email: "kavita@gmail.com", phone: "+91-9876543217", role: "customer", status: "suspended", joined: "2024-06-15", bookings: 0 },
  { id: 9, name: "Deepak Gupta", email: "deepak@gmail.com", phone: "+91-9876543218", role: "customer", status: "active", joined: "2025-02-01", bookings: 4 },
  { id: 10, name: "Anita Pandey", email: "anita@gmail.com", phone: "+91-9876543219", role: "customer", status: "active", joined: "2025-02-14", bookings: 6 },
  { id: 11, name: "Suresh Tiwari", email: "suresh@gmail.com", phone: "+91-9876543220", role: "customer", status: "active", joined: "2025-02-18", bookings: 2 },
  { id: 12, name: "Rekha Verma", email: "rekha@gmail.com", phone: "+91-9876543221", role: "customer", status: "inactive", joined: "2025-01-25", bookings: 1 },
  { id: 13, name: "Manish Roy", email: "manish@gmail.com", phone: "+91-9876543222", role: "customer", status: "active", joined: "2025-03-01", bookings: 1 },
  { id: 14, name: "Pooja Das", email: "pooja@gmail.com", phone: "+91-9876543223", role: "customer", status: "active", joined: "2025-03-03", bookings: 0 },
  { id: 15, name: "Arvind Singh", email: "arvind@gmail.com", phone: "+91-9876543224", role: "employee", status: "active", joined: "2024-05-10", bookings: 0 },
];

export const mockPayments = [
  { id: "PAY001", user: "Rahul Sharma", service: "Satyanarayan Puja", amount: 2100, method: "UPI", status: "completed", date: "2025-03-01", txnId: "UPI123456789" },
  { id: "PAY002", user: "Priya Singh", service: "Griha Pravesh Puja", amount: 5100, method: "Card", status: "completed", date: "2025-03-02", txnId: "CARD789012345" },
  { id: "PAY003", user: "Vikram Patel", service: "Astrology Consultation", amount: 1500, method: "UPI", status: "pending", date: "2025-03-03", txnId: "UPI345678901" },
  { id: "PAY004", user: "Meera Joshi", service: "Navratri Special Puja", amount: 3500, method: "Net Banking", status: "completed", date: "2025-03-04", txnId: "NB901234567" },
  { id: "PAY005", user: "Deepak Gupta", service: "Kali Puja", amount: 4200, method: "UPI", status: "failed", date: "2025-03-04", txnId: "UPI567890123" },
  { id: "PAY006", user: "Anita Pandey", service: "Ganesh Puja", amount: 1800, method: "Wallet", status: "completed", date: "2025-03-05", txnId: "WAL123456789" },
  { id: "PAY007", user: "Suresh Tiwari", service: "Vastu Shastra", amount: 2500, method: "UPI", status: "completed", date: "2025-03-05", txnId: "UPI234567890" },
  { id: "PAY008", user: "Rekha Verma", service: "Sunderkand Path", amount: 3100, method: "Card", status: "refunded", date: "2025-03-06", txnId: "CARD456789012" },
  { id: "PAY009", user: "Manish Roy", service: "Rudrabhishek", amount: 6000, method: "UPI", status: "completed", date: "2025-03-06", txnId: "UPI678901234" },
  { id: "PAY010", user: "Pooja Das", service: "Satyanarayan Puja", amount: 2100, method: "Net Banking", status: "pending", date: "2025-03-06", txnId: "NB345678901" },
];

export const mockJobs = [
  { id: 1, title: "Pandit for Satyanarayan Puja", customer: "Rahul Sharma", city: "Purnia", date: "2025-03-15", status: "assigned", pandit: "Pt. Ramesh Shastri", amount: 2100 },
  { id: 2, title: "Griha Pravesh Ceremony", customer: "Priya Singh", city: "Patna", date: "2025-03-18", status: "pending", pandit: null, amount: 5100 },
  { id: 3, title: "Astrology Consultation", customer: "Vikram Patel", city: "Online", date: "2025-03-12", status: "completed", pandit: "Jyotish Acharya Manoj", amount: 1500 },
  { id: 4, title: "Navratri Special Puja", customer: "Meera Joshi", city: "Bhagalpur", date: "2025-03-20", status: "assigned", pandit: "Pt. Suresh Kumar", amount: 3500 },
  { id: 5, title: "Kali Puja at Home", customer: "Deepak Gupta", city: "Darbhanga", date: "2025-03-22", status: "pending", pandit: null, amount: 4200 },
  { id: 6, title: "Vastu Consultation", customer: "Anita Pandey", city: "Muzaffarpur", date: "2025-03-10", status: "completed", pandit: "Vastu Acharya Rajiv", amount: 2500 },
  { id: 7, title: "Ganesh Puja", customer: "Sunita Devi", city: "Sitamarhi", date: "2025-03-25", status: "cancelled", pandit: null, amount: 1800 },
  { id: 8, title: "Rudrabhishek Puja", customer: "Manish Roy", city: "Samastipur", date: "2025-03-28", status: "pending", pandit: null, amount: 6000 },
  { id: 9, title: "Sunderkand Path", customer: "Rekha Verma", city: "Begusarai", date: "2025-03-08", status: "completed", pandit: "Pt. Dinesh Dubey", amount: 3100 },
  { id: 10, title: "Vivah Puja", customer: "Pooja Das", city: "Purnia", date: "2025-04-02", status: "pending", pandit: null, amount: 8500 },
];

export const mockSupport = [
  { id: "TKT001", user: "Rahul Sharma", email: "rahul@gmail.com", subject: "Payment not processed", status: "open", priority: "high", created: "2025-03-04", message: "I made a payment but the booking is still showing as pending." },
  { id: "TKT002", user: "Priya Singh", email: "priya@gmail.com", subject: "Pandit cancelled last minute", status: "in-progress", priority: "high", created: "2025-03-03", message: "My pandit cancelled 2 hours before the puja. I need urgent help." },
  { id: "TKT003", user: "Meera Joshi", email: "meera@gmail.com", subject: "Refund request for cancelled booking", status: "resolved", priority: "medium", created: "2025-03-02", message: "I want a refund for the cancelled booking TKT-B002." },
  { id: "TKT004", user: "Vikram Patel", email: "vikram@gmail.com", subject: "Unable to book online", status: "open", priority: "medium", created: "2025-03-05", message: "The booking page shows an error when I select a date." },
  { id: "TKT005", user: "Deepak Gupta", email: "deepak@gmail.com", subject: "Wrong pandit assigned", status: "in-progress", priority: "low", created: "2025-03-01", message: "The pandit assigned doesn't speak Hindi." },
  { id: "TKT006", user: "Anita Pandey", email: "anita@gmail.com", subject: "Invoice not received", status: "resolved", priority: "low", created: "2025-02-28", message: "I didn't receive the invoice email after my booking." },
  { id: "TKT007", user: "Suresh Tiwari", email: "suresh@gmail.com", subject: "Booking confirmation not received", status: "open", priority: "medium", created: "2025-03-06", message: "No SMS or email confirmation after completing booking." },
];

export const mockReports = {
  monthlyRevenue: [
    { month: "Sep '24", revenue: 45000, bookings: 38 },
    { month: "Oct '24", revenue: 62000, bookings: 52 },
    { month: "Nov '24", revenue: 78000, bookings: 68 },
    { month: "Dec '24", revenue: 95000, bookings: 85 },
    { month: "Jan '25", revenue: 88000, bookings: 74 },
    { month: "Feb '25", revenue: 105000, bookings: 92 },
    { month: "Mar '25", revenue: 125000, bookings: 108 },
  ],
  bookingsByCity: [
    { city: "Purnia", bookings: 145 },
    { city: "Patna", bookings: 112 },
    { city: "Bhagalpur", bookings: 87 },
    { city: "Darbhanga", bookings: 65 },
    { city: "Muzaffarpur", bookings: 58 },
    { city: "Sitamarhi", bookings: 42 },
    { city: "Samastipur", bookings: 38 },
    { city: "Others", bookings: 95 },
  ],
  topServices: [
    { service: "Satyanarayan Puja", bookings: 215, revenue: 451500 },
    { service: "Griha Pravesh", bookings: 178, revenue: 908000 },
    { service: "Astrology Consult", bookings: 156, revenue: 234000 },
    { service: "Navratri Puja", bookings: 134, revenue: 469000 },
    { service: "Ganesh Puja", bookings: 98, revenue: 176400 },
    { service: "Rudrabhishek", bookings: 76, revenue: 456000 },
  ],
  userGrowth: [
    { month: "Sep '24", users: 120 },
    { month: "Oct '24", users: 185 },
    { month: "Nov '24", users: 240 },
    { month: "Dec '24", users: 310 },
    { month: "Jan '25", users: 388 },
    { month: "Feb '25", users: 456 },
    { month: "Mar '25", users: 524 },
  ],
};

export const mockGalleryImages = [
  { id: 1, url: "/image/sky.avif", name: "Sky Background", category: "background", size: "2.4 MB", uploaded: "2025-02-15" },
  { id: 2, url: "/image/sky-background-video-conferencing_23-2148623068.avif", name: "Sky Banner", category: "banner", size: "3.1 MB", uploaded: "2025-02-20" },
];

export const mockPolicies: Record<string, { title: string; content: string; lastUpdated: string }> = {
  "privacy-policy": {
    title: "Privacy Policy",
    content: `<h2>Privacy Policy – OKPUJA</h2>
<p><strong>Effective Date:</strong> January 1, 2025</p>
<p>OKPUJA takes your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our platform.</p>
<h3>Information We Collect</h3>
<p>We collect information you provide directly to us, including name, email address, phone number, and payment details when you make a booking.</p>
<h3>How We Use Your Information</h3>
<p>We use your information to process bookings, communicate with you about services, and improve our platform experience.</p>
<h3>Data Security</h3>
<p>We implement appropriate technical measures to protect your personal information against unauthorized access, alteration, or disclosure.</p>
<h3>Contact Us</h3>
<p>For privacy-related queries, contact us at privacy@okpuja.com.</p>`,
    lastUpdated: "2025-01-01",
  },
  "terms-of-service": {
    title: "Terms of Service",
    content: `<h2>Terms of Service – OKPUJA</h2>
<p><strong>Effective Date:</strong> January 1, 2025</p>
<p>By accessing OKPUJA, you agree to these terms. Please read them carefully before using our services.</p>
<h3>Use of Services</h3>
<p>You may use our services for personal, non-commercial purposes only. You must not use our services for any illegal or unauthorized purpose.</p>
<h3>Booking Policy</h3>
<p>All bookings are subject to availability of pandits. OKPUJA reserves the right to cancel any booking in case of unavailability with a full refund.</p>
<h3>Payment Terms</h3>
<p>Payments are processed securely via PhonePe. We accept UPI, credit/debit cards, net banking, and digital wallets.</p>
<h3>Contact</h3>
<p>For queries, reach us at support@okpuja.com or call +91-9876543210.</p>`,
    lastUpdated: "2025-01-01",
  },
  "refund-policy": {
    title: "Refund & Cancellation Policy",
    content: `<h2>Refund &amp; Cancellation Policy – OKPUJA</h2>
<p><strong>Effective Date:</strong> January 1, 2025</p>
<p>Our goal is to ensure your satisfaction with every puja booking.</p>
<h3>Cancellation by Customer</h3>
<ul>
<li>Cancellations made <strong>48+ hours</strong> before the scheduled puja: <strong>100% refund</strong></li>
<li>Cancellations <strong>24–48 hours</strong> before: <strong>50% refund</strong></li>
<li>Cancellations <strong>within 24 hours</strong>: <strong>No refund</strong></li>
</ul>
<h3>Cancellation by OKPUJA</h3>
<p>If OKPUJA cancels a booking due to pandit unavailability, you will receive a full refund within 5–7 business days.</p>
<h3>Refund Process</h3>
<p>Refunds are processed to the original payment method within 5–7 business days.</p>`,
    lastUpdated: "2025-01-01",
  },
};

export const mockSettings = {
  general: {
    siteName: "OKPUJA",
    tagline: "Bringing Divinity to Your Doorstep",
    email: "info@okpuja.com",
    phone: "+91-9876543210",
    address: "Purnia, Bihar, India – 854301",
    currency: "INR",
    timezone: "Asia/Kolkata",
  },
  seo: {
    metaTitle: "OKPUJA – Online Puja Booking Platform",
    metaDescription: "Book pandit online for puja, havan, astrology consultation in India. Fast, reliable and trusted services.",
    keywords: "puja booking, pandit online, astrology, havan, griha pravesh, Purnia",
    googleAnalyticsId: "G-XXXXXXXXXX",
    facebookPixelId: "",
  },
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@okpuja.com",
    fromName: "OKPUJA",
    bookingConfirmation: true,
    paymentReceipt: true,
    reminderEmails: true,
  },
  payment: {
    phonepeEnabled: true,
    upiEnabled: true,
    cardEnabled: true,
    netBankingEnabled: true,
    walletEnabled: false,
    testMode: false,
    minimumAmount: 500,
    maximumAmount: 100000,
    commissionPercent: 10,
  },
};
