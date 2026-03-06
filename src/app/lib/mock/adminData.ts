// ─── Mock data for admin panel ───────────────────────────────────────────────
// Used as fallback when backend APIs are unavailable.

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
