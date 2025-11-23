import { create } from 'zustand'
import { Howl } from 'howler'
import { useTimerStore } from './useTimerStore'

interface SoundState {
  on: boolean
  toggle: () => void
  playWork: () => void
  playBreak: () => void
  playAlarm: () => void
  stop: () => void
  _howl: Howl | null
}

export const useSoundStore = create<SoundState>()((set, get) => ({
  on: false,
  _howl: null,

  toggle: () => {
    const s = get()
    if (s.on) {
      s.stop()
      set({ on: false })
    } else {
      set({ on: true })
      // replay current phase right now
      const timer = useTimerStore.getState()
      if (timer.phase === 'work') {
        get().playWork()
      } else {
        get().playBreak()
      }
    }
  },
  stop: () => get()._howl?.stop(),

  playWork: () => {
    if (!get().on) return
    get().stop()
    const h = new Howl({
      src: ['/sounds/work.mp3'], // 2-min lo-fi loop
      loop: true,
      volume: 0.15,
    })
    h.play()
    set({ _howl: h })
  },

  playBreak: () => {
    if (!get().on) return
    get().stop()
    const h = new Howl({
      src: ['/sounds/break.mp3'], // soft nature
      loop: true,
      volume: 0.25,
    })
    h.play()
    set({ _howl: h })
  },

  playAlarm: () => {
    const h = new Howl({
      src: ['/sounds/alarm_wake_up.mp3'],
      volume: 0.5,
    })
    h.play()
  },
}))