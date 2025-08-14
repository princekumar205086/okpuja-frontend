# User Profile Management System

A comprehensive, enterprise-level user profile management system built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🔧 Core Components

- **ProfileHeader**: Displays user information with profile picture upload
- **PersonalInfo**: Manages first name, last name, and date of birth
- **AddressManager**: Complete address management with postal code API integration
- **PanCardManager**: PAN card details management with image upload
- **LoadingSkeleton**: Elegant loading states
- **ErrorBoundary**: Graceful error handling

### 🌐 API Integration

- **Profile Management**: Create, read, update profile information
- **Address Management**: CRUD operations for user addresses
- **PAN Card Management**: PAN card verification and image upload
- **Location Services**: 
  - Indian postal code API integration for automatic city/state detection
  - Geolocation API for current location detection
  - Reverse geocoding for address detection

### 📱 Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Adaptive layouts** for mobile, tablet, and desktop
- **Touch-friendly interactions** on mobile devices
- **Optimized forms** for various screen sizes

### 🔒 Enterprise Features

- **Type-safe** with TypeScript
- **State management** with Zustand
- **Form validation** with custom validation utilities
- **Error handling** with comprehensive error boundaries
- **Loading states** with skeletons and spinners
- **Toast notifications** for user feedback
- **Token-based authentication** with automatic refresh

## File Structure

```
src/app/(users)/user/profile/
├── page.tsx                    # Main profile page
├── components/
│   ├── ProfileHeader.tsx       # Profile header with picture upload
│   ├── PersonalInfo.tsx        # Personal information form
│   ├── AddressManager.tsx      # Address management
│   ├── PanCardManager.tsx      # PAN card management
│   ├── LoadingSkeleton.tsx     # Loading skeleton component
│   └── ErrorBoundary.tsx       # Error boundary component
├── stores/
│   ├── authStore.ts            # Authentication state management
│   └── profileStore.ts         # Profile state management
├── apiService/
│   ├── globalApiconfig.ts      # API client configuration
│   └── profileService.ts       # Profile API services
├── hooks/
│   └── useResponsive.ts        # Responsive design hook
└── utils/
    ├── validation.ts           # Form validation utilities
    └── tokenUtils.ts           # Token management utilities
```

## API Endpoints Used

### Authentication & Profile
- `GET /auth/profile/` - Get user profile
- `PUT/PATCH /auth/profile/` - Update user profile
- `PATCH /auth/profile/picture/` - Update profile picture

### Address Management
- `GET /auth/addresses/` - List user addresses
- `POST /auth/addresses/` - Create new address
- `PUT/PATCH /auth/addresses/{id}/` - Update address
- `DELETE /auth/addresses/{id}/` - Delete address

### PAN Card Management
- `GET /auth/pancard/` - Get PAN card details
- `PUT/PATCH /auth/pancard/` - Update PAN card

### External APIs
- `https://api.postalpincode.in/pincode/{pincode}` - Indian postal code API
- `https://nominatim.openstreetmap.org/reverse` - Reverse geocoding

## Usage

### Basic Implementation

```tsx
import UserProfile from './src/app/(users)/user/profile/page';

function App() {
  return <UserProfile />;
}
```

### Individual Components

```tsx
import { ProfileHeader } from './components/ProfileHeader';
import { PersonalInfo } from './components/PersonalInfo';
import { AddressManager } from './components/AddressManager';

function CustomProfile() {
  return (
    <div className="space-y-6">
      <ProfileHeader />
      <PersonalInfo />
      <AddressManager />
    </div>
  );
}
```

### State Management

```tsx
import { useProfileStore } from './stores/profileStore';

function ProfileComponent() {
  const { 
    profile, 
    addresses, 
    fetchProfile, 
    createAddress 
  } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Welcome, {profile?.first_name}</h1>
      <p>You have {addresses.length} addresses</p>
    </div>
  );
}
```

## Features in Detail

### 🖼️ Profile Picture Upload
- Drag and drop support
- Image validation (type, size)
- Real-time preview
- Automatic thumbnail generation

### 📍 Smart Address Input
- **Postal code lookup**: Automatically fills city and state
- **Current location**: Uses geolocation API
- **Address validation**: Comprehensive form validation
- **Default address**: Mark primary address

### 🏦 PAN Card Management
- PAN number validation with regex
- Image upload for PAN card
- Verification status display
- Secure storage

### 📱 Mobile Optimization
- Touch-friendly form inputs
- Responsive image uploads
- Mobile-specific validation messages
- Optimized keyboard types

## Validation Rules

### Personal Information
- **First/Last Name**: Required, 2-100 characters, letters only
- **Date of Birth**: Valid date, age 13-120 years
- **Email**: Valid email format
- **Phone**: Valid phone number format

### Address Validation
- **Address Line 1**: Required, 5-255 characters
- **City/State**: Required, 2-100 characters
- **Postal Code**: Required, 6-digit Indian PIN code
- **Country**: Required, 2-100 characters

### PAN Card Validation
- **PAN Number**: Required, format ABCDE1234F
- **Image**: Optional, max 5MB, image formats only

## Error Handling

### Network Errors
- Automatic retry mechanisms
- Offline state detection
- Connection timeout handling
- Token refresh on 401 errors

### Form Validation
- Real-time validation
- Field-level error messages
- Form-level validation summary
- Custom validation rules

### User Feedback
- Success toast notifications
- Error toast notifications
- Loading states with skeletons
- Progress indicators

## Security Features

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Cross-tab synchronization
- Secure token storage

### Data Protection
- Form data validation
- XSS prevention
- CSRF protection
- Secure file uploads

## Performance Optimizations

### Code Splitting
- Component-level lazy loading
- Route-based code splitting
- Dynamic imports for large components

### State Management
- Efficient state updates
- Memoized selectors
- Persistent state with localStorage
- Automatic cache invalidation

### API Optimization
- Request deduplication
- Automatic retries
- Parallel API calls
- Response caching

## Browser Support

- **Chrome**: ✅ Latest 2 versions
- **Firefox**: ✅ Latest 2 versions
- **Safari**: ✅ Latest 2 versions
- **Edge**: ✅ Latest 2 versions
- **Mobile Safari**: ✅ iOS 12+
- **Chrome Mobile**: ✅ Latest version

## Dependencies

### Core Dependencies
- `next`: ^15.3.4
- `react`: ^19.0.0
- `typescript`: ^5
- `tailwindcss`: ^4

### State Management
- `zustand`: ^5.0.6

### UI & Styling
- `lucide-react`: ^0.525.0
- `react-hot-toast`: ^2.5.2
- `framer-motion`: ^12.23.0

### HTTP Client
- `axios`: ^1.10.0

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api.okpuja.com/api
```

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API endpoint
   ```

3. **Run development server**:
   ```bash
   pnpm dev
   ```

4. **Build for production**:
   ```bash
   pnpm build
   ```

## Contributing

1. Follow the component structure and naming conventions
2. Add proper TypeScript types for all new features
3. Include responsive design for all new components
4. Add proper error handling and loading states
5. Write validation rules for all form inputs
6. Add toast notifications for user actions

## License

This project is proprietary software. All rights reserved.
