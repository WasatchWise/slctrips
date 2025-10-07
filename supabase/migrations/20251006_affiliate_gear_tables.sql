-- Migration: Add Affiliate Gear Support for Destinations
-- Date: 2025-10-06
-- Purpose: Enable destination pages to display affiliate product recommendations
-- Related: PROD-001 Phase 2 - Affiliate Gear Module

-- ============================================================================
-- TABLE: destination_affiliate_gear
-- ============================================================================
-- Stores affiliate product recommendations tied to specific destinations
-- Supports Amazon Associates, Stripe products, and other affiliate programs

CREATE TABLE IF NOT EXISTS destination_affiliate_gear (
  id SERIAL PRIMARY KEY,

  -- Foreign Keys
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,

  -- Product Information
  product_name TEXT NOT NULL,
  product_description TEXT,
  category TEXT, -- e.g., "Footwear", "Gear", "Apparel", "Guides", "Electronics"

  -- Links and Integration
  affiliate_link TEXT NOT NULL, -- Amazon Associates, REI, etc.
  image_url TEXT,

  -- Pricing
  price DECIMAL(10,2), -- Display price (may be approximate for affiliate links)
  price_range TEXT, -- e.g., "$50-$100" for variable pricing

  -- Stripe Integration (optional - for direct purchases)
  stripe_product_id TEXT,
  stripe_price_id TEXT,

  -- Display Control
  display_order INTEGER DEFAULT 0, -- Lower = shows first
  active BOOLEAN DEFAULT true, -- Allow hiding without deleting
  featured BOOLEAN DEFAULT false, -- Highlight specific products

  -- Metadata
  tags TEXT[], -- e.g., ["beginner-friendly", "premium", "bestseller"]
  brand TEXT, -- Product brand/manufacturer

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Primary lookup: Get all gear for a destination
CREATE INDEX idx_destination_gear_destination_id
  ON destination_affiliate_gear(destination_id);

-- Filter by active products
CREATE INDEX idx_destination_gear_active
  ON destination_affiliate_gear(destination_id, active)
  WHERE active = true;

-- Sort by display order
CREATE INDEX idx_destination_gear_display_order
  ON destination_affiliate_gear(destination_id, display_order, active)
  WHERE active = true;

-- Category filtering
CREATE INDEX idx_destination_gear_category
  ON destination_affiliate_gear(category);

-- Full-text search on product names (if needed)
CREATE INDEX idx_destination_gear_product_name_gin
  ON destination_affiliate_gear
  USING gin(to_tsvector('english', product_name));

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE destination_affiliate_gear ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access (anyone can view affiliate products)
CREATE POLICY "Public read access for affiliate gear"
  ON destination_affiliate_gear
  FOR SELECT
  USING (active = true);

-- Policy: Authenticated users can insert/update (for admins/content managers)
-- Note: Adjust this based on your auth setup
CREATE POLICY "Authenticated users can manage affiliate gear"
  ON destination_affiliate_gear
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_destination_affiliate_gear_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_destination_affiliate_gear_updated_at
  BEFORE UPDATE ON destination_affiliate_gear
  FOR EACH ROW
  EXECUTE FUNCTION update_destination_affiliate_gear_updated_at();

-- ============================================================================
-- SAMPLE DATA (for testing - remove in production)
-- ============================================================================

-- Insert sample gear for destination ID 1 (adjust based on your destinations)
-- Uncomment to seed initial data:

/*
INSERT INTO destination_affiliate_gear (
  destination_id,
  product_name,
  product_description,
  category,
  affiliate_link,
  image_url,
  price,
  display_order,
  active,
  featured,
  tags
) VALUES
(
  '00000000-0000-0000-0000-000000000000', -- Replace with actual destination UUID
  'Salomon Trail Running Shoes',
  'Lightweight, grippy trail shoes perfect for Utah\'s rocky terrain',
  'Footwear',
  'https://amzn.to/3xyz123',
  'https://images.example.com/salomon-shoes.jpg',
  129.99,
  1,
  true,
  true,
  ARRAY['bestseller', 'beginner-friendly']
),
(
  '00000000-0000-0000-0000-000000000000',
  'CamelBak Hydration Pack',
  '2L water reservoir with storage for snacks and essentials',
  'Gear',
  'https://amzn.to/3abc456',
  'https://images.example.com/camelbak.jpg',
  79.99,
  2,
  true,
  false,
  ARRAY['essential', 'summer']
),
(
  '00000000-0000-0000-0000-000000000000',
  'Utah Trail Maps Bundle',
  'Detailed topographic maps of Utah\'s best trails',
  'Guides',
  'https://amzn.to/3def789',
  'https://images.example.com/maps.jpg',
  24.99,
  3,
  true,
  false,
  ARRAY['beginner-friendly']
);
*/

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE destination_affiliate_gear IS
  'Affiliate product recommendations for destination pages. Supports Amazon Associates, Stripe, and other affiliate programs.';

COMMENT ON COLUMN destination_affiliate_gear.destination_id IS
  'Foreign key to destinations table. Products are shown on the destination detail page.';

COMMENT ON COLUMN destination_affiliate_gear.affiliate_link IS
  'Full affiliate URL (e.g., Amazon Associates link with tracking tag)';

COMMENT ON COLUMN destination_affiliate_gear.stripe_product_id IS
  'Optional: Stripe Product ID for direct purchases (alternative to affiliate links)';

COMMENT ON COLUMN destination_affiliate_gear.display_order IS
  'Controls sort order on destination page. Lower numbers appear first.';

COMMENT ON COLUMN destination_affiliate_gear.active IS
  'Soft delete flag. Set to false to hide product without deleting data.';

COMMENT ON COLUMN destination_affiliate_gear.featured IS
  'Highlight this product (e.g., show badge, larger card, etc.)';

-- ============================================================================
-- MIGRATION ROLLBACK
-- ============================================================================

-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS trigger_update_destination_affiliate_gear_updated_at ON destination_affiliate_gear;
-- DROP FUNCTION IF EXISTS update_destination_affiliate_gear_updated_at();
-- DROP TABLE IF EXISTS destination_affiliate_gear CASCADE;
