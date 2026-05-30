'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Exercise, Routine, RoutineExercise } from '@/lib/types'
import { Plus, Trash2, X, Search, ChevronDown, ChevronUp } from 'lucide-react'

type RoutineWithExercises = Routine & { routine_exercises: RoutineExercise[] }

export default function Routines() {
  const [routines, setRoutines] = useState<RoutineWithExercises[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // New routine modal
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)

  // Add exercise to routine modal
  const [addingTo, setAddingTo] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  async function load() {
    const [{ data: r }, { data: e }] = await Promise.all([
      supabase
        .from('routines')
        .select('*, routine_exercises(*, exercises(*))')
        .order('created_at', { ascending: false }),
      supabase.from('exercises').select('*').order('name'),
    ])
    setRoutines((r as RoutineWithExercises[]) ?? [])
    setExercises(e ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function createRoutine() {
    if (!newName.trim()) return
    setSaving(true)
    const { data } = await supabase
      .from('routines')
      .insert({ name: newName.trim() })
      .select()
      .single()
    if (data) {
      setRoutines((prev) => [{ ...data, routine_exercises: [] }, ...prev])
      setExpanded((prev) => ({ ...prev, [data.id]: true }))
    }
    setNewName('')
    setShowNew(false)
    setSaving(false)
  }

  async function deleteRoutine(id: string) {
    if (!confirm('Delete this routine?')) return
    await supabase.from('routines').delete().eq('id', id)
    setRoutines((prev) => prev.filter((r) => r.id !== id))
  }

  async function addExercise(routineId: string, ex: Exercise) {
    const routine = routines.find((r) => r.id === routineId)
    const alreadyAdded = routine?.routine_exercises.some((re) => re.exercise_id === ex.id)
    if (alreadyAdded) { setAddingTo(null); return }

    const sortOrder = (routine?.routine_exercises.length ?? 0)
    const { data } = await supabase
      .from('routine_exercises')
      .insert({
        routine_id: routineId,
        exercise_id: ex.id,
        exercise_name: ex.name,
        sort_order: sortOrder,
      })
      .select()
      .single()

    if (data) {
      setRoutines((prev) =>
        prev.map((r) =>
          r.id === routineId
            ? { ...r, routine_exercises: [...r.routine_exercises, data] }
            : r
        )
      )
    }
    setAddingTo(null)
    setSearch('')
  }

  async function removeExercise(routineId: string, reId: string) {
    await supabase.from('routine_exercises').delete().eq('id', reId)
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, routine_exercises: r.routine_exercises.filter((re) => re.id !== reId) }
          : r
      )
    )
  }

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  const filteredExercises = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Routines</h1>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 text-sm bg-orange-500 hover:bg-orange-400 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> New
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-zinc-800 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && routines.length === 0 && (
        <div className="text-center py-14 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
          <p>No routines yet.</p>
          <p className="text-sm mt-1">Create one to pre-load exercises when logging a workout.</p>
        </div>
      )}

      <div className="space-y-3">
        {routines.map((r) => {
          const isOpen = expanded[r.id]
          const sorted = [...r.routine_exercises].sort((a, b) => a.sort_order - b.sort_order)

          return (
            <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-4 cursor-pointer"
                onClick={() => toggle(r.id)}
              >
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-zinc-500 text-sm mt-0.5">
                    {r.routine_exercises.length} exercise{r.routine_exercises.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteRoutine(r.id) }}
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
                <div className="px-4 pb-4 border-t border-zinc-800 pt-3 space-y-2">
                  {sorted.length === 0 && (
                    <p className="text-zinc-600 text-sm py-2">No exercises yet. Add some below.</p>
                  )}
                  {sorted.map((re) => (
                    <div
                      key={re.id}
                      className="flex items-center justify-between py-2 border-b border-zinc-800/50"
                    >
                      <span className="text-sm">{re.exercise_name}</span>
                      <button
                        onClick={() => removeExercise(r.id, re.id)}
                        className="text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => { setAddingTo(r.id); setSearch('') }}
                    className="flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 transition-colors mt-1"
                  >
                    <Plus size={15} /> Add Exercise
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* New routine modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">New Routine</h2>
              <button onClick={() => setShowNew(false)} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Chest, Arms, Push Day..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createRoutine()}
              className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              onClick={createRoutine}
              disabled={!newName.trim() || saving}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold transition-colors"
            >
              {saving ? 'Creating...' : 'Create Routine'}
            </button>
          </div>
        </div>
      )}

      {/* Add exercise to routine modal */}
      {addingTo && (
        <div className="fixed inset-x-0 top-0 bottom-16 bg-black/70 z-50 flex items-end">
          <div className="bg-zinc-900 w-full max-w-lg mx-auto rounded-t-3xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <h2 className="font-semibold">Add Exercise</h2>
              <button onClick={() => setAddingTo(null)} className="text-zinc-400 hover:text-white">
                <X size={22} />
              </button>
            </div>
            <div className="px-5 py-3 border-b border-zinc-800">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search exercises..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredExercises.map((ex) => {
                const routine = routines.find((r) => r.id === addingTo)
                const already = routine?.routine_exercises.some((re) => re.exercise_id === ex.id)
                return (
                  <button
                    key={ex.id}
                    onClick={() => addExercise(addingTo, ex)}
                    disabled={already}
                    className={`w-full flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/50 text-left transition-colors ${
                      already
                        ? 'text-zinc-600 cursor-default'
                        : 'hover:bg-zinc-800'
                    }`}
                  >
                    <span>{ex.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                        {ex.category}
                      </span>
                      {already && <span className="text-xs text-zinc-600">added</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
