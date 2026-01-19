-- 1. Enable RLS for Updating Roster
-- Allow Hosts to update the status (e.g., mark absent/checked_in) for their own games
CREATE POLICY "Hosts can update roster status."
  ON game_roster
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT host_id FROM games WHERE id = game_id
    )
  );

-- 2. Reliability Score Logic
-- Function to adjust score based on status change
CREATE OR REPLACE FUNCTION update_reliability_score()
RETURNS TRIGGER AS $$
BEGIN
  -- If marked ABSENT (Penalty)
  IF NEW.status = 'absent' AND OLD.status != 'absent' THEN
    UPDATE profiles
    SET reliability_score = GREATEST(0, reliability_score - 10)
    WHERE id = NEW.player_id;
  
  -- If marked CHECKED_IN (Reward)
  ELSIF NEW.status = 'checked_in' AND OLD.status != 'checked_in' THEN
    UPDATE profiles
    SET reliability_score = LEAST(100, reliability_score + 2)
    WHERE id = NEW.player_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function
DROP TRIGGER IF EXISTS on_roster_status_change ON game_roster;
CREATE TRIGGER on_roster_status_change
  AFTER UPDATE OF status ON game_roster
  FOR EACH ROW
  EXECUTE FUNCTION update_reliability_score();
