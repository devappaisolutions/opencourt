-- ================================================
-- OpenCourt Comprehensive Test Data
-- Creates 60 users (2 hosts + 58 players) and 8 games covering all scenarios
-- ================================================

-- ================================================
-- CLEAR EXISTING TEST DATA (OPTIONAL)
-- ================================================
-- Uncomment the following lines if you want to clear existing data first
-- DELETE FROM game_stats WHERE game_id IN (SELECT id FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%'));
-- DELETE FROM team_assignments WHERE game_id IN (SELECT id FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%'));
-- DELETE FROM game_roster WHERE game_id IN (SELECT id FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%'));
-- DELETE FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%');
-- DELETE FROM profiles WHERE username LIKE 'testuser%' OR username LIKE 'host%';
-- DELETE FROM auth.users WHERE email LIKE '%@opencourt.test';

-- ================================================
-- CREATE 60 TEST USERS
-- ================================================
-- Note: This creates users in auth.users first, then profiles
-- This requires running with service_role privileges

DO $$
DECLARE
    user_id UUID;
    i INT;
    first_names TEXT[] := ARRAY[
        'James', 'Michael', 'Robert', 'John', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher',
        'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Andrew', 'Paul', 'Joshua', 'Kenneth',
        'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan', 'Jacob',
        'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin',
        'Samuel', 'Raymond', 'Gregory', 'Alexander', 'Patrick', 'Frank', 'Dennis', 'Jerry', 'Tyler', 'Aaron',
        'Jose', 'Adam', 'Nathan', 'Douglas', 'Zachary', 'Henry', 'Carl', 'Arthur', 'Kyle', 'Lawrence'
    ];
    last_names TEXT[] := ARRAY[
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
        'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
        'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
        'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
        'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes'
    ];
    positions TEXT[] := ARRAY['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center', 'Guard', 'Forward', 'Big Man'];
    skill_levels TEXT[] := ARRAY['Beginner', 'Casual', 'Casual', 'Competitive', 'Competitive', 'Elite'];
    
    first_name TEXT;
    last_name TEXT;
    full_name TEXT;
    username TEXT;
    user_email TEXT;
    position TEXT;
    skill_level TEXT;
    height_ft INT;
    height_in INT;
    reliability INT;
BEGIN
    RAISE NOTICE 'Creating 60 test users...';
    
    -- Create 2 hosts
    FOR i IN 1..2 LOOP
        user_id := gen_random_uuid();
        first_name := first_names[i];
        last_name := last_names[i];
        full_name := first_name || ' ' || last_name;
        username := 'host' || i;
        user_email := 'host' || i || '@opencourt.test';
        position := positions[1 + floor(random() * 8)::INT];
        skill_level := 'Competitive';
        height_ft := 5 + floor(random() * 2)::INT;
        height_in := floor(random() * 12)::INT;
        
        -- Insert into auth.users first
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            aud,
            role
        ) VALUES (
            user_id,
            '00000000-0000-0000-0000-000000000000',
            user_email,
            crypt('password123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            jsonb_build_object('full_name', full_name),
            'authenticated',
            'authenticated'
        );
        
        -- Then insert into profiles
        INSERT INTO profiles (
            id, username, full_name, position, height_ft, height_in, 
            skill_level, reliability_score, updated_at
        ) VALUES (
            user_id,
            username,
            full_name,
            position,
            height_ft,
            height_in,
            skill_level,
            100,
            NOW()
        );
        
        RAISE NOTICE 'Created host: % (ID: %, Email: %)', full_name, user_id, user_email;
    END LOOP;
    
    -- Create 58 regular players
    FOR i IN 3..60 LOOP
        user_id := gen_random_uuid();
        first_name := first_names[1 + ((i - 1) % 60)];
        last_name := last_names[1 + ((i + 17) % 60)];
        full_name := first_name || ' ' || last_name;
        username := 'testuser' || i;
        user_email := 'testuser' || i || '@opencourt.test';
        position := positions[1 + floor(random() * 8)::INT];
        skill_level := skill_levels[1 + floor(random() * 6)::INT];
        height_ft := 5 + floor(random() * 2)::INT;
        height_in := floor(random() * 12)::INT;
        
        -- Vary reliability scores (most are good, some are lower)
        IF random() < 0.7 THEN
            reliability := 85 + floor(random() * 16)::INT; -- 85-100
        ELSIF random() < 0.9 THEN
            reliability := 60 + floor(random() * 25)::INT; -- 60-84
        ELSE
            reliability := 30 + floor(random() * 30)::INT; -- 30-59
        END IF;
        
        -- Insert into auth.users first
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            aud,
            role
        ) VALUES (
            user_id,
            '00000000-0000-0000-0000-000000000000',
            user_email,
            crypt('password123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            jsonb_build_object('full_name', full_name),
            'authenticated',
            'authenticated'
        );
        
        -- Then insert into profiles
        INSERT INTO profiles (
            id, username, full_name, position, height_ft, height_in, 
            skill_level, reliability_score, updated_at
        ) VALUES (
            user_id,
            username,
            full_name,
            position,
            height_ft,
            height_in,
            skill_level,
            reliability,
            NOW()
        );
    END LOOP;
    
    RAISE NOTICE 'Successfully created 60 users (2 hosts + 58 players)';
    RAISE NOTICE 'All users have password: password123';
    RAISE NOTICE 'Emails: host1@opencourt.test, host2@opencourt.test, testuser3@opencourt.test, etc.';
END $$;

-- ================================================
-- CREATE 8 GAMES (4 per host) COVERING ALL SCENARIOS
-- ================================================

DO $$
DECLARE
    host1_id UUID;
    host2_id UUID;
    game_id UUID;
    player_ids UUID[];
    player_id UUID;
    i INT;
    j INT;
    
    -- Game data arrays
    locations TEXT[] := ARRAY[
        'BGC Activity Center, Taguig',
        'Ronac Art Center, Makati',
        'SM Aura Roofdeck, Taguig',
        'Quezon City Circle Courts',
        'Rizal Memorial Coliseum, Manila',
        'PhilSports Arena, Pasig',
        'Ultra Courts, Pasig',
        'Eastwood Courts, Quezon City'
    ];
    
    gradients TEXT[] := ARRAY[
        'from-blue-500 to-purple-600',
        'from-orange-500 to-red-600',
        'from-green-500 to-teal-600',
        'from-pink-500 to-rose-600',
        'from-indigo-500 to-blue-600',
        'from-yellow-500 to-orange-600',
        'from-cyan-500 to-blue-600',
        'from-red-500 to-pink-600'
    ];
    
BEGIN
    -- Get host IDs
    SELECT id INTO host1_id FROM profiles WHERE username = 'host1';
    SELECT id INTO host2_id FROM profiles WHERE username = 'host2';
    
    -- Get all player IDs (excluding hosts)
    SELECT ARRAY_AGG(id) INTO player_ids FROM profiles WHERE username LIKE 'testuser%';
    
    RAISE NOTICE 'Creating 8 games covering all scenarios...';
    RAISE NOTICE 'Host 1 ID: %', host1_id;
    RAISE NOTICE 'Host 2 ID: %', host2_id;
    RAISE NOTICE 'Available players: %', array_length(player_ids, 1);
    
    -- ================================================
    -- HOST 1 GAMES
    -- ================================================
    
    -- Game 1: OPEN game with spots available (5/10 players)
    INSERT INTO games (
        id, host_id, title, location, date_time, format, skill_level, cost, max_players,
        status, description, house_rules, image_gradient, latitude, longitude, created_at
    ) VALUES (
        gen_random_uuid(),
        host1_id,
        '5v5 Casual Run',
        locations[1],
        NOW() + INTERVAL '2 days' + INTERVAL '18 hours',
        '5v5',
        'Casual',
        'Free',
        10,
        'open',
        'Looking for players to run some hoops! All skill levels welcome.',
        'Call your own fouls. Winners stay on court.',
        gradients[1],
        14.5547, 121.0244, -- BGC coordinates
        NOW() - INTERVAL '3 days'
    ) RETURNING id INTO game_id;
    
    -- Add 5 players (status: joined)
    FOR i IN 1..5 LOOP
        INSERT INTO game_roster (game_id, player_id, status, joined_at)
        VALUES (game_id, player_ids[i], 'joined', NOW() - (i || ' hours')::INTERVAL);
    END LOOP;
    
    RAISE NOTICE 'Created Game 1: Open game with 5/10 players';
    
    -- Game 2: FULL game (10/10 players, 3 on waitlist)
    INSERT INTO games (
        id, host_id, title, location, date_time, format, skill_level, cost, max_players,
        status, description, house_rules, image_gradient, latitude, longitude, created_at
    ) VALUES (
        gen_random_uuid(),
        host1_id,
        '5v5 Competitive Run',
        locations[2],
        NOW() + INTERVAL '3 days' + INTERVAL '19 hours',
        '5v5',
        'Competitive',
        '₱100/head',
        10,
        'full',
        'Competitive game for serious ballers. Come ready to play hard.',
        'No cherry picking. Play defense. Respect the game.',
        gradients[2],
        14.5547, 121.0244,
        NOW() - INTERVAL '5 days'
    ) RETURNING id INTO game_id;
    
    -- Add 10 players (status: joined)
    FOR i IN 6..15 LOOP
        INSERT INTO game_roster (game_id, player_id, status, joined_at)
        VALUES (game_id, player_ids[i], 'joined', NOW() - (i || ' hours')::INTERVAL);
    END LOOP;
    
    -- Add 3 players to waitlist
    FOR i IN 16..18 LOOP
        INSERT INTO game_roster (game_id, player_id, status, joined_at)
        VALUES (game_id, player_ids[i], 'waitlist', NOW() - ((i-15) || ' hours')::INTERVAL);
    END LOOP;
    
    RAISE NOTICE 'Created Game 2: Full game with 10/10 players + 3 waitlist';
    
    -- Game 3: COMPLETED game (all players checked in)
    INSERT INTO games (
        id, host_id, title, location, date_time, format, skill_level, cost, max_players,
        status, description, house_rules, image_gradient, latitude, longitude, created_at
    ) VALUES (
        gen_random_uuid(),
        host1_id,
        '5v5 Elite Practice',
        locations[3],
        NOW() - INTERVAL '2 days',
        '5v5',
        'Elite',
        '₱150/head',
        10,
        'completed',
        'Elite level run. Must have good fundamentals and game IQ.',
        'First team to 21 wins. Win by 2. Make it take it.',
        gradients[3],
        14.6488, 121.0509,
        NOW() - INTERVAL '7 days'
    ) RETURNING id INTO game_id;
    
    -- Add 10 players (all checked in)
    FOR i IN 19..28 LOOP
        INSERT INTO game_roster (game_id, player_id, status, joined_at)
        VALUES (game_id, player_ids[i], 'checked_in', NOW() - INTERVAL '3 days' - (i || ' hours')::INTERVAL);
    END LOOP;
    
    -- Add team assignments (5v5)
    FOR i IN 19..28 LOOP
        INSERT INTO team_assignments (game_id, player_id, team_number, assigned_by, assigned_at)
        VALUES (
            game_id, 
            player_ids[i], 
            CASE WHEN (i - 18) <= 5 THEN 1 ELSE 2 END,
            host1_id,
            NOW() - INTERVAL '2 days' + INTERVAL '30 minutes'
        );
    END LOOP;
    
    -- Add some game stats for completed game
    FOR i IN 19..28 LOOP
        INSERT INTO game_stats (game_id, player_id, points, rebounds, assists, steals, blocks, turnovers)
        VALUES (
            game_id,
            player_ids[i],
            5 + floor(random() * 20)::INT,
            2 + floor(random() * 8)::INT,
            1 + floor(random() * 6)::INT,
            floor(random() * 4)::INT,
            floor(random() * 3)::INT,
            floor(random() * 4)::INT
        );
    END LOOP;
    
    RAISE NOTICE 'Created Game 3: Completed game with all players checked in + stats';
    
    -- Game 4: COMPLETED game with some no-shows (8 checked in, 2 absent)
    INSERT INTO games (
        id, host_id, title, location, date_time, format, skill_level, cost, max_players,
        status, description, house_rules, image_gradient, latitude, longitude, created_at
    ) VALUES (
        gen_random_uuid(),
        host1_id,
        '4v4 Weekend Hoops',
        locations[4],
        NOW() - INTERVAL '5 days',
        '4v4',
        'Casual',
        'Free',
        10,
        'completed',
        'Weekend warriors unite! Let''s get a good sweat in.',
        'Subs rotate in after each game. Everyone gets playing time.',
        gradients[4],
        14.5764, 120.9851,
        NOW() - INTERVAL '10 days'
    ) RETURNING id INTO game_id;
    
    -- Add 8 players (checked in)
    FOR i IN 29..36 LOOP
        INSERT INTO game_roster (game_id, player_id, status, joined_at)
        VALUES (game_id, player_ids[i], 'checked_in', NOW() - INTERVAL '6 days' - (i || ' hours')::INTERVAL);
    END LOOP;
    
    -- Add 2 players (absent - these will trigger reliability score penalty)
    FOR i IN 37..38 LOOP
        INSERT INTO game_roster (game_id, player_id, status, joined_at)
        VALUES (game_id, player_ids[i], 'absent', NOW() - INTERVAL '6 days' - (i || ' hours')::INTERVAL);
    END LOOP;
    
    RAISE NOTICE 'Created Game 4: Completed game with 8 checked in, 2 absent';
    
    -- ================================================
    -- HOST 2 GAMES
    -- ================================================
    
    -- Game 5: OPEN game with few players (3/12 players)
    INSERT INTO games (
        id, host_id, title, location, date_time, format, skill_level, cost, max_players,
        status, description, house_rules, image_gradient, latitude, longitude, created_at
    ) VALUES (
        gen_random_uuid(),
        host2_id,
        '5v5 Morning Run',
        locations[5],
        NOW() + INTERVAL '1 day' + INTERVAL '8 hours',
        '5v5',
        'Casual',
        'Free',
        12,
        'open',
        'Early morning run. Great way to start the day!',
        'Be on time or lose your spot. No shows will be marked absent.',
        gradients[5],
        14.5764, 120.9851,
        NOW() - INTERVAL '1 day'
    ) RETURNING id INTO game_id;
    
    -- Add 3 players
    FOR i IN 39..41 LOOP
        INSERT INTO game_roster (game_id, player_id, status, joined_at)
        VALUES (game_id, player_ids[i], 'joined', NOW() - ((i-38) || ' hours')::INTERVAL);
    END LOOP;
    
    RAISE NOTICE 'Created Game 5: Open game with only 3/12 players';
    
    -- Game 6: CANCELLED game (was full but got cancelled)
    INSERT INTO games (
        id, host_id, title, location, date_time, format, skill_level, cost, max_players,
        status, cancellation_reason, description, house_rules, image_gradient, latitude, longitude, created_at
    ) VALUES (
        gen_random_uuid(),
        host2_id,
        '3v3 Pickup Game',
        locations[6],
        NOW() + INTERVAL '4 days' + INTERVAL '17 hours',
        '3v3',
        'Intermediate',
        '₱50/head',
        8,
        'cancelled',
        'Venue unavailable',
        'Fast-paced 3v3 action. First to 15 wins.',
        'Call your own fouls. Play hard but fair.',
        gradients[6],
        14.5764, 121.0851,
        NOW() - INTERVAL '2 days'
    ) RETURNING id INTO game_id;
    
    -- Add 8 players (they joined before cancellation)
    FOR i IN 42..49 LOOP
        INSERT INTO game_roster (game_id, player_id, status, joined_at)
        VALUES (game_id, player_ids[i], 'joined', NOW() - INTERVAL '3 days' - (i || ' hours')::INTERVAL);
    END LOOP;
    
    RAISE NOTICE 'Created Game 6: Cancelled game (was 8/8)';
    
    -- Game 7: OPEN game happening today (6/10 players)
    INSERT INTO games (
        id, host_id, title, location, date_time, format, skill_level, cost, max_players,
        status, description, house_rules, image_gradient, latitude, longitude, created_at
    ) VALUES (
        gen_random_uuid(),
        host2_id,
        '5v5 Serious Runs Only',
        locations[7],
        NOW() + INTERVAL '6 hours',
        '5v5',
        'Competitive',
        '₱100/head',
        10,
        'open',
        'High-intensity competitive run. Bring your A-game.',
        'No excuses. Play defense. Communicate.',
        gradients[7],
        14.6091, 121.0794,
        NOW() - INTERVAL '2 days'
    ) RETURNING id INTO game_id;
    
    -- Add 6 players
    FOR i IN 50..55 LOOP
        INSERT INTO game_roster (game_id, player_id, status, joined_at)
        VALUES (game_id, player_ids[i], 'joined', NOW() - ((56-i) || ' hours')::INTERVAL);
    END LOOP;
    
    RAISE NOTICE 'Created Game 7: Open game happening today (6/10 players)';
    
    -- Game 8: COMPLETED game from last week (mixed attendance)
    INSERT INTO games (
        id, host_id, title, location, date_time, format, skill_level, cost, max_players,
        status, description, house_rules, image_gradient, latitude, longitude, created_at
    ) VALUES (
        gen_random_uuid(),
        host2_id,
        '5v5 Draft Night',
        locations[8],
        NOW() - INTERVAL '7 days',
        '5v5',
        'Elite',
        '₱150/head',
        12,
        'completed',
        'Elite draft-style game. Captains will pick teams.',
        'Respect the game. Play hard. Have fun.',
        gradients[8],
        14.6091, 121.0794,
        NOW() - INTERVAL '14 days'
    ) RETURNING id INTO game_id;
    
    -- Add 10 players (9 checked in, 1 absent)
    FOR i IN 56..58 LOOP
        INSERT INTO game_roster (game_id, player_id, status, joined_at)
        VALUES (game_id, player_ids[i], 'checked_in', NOW() - INTERVAL '8 days' - (i || ' hours')::INTERVAL);
    END LOOP;
    
    -- Use some earlier players too
    FOR i IN 1..6 LOOP
        INSERT INTO game_roster (game_id, player_id, status, joined_at)
        VALUES (game_id, player_ids[i], 'checked_in', NOW() - INTERVAL '8 days' - (i || ' hours')::INTERVAL);
    END LOOP;
    
    -- Add 1 absent player
    INSERT INTO game_roster (game_id, player_id, status, joined_at)
    VALUES (game_id, player_ids[7], 'absent', NOW() - INTERVAL '8 days');
    
    RAISE NOTICE 'Created Game 8: Completed game with 9 checked in, 1 absent';
    
    RAISE NOTICE 'Successfully created all 8 games!';
END $$;

-- ================================================
-- UPDATE CURRENT PLAYERS COUNT
-- ================================================
UPDATE games g SET current_players = (
    SELECT COUNT(*) FROM game_roster r 
    WHERE r.game_id = g.id AND r.status IN ('joined', 'checked_in')
);

-- Update full status for games at capacity
UPDATE games SET status = 'full' 
WHERE status = 'open' AND current_players >= max_players;

-- ================================================
-- SUMMARY STATISTICS
-- ================================================
DO $$
DECLARE
    total_users INT;
    total_hosts INT;
    total_players INT;
    total_games INT;
    open_games INT;
    full_games INT;
    completed_games INT;
    cancelled_games INT;
    total_roster INT;
    joined_count INT;
    waitlist_count INT;
    checkedin_count INT;
    absent_count INT;
BEGIN
    SELECT COUNT(*) INTO total_users FROM profiles WHERE username LIKE 'host%' OR username LIKE 'testuser%';
    SELECT COUNT(*) INTO total_hosts FROM profiles WHERE username LIKE 'host%';
    SELECT COUNT(*) INTO total_players FROM profiles WHERE username LIKE 'testuser%';
    SELECT COUNT(*) INTO total_games FROM games WHERE host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%');
    SELECT COUNT(*) INTO open_games FROM games WHERE status = 'open' AND host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%');
    SELECT COUNT(*) INTO full_games FROM games WHERE status = 'full' AND host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%');
    SELECT COUNT(*) INTO completed_games FROM games WHERE status = 'completed' AND host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%');
    SELECT COUNT(*) INTO cancelled_games FROM games WHERE status = 'cancelled' AND host_id IN (SELECT id FROM profiles WHERE username LIKE 'host%');
    SELECT COUNT(*) INTO total_roster FROM game_roster;
    SELECT COUNT(*) INTO joined_count FROM game_roster WHERE status = 'joined';
    SELECT COUNT(*) INTO waitlist_count FROM game_roster WHERE status = 'waitlist';
    SELECT COUNT(*) INTO checkedin_count FROM game_roster WHERE status = 'checked_in';
    SELECT COUNT(*) INTO absent_count FROM game_roster WHERE status = 'absent';
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'TEST DATA SUMMARY';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total Users: %', total_users;
    RAISE NOTICE '  - Hosts: %', total_hosts;
    RAISE NOTICE '  - Players: %', total_players;
    RAISE NOTICE '';
    RAISE NOTICE 'Total Games: %', total_games;
    RAISE NOTICE '  - Open: %', open_games;
    RAISE NOTICE '  - Full: %', full_games;
    RAISE NOTICE '  - Completed: %', completed_games;
    RAISE NOTICE '  - Cancelled: %', cancelled_games;
    RAISE NOTICE '';
    RAISE NOTICE 'Total Roster Entries: %', total_roster;
    RAISE NOTICE '  - Joined: %', joined_count;
    RAISE NOTICE '  - Waitlist: %', waitlist_count;
    RAISE NOTICE '  - Checked In: %', checkedin_count;
    RAISE NOTICE '  - Absent: %', absent_count;
    RAISE NOTICE '========================================';
END $$;

-- ================================================
-- DISPLAY GAME DETAILS
-- ================================================
SELECT 
    g.title,
    g.status,
    g.format,
    g.skill_level,
    g.current_players || '/' || g.max_players as "Players",
    TO_CHAR(g.date_time, 'Mon DD, HH24:MI') as "Date/Time",
    p.full_name as "Host",
    g.cost,
    COALESCE(
        (SELECT COUNT(*) FROM game_roster WHERE game_id = g.id AND status = 'waitlist'),
        0
    ) as "Waitlist"
FROM games g
JOIN profiles p ON g.host_id = p.id
WHERE p.username LIKE 'host%'
ORDER BY g.date_time;
