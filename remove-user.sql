-- Remove specific user from the database
-- User: Bryan Blitman (Bryanblitman1@gmail.com)
-- ID: 932cfd65-d593-4ec4-9806-3159aa7ed0c1

DELETE FROM users
WHERE id = '932cfd65-d593-4ec4-9806-3159aa7ed0c1';

-- Alternative: Remove by email (if you prefer)
-- DELETE FROM users
-- WHERE email = 'Bryanblitman1@gmail.com';

-- Verify the user was removed
SELECT COUNT(*) as remaining_users 
FROM users 
WHERE id = '932cfd65-d593-4ec4-9806-3159aa7ed0c1'; 