-- ================================================
-- Migration: Add game_chat table for live game chat
-- Run this in the Supabase SQL Editor.
-- Safe to re-run: uses IF NOT EXISTS.
-- ================================================

CREATE TABLE IF NOT EXISTS game_chat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) >= 1 AND char_length(message) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE game_chat ENABLE ROW LEVEL SECURITY;

-- Everyone can read chat messages
DROP POLICY IF EXISTS "Chat messages are viewable by everyone" ON game_chat;
CREATE POLICY "Chat messages are viewable by everyone"
  ON game_chat FOR SELECT USING (TRUE);

-- Authenticated users can send messages (only as themselves)
DROP POLICY IF EXISTS "Authenticated users can send chat messages" ON game_chat;
CREATE POLICY "Authenticated users can send chat messages"
  ON game_chat FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages
DROP POLICY IF EXISTS "Users can delete their own messages" ON game_chat;
CREATE POLICY "Users can delete their own messages"
  ON game_chat FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_game_chat_game_id ON game_chat(game_id);
CREATE INDEX IF NOT EXISTS idx_game_chat_created_at ON game_chat(game_id, created_at);

-- Enable real-time for this table
ALTER PUBLICATION supabase_realtime ADD TABLE game_chat;

-- Verify
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'game_chat'
ORDER BY ordinal_position;
