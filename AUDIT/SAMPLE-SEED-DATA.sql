-- Sample Seed Data for destination_affiliate_gear
-- Replace UUIDs with actual destination IDs from your database

-- First, get some destination UUIDs to use:
-- SELECT id, name FROM destinations LIMIT 10;

-- ==============================================================================
-- EXAMPLE 1: Arches National Park (Hiking Gear)
-- ==============================================================================

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
  brand,
  tags
) VALUES
(
  'REPLACE-WITH-ARCHES-UUID',
  'Salomon X Ultra 4 Hiking Boots',
  'Lightweight, grippy trail boots perfect for Utah''s rocky terrain and desert hiking',
  'Footwear',
  'https://amzn.to/salomonhiking',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  159.99,
  1,
  true,
  true,
  'Salomon',
  ARRAY['bestseller', 'beginner-friendly', 'hiking']
),
(
  'REPLACE-WITH-ARCHES-UUID',
  'CamelBak Hydration Pack 3L',
  '3-liter water reservoir with storage for snacks and essentials. Critical for desert hiking.',
  'Gear',
  'https://amzn.to/camelbakpack',
  'https://images.unsplash.com/photo-1622260614927-189e98b96c34?w=400&h=300&fit=crop',
  89.99,
  2,
  true,
  false,
  'CamelBak',
  ARRAY['essential', 'summer', 'hydration']
),
(
  'REPLACE-WITH-ARCHES-UUID',
  'Wide Brim Sun Hat',
  'UPF 50+ protection for desert sun. Moisture-wicking and lightweight.',
  'Apparel',
  'https://amzn.to/sunhat',
  'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=300&fit=crop',
  24.99,
  3,
  true,
  false,
  'Columbia',
  ARRAY['sun-protection', 'summer']
),
(
  'REPLACE-WITH-ARCHES-UUID',
  'National Geographic Utah Trail Maps',
  'Detailed topographic maps of Arches, Zion, and surrounding trails',
  'Guides',
  'https://amzn.to/utahmaps',
  'https://images.unsplash.com/photo-1569877986568-7fda13c2cba7?w=400&h=300&fit=crop',
  19.99,
  4,
  true,
  false,
  'National Geographic',
  ARRAY['navigation', 'beginner-friendly']
);

-- ==============================================================================
-- EXAMPLE 2: Park City Ski Resort (Winter Gear)
-- ==============================================================================

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
  brand,
  tags
) VALUES
(
  'REPLACE-WITH-PARKCITY-UUID',
  'Smith I/O Mag Snow Goggles',
  'Interchangeable lens system with ChromaPop technology for variable conditions',
  'Gear',
  'https://amzn.to/smithgoggles',
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
  279.99,
  1,
  true,
  true,
  'Smith',
  ARRAY['premium', 'skiing', 'bestseller']
),
(
  'REPLACE-WITH-PARKCITY-UUID',
  'Black Diamond Heated Gloves',
  'Battery-powered heated gloves for cold powder days',
  'Apparel',
  'https://amzn.to/heatedgloves',
  'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=300&fit=crop',
  199.99,
  2,
  true,
  false,
  'Black Diamond',
  ARRAY['winter', 'premium']
),
(
  'REPLACE-WITH-PARKCITY-UUID',
  'GoPro HERO12 Action Camera',
  'Capture your ski runs in 5.3K video. Includes mounting accessories.',
  'Electronics',
  'https://amzn.to/gopro12',
  'https://images.unsplash.com/photo-1527430253228-e93688616381?w=400&h=300&fit=crop',
  399.99,
  3,
  true,
  true,
  'GoPro',
  ARRAY['photography', 'premium']
),
(
  'REPLACE-WITH-PARKCITY-UUID',
  'Burton Base Layer Set',
  'Merino wool base layers for moisture-wicking warmth',
  'Apparel',
  'https://amzn.to/burtonbaselayer',
  'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400&h=300&fit=crop',
  119.99,
  4,
  true,
  false,
  'Burton',
  ARRAY['winter', 'essential']
);

-- ==============================================================================
-- EXAMPLE 3: Great Salt Lake (Wildlife/Photography)
-- ==============================================================================

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
  brand,
  tags
) VALUES
(
  'REPLACE-WITH-GREATSALTLAKE-UUID',
  'Nikon Monarch 7 Binoculars 10x42',
  'Premium birding binoculars with ED glass for stunning wildlife viewing',
  'Electronics',
  'https://amzn.to/nikonbinoculars',
  'https://images.unsplash.com/photo-1591089631377-08e5e2f0f39f?w=400&h=300&fit=crop',
  449.99,
  1,
  true,
  true,
  'Nikon',
  ARRAY['wildlife', 'premium', 'bestseller']
),
(
  'REPLACE-WITH-GREATSALTLAKE-UUID',
  'Keen Waterproof Hiking Sandals',
  'Perfect for wading in salt flats and shoreline exploration',
  'Footwear',
  'https://amzn.to/keensandals',
  'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=300&fit=crop',
  74.99,
  2,
  true,
  false,
  'Keen',
  ARRAY['water', 'summer']
),
(
  'REPLACE-WITH-GREATSALTLAKE-UUID',
  'Canon EOS R7 Wildlife Camera Kit',
  'Mirrorless camera with fast autofocus for bird photography',
  'Electronics',
  'https://amzn.to/canonr7',
  'https://images.unsplash.com/photo-1606986628951-5a8a26f8e2f2?w=400&h=300&fit=crop',
  1499.99,
  3,
  true,
  true,
  'Canon',
  ARRAY['photography', 'premium', 'wildlife']
),
(
  'REPLACE-WITH-GREATSALTLAKE-UUID',
  'Peterson Field Guide to Birds',
  'Comprehensive bird identification guide for Utah species',
  'Guides',
  'https://amzn.to/petersonbirds',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
  24.99,
  4,
  true,
  false,
  'Peterson',
  ARRAY['wildlife', 'beginner-friendly']
);

-- ==============================================================================
-- VERIFICATION QUERIES
-- ==============================================================================

-- Check total products inserted
SELECT COUNT(*) as total_products FROM destination_affiliate_gear;

-- View all products by destination
SELECT
  destination_id,
  COUNT(*) as product_count,
  STRING_AGG(product_name, ', ') as products
FROM destination_affiliate_gear
GROUP BY destination_id;

-- View featured products only
SELECT
  product_name,
  brand,
  price,
  category
FROM destination_affiliate_gear
WHERE featured = true
ORDER BY price DESC;

-- Test API response format (preview)
SELECT
  id,
  product_name,
  product_description,
  category,
  affiliate_link,
  image_url,
  price,
  featured,
  brand,
  tags
FROM destination_affiliate_gear
WHERE destination_id = 'REPLACE-WITH-UUID'
  AND active = true
ORDER BY display_order ASC, featured DESC
LIMIT 4;
