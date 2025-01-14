/*
  # Add address column to sites table

  1. Changes
    - Add address column to sites table
    - Add latitude and longitude columns for storing coordinates
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sites' AND column_name = 'address'
  ) THEN
    ALTER TABLE sites 
    ADD COLUMN address TEXT,
    ADD COLUMN latitude DECIMAL(10, 8),
    ADD COLUMN longitude DECIMAL(11, 8);
  END IF;
END $$;