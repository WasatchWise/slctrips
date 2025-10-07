-- Clean Migration: destination_affiliate_gear
-- Run this to create the table from scratch

-- First, drop any orphaned indexes/functions
DROP INDEX IF EXISTS idx_destination_gear_destination_id CASCADE;
DROP INDEX IF EXISTS idx_destination_gear_active CASCADE;
DROP INDEX IF EXISTS idx_destination_gear_display_order CASCADE;
DROP INDEX IF EXISTS idx_destination_gear_category CASCADE;
DROP INDEX IF EXISTS idx_destination_gear_product_name_gin CASCADE;
DROP FUNCTION IF EXISTS update_destination_affiliate_gear_updated_at() CASCADE;

-- Create the table
CREATE TABLE destination_affiliate_gear (
  id SERIAL PRIMARY KEY,

  -- Foreign Keys (UUID to match destinations table)
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,

  -- Product Information
  product_name TEXT NOT NULL,
  product_description TEXT,
  category TEXT,

  -- Links and Integration
  affiliate_link TEXT NOT NULL,
  image_url TEXT,

  -- Pricing
  price DECIMAL(10,2),
  price_range TEXT,

  -- Stripe Integration (optional)
  stripe_product_id TEXT,
  stripe_price_id TEXT,

  -- Display Control
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,

  -- Metadata
  tags TEXT[],
  brand TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_destination_gear_destination_id
  ON destination_affiliate_gear(destination_id);

CREATE INDEX idx_destination_gear_active
  ON destination_affiliate_gear(destination_id, active)
  WHERE active = true;

CREATE INDEX idx_destination_gear_display_order
  ON destination_affiliate_gear(destination_id, display_order, active)
  WHERE active = true;

CREATE INDEX idx_destination_gear_category
  ON destination_affiliate_gear(category);

CREATE INDEX idx_destination_gear_product_name_gin
  ON destination_affiliate_gear
  USING gin(to_tsvector('english', product_name));

-- Enable RLS
ALTER TABLE destination_affiliate_gear ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read access for affiliate gear"
  ON destination_affiliate_gear
  FOR SELECT
  USING (active = true);

CREATE POLICY "Authenticated users can manage affiliate gear"
  ON destination_affiliate_gear
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create Trigger Function
CREATE OR REPLACE FUNCTION update_destination_affiliate_gear_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger
CREATE TRIGGER trigger_update_destination_affiliate_gear_updated_at
  BEFORE UPDATE ON destination_affiliate_gear
  FOR EACH ROW
  EXECUTE FUNCTION update_destination_affiliate_gear_updated_at();

-- Add Comments
COMMENT ON TABLE destination_affiliate_gear IS
  'Affiliate product recommendations for destination pages. Supports Amazon Associates, Stripe, and other affiliate programs.';

-- Verify creation
SELECT
  'Table created' as status,
  COUNT(*) as row_count
FROM destination_affiliate_gear;

SELECT
  'Indexes created' as status,
  COUNT(*) as index_count
FROM pg_indexes
WHERE tablename = 'destination_affiliate_gear';

SELECT
  'Trigger created' as status,
  COUNT(*) as trigger_count
FROM information_schema.triggers
WHERE event_object_table = 'destination_affiliate_gear';
