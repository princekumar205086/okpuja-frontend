# Authentication Integration - OKPUJA Frontend

## Overview
This document describes the JWT-based authentication system integrated with Django REST Framework backend using Zustand for state management and Axios for API calls.

## Technologies Used
- **Zustand**: For global state management
- **Axios**: For HTTP requests
- **React Hot Toast**: For user notifications
- **Next.js**: Frontend framework

## Features Implemented

### 1. Login System (`/login`)
- **API Endpoint**: `POST https://api.okpuja.com/api/auth/login/`
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Form Validation**: Client-side validation with real-time error feedback
- **Error Handling**: Comprehensive error handling for various scenarios
- **Role-based Routing**: Automatically redirects users based on their role

### 2. Authentication Store (`authStore.ts`)
- **JWT Token Management**: Secure handling of access and refresh tokens
- **Auto Token Refresh**: Automatic token refresh when access token expires
- **Persistent Storage**: State persistence using localStorage
- **Error Management**: Global error state management

### 3. Protected Routes (`RequireAuth.tsx`)
- **Route Protection**: Prevents unauthorized access to protected pages
- **Role-based Access**: Different access levels for USER, ADMIN, and EMPLOYEE
- **Loading States**: Smooth loading experience during authentication checks

### 4. Dashboard Pages**
- **User Dashboard** (`/dashboard`): For regular users
- **Admin Dashboard** (`/admin/dashboard`): For administrators
- **Employee Dashboard** (`/employee/dashboard`): For employees/priests

## API Integration Details

### Login Request
```javascript
POST /auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login Response
```javascript
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 2,
  "email": "user@example.com",
  "role": "USER",
  "account_status": "ACTIVE",
  "email_verified": true
}
```

### User Roles & Account Status
- **Roles**: `USER`, `ADMIN`, `EMPLOYEE`
- **Account Status**: `ACTIVE`, `PENDING`, `SUSPENDED`, `DEACTIVATED`

## File Structure
```
src/
├── app/
│   ├── apiService/
│   │   └── globalApiconfig.ts      # Axios configuration with interceptors
│   ├── stores/
│   │   └── authStore.ts            # Zustand authentication store
│   ├── components/
│   │   └── auth/
│   │       └── RequireAuth.tsx     # Protected route component
│   ├── (core)/
│   │   └── login/
│   │       └── page.tsx            # Login page component
│   ├── dashboard/
│   │   └── page.tsx                # User dashboard
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.tsx            # Admin dashboard
│   └── employee/
       └── dashboard/
           └── page.tsx            # Employee dashboard
```

## Key Features

### 1. Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Smooth experience on tablets
- **Desktop Enhancement**: Rich desktop experience with side panel

### 2. Error Handling
- **Network Errors**: Handles connectivity issues
- **Validation Errors**: Real-time form validation
- **API Errors**: Proper error messages from backend
- **Token Expiry**: Automatic token refresh

### 3. Security Features
- **Secure Token Storage**: LocalStorage with automatic cleanup
- **Request Interceptors**: Automatic token attachment
- **Response Interceptors**: Token refresh on 401 errors
- **Route Protection**: Unauthorized access prevention

### 4. User Experience
- **Loading States**: Visual feedback during API calls
- **Toast Notifications**: Success and error messages
- **Auto-redirect**: Role-based page redirection
- **Form Persistence**: Form state management

## Environment Configuration

### Production (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.okpuja.com/api
NEXT_PUBLIC_APP_ENV=production
```

### Development (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_ENV=development
```

## Usage Examples

### 1. Login Process
```typescript
const { login } = useAuthStore();

const handleLogin = async () => {
  const success = await login(email, password);
  if (success) {
    // User will be automatically redirected based on role
  }
};
```

### 2. Protected Route
```typescript
import { RequireAuth } from '@/app/components/auth/RequireAuth';

export default function ProtectedPage() {
  return (
    <RequireAuth requiredRole="ADMIN">
      <div>Admin only content</div>
    </RequireAuth>
  );
}
```

### 3. Logout
```typescript
const { logout } = useAuthStore();

const handleLogout = async () => {
  await logout();
  router.push('/login');
};
```

## Testing the Integration

1. **Start Development Server**:
   ```bash
   pnpm dev
   ```

2. **Test Login**:
   - Navigate to `/login`
   - Use test credentials: `asliprinceraj@gmail.com` / `testpass123`
   - Verify role-based redirection

3. **Test Protected Routes**:
   - Try accessing `/dashboard` without login
   - Verify automatic redirect to login page

4. **Test Logout**:
   - Login and navigate to dashboard
   - Click logout button
   - Verify redirect to login page

## Error Scenarios Handled

1. **Invalid Credentials**: Shows "Invalid email or password"
2. **Network Issues**: Shows "Network error. Please check your connection"
3. **Account Status**: Handles PENDING, SUSPENDED, DEACTIVATED accounts
4. **Token Expiry**: Automatic refresh or redirect to login
5. **Server Errors**: User-friendly error messages

## Mobile Responsiveness

- **Mobile (< 640px)**: Single column layout, touch-optimized buttons
- **Tablet (640px - 1024px)**: Improved spacing, larger touch targets
- **Desktop (> 1024px)**: Two-column layout with image panel

## Future Enhancements

1. **Remember Me**: Extended session management
2. **Social Login**: Google/Facebook authentication
3. **Two-Factor Authentication**: Enhanced security
4. **Password Reset**: Forgot password functionality
5. **Profile Management**: User profile editing

## Dependencies Added
```json
{
  "axios": "^1.x.x",
  "react-hot-toast": "^2.x.x",
  "zustand": "^4.x.x"
}
```

This implementation provides a robust, secure, and user-friendly authentication system that integrates seamlessly with your Django REST Framework backend.
