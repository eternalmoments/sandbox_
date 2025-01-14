-- Remove unnecessary password and email fields from profiles
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS encrypted_password,
DROP COLUMN IF EXISTS email;

-- Update handle_new_user function to be simpler and only handle necessary fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    subscription_status
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'inactive'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;