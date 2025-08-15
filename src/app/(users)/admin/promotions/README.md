# Promotions & Coupons Admin Page

A comprehensive enterprise-level admin interface for managing promotional codes and coupons built with Next.js 15, TypeScript, Tailwind CSS, and Zustand.

## 🚀 Features

### Core Functionality
- **Create Single Promo Codes**: Individual promo code creation with detailed configuration
- **Bulk Create Promo Codes**: Generate multiple codes with shared settings
- **View & Edit**: Comprehensive promo code management
- **Email Distribution**: Send promo codes to multiple recipients
- **Export Data**: Export promo codes to CSV format
- **Advanced Filtering**: Filter by status, type, and search functionality
- **Statistics Dashboard**: Real-time analytics and usage metrics

### Promo Code Types
- **Public**: Available to all users
- **Private**: Admin-only access
- **Assigned**: Specific user assignments
- **Service Specific**: Limited to astrology or puja services

### Discount Options
- **Percentage**: % based discounts
- **Fixed Amount**: Fixed rupee amount discounts
- **Min Order Amount**: Minimum purchase requirements
- **Max Discount Cap**: Maximum discount limits
- **Usage Limits**: Per-code usage restrictions

## 🏗️ Architecture

### Component Structure
```
promotions/
├── page.tsx                 # Main page component
├── components/              # Component modules
│   ├── StatsCards.tsx       # Statistics display
│   ├── SearchAndFilters.tsx # Search and filtering
│   ├── ActionButtons.tsx    # Action controls
│   ├── PromoTable.tsx       # Data table
│   ├── CreateEditModal.tsx  # Create/Edit form
│   ├── BulkCreateModal.tsx  # Bulk creation form
│   ├── EmailModal.tsx       # Email distribution
│   └── ViewModal.tsx        # Detailed view
├── types.ts                 # TypeScript definitions
└── utils.ts                 # Utility functions
```

### State Management
Uses Zustand for centralized state management with:
- Promo code CRUD operations
- Filtering and pagination
- Error handling
- Loading states
- API integration

### API Integration
Connects to backend endpoints:
- `GET /promo/admin/promos/` - List promo codes
- `POST /promo/admin/promos/` - Create promo code
- `PUT/PATCH /promo/admin/promos/{id}/` - Update promo code
- `DELETE /promo/admin/promos/{id}/` - Delete promo code
- `POST /promo/admin/promos/bulk-create/` - Bulk create
- `GET /promo/admin/promos/stats/` - Statistics
- `GET /promo/admin/promos/export/` - Export data

## 📱 Responsive Design

### Mobile First Approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements
- Optimized table scrolling
- Collapsible filters and actions

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Design System

### Colors
- **Primary**: Orange (600/700) - Actions and CTAs
- **Success**: Green (600/700) - Active status and confirmations
- **Warning**: Yellow (600/700) - Scheduled items
- **Error**: Red (600/700) - Expired and deletions
- **Neutral**: Gray scales - Text and backgrounds

### Typography
- **Headings**: Font-bold with proper hierarchy
- **Body**: Font-medium for emphasis, font-normal for content
- **Code**: Font-mono for promo codes

### Spacing
- Consistent 4px grid system
- Proper component spacing
- Adequate touch targets (minimum 44px)

## 🔧 Implementation Details

### Key Components

#### StatsCards
- Real-time metrics display
- Loading states with skeleton
- Responsive grid layout
- Icon-based visual hierarchy

#### PromoTable
- Sortable columns
- Bulk selection
- Inline actions (view, edit, delete)
- Pagination controls
- Status badges
- Copy-to-clipboard functionality

#### CreateEditModal
- Form validation
- Date/time pickers
- Dynamic field visibility
- Auto-generate codes
- Service type selection

#### BulkCreateModal
- Prefix-based generation
- Preview functionality
- Batch limits (max 100)
- Usage configuration

#### EmailModal
- Multi-recipient support
- Promo code selection
- Email validation
- Send confirmation

### Utility Functions

#### Date Handling
- `formatDate()` - Consistent date formatting
- `formatDateTimeLocal()` - Form input formatting
- `isDateInPast()` / `isDateInFuture()` - Date validation

#### Data Formatting
- `formatDiscount()` - Currency and percentage display
- `formatCodeType()` - Human-readable type labels
- `getPromoStatus()` - Status determination

#### Validation
- `isValidEmail()` - Email format validation
- `isValidPromoCode()` - Code format validation
- Form validation with error states

## 📊 State Structure

```typescript
interface PromotionState {
  promoCodes: PromoCode[]
  selectedPromo: PromoCode | null
  stats: PromoStats | null
  loading: boolean
  error: string | null
  filters: {
    search: string
    status: 'all' | 'active' | 'expired' | 'inactive'
    discount_type: 'all' | 'PERCENT' | 'FIXED'
    code_type: 'all' | 'PUBLIC' | 'PRIVATE' | 'ASSIGNED' | 'SERVICE_SPECIFIC'
  }
  pagination: PaginationInfo
}
```

## 🔒 Security Features

- Input validation and sanitization
- XSS protection
- CSRF token handling
- Role-based access control
- Secure API communication

## 🚀 Performance Optimizations

- **Component Memoization**: Prevent unnecessary re-renders
- **Lazy Loading**: Modal components loaded on demand
- **Debounced Search**: Reduce API calls
- **Pagination**: Limit data loading
- **Optimistic Updates**: Immediate UI feedback

## 📖 Usage Examples

### Creating a Single Promo Code
```typescript
const promoData = {
  code: 'WELCOME25',
  description: 'Welcome discount for new users',
  discount: '25',
  discount_type: 'PERCENT',
  min_order_amount: '500',
  expiry_date: '2025-12-31T23:59:59Z',
  code_type: 'PUBLIC',
  is_active: true
}
```

### Bulk Creating Promo Codes
```typescript
const bulkData = {
  prefix: 'SUMMER',
  count: 50,
  discount: '15',
  discount_type: 'PERCENT',
  expiry_date: '2025-08-31T23:59:59Z',
  usage_limit: 1
}
```

## 🧪 Testing

### Component Testing
- Unit tests for utility functions
- Component integration tests
- Form validation testing
- API interaction mocking

### User Experience Testing
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility compliance
- Performance benchmarking

## 🔄 Future Enhancements

### Planned Features
- Advanced analytics dashboard
- Promo code templates
- Scheduled campaigns
- A/B testing capabilities
- Integration with marketing tools
- Advanced user targeting
- Revenue impact tracking

### Technical Improvements
- Real-time updates via WebSocket
- Advanced caching strategies
- Offline functionality
- Progressive Web App features

## 📚 Dependencies

### Core Dependencies
- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Zustand**: State management
- **Axios**: HTTP client
- **date-fns**: Date manipulation
- **@heroicons/react**: Icon library

### Development Dependencies
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

## 🛠️ Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Type checking
npx tsc --noEmit
```

## 📝 Code Style Guidelines

- Use TypeScript for all components
- Follow React best practices
- Implement proper error boundaries
- Use consistent naming conventions
- Add proper JSDoc comments
- Maintain component modularity
- Follow accessibility guidelines

## 🎯 Best Practices

1. **Component Design**: Single responsibility principle
2. **State Management**: Centralized with clear actions
3. **Error Handling**: Graceful degradation
4. **Performance**: Optimized re-renders
5. **Accessibility**: WCAG 2.1 compliance
6. **Responsive**: Mobile-first approach
7. **Testing**: Comprehensive coverage

This implementation provides a robust, scalable, and user-friendly interface for managing promotional codes in an enterprise environment.
