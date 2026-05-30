'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Exercise, Category } from '@/lib/types'
import { Plus, Search, X } from 'lucide-react'

const CATEGORIES: Category[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other']

const CATEGORY_COLORS: Record<Category, string> = {
  Chest: 'bg-red-900/40 text-red-400',
  Back: 'bg-blue-900/40 text-blue-400',
  Legs: 'bg-green-900/40 text-green-400',
  Shoulders: 'bg-purple-900/40 text-purple-400',
  Arms: 'bg-yellow-900/40 text-yellow-400',
  Core: 'bg-orange-900/40 text-orange-400',
  Cardio: 'bg-cyan-900/40 text-cyan-400',
  Other: 'bg-zinc-800 text-zinc-400',
}

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState<Category>('Other')
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('exercises').select('*').order('category').order('name')
    setExercises(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = exercises.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' || e.category === activeCategory
    return matchSearch && matchCat
  })

  const grouped = CATEGORIES.reduce<Record<string, Exercise[]>>((acc, cat) => {
    const items = filtered.filter((e) => e.category === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  async function addExercise() {
    if (!newName.trim()) return
    setSaving(true)
    const { data } = await supabase
      .from('exercises')
      .insert({ name: newName.trim(), category: newCategory })
      .select()
      .single()
    if (data) setExercises((prev) => [...prev, data])
    setNewName('')
    setNewCategory('Other')
    setShowAdd(false)
    setSaving(false)
  }

  async function deleteExercise(id: string) {
    if (!confirm('Delete this exercise?')) return
    await supabase.from('exercises').delete().eq('id', id)
    setExercises((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Exercise Library</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 text-sm bg-orange-500 hover:bg-orange-400 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-zinc-800 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-center py-10 text-zinc-500 text-sm">No exercises found.</p>
      )}

      <div className="space-y-5">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{cat}</h2>
            <div className="space-y-1">
              {items.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between px-4 py-3 bg-zinc-900 rounded-xl border border-zinc-800"
                >
                  <span className="text-sm">{ex.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[ex.category as Category]}`}>
                      {ex.category}
                    </span>
                    <button
                      onClick={() => deleteExercise(ex.id)}
                      className="text-zinc-700 hover:text-red-400 transition-colors ml-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Add Exercise</h2>
              <button onClick={() => setShowAdd(false)} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <input
              autoFocus
              type="text"
              placeholder="Exercise name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addExercise()}
              className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Category</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      newCategory === cat
                        ? 'bg-orange-500 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={addExercise}
              disabled={!newName.trim() || saving}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold transition-colors"
            >
              {saving ? 'Adding...' : 'Add Exercise'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
