-- ─────────────────────────────────────────────────────────────────
-- Auto-delete team_assignments when a player is removed from game_roster
-- (covers player self-leave AND host kick in one place)
-- SECURITY DEFINER lets the trigger run as the DB owner, bypassing RLS
-- ─────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION delete_team_assignment_on_roster_delete()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM team_assignments
    WHERE game_id = OLD.game_id
      AND player_id = OLD.player_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_roster_delete_cleanup_team ON game_roster;
CREATE TRIGGER on_roster_delete_cleanup_team
    AFTER DELETE ON game_roster
    FOR EACH ROW EXECUTE FUNCTION delete_team_assignment_on_roster_delete();

-- Allow players to delete their own team assignment (client-side fallback)
DROP POLICY IF EXISTS "Players can remove own team assignment" ON team_assignments;
CREATE POLICY "Players can remove own team assignment"
    ON team_assignments FOR DELETE
    USING (auth.uid() = player_id);
