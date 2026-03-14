-- Axis Client Portal — Complete Schema Setup
-- Run this in your Supabase SQL Editor

-- 1. Create Tables (if they don't exist)

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    location TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'on_hold', 'complete')),
    start_date TIMESTAMPTZ,
    estimated_completion TIMESTAMPTZ,
    cover_image_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Studio Users table
CREATE TABLE IF NOT EXISTS studio_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'designer' CHECK (role IN ('admin', 'designer')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timeline_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    stage_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'complete')),
    display_order INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('studio', 'client')),
    sender_name TEXT NOT NULL,
    body TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    line_items JSONB NOT NULL DEFAULT '[]',
    subtotal NUMERIC NOT NULL DEFAULT 0,
    tax_rate NUMERIC NOT NULL DEFAULT 0,
    tax_amount NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'GHS',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    due_date TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    paystack_reference TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security

ALTER TABLE studio_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for Studio Users

-- Studio users can read their own row
CREATE POLICY "Studio users can read own data" ON studio_users FOR SELECT USING (auth.uid() = id);

-- Studio users access to all tables
CREATE POLICY "Studio users can manage all clients" ON clients FOR ALL USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));
CREATE POLICY "Studio users can manage all projects" ON projects FOR ALL USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));
CREATE POLICY "Studio users can manage all timeline stages" ON timeline_stages FOR ALL USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));
CREATE POLICY "Studio users can manage all documents" ON documents FOR ALL USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));
CREATE POLICY "Studio users can manage all messages" ON messages FOR ALL USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));
CREATE POLICY "Studio users can manage all invoices" ON invoices FOR ALL USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));
CREATE POLICY "Studio users can manage all gallery" ON gallery FOR ALL USING (EXISTS (SELECT 1 FROM studio_users WHERE id = auth.uid()));

-- 4. Create RLS Policies for Clients (Basic access)
-- Note: These might already exist in your portal setup, but adding them for completeness

CREATE POLICY "Clients can read own client data" ON clients FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Clients can read own projects" ON projects FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients can read own timeline" ON timeline_stages FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid()));
CREATE POLICY "Clients can read own documents" ON documents FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid()));
CREATE POLICY "Clients can read/send own messages" ON messages FOR ALL USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid()));
CREATE POLICY "Clients can read own invoices" ON invoices FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients can read own gallery" ON gallery FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid()));
