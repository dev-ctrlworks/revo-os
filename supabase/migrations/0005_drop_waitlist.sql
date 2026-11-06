-- Remove the waitlist now that Revo OS is a directly available product.
-- The waitlist table and its public-insert policy are no longer needed.

drop policy if exists "public insert" on waitlist;
drop table if exists waitlist;
