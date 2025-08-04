# Astrology Service Online Payment Implementation Guide

## Overview
This guide explains how to implement online payment for astrology services in your application. The implementation includes frontend cart integration, payment processing, and backend API requirements.

## 🚀 Frontend Implementation (COMPLETED)

### 1. Updated Astrology Booking Flow
- **File**: `src/app/(core)/astrology/[id]/page.tsx`
- **Changes**: 
  - Integrated with cart store and auth store
  - Added automatic cart item creation on booking
  - Redirect to checkout after successful cart addition
  - Store additional booking details in session storage

### 2. Enhanced Booking Form
- **File**: `src/app/(core)/astrology/[id]/BookingForm.tsx`
- **Changes**:
  - Updated button text to "Proceed to Payment"
  - Added secure payment messaging
  - Fixed service ID type conversion

### 3. Cart Integration
- **File**: `src/app/stores/cartStore.ts` (Already supports astrology)
- **Features**:
  - Add astrology services to cart
  - Handle payment processing
  - Automatic booking creation after successful payment

### 4. Checkout Support
- **File**: `src/app/(core)/checkout/page.tsx` (Already supports astrology)
- **Features**:
  - Display astrology service details
  - Address selection
  - Payment processing

### 5. Payment Success Handling
- **File**: `src/app/(core)/confirmbooking/page.tsx`
- **Changes**:
  - Added astrology booking details processing
  - Automatic storage of consultation details after payment

### 6. Astrology Booking API Service
- **File**: `src/app/(core)/astrology/bookingApiService.ts` (NEW)
- **Features**:
  - Create additional booking details for astrology consultations
  - Handle birth chart information, questions, contact details
  - Session storage management

## 🔄 Payment Flow

```
1. User selects astrology service
2. User fills booking form with:
   - Preferred date/time
   - Birth details (place, date, time)
   - Contact information
   - Questions (optional)
3. System adds service to cart
4. Redirects to checkout page
5. User selects address
6. User proceeds to payment
7. Payment gateway (PhonePe) processes payment
8. On success: Booking created automatically
9. Additional astrology details saved
10. User redirected to confirmation page
```

## 🛠 Backend API Requirements

### 1. Astrology Booking Details API

#### Create Booking Details
```http
POST /api/astrology/booking-details/
Content-Type: application/json
Authorization: Bearer <token>

{
    "booking_id": 123,
    "language": "Hindi",
    "birth_place": "Delhi, India",
    "birth_date": "1990-01-01",
    "birth_time": "10:30",
    "gender": "MALE",
    "questions": "Career and marriage guidance",
    "contact_email": "user@example.com",
    "contact_phone": "9876543210"
}
```

#### Response
```json
{
    "id": 1,
    "booking_id": 123,
    "language": "Hindi",
    "birth_place": "Delhi, India",
    "birth_date": "1990-01-01",
    "birth_time": "10:30",
    "gender": "MALE",
    "questions": "Career and marriage guidance",
    "contact_email": "user@example.com",
    "contact_phone": "9876543210",
    "created_at": "2025-08-04T12:00:00Z",
    "updated_at": "2025-08-04T12:00:00Z"
}
```

### 2. Database Schema

#### AstrologyBookingDetails Model
```python
class AstrologyBookingDetails(models.Model):
    booking = models.OneToOneField(
        'Booking', 
        on_delete=models.CASCADE, 
        related_name='astrology_details'
    )
    language = models.CharField(max_length=50)
    birth_place = models.CharField(max_length=200)
    birth_date = models.DateField()
    birth_time = models.TimeField()
    gender = models.CharField(
        max_length=10, 
        choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('OTHER', 'Other')]
    )
    questions = models.TextField(blank=True, null=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Astrology Details for Booking {self.booking.book_id}"
```

### 3. API Endpoints Needed

#### Views (Django REST Framework)
```python
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class AstrologyBookingDetailsViewSet(viewsets.ModelViewSet):
    serializer_class = AstrologyBookingDetailsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return AstrologyBookingDetails.objects.filter(
            booking__user=self.request.user
        )
    
    def create(self, request, *args, **kwargs):
        # Validate that booking belongs to user
        booking_id = request.data.get('booking_id')
        try:
            booking = Booking.objects.get(
                id=booking_id, 
                user=request.user
            )
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        return super().create(request, *args, **kwargs)
```

#### Serializer
```python
from rest_framework import serializers

class AstrologyBookingDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AstrologyBookingDetails
        fields = '__all__'
    
    def validate_booking_id(self, value):
        # Ensure booking exists and belongs to user
        if not Booking.objects.filter(
            id=value, 
            user=self.context['request'].user
        ).exists():
            raise serializers.ValidationError("Invalid booking ID")
        return value
```

### 4. URL Configuration
```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(
    r'astrology/booking-details', 
    AstrologyBookingDetailsViewSet, 
    basename='astrology-booking-details'
)

urlpatterns = [
    path('api/', include(router.urls)),
]
```

## 🔧 Configuration

### 1. Environment Variables
Ensure these are set in your `.env` file:
```env
# Payment Gateway
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=your_salt_index

# API URLs
NEXT_PUBLIC_API_BASE_URL=https://api.okpuja.com/api
```

### 2. Payment Gateway Setup
The system uses PhonePe V2 API. Ensure your backend has:
- Merchant ID configuration
- Salt key setup
- Webhook endpoints for payment status updates

## 📋 Testing Checklist

### Frontend Testing
- [ ] Service listing page loads correctly
- [ ] Service detail page displays properly
- [ ] Booking form validation works
- [ ] Cart integration functions
- [ ] Checkout process completes
- [ ] Payment redirection works
- [ ] Success page loads with booking details

### Backend Testing
- [ ] Astrology booking details API creates records
- [ ] Booking details are linked to main booking
- [ ] User permissions are enforced
- [ ] Payment webhook processes correctly
- [ ] Email notifications sent

### Integration Testing
- [ ] End-to-end booking flow
- [ ] Payment success scenario
- [ ] Payment failure handling
- [ ] Session timeout handling
- [ ] Multiple browser tabs support

## 🚨 Important Notes

1. **Session Storage**: Astrology details are temporarily stored in session storage until payment completion
2. **Security**: All APIs require authentication
3. **Data Validation**: Birth details are validated on both frontend and backend
4. **Error Handling**: Comprehensive error handling for payment failures
5. **Mobile Support**: Responsive design for mobile devices

## 🔄 Migration Guide

### Database Migration
```python
# Create migration
python manage.py makemigrations

# Apply migration
python manage.py migrate
```

### Deployment Checklist
- [ ] Update backend API with new endpoints
- [ ] Deploy frontend changes
- [ ] Test payment gateway integration
- [ ] Verify email notifications
- [ ] Monitor payment webhook logs

## 📞 Support

For technical support or questions:
- Frontend issues: Check browser console for errors
- Backend issues: Check server logs for API errors
- Payment issues: Verify PhonePe integration and webhook logs

## 🎯 Future Enhancements

1. **Appointment Scheduling**: Integration with calendar systems
2. **Video Consultation**: WebRTC integration for online consultations
3. **Document Upload**: Birth certificate upload for accurate readings
4. **Multilingual Support**: Support for regional languages
5. **Astrologer Matching**: AI-based astrologer assignment

---

This implementation provides a complete online payment system for astrology services with proper error handling, security, and user experience considerations.
