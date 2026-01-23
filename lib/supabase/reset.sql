-- ================================================
-- OpenCourt Database Reset Script
-- WARNING: This will delete ALL data!
-- ================================================

-- Wrap in transaction for safety
BEGIN;

-- ================================================
-- DELETE ALL DATA (in correct order due to foreign keys)
-- ================================================

-- Using TRUNCATE CASCADE to handle foreign key dependencies
-- This is more efficient than DELETE and automatically handles cascades
TRUNCATE TABLE game_stats CASCADE;
TRUNCATE TABLE team_assignments CASCADE;
TRUNCATE TABLE game_roster CASCADE;
TRUNCATE TABLE games CASCADE;
TRUNCATE TABLE profiles CASCADE;

-- ================================================
-- VERIFICATION
-- ================================================

-- Verify all tables are empty
DO $$
DECLARE
    game_stats_count INT;
    team_assignments_count INT;
    game_roster_count INT;
    games_count INT;
    profiles_count INT;
    total_count INT;
BEGIN
    SELECT COUNT(*) INTO game_stats_count FROM game_stats;
    SELECT COUNT(*) INTO team_assignments_count FROM team_assignments;
    SELECT COUNT(*) INTO game_roster_count FROM game_roster;
    SELECT COUNT(*) INTO games_count FROM games;
    SELECT COUNT(*) INTO profiles_count FROM profiles;
    
    total_count := game_stats_count + team_assignments_count + game_roster_count + games_count + profiles_count;
    
    IF total_count = 0 THEN
        RAISE NOTICE '✓ Database reset successful. All tables are empty.';
    ELSE
        RAISE WARNING '⚠ Reset incomplete. Found % total rows remaining.', total_count;
    END IF;
    
    RAISE NOTICE 'Row counts: profiles=%, games=%, game_roster=%, team_assignments=%, game_stats=%',
        profiles_count, games_count, game_roster_count, team_assignments_count, game_stats_count;
END $$;

-- Display table counts
SELECT 
  'game_stats' as table_name, COUNT(*) as row_count FROM game_stats
UNION ALL
SELECT 'team_assignments', COUNT(*) FROM team_assignments
UNION ALL
SELECT 'game_roster', COUNT(*) FROM game_roster
UNION ALL
SELECT 'games', COUNT(*) FROM games
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles;

-- All counts should be 0

COMMIT;

