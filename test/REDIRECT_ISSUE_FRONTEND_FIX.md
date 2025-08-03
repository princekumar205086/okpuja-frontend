# Payment Redirect Issue Fix

## 🚨 **Current Issue**
You're receiving `http://localhost:3000/confirmbooking?status=completed` instead of the expected `http://localhost:3000/confirmbooking?book_id=BK-XXXXXX&order_id=CART_XXXXX`

## 🎯 **Root Cause Analysis**

### Backend Smart Redirect Flow:
```
1. PhonePe → http://localhost:8000/api/payments/redirect/ (Backend handler)
2. Backend processes payment → Creates booking → Redirects to frontend
3. Should redirect to: http://localhost:3000/confirmbooking?book_id=BK-XXXXXX&order_id=CART_XXXXX
```

### Current Problem:
- Backend redirect handler is not properly processing the payment
- Backend is not creating the booking automatically
- Backend is redirecting with `status=completed` instead of `book_id`

## 🔧 **Frontend Fixes Applied**

### 1. **Updated Confirmbooking Page** (`/confirmbooking/page.tsx`)
```typescript
// Now handles multiple URL parameter formats:
- book_id=BK-XXXXXX (expected)
- status=completed (current issue)
- payment_id=XXXXX (fallback)
- merchant_order_id=XXXXX (backup)

// Fallback logic for status=completed:
if (statusParam === 'completed' && merchantOrderId) {
  // Try to find booking using latest payment API
  // Try to find booking using recent bookings API
  // Update URL with found booking ID
}
```

### 2. **Created Debug Page** (`/payment-debug`)
Visit `/payment-debug` to see:
- Current URL parameters
- Session storage data
- Latest payment information
- Recent bookings
- Quick actions to navigate to your booking

### 3. **Enhanced Error Handling**
- Multiple fallback strategies to find booking
- Clear error messages
- Automatic URL updates when booking is found

## 🔍 **Backend Issues to Check**

### 1. **Verify Backend Environment Variables**
Your backend should have:
```bash
PHONEPE_CALLBACK_URL=http://localhost:8000/api/payments/webhook/phonepe/
PHONEPE_REDIRECT_URL=http://localhost:8000/api/payments/redirect/
PHONEPE_SUCCESS_REDIRECT_URL=http://localhost:3000/confirmbooking
PHONEPE_FAILED_REDIRECT_URL=http://localhost:3000/failedbooking
```

### 2. **Check Backend Redirect Handler**
The redirect handler should:
- Receive payment status from PhonePe
- Check payment status
- Create booking if payment successful
- Redirect to: `{PHONEPE_SUCCESS_REDIRECT_URL}?book_id={booking.book_id}&order_id={merchant_order_id}`

### 3. **Verify PhonePe Configuration**
In PhonePe dashboard, set:
- **Redirect URL**: `http://localhost:8000/api/payments/redirect/`
- **Webhook URL**: `http://localhost:8000/api/payments/webhook/phonepe/`

## 🧪 **Testing Steps**

### 1. **Test Current Flow**
1. Add items to cart
2. Go to checkout
3. Initiate payment
4. Complete payment on PhonePe
5. Check what URL you get redirected to

### 2. **Use Debug Page**
1. After payment completion, visit `/payment-debug`
2. Check what parameters are received
3. Check if latest payment shows your transaction
4. Check if booking was created
5. Use "Go to Latest Booking" button

### 3. **Test Backend Endpoints**
```bash
# Check latest payment
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/payments/latest/

# Check recent bookings
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/bookings/
```

## 🚀 **Immediate Solutions**

### **Option 1: Use Debug Page** (Immediate)
After getting `status=completed`, visit `/payment-debug` and click "Go to Latest Booking"

### **Option 2: Manual URL Fix** (Temporary)
If you know your booking ID, manually change the URL to:
`http://localhost:3000/confirmbooking?book_id=YOUR_BOOKING_ID`

### **Option 3: Fix Backend Redirect** (Permanent)
Update your backend redirect handler to properly create bookings and redirect with `book_id` parameter.

## 📋 **Backend Redirect Handler Fix Needed**

Your backend redirect handler should look like this:
```python
def payment_redirect_handler(request):
    # Get payment status from PhonePe
    merchant_order_id = request.GET.get('merchant_order_id')
    
    # Check payment status
    payment_status = check_phonepe_payment_status(merchant_order_id)
    
    if payment_status == 'SUCCESS':
        # Create booking from payment
        booking = create_booking_from_payment(merchant_order_id)
        
        if booking:
            # Redirect with booking ID
            success_url = f"{settings.PHONEPE_SUCCESS_REDIRECT_URL}?book_id={booking.book_id}&order_id={merchant_order_id}"
            return redirect(success_url)
    
    # If failed, redirect to failure page
    failure_url = f"{settings.PHONEPE_FAILED_REDIRECT_URL}?status=failed"
    return redirect(failure_url)
```

## 🎯 **Next Steps**

1. **Immediate**: Use `/payment-debug` page to find your booking
2. **Short-term**: Update backend redirect handler to include `book_id`
3. **Long-term**: Ensure webhook creates bookings automatically

The frontend is now robust enough to handle various redirect formats, but the ideal solution is to fix the backend redirect handler to provide the `book_id` parameter as intended.
