# Astrology Services Management

A comprehensive CRUD interface for managing astrology services with modern UI/UX design patterns.

## Features

### ✨ Core Functionality
- **Complete CRUD Operations**: Create, Read, Update, Delete astrology services
- **Dual View Modes**: Switch between table and card layouts
- **Advanced Filtering**: Filter by service type, status, price range, and duration
- **Real-time Search**: Debounced search across service titles and descriptions
- **Pagination**: Server-side pagination with customizable page sizes
- **Image Management**: Upload and manage service images with automatic thumbnail generation

### 🎨 UI/UX Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern Material UI**: Clean, professional interface using MUI components
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Rich Text Editor**: TipTap editor for detailed service descriptions
- **Toast Notifications**: Real-time feedback for all user actions
- **Loading States**: Elegant loading indicators and skeleton screens

### 🔧 Technical Implementation
- **Zustand State Management**: Centralized state with persistence
- **TypeScript**: Full type safety and better developer experience
- **Axios Integration**: HTTP client with automatic token management
- **Form Validation**: Comprehensive client-side validation
- **Error Handling**: Graceful error handling with user-friendly messages

## File Structure

```
astrology-services/
├── page.tsx                              # Main page component
├── components/
│   ├── AstrologyServiceHeader.tsx        # Header with stats and actions
│   ├── AstrologyServiceFilters.tsx       # Search and filter controls
│   ├── AstrologyServiceTable.tsx         # DataGrid table view
│   ├── AstrologyServiceCards.tsx         # Card grid view
│   ├── AstrologyServiceDrawer.tsx        # Bottom drawer for CRUD operations
│   ├── RichTextEditor.tsx               # TipTap rich text editor
│   ├── LoadingSpinner.tsx               # Loading component
│   ├── ErrorAlert.tsx                   # Error display component
│   └── index.ts                         # Component exports
├── styles/
│   └── components.css                   # Custom styles and utilities
└── README.md                           # This documentation
```

## State Management

### Zustand Store (`astrologyServiceStore.ts`)

The store manages:
- **Service Data**: Array of astrology services
- **UI State**: Loading, error, pagination, view mode
- **Filters**: Search term, service type, status, price/duration ranges
- **Drawer State**: Open/close, mode (view/edit/create), selected service

### Key Actions
- `fetchServices()`: Load services with filters and pagination
- `createService()`: Create new service with image upload
- `updateService()`: Update existing service
- `deleteService()`: Delete service with confirmation
- `toggleServiceStatus()`: Activate/deactivate service

## API Integration

### Endpoints Used
- `GET /astrology/services/` - List services with filters
- `POST /astrology/services/create/` - Create new service
- `PUT /astrology/services/{id}/update/` - Update service
- `DELETE /astrology/services/{id}/delete/` - Delete service
- `PATCH /astrology/services/{id}/image/` - Update service image

### Data Format
```typescript
interface AstrologyService {
  id: number;
  title: string;
  service_type: 'HOROSCOPE' | 'MATCHING' | 'PREDICTION' | 'REMEDIES' | 'GEMSTONE' | 'VAASTU';
  description: string;
  image_url?: string;
  image_thumbnail_url?: string;
  image_card_url?: string;
  price: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

## Components Overview

### AstrologyServiceHeader
- Displays service statistics and metrics
- View mode toggle (table/card)
- Create new service button
- Refresh functionality

### AstrologyServiceFilters
- Search input with debouncing
- Service type dropdown filter
- Status filter (active/inactive)
- Advanced filters (price range, duration range)
- Active filter chips with removal

### AstrologyServiceTable
- MUI DataGrid with server-side pagination
- Sortable columns
- Action menu for each row
- Responsive design with mobile optimizations

### AstrologyServiceCards
- Grid layout with responsive columns
- Card hover effects and animations
- Quick action buttons
- Empty state handling

### AstrologyServiceDrawer
- Bottom drawer for mobile-friendly CRUD
- Three modes: view, edit, create
- Rich text editor for descriptions
- Image upload with preview
- Form validation and error handling

### RichTextEditor
- TipTap-based rich text editor
- Formatting toolbar (bold, italic, lists, quotes)
- Character count with limits
- Placeholder support

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Bottom drawer for forms
- Stacked filter controls
- Simplified table columns
- Touch-friendly buttons
- Swipe gestures support

## Styling

### Tailwind CSS Classes
- Utility-first approach
- Custom component classes
- Responsive modifiers
- Dark mode support (prepared)

### Material UI Theme
- Purple primary color scheme
- Custom shadows and elevations
- Consistent spacing system
- Typography scale

## Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Debounced Search**: Reduces API calls
- **Memoized Components**: Prevent unnecessary re-renders
- **Optimistic Updates**: UI updates before API confirmation
- **Image Optimization**: Thumbnails and compressed images

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions
- **Focus Management**: Proper focus indicators
- **Color Contrast**: WCAG compliant color schemes

## Usage Examples

### Creating a New Service
1. Click "Add Service" button in header
2. Fill in service details in the drawer
3. Upload an image (optional)
4. Use rich text editor for description
5. Set price and duration
6. Toggle active status
7. Click "Create Service"

### Filtering Services
1. Use search box for text search
2. Select service type from dropdown
3. Choose status filter
4. Expand advanced filters for price/duration ranges
5. Clear filters using chip remove buttons

### Bulk Operations
- Select multiple services in table view
- Use bulk action buttons (planned feature)
- Export filtered data (planned feature)

## Future Enhancements

- [ ] Bulk operations (delete, status update)
- [ ] Export functionality (CSV, PDF)
- [ ] Service analytics dashboard
- [ ] Advanced image editing
- [ ] Service templates
- [ ] Duplicate service functionality
- [ ] Service categories management
- [ ] Booking integration
- [ ] Revenue tracking per service

## Development Notes

### Adding New Filters
1. Add filter field to `AstrologyServiceFilters` interface in store
2. Update `AstrologyServiceFilters` component
3. Modify `fetchServices` function to handle new filter
4. Update API query parameters

### Customizing Table Columns
1. Modify `columns` array in `AstrologyServiceTable.tsx`
2. Add corresponding data fields to service interface
3. Update responsive column hiding logic

### Extending Rich Text Editor
1. Add new TipTap extensions to `RichTextEditor.tsx`
2. Update toolbar with new formatting options
3. Modify styles for new content types

## Dependencies

- **React**: ^19.0.0
- **Material UI**: ^7.2.0
- **Framer Motion**: ^12.23.0
- **TipTap**: ^2.26.0
- **Zustand**: ^5.0.6
- **Axios**: ^1.10.0
- **Date-fns**: ^4.1.0
- **React Hot Toast**: ^2.5.2

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This component is part of the OkPuja frontend application.
