'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Workout, WorkoutSet } from '@/lib/types'
import { PlusCircle, ChevronRight, Flame, Clock, Timer } from 'lucide-react'

type WorkoutWithSets = Workout & { workout_sets: WorkoutSet[] }

export default function Dashboard() {
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutWithSets[]>([])
  const [loading, setLoading] = useState(true)

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

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const uniqueExercises = (sets: WorkoutSet[]) =>
    [...new Set(sets.map((s) => s.exercise_name))]

  const totalVolume = (sets: WorkoutSet[]) =>
    sets.reduce((sum, s) => sum + (s.reps ?? 0) * (s.weight ?? 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-zinc-500 text-sm">{today}</p>
        <h1 className="text-2xl font-bold mt-1 flex items-center gap-2">
          <Flame className="text-orange-400" size={24} />
          GymMaster
        </h1>
      </div>

      <Link
        href="/log"
        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 active:bg-orange-600 transition-colors font-semibold text-white text-lg"
      >
        <PlusCircle size={22} />
        Start Workout
      </Link>

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
            const dateLabel = new Date(w.date + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })

            const startTime = w.started_at ? new Date(w.started_at) : new Date(w.created_at)
            const timeLabel = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
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
                    <p className="font-medium">{dateLabel}</p>
                    <span className="flex items-center gap-1 text-zinc-500 text-xs">
                      <Clock size={10} /> {timeLabel}
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
