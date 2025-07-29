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
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Centralized schema definition in shared directory
- **Migrations**: Drizzle Kit for database migrations

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
- **Database**: Neon serverless PostgreSQL
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for runtime type checking
- **Session Management**: PostgreSQL session store

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
- **Database**: Environment variable `DATABASE_URL` for connection

### Scripts
- `npm run dev`: Development mode with hot reload
- `npm run build`: Production build for both frontend and backend
- `npm start`: Production server startup
- `npm run db:push`: Database schema synchronization

The application is designed for easy deployment to platforms like Replit, Vercel, or traditional hosting providers with Node.js support.

## Recent Updates (January 28, 2025)

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