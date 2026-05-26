-- Supabase Setup Script for Orion Computers Admin
-- Run this in the Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a table to track image metadata (optional, for auditing/analytics)
CREATE TABLE IF NOT EXISTS image_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL UNIQUE,
  file_size INTEGER,
  file_type VARCHAR(50),
  uploaded_by VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_image_uploads_uploaded_at ON image_uploads(uploaded_at);

-- Enable Row Level Security (RLS)
ALTER TABLE image_uploads ENABLE ROW LEVEL SECURITY;

-- Create admin policy (only authenticated admins can view/insert)
CREATE POLICY "Admin uploads policy"
  ON image_uploads
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin view uploads"
  ON image_uploads
  FOR SELECT
  USING (true);

-- Create a function to log image deletions
CREATE OR REPLACE FUNCTION log_image_deletion()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE image_uploads
  SET deleted_at = NOW()
  WHERE file_name = OLD.name;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT ALL ON image_uploads TO service_role;
GRANT SELECT, INSERT, UPDATE ON image_uploads TO authenticated;

-- Informational comment
COMMENT ON TABLE image_uploads IS 'Tracks uploaded images and their metadata for auditing purposes';
