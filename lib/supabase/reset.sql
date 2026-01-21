-- ================================================
-- OpenCourt Database Reset Script
-- WARNING: This will delete ALL data!
-- ================================================

-- Disable triggers temporarily
SET session_replication_role = 'replica';

-- ================================================
-- DELETE ALL DATA (in correct order due to foreign keys)
-- ================================================

TRUNCATE TABLE peer_reviews CASCADE;
TRUNCATE TABLE game_roster CASCADE;
TRUNCATE TABLE games CASCADE;
TRUNCATE TABLE usual_courts CASCADE;
TRUNCATE TABLE profiles CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- ================================================
-- RESET SEQUENCES (if any)
-- ================================================

-- No sequences to reset as we use gen_random_uuid()

-- ================================================
-- VERIFICATION
-- ================================================

SELECT 
  'peer_reviews' as table_name, COUNT(*) as row_count FROM peer_reviews
UNION ALL
SELECT 'game_roster', COUNT(*) FROM game_roster
UNION ALL
SELECT 'games', COUNT(*) FROM games
UNION ALL
SELECT 'usual_courts', COUNT(*) FROM usual_courts
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles;

-- All counts should be 0
