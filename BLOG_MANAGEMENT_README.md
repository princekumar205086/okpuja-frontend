# Blog Management System

A comprehensive blog management system for the OKPuja admin panel with enterprise-level features and mobile-first responsive design.

## Features

### 📊 Overview Dashboard
- Real-time statistics and metrics
- Visual indicators for content status
- Performance tracking with view counts
- Trend analysis with percentage changes

### 📝 Posts Management
- **Rich Text Editor** with full formatting capabilities
  - Bold, italic, underline text formatting
  - Lists (bulleted and numbered)
  - Text alignment options
  - Blockquotes and code blocks
  - Image insertion with drag & drop
  - Link insertion
  - Undo/Redo functionality
- **Featured Posts** with star indicators
- **Status Management** (Draft, Published, Archived)
- **Category and Tag Assignment**
- **SEO-friendly** with meta fields
- **YouTube Video Embedding**
- **Image Upload** with preview
- **Search and Filtering** by status, category, author
- **Bulk Operations** support

### 📂 Categories Management
- Create, edit, and delete categories
- **SEO Optimization** with meta titles, keywords, descriptions
- Status management (Draft, Published, Archived)
- Slug generation for URLs
- Hierarchical organization support

### 🏷️ Tags Management
- Flexible tagging system
- Autocomplete tag selection
- Visual tag management with chip interface
- Status control for tag visibility
- Search and filter capabilities

### 💬 Comments Management
- **Moderation System** with approval workflow
- **Real-time Editing** of comment content
- User information display
- **Bulk Approval/Rejection** actions
- Post-specific comment filtering
- **Spam Detection** indicators

## Technical Implementation

### 🎨 Design System
- **Material-UI Components** for consistent design
- **Tailwind CSS** for responsive styling
- **Mobile-first** approach with breakpoint optimization
- **Dark/Light Theme** support
- **Enterprise-grade** color scheme matching screenshot reference

### 🔧 State Management
- **Zustand** for efficient state management
- **Optimistic Updates** for better UX
- **Error Handling** with user-friendly messages
- **Loading States** with proper indicators

### 🚀 Performance Features
- **Lazy Loading** for large data sets
- **Pagination** for better performance
- **Search Debouncing** to reduce API calls
- **Caching Strategy** for frequently accessed data

### 📱 Responsive Design
- **Mobile-first** responsive design
- **Tablet-optimized** layouts
- **Desktop-enhanced** experience
- **Touch-friendly** interactions

### 🔄 API Integration
- **RESTful API** integration with axios
- **Automatic Token Refresh** handling
- **Error Recovery** mechanisms
- **Offline Support** indicators

## API Endpoints

### Blog Posts
- `GET /blog/posts/` - List posts with pagination and filters
- `POST /blog/posts/create/` - Create new post
- `GET /blog/posts/{slug}/` - Get single post
- `PUT /blog/posts/{slug}/` - Update post
- `DELETE /blog/posts/{slug}/` - Delete post
- `GET /blog/posts/popular/` - Get popular posts

### Categories
- `GET /blog/categories/` - List all categories
- `POST /blog/categories/` - Create category
- `GET /blog/categories/{slug}/` - Get single category
- `PUT /blog/categories/{slug}/` - Update category
- `DELETE /blog/categories/{slug}/` - Delete category

### Tags
- `GET /blog/tags/` - List all tags
- `POST /blog/tags/` - Create tag
- `GET /blog/tags/{slug}/` - Get single tag
- `PUT /blog/tags/{slug}/` - Update tag
- `DELETE /blog/tags/{slug}/` - Delete tag

### Comments
- `GET /blog/posts/{post_slug}/comments/` - Get post comments
- `POST /blog/posts/{post_slug}/comments/` - Create comment
- `PUT /blog/comments/{id}/` - Update comment
- `DELETE /blog/comments/{id}/` - Delete comment

## Usage

### Accessing Blog Management
1. Navigate to `/admin/blog` in the admin panel
2. Use the tab navigation to switch between different sections
3. Overview tab shows dashboard with statistics
4. Posts tab for content management
5. Categories and Tags tabs for organization
6. Comments tab for moderation

### Creating a Blog Post
1. Go to Posts tab
2. Click "Add New Post" button
3. Fill in the title and content using the rich text editor
4. Select category and add relevant tags
5. Upload featured image if needed
6. Set status (Draft/Published)
7. Toggle featured post if needed
8. Save the post

### Managing Categories
1. Navigate to Categories tab
2. Click "Add Category" to create new categories
3. Fill in name, description, and SEO metadata
4. Set appropriate status
5. Save changes

### Comment Moderation
1. Go to Comments tab
2. Select a post from the dropdown
3. View all comments for that post
4. Approve/reject comments using the action buttons
5. Edit comment content if needed
6. Delete inappropriate comments

## Mobile Experience

The blog management system is optimized for mobile devices:
- **Bottom Drawer** modals for forms on mobile
- **Responsive Tables** that adapt to screen size
- **Touch-friendly** buttons and interactions
- **Swipe Gestures** for navigation
- **Optimized Typography** for readability

## Security Features

- **Role-based Access Control** (Admin only)
- **CSRF Protection** for form submissions
- **XSS Prevention** in rich text editor
- **Input Validation** on both client and server
- **Secure File Upload** with type validation

## Performance Optimizations

- **Code Splitting** for faster initial load
- **Image Optimization** with next/image
- **Bundle Size Optimization** with tree shaking
- **Memory Management** in rich text editor
- **Efficient Re-rendering** with React optimizations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Notes

The blog management system follows enterprise-level standards:
- **TypeScript** for type safety
- **ESLint** for code quality
- **Responsive Design** patterns
- **Accessibility** (WCAG 2.1 AA compliance)
- **SEO Best Practices** implementation
- **Performance Monitoring** ready
