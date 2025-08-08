-- Remove the specific USF review
-- Review ID: 030dac19-0a32-459e-819e-303052678bc1

-- Remove by review ID
DELETE FROM reviews
WHERE id = '030dac19-0a32-459e-819e-303052678bc1';

-- Option 2: Remove by specific content (if you know the exact text)
-- DELETE FROM reviews
-- WHERE review ILIKE '%I love everything about USF. The dorms were great and had an amazing dining hall right at the bottom. Also, teachers were great and truly cared about the students. It%';

-- Option 3: Remove by date and rating (if multiple matches, be careful)
-- DELETE FROM reviews
-- WHERE overall_rating = 5 
--   AND created_at::date = '2025-08-06'
--   AND review ILIKE '%USF%';

-- Verify the review was removed
SELECT COUNT(*) as remaining_reviews 
FROM reviews 
WHERE id = '030dac19-0a32-459e-819e-303052678bc1'; 