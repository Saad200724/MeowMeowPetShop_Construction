# Meow Meow Pet Shop - Setup Guide

## Quick Setup for GitHub Imports

When importing this project from GitHub to Replit, follow these steps:

### 1. Automatic Setup
Most dependencies and database setup will be handled automatically by Replit.

### 2. Required Environment Variables

**Option A: Using Replit Secrets (Recommended)**
Add these secrets in Replit (Tools > Secrets):
- `VITE_SUPABASE_URL` = `https://ghqivevrwfkmdmduyjzv.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdocWl2ZXZyd2ZrbWRtZHV5anp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjAwODUsImV4cCI6MjA2OTAzNjA4NX0.FfQ8WT_ZKzAD5-mnAwrzX_F0JtHDjVdCxhB1y2M3aaY`

**Option B: Using .env file (Local development)**
If working locally, copy the values from `.env.example` to create a `.env` file.

**Note:** Database credentials are automatically provided by Replit when you provision a PostgreSQL database.

### 3. Get Supabase Credentials
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > API in your dashboard
4. Copy the "Project URL" → `VITE_SUPABASE_URL`
5. Copy the "anon public" key → `VITE_SUPABASE_ANON_KEY`

### 4. Initialize Database
Run this command to set up the database schema:
```bash
npm run db:push
```

### 5. Start Application
```bash
npm run dev
```

## Troubleshooting

**Error: "supabaseUrl is required"**
- Make sure you've added both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Replit secrets
- Restart the application after adding secrets

**Database connection issues**
- Replit automatically provisions PostgreSQL databases
- Check that `DATABASE_URL` is set in environment variables

**Import/Build errors**
- Run `npm install` to ensure all dependencies are installed
- Check that Node.js version is compatible (18+ recommended)

## Development Notes

- The project uses TypeScript throughout
- Frontend runs on Vite dev server
- Backend runs on Express
- Database uses Drizzle ORM with PostgreSQL
- Authentication handled by Supabase

## File Structure
```
├── client/src/          # React frontend
├── server/              # Express backend  
├── shared/schema.ts     # Database schema
├── attached_assets/     # Static assets
└── migrations/          # DB migration files
```