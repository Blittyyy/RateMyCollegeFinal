-- Migration to add category_ratings column to reviews table
-- Run this in your Supabase SQL editor

-- Add category_ratings column to reviews table
ALTER TABLE reviews 
ADD COLUMN category_ratings JSONB DEFAULT '{}';

-- Create index for category_ratings for better performance
CREATE INDEX idx_reviews_category_ratings ON reviews USING GIN (category_ratings);

-- Update existing reviews to have empty category_ratings if null
UPDATE reviews 
SET category_ratings = '{}'::jsonb 
WHERE category_ratings IS NULL; 