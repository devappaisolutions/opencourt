-- Add instagram_handle to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS instagram_handle text;

-- Optional: Add a check constraint if we want to enforce format, but simple text is fine for MVP
-- ALTER TABLE profiles ADD CONSTRAINT proper_handle CHECK (instagram_handle ~* '^@?[a-zA-Z0-9._]+$');
