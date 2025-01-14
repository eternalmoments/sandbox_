/*
  # Add star chart URL column to sites table

  1. Changes
    - Add star_chart_url column to store the astronomy API generated image
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sites' AND column_name = 'star_chart_url'
  ) THEN
    ALTER TABLE sites 
    ADD COLUMN star_chart_url TEXT;
  END IF;
END $$;