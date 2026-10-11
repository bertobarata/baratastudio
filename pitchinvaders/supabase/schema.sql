-- Pitch Invader — global leaderboard.
-- Run once in Supabase → SQL Editor. Safe to re-run.
--
-- Model: one row per name (case-insensitive). The first device that uses a
-- name owns it; other devices get 'taken'. Each row keeps that name's best.
-- The anon key can only call the three functions below — the table itself
-- is not readable or writable directly (RLS on, no policies, grants revoked).

create extension if not exists citext;

create table if not exists public.pitch_scores (
  name       citext primary key check (char_length(name) between 1 and 14),
  device     uuid not null,
  best       numeric(6,1) not null default 0 check (best between 0 and 900),
  plays      int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pitch_scores_best_idx on public.pitch_scores (best desc);

alter table public.pitch_scores enable row level security;
revoke all on public.pitch_scores from anon, authenticated;

-- Reserve a name for a device. Returns 'ok', 'taken' or 'invalid'.
create or replace function public.pitch_claim_name(p_name text, p_device uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name  text := btrim(coalesce(p_name, ''));
  v_owner uuid;
begin
  if char_length(v_name) < 1 or char_length(v_name) > 14 or p_device is null then
    return 'invalid';
  end if;
  insert into pitch_scores (name, device) values (v_name, p_device)
  on conflict (name) do nothing;
  select device into v_owner from pitch_scores where name = v_name::citext;
  return case when v_owner = p_device then 'ok' else 'taken' end;
end;
$$;

-- Record a finished run. Keeps the best score for the name, only for its owner.
-- Returns the name's current position in the ranking (null if rejected).
create or replace function public.pitch_submit(p_name text, p_device uuid, p_score numeric)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_best numeric;
begin
  if p_score is null or p_score < 0 or p_score > 900 then
    return null;
  end if;
  update pitch_scores
     set best = greatest(best, round(p_score, 1)),
         plays = plays + 1,
         updated_at = now()
   where name = btrim(p_name)::citext
     and device = p_device
     and updated_at < now() - interval '2 seconds'   -- crude flood guard
  returning best into v_best;
  if v_best is null then
    return null;
  end if;
  return (select count(*) + 1 from pitch_scores where best > v_best);
end;
$$;

-- Public top list. Names that never finished a run (best = 0) are hidden.
create or replace function public.pitch_top(p_limit int default 20)
returns table (name text, best numeric)
language sql
security definer
set search_path = public
stable
as $$
  select s.name::text, s.best
    from pitch_scores s
   where s.best > 0
   order by s.best desc, s.updated_at asc
   limit least(greatest(coalesce(p_limit, 20), 1), 50);
$$;

revoke all on function public.pitch_claim_name(text, uuid) from public;
revoke all on function public.pitch_submit(text, uuid, numeric) from public;
revoke all on function public.pitch_top(int) from public;
grant execute on function public.pitch_claim_name(text, uuid) to anon, authenticated;
grant execute on function public.pitch_submit(text, uuid, numeric) to anon, authenticated;
grant execute on function public.pitch_top(int) to anon, authenticated;
