'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Workout, WorkoutSet } from '@/lib/types'
import {
  PlusCircle, ChevronRight, ChevronLeft, Flame,
  Clock, Timer, RefreshCw, Dumbbell,
} from 'lucide-react'

type WorkoutWithSets = Workout & { workout_sets: WorkoutSet[] }

const ARNOLD_QUOTES = [
  "The mind is the limit. As long as the mind can envision it, you can do it.",
  "Strength does not come from winning. Your struggles develop your strengths.",
  "You can have results or excuses. Not both.",
  "The last three or four reps is what makes the muscle grow.",
  "Don't be afraid to fail. Failure is where success likes to hide.",
  "What we face may look insurmountable. But we are always stronger than we know.",
  "The worst thing I can be is the same as everybody else.",
  "If you don't find the time, if you don't do the work, you don't get the results.",
  "You can't climb the ladder of success with your hands in your pockets.",
  "Reps, reps, reps. There is no secret formula.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Bodybuilding is much like any other sport. To be successful, you must dedicate yourself 100%.",
  "Everybody pities the weak. Jealousy you have to earn.",
  "I do the same exercises I did 50 years ago and they still work.",
  "No matter what you do in life, selling is part of it.",
]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function Dashboard() {
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutWithSets[]>([])
  const [loading, setLoading] = useState(true)
  const [workoutCounts, setWorkoutCounts] = useState<Record<string, number>>({})
  const [now, setNow] = useState(new Date())
  const [quoteOffset, setQuoteOffset] = useState(0)
  const [calMonth, setCalMonth] = useState(() => {
    const t = new Date()
    return new Date(t.getFullYear(), t.getMonth(), 1)
  })

  // Load recent workouts (for the list)
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('workouts')
        .select('*, workout_sets(*)')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5)
      setRecentWorkouts((data as WorkoutWithSets[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  // Load all workout dates for the calendar
  useEffect(() => {
    async function loadDates() {
      const { data } = await supabase.from('workouts').select('date')
      const counts: Record<string, number> = {}
      data?.forEach((w) => {
        counts[w.date] = (counts[w.date] ?? 0) + 1
      })
      setWorkoutCounts(counts)
    }
    loadDates()
  }, [])

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // ── Clock / quote ────────────────────────────────────────────────────────
  const timeLabel = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const quoteIndex = (Math.floor(now.getTime() / (5 * 60 * 1000)) + quoteOffset) % ARNOLD_QUOTES.length
  const quote = ARNOLD_QUOTES[quoteIndex]

  // ── Calendar helpers ─────────────────────────────────────────────────────
  const calYear = calMonth.getFullYear()
  const calMonthIdx = calMonth.getMonth()
  const daysInMonth = new Date(calYear, calMonthIdx + 1, 0).getDate()
  const firstDayOfWeek = new Date(calYear, calMonthIdx, 1).getDay()
  const calLabel = calMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const realToday = new Date()
  const todayStr = toDateStr(realToday.getFullYear(), realToday.getMonth(), realToday.getDate())
  const isCurrentMonth =
    calYear === realToday.getFullYear() && calMonthIdx === realToday.getMonth()

  function prevMonth() { setCalMonth(new Date(calYear, calMonthIdx - 1, 1)) }
  function nextMonth() { setCalMonth(new Date(calYear, calMonthIdx + 1, 1)) }
  function goToday()   { setCalMonth(new Date(realToday.getFullYear(), realToday.getMonth(), 1)) }

  // ── Recent workout helpers ───────────────────────────────────────────────
  const uniqueExercises = (sets: WorkoutSet[]) => [...new Set(sets.map((s) => s.exercise_name))]
  const totalVolume = (sets: WorkoutSet[]) =>
    sets.reduce((sum, s) => sum + (s.reps ?? 0) * (s.weight ?? 0), 0)

  return (
    <div className="space-y-6">

      {/* ── Clock & title ── */}
      <div className="text-center pt-2">
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">{dateLabel}</p>
        <p className="text-6xl font-bold tabular-nums tracking-tight mt-1 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
          {timeLabel}
        </p>
        <h1 className="text-lg font-semibold mt-2 flex items-center justify-center gap-2 text-zinc-300">
          <Flame className="text-orange-400" size={20} />
          GymMaster
        </h1>
      </div>

      {/* ── Arnold quote ── */}
      <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 px-5 pt-4 pb-5 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-orange-700 rounded-l-2xl" />
        <button
          onClick={() => setQuoteOffset((o) => (o + 1) % ARNOLD_QUOTES.length)}
          className="absolute top-3 right-3 p-1.5 rounded-full text-zinc-600 hover:text-orange-400 hover:bg-zinc-800 transition-colors"
          title="Next quote"
        >
          <RefreshCw size={14} />
        </button>
        <p className="text-orange-500 text-4xl font-serif leading-none select-none">&ldquo;</p>
        <p className="text-base italic text-zinc-200 leading-relaxed -mt-1">{quote}</p>
        <p className="text-xs font-medium text-orange-400 mt-3 tracking-wide uppercase">
          — Arnold Schwarzenegger
        </p>
      </div>

      {/* ── Start Workout ── */}
      <Link
        href="/log"
        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 active:bg-orange-600 transition-colors font-semibold text-white text-lg"
      >
        <PlusCircle size={22} />
        Start Workout
      </Link>

      {/* ── Workout Calendar ── */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">

        {/* Calendar header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-white">{calLabel}</span>
            {!isCurrentMonth && (
              <button
                onClick={goToday}
                className="text-[11px] font-semibold text-orange-400 border border-orange-500/40 hover:border-orange-400 px-2 py-0.5 rounded-full transition-colors"
              >
                Today
              </button>
            )}
          </div>

          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-medium text-zinc-600">
              {d[0]}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7">
          {/* Offset empty cells */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = toDateStr(calYear, calMonthIdx, day)
            const count = workoutCounts[dateStr] ?? 0
            const isToday = dateStr === todayStr

            return (
              <div key={day} className="flex flex-col items-center py-1 gap-0.5">
                {/* Day number */}
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors
                    ${isToday
                      ? 'bg-orange-500 text-white font-bold'
                      : count > 0
                        ? 'text-white'
                        : 'text-zinc-500'
                    }`}
                >
                  {day}
                </div>

                {/* Dumbbell + badge */}
                {count > 0 && (
                  <div className="relative flex items-center justify-center">
                    <Dumbbell size={13} className="text-orange-400" />
                    {count > 1 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-orange-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                        {count}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Recent Workouts ── */}
      <div>
        <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-3">
          Recent Workouts
        </h2>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-zinc-800 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && recentWorkouts.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <p>No workouts yet.</p>
            <p className="text-sm mt-1">Tap &quot;Start Workout&quot; to log your first session.</p>
          </div>
        )}

        <div className="space-y-3">
          {recentWorkouts.map((w) => {
            const exercises = uniqueExercises(w.workout_sets ?? [])
            const volume = totalVolume(w.workout_sets ?? [])
            const workoutDate = new Date(w.date + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric',
            })
            const startTime = w.started_at ? new Date(w.started_at) : new Date(w.created_at)
            const timeStr = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            const durationLabel = w.duration_seconds && w.duration_seconds > 0
              ? (w.duration_seconds < 3600
                  ? `${Math.round(w.duration_seconds / 60)} min`
                  : `${Math.floor(w.duration_seconds / 3600)}h ${Math.round((w.duration_seconds % 3600) / 60)}m`)
              : null

            return (
              <Link
                key={w.id}
                href={`/history?id=${w.id}`}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{workoutDate}</p>
                    <span className="flex items-center gap-1 text-zinc-500 text-xs">
                      <Clock size={10} /> {timeStr}
                    </span>
                    {durationLabel && (
                      <span className="flex items-center gap-1 text-orange-400 text-xs">
                        <Timer size={10} /> {durationLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-sm mt-0.5">
                    {exercises.length > 0
                      ? exercises.slice(0, 3).join(', ') + (exercises.length > 3 ? ` +${exercises.length - 3}` : '')
                      : 'No exercises'}
                  </p>
                  {volume > 0 && (
                    <p className="text-orange-400 text-xs mt-1">{volume.toLocaleString()} kg total volume</p>
                  )}
                </div>
                <ChevronRight size={18} className="text-zinc-600" />
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}
