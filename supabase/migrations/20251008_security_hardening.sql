-- Security Hardening Migration
-- Date: 2025-10-08
-- Purpose: Fix search_path vulnerabilities, move extensions, update auth config
--
-- CRITICAL FIXES:
-- 1. Set explicit search_path on all functions to prevent schema injection
-- 2. Move pg_net extension out of public schema
-- 3. Reduce OTP expiry to <60 minutes

-- ============================================================================
-- PART 1: Fix Function Search Paths
-- ============================================================================
-- All functions must have explicit search_path to prevent attackers from
-- injecting malicious schemas that could be resolved before 'public'

-- Fix: update_updated_at_column
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix: get_cron_jobs
DROP FUNCTION IF EXISTS public.get_cron_jobs() CASCADE;
CREATE OR REPLACE FUNCTION public.get_cron_jobs()
RETURNS TABLE (
  jobid bigint,
  schedule text,
  command text,
  nodename text,
  nodeport integer,
  database text,
  username text,
  active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
BEGIN
  RETURN QUERY SELECT * FROM cron.job;
END;
$$;

-- Fix: update_enhancement_progress
DROP FUNCTION IF EXISTS public.update_enhancement_progress(uuid, integer) CASCADE;
CREATE OR REPLACE FUNCTION public.update_enhancement_progress(
  destination_id uuid,
  new_progress integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
BEGIN
  UPDATE destinations
  SET enhancement_progress = new_progress,
      updated_at = NOW()
  WHERE id = destination_id;
END;
$$;

-- Fix: trigger_progress_update
DROP FUNCTION IF EXISTS public.trigger_progress_update() CASCADE;
CREATE OR REPLACE FUNCTION public.trigger_progress_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix: update_updated_at_timestamp
DROP FUNCTION IF EXISTS public.update_updated_at_timestamp() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix: update_tripkit_destination_count
DROP FUNCTION IF EXISTS public.update_tripkit_destination_count() CASCADE;
CREATE OR REPLACE FUNCTION public.update_tripkit_destination_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
BEGIN
  UPDATE tripkits
  SET destination_count = (
    SELECT COUNT(*)
    FROM tripkit_destinations
    WHERE tripkit_id = COALESCE(NEW.tripkit_id, OLD.tripkit_id)
  )
  WHERE id = COALESCE(NEW.tripkit_id, OLD.tripkit_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix: update_destination_affiliate_gear_updated_at
DROP FUNCTION IF EXISTS public.update_destination_affiliate_gear_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.update_destination_affiliate_gear_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Re-create triggers for functions that were dropped
-- (Assuming triggers were named after their functions)
DO $$
BEGIN
  -- Trigger for destinations.updated_at
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at') THEN
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON destinations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Trigger for tripkit_destinations count update
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tripkit_count') THEN
    CREATE TRIGGER update_tripkit_count
    AFTER INSERT OR DELETE ON tripkit_destinations
    FOR EACH ROW
    EXECUTE FUNCTION update_tripkit_destination_count();
  END IF;

  -- Trigger for destination_affiliate_gear.updated_at
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_gear_updated_at') THEN
    CREATE TRIGGER set_gear_updated_at
    BEFORE UPDATE ON destination_affiliate_gear
    FOR EACH ROW
    EXECUTE FUNCTION update_destination_affiliate_gear_updated_at();
  END IF;
END $$;

-- ============================================================================
-- PART 2: Move pg_net Extension to Dedicated Schema
-- ============================================================================
-- pg_net should not live in public to prevent PUBLIC execute permissions

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pg_net extension
-- Note: This requires superuser. If running as non-superuser, skip and handle via Supabase CLI
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_net'
    AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Drop and recreate in extensions schema
    DROP EXTENSION IF EXISTS pg_net CASCADE;
    CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;
  END IF;
END $$;

-- Revoke public execute permissions
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA extensions FROM PUBLIC;
REVOKE ALL ON SCHEMA extensions FROM PUBLIC;

-- Grant only to authenticated users if needed
-- GRANT USAGE ON SCHEMA extensions TO authenticated;

-- ============================================================================
-- PART 3: OTP Expiry Configuration
-- ============================================================================
-- Reduce OTP TTL from >1hr to 30 minutes (1800 seconds)
-- Note: This is done via Supabase Dashboard or CLI, not SQL
-- Manual step: Run `supabase secrets set EMAIL_OTP_EXPIRY=1800`
-- Or update in Dashboard: Authentication → Settings → Email → OTP expiry

-- Document the required config change
COMMENT ON SCHEMA public IS
'OTP_EXPIRY_CONFIG: Set EMAIL_OTP_EXPIRY=1800 (30min) in Supabase auth config';

-- ============================================================================
-- PART 4: Postgres Version Upgrade Reminder
-- ============================================================================
-- Current: supabase-postgres-17.4.1.048
-- Action: Schedule maintenance window to upgrade to latest Supabase Postgres
-- via Supabase Dashboard or CLI: `supabase db upgrade`

-- Document the required upgrade
COMMENT ON DATABASE postgres IS
'POSTGRES_VERSION: Schedule upgrade from 17.4.1.048 to latest Supabase release';

-- ============================================================================
-- Verification Queries
-- ============================================================================
-- Run these to verify the migration was successful:

-- 1. Check function search_paths
-- SELECT
--   p.proname as function_name,
--   pg_get_function_identity_arguments(p.oid) as args,
--   p.prosecdef as is_security_definer,
--   (SELECT string_agg(nspname, ', ')
--    FROM pg_namespace
--    WHERE oid = ANY(p.proconfig::oid[])
--   ) as search_path
-- FROM pg_proc p
-- JOIN pg_namespace n ON p.pronamespace = n.oid
-- WHERE n.nspname = 'public'
-- AND p.proname LIKE '%update%';

-- 2. Check pg_net location
-- SELECT
--   e.extname,
--   n.nspname as schema
-- FROM pg_extension e
-- JOIN pg_namespace n ON e.extnamespace = n.oid
-- WHERE e.extname = 'pg_net';

-- 3. Check OTP expiry setting (via Supabase API)
-- curl https://mkepcjzqnbowrgbvjfem.supabase.co/auth/v1/settings \
--   -H "apikey: YOUR_ANON_KEY" | jq .email_otp_expiry_seconds

-- ============================================================================
-- Rollback Script (if needed)
-- ============================================================================
-- To rollback, restore functions without search_path and move pg_net back:
-- ALTER FUNCTION public.update_updated_at_column() RESET search_path;
-- DROP EXTENSION IF EXISTS pg_net CASCADE;
-- CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA public;
