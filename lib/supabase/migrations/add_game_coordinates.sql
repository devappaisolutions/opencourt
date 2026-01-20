-- Add latitude and longitude columns to games table
-- This will allow games to have accurate map positions

ALTER TABLE games 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8);

-- Add a comment to explain these columns
COMMENT ON COLUMN games.latitude IS 'Latitude coordinate for game location (-90 to 90)';
COMMENT ON COLUMN games.longitude IS 'Longitude coordinate for game location (-180 to 180)';

-- Optional: Add a check constraint to ensure valid coordinates
ALTER TABLE games
ADD CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90),
ADD CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180);

-- Example: Update existing games with San Pablo coordinates (optional)
-- UPDATE games SET latitude = 14.0693, longitude = 121.3265 WHERE latitude IS NULL;
