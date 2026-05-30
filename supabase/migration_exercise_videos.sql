-- Run this in your Supabase SQL Editor
-- Adds video_url to exercises and populates with Arnold footage + quality tutorials

alter table exercises add column if not exists video_url text;

-- ── CHEST ─────────────────────────────────────────────────────────────────────
-- Arnold flat bench press footage
update exercises set video_url = 'https://www.youtube.com/watch?v=qqgJGRW2quc' where name = 'Bench Press';
-- Arnold incline bench press rare footage
update exercises set video_url = 'https://www.youtube.com/watch?v=hJvqT2OKJuo' where name = 'Incline Bench Press';
-- Arnold's full chest workout (includes flies, cable fly, pullover)
update exercises set video_url = 'https://www.youtube.com/watch?v=A-hZQXZUYH4' where name = 'Dumbbell Fly';
update exercises set video_url = 'https://www.youtube.com/watch?v=A-hZQXZUYH4' where name = 'Cable Fly';
update exercises set video_url = 'https://www.youtube.com/watch?v=A-hZQXZUYH4' where name = 'Dumbbell Pullover';
-- Arnold heavy chest day (includes dips and push-ups)
update exercises set video_url = 'https://www.youtube.com/watch?v=WWGlkYlpAB4' where name = 'Push-up';

-- ── BACK ──────────────────────────────────────────────────────────────────────
-- Rare Arnold footage training back & chest at Gold's Gym Venice
update exercises set video_url = 'https://www.youtube.com/watch?v=T7k-VsCYlR0' where name = 'Pull-up';
update exercises set video_url = 'https://www.youtube.com/watch?v=T7k-VsCYlR0' where name = 'Wide-Grip Pull-up';
update exercises set video_url = 'https://www.youtube.com/watch?v=T7k-VsCYlR0' where name = 'T-Bar Row';
update exercises set video_url = 'https://www.youtube.com/watch?v=T7k-VsCYlR0' where name = 'One-Arm Dumbbell Row';
-- Perfect rowing technique tutorial
update exercises set video_url = 'https://www.youtube.com/watch?v=axoeDmW0oAY' where name = 'Barbell Row';
-- Lat pulldown form tutorial
update exercises set video_url = 'https://www.youtube.com/watch?v=oTwbvA665ZM' where name = 'Lat Pulldown';
-- Back width vs thickness (cable row included)
update exercises set video_url = 'https://www.youtube.com/watch?v=PAXkl-AdJFg' where name = 'Seated Cable Row';
-- Squat/deadlift hypertrophy technique
update exercises set video_url = 'https://www.youtube.com/watch?v=t_T2uVNR8P0' where name = 'Deadlift';

-- ── LEGS ──────────────────────────────────────────────────────────────────────
update exercises set video_url = 'https://www.youtube.com/watch?v=t_T2uVNR8P0' where name = 'Squat';
update exercises set video_url = 'https://www.youtube.com/watch?v=t_T2uVNR8P0' where name = 'Romanian Deadlift';
-- Big Five compound movements (covers leg press, extensions, curls, lunges)
update exercises set video_url = 'https://www.youtube.com/watch?v=Z1ErMMcDR9E' where name = 'Leg Press';
update exercises set video_url = 'https://www.youtube.com/watch?v=Z1ErMMcDR9E' where name = 'Leg Extension';
update exercises set video_url = 'https://www.youtube.com/watch?v=Z1ErMMcDR9E' where name = 'Leg Curl';
update exercises set video_url = 'https://www.youtube.com/watch?v=Z1ErMMcDR9E' where name = 'Lunges';
update exercises set video_url = 'https://www.youtube.com/watch?v=Z1ErMMcDR9E' where name = 'Calf Raise';

-- ── SHOULDERS ─────────────────────────────────────────────────────────────────
-- Arnold's heavy shoulder day "Cannonball Delts"
update exercises set video_url = 'https://www.youtube.com/watch?v=UZ_YpDYXHTY' where name = 'Overhead Press';
update exercises set video_url = 'https://www.youtube.com/watch?v=UZ_YpDYXHTY' where name = 'Seated Barbell Press';
update exercises set video_url = 'https://www.youtube.com/watch?v=UZ_YpDYXHTY' where name = 'Rear Delt Lateral Raise';
-- Lateral raise how-to tutorial
update exercises set video_url = 'https://www.youtube.com/watch?v=b_LEX4n9lOs' where name = 'Lateral Raise';
update exercises set video_url = 'https://www.youtube.com/watch?v=b_LEX4n9lOs' where name = 'Cable Lateral Raise';
-- Lateral delt science (covers front raise, face pull)
update exercises set video_url = 'https://www.youtube.com/watch?v=iUlOM2Kigpw' where name = 'Front Raise';
update exercises set video_url = 'https://www.youtube.com/watch?v=iUlOM2Kigpw' where name = 'Face Pull';

-- ── ARMS ──────────────────────────────────────────────────────────────────────
-- Arnold cheat curl with straight bar (Pumping Iron footage)
update exercises set video_url = 'https://www.youtube.com/watch?v=u8YHAGEtGU8' where name = 'Barbell Curl';
update exercises set video_url = 'https://www.youtube.com/watch?v=u8YHAGEtGU8' where name = 'Dumbbell Curl';
update exercises set video_url = 'https://www.youtube.com/watch?v=u8YHAGEtGU8' where name = 'Hammer Curl';
-- Arnold training biceps | Pumping Iron | Concentration Curls
update exercises set video_url = 'https://www.youtube.com/watch?v=dihqSBk7uT4' where name = 'Concentration Curl';
-- Tricep pushdown tutorial
update exercises set video_url = 'https://www.youtube.com/watch?v=mRmIthbCSNI' where name = 'Tricep Pushdown';
-- Overhead tricep extension / skull crusher
update exercises set video_url = 'https://www.youtube.com/watch?v=GzmlxvSFE7A' where name = 'Skull Crusher';
-- Arnold heavy chest day includes dips
update exercises set video_url = 'https://www.youtube.com/watch?v=WWGlkYlpAB4' where name = 'Dip';
-- Bench press form tutorial (applies to close-grip variation)
update exercises set video_url = 'https://www.youtube.com/watch?v=4Y2ZdHCOXok' where name = 'Close-Grip Bench Press';

-- ── CORE ──────────────────────────────────────────────────────────────────────
update exercises set video_url = 'https://www.youtube.com/watch?v=Z1ErMMcDR9E' where name = 'Plank';
update exercises set video_url = 'https://www.youtube.com/watch?v=Z1ErMMcDR9E' where name = 'Crunch';
update exercises set video_url = 'https://www.youtube.com/watch?v=Z1ErMMcDR9E' where name = 'Russian Twist';
update exercises set video_url = 'https://www.youtube.com/watch?v=Z1ErMMcDR9E' where name = 'Leg Raise';
update exercises set video_url = 'https://www.youtube.com/watch?v=Z1ErMMcDR9E' where name = 'Ab Wheel';

-- Cardio left as null (self-explanatory movements)
