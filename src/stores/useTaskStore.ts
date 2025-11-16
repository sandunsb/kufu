import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Task {
  id: string
  title: string
  done: boolean
  pomos: number // how many completed on this task
}

interface TaskState {
  tasks: Task[]
  addTask: (title: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  incPomo: (id: string) => void // call when a work phase ends
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title) =>
        set((s) => ({
          tasks: [...s.tasks, { id: crypto.randomUUID(), title, done: false, pomos: 0 }],
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
    { name: 'kufu-tasks' } // localStorage key
  )
)