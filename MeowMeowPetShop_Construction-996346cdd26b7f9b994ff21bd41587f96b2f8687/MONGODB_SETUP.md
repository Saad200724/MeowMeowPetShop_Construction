# MongoDB Configuration

This project uses MongoDB exclusively. For GitHub imports:

## Required Environment Variables

Create a `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string_here
```

## Supabase Configuration (Optional)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Database Models

All database schemas are defined in `shared/models.ts` using Mongoose ODM.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm start` - Start production server
- `npm run check:env` - Check environment variables

## Note

This project does NOT use PostgreSQL or Drizzle ORM. It uses MongoDB with Mongoose exclusively.