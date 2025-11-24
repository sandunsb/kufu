import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Howl } from 'howler'
import { useTimerStore } from './useTimerStore'

interface SoundState {
  on: boolean
  alarmSound: string
  workAmbience: string
  shortBreakAmbience: string
  longBreakAmbience: string

  toggle: () => void
  setAlarmSound: (sound: string) => void
  setWorkAmbience: (sound: string) => void
  setShortBreakAmbience: (sound: string) => void
  setLongBreakAmbience: (sound: string) => void

  playWork: () => void
  playBreak: () => void
  playAlarm: () => void
  playPreview: (sound: string, type: 'alarm' | 'ambience') => void
  stop: () => void
  _howl: Howl | null
  _previewTimeout: NodeJS.Timeout | null
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set, get) => ({
      on: false,
      alarmSound: 'basic-alarm.mp3',
      workAmbience: 'lofi/work.mp3',
      shortBreakAmbience: 'lofi/break.mp3',
      longBreakAmbience: 'lofi/break.mp3',
      _howl: null,
      _previewTimeout: null,

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

      setAlarmSound: (sound) => set({ alarmSound: sound }),
      setWorkAmbience: (sound) => set({ workAmbience: sound }),
      setShortBreakAmbience: (sound) => set({ shortBreakAmbience: sound }),
      setLongBreakAmbience: (sound) => set({ longBreakAmbience: sound }),

      stop: () => {
        const s = get()
        if (s._previewTimeout) {
          clearTimeout(s._previewTimeout)
          set({ _previewTimeout: null })
        }
        s._howl?.stop()
      },

      playWork: () => {
        if (!get().on) return
        get().stop()
        const s = get()
        const h = new Howl({
          src: [`/sounds/ambience/${s.workAmbience}`],
          loop: true,
          volume: 0.5,
        })
        h.play()
        set({ _howl: h })
      },

      playBreak: () => {
        if (!get().on) return
        get().stop()
        const s = get()
        const timer = useTimerStore.getState()
        const sound = timer.phase === 'shortBreak' ? s.shortBreakAmbience : s.longBreakAmbience

        const h = new Howl({
          src: [`/sounds/ambience/${sound}`],
          loop: true,
          volume: 0.5,
        })
        h.play()
        set({ _howl: h })
      },

      playAlarm: () => {
        const s = get()
        // Stop ambience before playing alarm
        get().stop()
        const h = new Howl({
          src: [`/sounds/alarms/${s.alarmSound}`],
          volume: 0.5,
        })
        h.play()
        set({ _howl: h })
      },

      playPreview: (sound: string, type: 'alarm' | 'ambience') => {
        // Stop any existing sounds/previews
        get().stop()

        const path = type === 'alarm'
          ? `/sounds/alarms/${sound}`
          : `/sounds/ambience/${sound}`

        const h = new Howl({
          src: [path],
          volume: 0.5,
          loop: type === 'ambience' // Loop ambience previews? Maybe not for preview, but user might want to hear loop. Let's keep it simple for now.
        })
        h.play()

        const timeout = setTimeout(() => {
          get().stop()
        }, 10000) // 10s max

        set({ _howl: h, _previewTimeout: timeout })
      },
    }),
    {
      name: 'sound-storage',
      partialize: (state) => ({
        on: state.on,
        alarmSound: state.alarmSound,
        workAmbience: state.workAmbience,
        shortBreakAmbience: state.shortBreakAmbience,
        longBreakAmbience: state.longBreakAmbience
      }),
    }
  )
)