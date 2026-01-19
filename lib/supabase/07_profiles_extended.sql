-- Migration: Add instagram_handle to profiles table
-- Run this in your Supabase SQL Editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_handle text;

-- Also add display_name if not exists (used by other parts of the app)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name text;
