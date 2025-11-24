import { create } from 'zustand'

type Phase = 'work' | 'shortBreak' | 'longBreak'

interface TimerState {
  phase: Phase
  secondsLeft: number
  totalDuration: number
  isRunning: boolean
  isContinuous: boolean
  cycle: number
  start: () => void
  startContinuous: () => void
  pause: () => void
  reset: () => void
  tick: () => void
  setPhase: (phase: Phase) => void
}

const WORK = 25 * 60
const SHORT = 5 * 60
const LONG = 15 * 60

const nextPhase = (p: Phase, c: number): [Phase, number] => {
  if (p === 'work') {
    return c < 3 ? ['shortBreak', SHORT] : ['longBreak', LONG]
  }
  return ['work', WORK]
}

export const useTimerStore = create<TimerState>()((set, get) => ({
  phase: 'work',
  secondsLeft: WORK,
  totalDuration: WORK,
  isRunning: false,
  isContinuous: false,
  cycle: 0,

  start: () => {
    set({ isRunning: true, isContinuous: false })
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

  startContinuous: () => {
    set({ isRunning: true, isContinuous: true })
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
    const s = get()
    let duration = WORK
    if (s.phase === 'shortBreak') duration = SHORT
    if (s.phase === 'longBreak') duration = LONG

    set({ secondsLeft: duration, totalDuration: duration, isRunning: false })

    // play initial ambience if needed
    import('@/stores/useSoundStore').then(({ useSoundStore }) => {
      const snd = useSoundStore.getState()
      if (snd.on) {
        if (s.phase === 'work') snd.playWork()
        else snd.playBreak()
      }
    })
  },

  setPhase: (p: Phase) => {
    let duration = WORK
    if (p === 'shortBreak') duration = SHORT
    if (p === 'longBreak') duration = LONG
    set({ phase: p, secondsLeft: duration, totalDuration: duration, isRunning: false })
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

    import('@/stores/useSoundStore').then(({ useSoundStore }) => {
      useSoundStore.getState().playAlarm()
    })

    const shouldContinue = s.isContinuous
    set({
      phase: newPhase,
      secondsLeft: newDuration,
      totalDuration: newDuration,
      cycle: newCycle,
      isRunning: shouldContinue
    })

    if (shouldContinue) {
      import('@/stores/useSoundStore').then(({ useSoundStore }) => {
        const snd = useSoundStore.getState();
        if (newPhase === 'work') snd.playWork();
        else snd.playBreak();
      });
    } else {
      import('@/stores/useSoundStore').then(({ useSoundStore }) => {
        useSoundStore.getState().stop()
      })
    }
  },
}))