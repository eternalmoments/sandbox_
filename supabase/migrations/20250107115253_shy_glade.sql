/*
  # Initial Schema Setup

  1. Tables
    - `profiles` (extends auth.users)
      - `id` (uuid, references auth.users)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `sites`
      - `id` (uuid)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `meeting_date` (timestamp)
      - `theme` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `photos`
      - `id` (uuid)
      - `site_id` (uuid, references sites)
      - `url` (text)
      - `caption` (text)
      - `created_at` (timestamp)

    - `messages`
      - `id` (uuid)
      - `site_id` (uuid, references sites)
      - `content` (text)
      - `position_x` (float)
      - `position_y` (float)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  meeting_date TIMESTAMPTZ NOT NULL,
  theme TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites ON DELETE CASCADE,
  content TEXT NOT NULL,
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own sites" ON sites
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sites" ON sites
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sites" ON sites
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON sites
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view photos of their sites" ON photos
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM sites WHERE id = photos.site_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage photos of their sites" ON photos
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM sites WHERE id = photos.site_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can view messages of their sites" ON messages
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM sites WHERE id = messages.site_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage messages of their sites" ON messages
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM sites WHERE id = messages.site_id AND user_id = auth.uid()
  ));

-- Create trigger for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();