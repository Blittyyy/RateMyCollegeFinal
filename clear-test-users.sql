-- Clear test users from the database
-- This script will delete users with test-related emails and names

-- Delete users with test emails (various patterns)
DELETE FROM users 
WHERE email LIKE 'test%@%' 
   OR email LIKE '%@example.com'
   OR email LIKE 'test@harvard.edu'
   OR name LIKE 'Test User%'
   OR name LIKE 'Test Student%'
   OR name LIKE 'New Test User%';

-- Alternative: If you want to be more specific and only delete exact matches
-- DELETE FROM users WHERE email IN (
--   'test@harvard.edu',
--   'test@example.com',
--   'test2@example.com',
--   'test1@example.com',
--   'newtest@example.com',
--   'test3@example.com',
--   'test4@example.com',
--   'test5@example.com'
-- );

-- Verify the deletion (optional - run this to see remaining users)
-- SELECT id, uuid, email, name, verification_type, created_at 
-- FROM users 
-- ORDER BY created_at DESC; 