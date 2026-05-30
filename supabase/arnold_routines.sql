-- Arnold Schwarzenegger Routines
-- Based on the Arnold Split (6-day: Chest/Back, Shoulders/Arms, Legs x2 per week)
-- Run this in your Supabase SQL Editor

-- Step 1: Add missing exercises not already in the library
insert into exercises (name, category) values
  ('Dumbbell Pullover', 'Chest'),
  ('T-Bar Row', 'Back'),
  ('One-Arm Dumbbell Row', 'Back'),
  ('Wide-Grip Pull-up', 'Back'),
  ('Seated Barbell Press', 'Shoulders'),
  ('Rear Delt Lateral Raise', 'Shoulders'),
  ('Cable Lateral Raise', 'Shoulders'),
  ('Concentration Curl', 'Arms'),
  ('Close-Grip Bench Press', 'Arms')
on conflict do nothing;

-- Step 2: Create Arnold routines
insert into routines (id, name) values
  ('a0000001-0000-0000-0000-000000000001', 'Arnold: Chest'),
  ('a0000001-0000-0000-0000-000000000002', 'Arnold: Back'),
  ('a0000001-0000-0000-0000-000000000003', 'Arnold: Shoulders'),
  ('a0000001-0000-0000-0000-000000000004', 'Arnold: Biceps'),
  ('a0000001-0000-0000-0000-000000000005', 'Arnold: Triceps'),
  ('a0000001-0000-0000-0000-000000000006', 'Arnold: Legs');

-- Step 3: Link exercises to routines

-- Arnold: Chest
-- Bench Press, Incline Bench Press, Dumbbell Fly, Cable Fly, Dips, Dumbbell Pullover
insert into routine_exercises (routine_id, exercise_id, exercise_name, sort_order)
select 'a0000001-0000-0000-0000-000000000001', id, name, row_number() over (order by
  case name
    when 'Bench Press'           then 1
    when 'Incline Bench Press'   then 2
    when 'Dumbbell Fly'          then 3
    when 'Cable Fly'             then 4
    when 'Dip'                   then 5
    when 'Dumbbell Pullover'     then 6
  end
) - 1
from exercises
where name in ('Bench Press','Incline Bench Press','Dumbbell Fly','Cable Fly','Dip','Dumbbell Pullover');

-- Arnold: Back
-- Wide-Grip Pull-up, T-Bar Row, Seated Cable Row, One-Arm Dumbbell Row, Romanian Deadlift
insert into routine_exercises (routine_id, exercise_id, exercise_name, sort_order)
select 'a0000001-0000-0000-0000-000000000002', id, name, row_number() over (order by
  case name
    when 'Wide-Grip Pull-up'       then 1
    when 'T-Bar Row'               then 2
    when 'Seated Cable Row'        then 3
    when 'One-Arm Dumbbell Row'    then 4
    when 'Romanian Deadlift'       then 5
  end
) - 1
from exercises
where name in ('Wide-Grip Pull-up','T-Bar Row','Seated Cable Row','One-Arm Dumbbell Row','Romanian Deadlift');

-- Arnold: Shoulders
-- Seated Barbell Press, Lateral Raise, Rear Delt Lateral Raise, Cable Lateral Raise, Front Raise
insert into routine_exercises (routine_id, exercise_id, exercise_name, sort_order)
select 'a0000001-0000-0000-0000-000000000003', id, name, row_number() over (order by
  case name
    when 'Seated Barbell Press'      then 1
    when 'Lateral Raise'             then 2
    when 'Rear Delt Lateral Raise'   then 3
    when 'Cable Lateral Raise'       then 4
    when 'Front Raise'               then 5
  end
) - 1
from exercises
where name in ('Seated Barbell Press','Lateral Raise','Rear Delt Lateral Raise','Cable Lateral Raise','Front Raise');

-- Arnold: Biceps
-- Barbell Curl, Dumbbell Curl, Concentration Curl
insert into routine_exercises (routine_id, exercise_id, exercise_name, sort_order)
select 'a0000001-0000-0000-0000-000000000004', id, name, row_number() over (order by
  case name
    when 'Barbell Curl'         then 1
    when 'Dumbbell Curl'        then 2
    when 'Concentration Curl'   then 3
  end
) - 1
from exercises
where name in ('Barbell Curl','Dumbbell Curl','Concentration Curl');

-- Arnold: Triceps
-- Close-Grip Bench Press, Tricep Pushdown, Skull Crusher, Dip
insert into routine_exercises (routine_id, exercise_id, exercise_name, sort_order)
select 'a0000001-0000-0000-0000-000000000005', id, name, row_number() over (order by
  case name
    when 'Close-Grip Bench Press' then 1
    when 'Tricep Pushdown'        then 2
    when 'Skull Crusher'          then 3
    when 'Dip'                    then 4
  end
) - 1
from exercises
where name in ('Close-Grip Bench Press','Tricep Pushdown','Skull Crusher','Dip');

-- Arnold: Legs
-- Squat, Leg Press, Leg Extension, Leg Curl, Lunges, Calf Raise
insert into routine_exercises (routine_id, exercise_id, exercise_name, sort_order)
select 'a0000001-0000-0000-0000-000000000006', id, name, row_number() over (order by
  case name
    when 'Squat'          then 1
    when 'Leg Press'      then 2
    when 'Leg Extension'  then 3
    when 'Leg Curl'       then 4
    when 'Lunges'         then 5
    when 'Calf Raise'     then 6
  end
) - 1
from exercises
where name in ('Squat','Leg Press','Leg Extension','Leg Curl','Lunges','Calf Raise');
