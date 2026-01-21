-- ================================================
-- OpenCourt Database Schema
-- Complete database creation script
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
  position TEXT CHECK (position IN ('Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center', 'Guard', 'Forward', 'Big Man')),
  height_ft INT,
  height_in INT,
  skill_level TEXT CHECK (skill_level IN ('Beginner', 'Casual', 'Competitive', 'Elite')),
  reliability_score INT DEFAULT 100,
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

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
  
  format TEXT CHECK (format IN ('3v3', '4v4', '5v5', 'Drills')) NOT NULL,
  skill_level TEXT CHECK (skill_level IN ('Casual', 'Intermediate', 'Competitive', 'Elite')) NOT NULL,
  
  cost TEXT DEFAULT 'Free',
  max_players INT DEFAULT 10,
  current_players INT DEFAULT 0,
  
  status TEXT DEFAULT 'open', -- open, full, cancelled, completed
  cancellation_reason TEXT,
  
  -- Extended fields
  description TEXT,
  house_rules TEXT,
  age_range TEXT,
  gender_filter TEXT,
  
  -- Coordinates for map
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  image_gradient TEXT, -- CSS class string for card background
  
  CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

-- Games RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Games are viewable by everyone."
  ON games FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can create games."
  ON games FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own games."
  ON games FOR UPDATE
  USING (auth.uid() = host_id);

-- ================================================
-- GAME ROSTER TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS game_roster (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES profiles(id) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'joined', -- joined, waitlist, checked_in, absent
  
  UNIQUE(game_id, player_id) -- Prevent double joining
);

-- Game Roster RLS
ALTER TABLE game_roster ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rosters are viewable by everyone."
  ON game_roster FOR SELECT
  USING (TRUE);

CREATE POLICY "Players can join games (insert self)."
  ON game_roster FOR INSERT
  WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Players can leave games (delete self)."
  ON game_roster FOR DELETE
  USING (auth.uid() = player_id);

CREATE POLICY "Hosts can update roster status."
  ON game_roster FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT host_id FROM games WHERE id = game_id
    )
  );

-- ================================================
-- USUAL COURTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS usual_courts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usual Courts RLS
ALTER TABLE usual_courts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own courts."
  ON usual_courts FOR SELECT
  USING (auth.uid() = host_id);

CREATE POLICY "Users can insert their own courts."
  ON usual_courts FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can delete their own courts."
  ON usual_courts FOR DELETE
  USING (auth.uid() = host_id);

-- ================================================
-- PEER REVIEWS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS peer_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(game_id, reviewer_id, reviewee_id)
);

-- Peer Reviews RLS
ALTER TABLE peer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone."
  ON peer_reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Players can create reviews."
  ON peer_reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- ================================================
-- RELIABILITY SYSTEM
-- ================================================

-- Function to adjust reliability score based on status change
CREATE OR REPLACE FUNCTION update_reliability_score()
RETURNS TRIGGER AS $$
BEGIN
  -- If marked ABSENT (Penalty: -10 points)
  IF NEW.status = 'absent' AND OLD.status != 'absent' THEN
    UPDATE profiles
    SET reliability_score = GREATEST(0, reliability_score - 10)
    WHERE id = NEW.player_id;
  
  -- If marked CHECKED_IN (Reward: +2 points)
  ELSIF NEW.status = 'checked_in' AND OLD.status != 'checked_in' THEN
    UPDATE profiles
    SET reliability_score = LEAST(100, reliability_score + 2)
    WHERE id = NEW.player_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the reliability score function
DROP TRIGGER IF EXISTS on_roster_status_change ON game_roster;
CREATE TRIGGER on_roster_status_change
  AFTER UPDATE OF status ON game_roster
  FOR EACH ROW
  EXECUTE FUNCTION update_reliability_score();

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

CREATE INDEX IF NOT EXISTS idx_games_date_time ON games(date_time);
CREATE INDEX IF NOT EXISTS idx_games_host_id ON games(host_id);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_game_roster_game_id ON game_roster(game_id);
CREATE INDEX IF NOT EXISTS idx_game_roster_player_id ON game_roster(player_id);
CREATE INDEX IF NOT EXISTS idx_peer_reviews_game_id ON peer_reviews(game_id);
CREATE INDEX IF NOT EXISTS idx_peer_reviews_reviewee_id ON peer_reviews(reviewee_id);

-- ================================================
-- COMMENTS
-- ================================================

COMMENT ON TABLE profiles IS 'User profiles with basketball-specific information';
COMMENT ON TABLE games IS 'Basketball games/runs hosted by users';
COMMENT ON TABLE game_roster IS 'Players who have joined games';
COMMENT ON TABLE usual_courts IS 'Frequently used court locations saved by hosts';
COMMENT ON TABLE peer_reviews IS 'Player reviews after completed games';

COMMENT ON COLUMN games.latitude IS 'Latitude coordinate for game location (-90 to 90)';
COMMENT ON COLUMN games.longitude IS 'Longitude coordinate for game location (-180 to 180)';
COMMENT ON COLUMN profiles.reliability_score IS 'Player reliability score (0-100), affected by attendance';
