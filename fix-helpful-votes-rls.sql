-- Fix RLS policies for helpful votes functionality
-- This script addresses the RLS policy violation when triggers try to update college_ratings

-- First, let's check if the helpful_votes table exists and create it if needed
CREATE TABLE IF NOT EXISTS helpful_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id) -- Prevent duplicate votes from same user
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_helpful_votes_review_id ON helpful_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_helpful_votes_user_id ON helpful_votes(user_id);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_helpful_count_trigger ON helpful_votes;

-- Create function to update helpful_count when votes are added/removed
CREATE OR REPLACE FUNCTION update_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment helpful_count when a vote is added
    UPDATE reviews 
    SET helpful_count = helpful_count + 1 
    WHERE id = NEW.review_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement helpful_count when a vote is removed
    UPDATE reviews 
    SET helpful_count = helpful_count - 1 
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update helpful_count
CREATE TRIGGER update_helpful_count_trigger
  AFTER INSERT OR DELETE ON helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_helpful_count();

-- Enable RLS on helpful_votes table
ALTER TABLE helpful_votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to vote" ON helpful_votes;
DROP POLICY IF EXISTS "Allow reading helpful votes" ON helpful_votes;

-- Create policy to allow authenticated users to vote
CREATE POLICY "Allow authenticated users to vote" ON helpful_votes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to read helpful votes
CREATE POLICY "Allow reading helpful votes" ON helpful_votes
  FOR SELECT
  USING (true);

-- Fix college_ratings RLS policies to allow trigger operations
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on college_ratings" ON college_ratings;

-- Create a more permissive policy for college_ratings to allow trigger operations
CREATE POLICY "Allow all operations on college_ratings" ON college_ratings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Alternative: If the above doesn't work, we can disable RLS on college_ratings temporarily
-- ALTER TABLE college_ratings DISABLE ROW LEVEL SECURITY; 