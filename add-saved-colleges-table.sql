-- Create saved_colleges table for user bookmarks
CREATE TABLE saved_colleges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, college_id)
);

-- Create indexes for better performance
CREATE INDEX idx_saved_colleges_user_id ON saved_colleges(user_id);
CREATE INDEX idx_saved_colleges_college_id ON saved_colleges(college_id);
CREATE INDEX idx_saved_colleges_created_at ON saved_colleges(created_at);

-- Add RLS policies for saved_colleges
ALTER TABLE saved_colleges ENABLE ROW LEVEL SECURITY;

-- Users can only see their own saved colleges
CREATE POLICY "Users can view their own saved colleges" ON saved_colleges
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own saved colleges
CREATE POLICY "Users can save colleges" ON saved_colleges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved colleges
CREATE POLICY "Users can unsave colleges" ON saved_colleges
  FOR DELETE USING (auth.uid() = user_id); 