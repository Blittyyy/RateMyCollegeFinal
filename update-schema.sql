-- Add image columns to existing colleges table
ALTER TABLE colleges 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS image_source VARCHAR(50);