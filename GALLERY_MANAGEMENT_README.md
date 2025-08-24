# Gallery Management System

A comprehensive gallery management system for OkPuja admin dashboard built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🖼️ Gallery Management
- **Upload Multiple Images**: Drag & drop or click to upload multiple images
- **Image Preview**: View images in different sizes (thumbnail, medium, large, original)
- **Bulk Operations**: Select multiple items for bulk delete operations
- **Status Management**: Set images as Active, Inactive, or Draft
- **Featured Items**: Mark images as featured for prominent display

### 🔍 Search & Filter
- **Real-time Search**: Search images by title and description
- **Category Filter**: Filter by gallery categories
- **Status Filter**: Filter by image status (Active, Inactive, Draft)
- **Featured Filter**: Filter featured vs non-featured items
- **Advanced Filters**: Collapsible filter panel with multiple options

### 📱 Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Friendly**: Perfect layout for tablet devices
- **Desktop Enhanced**: Full-featured desktop experience
- **Touch Optimized**: Touch-friendly interface elements

### 🎛️ Admin Controls
- **CRUD Operations**: Create, Read, Update, Delete gallery items
- **Category Management**: Organize images by categories
- **Popularity Tracking**: View image popularity and engagement
- **Date Management**: Track creation, update, and photo taken dates

### 🎨 UI/UX Features
- **Professional Design**: Clean, modern interface
- **Interactive Elements**: Hover effects and smooth transitions
- **Loading States**: Comprehensive loading indicators
- **Error Handling**: User-friendly error messages
- **Pagination**: Efficient data loading with pagination

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **React Hot Toast**: Toast notifications

### State Management
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API calls
- **React Query Pattern**: Efficient data fetching

### Backend Integration
- **RESTful API**: Integration with gallery endpoints
- **JWT Authentication**: Secure admin authentication
- **File Upload**: Multipart form data handling
- **Pagination**: Server-side pagination support

## Project Structure

```
src/
├── app/
│   ├── stores/
│   │   └── galleryStore.ts          # Zustand store for gallery state
│   └── (users)/admin/gallery/
│       └── page.tsx                 # Main gallery page
├── components/
│   ├── ui/                          # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── checkbox.tsx
│   │   ├── badge.tsx
│   │   └── loader.tsx
│   └── admin/gallery/               # Gallery-specific components
│       ├── GalleryFilters.tsx       # Search and filter component
│       ├── GalleryToolbar.tsx       # Action toolbar
│       ├── GalleryGrid.tsx          # Image grid layout
│       ├── GalleryItemCard.tsx      # Individual image card
│       ├── GalleryPagination.tsx    # Pagination component
│       ├── UploadModal.tsx          # Image upload modal
│       ├── EditModal.tsx            # Edit image modal
│       ├── ViewModal.tsx            # View image details modal
│       ├── DeleteConfirmModal.tsx   # Delete confirmation modal
│       └── index.ts                 # Component exports
├── types/
│   └── gallery.ts                   # TypeScript type definitions
└── lib/
    └── utils.ts                     # Utility functions
```

## API Integration

The system integrates with the following backend endpoints:

### Gallery Items
- `GET /gallery/admin/items/` - List gallery items with pagination
- `POST /gallery/admin/items/upload/` - Upload new images
- `GET /gallery/admin/items/{id}/` - Get single item details
- `PUT /gallery/admin/items/{id}/` - Update item
- `PATCH /gallery/admin/items/{id}/` - Partial update
- `DELETE /gallery/admin/items/{id}/` - Delete item

### Categories
- `GET /gallery/categories/` - List all categories
- `GET /gallery/categories/{slug}/` - Get category details
- `GET /gallery/categories/{slug}/items/` - Get category items

## Components Overview

### 1. GalleryFilters
- Real-time search functionality
- Category, status, and featured filters
- Collapsible filter panel
- Clear filters option

### 2. GalleryToolbar
- Upload images button
- Bulk delete functionality
- View mode toggle (grid/list)
- Sort options
- Selection controls

### 3. GalleryGrid
- Responsive image grid
- Loading and error states
- Empty state handling

### 4. GalleryItemCard
- Image preview with overlay
- Status and featured badges
- Popularity display
- Action buttons (view, edit, delete)
- Selection checkbox

### 5. GalleryPagination
- Page navigation
- Items per page info
- First/last page buttons
- Responsive design

### 6. Modals
- **UploadModal**: Multi-file upload with drag & drop
- **EditModal**: Edit image details and metadata
- **ViewModal**: Detailed image view with metadata
- **DeleteConfirmModal**: Confirmation for delete actions

## State Management

The gallery uses Zustand for state management with the following features:

### Store Structure
```typescript
interface GalleryState {
  // Data
  items: GalleryItem[];
  categories: GalleryCategory[];
  selectedItems: Set<number>;
  
  // Loading states
  loading: boolean;
  uploading: boolean;
  itemsLoading: boolean;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  
  // Filters & sorting
  filters: GalleryFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  // Actions
  fetchItems: () => Promise<void>;
  uploadItems: (data: GalleryUploadData) => Promise<boolean>;
  updateItem: (id: number, data: Partial<GalleryItemFormData>) => Promise<boolean>;
  deleteItem: (id: number) => Promise<boolean>;
  // ... more actions
}
```

## Responsive Design

### Mobile (< 640px)
- Single column grid
- Stacked filter controls
- Touch-optimized buttons
- Simplified toolbar

### Tablet (640px - 1024px)
- Two column grid
- Compact filter panel
- Medium-sized touch targets

### Desktop (> 1024px)
- Three/four column grid
- Full toolbar with all controls
- Hover interactions
- Keyboard navigation

## Error Handling

The system includes comprehensive error handling:

### API Errors
- Network error detection
- Server error handling
- Validation error display
- Retry mechanisms

### User Experience
- Toast notifications for actions
- Loading states during operations
- Error boundaries for components
- Graceful degradation

## Performance Optimizations

### Image Handling
- Multiple image sizes (thumbnail, medium, large)
- Lazy loading with Next.js Image
- Progressive image enhancement
- Optimized file uploads

### Data Loading
- Pagination for large datasets
- Debounced search queries
- Efficient state updates
- Minimal re-renders

## Security Features

### Authentication
- JWT token validation
- Role-based access control
- Secure API communication
- Auto-logout on token expiry

### File Upload
- File type validation
- Size limit enforcement
- Secure upload handling
- Malware scanning ready

## Installation & Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   # Set API base URL in .env.local
   NEXT_PUBLIC_API_BASE_URL=https://api.okpuja.com/api
   ```

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

4. **Build for Production**
   ```bash
   pnpm build
   ```

## Usage

### Accessing Gallery Management
1. Login as admin user
2. Navigate to `/admin/gallery`
3. View and manage gallery items

### Uploading Images
1. Click "Upload Images" button
2. Drag & drop files or click to select
3. Fill in title, description, and category
4. Set status and featured flag
5. Click "Upload Images"

### Managing Items
1. Use filters to find specific items
2. Select items using checkboxes
3. Use action buttons for individual items
4. Bulk operations for multiple items

### Editing Items
1. Click "Edit" on any gallery item
2. Modify title, description, category
3. Update status and featured flag
4. Save changes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and roles
- High contrast support
- Focus management

## Future Enhancements

- [ ] Drag & drop reordering
- [ ] Image cropping and editing
- [ ] Advanced metadata editing
- [ ] Bulk category assignment
- [ ] Export functionality
- [ ] Advanced analytics
- [ ] Image optimization
- [ ] CDN integration

## Contributing

1. Follow TypeScript best practices
2. Maintain responsive design principles
3. Add proper error handling
4. Include loading states
5. Write comprehensive tests
6. Update documentation

## License

This project is part of the OkPuja platform and follows the company's licensing terms.