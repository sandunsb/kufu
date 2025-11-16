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

const WORK = 0.3 * 60
const SHORT = 0.1 * 60
const LONG  = 0.2 * 60

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

  start: () => {
   set({ isRunning: true })
    import('@/stores/useSoundStore').then(({ useSoundStore }) => {
      const snd = useSoundStore.getState()
      const phase = useTimerStore.getState().phase
      if (snd.on) {
        if (phase === 'work') {
          snd.playWork();
        } else {
          snd.playBreak();
        }
      }
    })
  },
  pause: () => set({ isRunning: false }),
  reset: () => {
    set({ phase: 'work', secondsLeft: WORK, isRunning: false, cycle: 0 })
    // play initial ambience
    import('@/stores/useSoundStore').then(({ useSoundStore }) => {
      const snd = useSoundStore.getState()
      if (snd.on) snd.playWork()
    })
  },

  tick: () => {
    const s = get()
    if (!s.isRunning || s.secondsLeft === 0) return

    const left = s.secondsLeft - 1
    if (left > 0) return set({ secondsLeft: left })

    // phase finished
    const [newPhase, newDuration] = nextPhase(s.phase, s.cycle)
    const newCycle = newPhase === 'work' ? (s.cycle + 1) % 4 : s.cycle

    if (s.phase === 'work') {
      import('@/stores/useTaskStore').then(({ useTaskStore }) => {
        const tasks = useTaskStore.getState().tasks
        const active = tasks.find((t) => !t.done)
        if (active) useTaskStore.getState().incPomo(active.id)
      })
    }

    set({ phase: newPhase, secondsLeft: newDuration, cycle: newCycle })

    import('@/stores/useSoundStore').then(({ useSoundStore }) => {
      const snd = useSoundStore.getState();
      if (newPhase === 'work') snd.playWork();
      else snd.playBreak();
    });
  },
}))