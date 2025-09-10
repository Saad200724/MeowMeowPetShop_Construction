# Meow Meow Pet Shop - E-commerce Application

## Overview

This is a full-stack e-commerce application for Meow Meow Pet Shop, a pet store based in Savar, Bangladesh. The application provides a complete online shopping experience for pet products including food, toys, grooming supplies, and accessories for cats and dogs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure
- **Development**: Hot module replacement with Vite integration

### Database Architecture
- **ORM**: Mongoose for MongoDB document modeling
- **Database**: MongoDB (configured via MONGODB_URI in .env file)
- **Schema**: Mongoose schemas defined in shared/models.ts
- **Authentication**: MongoDB session storage

## Key Components

### Directory Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared types and schemas
├── attached_assets/ # Static assets and images
└── migrations/      # Database migration files
```

### Frontend Components
- **Layout Components**: Header with top strip, main navigation, sidebar, and footer
- **Section Components**: Hero banner, product listings, categories, testimonials
- **UI Components**: Reusable components built on shadcn/ui
- **Custom Components**: Product cards, countdown timers, carousels

### Backend Components
- **Routes**: RESTful API endpoints for categories, brands, products, blog posts
- **Storage Layer**: Abstract storage interface with in-memory implementation
- **Server Setup**: Express middleware configuration and error handling

### Shared Components
- **Schema**: Drizzle schema definitions for all database tables
- **Types**: TypeScript type definitions exported from schema

## Data Flow

1. **Client Requests**: React components use TanStack Query to fetch data
2. **API Layer**: Express routes handle HTTP requests and validate input
3. **Storage Layer**: Abstract storage interface processes business logic
4. **Database**: Drizzle ORM executes type-safe database queries
5. **Response**: JSON data flows back through the same layers

The application uses a query-first approach where the frontend drives data requirements, and the backend provides a clean API interface.

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React ecosystem with hooks and modern patterns
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date manipulation

### Backend Dependencies
- **Database**: MongoDB with Mongoose ODM
- **ODM**: Mongoose for document modeling and validation
- **Validation**: Zod for runtime type checking
- **Session Management**: MongoDB session store

### Development Dependencies
- **Build Tools**: Vite with React plugin
- **TypeScript**: Full TypeScript support across the stack
- **Development**: Hot reload and error overlay for development experience

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets in `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations ensure schema consistency

### Environment Configuration
- **Development**: Uses Vite dev server with Express API proxy
- **Production**: Serves static files from Express with API routes
- **Database**: Environment variable `MONGODB_URI` for connection (from .env file)

### Scripts
- `npm run dev`: Development mode with hot reload
- `npm run build`: Production build for both frontend and backend
- `npm start`: Production server startup
- Note: Uses MongoDB with Mongoose, no schema push needed

The application is designed for easy deployment to platforms like Replit, Vercel, or traditional hosting providers with Node.js support.

## Recent Updates (September 10, 2025)

### Successful GitHub Import and Replit Environment Setup (Latest Update)
- **GitHub Clone Migration**: Successfully imported and configured the Meow Meow Pet Shop project from GitHub in the Replit environment
- **Development Workflow**: Configured proper workflow for full-stack application serving both frontend and backend on port 5000
- **Environment Configuration**: Validated MongoDB connection string and Supabase authentication credentials
- **Server Configuration**: Express server configured with proper host binding (0.0.0.0:5000) for Replit proxy compatibility
- **Vite Integration**: Frontend development server integrated with backend using Vite middleware in development mode
- **Database Connection**: MongoDB Atlas connection working successfully with existing data (products, blog posts, announcements)
- **Authentication System**: Supabase authentication service configured and functional
- **Production Ready**: Deployment configuration set up for autoscale deployment target
- **API Endpoints**: All REST API endpoints functioning correctly (products, categories, blog, announcements, repack products)
- **Asset Management**: Static file serving and image uploads working properly through Express middleware

## Previous Updates (September 9, 2025)

### MongoDB Configuration & Environment Setup (Latest Update)
- **Database Preference**: Project configured to use MongoDB exclusively via MONGODB_URI in .env file
- **Environment Configuration**: Updated all configuration files to ensure MongoDB is used by default
- **Package Dependencies**: Confirmed Mongoose ODM setup for MongoDB document operations
- **UI Customization**: Maintained yellow-based vertical scrollbar matching brand colors
- **GitHub Import Ready**: Configuration files updated to ensure future GitHub imports read .env correctly
- **No PostgreSQL**: Removed all PostgreSQL references to prevent confusion on future imports

### Previous Migration to Replit Environment & Category Update

### Migration to Replit Environment & UI Enhancements (Latest Update)
- **Successful Migration**: Completed migration from Replit Agent to standard Replit environment
- **Database Migration**: Converted from Neon serverless to PostgreSQL with proper connection setup
- **Package Dependencies**: Updated database drivers from @neondatabase/serverless to pg for PostgreSQL compatibility
- **UI Customization**: Implemented yellow-based vertical scrollbar matching brand colors
- **Horizontal Scroll Prevention**: Removed horizontal scrolling across the entire application
- **Environment Setup**: Created PostgreSQL database and configured all necessary environment variables

### Previous Migration to Replit Environment & Category Update
- **Successful Migration**: Completed migration from Replit Agent to standard Replit environment
- **Database Integration**: Created PostgreSQL database and configured proper connection
- **Category System Overhaul**: Updated all product categories to match the "Shop by Category" section with 10 specific categories
- **New Category Structure**: Adult Food, Kitten Food, Collar, Clumping Cat Litter, Cat Litter Accessories, Harness, Cat Tick & Flea Control, Deworming Tablet, Cat Pouches, and Sunglass
- **Icon Mapping**: Fixed icon mappings for all new categories to prevent rendering errors
- **Routing Updates**: Updated product page routing to work with new category IDs
- **Clean Data Structure**: Removed all dummy products to keep categories empty for future content addition
- **Brand Pages Implementation**: Added 7 new brand pages (NEKKO, PURINA, ONE, Reflex Plus, ROYAL CANIN, Sheba) with individual routing and product display systems
- **Enhanced Featured Brands Section**: Updated home page Featured Brands to display the 7 brands from user's design with clickable navigation
- **Brand Logo Implementation**: Generated and integrated professional brand logos for all 7 featured brands (NEKKO, PURINA, ONE, Reflex, Reflex Plus, ROYAL CANIN, Sheba) replacing text names with visual brand assets

## Previous Updates (January 28, 2025)

### Image Upload Feature Enhancement (Latest Update)
- **Comprehensive Image Upload System**: Added full-featured image upload functionality to the product management system
- **Dual Input Options**: Users can now either upload image files directly or provide image URLs
- **File Upload Backend**: Implemented secure multer-based file upload with 5MB size limit and image type validation
- **Advanced Upload UI**: Created tabbed interface with drag-and-drop file upload and URL input options
- **Image Preview**: Real-time image preview with error handling for broken URLs
- **Security Features**: File type validation, size limits, and secure file storage in uploads directory
- **Error Handling**: Comprehensive error messages and toast notifications for upload feedback
- **Form Integration**: Seamlessly integrated with existing product edit forms in admin panel

### Complete E-commerce Implementation with Enhanced Navigation
- **Custom Green Scroll Bar**: Implemented polished vertical scroll bar styling across the entire website
- **Comprehensive Page Structure**: Created 7 new pages - Privilege Club, Cat Food, Dog Food, Cat Toys, Cat Litter, Reflex Brand, and Blog
- **Advanced Search System**: Built global search functionality that searches across all products from all categories
- **Product Segmentation**: Each category page includes proper segments (e.g., Cat Food has Adult Food, Cat Pouches, Dry Food, etc.)
- **Enhanced Header Navigation**: Complete navigation menu with dropdown categories and mobile-responsive design

### New Pages and Features
- **Privilege Club**: Membership page with three tiers (Silver Paw, Golden Paw, Diamond Paw) featuring benefits and pricing
- **Cat Food Page**: 13 product segments including Adult Food, Cat Pouches, Dry Food, Kitten Food, etc.
- **Dog Food Page**: 9 product segments including Puppy Food, Adult Food, Health Supplements, etc.
- **Cat Toys Page**: 12 toy categories including Interactive Toys, Feather Toys, Cat Trees, etc.
- **Cat Litter Page**: 9 categories including Clumping Litter, Litter Boxes, Accessories, etc.
- **Reflex Brand Page**: Dedicated brand page showcasing premium pet food products
- **Blog Page**: Pet care blog with categories, featured articles, and newsletter signup

### Technical Enhancements
- **Global Search Data**: Comprehensive search database with 30+ products across all categories
- **Search Functionality**: Real-time search with dropdown results showing product details and direct navigation
- **Mobile Navigation**: Collapsible mobile menu with category sub-items
- **Responsive Design**: All new pages are fully mobile-responsive with consistent styling
- **Enhanced UI Components**: Professional product cards, filtering systems, and category navigation

### Migration and Configuration Improvements
- **GitHub Import Optimization**: Removed hardcoded credentials and added proper environment variable handling
- **Configuration Files**: Added .env.example, comprehensive README.md, and setup.md for easy project setup
- **Error Handling**: Improved Supabase configuration with clear error messages for missing environment variables
- **Documentation**: Created detailed setup guide for GitHub imports and troubleshooting

## Previous Updates (January 25, 2025)

### Product Page System Implementation
- **Full-fledged Product Pages**: Complete e-commerce product browsing system with 6 categories (Cat Food, Dog Food, Toys & Treats, Grooming, Health Care, Accessories)
- **Collapsible Sidebar Navigation**: Mobile-responsive sidebar with category filtering and smooth animations
- **Supabase Authentication**: Complete user authentication system with sign up, sign in, sign out, and session persistence
- **Analytics Dashboard**: Lightweight analytics showing lowest/highest priced items, highest rated products, and best sellers
- **Advanced Product Features**: Search, filtering, sorting, grid/list view modes, product ratings, stock status, and pricing
- **Responsive Design**: Mobile-first design with collapsible navigation and adaptive layouts

### Architecture Enhancements
- **Product Data Management**: MongoDB-ready JSON structure with comprehensive product information
- **Component Architecture**: Modular components for CollapsibleSidebar, ProductCard, AnalyticsBar, and AuthModal
- **State Management**: React hooks for authentication state and product filtering
- **Animation System**: Custom CSS animations for fade-in, slide-up, hover effects, and smooth transitions

### Key Architectural Decisions

1. **Monorepo Structure**: Keeps frontend, backend, and shared code in one repository for easier development and deployment
2. **TypeScript Throughout**: Ensures type safety across the entire application stack
3. **Drizzle ORM**: Chosen for its TypeScript-first approach and lightweight footprint
4. **shadcn/ui**: Provides high-quality, customizable components while maintaining design consistency
5. **Shared Schema**: Central source of truth for data models reduces duplication and ensures consistency
6. **Abstract Storage**: Allows for easy testing and potential database switching without changing business logic
7. **Supabase Integration**: Centralized authentication service with environment variable configuration
8. **Component-Based Product System**: Reusable components for scalable product catalog management