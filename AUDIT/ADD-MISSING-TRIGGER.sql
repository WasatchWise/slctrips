-- Add Missing Trigger for destination_affiliate_gear
-- This updates the updated_at timestamp automatically on row updates

-- Create the trigger function
CREATE OR REPLACE FUNCTION update_destination_affiliate_gear_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists (to avoid errors)
DROP TRIGGER IF EXISTS trigger_update_destination_affiliate_gear_updated_at
  ON destination_affiliate_gear;

-- Create the trigger
CREATE TRIGGER trigger_update_destination_affiliate_gear_updated_at
  BEFORE UPDATE ON destination_affiliate_gear
  FOR EACH ROW
  EXECUTE FUNCTION update_destination_affiliate_gear_updated_at();

-- Verify trigger was created
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'destination_affiliate_gear';
