-- Run this in your Supabase SQL Editor
alter table workout_sets add column if not exists routine_name text;
