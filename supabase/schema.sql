-- Run this in your Supabase SQL editor

create table exercises (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null check (category in ('Chest','Back','Legs','Shoulders','Arms','Core','Cardio','Other')),
  created_at timestamptz default now()
);

create table workouts (
  id uuid default gen_random_uuid() primary key,
  date date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

create table workout_sets (
  id uuid default gen_random_uuid() primary key,
  workout_id uuid references workouts(id) on delete cascade not null,
  exercise_id uuid references exercises(id) not null,
  exercise_name text not null,
  set_number integer not null,
  reps integer,
  weight numeric,
  weight_unit text default 'kg' check (weight_unit in ('kg','lbs')),
  duration_seconds integer,
  distance_meters numeric,
  created_at timestamptz default now()
);

create table routines (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now()
);

create table routine_exercises (
  id uuid default gen_random_uuid() primary key,
  routine_id uuid references routines(id) on delete cascade not null,
  exercise_id uuid references exercises(id) not null,
  exercise_name text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- RLS for new tables
alter table routines enable row level security;
alter table routine_exercises enable row level security;
create policy "allow all" on routines for all using (true) with check (true);
create policy "allow all" on routine_exercises for all using (true) with check (true);

-- Seed exercise library
insert into exercises (name, category) values
  ('Bench Press', 'Chest'),
  ('Incline Bench Press', 'Chest'),
  ('Dumbbell Fly', 'Chest'),
  ('Push-up', 'Chest'),
  ('Cable Fly', 'Chest'),
  ('Pull-up', 'Back'),
  ('Barbell Row', 'Back'),
  ('Lat Pulldown', 'Back'),
  ('Seated Cable Row', 'Back'),
  ('Deadlift', 'Back'),
  ('Squat', 'Legs'),
  ('Leg Press', 'Legs'),
  ('Romanian Deadlift', 'Legs'),
  ('Lunges', 'Legs'),
  ('Leg Curl', 'Legs'),
  ('Leg Extension', 'Legs'),
  ('Calf Raise', 'Legs'),
  ('Overhead Press', 'Shoulders'),
  ('Lateral Raise', 'Shoulders'),
  ('Front Raise', 'Shoulders'),
  ('Face Pull', 'Shoulders'),
  ('Barbell Curl', 'Arms'),
  ('Dumbbell Curl', 'Arms'),
  ('Hammer Curl', 'Arms'),
  ('Tricep Pushdown', 'Arms'),
  ('Skull Crusher', 'Arms'),
  ('Dip', 'Arms'),
  ('Plank', 'Core'),
  ('Crunch', 'Core'),
  ('Russian Twist', 'Core'),
  ('Leg Raise', 'Core'),
  ('Ab Wheel', 'Core'),
  ('Running', 'Cardio'),
  ('Cycling', 'Cardio'),
  ('Rowing', 'Cardio'),
  ('Jump Rope', 'Cardio');
