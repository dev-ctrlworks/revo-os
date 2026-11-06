-- Plan enum
do $$ begin
  create type public.plan_id as enum ('free', 'plus', 'pro');
exception
  when duplicate_object then null;
end $$;

-- Add plan_id to existing profiles table
alter table public.profiles 
  add column if not exists plan_id public.plan_id not null default 'free';

-- Update existing profiles to have free plan
update public.profiles set plan_id = 'free' where plan_id is null;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, plan_id)
  values (new.id, 'free')
  on conflict (id) do update set plan_id = coalesce(public.profiles.plan_id, 'free');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill existing users
insert into public.profiles (id, plan_id)
select id, 'free' from auth.users
on conflict (id) do update set plan_id = coalesce(public.profiles.plan_id, 'free');
