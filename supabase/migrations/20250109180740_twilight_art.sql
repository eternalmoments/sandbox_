/*
  # Fix Authentication Setup

  1. Verify auth schema is enabled
  2. Add missing policies for profile management
*/

-- Ensure auth schema is enabled
CREATE SCHEMA IF NOT EXISTS auth;

-- Add insert policy for profiles
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add delete policy for profiles
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);