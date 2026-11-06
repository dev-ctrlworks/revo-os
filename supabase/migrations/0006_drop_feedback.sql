-- Remove the feedback table now that the in-app feedback feature is gone.

drop policy if exists "public insert" on feedback;
drop table if exists feedback;
