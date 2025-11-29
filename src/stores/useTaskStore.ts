import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Task {
  id: string
  title: string
  done: boolean
  pomos: number // how many completed on this task
  estPomos: number // estimated pomodoros
}

interface TaskState {
  tasks: Task[]
  addTask: (title: string, estPomos?: number) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  incPomo: (id: string) => void // call when a work phase ends
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title, estPomos = 1) =>
        set((s) => ({
          tasks: [...s.tasks, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, title, done: false, pomos: 0, estPomos }],
        })),
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),
      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      incPomo: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, pomos: t.pomos + 1 } : t)),
        })),
    }),
    { name: 'pomodrive-tasks' } // localStorage key
  )
)

