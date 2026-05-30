-- Dummy workouts for May 28 & 29 2026
-- Run in Supabase SQL Editor to test the calendar day-tap feature

-- ── Workouts ──────────────────────────────────────────────────────────────────
insert into workouts (id, date, started_at, duration_seconds, notes) values
  ('dd000001-0000-0000-0000-000000000001', '2026-05-28', '2026-05-28T08:30:00+00', 4200, 'Push day'),
  ('dd000001-0000-0000-0000-000000000002', '2026-05-29', '2026-05-29T17:15:00+00', 3900, 'Pull day');

-- ── May 28 – Push: Bench Press / Incline Bench / Overhead Press / Dumbbell Fly / Tricep Pushdown ──
insert into workout_sets (workout_id, exercise_id, exercise_name, set_number, reps, weight, weight_unit)
select
  'dd000001-0000-0000-0000-000000000001',
  e.id,
  s.ename,
  s.snum,
  s.reps,
  s.kg::numeric,
  'kg'
from (values
  ('Bench Press',         1, 12, 80),
  ('Bench Press',         2, 10, 85),
  ('Bench Press',         3,  8, 90),
  ('Bench Press',         4,  6, 95),
  ('Incline Bench Press', 1, 12, 60),
  ('Incline Bench Press', 2, 10, 65),
  ('Incline Bench Press', 3,  8, 70),
  ('Incline Bench Press', 4,  6, 75),
  ('Overhead Press',      1, 12, 50),
  ('Overhead Press',      2, 10, 55),
  ('Overhead Press',      3,  8, 60),
  ('Overhead Press',      4,  6, 65),
  ('Dumbbell Fly',        1, 15, 18),
  ('Dumbbell Fly',        2, 12, 20),
  ('Dumbbell Fly',        3, 12, 22),
  ('Dumbbell Fly',        4, 10, 24),
  ('Tricep Pushdown',     1, 15, 30),
  ('Tricep Pushdown',     2, 15, 32),
  ('Tricep Pushdown',     3, 12, 35),
  ('Tricep Pushdown',     4, 12, 37)
) as s(ename, snum, reps, kg)
join exercises e on e.name = s.ename;

-- ── May 29 – Pull: Barbell Row / Lat Pulldown / Seated Cable Row / Deadlift / Barbell Curl ──
insert into workout_sets (workout_id, exercise_id, exercise_name, set_number, reps, weight, weight_unit)
select
  'dd000001-0000-0000-0000-000000000002',
  e.id,
  s.ename,
  s.snum,
  s.reps,
  s.kg::numeric,
  'kg'
from (values
  ('Barbell Row',      1, 12,  70),
  ('Barbell Row',      2, 10,  75),
  ('Barbell Row',      3,  8,  82),
  ('Barbell Row',      4,  6,  90),
  ('Lat Pulldown',     1, 12,  55),
  ('Lat Pulldown',     2, 10,  62),
  ('Lat Pulldown',     3,  8,  68),
  ('Lat Pulldown',     4,  8,  70),
  ('Seated Cable Row', 1, 12,  50),
  ('Seated Cable Row', 2, 12,  55),
  ('Seated Cable Row', 3, 10,  60),
  ('Seated Cable Row', 4, 10,  65),
  ('Deadlift',         1,  8, 100),
  ('Deadlift',         2,  6, 110),
  ('Deadlift',         3,  5, 120),
  ('Deadlift',         4,  4, 130),
  ('Barbell Curl',     1, 12,  30),
  ('Barbell Curl',     2, 10,  35),
  ('Barbell Curl',     3,  8,  40),
  ('Barbell Curl',     4,  8,  40)
) as s(ename, snum, reps, kg)
join exercises e on e.name = s.ename;
