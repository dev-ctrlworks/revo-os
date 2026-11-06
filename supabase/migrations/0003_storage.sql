-- 0003: Private storage bucket for uploaded memory files.
-- Object keys follow: users/{user_id}/memories/{memory_id}/{file_id}
-- The path is an organizational convention only — access is enforced by the
-- policies below, which scope every operation to the authenticated owner.

insert into storage.buckets (id, name, public, file_size_limit)
values ('memories', 'memories', false, 26214400) -- 25 MB
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit;

-- Read own objects
create policy "Memory files: owner can read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );

-- Upload own objects
create policy "Memory files: owner can upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );

-- Overwrite own objects
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

-- Delete own objects
create policy "Memory files: owner can delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );
