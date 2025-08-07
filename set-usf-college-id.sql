-- Set college_id for user to University of South Florida
-- This script will update both email variations for Bryan Blitman

-- First, let's find your user records
SELECT id, email, name, verification_type, college_id 
FROM users 
WHERE email IN ('bryanblitman@gmail.com', 'Bryanblitman@gmail.com');

-- Then, let's find University of South Florida in the colleges table
SELECT id, name, slug, location 
FROM colleges 
WHERE name ILIKE '%University of South Florida%' 
   OR name ILIKE '%USF%';

-- Update your user records to set college_id to University of South Florida
UPDATE users 
SET college_id = (
  SELECT id 
  FROM colleges 
  WHERE name ILIKE '%University of South Florida%' 
  LIMIT 1
)
WHERE email IN ('bryanblitman@gmail.com', 'Bryanblitman@gmail.com');

-- Verify the update
SELECT u.id, u.email, u.name, u.verification_type, u.college_id, c.name as college_name
FROM users u
LEFT JOIN colleges c ON u.college_id = c.id
WHERE u.email IN ('bryanblitman@gmail.com', 'Bryanblitman@gmail.com'); 