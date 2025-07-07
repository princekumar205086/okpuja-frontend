# OKPUJA Frontend - Authentication System

This project implements a comprehensive authentication-based layout system for OKPUJA, a Hindu puja and astrology services platform.

## 🚀 Features

### Authentication & Authorization
- **Role-based authentication** (User, Admin, Employee)
- **Protected routes** with automatic redirection
- **Persistent login state** using Zustand + localStorage
- **Route guards** for each user type

### Layout System
- **Common panel layout** for all authenticated users
- **Role-specific sidebars** with appropriate navigation items
- **Responsive design** with mobile-first approach
- **Dark/Light theme switching** with persistence

### User Interfaces
- **Admin Dashboard**: User management, bookings, payments, reports
- **Employee Dashboard**: Service management, appointments, earnings
- **User Dashboard**: Book pujas, astrology consultations, manage bookings

## 🛠 Technology Stack

- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Material-UI (MUI)** for components and theming
- **Zustand** for state management
- **React Context API** for loading states
- **Tailwind CSS** for additional styling

## 📁 Project Structure

```
src/app/
├── (core)/                     # Core website layout
├── (users)/                    # Protected user areas
│   ├── admin/                  # Admin-only routes
│   │   ├── layout.tsx         # Admin layout with RequireAuth
│   │   └── dashboard/page.tsx # Admin dashboard
│   ├── employee/              # Employee-only routes
│   │   ├── layout.tsx         # Employee layout with RequireAuth
│   │   └── dashboard/page.tsx # Employee dashboard
│   └── user/                   # User-only routes
│       ├── layout.tsx         # User layout with RequireAuth
│       └── dashboard/page.tsx # User dashboard
├── auth/                       # Authentication pages
│   └── login/page.tsx         # Login page
├── components/
│   ├── AppBar/                # Navigation bar component
│   ├── Sidebar/               # Sidebar navigation
│   ├── auth/                  # Authentication components
│   ├── layouts/               # Layout components
│   ├── theme/                 # Theme provider
│   └── ui/                    # UI components
├── context/                    # React contexts
├── lib/                        # Utilities and config
├── stores/                     # Zustand stores
└── layout.tsx                  # Root layout
```

## 🎨 UI/UX Features

### Theme System
- **Dark/Light mode** toggle in app bar
- **Persistent theme** selection across sessions
- **OKPUJA brand colors** (Orange gradient: #ff6b35 to #f7931e)
- **Material Design** principles with custom styling

### Responsive Design
- **Mobile-first** approach with breakpoints
- **Collapsible sidebar** on desktop
- **Swipeable drawer** on mobile
- **Touch-friendly** interactions

### Navigation
- **Dynamic breadcrumbs** based on current route
- **Active link highlighting** in sidebar
- **Role-based menu items** with appropriate icons
- **Quick actions** in each dashboard

## 🔐 Authentication Flow

1. **Login Page** (`/auth/login`): 
   - Select role (User/Admin/Employee)
   - Mock authentication (any credentials work)
   
2. **Route Protection**:
   - `RequireAuth` component checks authentication
   - Redirects to login if not authenticated
   - Redirects to correct dashboard based on role

3. **Dashboard Access**:
   - `/user/dashboard` - User panel
   - `/admin/dashboard` - Admin panel  
   - `/employee/dashboard` - Employee panel

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Go to login page: [http://localhost:3000/auth/login](http://localhost:3000/auth/login)

4. **Test different roles**:
   - Select "User", "Admin", or "Employee" from the dropdown
   - Use any email/password combination
   - Experience different dashboards and navigation

## 🎯 Role-Specific Features

### Admin Panel
- User management
- Employee management  
- Puja services configuration
- Astrology services setup
- Booking management
- Payment tracking
- System reports
- Platform settings

### Employee Panel
- Personal service management
- Appointment scheduling
- Earnings tracking
- Performance metrics
- Client interaction tools
- Schedule management

### User Panel
- Book puja services
- Astrology consultations
- Booking history
- Payment management
- Spiritual progress tracking
- Support system

## 🔧 Customization

### Adding New Routes
1. Create page under appropriate `(users)` subfolder
2. Add route to sidebar config in `lib/config/sidebar.ts`
3. Ensure proper authentication wrapper in layout

### Theme Customization
- Edit `components/theme/MUIThemeProvider.tsx`
- Modify color palette, typography, component styles
- Update brand colors for your specific needs

### State Management
- Authentication: `stores/authStore.ts`
- Theme: `stores/themeStore.ts`
- Loading: `context/LoadingContext.tsx`

## 📱 Mobile Experience

- **Responsive sidebar** that becomes a drawer
- **Touch gestures** for navigation
- **iOS safe area** support
- **Optimized spacing** for mobile devices

## 🎨 Design System

### Colors
- **Primary**: #ff6b35 (OKPUJA Orange)
- **Secondary**: #f7931e (Golden Yellow)
- **Accent**: #4f46e5 (Indigo Blue)

### Typography
- **Font**: Geist Sans (system fallback)
- **Hierarchy**: Clear heading structure
- **Responsive**: Scales appropriately

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Gradient backgrounds, smooth transitions
- **Navigation**: Clear active states, intuitive icons

## 🔮 Future Enhancements

- **Real API integration** (replace mock authentication)
- **WebSocket notifications** for real-time updates
- **Progressive Web App** features
- **Advanced role permissions** (sub-roles, custom permissions)
- **Multi-language support** (i18n)
- **Advanced theme customization**

## 📞 Support

For questions or issues with this authentication system:
1. Check the component documentation
2. Review the authentication flow
3. Test with different user roles
4. Verify route protection works correctly

---

**Built with ❤️ for the OKPUJA spiritual services platform**
