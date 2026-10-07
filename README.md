# Revo OS

A working prototype of a second brain: Revo OS captures what you read, watch, screenshot, and save — then lets you ask questions in plain language and get answers grounded in your own memory, with sources you can open.

## Features

- **Capture**: notes, uploads, links, and screenshots land in a local-first memory store.
- **Connect**: memories auto-link across people, projects, and topics in a relationship graph.
- **Ask**: plain-language questions answered by OpenAI (GPT-4o-mini), grounded in your captured memories with citations.
- **Honest prototype**: memories ship pre-loaded from a demo persona and live in your browser localStorage. Public waitlist + feedback are backed by Supabase.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See `.env.example`. Everything except `OPENAI_API_KEY` is required for full functionality:

| Variable | Purpose | Required |
| --- | --- | --- |
| `OPENAI_API_KEY` | Real AI answers via GPT-4o-mini. When unset, the app falls back to canned answers. | No (falls back) |
| `OPENAI_MODEL` | Override the default model (`gpt-4o-mini`). | No |
| `SUPABASE_URL` | Supabase project URL for waitlist + feedback. | For waitlist/feedback |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (server-only — never expose to the client). | For waitlist/feedback |

### Supabase setup

Create a project and run this SQL:

```sql
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);
alter table waitlist enable row level security;
create policy "public insert" on waitlist for insert with check (true);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  email text,
  page text,
  created_at timestamptz default now()
);
alter table feedback enable row level security;
create policy "public insert" on feedback for insert with check (true);
```

## API routes

- `POST /api/ask` — AI answer grounded in captured memories (rate-limited, 10/min/IP).
- `POST /api/waitlist` — add an email to the waitlist (idempotent on duplicates).
- `POST /api/feedback` — submit in-app feedback (`message`, optional `email`, `page`).
- `GET /api/counts` — live waitlist count.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the environment variables above in Project → Settings → Environment Variables.