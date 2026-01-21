-- ================================================
-- OpenCourt Test Data Seed Script
-- Creates realistic test data for development
-- ================================================

-- ================================================
-- SEED DATA GENERATION
-- ================================================

DO $$
DECLARE
    existing_users UUID[];
    host_id UUID;
    game_id UUID;
    i INT;
    random_players INT;
    player_idx INT;
    game_date TIMESTAMP;
    game_status TEXT;
    game_format TEXT;
    game_level TEXT;
    game_cost TEXT;
    game_location TEXT;
    game_title TEXT;
    max_p INT;
    current_date_ts TIMESTAMP := NOW();
    
    -- Location data
    locations TEXT[] := ARRAY[
        'BGC Activity Center, Taguig',
        'Ronac Art Center, Makati',
        'SM Aura Roofdeck, Taguig',
        'Quezon City Circle Courts',
        'Rizal Memorial Coliseum, Manila',
        'PhilSports Arena, Pasig',
        'Ultra Courts, Pasig',
        'Bagong Bayan Courts, Pasig',
        'Greenfields Park, Mandaluyong',
        'Valle Verde Country Club, Pasig',
        'Eastwood Courts, Quezon City',
        'Alabang Town Center Courts',
        'San Juan Arena Courts',
        'Marikina Sports Center',
        'Paranaque Sports Complex'
    ];
    
    -- Game configuration arrays
    formats TEXT[] := ARRAY['3v3', '4v4', '5v5', '5v5', '5v5'];
    levels TEXT[] := ARRAY['Casual', 'Casual', 'Competitive', 'Competitive', 'Elite'];
    costs TEXT[] := ARRAY['Free', 'Free', '₱50/head', '₱100/head', '₱150/head'];
    titles_casual TEXT[] := ARRAY['Casual Run', 'Pickup Game', 'Weekend Hoops', 'Friendly Game', 'Morning Run'];
    titles_comp TEXT[] := ARRAY['Competitive Run', 'Serious Runs Only', 'No Excuses Run', 'Elite Practice', 'Draft Night'];
    
BEGIN
    -- Get existing user IDs from profiles
    SELECT ARRAY_AGG(id) INTO existing_users FROM profiles LIMIT 20;
    
    -- Check if we have users
    IF existing_users IS NULL OR array_length(existing_users, 1) = 0 THEN
        RAISE NOTICE 'No existing users found in profiles table. Please create at least one user first.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found % existing users. Creating 100 test games...', array_length(existing_users, 1);
    
    -- ================================================
    -- CREATE 100 GAMES
    -- ================================================
    FOR i IN 1..100 LOOP
        -- Use existing users as hosts (cycle through them)
        host_id := existing_users[1 + (i % array_length(existing_users, 1))];
        
        -- Random date: 3 months ago to 3 months from now
        game_date := current_date_ts + (random() * 180 - 90)::INT * INTERVAL '1 day' 
                     + (7 + floor(random() * 12))::INT * INTERVAL '1 hour';
        
        -- Determine game status based on date
        IF game_date < current_date_ts - INTERVAL '1 day' THEN
            IF random() < 0.1 THEN
                game_status := 'cancelled';
            ELSE
                game_status := 'completed';
            END IF;
        ELSIF game_date < current_date_ts + INTERVAL '1 day' THEN
            game_status := 'open';
        ELSE
            IF random() < 0.05 THEN
                game_status := 'cancelled';
            ELSE
                game_status := 'open';
            END IF;
        END IF;
        
        -- Random format, level, cost
        game_format := formats[1 + floor(random() * 5)::INT];
        game_level := levels[1 + floor(random() * 5)::INT];
        game_cost := costs[1 + floor(random() * 5)::INT];
        game_location := locations[1 + floor(random() * 15)::INT];
        
        -- Title based on format and level
        IF game_level = 'Casual' THEN
            game_title := game_format || ' ' || titles_casual[1 + floor(random() * 5)::INT];
        ELSE
            game_title := game_format || ' ' || titles_comp[1 + floor(random() * 5)::INT];
        END IF;
        
        -- Max players based on format
        CASE game_format
            WHEN '3v3' THEN max_p := 6 + floor(random() * 3)::INT;
            WHEN '4v4' THEN max_p := 8 + floor(random() * 4)::INT;
            WHEN '5v5' THEN max_p := 10 + floor(random() * 6)::INT;
            ELSE max_p := 10;
        END CASE;
        
        -- Insert game
        INSERT INTO games (
            id, host_id, title, location, date_time, format, skill_level, cost, max_players, 
            status, cancellation_reason, gender_filter, age_range, latitude, longitude, created_at
        ) VALUES (
            gen_random_uuid(),
            host_id,
            game_title,
            game_location,
            game_date,
            game_format,
            game_level,
            game_cost,
            max_p,
            game_status,
            CASE WHEN game_status = 'cancelled' THEN 
                (ARRAY['Not enough players', 'Weather conditions', 'Venue unavailable', 'Personal emergency'])[1 + floor(random() * 4)::INT]
            ELSE NULL END,
            (ARRAY['Mixed', 'Mens', 'Womens'])[1 + floor(random() * 3)::INT],
            (ARRAY['All Ages', '18+', '21+'])[1 + floor(random() * 3)::INT],
            14.0693 + (random() * 0.5 - 0.25), -- San Pablo area latitude
            121.3265 + (random() * 0.5 - 0.25), -- San Pablo area longitude
            game_date - (random() * 14)::INT * INTERVAL '1 day'
        )
        RETURNING id INTO game_id;
        
        -- ================================================
        -- ADD PLAYERS TO ROSTER
        -- ================================================
        IF game_status != 'cancelled' AND array_length(existing_users, 1) > 1 THEN
            -- Determine how many players to add
            IF game_status = 'completed' THEN
                random_players := LEAST(max_p - floor(random() * 3)::INT, array_length(existing_users, 1) - 1);
            ELSE
                random_players := LEAST(2 + floor(random() * (max_p - 2))::INT, array_length(existing_users, 1) - 1);
            END IF;
            
            -- Add players (excluding the host)
            FOR player_idx IN 1..random_players LOOP
                DECLARE
                    player_id UUID;
                    roster_status TEXT;
                BEGIN
                    -- Get a player different from host
                    player_id := existing_users[1 + ((i + player_idx) % array_length(existing_users, 1))];
                    
                    -- Skip if same as host
                    IF player_id = host_id THEN
                        CONTINUE;
                    END IF;
                    
                    -- Determine roster status
                    IF game_status = 'completed' THEN
                        IF random() < 0.85 THEN
                            roster_status := 'checked_in';
                        ELSE
                            roster_status := 'absent';
                        END IF;
                    ELSIF player_idx <= max_p THEN
                        roster_status := 'joined';
                    ELSE
                        roster_status := 'waitlist';
                    END IF;
                    
                    -- Insert roster entry
                    INSERT INTO game_roster (game_id, player_id, status, joined_at)
                    VALUES (
                        game_id,
                        player_id,
                        roster_status,
                        game_date - (random() * 7)::INT * INTERVAL '1 day'
                    )
                    ON CONFLICT (game_id, player_id) DO NOTHING;
                EXCEPTION WHEN OTHERS THEN
                    -- Ignore errors for this player
                    NULL;
                END;
            END LOOP;
        END IF;
        
        -- Progress indicator
        IF i % 20 = 0 THEN
            RAISE NOTICE 'Created % games...', i;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Finished creating 100 games!';
END $$;

-- ================================================
-- UPDATE CURRENT PLAYERS COUNT
-- ================================================
UPDATE games g SET current_players = (
    SELECT COUNT(*) FROM game_roster r 
    WHERE r.game_id = g.id AND r.status IN ('joined', 'checked_in')
);

-- ================================================
-- SUMMARY STATISTICS
-- ================================================
SELECT 
    'Total Games' as metric, COUNT(*)::TEXT as value FROM games
UNION ALL
SELECT 'Open Games', COUNT(*)::TEXT FROM games WHERE status = 'open'
UNION ALL
SELECT 'Completed Games', COUNT(*)::TEXT FROM games WHERE status = 'completed'
UNION ALL
SELECT 'Cancelled Games', COUNT(*)::TEXT FROM games WHERE status = 'cancelled'
UNION ALL
SELECT 'Total Roster Entries', COUNT(*)::TEXT FROM game_roster
UNION ALL
SELECT 'Checked-in Players', COUNT(*)::TEXT FROM game_roster WHERE status = 'checked_in'
UNION ALL
SELECT 'Absent Players', COUNT(*)::TEXT FROM game_roster WHERE status = 'absent'
UNION ALL
SELECT 'Waitlisted Players', COUNT(*)::TEXT FROM game_roster WHERE status = 'waitlist';
