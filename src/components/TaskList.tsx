'use client'

import { useTaskStore } from '@/stores/useTaskStore'
import { useState, useEffect } from 'react'

interface TaskListProps {
  theme: string
}

export default function TaskList({ theme }: TaskListProps) {
  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore()
  const [input, setInput] = useState('')
  const [estInput, setEstInput] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onAdd = () => {
    if (!input.trim()) return
    addTask(input.trim(), estInput)
    setInput('')
    setEstInput(1)
  }

  const getThemeStyles = () => {
    switch (theme) {
      case 'oled':
        return {
          input: 'bg-black border-green-900 text-green-400 placeholder-green-900 focus:ring-green-500',
          button: 'bg-green-900 text-green-100 hover:bg-green-800',
          item: 'border-green-900/50 hover:bg-green-900/10',
          text: 'text-green-400',
          subtext: 'text-green-700',
          checkbox: 'accent-green-500',
          delete: 'text-green-700 hover:text-green-500'
        }
      case 'e-ink':
        return {
          input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-gray-900',
          button: 'bg-gray-900 text-white hover:bg-gray-700',
          item: 'border-gray-200 hover:bg-gray-50',
          text: 'text-gray-900',
          subtext: 'text-gray-500',
          checkbox: 'accent-gray-900',
          delete: 'text-gray-400 hover:text-red-500'
        }
      default: // dark
        return {
          input: 'bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:ring-emerald-500',
          button: 'bg-emerald-600 text-white hover:bg-emerald-500',
          item: 'border-zinc-800 hover:bg-zinc-800/50',
          text: 'text-zinc-100',
          subtext: 'text-zinc-500',
          checkbox: 'accent-emerald-500',
          delete: 'text-zinc-600 hover:text-red-400'
        }
    }
  }

  const styles = getThemeStyles()

  return (
    <div className="w-full max-w-md mt-8">
      <form onSubmit={(e) => { e.preventDefault(); onAdd(); }} className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What are you working on?"
          className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${styles.input}`}
        />
        <input
          type="number"
          min="1"
          max="10"
          value={estInput}
          onChange={(e) => setEstInput(Number(e.target.value))}
          className={`w-20 px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-center ${styles.input}`}
          title="Estimated Pomodoros"
        />
        <button
          type="submit"
          className={`px-6 py-3 rounded-xl cursor-pointer font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${styles.button}`}
        >
          Add
        </button>
      </form>

      <ul className="mt-6 space-y-3">
        {mounted && tasks.map((t) => (
          <li
            key={t.id}
            className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${styles.item}`}
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTask(t.id)}
              className={`w-5 h-5 rounded cursor-pointer transition-colors ${styles.checkbox}`}
            />
            <span
              className={`flex-1 font-medium transition-opacity ${t.done ? 'line-through opacity-50' : ''} ${styles.text}`}
              style={{ fontFamily: 'Ranade, sans-serif' }}
            >
              {t.title}
            </span>
            <span className={`text-sm font-mono ${styles.subtext}`}>
              {t.pomos} / <span className="opacity-70">{t.estPomos || 1}</span> 🍅
            </span>
            <button
              onClick={() => deleteTask(t.id)}
              className={`opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all p-1 rounded hover:bg-red-500/10 ${styles.delete}`}
            >
              ✕
            </button>
          </li>
        ))}
        {(!mounted || tasks.length === 0) && (
          <li className={`text-center py-8 ${styles.subtext}`}>
            No tasks yet — add one above to stay focused.
          </li>
        )}
      </ul>
    </div>
  )
}