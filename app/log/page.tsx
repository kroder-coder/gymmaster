'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Exercise, LoggedExercise, LoggedSet, Routine, RoutineExercise } from '@/lib/types'
import { Plus, Trash2, Check, X, Search, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'

const CATEGORIES = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other']

type RoutineWithExercises = Routine & { routine_exercises: RoutineExercise[] }

type Segment =
  | { type: 'routine'; name: string; items: { ex: LoggedExercise; idx: number }[] }
  | { type: 'solo'; ex: LoggedExercise; idx: number }

function emptySet(): LoggedSet {
  return { reps: '', weight: '', weight_unit: 'kg' }
}

export default function LogWorkout() {
  const router = useRouter()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [routines, setRoutines] = useState<RoutineWithExercises[]>([])
  const [logged, setLogged] = useState<LoggedExercise[]>([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [showRoutinePicker, setShowRoutinePicker] = useState(false)
  const [selectedRoutines, setSelectedRoutines] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})

  useEffect(() => {
    Promise.all([
      supabase.from('exercises').select('*').order('name'),
      supabase.from('routines').select('*, routine_exercises(*)').order('name'),
    ]).then(([{ data: ex }, { data: r }]) => {
      setExercises(ex ?? [])
      setRoutines((r as RoutineWithExercises[]) ?? [])
    })
  }, [])

  // Group logged exercises into segments: routine groups and solo exercises
  const segments = useMemo<Segment[]>(() => {
    const result: Segment[] = []
    const seen = new Map<string, { type: 'routine'; name: string; items: { ex: LoggedExercise; idx: number }[] }>()
    logged.forEach((ex, idx) => {
      if (ex.routineName) {
        if (!seen.has(ex.routineName)) {
          const seg: Segment & { type: 'routine' } = { type: 'routine', name: ex.routineName, items: [{ ex, idx }] }
          seen.set(ex.routineName, seg)
          result.push(seg)
        } else {
          seen.get(ex.routineName)!.items.push({ ex, idx })
        }
      } else {
        result.push({ type: 'solo', ex, idx })
      }
    })
    return result
  }, [logged])

  const filtered = exercises.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || e.category === activeCategory
    return matchesSearch && matchesCategory
  })

  function addExercise(ex: Exercise) {
    setLogged((prev) => [...prev, { exercise_id: ex.id, exercise_name: ex.name, sets: [emptySet()] }])
    setShowPicker(false)
    setSearch('')
  }

  function loadRoutines() {
    const toAdd: LoggedExercise[] = []
    const existingIds = new Set(logged.map((l) => l.exercise_id))
    selectedRoutines.forEach((routineId) => {
      const routine = routines.find((r) => r.id === routineId)
      if (!routine) return
      const sorted = [...routine.routine_exercises].sort((a, b) => a.sort_order - b.sort_order)
      sorted.forEach((re) => {
        if (!existingIds.has(re.exercise_id)) {
          toAdd.push({ exercise_id: re.exercise_id, exercise_name: re.exercise_name, sets: [emptySet()], routineName: routine.name })
          existingIds.add(re.exercise_id)
        }
      })
    })
    setLogged((prev) => [...prev, ...toAdd])
    setSelectedRoutines(new Set())
    setShowRoutinePicker(false)
  }

  function toggleRoutineSelection(id: string) {
    setSelectedRoutines((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function removeExercise(i: number) {
    setLogged((prev) => prev.filter((_, idx) => idx !== i))
  }

  function addSet(exIdx: number) {
    setLogged((prev) =>
      prev.map((ex, i) => (i === exIdx ? { ...ex, sets: [...ex.sets, emptySet()] } : ex))
    )
  }

  function removeSet(exIdx: number, setIdx: number) {
    setLogged((prev) =>
      prev.map((ex, i) =>
        i === exIdx ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIdx) } : ex
      )
    )
  }

  function updateSet(exIdx: number, setIdx: number, field: keyof LoggedSet, value: string) {
    setLogged((prev) =>
      prev.map((ex, i) =>
        i === exIdx
          ? { ...ex, sets: ex.sets.map((s, j) => (j === setIdx ? { ...s, [field]: value } : s)) }
          : ex
      )
    )
  }

  async function save() {
    if (logged.length === 0) return
    setSaving(true)

    const { data: workout, error } = await supabase
      .from('workouts')
      .insert({ date: new Date().toISOString().split('T')[0], notes: notes || null })
      .select()
      .single()

    if (error || !workout) {
      alert('Failed to save workout. Check your Supabase connection.')
      setSaving(false)
      return
    }

    const baseRow = (ex: LoggedExercise, s: LoggedSet, j: number) => ({
      workout_id: workout.id,
      exercise_id: ex.exercise_id,
      exercise_name: ex.exercise_name,
      set_number: j + 1,
      reps: s.reps ? parseInt(s.reps) : null,
      weight: s.weight ? parseFloat(s.weight) : null,
      weight_unit: s.weight_unit,
    })

    const rowsWithRoutine = logged.flatMap((ex) =>
      ex.sets.map((s, j) => ({ ...baseRow(ex, s, j), routine_name: ex.routineName ?? null }))
    )

    let { error: setsError } = await supabase.from('workout_sets').insert(rowsWithRoutine)

    // If routine_name column doesn't exist yet (migration not run), retry without it
    if (setsError) {
      const rowsWithout = logged.flatMap((ex) => ex.sets.map((s, j) => baseRow(ex, s, j)))
      const { error: retryError } = await supabase.from('workout_sets').insert(rowsWithout)
      if (retryError) {
        await supabase.from('workouts').delete().eq('id', workout.id)
        alert('Failed to save sets: ' + retryError.message)
        setSaving(false)
        return
      }
    }

    router.push('/')
  }

  const toggle = (i: number) => setCollapsed((prev) => ({ ...prev, [i]: !prev[i] }))

  function renderExerciseCard(ex: LoggedExercise, exIdx: number, insideRoutine = false) {
    return (
      <div
        key={exIdx}
        className={`rounded-xl border overflow-hidden ${
          insideRoutine ? 'bg-zinc-900/80 border-zinc-700/60' : 'bg-zinc-900 border-zinc-800'
        }`}
      >
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer"
          onClick={() => toggle(exIdx)}
        >
          <span className="font-semibold">{ex.exercise_name}</span>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-sm">{ex.sets.length} set{ex.sets.length !== 1 ? 's' : ''}</span>
            {collapsed[exIdx] ? <ChevronDown size={16} className="text-zinc-500" /> : <ChevronUp size={16} className="text-zinc-500" />}
            <button
              onClick={(e) => { e.stopPropagation(); removeExercise(exIdx) }}
              className="text-zinc-600 hover:text-red-400 transition-colors ml-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {!collapsed[exIdx] && (
          <div className="px-4 pb-4 space-y-2">
            <div className="grid grid-cols-12 gap-2 text-xs text-zinc-500 font-medium px-1">
              <span className="col-span-1">#</span>
              <span className="col-span-4">Reps</span>
              <span className="col-span-5">Weight</span>
              <span className="col-span-2"></span>
            </div>
            {ex.sets.map((s, setIdx) => (
              <div key={setIdx} className="grid grid-cols-12 gap-2 items-center">
                <span className="col-span-1 text-zinc-600 text-sm">{setIdx + 1}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={s.reps}
                  onChange={(e) => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                  className="col-span-4 bg-zinc-800 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <div className="col-span-5 flex gap-1">
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="0"
                    value={s.weight}
                    onChange={(e) => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                    className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => updateSet(exIdx, setIdx, 'weight_unit', s.weight_unit === 'kg' ? 'lbs' : 'kg')}
                    className="text-xs bg-zinc-700 hover:bg-zinc-600 rounded-lg px-2 py-2 text-zinc-300 transition-colors whitespace-nowrap"
                  >
                    {s.weight_unit}
                  </button>
                </div>
                <button
                  onClick={() => removeSet(exIdx, setIdx)}
                  className="col-span-2 flex justify-center text-zinc-700 hover:text-red-400 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addSet(exIdx)}
              className="flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 transition-colors mt-1"
            >
              <Plus size={15} /> Add Set
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Log Workout</h1>
        <span className="text-zinc-500 text-sm">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {routines.length > 0 && (
        <button
          onClick={() => { setShowRoutinePicker(true); setSelectedRoutines(new Set()) }}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-sm font-medium"
        >
          <BookOpen size={16} />
          Load from Routine
        </button>
      )}

      {logged.length === 0 && (
        <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
          <p>No exercises added yet.</p>
          <p className="text-sm mt-1">Load a routine or add exercises manually.</p>
        </div>
      )}

      <div className="space-y-3">
        {segments.map((seg, segIdx) =>
          seg.type === 'solo' ? (
            renderExerciseCard(seg.ex, seg.idx)
          ) : (
            <div
              key={seg.name + segIdx}
              className="rounded-2xl border border-orange-500/25 bg-orange-500/5 p-3 space-y-2"
            >
              <div className="flex items-center gap-2 px-1 pb-1">
                <BookOpen size={14} className="text-orange-400 shrink-0" />
                <span className="text-sm font-semibold text-orange-400">{seg.name}</span>
                <span className="text-xs text-zinc-600 ml-auto">{seg.items.length} exercise{seg.items.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="space-y-2">
                {seg.items.map(({ ex, idx }) => renderExerciseCard(ex, idx, true))}
              </div>
            </div>
          )
        )}
      </div>

      <button
        onClick={() => setShowPicker(true)}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-zinc-700 hover:border-orange-500 text-zinc-400 hover:text-orange-400 transition-colors"
      >
        <Plus size={18} /> Add Exercise
      </button>

      <textarea
        placeholder="Notes (optional)..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
      />

      <button
        onClick={save}
        disabled={logged.length === 0 || saving}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors font-semibold text-white"
      >
        <Check size={20} />
        {saving ? 'Saving...' : 'Save Workout'}
      </button>

      {/* Routine picker modal */}
      {showRoutinePicker && (
        <div className="fixed inset-x-0 top-0 bottom-16 bg-black/70 z-50 flex items-end">
          <div className="bg-zinc-900 w-full max-w-lg mx-auto rounded-t-3xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <h2 className="font-semibold text-lg">Load Routines</h2>
              <button onClick={() => setShowRoutinePicker(false)} className="text-zinc-400 hover:text-white">
                <X size={22} />
              </button>
            </div>
            <p className="text-zinc-500 text-sm px-5 pt-3">Select one or more routines to load.</p>
            <div className="overflow-y-auto flex-1 px-5 py-3 space-y-2">
              {routines.map((r) => {
                const selected = selectedRoutines.has(r.id)
                const sorted = [...r.routine_exercises].sort((a, b) => a.sort_order - b.sort_order)
                return (
                  <button
                    key={r.id}
                    onClick={() => toggleRoutineSelection(r.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-colors ${
                      selected ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{r.name}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`}>
                        {selected && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                    {sorted.length > 0 && (
                      <p className="text-zinc-500 text-xs mt-1">{sorted.map((re) => re.exercise_name).join(', ')}</p>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="px-5 py-4 border-t border-zinc-800">
              <button
                onClick={loadRoutines}
                disabled={selectedRoutines.size === 0}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold transition-colors"
              >
                Load {selectedRoutines.size > 0 ? `${selectedRoutines.size} Routine${selectedRoutines.size > 1 ? 's' : ''}` : 'Routine'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise picker modal */}
      {showPicker && (
        <div className="fixed inset-x-0 top-0 bottom-16 bg-black/70 z-50 flex items-end">
          <div className="bg-zinc-900 w-full max-w-lg mx-auto rounded-t-3xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <h2 className="font-semibold text-lg">Add Exercise</h2>
              <button onClick={() => setShowPicker(false)} className="text-zinc-400 hover:text-white">
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
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {['All', ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === cat ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 && <p className="text-center text-zinc-500 py-8 text-sm">No exercises found.</p>}
              {filtered.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => addExercise(ex)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800 transition-colors border-b border-zinc-800/50 text-left"
                >
                  <span>{ex.name}</span>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{ex.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
