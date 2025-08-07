-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create colleges table
CREATE TABLE colleges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  overall_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  image_source VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_type VARCHAR(20) CHECK (verification_type IN ('student', 'alumni')) DEFAULT NULL,
  college_id UUID REFERENCES colleges(id),
  linkedin_profile_id VARCHAR(255), -- LinkedIn profile ID for alumni verification
  linkedin_verification_date TIMESTAMP WITH TIME ZONE, -- When LinkedIn verification was completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_tokens table for email verification
CREATE TABLE verification_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('email_verification', 'password_reset')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  anonymous BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create college_ratings table for aggregated ratings by category
CREATE TABLE college_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  average_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(college_id, category)
);

-- Create indexes for better performance
CREATE INDEX idx_colleges_slug ON colleges(slug);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_email_verified ON users(email_verified);
CREATE INDEX idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX idx_verification_tokens_user_id ON verification_tokens(user_id);
CREATE INDEX idx_verification_tokens_expires ON verification_tokens(expires_at);
CREATE INDEX idx_reviews_college_id ON reviews(college_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_college_ratings_college_id ON college_ratings(college_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_college_ratings_updated_at BEFORE UPDATE ON college_ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update college ratings when a review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_college_ratings()
RETURNS TRIGGER AS $$
BEGIN
  -- Update college_ratings table
  INSERT INTO college_ratings (college_id, category, average_rating, review_count)
  SELECT 
    college_id,
    category,
    AVG(rating)::DECIMAL(3,2),
    COUNT(*)
  FROM reviews
  WHERE college_id = COALESCE(NEW.college_id, OLD.college_id)
  GROUP BY college_id, category
  ON CONFLICT (college_id, category)
  DO UPDATE SET
    average_rating = EXCLUDED.average_rating,
    review_count = EXCLUDED.review_count,
    updated_at = NOW();
  
  -- Update overall college rating and total reviews
  UPDATE colleges
  SET 
    overall_rating = (
      SELECT AVG(average_rating)::DECIMAL(3,2)
      FROM college_ratings
      WHERE college_id = COALESCE(NEW.college_id, OLD.college_id)
    ),
    total_reviews = (
      SELECT SUM(review_count)
      FROM college_ratings
      WHERE college_id = COALESCE(NEW.college_id, OLD.college_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.college_id, OLD.college_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create triggers for review changes
CREATE TRIGGER update_ratings_on_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_college_ratings();

CREATE TRIGGER update_ratings_on_review_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_college_ratings();

CREATE TRIGGER update_ratings_on_review_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_college_ratings();

-- Insert some sample data
INSERT INTO colleges (name, slug, location, description) VALUES
('Harvard University', 'harvard-university', 'Cambridge, Massachusetts', 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Founded in 1636, it is the oldest institution of higher education in the United States.'),
('Stanford University', 'stanford-university', 'Stanford, California', 'Stanford University is a private research university in Stanford, California. Known for its academic achievements, wealth, and close proximity to Silicon Valley.'),
('MIT', 'mit', 'Cambridge, Massachusetts', 'The Massachusetts Institute of Technology is a private land-grant research university in Cambridge, Massachusetts. Known for its research and education in physical sciences and engineering.'),
('Yale University', 'yale-university', 'New Haven, Connecticut', 'Yale University is a private Ivy League research university in New Haven, Connecticut. Founded in 1701, it is the third-oldest institution of higher education in the United States.'),
('Princeton University', 'princeton-university', 'Princeton, New Jersey', 'Princeton University is a private Ivy League research university in Princeton, New Jersey. Founded in 1746, it is one of the oldest and most prestigious universities in the United States.');

-- Enable Row Level Security (RLS)
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to colleges" ON colleges FOR SELECT USING (true);
CREATE POLICY "Allow public read access to college_ratings" ON college_ratings FOR SELECT USING (true);
CREATE POLICY "Allow public read access to reviews" ON reviews FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to create users" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);
CREATE POLICY "Allow users to update their own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Allow users to read their own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);

-- Create policies for verification tokens
CREATE POLICY "Allow users to create verification tokens" ON verification_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to read their own verification tokens" ON verification_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own verification tokens" ON verification_tokens FOR UPDATE USING (auth.uid() = user_id); 