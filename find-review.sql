-- Find the specific review to remove
-- Review content: "I love everything about USF. The dorms were great and had an amazing dining hall right at the bottom. Also, teachers were great and truly cared about the students. It's not a huge party school but it's right in the middle so it's not that bad."
-- Date: 8/6/2025
-- Rating: 5/5

SELECT 
    r.id,
    r.review,
    r.overall_rating,
    r.created_at,
    c.name as college_name,
    u.email as user_email
FROM reviews r
JOIN colleges c ON r.college_id = c.id
JOIN users u ON r.user_id = u.id
WHERE r.review ILIKE '%I love everything about USF%'
   OR r.review ILIKE '%dorms were great and had an amazing dining hall%'
   OR r.review ILIKE '%teachers were great and truly cared about the students%'
   OR r.review ILIKE '%not a huge party school but it%'
   OR (r.overall_rating = 5 AND r.created_at::date = '2025-08-06')
ORDER BY r.created_at DESC; 