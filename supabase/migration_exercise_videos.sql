-- Run this in your Supabase SQL Editor
-- Adds video_url to exercises and maps each to a specific exercise tutorial video

alter table exercises add column if not exists video_url text;

-- ── CHEST ─────────────────────────────────────────────────────────────────────
update exercises set video_url = 'https://www.youtube.com/watch?v=vthMCtgVtFw' where name = 'Bench Press';
update exercises set video_url = 'https://www.youtube.com/watch?v=O9x7xRhtA9Q' where name = 'Incline Bench Press';
update exercises set video_url = 'https://www.youtube.com/watch?v=LzFvciCdoW0' where name = 'Dumbbell Fly';
update exercises set video_url = 'https://www.youtube.com/watch?v=ETtXO4FW1EU' where name = 'Cable Fly';
update exercises set video_url = 'https://www.youtube.com/watch?v=GTY65u8Fxk0' where name = 'Dumbbell Pullover';
update exercises set video_url = 'https://www.youtube.com/watch?v=WDIpL0pjun0' where name = 'Push-up';

-- ── BACK ──────────────────────────────────────────────────────────────────────
update exercises set video_url = 'https://www.youtube.com/watch?v=sIvJTfGxdFo' where name = 'Pull-up';
update exercises set video_url = 'https://www.youtube.com/watch?v=IK3sH7wOAWE' where name = 'Wide-Grip Pull-up';
update exercises set video_url = 'https://www.youtube.com/watch?v=5foJiIVhs8Q' where name = 'T-Bar Row';
update exercises set video_url = 'https://www.youtube.com/watch?v=gfUg6qWohTk' where name = 'One-Arm Dumbbell Row';
update exercises set video_url = 'https://www.youtube.com/watch?v=T3N-TO4reLQ' where name = 'Barbell Row';
update exercises set video_url = 'https://www.youtube.com/watch?v=AOpi-p0cJkc' where name = 'Lat Pulldown';
update exercises set video_url = 'https://www.youtube.com/watch?v=7BkgqzC6WsM' where name = 'Seated Cable Row';
update exercises set video_url = 'https://www.youtube.com/watch?v=XxWcirHIwVo' where name = 'Deadlift';

-- ── LEGS ──────────────────────────────────────────────────────────────────────
update exercises set video_url = 'https://www.youtube.com/watch?v=Uv_DKDl7EjA' where name = 'Squat';
update exercises set video_url = 'https://www.youtube.com/watch?v=_oyxCn2iSjU' where name = 'Romanian Deadlift';
update exercises set video_url = 'https://www.youtube.com/watch?v=cDGOn-yfKJA' where name = 'Leg Press';
update exercises set video_url = 'https://www.youtube.com/watch?v=ljO4jkwv8wQ' where name = 'Leg Extension';
update exercises set video_url = 'https://www.youtube.com/watch?v=vl5nUdE9mWM' where name = 'Leg Curl';
update exercises set video_url = 'https://www.youtube.com/watch?v=WzONHuAe6BY' where name = 'Lunges';
update exercises set video_url = 'https://www.youtube.com/watch?v=OMUvfMZOcSA' where name = 'Calf Raise';

-- ── SHOULDERS ─────────────────────────────────────────────────────────────────
update exercises set video_url = 'https://www.youtube.com/watch?v=bMksDb5a3P0' where name = 'Overhead Press';
update exercises set video_url = 'https://www.youtube.com/watch?v=_sLBgSQGigg' where name = 'Seated Barbell Press';
update exercises set video_url = 'https://www.youtube.com/watch?v=5Btk1HzSmxo' where name = 'Rear Delt Lateral Raise';
update exercises set video_url = 'https://www.youtube.com/watch?v=pgrWjBfaFe8' where name = 'Lateral Raise';
update exercises set video_url = 'https://www.youtube.com/watch?v=qitQHqNZbeM' where name = 'Cable Lateral Raise';
update exercises set video_url = 'https://www.youtube.com/watch?v=CH9JzDStL3U' where name = 'Front Raise';
update exercises set video_url = 'https://www.youtube.com/watch?v=0Po47vvj9g4' where name = 'Face Pull';

-- ── ARMS ──────────────────────────────────────────────────────────────────────
update exercises set video_url = 'https://www.youtube.com/watch?v=QZEqB6wUPxQ' where name = 'Barbell Curl';
update exercises set video_url = 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' where name = 'Dumbbell Curl';
update exercises set video_url = 'https://www.youtube.com/watch?v=zC3nLlEvin4' where name = 'Hammer Curl';
update exercises set video_url = 'https://www.youtube.com/watch?v=8KySC0rUgpQ' where name = 'Concentration Curl';
update exercises set video_url = 'https://www.youtube.com/watch?v=_w-HpW70nSQ' where name = 'Tricep Pushdown';
update exercises set video_url = 'https://www.youtube.com/watch?v=9baX4-wEYx8' where name = 'Skull Crusher';
update exercises set video_url = 'https://www.youtube.com/watch?v=8UugSoVJLag' where name = 'Dip';
update exercises set video_url = 'https://www.youtube.com/watch?v=a2G3IdaTcPU' where name = 'Close-Grip Bench Press';

-- ── CORE ──────────────────────────────────────────────────────────────────────
update exercises set video_url = 'https://www.youtube.com/watch?v=sXAzSTuFJ0I' where name = 'Plank';
update exercises set video_url = 'https://www.youtube.com/watch?v=Xyd_fa5zoEU' where name = 'Crunch';
update exercises set video_url = 'https://www.youtube.com/watch?v=fPxO-FA8acM' where name = 'Russian Twist';
update exercises set video_url = 'https://www.youtube.com/watch?v=vwl68EF9M2Q' where name = 'Leg Raise';
update exercises set video_url = 'https://www.youtube.com/watch?v=j6lR4u193gE' where name = 'Ab Wheel';
