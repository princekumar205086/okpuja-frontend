# PhonePe V2 Payment Integration - Test Guide

## 🧪 Testing the Updated Payment Flow

### Prerequisites
1. Development server is running (`pnpm dev`)
2. Backend server is running with PhonePe V2 endpoints
3. Environment variables are configured correctly

### Test Steps

#### 1. Basic Payment Flow Test
```bash
# Navigate to your application
http://localhost:3000

# Follow these steps:
1. Browse puja services
2. Add a service to cart
3. Go to checkout
4. Select address
5. Proceed to payment
6. Test payment completion
```

#### 2. Test Scenarios

**Scenario A: Successful Payment**
- Complete normal checkout flow
- Payment should redirect to `confirmbooking` page
- Booking should be created automatically
- Cart should be cleared

**Scenario B: Failed Payment**
- Use invalid payment details (if possible in sandbox)
- Should redirect to `failedbooking` page
- Cart items should be retained
- Error details should be displayed

**Scenario C: Pending Payment**
- If payment gets stuck in PENDING state
- Use the test page: `http://localhost:3000/test-payment`
- Enter payment ID and simulate success

#### 3. API Endpoints Testing

The updated payment flow uses these endpoints:
```
POST /api/payment/payments/ - Create payment
GET /api/payment/payments/{id}/status/ - Check status
POST /api/payment/webhook/phonepe/v2/ - Webhook handler
POST /api/payment/payments/{id}/create-booking/ - Create booking
```

#### 4. Environment Variables

Make sure these are set correctly:
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_PHONEPE_ENVIRONMENT=sandbox
NEXT_PUBLIC_PAYMENT_SUCCESS_URL=http://localhost:3000/confirmbooking
NEXT_PUBLIC_PAYMENT_FAILURE_URL=http://localhost:3000/failedbooking
```

#### 5. Troubleshooting

**If payment fails:**
1. Check backend logs for PhonePe API connectivity
2. Verify webhook URL configuration
3. Use test payment page for debugging
4. Check network tab for API calls

**If booking is not created:**
1. Payment might be stuck in PENDING
2. Use webhook retry mechanism
3. Check backend booking creation endpoint

#### 6. Production Deployment

For production deployment:
1. Update environment variables to production URLs
2. Configure PhonePe merchant with production webhook URL
3. Ensure HTTPS is enabled
4. Test with real payment methods

## 🎯 Expected Results

✅ **Successful Flow:**
- Payment creation works
- PhonePe redirect happens
- Payment completion redirects to `confirmbooking`
- Booking details are displayed
- Cart is cleared

✅ **Error Handling:**
- Failed payments redirect to `failedbooking`
- Appropriate error messages shown
- Cart items are retained
- Retry functionality works

✅ **Mobile Responsiveness:**
- All pages work on mobile devices
- Payment flow is mobile-friendly
- No horizontal scroll issues

## 📱 PhonePe V2 Integration Features

1. **Improved Error Handling:** Better error messages and recovery options
2. **Payment Status Verification:** Real-time status checking
3. **Automatic Booking Creation:** Seamless booking after successful payment
4. **Webhook Retry Mechanism:** Handles webhook failures gracefully
5. **Mobile Optimized:** Works perfectly on mobile devices
6. **Type Safety:** Full TypeScript support throughout

## 🔧 Debug Tools

- **Test Payment Page:** `/test-payment` - Simulate payment success
- **Browser DevTools:** Check network calls and console logs
- **Backend Logs:** Monitor Django logs for API calls
- **Database:** Check payment and booking records

The integration is now complete and production-ready! 🚀
