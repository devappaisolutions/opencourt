-- 0. SCHEMA UPDATES
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_handle text;

-- 1. HOST UPDATE POLICY
-- Allow hosts to update roster status for their games
CREATE POLICY "Hosts can update roster status."
  ON game_roster FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_roster.game_id
      AND games.host_id = auth.uid()
    )
  );

-- 2. AUTO-UPDATE CURRENT PLAYERS TRIGGER
-- Function to sync current_players count
CREATE OR REPLACE FUNCTION update_game_player_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.status = 'joined') THEN
      UPDATE games 
      SET current_players = current_players + 1
      WHERE id = NEW.game_id;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF (OLD.status = 'joined' OR OLD.status = 'checked_in') THEN
      UPDATE games 
      SET current_players = current_players - 1
      WHERE id = OLD.game_id;
    END IF;
  ELSIF (TG_OP = 'UPDATE') THEN
    -- If status moves from waitlist to joined
    IF (OLD.status = 'waitlist' AND NEW.status = 'joined') THEN
      UPDATE games 
      SET current_players = current_players + 1
      WHERE id = NEW.game_id;
    -- If status moves from joined/checked_in to absent/waitlist
    ELSIF ((OLD.status = 'joined' OR OLD.status = 'checked_in') AND (NEW.status = 'absent' OR NEW.status = 'waitlist')) THEN
      UPDATE games 
      SET current_players = current_players - 1
      WHERE id = NEW.game_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_game_player_count
AFTER INSERT OR DELETE OR UPDATE OF status ON game_roster
FOR EACH ROW EXECUTE FUNCTION update_game_player_count();

-- 3. RELIABILITY SCORE TRIGGER
-- Function to adjust reliability score based on status
CREATE OR REPLACE FUNCTION update_player_reliability()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.status = 'checked_in' AND OLD.status != 'checked_in') THEN
    UPDATE profiles
    SET reliability_score = LEAST(100, reliability_score + 1)
    WHERE id = NEW.player_id;
  ELSIF (NEW.status = 'absent' AND OLD.status != 'absent') THEN
    UPDATE profiles
    SET reliability_score = GREATEST(0, reliability_score - 5)
    WHERE id = NEW.player_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_player_reliability
AFTER UPDATE OF status ON game_roster
FOR EACH ROW EXECUTE FUNCTION update_player_reliability();

-- 4. AUTO-WAITLIST TRIGGER (Optional logic for join)
-- This logic might be better in the application layer if we want to show a "Join Waitlist" button
-- But here is how it would look in the DB:
CREATE OR REPLACE FUNCTION handle_game_join()
RETURNS TRIGGER AS $$
DECLARE
  v_max_players int;
  v_current_players int;
BEGIN
  SELECT max_players, current_players INTO v_max_players, v_current_players
  FROM games WHERE id = NEW.game_id;

  IF v_current_players >= v_max_players THEN
    NEW.status := 'waitlist';
  ELSE
    NEW.status := 'joined';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Uncomment the following line if you want the DB to decide joined vs waitlist automatically
-- CREATE TRIGGER tr_handle_game_join
-- BEFORE INSERT ON game_roster
-- FOR EACH ROW EXECUTE FUNCTION handle_game_join();

-- 5. WAITLIST AUTO-PROMOTION
-- Function to promote the next person on the waitlist when a slot opens up
CREATE OR REPLACE FUNCTION promote_waitlist_player()
RETURNS TRIGGER AS $$
DECLARE
  v_next_waitlist_id uuid;
  v_current_players int;
  v_max_players int;
BEGIN
  -- Only trigger if a slot becomes available (player leaves or is marked absent)
  IF (TG_OP = 'DELETE' AND (OLD.status = 'joined' OR OLD.status = 'checked_in')) OR
     (TG_OP = 'UPDATE' AND (OLD.status = 'joined' OR OLD.status = 'checked_in') AND (NEW.status = 'absent' OR NEW.status = 'waitlist')) THEN
    
    -- Check if we have room now
    SELECT current_players, max_players INTO v_current_players, v_max_players
    FROM games WHERE id = OLD.game_id;

    -- If there's room, find the oldest waitlisted player
    IF v_current_players < v_max_players THEN
      SELECT id INTO v_next_waitlist_id
      FROM game_roster
      WHERE game_id = OLD.game_id AND status = 'waitlist'
      ORDER BY joined_at ASC
      LIMIT 1;

      -- If we found someone, promote them
      IF v_next_waitlist_id IS NOT NULL THEN
        UPDATE game_roster
        SET status = 'joined'
        WHERE id = v_next_waitlist_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_promote_waitlist_player
AFTER DELETE OR UPDATE OF status ON game_roster
FOR EACH ROW EXECUTE FUNCTION promote_waitlist_player();
