# Meow Meow Pet Shop - E-commerce Application

A full-stack e-commerce application for pet products built with React, TypeScript, Express, and PostgreSQL.

## Features

- 🛍️ Complete e-commerce functionality
- 🐱 Pet product categories (Cat Food, Dog Food, Toys, Grooming, Health Care, Accessories)
- 🔐 User authentication with Supabase
- 📱 Responsive design with mobile-first approach
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 💾 PostgreSQL database with Drizzle ORM
- 🔍 Product search, filtering, and sorting
- ⭐ Product ratings and reviews
- 📊 Analytics dashboard

## Quick Start on Replit

1. **Fork/Import this repository** to your Replit account

2. **Set up Database**:
   - The PostgreSQL database will be automatically provisioned
   - Run `npm run db:push` to set up the database schema

3. **Configure Supabase Authentication**:
   
   **For this specific project, use these credentials:**
   - Add these secrets in Replit (Tools > Secrets):
     - `VITE_SUPABASE_URL`: `https://ghqivevrwfkmdmduyjzv.supabase.co`
     - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdocWl2ZXZyd2ZrbWRtZHV5anp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjAwODUsImV4cCI6MjA2OTAzNjA4NX0.FfQ8WT_ZKzAD5-mnAwrzX_F0JtHDjVdCxhB1y2M3aaY`
   
   **For your own projects:**
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project and get your own credentials

4. **Start the application**:
   ```bash
   npm run dev
   ```

The application will be available at the provided Replit URL.

## Development

### Project Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared types and schemas
├── attached_assets/ # Static assets and images
└── migrations/      # Database migration files
```

### Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Wouter for routing
- Tailwind CSS + shadcn/ui components
- TanStack Query for state management
- React Hook Form + Zod validation

**Backend:**
- Node.js + Express.js
- TypeScript with ES modules
- Drizzle ORM for database operations
- PostgreSQL database

**Authentication:**
- Supabase Auth for user management

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

- `DATABASE_URL` - PostgreSQL connection string (auto-provided on Replit)
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

## Deployment

This application is optimized for Replit deployment. For other platforms:

1. Build the application: `npm run build`
2. Set all required environment variables
3. Start with: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.