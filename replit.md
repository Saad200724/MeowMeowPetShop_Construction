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