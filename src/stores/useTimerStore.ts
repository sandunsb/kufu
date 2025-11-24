import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Phase = 'work' | 'shortBreak' | 'longBreak'

interface TimerState {
  phase: Phase
  secondsLeft: number
  totalDuration: number
  isRunning: boolean
  isContinuous: boolean
  cycle: number

  // Settings
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number

  start: () => void
  startContinuous: () => void
  pause: () => void
  reset: () => void
  tick: () => void
  setPhase: (phase: Phase) => void
  setDurations: (work: number, short: number, long: number) => void
}

const nextPhase = (p: Phase, c: number, work: number, short: number, long: number): [Phase, number] => {
  if (p === 'work') {
    return c < 3 ? ['shortBreak', short] : ['longBreak', long]
  }
  return ['work', work]
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      phase: 'work',
      workDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      secondsLeft: 25 * 60,
      totalDuration: 25 * 60,
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
        let duration = s.workDuration
        if (s.phase === 'shortBreak') duration = s.shortBreakDuration
        if (s.phase === 'longBreak') duration = s.longBreakDuration

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
        const s = get()
        let duration = s.workDuration
        if (p === 'shortBreak') duration = s.shortBreakDuration
        if (p === 'longBreak') duration = s.longBreakDuration
        set({ phase: p, secondsLeft: duration, totalDuration: duration, isRunning: false })
      },

      setDurations: (work, short, long) => {
        set({ workDuration: work, shortBreakDuration: short, longBreakDuration: long })
        // Optionally reset current timer if needed, but for now just update settings
      },

      tick: () => {
        const s = get()
        if (!s.isRunning || s.secondsLeft === 0) return

        const left = s.secondsLeft - 1
        if (left > 0) return set({ secondsLeft: left })

        // phase finished
        const [newPhase, newDuration] = nextPhase(s.phase, s.cycle, s.workDuration, s.shortBreakDuration, s.longBreakDuration)
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
    }),
    {
      name: 'timer-storage',
      partialize: (state) => ({
        workDuration: state.workDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.phase === 'work' && !state.isRunning) {
          state.secondsLeft = state.workDuration
          state.totalDuration = state.workDuration
        }
      }
    }
  )
)