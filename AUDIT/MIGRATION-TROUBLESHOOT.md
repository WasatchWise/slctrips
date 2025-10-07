# MIGRATION TROUBLESHOOTING - idx_destination_gear_destination_id EXISTS

**Error:** `42P07: relation "idx_destination_gear_destination_id" already exists`
**Date:** 2025-10-06
**Status:** RESOLVING

---

## DIAGNOSIS

The error indicates the index (and likely the entire table) was already created in a previous migration attempt.

**Possible Causes:**
1. Migration was partially run before
2. Table exists but with incomplete data
3. Manual table creation during testing

---

## RESOLUTION OPTIONS

### Option A: Check if Table Exists & Skip Migration

**Step 1: Check if table exists**
```sql
-- Run in Supabase SQL Editor
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'destination_affiliate_gear'
);
```

**If TRUE:** Table already exists, skip migration ✅

**Next Steps:**
1. Verify table structure matches migration schema
2. Check if RLS policies are in place
3. Proceed to seed data

---

### Option B: Drop Existing & Re-run Migration

**⚠️ WARNING: This will delete any existing gear data**

```sql
-- Drop table and all related objects
DROP TABLE IF EXISTS destination_affiliate_gear CASCADE;

-- Drop function if exists
DROP FUNCTION IF EXISTS update_destination_affiliate_gear_updated_at();

-- Now re-run the full migration from:
-- supabase/migrations/20251006_affiliate_gear_tables.sql
```

---

### Option C: Create Only Missing Components (Recommended)

**Step 1: Verify what exists**
```sql
-- Check table
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'destination_affiliate_gear';

-- Check indexes
SELECT indexname FROM pg_indexes
WHERE tablename = 'destination_affiliate_gear';

-- Check RLS policies
SELECT policyname FROM pg_policies
WHERE tablename = 'destination_affiliate_gear';

-- Check triggers
SELECT trigger_name FROM information_schema.triggers
WHERE event_object_table = 'destination_affiliate_gear';
```

**Step 2: Create only missing pieces**

If table exists but missing components, run these individually:

```sql
-- Create missing indexes (skip if exists)
CREATE INDEX IF NOT EXISTS idx_destination_gear_destination_id
  ON destination_affiliate_gear(destination_id);

CREATE INDEX IF NOT EXISTS idx_destination_gear_active
  ON destination_affiliate_gear(destination_id, active)
  WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_destination_gear_display_order
  ON destination_affiliate_gear(destination_id, display_order, active)
  WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_destination_gear_category
  ON destination_affiliate_gear(category);

CREATE INDEX IF NOT EXISTS idx_destination_gear_product_name_gin
  ON destination_affiliate_gear
  USING gin(to_tsvector('english', product_name));

-- Enable RLS (safe to run multiple times)
ALTER TABLE destination_affiliate_gear ENABLE ROW LEVEL SECURITY;

-- Create policies (use IF NOT EXISTS or ignore errors)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'destination_affiliate_gear'
    AND policyname = 'Public read access for affiliate gear'
  ) THEN
    CREATE POLICY "Public read access for affiliate gear"
      ON destination_affiliate_gear
      FOR SELECT
      USING (active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'destination_affiliate_gear'
    AND policyname = 'Authenticated users can manage affiliate gear'
  ) THEN
    CREATE POLICY "Authenticated users can manage affiliate gear"
      ON destination_affiliate_gear
      FOR ALL
      USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Create trigger function
CREATE OR REPLACE FUNCTION update_destination_affiliate_gear_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (drop first if exists)
DROP TRIGGER IF EXISTS trigger_update_destination_affiliate_gear_updated_at
  ON destination_affiliate_gear;

CREATE TRIGGER trigger_update_destination_affiliate_gear_updated_at
  BEFORE UPDATE ON destination_affiliate_gear
  FOR EACH ROW
  EXECUTE FUNCTION update_destination_affiliate_gear_updated_at();
```

---

## VERIFICATION SCRIPT

**Run this to verify everything is in place:**

```sql
-- 1. Table exists
SELECT
  CASE WHEN EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'destination_affiliate_gear'
  ) THEN '✅ Table exists'
  ELSE '❌ Table missing'
  END as table_status;

-- 2. Count indexes
SELECT
  COUNT(*) as index_count,
  CASE WHEN COUNT(*) >= 5 THEN '✅ All indexes present'
  ELSE '⚠️ Missing indexes'
  END as index_status
FROM pg_indexes
WHERE tablename = 'destination_affiliate_gear';

-- 3. Check RLS
SELECT
  CASE WHEN COUNT(*) >= 2 THEN '✅ RLS policies configured'
  ELSE '⚠️ Missing RLS policies'
  END as rls_status
FROM pg_policies
WHERE tablename = 'destination_affiliate_gear';

-- 4. Check trigger
SELECT
  CASE WHEN COUNT(*) = 1 THEN '✅ Trigger configured'
  ELSE '⚠️ Missing trigger'
  END as trigger_status
FROM information_schema.triggers
WHERE event_object_table = 'destination_affiliate_gear';

-- 5. Check columns
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'destination_affiliate_gear'
ORDER BY ordinal_position;
```

---

## RECOMMENDED ACTION

**Run Option C (Create Missing Components):**

1. ✅ Run verification script above to see what exists
2. ✅ Run the "Create only missing pieces" SQL
3. ✅ Re-run verification script to confirm all green
4. ✅ Proceed to seed data

**This approach is safest:**
- Won't drop existing data
- Uses `IF NOT EXISTS` where possible
- Handles partial migrations gracefully

---

## AFTER RESOLUTION

Once table is confirmed complete:

**1. Verify Structure:**
```sql
\d destination_affiliate_gear
-- or
SELECT * FROM destination_affiliate_gear LIMIT 1;
```

**2. Seed Test Data:**
```sql
INSERT INTO destination_affiliate_gear (
  destination_id, product_name, product_description, category,
  affiliate_link, image_url, price, display_order, featured, brand, tags
) VALUES
('YOUR-UUID-HERE', 'Test Product', 'Test description', 'Gear',
 'https://example.com', 'https://via.placeholder.com/400',
 99.99, 1, true, 'TestBrand', ARRAY['test']);
```

**3. Test API:**
```bash
curl "https://your-site.vercel.app/api/destinations/gear?id=YOUR-UUID-HERE"
```

---

**Status:** Ready for Option C (selective component creation)
**Recommended:** Run verification script first to see current state
