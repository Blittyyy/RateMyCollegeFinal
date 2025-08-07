-- Add LinkedIn verification fields to users table
-- Run this in your Supabase SQL editor

-- Add LinkedIn profile ID column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS linkedin_profile_id VARCHAR(255);

-- Add LinkedIn verification date column  
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS linkedin_verification_date TIMESTAMP WITH TIME ZONE;

-- Add index for LinkedIn profile ID (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_users_linkedin_profile_id ON users(linkedin_profile_id);

-- Add index for LinkedIn verification date (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_users_linkedin_verification_date ON users(linkedin_verification_date);

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('linkedin_profile_id', 'linkedin_verification_date'); 