-- Fix users table - add missing columns
-- Run this in your Supabase SQL editor

-- Add college_id column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS college_id UUID REFERENCES colleges(id);

-- Add LinkedIn verification fields if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS linkedin_profile_id VARCHAR(255);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS linkedin_verification_date TIMESTAMP WITH TIME ZONE;

-- Add verification_type column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_type VARCHAR(20) CHECK (verification_type IN ('student', 'alumni'));

-- Add email_verified column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_college_id ON users(college_id);
CREATE INDEX IF NOT EXISTS idx_users_linkedin_profile_id ON users(linkedin_profile_id);
CREATE INDEX IF NOT EXISTS idx_users_linkedin_verification_date ON users(linkedin_verification_date);
CREATE INDEX IF NOT EXISTS idx_users_verification_type ON users(verification_type);

-- Verify all columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position; 