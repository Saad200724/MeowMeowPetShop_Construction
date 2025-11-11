# Meow Meow Pet Shop - E-commerce Application

## Overview
This is a full-stack e-commerce application for Meow Meow Pet Shop, an online store providing pet products for cats and dogs. The application offers a complete online shopping experience including food, toys, grooming supplies, and accessories. The project aims to provide a comprehensive and user-friendly platform for pet owners in Savar, Bangladesh, with ambitions for broader market reach.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### General Architecture
The application follows a modern full-stack architecture with clear separation between frontend, backend, and shared components, utilizing a monorepo structure. TypeScript is used throughout the entire application stack for type safety.

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with a custom design system, including a yellow-based vertical scrollbar.
- **UI Components**: shadcn/ui library built on Radix UI primitives, ensuring high-quality and customizable UI.
- **State Management**: TanStack Query for server state management.
- **Build Tool**: Vite for development and production builds.
- **Key Features**: Product browsing with categories, advanced search, filtering, sorting, product ratings, collapsible sidebar navigation, mobile-responsive design, and comprehensive product pages.
- **Image Upload**: Comprehensive image upload system for products, allowing file uploads (multer-based, 5MB limit) or URL input with real-time preview.

### Backend
- **Runtime**: Node.js with Express.js framework.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful API structure for categories, brands, products, and blog posts.
- **Development**: Hot module replacement with Vite integration.
- **Server Setup**: Express middleware configuration and robust error handling.
- **Storage Layer**: Abstract storage interface for business logic processing.

### Database
- **ODM**: Mongoose for MongoDB document modeling.
- **Database**: MongoDB (configured via `MONGODB_URI` environment variable).
- **Schema**: Mongoose schemas defined in `shared/models.ts`.
- **Authentication Session Storage**: MongoDB for session management.

### Key Architectural Decisions
- **Monorepo Structure**: Facilitates easier development and deployment by keeping all components in one repository.
- **TypeScript Throughout**: Ensures type safety across the entire application stack.
- **shadcn/ui**: Provides high-quality, customizable components for design consistency.
- **Shared Schema**: Centralized data models reduce duplication and ensure consistency.
- **Abstract Storage**: Allows for easy testing and potential database switching.
- **Component-Based Product System**: Utilizes reusable components for scalable product catalog management.

## External Dependencies

### Frontend
- **UI Framework**: React ecosystem with hooks.
- **Styling**: Tailwind CSS with PostCSS.
- **Icons**: Lucide React.
- **Forms**: React Hook Form with Zod validation.
- **Date Handling**: date-fns.

### Backend
- **Database**: MongoDB.
- **ODM**: Mongoose.
- **Validation**: Zod for runtime type checking.
- **Session Management**: MongoDB session store.
- **File Uploads**: Multer for image file uploads.

### Development
- **Build Tools**: Vite with React plugin and esbuild.
- **TypeScript**: Full TypeScript support.

### Authentication
- **Authentication Service**: Supabase for user authentication (sign up, sign in, sign out, session persistence).
- **Email Delivery**: Supabase configured with custom Gmail SMTP for sending OTP verification emails (no rate limits).
- **OTP Flow**: Email-based one-time password authentication for both signup and signin.

## Recent Changes

### November 2, 2025 - Dashboard Improvements
- **Fixed Data Accuracy**: Dashboard now displays real user statistics calculated from actual orders instead of hardcoded values
  - Total spent calculated from all completed orders
  - Order counts by status (delivered, pending, processing) are accurate
  - Wishlist count loaded from localStorage
  - Active coupons fetched from API
- **Improved Mobile Responsiveness**: Enhanced grid layouts and card spacing for better mobile user experience
  - Updated responsive breakpoints for better mobile layout
  - Made order cards stack vertically on mobile with improved touch-friendly buttons
  - Improved text sizing and spacing for mobile devices
- **Added Empty States**: Users with no orders see helpful messaging and call-to-action to browse products
- **Better Error Handling**: Gracefully handle missing API endpoints with fallbacks to prevent crashes

### November 2, 2025 - OTP Email System Fixed
- Reverted from custom backend OTP to Supabase OTP (which has custom Gmail SMTP configured)
- OTP emails now successfully delivered to users' mailboxes via Supabase + Gmail SMTP
- Fixed state management to properly merge statistics from multiple API calls

### November 2, 2025 - Shop By Category Section Redesign
- **Professional UI Redesign**: Complete overhaul of Shop By Category section to match and exceed competitor standards
  - Enhanced typography with larger, bolder fonts (text-base to text-lg on desktop, text-sm on mobile)
  - Improved text contrast using text-gray-900 for maximum readability
  - Professional header with decorative elements and descriptive subtitle
- **Enhanced Card Design**: 
  - Upgraded to rounded-2xl corners for modern look
  - Professional shadows (shadow-lg with shadow-2xl on hover)
  - Added subtle borders (border-gray-100) for definition
  - Gradient backgrounds (from-gray-50 to-white)
  - Drop shadows on images for depth
- **Better User Experience**:
  - Smooth hover effects with lift animation and shadow transitions
  - Optimized mobile layout with better aspect ratios and spacing
  - Line-clamp for long category names
  - Touch-friendly card sizes on mobile
- **Section Background**: Gradient background (bg-gradient-to-b from-gray-50 to-white) for visual interest

### November 2, 2025 - Critical Inventory Management Fix
- **Stock Decrement Implementation**: Fixed critical bug where product stock was not decreasing after orders
  - Implemented MongoDB transactions for atomic order processing
  - All operations (order creation, stock decrement, coupon usage, invoice creation, cart clearing) wrapped in a single transaction
  - Automatic rollback if any operation fails (prevents partial states and inventory inconsistencies)
  - Atomic stock validation and decrement using `findOneAndUpdate` with `$gte` filter
  - Race condition protection: ensures stock never goes negative even with concurrent orders
  - Stock updates now immediately visible in both website and admin panel
- **Transaction Flow**: Start → Create Order → Decrement Stock (atomic) → Increment Coupon → Create Invoice → Clear Cart → Commit (or Rollback on any failure)

### November 4, 2025 - Multiple Product Images Feature
- **Multiple Image Upload System**: Added ability to upload up to 3 images per product
  - New backend endpoint `/api/upload/images` handles batch uploads with multer.array
  - All images automatically converted to WebP format for optimal performance
  - Created MultipleImageUpload component with drag-and-drop, URL input, and preview grid
  - Image removal and reordering supported with visual feedback
  - First image marked as "Main" product image
- **Product Gallery Enhancement**: Updated product detail pages with interactive image gallery
  - Main image display with zoom functionality preserved
  - Thumbnail grid (4 columns) below main image for multi-image products
  - Click thumbnails to switch main display
  - Selected thumbnail highlighted with green border and ring
  - Automatic reset to first image when navigating between products
- **Admin Panel Integration**: Enhanced product creation/edit forms
  - Main Product Image field for primary display image
  - Additional Product Images field for up to 3 supplementary images
  - Real-time preview of all uploaded images with removal buttons
  - Validation: 5MB per file, image types only, max 3 images
- **MongoDB Integration Fix**: Fixed critical bug where images array wasn't being saved
  - Added `images` field to product creation route (POST /api/products)
  - Added `images` field to product update route (PUT /api/products/:id)
  - Fixed form reset to include existing `images` array when editing products
  - Images now properly persist to MongoDB and display in product detail pages

### November 4, 2025 - Dynamic Banner & Popup Poster Management System
- **Admin Panel Graphics Section**: Complete banner and popup poster management from admin panel
  - Graphics tab in admin panel for managing all visual marketing content
  - Upload, edit, delete, and toggle active/inactive status for banners and posters
  - Image URL input with real-time preview
  - Order management for banner display sequence
- **Dynamic Home Page Banner Carousel**: Transformed static banner to dynamic carousel system
  - Fetches active banners from `/api/banners/active` API endpoint
  - Supports 1-3 banners with intelligent UI adaptation:
    - Single banner: Clean display without navigation controls
    - Multiple banners: Full carousel with auto-advance, arrows, and dot indicators
  - Auto-advance every 5 seconds with smooth transitions
  - Navigation arrows and clickable dot indicators for manual control
  - Carousel state automatically resets when banner count changes (prevents blank display)
  - Fallback to default banner image if no banners configured in database
  - Loading skeleton during data fetch for better UX
- **Popup Poster System**: Promotional posters appear on website load
  - Fetches active popup from `/api/popup-posters/active` API endpoint
  - Shows once per day per user (localStorage tracking)
  - Appears 1 second after page load for better UX
  - Fully dismissible with close button
  - Only one popup can be active at a time (controlled by admin)
  - Transparent modal design with shadow effects
  - Integrated into main App component for global availability
- **Backend API**: MongoDB-backed Banner and PopupPoster models with RESTful APIs
  - Banner CRUD endpoints with 3-banner maximum validation
  - PopupPoster CRUD endpoints with single-active-poster logic
  - Order-based sorting for banner display sequence
