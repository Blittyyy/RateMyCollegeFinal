-- Clear test user to allow reusing the email
-- Run this in your Supabase SQL editor

-- Delete the test user
DELETE FROM users WHERE email = 'bryanblitman@gmail.com';

-- Also delete any verification tokens for this user
DELETE FROM verification_tokens WHERE user_id IN (
  SELECT id FROM users WHERE email = 'bryanblitman@gmail.com'
);

-- Verify the user is gone
SELECT COUNT(*) as remaining_users FROM users WHERE email = 'bryanblitman@gmail.com'; 