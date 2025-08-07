-- Quick fix for helpful votes RLS issue
-- This disables RLS on college_ratings to allow triggers to work

-- Disable RLS on college_ratings table
ALTER TABLE college_ratings DISABLE ROW LEVEL SECURITY;

-- This should resolve the 403 error when helpful votes try to update college_ratings
-- The trigger needs to update college_ratings but RLS was blocking it 