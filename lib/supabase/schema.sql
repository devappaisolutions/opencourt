-- ================================================
-- OpenCourt Database Schema
-- Run this script to create/reset the full database structure.
-- Safe to re-run: uses IF NOT EXISTS and DROP POLICY IF EXISTS.
-- ================================================


-- ================================================
-- PROFILES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  instagram_handle TEXT,
  position TEXT CHECK (position IN (
    'Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center',
    'Guard', 'Forward', 'Big Man'
  )),
  height_ft INT,
  height_in INT,
  skill_level TEXT CHECK (skill_level IN (
    'Beginner', 'Casual', 'Competitive', 'Elite'
  )),
  reliability_score INT DEFAULT 100,

  -- Honest self-reported average stats
  avg_points INT DEFAULT 0 CHECK (avg_points >= 0 AND avg_points <= 100),
  avg_rebounds INT DEFAULT 0 CHECK (avg_rebounds >= 0 AND avg_rebounds <= 50),
  avg_assists INT DEFAULT 0 CHECK (avg_assists >= 0 AND avg_assists <= 50),
  avg_steals INT DEFAULT 0 CHECK (avg_steals >= 0 AND avg_steals <= 20),
  avg_blocks INT DEFAULT 0 CHECK (avg_blocks >= 0 AND avg_blocks <= 20),
  avg_turnovers INT DEFAULT 0 CHECK (avg_turnovers >= 0 AND avg_turnovers <= 20),

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE USING (auth.uid() = id);


-- ================================================
-- GAMES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  title TEXT NOT NULL,
  location TEXT NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Accepted formats and skill levels (includes legacy values for backwards compatibility)
  format TEXT CHECK (format IN (
    'Full Court (with Ref)', 'Full Court',
    '3v3', '4v4', '5v5', 'Drills'
  )) NOT NULL,
  skill_level TEXT CHECK (skill_level IN (
    'Open run', 'Papawis', 'Tito Gaming', 'Dayo', 'Malakasan', 'Elite',
    'Casual', 'Intermediate', 'Competitive'
  )) NOT NULL,

  cost TEXT DEFAULT 'Free',
  max_players INT DEFAULT 10,
  current_players INT DEFAULT 0,

  status TEXT DEFAULT 'open', -- open, full, cancelled, completed
  cancellation_reason TEXT,

  description TEXT,
  house_rules TEXT,
  age_range TEXT,
  gender_filter TEXT,

  -- Coordinates for map
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  image_gradient TEXT, -- CSS class string for card background

  -- Team generation
  teams_generated BOOLEAN DEFAULT FALSE,
  teams_generated_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Games are viewable by everyone." ON games;
CREATE POLICY "Games are viewable by everyone."
  ON games FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Authenticated users can create games." ON games;
CREATE POLICY "Authenticated users can create games."
  ON games FOR INSERT WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Hosts can update their own games." ON games;
CREATE POLICY "Hosts can update their own games."
  ON games FOR UPDATE USING (auth.uid() = host_id);


-- ================================================
-- GAME ROSTER TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS game_roster (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES profiles(id) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'joined', -- joined, waitlist, checked_in, absent

  UNIQUE(game_id, player_id)
);

ALTER TABLE game_roster ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Rosters are viewable by everyone." ON game_roster;
CREATE POLICY "Rosters are viewable by everyone."
  ON game_roster FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Players can join games (insert self)." ON game_roster;
CREATE POLICY "Players can join games (insert self)."
  ON game_roster FOR INSERT WITH CHECK (auth.uid() = player_id);

DROP POLICY IF EXISTS "Players can leave games (delete self)." ON game_roster;
CREATE POLICY "Players can leave games (delete self)."
  ON game_roster FOR DELETE USING (auth.uid() = player_id);

DROP POLICY IF EXISTS "Hosts can update roster status." ON game_roster;
CREATE POLICY "Hosts can update roster status."
  ON game_roster FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT host_id FROM games WHERE id = game_id
    )
  );


-- ================================================
-- TEAM ASSIGNMENTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS team_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES profiles(id) NOT NULL,
  team_number INT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES profiles(id),

  UNIQUE(game_id, player_id)
);

ALTER TABLE team_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team assignments are viewable by everyone" ON team_assignments;
CREATE POLICY "Team assignments are viewable by everyone"
  ON team_assignments FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Hosts can manage team assignments" ON team_assignments;
CREATE POLICY "Hosts can manage team assignments"
  ON team_assignments FOR ALL
  USING (
    auth.uid() IN (
      SELECT host_id FROM games WHERE id = game_id
    )
  );


-- ================================================
-- GAME STATS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS game_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES profiles(id) NOT NULL,

  points INT DEFAULT 0 CHECK (points >= 0 AND points <= 100),
  rebounds INT DEFAULT 0 CHECK (rebounds >= 0 AND rebounds <= 50),
  assists INT DEFAULT 0 CHECK (assists >= 0 AND assists <= 50),
  steals INT DEFAULT 0 CHECK (steals >= 0 AND steals <= 20),
  blocks INT DEFAULT 0 CHECK (blocks >= 0 AND blocks <= 20),
  turnovers INT DEFAULT 0 CHECK (turnovers >= 0 AND turnovers <= 20),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(game_id, player_id)
);

ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Game stats are viewable by everyone" ON game_stats;
CREATE POLICY "Game stats are viewable by everyone"
  ON game_stats FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Players can insert their own stats for completed games" ON game_stats;
CREATE POLICY "Players can insert their own stats for completed games"
  ON game_stats FOR INSERT
  WITH CHECK (
    auth.uid() = player_id AND
    EXISTS (
      SELECT 1 FROM games
      WHERE id = game_id AND status = 'completed'
    ) AND
    EXISTS (
      SELECT 1 FROM game_roster
      WHERE game_id = game_stats.game_id
        AND player_id = game_stats.player_id
        AND status = 'checked_in'
    )
  );

DROP POLICY IF EXISTS "Players can update their own stats" ON game_stats;
CREATE POLICY "Players can update their own stats"
  ON game_stats FOR UPDATE USING (auth.uid() = player_id);


-- ================================================
-- AUTO-CREATE PROFILE ON NEW USER SIGNUP
-- Fires on every INSERT into auth.users (email, OAuth, etc.)
-- ================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, updated_at)
  VALUES (
    NEW.id,
    -- Derive a username from the email prefix, replace special chars with '_'
    REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g'),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ================================================
-- ================================================
-- AUTO-UPDATE current_players ON ROSTER CHANGES
-- Fires after INSERT or DELETE on game_roster
-- ================================================
CREATE OR REPLACE FUNCTION sync_current_players()
RETURNS TRIGGER AS $$
DECLARE
  target_game_id UUID;
BEGIN
  -- Determine which game was affected
  IF TG_OP = 'DELETE' THEN
    target_game_id := OLD.game_id;
  ELSE
    target_game_id := NEW.game_id;
  END IF;

  -- Recalculate and update
  UPDATE games
  SET current_players = (
    SELECT COUNT(*)
    FROM game_roster
    WHERE game_id = target_game_id
      AND status IN ('joined', 'checked_in')
  )
  WHERE id = target_game_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_roster_change_sync_players ON game_roster;
CREATE TRIGGER on_roster_change_sync_players
  AFTER INSERT OR DELETE OR UPDATE OF status ON game_roster
  FOR EACH ROW
  EXECUTE FUNCTION sync_current_players();

-- RELIABILITY SCORE TRIGGER
-- ================================================
CREATE OR REPLACE FUNCTION update_reliability_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Marked ABSENT → penalty
  IF NEW.status = 'absent' AND OLD.status != 'absent' THEN
    UPDATE profiles
    SET reliability_score = GREATEST(0, reliability_score - 10)
    WHERE id = NEW.player_id;

  -- Marked CHECKED_IN → reward
  ELSIF NEW.status = 'checked_in' AND OLD.status != 'checked_in' THEN
    UPDATE profiles
    SET reliability_score = LEAST(100, reliability_score + 2)
    WHERE id = NEW.player_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_roster_status_change ON game_roster;
CREATE TRIGGER on_roster_status_change
  AFTER UPDATE OF status ON game_roster
  FOR EACH ROW
  EXECUTE FUNCTION update_reliability_score();


-- ================================================
-- INDEXES
-- ================================================
CREATE INDEX IF NOT EXISTS idx_games_date_time ON games(date_time);
CREATE INDEX IF NOT EXISTS idx_games_host_id ON games(host_id);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_game_roster_game_id ON game_roster(game_id);
CREATE INDEX IF NOT EXISTS idx_game_roster_player_id ON game_roster(player_id);
CREATE INDEX IF NOT EXISTS idx_team_assignments_game_id ON team_assignments(game_id);
CREATE INDEX IF NOT EXISTS idx_team_assignments_player_id ON team_assignments(player_id);
CREATE INDEX IF NOT EXISTS idx_game_stats_game_id ON game_stats(game_id);
CREATE INDEX IF NOT EXISTS idx_game_stats_player_id ON game_stats(player_id);


-- ================================================
-- TABLE COMMENTS
-- ================================================
COMMENT ON TABLE profiles IS 'User profiles with basketball-specific information';
COMMENT ON TABLE games IS 'Basketball games/runs hosted by users';
COMMENT ON TABLE game_roster IS 'Players who have joined games';
COMMENT ON TABLE team_assignments IS 'Team assignments for balanced matchups';
COMMENT ON TABLE game_stats IS 'Player statistics for completed games';
COMMENT ON COLUMN profiles.reliability_score IS 'Player reliability score (0-100), affected by attendance';
COMMENT ON COLUMN games.latitude IS 'Latitude coordinate for game location (-90 to 90)';
COMMENT ON COLUMN games.longitude IS 'Longitude coordinate for game location (-180 to 180)';
