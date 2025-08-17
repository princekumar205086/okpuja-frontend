# User Promo Codes Panel

A comprehensive, enterprise-level user interface for viewing, managing, and using promotional codes.

## 🌟 Features

### Core Functionality
- **View Available Codes**: Browse public and personally assigned promo codes
- **Quick Copy**: One-click copy functionality for easy checkout use
- **Code Validation**: Validate promo codes before checkout to see potential savings
- **Usage History**: Track previously used codes and total savings
- **Real-time Stats**: View active codes, total savings, and usage statistics

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Search & Filter**: Find codes by type, category, discount amount, or expiry date
- **Smart Notifications**: Success/error messages with auto-dismiss
- **Accessibility**: Full keyboard navigation and screen reader support
- **Loading States**: Smooth loading indicators for better UX

### Enterprise Features
- **Modular Architecture**: Clean, maintainable component structure
- **Type Safety**: Full TypeScript implementation
- **State Management**: Efficient Zustand store with optimized updates
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Performance**: Optimized rendering and API calls

## 📁 Component Structure

```
src/app/(users)/user/promos/
├── page.tsx                    # Main page component
├── components/
│   ├── UserStatsCards.tsx      # Dashboard statistics
│   ├── PromoFilters.tsx        # Search and filtering
│   ├── PromoCardGrid.tsx       # Responsive promo grid
│   ├── PromoDetailsModal.tsx   # Detailed promo view
│   ├── PromoValidator.tsx      # Code validation widget
│   ├── PromoHistoryList.tsx    # Usage history
│   └── LoadingSpinner.tsx      # Loading component
└── README.md                   # This file
```

## 🎨 Design System

### Color Palette
- **Primary**: Orange gradient (#EA580C to #C2410C)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale (#F9FAFB to #111827)

### Typography
- **Headers**: Font weights 600-700
- **Body**: Font weight 400-500
- **Labels**: Font weight 500-600
- **Captions**: Font weight 400, smaller sizes

### Layout
- **Grid**: Responsive CSS Grid and Flexbox
- **Spacing**: Consistent 4px base unit (4, 8, 12, 16, 24, 32, 48, 64px)
- **Breakpoints**: Mobile-first responsive design
- **Container**: Max-width 7xl (1280px) with proper padding

## 🚀 Key Components

### UserStatsCards
Dashboard cards showing:
- Total available codes
- Total savings to date
- Active codes count
- Codes used this month

### PromoFilters
Advanced filtering options:
- Search by code or description
- Filter by type (public/assigned)
- Filter by category
- Sort by discount amount or expiry
- Date range selection

### PromoCardGrid
Responsive grid displaying:
- Promo code with copy button
- Discount information
- Expiry date
- Usage restrictions
- Category badges
- Action buttons

### PromoValidator
Interactive validation widget:
- Real-time code validation
- Savings calculation
- Error handling
- Success feedback

### PromoHistoryList
Historical usage tracking:
- Used codes with dates
- Savings amounts
- Order references
- Pagination support

## 📱 Responsive Behavior

### Desktop (1024px+)
- 3-4 column grid layout
- Full sidebar filters
- Hover effects and animations
- Extended card information

### Tablet (768px - 1023px)
- 2-3 column grid layout
- Collapsible filter panel
- Touch-optimized buttons
- Simplified card design

### Mobile (< 768px)
- Single column layout
- Bottom sheet filters
- Large touch targets
- Stacked information

## 🔗 API Integration

### Endpoints Used
```typescript
GET /api/user/promos/available    // Fetch available codes
GET /api/user/promos/history      // Fetch usage history
GET /api/user/promos/stats        // Fetch user statistics
POST /api/user/promos/validate    // Validate promo code
POST /api/user/promos/use         // Mark code as used
```

### Data Flow
1. **Initial Load**: Fetch available codes, history, and stats
2. **Filter Changes**: Re-fetch codes with new parameters
3. **Code Validation**: Real-time validation on input
4. **Code Usage**: Update local state and sync with server
5. **Error Handling**: Display user-friendly error messages

## 🎯 Usage Examples

### Basic Implementation
```tsx
import UserPromosPage from './page';

// Simple usage
<UserPromosPage />
```

### Custom Integration
```tsx
import { useUserPromoStore } from '../../../stores/userPromoStore';

const CustomComponent = () => {
  const { availablePromos, validatePromoCode } = useUserPromoStore();
  
  // Use store data and actions
};
```

## 🔧 Customization

### Theme Customization
Modify `tailwind.config.js` to customize:
- Colors
- Typography
- Spacing
- Breakpoints

### Component Customization
Each component accepts props for:
- Custom styling
- Event handlers
- Data overrides
- Feature toggles

### Store Customization
Extend the Zustand store for:
- Additional API endpoints
- Custom state logic
- Enhanced error handling
- Performance optimizations

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast ratios
- ✅ Focus indicators
- ✅ ARIA labels and roles

### Keyboard Shortcuts
- `Tab`: Navigate between elements
- `Enter/Space`: Activate buttons
- `Escape`: Close modals
- `Arrow Keys`: Navigate within grids

## 🧪 Testing

### Component Testing
```bash
# Run component tests
npm test -- --watch

# Test specific component
npm test PromoCardGrid.test.tsx
```

### E2E Testing
```bash
# Run end-to-end tests
npm run e2e

# Test user flows
npm run e2e:user-promos
```

## 📈 Performance

### Optimization Features
- **Lazy Loading**: Components load on demand
- **Memoization**: Prevent unnecessary re-renders
- **Virtual Scrolling**: Handle large lists efficiently
- **Image Optimization**: Next.js automatic optimization
- **Bundle Splitting**: Code split by route

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🚀 Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_APP_ENV=production
```

### Build Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

### Code Style
- Use TypeScript for all new components
- Follow existing naming conventions
- Add proper JSDoc comments
- Include unit tests for new features

### Pull Request Process
1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit PR with clear description

## 📄 License

This project is part of the OkPuja platform and follows the organization's licensing terms.

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Maintainer**: Development Team