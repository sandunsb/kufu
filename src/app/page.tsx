'use client'

import { useEffect, useState } from 'react'
import { useTimerStore } from '@/stores/useTimerStore'
import { useHotkeys } from 'react-hotkeys-hook'
import TaskList from '@/components/TaskList'
import { useSoundStore } from '@/stores/useSoundStore'

export default function Home() {
  const { secondsLeft, isRunning, start, pause, tick, phase, reset } = useTimerStore()

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isRunning, tick])


  useHotkeys('space', () => (isRunning ? pause() : start()), [isRunning, start, pause])
  useHotkeys('r', () => reset(), [reset])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const [theme, setTheme] = useState('dark')
  const themes = ['dark', 'oled', 'e-ink']
  const { on, toggle } = useSoundStore()

  return (
    <main className={`flex flex-col items-center justify-center h-screen ${theme === 'oled' ? 'bg-black text-green-400' : theme === 'e-ink' ? 'bg-white text-gray-800' : 'bg-zinc-900 text-zinc-100'}`}>
      <h1 className="text-9xl font-bold tabular-nums">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </h1>
      <p className="mt-2 text-sm uppercase tracking-widest text-zinc-400">{phase}</p>

      <div className="mt-8 flex gap-4">
        <button onClick={start} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500">Start</button>
        <button onClick={pause} className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500">Pause</button>
      </div>

      <div className="mt-4 flex gap-2">
        {themes.map(t => (
          <button key={t} onClick={() => setTheme(t)} className={`px-3 py-1 rounded ${theme === t ? 'ring-2 ring-zinc-400' : ''}`}>{t}</button>
        ))}
      </div>
      <TaskList />
      <button onClick={toggle} className="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600">
        Sound {on ? 'ON' : 'OFF'}
      </button>
    </main>
  )
}