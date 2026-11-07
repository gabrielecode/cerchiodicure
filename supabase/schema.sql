-- Setup base tables for "Cerchio di Cura"

-- 1. CIRCLES
CREATE TABLE circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_name TEXT NOT NULL,
    invite_code TEXT UNIQUE NOT NULL CHECK (char_length(invite_code) = 6),
    created_by UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CIRCLE MEMBERS
CREATE TABLE circle_members (
    circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL,
    PRIMARY KEY (circle_id, user_id)
);

-- 3. ENTITIES (one for each type in types.ts)

-- Posts (Timeline)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    timestamp TIMESTAMPTZ DEFAULT now(),
    type TEXT NOT NULL, -- 'pill' | 'calendar' | 'note' | 'food' | 'photo'
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    image_url TEXT
);

-- Events (Calendar)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    member_name TEXT NOT NULL,
    member_avatar TEXT,
    type TEXT NOT NULL, -- 'turno' | 'appuntamento'
    status TEXT NOT NULL, -- 'attesa' | 'completato'
    notes TEXT
);

-- Medications (Farmaci)
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    times TEXT[] NOT NULL,
    responsible TEXT NOT NULL,
    checks JSONB DEFAULT '{}'::jsonb
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    title TEXT NOT NULL,
    date TEXT NOT NULL, -- types.ts uses string 'DD.MM.YYYY'
    author TEXT NOT NULL,
    file_size TEXT NOT NULL,
    file_type TEXT NOT NULL
);

-- Meals
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    day TEXT NOT NULL,
    lunch JSONB NOT NULL, -- {dish, provider, status}
    dinner JSONB NOT NULL -- {dish, provider, status}
);

-- Dietary Notes
CREATE TABLE dietary_notes (
    circle_id UUID PRIMARY KEY REFERENCES circles(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    notes TEXT NOT NULL
);

-- 4. HELPER FUNCTIONS

-- Check if user is member of a circle
CREATE OR REPLACE FUNCTION is_circle_member(check_circle_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM circle_members 
    WHERE circle_id = check_circle_id 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- RPC to join a circle via invite code
CREATE OR REPLACE FUNCTION join_circle(code TEXT, display_name TEXT, user_role TEXT)
RETURNS VOID AS $$
DECLARE
  target_circle_id UUID;
BEGIN
  SELECT id INTO target_circle_id FROM circles WHERE invite_code = code;
  
  IF target_circle_id IS NULL THEN
    RAISE EXCEPTION 'Codice invito non valido';
  END IF;

  INSERT INTO circle_members (circle_id, user_id, display_name, role)
  VALUES (target_circle_id, auth.uid(), display_name, user_role)
  ON CONFLICT (circle_id, user_id) DO UPDATE 
  SET display_name = EXCLUDED.display_name, role = EXCLUDED.role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to automatically add creator to circle_members
CREATE OR REPLACE FUNCTION handle_new_circle()
RETURNS TRIGGER AS $$
BEGIN
  -- We don't have the user's preferred display_name here easily without passing it,
  -- so we might need a separate call or a default. 
  -- For now, let's assume the app will handle the first member insert manually or we use a placeholder.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. RLS POLICIES

-- Enable RLS
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_notes ENABLE ROW LEVEL SECURITY;

-- Circles Policies
DROP POLICY IF EXISTS "Users can view circles they belong to" ON circles;
CREATE POLICY "Users can view circles they belong to" ON circles
FOR SELECT USING (created_by = auth.uid() OR is_circle_member(id));

CREATE POLICY "Authenticated users can create circles" 
ON circles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Members can update circle info" 
ON circles FOR UPDATE USING (is_circle_member(id));

-- Circle Members Policies
CREATE POLICY "Members can view other members of the same circle" 
ON circle_members FOR SELECT USING (is_circle_member(circle_id));

DROP POLICY IF EXISTS "Users can add themselves via RPC (join_circle)" ON circle_members;
CREATE POLICY "Creator can add self to own circle" ON circle_members
FOR INSERT WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (SELECT 1 FROM circles c WHERE c.id = circle_id AND c.created_by = auth.uid())
);

CREATE POLICY "Members can remove members or leave" ON circle_members
FOR DELETE USING (is_circle_member(circle_id));

-- Entity Policies (Shared Pattern)
-- All members of a circle can SELECT, INSERT, UPDATE, DELETE data in that circle

-- Posts
CREATE POLICY "Circle members can manage posts" ON posts
FOR ALL USING (is_circle_member(circle_id)) WITH CHECK (is_circle_member(circle_id));

-- Events
CREATE POLICY "Circle members can manage events" ON events
FOR ALL USING (is_circle_member(circle_id)) WITH CHECK (is_circle_member(circle_id));

-- Medications
CREATE POLICY "Circle members can manage medications" ON medications
FOR ALL USING (is_circle_member(circle_id)) WITH CHECK (is_circle_member(circle_id));

-- Documents
CREATE POLICY "Circle members can manage documents" ON documents
FOR ALL USING (is_circle_member(circle_id)) WITH CHECK (is_circle_member(circle_id));

-- Meals
CREATE POLICY "Circle members can manage meals" ON meals
FOR ALL USING (is_circle_member(circle_id)) WITH CHECK (is_circle_member(circle_id));

-- Dietary Notes
CREATE POLICY "Circle members can manage dietary notes" ON dietary_notes
FOR ALL USING (is_circle_member(circle_id)) WITH CHECK (is_circle_member(circle_id));
