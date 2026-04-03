# Supabase Setup

This is the simplest hosted storage path for the survey:

1. GitHub Pages hosts the frontend.
2. The frontend writes directly to Supabase.
3. You read responses in the Supabase dashboard or export them later.

## Recommended table

Run this SQL in Supabase SQL Editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  submission_id text not null unique,
  submitted_at timestamptz not null,
  page_url text not null,
  user_agent text not null,
  row_data jsonb not null,
  answers jsonb not null,
  audio_recordings jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.survey_responses enable row level security;

drop policy if exists "public can insert survey responses" on public.survey_responses;

create policy "public can insert survey responses"
on public.survey_responses
for insert
to anon, authenticated
with check (true);
```

This setup allows public inserts from the hosted survey, but does not allow public reads.

## What the app writes

Each row contains:

- `submission_id`
- `submitted_at`
- `page_url`
- `user_agent`
- `row_data`
  A flat, human-readable object with `q1` through `q14` and any `_other` fields
- `answers`
  A formatted answers object by question id
- `audio_recordings`
  Optional audio metadata plus base64 content if a voice response was recorded

## GitHub repository variables

Add these in:

- `Settings -> Secrets and variables -> Actions -> Variables`

Set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

If your project still uses the older anon key naming, the app also supports:

- `VITE_SUPABASE_ANON_KEY`

The GitHub Pages workflow already reads these variables at build time.

## App behavior

The app now prefers Supabase if those variables are present.

If Supabase is not configured, it falls back to `VITE_SURVEY_SUBMIT_URL`.

## How to read data

Open the Supabase dashboard and inspect:

- `Table Editor -> survey_responses`

If you want easier browsing later, you can create a view that expands selected values from `row_data`.

## Suggested next step

Start with Supabase only. It is much simpler than Power Automate if your main requirement is just reliable storage and easy access.
