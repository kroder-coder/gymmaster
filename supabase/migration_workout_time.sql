-- Run this in your Supabase SQL Editor
alter table workouts add column if not exists started_at timestamptz;
alter table workouts add column if not exists duration_seconds integer;
