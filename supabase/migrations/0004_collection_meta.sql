-- 0004: Persist user-facing collection presentation metadata.
-- Emoji and description are user-authored and must survive across devices;
-- ai_generated records whether Revo OS proposed the collection. The display
-- color is intentionally NOT stored — it is derived deterministically from the
-- collection name in the client so Tailwind can statically compile the palette.

alter table public.collections
  add column emoji text not null default '📁'
    check (char_length(emoji) between 1 and 16),
  add column ai_generated boolean not null default false;
