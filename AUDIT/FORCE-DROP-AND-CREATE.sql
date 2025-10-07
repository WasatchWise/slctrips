-- Force Clean: Drop everything related to destination_affiliate_gear
-- This will resolve the "already exists" error

-- Drop table (CASCADE removes all dependent objects)
DROP TABLE IF EXISTS destination_affiliate_gear CASCADE;

-- Drop function if exists
DROP FUNCTION IF EXISTS update_destination_affiliate_gear_updated_at() CASCADE;

-- Drop any orphaned indexes explicitly
DROP INDEX IF EXISTS idx_destination_gear_destination_id CASCADE;
DROP INDEX IF EXISTS idx_destination_gear_active CASCADE;
DROP INDEX IF EXISTS idx_destination_gear_display_order CASCADE;
DROP INDEX IF EXISTS idx_destination_gear_category CASCADE;
DROP INDEX IF EXISTS idx_destination_gear_product_name_gin CASCADE;

-- Wait a moment, then create fresh
-- (Sometimes Postgres needs a beat to clean up)

-- NOW CREATE FRESH
CREATE TABLE destination_affiliate_gear (
  id SERIAL PRIMARY KEY,
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,

  product_name TEXT NOT NULL,
  product_description TEXT,
  category TEXT,

  affiliate_link TEXT NOT NULL,
  image_url TEXT,

  price DECIMAL(10,2),
  price_range TEXT,

  stripe_product_id TEXT,
  stripe_price_id TEXT,

  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,

  tags TEXT[],
  brand TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_destination_gear_destination_id ON destination_affiliate_gear(destination_id);
CREATE INDEX idx_destination_gear_active ON destination_affiliate_gear(destination_id, active) WHERE active = true;
CREATE INDEX idx_destination_gear_display_order ON destination_affiliate_gear(destination_id, display_order, active) WHERE active = true;
CREATE INDEX idx_destination_gear_category ON destination_affiliate_gear(category);
CREATE INDEX idx_destination_gear_product_name_gin ON destination_affiliate_gear USING gin(to_tsvector('english', product_name));

-- Enable RLS
ALTER TABLE destination_affiliate_gear ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for affiliate gear"
  ON destination_affiliate_gear FOR SELECT USING (active = true);

CREATE POLICY "Authenticated users can manage affiliate gear"
  ON destination_affiliate_gear FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger function
CREATE OR REPLACE FUNCTION update_destination_affiliate_gear_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_destination_affiliate_gear_updated_at
  BEFORE UPDATE ON destination_affiliate_gear
  FOR EACH ROW
  EXECUTE FUNCTION update_destination_affiliate_gear_updated_at();

-- Verify everything
SELECT 'SUCCESS: Table created' as status;
SELECT COUNT(*) as index_count FROM pg_indexes WHERE tablename = 'destination_affiliate_gear';
SELECT COUNT(*) as policy_count FROM pg_policies WHERE tablename = 'destination_affiliate_gear';
SELECT COUNT(*) as trigger_count FROM information_schema.triggers WHERE event_object_table = 'destination_affiliate_gear';
