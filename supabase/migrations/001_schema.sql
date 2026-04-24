-- ═══════════════════════════════════════════════
-- SpotMe — Full Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";        -- geo queries (nearby users)
create extension if not exists "pg_cron";        -- leaderboard weekly reset

-- ─────────────────────────────────────────────
-- USERS / PROFILES
-- ─────────────────────────────────────────────
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  username      text unique,
  full_name     text not null,
  age           int check (age >= 18 and age <= 99),
  bio           text,
  gym_name      text,
  location      geography(point, 4326),           -- PostGIS point for geo queries
  avatar_url    text,
  photos        text[] default '{}',              -- array of storage URLs
  goals         text[] default '{}',             -- ['Strength','Cutting','Cardio'...]
  schedule      text[] default '{}',             -- ['Early AM','Evening'...]
  train_days    int default 3 check (train_days between 1 and 7),
  looking_for   text default 'both' check (looking_for in ('partner','date','both')),
  gender        text,
  show_gender   text[] default '{}',
  -- PRs
  pr_squat      int,
  pr_bench      int,
  pr_deadlift   int,
  weekly_km     numeric(5,1),
  -- Verification
  verified      boolean default false,
  strava_id     text,
  strava_token  text,                            -- encrypted in practice
  -- Status
  is_active     boolean default true,
  last_seen     timestamptz default now(),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Live gym check-in status (separate for fast updates)
create table public.live_status (
  user_id       uuid references public.profiles(id) on delete cascade primary key,
  at_gym        boolean default false,
  gym_name      text,
  checked_in_at timestamptz,
  expires_at    timestamptz                      -- auto-expire after 3 hours
);

-- ─────────────────────────────────────────────
-- SWIPES & MATCHES
-- ─────────────────────────────────────────────
create table public.swipes (
  id            uuid default uuid_generate_v4() primary key,
  swiper_id     uuid references public.profiles(id) on delete cascade,
  swiped_id     uuid references public.profiles(id) on delete cascade,
  direction     text not null check (direction in ('like','pass','super')),
  created_at    timestamptz default now(),
  unique(swiper_id, swiped_id)
);

create table public.matches (
  id            uuid default uuid_generate_v4() primary key,
  user1_id      uuid references public.profiles(id) on delete cascade,
  user2_id      uuid references public.profiles(id) on delete cascade,
  is_super      boolean default false,           -- true if either swiped super
  created_at    timestamptz default now(),
  unique(user1_id, user2_id)
);

-- Auto-create match when mutual like happens
create or replace function public.handle_mutual_like()
returns trigger language plpgsql security definer as $$
declare
  reverse_swipe record;
begin
  -- Only act on likes/supers
  if new.direction not in ('like', 'super') then
    return new;
  end if;

  -- Check if the other person already liked us
  select * into reverse_swipe
  from public.swipes
  where swiper_id = new.swiped_id
    and swiped_id = new.swiper_id
    and direction in ('like', 'super');

  if found then
    -- Create match (smaller uuid first to avoid duplicates)
    insert into public.matches (user1_id, user2_id, is_super)
    values (
      least(new.swiper_id, new.swiped_id),
      greatest(new.swiper_id, new.swiped_id),
      (new.direction = 'super' or reverse_swipe.direction = 'super')
    )
    on conflict do nothing;
  end if;

  return new;
end;
$$;

create trigger on_swipe_inserted
  after insert on public.swipes
  for each row execute function public.handle_mutual_like();

-- ─────────────────────────────────────────────
-- MESSAGES (realtime)
-- ─────────────────────────────────────────────
create table public.messages (
  id            uuid default uuid_generate_v4() primary key,
  match_id      uuid references public.matches(id) on delete cascade,
  sender_id     uuid references public.profiles(id) on delete cascade,
  text          text not null,
  read          boolean default false,
  created_at    timestamptz default now()
);

-- Index for fast conversation loading
create index messages_match_id_created_at on public.messages(match_id, created_at desc);

-- ─────────────────────────────────────────────
-- GROUPS / WORKOUTS
-- ─────────────────────────────────────────────
create table public.groups (
  id            uuid default uuid_generate_v4() primary key,
  creator_id    uuid references public.profiles(id) on delete cascade,
  name          text not null,
  description   text,
  workout_type  text,                            -- 'Running','HIIT','Lifting'...
  scheduled_at  timestamptz,
  location_name text,
  location      geography(point, 4326),
  max_members   int default 10,
  cover_url     text,
  is_public     boolean default true,
  created_at    timestamptz default now()
);

create table public.group_members (
  group_id      uuid references public.groups(id) on delete cascade,
  user_id       uuid references public.profiles(id) on delete cascade,
  joined_at     timestamptz default now(),
  primary key (group_id, user_id)
);

-- ─────────────────────────────────────────────
-- LEADERBOARD
-- ─────────────────────────────────────────────
create table public.leaderboard (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles(id) on delete cascade,
  week          date not null,                   -- monday of the week
  points        int default 0,
  workouts      int default 0,
  matches_made  int default 0,
  unique(user_id, week)
);

-- Function to add points
create or replace function public.add_leaderboard_points(
  p_user_id uuid,
  p_points int,
  p_type text   -- 'workout', 'match', 'chat', 'streak'
) returns void language plpgsql security definer as $$
declare
  week_start date := date_trunc('week', now())::date;
begin
  insert into public.leaderboard (user_id, week, points)
  values (p_user_id, week_start, p_points)
  on conflict (user_id, week)
  do update set points = leaderboard.points + p_points;
end;
$$;

-- ─────────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────────
create table public.push_tokens (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles(id) on delete cascade,
  token         text not null,
  platform      text check (platform in ('ios','android','web')),
  created_at    timestamptz default now(),
  unique(user_id, token)
);

-- ─────────────────────────────────────────────
-- REPORTS / BLOCKS
-- ─────────────────────────────────────────────
create table public.blocks (
  blocker_id    uuid references public.profiles(id) on delete cascade,
  blocked_id    uuid references public.profiles(id) on delete cascade,
  created_at    timestamptz default now(),
  primary key (blocker_id, blocked_id)
);

create table public.reports (
  id            uuid default uuid_generate_v4() primary key,
  reporter_id   uuid references public.profiles(id) on delete cascade,
  reported_id   uuid references public.profiles(id) on delete cascade,
  reason        text not null,
  details       text,
  status        text default 'pending' check (status in ('pending','reviewed','resolved')),
  created_at    timestamptz default now()
);

-- ─────────────────────────────────────────────
-- STORAGE BUCKETS
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('group-covers', 'group-covers', true)
on conflict do nothing;

-- ─────────────────────────────────────────────
-- VIEWS
-- ─────────────────────────────────────────────

-- Leaderboard with profile info
create or replace view public.leaderboard_weekly as
select
  l.user_id,
  p.full_name,
  p.avatar_url,
  l.points,
  l.workouts,
  l.week,
  rank() over (partition by l.week order by l.points desc) as rank
from public.leaderboard l
join public.profiles p on p.id = l.user_id
where l.week = date_trunc('week', now())::date;

-- Match with profile info for both users
create or replace view public.matches_with_profiles as
select
  m.id as match_id,
  m.created_at,
  m.is_super,
  -- user 1
  p1.id as user1_id, p1.full_name as user1_name, p1.avatar_url as user1_avatar,
  -- user 2
  p2.id as user2_id, p2.full_name as user2_name, p2.avatar_url as user2_avatar,
  -- last message
  (select text from public.messages where match_id = m.id order by created_at desc limit 1) as last_message,
  (select created_at from public.messages where match_id = m.id order by created_at desc limit 1) as last_message_at
from public.matches m
join public.profiles p1 on p1.id = m.user1_id
join public.profiles p2 on p2.id = m.user2_id;

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
create index profiles_location_idx on public.profiles using gist(location);
create index swipes_swiper_id_idx on public.swipes(swiper_id);
create index swipes_swiped_id_idx on public.swipes(swiped_id);
create index matches_user1_idx on public.matches(user1_id);
create index matches_user2_idx on public.matches(user2_id);
create index leaderboard_week_points_idx on public.leaderboard(week, points desc);
