'use client'   // ← top of file

import { useEffect } from 'react'
import { useTimerStore } from '@/stores/useTimerStore'

export default function Home() {
  const { secondsLeft, isRunning, start, pause, tick, phase } = useTimerStore()

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isRunning, tick])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-zinc-100">
      <h1 className="text-6xl font-bold tabular-nums">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </h1>
      <p className="mt-2 text-sm uppercase tracking-widest text-zinc-400">{phase}</p>

      <div className="mt-8 flex gap-4">
        <button onClick={start}  className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500">Start</button>
        <button onClick={pause}  className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500">Pause</button>
      </div>
    </main>
  )
}