-- Add category_ratings field to reviews table
-- This allows storing individual ratings for each category (dorms, food, professors, etc.)

-- Add the category_ratings column as JSONB to store ratings for each category
ALTER TABLE reviews 
ADD COLUMN category_ratings JSONB DEFAULT '{}';

-- Create an index for better performance when querying category ratings
CREATE INDEX idx_reviews_category_ratings ON reviews USING GIN (category_ratings);

-- Update the trigger function to handle category ratings
CREATE OR REPLACE FUNCTION update_college_ratings()
RETURNS TRIGGER AS $$
BEGIN
  -- Update college_ratings table based on tags and category_ratings
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
  
  -- Also update college_ratings based on category_ratings for more granular data
  -- This will create separate entries for each category that was rated
  INSERT INTO college_ratings (college_id, category, average_rating, review_count)
  SELECT 
    college_id,
    key as category,
    AVG((value::text)::DECIMAL(3,2)) as average_rating,
    COUNT(*) as review_count
  FROM reviews,
       jsonb_each(category_ratings) as ratings(key, value)
  WHERE college_id = COALESCE(NEW.college_id, OLD.college_id)
    AND category_ratings IS NOT NULL
    AND category_ratings != '{}'
  GROUP BY college_id, key
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

-- Update existing data to recalculate all ratings
UPDATE colleges 
SET 
  overall_rating = (
    SELECT AVG(overall_rating)::DECIMAL(3,2)
    FROM reviews
    WHERE college_id = colleges.id
  ),
  total_reviews = (
    SELECT COUNT(*)
    FROM reviews
    WHERE college_id = colleges.id
  ),
  updated_at = NOW()
WHERE id IN (SELECT DISTINCT college_id FROM reviews);

-- Clear and repopulate college_ratings table
DELETE FROM college_ratings;

-- Insert based on tags
INSERT INTO college_ratings (college_id, category, average_rating, review_count)
SELECT 
  college_id,
  unnest(tags) as category,
  AVG(overall_rating)::DECIMAL(3,2),
  COUNT(*)
FROM reviews
WHERE tags IS NOT NULL
  AND array_length(tags, 1) > 0
GROUP BY college_id, unnest(tags);

-- Insert based on category_ratings (for future reviews)
INSERT INTO college_ratings (college_id, category, average_rating, review_count)
SELECT 
  college_id,
  key as category,
  AVG((value::text)::DECIMAL(3,2)) as average_rating,
  COUNT(*) as review_count
FROM reviews,
     jsonb_each(category_ratings) as ratings(key, value)
WHERE category_ratings IS NOT NULL
  AND category_ratings != '{}'
GROUP BY college_id, key
ON CONFLICT (college_id, category)
DO UPDATE SET
  average_rating = EXCLUDED.average_rating,
  review_count = EXCLUDED.review_count,
  updated_at = NOW(); 