-- Schema for SamJoorNetwork's Supabase project.
-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Only the server (service_role key) talks to these tables, so RLS is
-- enabled with no policies: the anon/public key gets zero access.

create table if not exists chess_players (
  username text primary key,
  elo integer not null default 800,
  wins integer not null default 0,
  losses integer not null default 0,
  draws integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table chess_players enable row level security;

create table if not exists chess_games (
  id uuid primary key default gen_random_uuid(),
  player_id text not null,
  player_alias text,
  player_color text not null,
  ai_level text not null default 'random',
  client_meta jsonb,
  moves_count integer not null default 0,
  result text,
  reason text,
  pgn text,
  final_fen text,
  duration_ms integer,
  created_at timestamptz not null default now()
);
alter table chess_games enable row level security;

create table if not exists chess_moves (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references chess_games(id) on delete cascade,
  ply integer not null,
  san text not null,
  uci text,
  fen text not null,
  move_ms integer,
  created_at timestamptz not null default now()
);
alter table chess_moves enable row level security;

create table if not exists chess_learned_moves (
  id uuid primary key default gen_random_uuid(),
  position_key text not null,
  uci text not null,
  plays integer not null default 0,
  wins integer not null default 0,
  draws integer not null default 0,
  losses integer not null default 0,
  unique (position_key, uci)
);
alter table chess_learned_moves enable row level security;

create table if not exists egg_events (
  id uuid primary key default gen_random_uuid(),
  egg_id text not null,
  name text not null,
  created_at timestamptz not null default now()
);
alter table egg_events enable row level security;
