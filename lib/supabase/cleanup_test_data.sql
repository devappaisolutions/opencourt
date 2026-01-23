-- ================================================
-- Cleanup Test Data Script
-- Run this BEFORE running test_data.sql again
-- ================================================

-- Delete in correct order (child tables first due to foreign keys)
DELETE FROM game_stats 
WHERE game_id IN (
    SELECT id FROM games 
    WHERE host_id IN (
        SELECT id FROM profiles WHERE username LIKE 'host%'
    )
);

DELETE FROM team_assignments 
WHERE game_id IN (
    SELECT id FROM games 
    WHERE host_id IN (
        SELECT id FROM profiles WHERE username LIKE 'host%'
    )
);

DELETE FROM game_roster 
WHERE game_id IN (
    SELECT id FROM games 
    WHERE host_id IN (
        SELECT id FROM profiles WHERE username LIKE 'host%'
    )
);

DELETE FROM games 
WHERE host_id IN (
    SELECT id FROM profiles WHERE username LIKE 'host%'
);

DELETE FROM profiles 
WHERE username LIKE 'testuser%' OR username LIKE 'host%';

DELETE FROM auth.users 
WHERE email LIKE '%@opencourt.test';

-- Show summary
SELECT 'Cleanup complete! You can now run test_data.sql' as message;
