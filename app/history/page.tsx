'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Workout, WorkoutSet } from '@/lib/types'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'

type WorkoutWithSets = Workout & { workout_sets: WorkoutSet[] }

export default function History() {
  const [workouts, setWorkouts] = useState<WorkoutWithSets[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  async function load() {
    const { data } = await supabase
      .from('workouts')
      .select('*, workout_sets(*)')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    setWorkouts((data as WorkoutWithSets[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function deleteWorkout(id: string) {
    if (!confirm('Delete this workout?')) return
    await supabase.from('workouts').delete().eq('id', id)
    setWorkouts((prev) => prev.filter((w) => w.id !== id))
  }

  function groupSets(sets: WorkoutSet[]) {
    const map: Record<string, WorkoutSet[]> = {}
    sets.forEach((s) => {
      if (!map[s.exercise_name]) map[s.exercise_name] = []
      map[s.exercise_name].push(s)
    })
    return map
  }

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Workout History</h1>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-zinc-800 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && workouts.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          <p>No workouts logged yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {workouts.map((w) => {
          const isOpen = expanded[w.id]
          const grouped = groupSets(w.workout_sets ?? [])
          const exerciseNames = Object.keys(grouped)
          const dateLabel = new Date(w.date + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
          const totalSets = w.workout_sets?.length ?? 0
          const totalVolume = w.workout_sets?.reduce(
            (sum, s) => sum + (s.reps ?? 0) * (s.weight ?? 0), 0
          ) ?? 0

          return (
            <div key={w.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-4 cursor-pointer"
                onClick={() => toggle(w.id)}
              >
                <div>
                  <p className="font-semibold">{dateLabel}</p>
                  <p className="text-zinc-400 text-sm mt-0.5">
                    {exerciseNames.length} exercise{exerciseNames.length !== 1 ? 's' : ''} &middot; {totalSets} sets
                    {totalVolume > 0 && ` · ${totalVolume.toLocaleString()} kg`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteWorkout(w.id) }}
                    className="text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-zinc-500" />
                  ) : (
                    <ChevronDown size={18} className="text-zinc-500" />
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="px-4 pb-4 space-y-4 border-t border-zinc-800 pt-3">
                  {exerciseNames.map((name) => (
                    <div key={name}>
                      <p className="font-medium text-sm text-orange-400 mb-2">{name}</p>
                      <div className="space-y-1">
                        {grouped[name]
                          .sort((a, b) => a.set_number - b.set_number)
                          .map((s) => (
                            <div key={s.id} className="flex items-center gap-3 text-sm text-zinc-300">
                              <span className="text-zinc-600 w-4">{s.set_number}</span>
                              {s.reps != null && <span>{s.reps} reps</span>}
                              {s.weight != null && (
                                <span className="text-zinc-400">@ {s.weight} {s.weight_unit}</span>
                              )}
                              {s.reps != null && s.weight != null && (
                                <span className="text-zinc-600 text-xs">
                                  = {(s.reps * s.weight).toLocaleString()} {s.weight_unit}
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                  {w.notes && (
                    <p className="text-zinc-500 text-sm italic border-t border-zinc-800 pt-3">{w.notes}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
