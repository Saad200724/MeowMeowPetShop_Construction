# Meow Meow Pet Shop

## Overview

Meow Meow Pet Shop is a full-stack e-commerce application for an online pet store serving cats and dogs in Savar, Bangladesh. The application provides a complete shopping experience including product browsing, cart management, checkout, order tracking, user authentication, and an admin dashboard for store management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
The project uses a monorepo structure with three main directories:
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript models and schemas

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system (yellow/green brand colors)
- **UI Components**: shadcn/ui library built on Radix UI primitives
- **State Management**: TanStack Query for server state, React Context for cart and auth
- **Build Tool**: Vite with hot module replacement

Key frontend patterns:
- Component-based architecture with reusable UI components in `client/src/components/`
- Custom hooks in `client/src/hooks/` for auth, cart, and data fetching
- Context providers in `client/src/contexts/` for global state (cart, sidebar, chat)
- Path aliases configured: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with routes defined in `server/routes.ts`
- **File Uploads**: Multer for handling image uploads with Sharp for WebP conversion
- **Authentication**: Session-based with bcrypt password hashing

The server integrates Vite in development mode for HMR and serves static files in production.

### Database
- **Primary Database**: MongoDB with Mongoose ODM
- **Connection**: Configured via `MONGODB_URI` environment variable
- **Models**: All schemas defined in `shared/models.ts` including User, Product, Category, Brand, Order, Cart, etc.

Note: The codebase contains legacy Drizzle/PostgreSQL files (`server/db.ts`, `shared/schema.ts`) but the active implementation uses MongoDB exclusively. These files can be ignored.

### Authentication
- **Primary**: Supabase authentication (configured via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)
- **Fallback**: Local MongoDB-based authentication when Supabase is unavailable
- **Admin Account**: Auto-created on startup (admin@gmail.com / meow123)

### Key Features
- Product catalog with categories, brands, search, and filtering
- Shopping cart with coupon support
- Order management and invoice generation
- Blog system for pet care content
- Admin dashboard for product/order management
- Image upload with automatic WebP conversion
- SEO-friendly product URLs with slug system

## External Dependencies

### Authentication & Database
- **Supabase**: User authentication and session management
- **MongoDB**: Primary data storage (requires `MONGODB_URI`)

### Email Services
- **Nodemailer**: OTP and transactional emails (optional, configured via EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD)
- **EmailJS**: Client-side email functionality

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitives
- **lucide-react**: Icon library
- **zod**: Schema validation

### Backend Libraries
- **multer**: File upload handling
- **sharp**: Image processing and WebP conversion
- **bcrypt**: Password hashing
- **mongoose**: MongoDB ODM

### Environment Variables Required
```
MONGODB_URI=mongodb_connection_string
VITE_SUPABASE_URL=supabase_project_url (optional)
VITE_SUPABASE_ANON_KEY=supabase_anon_key (optional)
```

### Development Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run check` - TypeScript type checking