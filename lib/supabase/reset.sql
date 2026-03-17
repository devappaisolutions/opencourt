-- ================================================
-- OpenCourt Database Reset Script
-- WARNING: Deletes ALL data from ALL tables.
-- Run this before re-running schema.sql to start fresh.
-- ================================================

BEGIN;

-- Truncate in dependency order (deepest children first)
TRUNCATE TABLE game_stats CASCADE;
TRUNCATE TABLE team_assignments CASCADE;
TRUNCATE TABLE game_roster CASCADE;
TRUNCATE TABLE games CASCADE;
TRUNCATE TABLE profiles CASCADE;

-- ================================================
-- VERIFICATION
-- ================================================
DO $$
DECLARE
  total INT;
BEGIN
  SELECT
    (SELECT COUNT(*) FROM game_stats) +
    (SELECT COUNT(*) FROM team_assignments) +
    (SELECT COUNT(*) FROM game_roster) +
    (SELECT COUNT(*) FROM games) +
    (SELECT COUNT(*) FROM profiles)
  INTO total;

  IF total = 0 THEN
    RAISE NOTICE '✓ Reset complete. All tables are empty.';
  ELSE
    RAISE WARNING '⚠ Reset incomplete. % rows still remain.', total;
  END IF;
END $$;

SELECT table_name, row_count FROM (
  SELECT 'profiles'         AS table_name, COUNT(*) AS row_count FROM profiles UNION ALL
  SELECT 'games',                          COUNT(*)              FROM games UNION ALL
  SELECT 'game_roster',                    COUNT(*)              FROM game_roster UNION ALL
  SELECT 'team_assignments',               COUNT(*)              FROM team_assignments UNION ALL
  SELECT 'game_stats',                     COUNT(*)              FROM game_stats
) counts ORDER BY table_name;

COMMIT;
