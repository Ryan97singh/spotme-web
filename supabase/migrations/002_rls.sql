-- ═══════════════════════════════════════════════
-- SpotMe — Row Level Security Policies
-- Run AFTER 001_schema.sql
-- ═══════════════════════════════════════════════

-- Enable RLS on all tables
alter table public.profiles       enable row level security;
alter table public.live_status     enable row level security;
alter table public.swipes          enable row level security;
alter table public.matches         enable row level security;
alter table public.messages        enable row level security;
alter table public.groups          enable row level security;
alter table public.group_members   enable row level security;
alter table public.leaderboard     enable row level security;
alter table public.push_tokens     enable row level security;
alter table public.blocks          enable row level security;
alter table public.reports         enable row level security;

-- ─────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────
-- Anyone can read public profiles (needed for discover)
create policy "profiles_select_public" on public.profiles
  for select using (is_active = true);

-- Users can only update their own profile
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Insert own profile (called after signup)
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- ─────────────────────────────────────────────
-- LIVE STATUS
-- ─────────────────────────────────────────────
create policy "live_status_select" on public.live_status
  for select using (true);

create policy "live_status_upsert" on public.live_status
  for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- SWIPES
-- ─────────────────────────────────────────────
-- Can only see your own swipes (privacy)
create policy "swipes_select_own" on public.swipes
  for select using (auth.uid() = swiper_id);

create policy "swipes_insert_own" on public.swipes
  for insert with check (auth.uid() = swiper_id);

-- ─────────────────────────────────────────────
-- MATCHES
-- ─────────────────────────────────────────────
-- Can only see matches you're part of
create policy "matches_select_own" on public.matches
  for select using (auth.uid() = user1_id or auth.uid() = user2_id);

-- ─────────────────────────────────────────────
-- MESSAGES
-- ─────────────────────────────────────────────
-- Can only see messages in your matches
create policy "messages_select_own" on public.messages
  for select using (
    exists (
      select 1 from public.matches
      where id = messages.match_id
        and (user1_id = auth.uid() or user2_id = auth.uid())
    )
  );

-- Can only send messages in your matches
create policy "messages_insert_own" on public.messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.matches
      where id = messages.match_id
        and (user1_id = auth.uid() or user2_id = auth.uid())
    )
  );

-- ─────────────────────────────────────────────
-- GROUPS
-- ─────────────────────────────────────────────
create policy "groups_select_public" on public.groups
  for select using (is_public = true);

create policy "groups_insert_own" on public.groups
  for insert with check (auth.uid() = creator_id);

create policy "groups_update_own" on public.groups
  for update using (auth.uid() = creator_id);

create policy "group_members_select" on public.group_members
  for select using (true);

create policy "group_members_insert_own" on public.group_members
  for insert with check (auth.uid() = user_id);

create policy "group_members_delete_own" on public.group_members
  for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- LEADERBOARD
-- ─────────────────────────────────────────────
create policy "leaderboard_select_all" on public.leaderboard
  for select using (true);

create policy "leaderboard_insert_own" on public.leaderboard
  for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- PUSH TOKENS
-- ─────────────────────────────────────────────
create policy "push_tokens_own" on public.push_tokens
  for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- BLOCKS
-- ─────────────────────────────────────────────
create policy "blocks_own" on public.blocks
  for all using (auth.uid() = blocker_id);

-- ─────────────────────────────────────────────
-- STORAGE POLICIES
-- ─────────────────────────────────────────────
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_own_upload" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_own_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "group_covers_public_read" on storage.objects
  for select using (bucket_id = 'group-covers');

create policy "group_covers_auth_upload" on storage.objects
  for insert with check (bucket_id = 'group-covers' and auth.role() = 'authenticated');
