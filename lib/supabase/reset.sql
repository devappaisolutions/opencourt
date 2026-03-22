-- ================================================
-- OpenCourt Database Reset Script
-- WARNING: Deletes ALL data from ALL tables AND all auth users.
-- Run this in the Supabase SQL Editor to start fresh.
-- Schema (tables, policies, triggers, indexes) is preserved.
-- ================================================

BEGIN;

-- ================================================
-- 1. TRUNCATE ALL APP TABLES (deepest children first)
-- ================================================
TRUNCATE TABLE game_stats CASCADE;
TRUNCATE TABLE team_assignments CASCADE;
TRUNCATE TABLE game_roster CASCADE;
TRUNCATE TABLE games CASCADE;
TRUNCATE TABLE profiles CASCADE;

-- ================================================
-- 2. DELETE ALL AUTHENTICATED USERS
--    This removes every user from auth.users.
--    The profiles trigger won't fire because profiles
--    were already truncated above.
-- ================================================
DELETE FROM auth.sessions;
DELETE FROM auth.refresh_tokens;
DELETE FROM auth.mfa_factors;
DELETE FROM auth.identities;
DELETE FROM auth.users;

-- ================================================
-- VERIFICATION
-- ================================================
DO $$
DECLARE
  app_total INT;
  user_total INT;
BEGIN
  SELECT
    (SELECT COUNT(*) FROM game_stats) +
    (SELECT COUNT(*) FROM team_assignments) +
    (SELECT COUNT(*) FROM game_roster) +
    (SELECT COUNT(*) FROM games) +
    (SELECT COUNT(*) FROM profiles)
  INTO app_total;

  SELECT COUNT(*) FROM auth.users INTO user_total;

  IF app_total = 0 AND user_total = 0 THEN
    RAISE NOTICE '✓ Reset complete. All tables and auth users are empty.';
  ELSE
    RAISE WARNING '⚠ Reset incomplete. % app rows and % auth users still remain.', app_total, user_total;
  END IF;
END $$;

SELECT table_name, row_count FROM (
  SELECT 'profiles'         AS table_name, COUNT(*) AS row_count FROM profiles UNION ALL
  SELECT 'games',                          COUNT(*)              FROM games UNION ALL
  SELECT 'game_roster',                    COUNT(*)              FROM game_roster UNION ALL
  SELECT 'team_assignments',               COUNT(*)              FROM team_assignments UNION ALL
  SELECT 'game_stats',                     COUNT(*)              FROM game_stats UNION ALL
  SELECT 'auth.users',                     COUNT(*)              FROM auth.users
) counts ORDER BY table_name;

COMMIT;
