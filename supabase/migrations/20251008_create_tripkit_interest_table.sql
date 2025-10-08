-- Create table to track user interest in upcoming TripKits
-- This helps validate demand before building new kits

CREATE TABLE IF NOT EXISTS tripkit_interest (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  tripkit_slug VARCHAR(100) NOT NULL,
  tripkit_name VARCHAR(255) NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate signups for same email + kit
  UNIQUE(email, tripkit_slug)
);

-- Add indexes for common queries
CREATE INDEX idx_tripkit_interest_slug ON tripkit_interest(tripkit_slug);
CREATE INDEX idx_tripkit_interest_email ON tripkit_interest(email);
CREATE INDEX idx_tripkit_interest_created ON tripkit_interest(created_at DESC);

-- Enable RLS
ALTER TABLE tripkit_interest ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (signup for interest)
CREATE POLICY "Anyone can express interest"
  ON tripkit_interest
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users can view (for admin dashboard)
CREATE POLICY "Authenticated users can view interest"
  ON tripkit_interest
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create view for aggregated interest counts
CREATE OR REPLACE VIEW tripkit_interest_summary AS
SELECT
  tripkit_slug,
  tripkit_name,
  COUNT(DISTINCT email) as interest_count,
  MAX(created_at) as last_signup,
  MIN(created_at) as first_signup
FROM tripkit_interest
GROUP BY tripkit_slug, tripkit_name
ORDER BY interest_count DESC;

-- Grant access to view
GRANT SELECT ON tripkit_interest_summary TO anon, authenticated;

COMMENT ON TABLE tripkit_interest IS 'Tracks user interest in upcoming TripKits to validate demand before building';
COMMENT ON COLUMN tripkit_interest.email IS 'User email for waitlist notification';
COMMENT ON COLUMN tripkit_interest.tripkit_slug IS 'Slug of the TripKit they''re interested in';
COMMENT ON COLUMN tripkit_interest.user_agent IS 'Browser user agent for analytics';
COMMENT ON COLUMN tripkit_interest.referrer IS 'Source page where they expressed interest';
