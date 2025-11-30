'use client'

import { useEffect, useState } from 'react'
import { useTimerStore } from '@/stores/useTimerStore'
import { useTaskStore } from '@/stores/useTaskStore'
import { useHotkeys } from 'react-hotkeys-hook'
import TaskList from '@/components/TaskList'
import { useSoundStore } from '@/stores/useSoundStore'
import { usePreferenceStore } from '@/stores/usePreferenceStore'
import { Moon, Smartphone, FileText, Play, Pause, Infinity, Music, RefreshCcw, Settings, ChevronDown } from 'lucide-react'
import SettingsModal from '@/components/SettingsModal'

import Image from 'next/image'

import BackgroundEffects from '@/components/BackgroundEffects'

export default function Home() {
  const { secondsLeft, totalDuration, isRunning, start, startContinuous, pause, tick, phase, reset, setPhase } = useTimerStore()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isEffectMenuOpen, setIsEffectMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isRunning, tick])

  const { theme, setTheme, bgEffect, setBgEffect } = usePreferenceStore()
  const { on, toggle, playClick, playReset } = useSoundStore()

  // Hydration mismatch fix: Use defaults until mounted
  const activeTheme = mounted ? theme : 'e-ink'
  const activeBgEffect = mounted ? bgEffect : 'none'
  const activePhase = mounted ? phase : 'work'
  const activeSecondsLeft = mounted ? secondsLeft : 25 * 60
  const activeTotalDuration = mounted ? totalDuration : 25 * 60
  const activeIsRunning = mounted ? isRunning : false

  const mins = Math.floor(activeSecondsLeft / 60)
  const secs = activeSecondsLeft % 60

  // Calculate progress
  const progress = activeSecondsLeft / activeTotalDuration

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

    const unsubTimer = useTimerStore.subscribe(updateTitle)
    const unsubTasks = useTaskStore.subscribe(updateTitle)

    return () => {
      unsubTimer()
      unsubTasks()
      document.title = 'Pomodrive — Find Your Ingenious Rhythm'
    }
  }, [])

  // Hotkeys
  useHotkeys('space', () => {
    if (isRunning) {
      pause()
    } else {
      start()
    }
    playClick()
  })

  useHotkeys('r', () => {
    reset()
    playReset()
  }, { enableOnFormTags: ['input', 'textarea'] })

  const themeOptions = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'oled', label: 'OLED', icon: Smartphone },
    { id: 'e-ink', label: 'E-Ink', icon: FileText },
  ]

  const logoSrc = activeTheme === 'e-ink' ? '/pomodrive_logo.png' : '/pomodrive_logo_white.png'

  return (
    <main className={`relative flex flex-col items-center justify-center min-h-screen w-full py-20 px-6 transition-colors duration-300 ${activeTheme === 'oled' ? 'bg-black text-green-400' : activeTheme === 'e-ink' ? 'bg-[#FCFAF8] text-gray-800' : 'bg-zinc-900 text-zinc-100'}`}>
      <BackgroundEffects effect={activeBgEffect} phase={activePhase} theme={activeTheme} progress={progress} />

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
              onClick={() => setTheme(id as any)}
              title={label}
              className={`flex cursor-pointer items-center justify-center p-2 rounded-lg transition-colors ${activeTheme === id ? (activeTheme === 'oled' ? 'bg-green-900 text-green-100' : activeTheme === 'e-ink' ? 'bg-gray-900 text-white' : 'bg-zinc-700 text-white') : (activeTheme === 'oled' ? 'text-green-700 hover:bg-green-900/30' : activeTheme === 'e-ink' ? 'text-gray-400 hover:bg-gray-200' : 'text-zinc-500 hover:bg-zinc-800')}`}
            >
              <Icon size={20} />
            </button>
          ))}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`flex cursor-pointer items-center justify-center p-2 rounded-lg transition-colors ${activeTheme === 'oled' ? 'text-green-700 hover:bg-green-900/30' : activeTheme === 'e-ink' ? 'text-gray-400 hover:bg-gray-200' : 'text-zinc-500 hover:bg-zinc-800'}`}
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsEffectMenuOpen(!isEffectMenuOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTheme === 'oled' ? 'text-green-700 hover:bg-green-900/30' : activeTheme === 'e-ink' ? 'text-gray-500 hover:bg-gray-200' : 'text-zinc-500 hover:bg-zinc-800'}`}
          >
            <span>{activeBgEffect === 'none' ? 'No Effect' : activeBgEffect === 'zen' ? 'Zen Patterns' : activeBgEffect === 'progress' ? 'Progress Border' : activeBgEffect.charAt(0).toUpperCase() + activeBgEffect.slice(1)}</span>
            <ChevronDown size={16} />
          </button>

          {isEffectMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsEffectMenuOpen(false)} />
              <div className={`absolute top-full right-0 mt-2 w-40 py-1 rounded-xl border shadow-xl z-50 overflow-hidden ${activeTheme === 'oled' ? 'bg-black border-green-900' : activeTheme === 'e-ink' ? 'bg-white border-gray-200' : 'bg-zinc-900 border-zinc-800'}`}>
                {[
                  { id: 'none', label: 'No Effect' },
                  { id: 'zen', label: 'Zen Patterns' },
                  { id: 'progress', label: 'Progress Border' },
                  { id: 'pulse', label: 'Pulse' },
                  { id: 'rain', label: 'Rain' },
                  { id: 'fireflies', label: 'Fireflies' },
                  { id: 'particles', label: 'Particles' },
                  { id: 'snow', label: 'Snow' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setBgEffect(opt.id as any)
                      setIsEffectMenuOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeBgEffect === opt.id
                      ? (activeTheme === 'oled' ? 'bg-green-900/30 text-green-400' : activeTheme === 'e-ink' ? 'bg-gray-100 text-gray-900' : 'bg-zinc-800 text-white')
                      : (activeTheme === 'oled' ? 'text-green-700 hover:bg-green-900/20 hover:text-green-500' : activeTheme === 'e-ink' ? 'text-gray-500 hover:bg-gray-50 hover:text-gray-900' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200')
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

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} theme={activeTheme} />

      <div className="relative z-10 mt-24 flex gap-2">
        <button
          onClick={() => setPhase('work')}
          className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors ${activePhase === 'work' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
        >
          Work
        </button>
        <button
          onClick={() => setPhase('shortBreak')}
          className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors ${activePhase === 'shortBreak' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
        >
          Short Break
        </button>
        <button
          onClick={() => setPhase('longBreak')}
          className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors ${activePhase === 'longBreak' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
        >
          Long Break
        </button>
      </div>

      <h1 className="text-9xl font-bold tabular-nums relative z-10 mt-8">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </h1>
      <p className="mt-2 text-sm uppercase tracking-widest text-zinc-400 relative z-10">{activePhase}</p>

      <div className="mt-8 flex flex-col items-center gap-4 relative z-10">
        <div className="flex gap-4">
          {!activeIsRunning ? (
            <button
              onClick={() => {
                start()
                playClick()
              }}
              className="cursor-pointer flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition-all shadow-[0_4px_0_rgb(4,120,87)] active:shadow-none active:translate-y-[4px]"
            >
              <Play size={24} fill="currentColor" />
              START
            </button>
          ) : (
            <button
              onClick={() => {
                pause()
                playClick()
              }}
              className="cursor-pointer flex items-center gap-2 px-8 py-4 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg transition-all shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px]"
            >
              <Pause size={24} fill="currentColor" />
              PAUSE
            </button>
          )}

          <button
            onClick={() => {
              reset()
              playReset()
            }}
            className="cursor-pointer flex items-center justify-center w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all shadow-[0_4px_0_rgb(55,65,81)] active:shadow-none active:translate-y-[4px]"
            title="Reset Timer"
          >
            <RefreshCcw size={24} />
          </button>
        </div>

        {!activeIsRunning && (
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
        <TaskList theme={activeTheme} />
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