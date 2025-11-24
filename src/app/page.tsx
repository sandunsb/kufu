'use client'

import { useEffect, useState } from 'react'
import { useTimerStore } from '@/stores/useTimerStore'
import { useTaskStore } from '@/stores/useTaskStore'
import { useHotkeys } from 'react-hotkeys-hook'
import TaskList from '@/components/TaskList'
import { useSoundStore } from '@/stores/useSoundStore'
import { Moon, Smartphone, FileText, Play, Pause, Infinity, Music, RefreshCcw, Settings, ChevronDown } from 'lucide-react'
import SettingsModal from '@/components/SettingsModal'

import Image from 'next/image'

import BackgroundEffects from '@/components/BackgroundEffects'

export default function Home() {
  const { secondsLeft, totalDuration, isRunning, start, startContinuous, pause, tick, phase, reset, setPhase } = useTimerStore()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isEffectMenuOpen, setIsEffectMenuOpen] = useState(false)

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isRunning, tick])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60

  const [theme, setTheme] = useState('e-ink')
  const [bgEffect, setBgEffect] = useState<'none' | 'zen' | 'progress'>('none')

  const { on, toggle } = useSoundStore()

  // Calculate progress
  const progress = secondsLeft / totalDuration

  useEffect(() => {
    const updateTitle = () => {
      const state = useTimerStore.getState()
      const mins = Math.floor(state.secondsLeft / 60)
      const secs = state.secondsLeft % 60
      const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

      const phaseMap: Record<string, string> = {
        work: 'Work',
        shortBreak: 'Short Break',
        longBreak: 'Long Break'
      }

      let phaseStr = phaseMap[state.phase] || 'Work'

      if (state.phase === 'work') {
        const tasks = useTaskStore.getState().tasks
        const activeTask = tasks.find(t => !t.done)
        if (activeTask) {
          phaseStr = activeTask.title
        }
      }

      document.title = `${timeStr} - ${phaseStr} | Pomodrive`
    }

    // Initial update
    updateTitle()

    const unsub = useTimerStore.subscribe(updateTitle)
    return () => {
      unsub()
      document.title = 'Pomodrive — Find Your Ingenious Rhythm'
    }
  }, [])

  // ... existing hotkeys ...

  const themeOptions = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'oled', label: 'OLED', icon: Smartphone },
    { id: 'e-ink', label: 'E-Ink', icon: FileText },
  ]

  const logoSrc = theme === 'e-ink' ? '/pomodrive_logo.png' : '/pomodrive_logo_white.png'

  return (
    <main className={`relative flex flex-col items-center justify-center min-h-screen w-full py-20 px-6 transition-colors duration-300 ${theme === 'oled' ? 'bg-black text-green-400' : theme === 'e-ink' ? 'bg-[#FCFAF8] text-gray-800' : 'bg-zinc-900 text-zinc-100'}`}>
      <BackgroundEffects effect={bgEffect} phase={phase} theme={theme} progress={progress} />

      <div className="absolute top-4 left-6 z-50">
        <div className="relative w-48 h-12">
          <Image
            src={logoSrc}
            alt="Pomodrive Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="absolute top-6 right-6 flex flex-col items-end gap-4 z-50">
        <div className="flex gap-2">
          {themeOptions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              title={label}
              className={`flex cursor-pointer items-center justify-center p-2 rounded-lg transition-colors ${theme === id ? (theme === 'oled' ? 'bg-green-900 text-green-100' : theme === 'e-ink' ? 'bg-gray-900 text-white' : 'bg-zinc-700 text-white') : (theme === 'oled' ? 'text-green-700 hover:bg-green-900/30' : theme === 'e-ink' ? 'text-gray-400 hover:bg-gray-200' : 'text-zinc-500 hover:bg-zinc-800')}`}
            >
              <Icon size={20} />
            </button>
          ))}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`flex cursor-pointer items-center justify-center p-2 rounded-lg transition-colors ${theme === 'oled' ? 'text-green-700 hover:bg-green-900/30' : theme === 'e-ink' ? 'text-gray-400 hover:bg-gray-200' : 'text-zinc-500 hover:bg-zinc-800'}`}
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsEffectMenuOpen(!isEffectMenuOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'oled' ? 'text-green-700 hover:bg-green-900/30' : theme === 'e-ink' ? 'text-gray-500 hover:bg-gray-200' : 'text-zinc-500 hover:bg-zinc-800'}`}
          >
            <span>{bgEffect === 'none' ? 'No Effect' : bgEffect === 'zen' ? 'Zen Patterns' : 'Progress Border'}</span>
            <ChevronDown size={16} />
          </button>

          {isEffectMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsEffectMenuOpen(false)} />
              <div className={`absolute top-full right-0 mt-2 w-40 py-1 rounded-xl border shadow-xl z-50 overflow-hidden ${theme === 'oled' ? 'bg-black border-green-900' : theme === 'e-ink' ? 'bg-white border-gray-200' : 'bg-zinc-900 border-zinc-800'}`}>
                {[
                  { id: 'none', label: 'No Effect' },
                  { id: 'zen', label: 'Zen Patterns' },
                  { id: 'progress', label: 'Progress Border' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setBgEffect(opt.id as any)
                      setIsEffectMenuOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${bgEffect === opt.id
                      ? (theme === 'oled' ? 'bg-green-900/30 text-green-400' : theme === 'e-ink' ? 'bg-gray-100 text-gray-900' : 'bg-zinc-800 text-white')
                      : (theme === 'oled' ? 'text-green-700 hover:bg-green-900/20 hover:text-green-500' : theme === 'e-ink' ? 'text-gray-500 hover:bg-gray-50 hover:text-gray-900' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200')
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} theme={theme} />

      <div className="relative z-10 mt-24 flex gap-2">
        <button
          onClick={() => setPhase('work')}
          className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors ${phase === 'work' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
        >
          Work
        </button>
        <button
          onClick={() => setPhase('shortBreak')}
          className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors ${phase === 'shortBreak' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
        >
          Short Break
        </button>
        <button
          onClick={() => setPhase('longBreak')}
          className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors ${phase === 'longBreak' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
        >
          Long Break
        </button>
      </div>

      <h1 className="text-9xl font-bold tabular-nums relative z-10 mt-8">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </h1>
      <p className="mt-2 text-sm uppercase tracking-widest text-zinc-400 relative z-10">{phase}</p>

      <div className="mt-8 flex flex-col items-center gap-4 relative z-10">
        <div className="flex gap-4">
          {!isRunning ? (
            <button
              onClick={start}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all hover:scale-105 active:scale-95"
            >
              <Play size={20} fill="currentColor" />
              Start
            </button>
          ) : (
            <button
              onClick={pause}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-medium transition-all hover:scale-105 active:scale-95"
            >
              <Pause size={20} fill="currentColor" />
              Pause
            </button>
          )}

          <button
            onClick={reset}
            className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-all hover:scale-105 active:scale-95"
            title="Reset Timer"
          >
            <RefreshCcw size={20} />
          </button>
        </div>

        {!isRunning && (
          <button
            onClick={startContinuous}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 text-sm transition-colors"
          >
            <Infinity size={16} />
            Start Continuous
          </button>
        )}
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <TaskList theme={theme} />
      </div>

      <div className="fixed bottom-6 right-6 flex items-center gap-3 z-50">
        <div className="flex items-center gap-2 text-zinc-500">
          <Music size={16} />
          <span className="text-sm uppercase tracking-widest font-medium">Ambient</span>
        </div>
        <button
          onClick={toggle}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${on ? 'bg-emerald-600' : 'bg-zinc-700'}`}
        >
          <span
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${on ? 'translate-x-6' : 'translate-x-0'}`}
          />
        </button>
      </div>
    </main>
  )
}