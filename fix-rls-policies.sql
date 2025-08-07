-- Fix RLS policies for college_ratings table
-- Run this in your Supabase SQL editor

-- Enable RLS on college_ratings table
ALTER TABLE college_ratings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations on college_ratings (since it's managed by triggers)
CREATE POLICY "Allow all operations on college_ratings" ON college_ratings
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Alternative: If you want to disable RLS entirely on college_ratings
-- ALTER TABLE college_ratings DISABLE ROW LEVEL SECURITY; 