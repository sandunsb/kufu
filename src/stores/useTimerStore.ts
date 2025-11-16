import { create } from 'zustand'

type Phase = 'work' | 'shortBreak' | 'longBreak'

interface TimerState {
  phase: Phase
  secondsLeft: number
  isRunning: boolean
  cycle: number          // 0-3 before long break
  start: () => void
  pause: () => void
  reset: () => void
  tick: () => void        // call every second
}

const WORK = 25 * 60
const SHORT = 5 * 60
const LONG  = 15 * 60

const nextPhase = (p: Phase, c: number): [Phase, number] => {
  if (p === 'work') {
    return c < 3 ? ['shortBreak', SHORT] : ['longBreak', LONG]
  }
  return ['work', WORK]
}

export const useTimerStore = create<TimerState>()((set, get) => ({
  phase: 'work',
  secondsLeft: WORK,
  isRunning: false,
  cycle: 0,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: () => set({ phase: 'work', secondsLeft: WORK, isRunning: false, cycle: 0 }),

  tick: () => {
    const s = get()
    if (!s.isRunning || s.secondsLeft === 0) return

    const left = s.secondsLeft - 1
    if (left > 0) return set({ secondsLeft: left })

    // phase finished
    const [newPhase, newDuration] = nextPhase(s.phase, s.cycle)
    const newCycle = newPhase === 'work' ? (s.cycle + 1) % 4 : s.cycle
    set({ phase: newPhase, secondsLeft: newDuration, cycle: newCycle })
  },
}))