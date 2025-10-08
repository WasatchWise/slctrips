-- Add Missing Content Fields for Destinations
-- Date: 2025-10-08
-- Purpose: Ensure destinations table exposes core content fields used by the UI
-- Notes:
--   * Adds image_url and description columns if they do not exist
--   * Backfills the new columns from existing cover/photo/description columns when available

-- ============================================================================
-- PART 1: Add Columns
-- ============================================================================

ALTER TABLE public.destinations
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT;

-- ============================================================================
-- PART 2: Backfill Image URL Column
-- ============================================================================

DO $$
BEGIN
  -- Prefer cover_photo_url when available
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'destinations'
      AND column_name  = 'cover_photo_url'
  ) THEN
    EXECUTE $sql$
      UPDATE public.destinations
      SET image_url = cover_photo_url
      WHERE image_url IS NULL
        AND cover_photo_url IS NOT NULL
    $sql$;
  END IF;

  -- Fallback to photo_url if cover_photo_url is absent/NULL
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'destinations'
      AND column_name  = 'photo_url'
  ) THEN
    EXECUTE $sql$
      UPDATE public.destinations
      SET image_url = photo_url
      WHERE image_url IS NULL
        AND photo_url IS NOT NULL
    $sql$;
  END IF;

  -- Fallback to first image in images JSON (if column exists)
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'destinations'
      AND column_name  = 'images'
  ) THEN
    EXECUTE $sql$
      UPDATE public.destinations
      SET image_url = images->>0
      WHERE image_url IS NULL
        AND images IS NOT NULL
        AND jsonb_array_length(images) > 0
    $sql$;
  END IF;
END $$;

-- ============================================================================
-- PART 3: Backfill Description Column
-- ============================================================================

DO $$
BEGIN
  -- Prefer short description when available
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'destinations'
      AND column_name  = 'description_short'
  ) THEN
    EXECUTE $sql$
      UPDATE public.destinations
      SET description = description_short
      WHERE description IS NULL
        AND description_short IS NOT NULL
    $sql$;
  END IF;

  -- Fallback to long description when short description missing
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'destinations'
      AND column_name  = 'description_long'
  ) THEN
    EXECUTE $sql$
      UPDATE public.destinations
      SET description = description_long
      WHERE description IS NULL
        AND description_long IS NOT NULL
    $sql$;
  END IF;
END $$;

-- ============================================================================
-- PART 4: Verification Guidance (Manual)
-- ============================================================================
-- Run the following checks after executing this migration:
--
-- 1) Confirm columns exist:
--    SELECT column_name
--    FROM information_schema.columns
--    WHERE table_schema = 'public'
--      AND table_name = 'destinations'
--      AND column_name IN ('image_url', 'description');
--
-- 2) Spot-check backfill results:
--    SELECT name, image_url, description
--    FROM public.destinations
--    ORDER BY updated_at DESC
--    LIMIT 10;
--
-- 3) Identify rows still missing content:
--    SELECT COUNT(*) AS missing_image
--    FROM public.destinations
--    WHERE image_url IS NULL;
--
--    SELECT COUNT(*) AS missing_description
--    FROM public.destinations
--    WHERE description IS NULL;
--
-- ============================================================================
-- END OF MIGRATION
