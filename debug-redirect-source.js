// Test script to verify the redirect source
// Paste this in browser console on the confirmbooking page with status=completed

console.log('=== REDIRECT SOURCE ANALYSIS ===');
console.log('Current URL:', window.location.href);
console.log('Referrer (who sent us here):', document.referrer);
console.log('URL Parameters:', Object.fromEntries(new URLSearchParams(window.location.search)));

// Check if this came from backend redirect
if (document.referrer.includes('localhost:8000') || document.referrer.includes('127.0.0.1:8000')) {
    console.log('✅ CONFIRMED: Redirect came from backend (port 8000)');
} else if (document.referrer.includes('phonepe.com') || document.referrer.includes('mercury')) {
    console.log('⚠️  POSSIBLE: Direct redirect from PhonePe (backend handler may be bypassed)');
} else {
    console.log('🤔 UNKNOWN: Referrer not detected, check network tab');
}

// Check session storage for payment tracking
console.log('Session Storage Data:');
console.log('- checkout_session_id:', sessionStorage.getItem('checkout_session_id'));
console.log('- payment_id:', sessionStorage.getItem('payment_id'));
console.log('- merchant_order_id:', sessionStorage.getItem('merchant_order_id'));

// Check if we can find the booking via API
async function checkForBooking() {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.log('❌ No auth token found');
            return;
        }

        // Check latest payment
        const paymentResponse = await fetch(`${window.location.origin.replace('3000', '8000')}/api/payments/latest/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (paymentResponse.ok) {
            const payment = await paymentResponse.json();
            console.log('Latest Payment:', payment);
            
            if (payment.booking) {
                console.log('🎉 BOOKING FOUND! ID:', payment.booking.book_id);
                console.log('Backend created booking but failed to redirect with book_id');
                
                // Auto-redirect to correct URL
                const correctUrl = `${window.location.pathname}?book_id=${payment.booking.book_id}&order_id=${payment.merchant_order_id}`;
                console.log('Redirecting to correct URL:', correctUrl);
                window.location.href = correctUrl;
            } else {
                console.log('❌ Payment found but no booking created');
            }
        }
    } catch (error) {
        console.log('Error checking payment:', error);
    }
}

checkForBooking();
