# Puja Services Management Page

This is a comprehensive admin dashboard page for managing Puja Services with full CRUD operations.

## Features

### 🎯 Core Functionality
- **Complete CRUD Operations** for Puja Services
- **Category Management** with dedicated manager
- **Advanced Search and Filtering**
- **Responsive Design** for all devices (desktop, tablet, mobile)
- **Professional UI/UX** with Material-UI components

### 📊 Data Views
- **Table View** - MUI DataGrid with sorting, pagination, and built-in search
- **Card View** - Mobile-friendly card layout with service previews
- **View Switcher** - Toggle between table and card views
- **Responsive Pagination** - Customizable page sizes (5, 10, 25, 50, 100)

### 🔍 Search & Filter
- **Real-time Search** - Search by title, description, or category
- **Advanced Filters** - Filter by category, service type, and status
- **Filter Chips** - Visual representation of active filters
- **Debounced Search** - Optimized search with 500ms delay

### 📤 Export Functionality
- **Excel Export** - Export services data to Excel format (.xlsx)
- **Automatic Formatting** - Properly formatted columns and data
- **Date Stamped Files** - Files include current date in filename

### 🎨 UI/UX Features
- **Bottom Drawers** - MUI bottom drawers for forms and details (as requested)
- **Mobile-First Design** - Optimized for mobile app-like experience
- **Loading States** - Skeleton loaders and progress indicators
- **Error Handling** - Comprehensive error messages and recovery
- **Toast Notifications** - Real-time feedback for user actions

### 📱 Responsive Design
- **Mobile Optimized** - Works perfectly on phones and tablets
- **Breakpoint System** - Tailwind CSS responsive breakpoints
- **Touch Friendly** - Large touch targets and mobile interactions
- **App-like Experience** - Native mobile app feel

## Components Structure

```
puja-services/
├── page.tsx                 # Main page component
├── utils.ts                 # Utility functions and exports
├── ServiceForm.tsx          # Create/Edit service form
├── ServiceDetails.tsx       # Service details view
├── ServiceFilters.tsx       # Search and filter components
├── ServiceTableView.tsx     # DataGrid table view
├── ServiceCardView.tsx      # Card view for mobile
├── ServiceToolbar.tsx       # Action toolbar with view switcher
├── ServicePagination.tsx    # Pagination component
└── CategoryManager.tsx      # Category management
```

## State Management

- **Zustand Store** - `pujaServiceStore.ts` manages all state
- **Persistent State** - View preferences and filters persist across sessions
- **Optimistic Updates** - Immediate UI updates with rollback on error
- **Loading States** - Granular loading states for different operations

## API Integration

The page integrates with your Django backend API:

### Endpoints Used
- `GET /puja/services/` - List services with pagination and filters
- `POST /puja/services/create/` - Create new service
- `PATCH /puja/services/{id}/` - Update service
- `DELETE /puja/services/{id}/` - Delete service
- `GET /puja/categories/` - List categories
- `POST /puja/categories/create/` - Create category
- `PATCH /puja/categories/{id}/` - Update category
- `DELETE /puja/categories/{id}/` - Delete category

### Authentication
- Uses JWT tokens from `authStore`
- Automatic token refresh
- Admin role verification

## Data Models

The frontend models match your Django backend:

```typescript
interface PujaService {
  id: number;
  title: string;
  image_url?: string;
  description: string;
  category: number;
  category_detail?: PujaCategory;
  type: 'HOME' | 'TEMPLE' | 'ONLINE';
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

## Key Features Implemented

### ✅ CRUD Operations
- Create services with image upload
- Edit existing services
- Delete with confirmation
- View detailed service information

### ✅ Advanced UI
- Professional Material-UI design
- Consistent spacing and typography
- Loading states and error handling
- Mobile-optimized layouts

### ✅ Data Management
- Server-side pagination
- Real-time search and filtering
- Excel export functionality
- Category management

### ✅ Mobile Experience
- Touch-friendly interactions
- Responsive grid layouts
- Bottom drawers for mobile
- Swipe gestures support

## Usage

1. **View Services** - Browse all services in table or card view
2. **Search & Filter** - Use the search bar and filters to find specific services
3. **Create Service** - Click "Add Service" to create a new service
4. **Edit Service** - Click edit icon or service details to modify
5. **Delete Service** - Click delete icon with confirmation dialog
6. **Manage Categories** - Use the category button in toolbar
7. **Export Data** - Use export menu to download Excel files
8. **Switch Views** - Toggle between table and card views

## Technologies Used

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Material-UI v7** for components
- **Tailwind CSS** for responsive design
- **Zustand** for state management
- **React Hot Toast** for notifications
- **XLSX** for Excel export
- **Axios** for API calls

## Performance Optimizations

- Debounced search to reduce API calls
- Lazy loading of components
- Optimized image loading
- Memoized expensive calculations
- Efficient re-rendering with proper dependencies

The page is ready for production use and provides a complete admin experience for managing puja services!
