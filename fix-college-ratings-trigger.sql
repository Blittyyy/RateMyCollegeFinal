-- Fix college ratings trigger to work with new schema
-- This updates the trigger to use overall_rating and tags instead of category/rating

-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_ratings_on_review_insert ON reviews;
DROP TRIGGER IF EXISTS update_ratings_on_review_update ON reviews;
DROP TRIGGER IF EXISTS update_ratings_on_review_delete ON reviews;

-- Drop the old function
DROP FUNCTION IF EXISTS update_college_ratings();

-- Create new function that works with the updated schema
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

-- Create new triggers
CREATE TRIGGER update_ratings_on_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_college_ratings();

CREATE TRIGGER update_ratings_on_review_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_college_ratings();

CREATE TRIGGER update_ratings_on_review_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_college_ratings();

-- Also update existing data to recalculate all ratings
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