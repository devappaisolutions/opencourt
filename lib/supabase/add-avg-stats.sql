-- ================================================
-- Migration: Add honest average stats columns to profiles
-- Run this in the Supabase SQL Editor to add the new columns.
-- Safe to re-run: uses IF NOT EXISTS via DO block.
-- ================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avg_points') THEN
    ALTER TABLE profiles ADD COLUMN avg_points INT DEFAULT 0 CHECK (avg_points >= 0 AND avg_points <= 100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avg_rebounds') THEN
    ALTER TABLE profiles ADD COLUMN avg_rebounds INT DEFAULT 0 CHECK (avg_rebounds >= 0 AND avg_rebounds <= 50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avg_assists') THEN
    ALTER TABLE profiles ADD COLUMN avg_assists INT DEFAULT 0 CHECK (avg_assists >= 0 AND avg_assists <= 50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avg_steals') THEN
    ALTER TABLE profiles ADD COLUMN avg_steals INT DEFAULT 0 CHECK (avg_steals >= 0 AND avg_steals <= 20);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avg_blocks') THEN
    ALTER TABLE profiles ADD COLUMN avg_blocks INT DEFAULT 0 CHECK (avg_blocks >= 0 AND avg_blocks <= 20);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avg_turnovers') THEN
    ALTER TABLE profiles ADD COLUMN avg_turnovers INT DEFAULT 0 CHECK (avg_turnovers >= 0 AND avg_turnovers <= 20);
  END IF;
END $$;

-- Verify columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name LIKE 'avg_%'
ORDER BY column_name;
