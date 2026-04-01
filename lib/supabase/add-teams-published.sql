-- ================================================
-- Migration: Add teams_published to games table
-- Run this in the Supabase SQL Editor. Safe to re-run.
-- ================================================

ALTER TABLE games
  ADD COLUMN IF NOT EXISTS teams_published BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS teams_published_at TIMESTAMP WITH TIME ZONE;

-- Update team_assignments RLS:
-- Non-hosts can only see assignments when teams_published = TRUE on the game.
-- Hosts can always see their own game's assignments.

DROP POLICY IF EXISTS "Team assignments are viewable by everyone" ON team_assignments;

CREATE POLICY "Team assignments viewable when published or by host"
  ON team_assignments FOR SELECT
  USING (
    auth.uid() IN (SELECT host_id FROM games WHERE id = game_id)
    OR EXISTS (
      SELECT 1 FROM games
      WHERE id = game_id AND teams_published = TRUE
    )
  );
