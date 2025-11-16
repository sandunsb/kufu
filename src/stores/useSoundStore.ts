import { create } from 'zustand'
import { Howl } from 'howler'

interface SoundState {
  on: boolean
  toggle: () => void
  playWork: () => void
  playBreak: () => void
  stop: () => void
  _howl: Howl | null
}

export const useSoundStore = create<SoundState>()((set, get) => ({
  on: true,
  _howl: null,

  toggle: () => {
    const s = get()
    if (s.on) {
      s.stop()
    } else {
      set({ on: true })
    }
    set({ on: !s.on })
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
}))