# Meow Meow Pet Shop - E-commerce Platform

## Overview

This is a full-stack e-commerce web application for a pet shop in Bangladesh. The application provides a complete online shopping experience for pet food, toys, and accessories with features like product browsing, categorization, shopping cart, reviews, and newsletter subscription.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library 
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API architecture
- **Session Management**: In-memory storage with session-based cart management

## Key Components

### Database Schema
The application uses PostgreSQL with the following main entities:
- **Categories**: Hierarchical product categories with slugs and images
- **Products**: Complete product information including pricing, inventory, and categorization
- **Reviews**: Customer reviews with ratings and verification status
- **Cart Items**: Session-based shopping cart functionality

### Frontend Components
- **Layout Components**: Header with navigation, Footer with company info
- **Product Display**: Featured categories, flash sales, best sellers
- **Shopping Features**: Cart management, product filtering
- **User Engagement**: Customer reviews, newsletter subscription
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Backend Services
- **Storage Layer**: Abstract storage interface with in-memory implementation
- **API Routes**: RESTful endpoints for products, categories, cart, and reviews
- **Data Management**: Centralized data initialization and management

## Data Flow

1. **Product Browsing**: Client fetches product data through React Query from Express API endpoints
2. **Cart Management**: Session-based cart operations stored in memory with automatic session ID generation
3. **Data Persistence**: PostgreSQL database accessed through Drizzle ORM
4. **State Synchronization**: TanStack Query handles caching and synchronization between client and server

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client for Neon Database
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **express**: Web application framework

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives for complex components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library for React
- **class-variance-authority**: Utility for managing component variants

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type safety and development experience
- **drizzle-kit**: Database migration and schema management tools

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server with HMR support
- **Database**: Local PostgreSQL or Neon Database connection
- **Environment**: NODE_ENV=development with development middleware

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild compiles TypeScript server code to `dist/index.js`
- **Static Assets**: Express serves built frontend assets in production
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared types and schemas between client and server
2. **Type Safety**: Comprehensive TypeScript usage with shared schema validation using Zod
3. **Modern React Patterns**: Hooks-based architecture with custom hooks for cart management
4. **Database-First Design**: Schema-driven development with Drizzle migrations
5. **Component Composition**: Radix UI primitives with custom styling for consistent design system
6. **Session Management**: Simple session-based cart without user authentication for streamlined shopping experience

The architecture prioritizes developer experience, type safety, and maintainability while providing a performant and accessible user interface for the pet shop's customers.