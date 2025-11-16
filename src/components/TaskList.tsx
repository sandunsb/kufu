'use client'

import { useTaskStore } from '@/stores/useTaskStore'
import { useState } from 'react'

export default function TaskList() {
  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore()
  const [input, setInput] = useState('')

  const onAdd = () => {
    if (!input.trim()) return
    addTask(input.trim())
    setInput('')
  }

  return (
    <div className="w-full max-w-md mt-6">
      <form onSubmit={(e) => { e.preventDefault(); onAdd(); }} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What are you working on?"
          className="flex-1 px-3 py-2 rounded bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button type="submit" className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500">Add</button>
      </form>

      <ul className="mt-4 space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-3">
            <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
            <span className={`flex-1 ${t.done ? 'line-through opacity-50' : ''}`}>{t.title}</span>
            <span className="text-xs text-zinc-400">{t.pomos} 🍅</span>
            <button onClick={() => deleteTask(t.id)} className="text-xs text-red-400 hover:text-red-300">✕</button>
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="text-zinc-500 text-sm">No tasks yet—add one above.</li>
        )}
      </ul>
    </div>
  )
}