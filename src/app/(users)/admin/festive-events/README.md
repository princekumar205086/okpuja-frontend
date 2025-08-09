# 🎉 Enterprise Festive Events Calendar Management System

A comprehensive, professional-grade event management system built with Next.js, TypeScript, Material-UI, Tailwind CSS, and Framer Motion. This system provides enterprise-level features for managing festive events throughout the year.

## ✨ Features

### 🎯 Core Functionality
- **Event CRUD Operations**: Create, read, update, and delete events with full form validation
- **Image Management**: Upload, preview, and manage event images with automatic optimization
- **Status Management**: Draft, Published, Cancelled, and Completed event statuses
- **Featured Events**: Mark events as featured with special highlighting
- **Real-time Updates**: Live synchronization across browser tabs using custom events

### 🎨 User Experience
- **Professional UI/UX**: Modern, responsive design with smooth animations
- **Mobile-First Design**: Fully responsive across all device sizes
- **Advanced Filtering**: Filter by status, featured status, date range, and search terms
- **Smart Pagination**: Efficient data loading with pagination support
- **Drag & Drop Uploads**: Intuitive image upload with drag-and-drop support
- **Loading States**: Comprehensive loading indicators and skeleton screens

### 🛠️ Technical Features
- **TypeScript**: Full type safety and IntelliSense support
- **Zustand State Management**: Efficient global state management with persistence
- **Axios Integration**: Robust API communication with automatic token refresh
- **Form Validation**: Client-side validation with real-time feedback
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance Optimized**: Lazy loading, memoization, and efficient re-renders

## 🏗️ Architecture

### 📁 File Structure
```
src/app/(users)/admin/festive-events/
├── components/
│   ├── EventFormModal.tsx          # Create/Edit event form
│   ├── EventCard.tsx               # Event display card
│   ├── EventFiltersBar.tsx         # Advanced filtering component
│   ├── EventDetailModal.tsx        # Event detail viewer
│   ├── EventStats.tsx              # Dashboard statistics
│   ├── EventListHeader.tsx         # Page header with actions
│   ├── EventGrid.tsx               # Event grid layout
│   ├── DeleteConfirmationModal.tsx # Delete confirmation dialog
│   └── ImageUploadZone.tsx         # Image upload component
├── styles/
│   └── events.css                  # Custom styles and animations
└── page.tsx                        # Main page component
```

### 🗃️ State Management
```
src/app/stores/
└── eventStore.ts                   # Zustand store for event management
```

## 🚀 API Integration

### Event Model
```typescript
interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  registration_link?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  is_featured: boolean;
  original_image?: string;
  thumbnail_url?: string;
  banner_url?: string;
  original_image_url?: string;
  days_until?: number;
  created_at: string;
  updated_at: string;
}
```

### API Endpoints
- `GET /misc/admin/events/` - List events with filtering and pagination
- `POST /misc/admin/events/` - Create new event with image upload
- `GET /misc/admin/events/{id}/` - Get event details
- `PATCH /misc/admin/events/{id}/` - Update event
- `DELETE /misc/admin/events/{id}/` - Delete event

### Image Upload Support
- **Formats**: JPEG, PNG, WebP
- **Max Size**: 10MB
- **Automatic Processing**: Thumbnail (400x300) and banner (1200x600) generation
- **Multipart Form Data**: Proper file upload handling

## 🎨 Design System

### Color Palette
- **Primary**: Purple to Pink gradient (`from-purple-600 to-pink-600`)
- **Secondary**: Blue variants for actions
- **Status Colors**:
  - Published: Green (`#4caf50`)
  - Draft: Gray (`#9e9e9e`)
  - Cancelled: Red (`#f44336`)
  - Completed: Blue (`#2196f3`)

### Typography
- **Headers**: Bold, gradient text effects
- **Body**: Clean, readable fonts with proper hierarchy
- **Interactive Elements**: Hover effects and state changes

### Animations
- **Page Transitions**: Smooth fade-in animations
- **Card Hover**: Lift effect with shadow enhancement
- **Loading States**: Pulse and shimmer effects
- **Modal Transitions**: Slide and fade animations

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (1 column)
- **Tablet**: 641px - 1024px (2 columns)
- **Desktop**: 1025px - 1536px (3 columns)
- **Large Desktop**: > 1537px (4 columns)

### Mobile Features
- Touch-friendly interface
- Swipe gestures support
- Optimized modal sizes
- Collapsible filters
- Thumb-friendly buttons

## 🛡️ Security & Error Handling

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Cross-tab synchronization
- Secure logout handling

### Error Handling
- Network error detection
- Validation error display
- Server error handling
- User-friendly error messages
- Retry mechanisms

### Data Validation
- Client-side form validation
- File type and size validation
- Date and time validation
- URL format validation
- Required field validation

## 🎯 Performance Optimizations

### Code Splitting
- Component-level code splitting
- Lazy loading of modals
- Dynamic imports for heavy components

### State Management
- Selective state updates
- Memoized selectors
- Efficient re-renders
- Persistent storage optimization

### Image Optimization
- Image compression
- Responsive image loading
- Progressive loading
- Cached image previews

## 🧪 Testing Considerations

### Unit Testing
- Component testing with React Testing Library
- Store testing with Zustand
- Utility function testing

### Integration Testing
- API integration tests
- Form submission tests
- File upload tests

### E2E Testing
- User workflow testing
- Cross-browser compatibility
- Mobile device testing

## 🚀 Deployment

### Build Process
```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start
```

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://api.okpuja.com/api
```

### Performance Monitoring
- Core Web Vitals tracking
- Error boundary implementation
- Performance metrics collection

## 🔧 Customization

### Theming
- Material-UI theme customization
- Tailwind CSS configuration
- Custom CSS variables

### Component Extension
- Modular component architecture
- Props-based customization
- Style override support

### Feature Flags
- Environment-based feature toggles
- A/B testing support
- Gradual feature rollout

## 📈 Analytics & Monitoring

### User Analytics
- Event creation tracking
- User interaction metrics
- Feature usage analytics

### Performance Monitoring
- Load time tracking
- Error rate monitoring
- API response time tracking

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component documentation

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🔗 Related Documentation

- [Event API Documentation](./EVENT_API_GUIDE.md)
- [Authentication Guide](../auth/README.md)
- [State Management](../stores/README.md)
- [Component Library](../components/README.md)

---

*Built with ❤️ for enterprise-level event management*
