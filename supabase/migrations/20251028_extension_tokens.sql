-- Extension tokens for browser capture (Plus/Pro only)
create table if not exists public.extension_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null,
  name text not null,
  last_used_at timestamptz,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists extension_tokens_user_id_idx on public.extension_tokens (user_id);
create index if not exists extension_tokens_token_hash_idx on public.extension_tokens (token_hash);

alter table public.extension_tokens enable row level security;

create policy "Users can view their own extension tokens"
  on public.extension_tokens
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own extension tokens"
  on public.extension_tokens
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own extension tokens"
  on public.extension_tokens
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own extension tokens"
  on public.extension_tokens
  for delete
  using (auth.uid() = user_id);
