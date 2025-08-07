-- Temporary fix: Disable the trigger that's causing the RLS error
-- Run this in your Supabase SQL editor

-- Disable the trigger temporarily
ALTER TABLE reviews DISABLE TRIGGER update_ratings_on_review_insert;

-- After running the RLS fix, you can re-enable it with:
-- ALTER TABLE reviews ENABLE TRIGGER update_ratings_on_review_insert; 