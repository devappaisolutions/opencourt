-- Migration: Add extended fields to games table
-- Run this in your Supabase SQL Editor

-- Add description column for game details
ALTER TABLE games ADD COLUMN IF NOT EXISTS description text;

-- Add house rules column
ALTER TABLE games ADD COLUMN IF NOT EXISTS house_rules text;

-- Add age range filter column (no constraint, allow any value)
ALTER TABLE games ADD COLUMN IF NOT EXISTS age_range text;

-- Add gender filter column (no constraint, allow any value)  
ALTER TABLE games ADD COLUMN IF NOT EXISTS gender_filter text;

-- Add latitude/longitude for location-based features (optional)
ALTER TABLE games ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE games ADD COLUMN IF NOT EXISTS longitude double precision;

-- Add cancellation reason column
ALTER TABLE games ADD COLUMN IF NOT EXISTS cancellation_reason text;

-- If you already have constraints, drop them first:
-- ALTER TABLE games DROP CONSTRAINT IF EXISTS games_gender_filter_check;
-- ALTER TABLE games DROP CONSTRAINT IF EXISTS games_age_range_check;
