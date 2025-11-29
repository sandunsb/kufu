import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'oled' | 'e-ink'
export type BgEffect = 'none' | 'zen' | 'progress' | 'pulse' | 'rain' | 'particles'

interface PreferenceState {
  theme: Theme
  bgEffect: BgEffect
  setTheme: (theme: Theme) => void
  setBgEffect: (effect: BgEffect) => void
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      theme: 'e-ink',
      bgEffect: 'none',
      setTheme: (theme) => set({ theme }),
      setBgEffect: (bgEffect) => set({ bgEffect }),
    }),
    {
      name: 'preference-storage',
    }
  )
)
