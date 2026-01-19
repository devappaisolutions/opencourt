-- Migration: Add cancellation_reason to games table
-- Run this in your Supabase SQL Editor

ALTER TABLE games ADD COLUMN IF NOT EXISTS cancellation_reason text;
