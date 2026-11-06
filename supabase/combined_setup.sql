-- Revo OS — combined schema setup for a fresh Supabase project.
-- Paste this entire file into the Supabase SQL Editor and run once.
-- It applies migrations 0002 (core schema + RLS), 0003 (storage bucket +
-- policies), and 0004 (collection presentation metadata). Migrations 0001,
-- 0005, and 0006 only created and immediately dropped the retired waitlist and
-- feedback tables, so they are intentionally omitted.

-- ===========================================================================
-- 0002: Core personal-memory schema
-- ===========================================================================
create type memory_type as enum (
  'screenshot', 'note', 'document', 'link', 'image',
  'discussion', 'email', 'archive'
);

create type processing_status as enum ('pending', 'processing', 'ready', 'failed');

create type relationship_type as enum (
  'related_to', 'references', 'derived_from', 'contradicts'
);

create type relationship_creator as enum ('user', 'ai');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_path text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type memory_type not null,
  title text not null check (length(btrim(title)) > 0),
  description text,
  source_url text,
  source_domain text,
  content_text text,
  extracted_text text,
  ai_summary text,
  metadata jsonb not null default '{}'::jsonb,
  processing_status processing_status not null default 'ready',
  processing_error_code text,
  favorite boolean not null default false,
  captured_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create index memories_user_created_idx
  on public.memories (user_id, created_at desc);
create index memories_user_type_idx
  on public.memories (user_id, type);
create index memories_user_status_idx
  on public.memories (user_id, processing_status);
create index memories_user_favorite_idx
  on public.memories (user_id, favorite);

alter table public.memories
  add column search_vector tsvector
  generated always as (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(content_text, '') || ' ' ||
      coalesce(extracted_text, '') || ' ' ||
      coalesce(ai_summary, '') || ' ' ||
      coalesce(source_domain, '')
    )
  ) stored;

create index memories_search_idx
  on public.memories using gin (search_vector);

create trigger memories_set_updated_at
  before update on public.memories
  for each row execute function public.set_updated_at();

alter table public.memories enable row level security;

create policy "Memories are viewable by owner"
  on public.memories for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Memories are insertable by owner"
  on public.memories for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Memories are updatable by owner"
  on public.memories for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Memories are deletable by owner"
  on public.memories for delete to authenticated
  using ((select auth.uid()) = user_id);

create table public.memory_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  memory_id uuid not null,
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  checksum text,
  created_at timestamptz not null default now(),
  foreign key (memory_id, user_id)
    references public.memories (id, user_id) on delete cascade
);

create index memory_files_memory_idx on public.memory_files (memory_id);
create index memory_files_user_idx on public.memory_files (user_id);

alter table public.memory_files enable row level security;

create policy "Memory files are viewable by owner"
  on public.memory_files for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Memory files are insertable by owner"
  on public.memory_files for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Memory files are updatable by owner"
  on public.memory_files for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Memory files are deletable by owner"
  on public.memory_files for delete to authenticated
  using ((select auth.uid()) = user_id);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (length(btrim(name)) > 0),
  normalized_name text not null,
  created_at timestamptz not null default now(),
  unique (id, user_id),
  unique (user_id, normalized_name)
);

alter table public.tags enable row level security;

create policy "Tags are viewable by owner"
  on public.tags for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Tags are insertable by owner"
  on public.tags for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Tags are updatable by owner"
  on public.tags for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Tags are deletable by owner"
  on public.tags for delete to authenticated
  using ((select auth.uid()) = user_id);

create table public.memory_tags (
  memory_id uuid not null,
  tag_id uuid not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (memory_id, tag_id),
  foreign key (memory_id, user_id) references public.memories (id, user_id) on delete cascade,
  foreign key (tag_id, user_id) references public.tags (id, user_id) on delete cascade
);

create index memory_tags_tag_idx on public.memory_tags (tag_id);

alter table public.memory_tags enable row level security;

create policy "Memory tags are viewable by owner"
  on public.memory_tags for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Memory tags are insertable by owner"
  on public.memory_tags for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Memory tags are deletable by owner"
  on public.memory_tags for delete to authenticated
  using ((select auth.uid()) = user_id);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (length(btrim(name)) > 0),
  description text,
  cover_memory_id uuid,
  emoji text not null default '📁' check (char_length(emoji) between 1 and 16),
  ai_generated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (cover_memory_id, user_id) references public.memories (id, user_id) on delete set null
);

create index collections_user_idx on public.collections (user_id);

create trigger collections_set_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

alter table public.collections enable row level security;

create policy "Collections are viewable by owner"
  on public.collections for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Collections are insertable by owner"
  on public.collections for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Collections are updatable by owner"
  on public.collections for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Collections are deletable by owner"
  on public.collections for delete to authenticated
  using ((select auth.uid()) = user_id);

create table public.collection_memories (
  collection_id uuid not null,
  memory_id uuid not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (collection_id, memory_id),
  foreign key (collection_id, user_id) references public.collections (id, user_id) on delete cascade,
  foreign key (memory_id, user_id) references public.memories (id, user_id) on delete cascade
);

create index collection_memories_memory_idx on public.collection_memories (memory_id);

alter table public.collection_memories enable row level security;

create policy "Collection memories are viewable by owner"
  on public.collection_memories for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Collection memories are insertable by owner"
  on public.collection_memories for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Collection memories are deletable by owner"
  on public.collection_memories for delete to authenticated
  using ((select auth.uid()) = user_id);

create table public.memory_relationships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_memory_id uuid not null,
  target_memory_id uuid not null,
  relationship_type relationship_type not null,
  created_by relationship_creator not null default 'user',
  created_at timestamptz not null default now(),
  check (source_memory_id <> target_memory_id),
  unique (user_id, source_memory_id, target_memory_id, relationship_type),
  foreign key (source_memory_id, user_id) references public.memories (id, user_id) on delete cascade,
  foreign key (target_memory_id, user_id) references public.memories (id, user_id) on delete cascade
);

create index memory_relationships_source_idx
  on public.memory_relationships (source_memory_id);
create index memory_relationships_target_idx
  on public.memory_relationships (target_memory_id);

alter table public.memory_relationships enable row level security;

create policy "Relationships are viewable by owner"
  on public.memory_relationships for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Relationships are insertable by owner"
  on public.memory_relationships for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Relationships are updatable by owner"
  on public.memory_relationships for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Relationships are deletable by owner"
  on public.memory_relationships for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ===========================================================================
-- 0003: Private storage bucket + owner-scoped policies
-- ===========================================================================
insert into storage.buckets (id, name, public, file_size_limit)
values ('memories', 'memories', false, 26214400)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit;

create policy "Memory files: owner can read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );

create policy "Memory files: owner can upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );

create policy "Memory files: owner can update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );

create policy "Memory files: owner can delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );
