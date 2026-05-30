export type Category = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio' | 'Other'

export interface Exercise {
  id: string
  name: string
  category: Category
  created_at: string
}

export interface Workout {
  id: string
  date: string
  notes: string | null
  created_at: string
  workout_sets?: WorkoutSet[]
}

export interface WorkoutSet {
  id: string
  workout_id: string
  exercise_id: string
  exercise_name: string
  routine_name: string | null
  set_number: number
  reps: number | null
  weight: number | null
  weight_unit: 'kg' | 'lbs'
  duration_seconds: number | null
  distance_meters: number | null
  created_at: string
}

export interface LoggedExercise {
  exercise_id: string
  exercise_name: string
  sets: LoggedSet[]
  routineName?: string
}

export interface LoggedSet {
  reps: string
  weight: string
  weight_unit: 'kg' | 'lbs'
}

export interface Routine {
  id: string
  name: string
  created_at: string
  routine_exercises?: RoutineExercise[]
}

export interface RoutineExercise {
  id: string
  routine_id: string
  exercise_id: string
  exercise_name: string
  sort_order: number
}
