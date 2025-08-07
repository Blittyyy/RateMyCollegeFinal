# Supabase Setup Guide

This guide will help you connect your RateMyCollege project to Supabase.

## Prerequisites

1. A Supabase account and project created at [supabase.com](https://supabase.com)
2. Your project URL and API keys from your Supabase dashboard

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with your actual Supabase credentials.

## Step 3: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL editor and run it

This will create:
- `colleges` table for college information
- `users` table for user profiles
- `reviews` table for college reviews
- `college_ratings` table for aggregated ratings
- Indexes for better performance
- Triggers for automatic rating updates
- Row Level Security (RLS) policies
- Sample college data

## Step 4: Verify the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Check that the Supabase client is working by visiting your app

## Step 5: Test the Connection

You can test the connection by checking the browser console for any Supabase-related errors.

## Database Schema Overview

### Tables

- **colleges**: Stores college information (name, location, description, ratings)
- **users**: Stores user profiles with verification status
- **reviews**: Stores individual reviews with ratings and comments
- **college_ratings**: Aggregated ratings by category for each college

### Key Features

- **Automatic Rating Updates**: Triggers automatically update college ratings when reviews are added/updated/deleted
- **Row Level Security**: Ensures users can only modify their own data
- **Verification System**: Supports student and alumni verification
- **Anonymous Reviews**: Users can post anonymous reviews
- **Category-based Ratings**: Separate ratings for different aspects (professors, dorms, food, etc.)

## Next Steps

Once the database is set up, you can:

1. Replace mock data in your components with real database queries
2. Implement user authentication
3. Add review submission functionality
4. Implement the verification system

## Troubleshooting

### Common Issues

1. **Environment variables not loading**: Make sure to restart your development server after adding `.env.local`
2. **Database connection errors**: Verify your Supabase URL and API key are correct
3. **RLS policy errors**: Check that the SQL schema was executed completely

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the database types in `lib/database.types.ts`
- Check the utility functions in `lib/database.ts` 