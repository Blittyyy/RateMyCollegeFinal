-- Migration to update reviews table for overall experience rating system
-- Run this in your Supabase SQL editor

-- Add new columns to reviews table
ALTER TABLE reviews 
ADD COLUMN overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Update existing reviews to have overall_rating = rating (migrate existing data)
UPDATE reviews 
SET overall_rating = rating 
WHERE overall_rating IS NULL;

-- Make overall_rating NOT NULL after migration
ALTER TABLE reviews 
ALTER COLUMN overall_rating SET NOT NULL;

-- Make category optional (since we're moving to tags)
ALTER TABLE reviews 
ALTER COLUMN category DROP NOT NULL;

-- Create index for tags for better performance
CREATE INDEX idx_reviews_tags ON reviews USING GIN (tags);

-- Update the college_ratings function to work with overall ratings
CREATE OR REPLACE FUNCTION update_college_ratings()
RETURNS TRIGGER AS $$
BEGIN
  -- Update college_ratings table based on tags
  INSERT INTO college_ratings (college_id, category, average_rating, review_count)
  SELECT 
    college_id,
    unnest(tags) as category,
    AVG(overall_rating)::DECIMAL(3,2),
    COUNT(*)
  FROM reviews
  WHERE college_id = COALESCE(NEW.college_id, OLD.college_id)
    AND tags IS NOT NULL
    AND array_length(tags, 1) > 0
  GROUP BY college_id, unnest(tags)
  ON CONFLICT (college_id, category)
  DO UPDATE SET
    average_rating = EXCLUDED.average_rating,
    review_count = EXCLUDED.review_count,
    updated_at = NOW();
  
  -- Update overall college rating and total reviews
  UPDATE colleges
  SET 
    overall_rating = (
      SELECT AVG(overall_rating)::DECIMAL(3,2)
      FROM reviews
      WHERE college_id = COALESCE(NEW.college_id, OLD.college_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE college_id = COALESCE(NEW.college_id, OLD.college_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.college_id, OLD.college_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql'; 