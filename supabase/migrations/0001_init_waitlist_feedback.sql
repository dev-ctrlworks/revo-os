-- Initial schema: waitlist and feedback tables
-- Compatible with Supabase/Postgres

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  interest text,
  created_at timestamptz default now()
);

alter table waitlist enable row level security;

create policy "public insert" on waitlist for insert with check (true);

-- Existing projects: add the optional interest column
alter table waitlist add column if not exists interest text;

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  email text,
  page text,
  created_at timestamptz default now()
);

alter table feedback enable row level security;

create policy "public insert" on feedback for insert with check (true);

-- Ensure gen_random_uuid() is available
create extension if not exists pgcrypto;
