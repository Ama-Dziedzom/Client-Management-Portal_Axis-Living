-- Axis Living Website CMS Tables
-- Run this in the Supabase SQL editor

-- Portfolio projects
create table if not exists website_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category text,
  images text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Journal posts
create table if not exists website_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text,
  cover_image text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pricing packages
create table if not exists website_pricing (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric,
  currency text not null default 'GHS',
  description text,
  features text[] not null default '{}',
  highlighted boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Testimonials
create table if not exists website_testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quote text not null,
  project text,
  avatar_url text,
  featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Site-wide settings (key/value store)
create table if not exists website_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  updated_at timestamptz not null default now()
);

-- Lookbooks
create table if not exists website_lookbooks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  file_url text not null,
  thumbnail_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Auto-update updated_at on website_projects
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger website_projects_updated_at
  before update on website_projects
  for each row execute function update_updated_at();

create trigger website_posts_updated_at
  before update on website_posts
  for each row execute function update_updated_at();

-- Seed default settings keys
insert into website_settings (key, value) values
  ('contact_email', null),
  ('contact_phone', null),
  ('contact_address', null),
  ('instagram_url', null),
  ('facebook_url', null),
  ('twitter_url', null),
  ('pinterest_url', null),
  ('tagline', null)
on conflict (key) do nothing;
