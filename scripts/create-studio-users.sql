-- Studio Users table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS studio_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'designer' CHECK (role IN ('admin', 'designer')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE studio_users ENABLE ROW LEVEL SECURITY;

-- Studio users can read their own row
CREATE POLICY "Studio users can read own data"
    ON studio_users
    FOR SELECT
    USING (auth.uid() = id);

-- Studio users can read all clients
CREATE POLICY "Studio users can read all clients"
    ON clients
    FOR SELECT
    USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));

-- Studio users can manage all projects
CREATE POLICY "Studio users can manage projects"
    ON projects
    FOR ALL
    USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));

-- Studio users can manage all timeline stages
CREATE POLICY "Studio users can manage timeline stages"
    ON timeline_stages
    FOR ALL
    USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));

-- Studio users can manage all documents
CREATE POLICY "Studio users can manage documents"
    ON documents
    FOR ALL
    USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));

-- Studio users can manage all messages
CREATE POLICY "Studio users can manage messages"
    ON messages
    FOR ALL
    USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));

-- Studio users can manage all invoices
CREATE POLICY "Studio users can manage invoices"
    ON invoices
    FOR ALL
    USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));

-- Studio users can update clients
CREATE POLICY "Studio users can update clients"
    ON clients
    FOR UPDATE
    USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));

-- Studio users can insert clients
CREATE POLICY "Studio users can insert clients"
    ON clients
    FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));
