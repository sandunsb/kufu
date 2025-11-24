'use client'

import { useState, useEffect } from 'react'
import { X, Clock, Volume2, ChevronDown } from 'lucide-react'
import { useTimerStore } from '@/stores/useTimerStore'
import { useSoundStore } from '@/stores/useSoundStore'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  theme: string
}

export default function SettingsModal({ isOpen, onClose, theme }: SettingsModalProps) {
  const { workDuration, shortBreakDuration, longBreakDuration, setDurations } = useTimerStore()
  const {
    alarmSound, setAlarmSound,
    workAmbience, setWorkAmbience,
    shortBreakAmbience, setShortBreakAmbience,
    longBreakAmbience, setLongBreakAmbience,
    playPreview
  } = useSoundStore()
  const [activeTab, setActiveTab] = useState('timer')

  // Selection Mode state for drill-down navigation
  const [selectionMode, setSelectionMode] = useState<{
    type: 'alarm' | 'work' | 'short' | 'long',
    title: string,
    options: { id: string, label: string }[],
    current: string,
    onSelect: (id: string) => void
  } | null>(null)

  // Local state for inputs (in minutes)
  const [work, setWork] = useState(25)
  const [short, setShort] = useState(5)
  const [long, setLong] = useState(15)

  // Alarm options
  const alarms = [
    { id: 'basic-alarm.mp3', label: 'Basic' },
    { id: 'casio-alarm.mp3', label: 'Casio' },
    { id: 'clock-alarm.mp3', label: 'Clock' },
    { id: 'digital-alarm.mp3', label: 'Digital' },
    { id: 'dreamscape-alarm.mp3', label: 'Dreamscape' },
    { id: 'funny-alarm.mp3', label: 'Funny' },
    { id: 'gingle-alarm.mp3', label: 'Gingle' },
    { id: 'life-calm-alarm.mp3', label: 'Life Calm' },
    { id: 'lo-fi-gradual-alarm.mp3', label: 'Lo-Fi Gradual' },
    { id: 'oversimplified-alarm.mp3', label: 'Oversimplified' },
    { id: 'watch-alarm.mp3', label: 'Watch' },
  ]

  // Ambience options
  const ambienceOptions = [
    // Lofi
    { id: 'lofi/break.mp3', label: 'Lofi - Break' },
    { id: 'lofi/creative-time.mp3', label: 'Lofi - Creative Time' },
    { id: 'lofi/evening.mp3', label: 'Lofi - Evening' },
    { id: 'lofi/kawaii.mp3', label: 'Lofi - Kawaii' },
    { id: 'lofi/work.mp3', label: 'Lofi - Work' },
    // Nature
    { id: 'nature/birds-in-forest.mp3', label: 'Nature - Birds in Forest' },
    { id: 'nature/calming-rain.mp3', label: 'Nature - Calming Rain' },
    { id: 'nature/early-morning.mp3', label: 'Nature - Early Morning' },
    { id: 'nature/jungle.mp3', label: 'Nature - Jungle' },
    { id: 'nature/night.mp3', label: 'Nature - Night' },
    { id: 'nature/soothing-ocean-waves.mp3', label: 'Nature - Ocean Waves' },
    { id: 'nature/spring-forest-nature.mp3', label: 'Nature - Spring Forest' },
  ]

  useEffect(() => {
    if (isOpen) {
      setWork(Math.floor(workDuration / 60))
      setShort(Math.floor(shortBreakDuration / 60))
      setLong(Math.floor(longBreakDuration / 60))
    }
  }, [isOpen, workDuration, shortBreakDuration, longBreakDuration])

  const handleSave = () => {
    setDurations(work * 60, short * 60, long * 60)
    onClose()
  }

  if (!isOpen) return null

  const getThemeStyles = () => {
    switch (theme) {
      case 'oled':
        return {
          bg: 'bg-black border border-green-900',
          text: 'text-green-400',
          heading: 'text-green-500',
          input: 'bg-black border-green-900 text-green-400 focus:ring-green-500',
          button: 'bg-green-900 text-green-100 hover:bg-green-800',
          secondaryButton: 'text-green-600 hover:text-green-400',
          tabActive: 'bg-green-900/30 text-green-400 border-l-2 border-green-500',
          tabInactive: 'text-green-700 hover:bg-green-900/10',
          overlay: 'bg-black/80 backdrop-blur-sm',
          dropdown: 'bg-black border-green-900',
          dropdownItemActive: 'bg-green-900/30 text-green-400',
          dropdownItemInactive: 'text-green-700 hover:bg-green-900/20 hover:text-green-500',
          listItem: 'border-b border-green-900/50 hover:bg-green-900/20'
        }
      case 'e-ink':
        return {
          bg: 'bg-white border border-gray-200 shadow-xl',
          text: 'text-gray-900',
          heading: 'text-gray-900',
          input: 'bg-white border-gray-300 text-gray-900 focus:ring-gray-900',
          button: 'bg-gray-900 text-white hover:bg-gray-700',
          secondaryButton: 'text-gray-500 hover:text-gray-900',
          tabActive: 'bg-gray-100 text-gray-900 border-l-2 border-gray-900',
          tabInactive: 'text-gray-500 hover:bg-gray-50',
          overlay: 'bg-white/50 backdrop-blur-sm',
          dropdown: 'bg-white border-gray-200',
          dropdownItemActive: 'bg-gray-100 text-gray-900',
          dropdownItemInactive: 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
          listItem: 'border-b border-gray-100 hover:bg-gray-50'
        }
      default: // dark
        return {
          bg: 'bg-zinc-900 border border-zinc-800 shadow-2xl',
          text: 'text-zinc-300',
          heading: 'text-white',
          input: 'bg-zinc-800 border-zinc-700 text-white focus:ring-emerald-500',
          button: 'bg-emerald-600 text-white hover:bg-emerald-500',
          secondaryButton: 'text-zinc-500 hover:text-zinc-300',
          tabActive: 'bg-zinc-800 text-white border-l-2 border-emerald-500',
          tabInactive: 'text-zinc-500 hover:bg-zinc-800/50',
          overlay: 'bg-black/60 backdrop-blur-sm',
          dropdown: 'bg-zinc-900 border-zinc-800',
          dropdownItemActive: 'bg-zinc-800 text-white',
          dropdownItemInactive: 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
          listItem: 'border-b border-zinc-800 hover:bg-zinc-800/50'
        }
    }
  }

  const styles = getThemeStyles()

  const getLabel = (id: string, list: { id: string, label: string }[]) => list.find(a => a.id === id)?.label || 'Select'

  const openSelection = (
    type: 'alarm' | 'work' | 'short' | 'long',
    title: string,
    options: { id: string, label: string }[],
    current: string,
    onSelect: (id: string) => void
  ) => {
    setSelectionMode({ type, title, options, current, onSelect })
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${styles.overlay}`}>
      <div className={`w-full max-w-2xl h-[500px] mx-4 rounded-2xl flex flex-col md:flex-row overflow-hidden ${styles.bg}`}>

        {/* Sidebar / Top Navigation */}
        <div className={`w-full md:w-48 flex flex-row md:flex-col border-b md:border-b-0 md:border-r ${theme === 'e-ink' ? 'border-gray-200' : theme === 'oled' ? 'border-green-900' : 'border-zinc-800'}`}>
          <div className="p-4 md:p-6 flex items-center justify-between md:block">
            <h2 className={`text-lg md:text-xl font-bold ${styles.heading}`}>Settings</h2>
            <button onClick={onClose} className={`md:hidden ${styles.secondaryButton}`}>
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
            <button
              onClick={() => { setActiveTab('timer'); setSelectionMode(null); }}
              className={`flex-1 md:flex-none px-4 md:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'timer' ? styles.tabActive : styles.tabInactive}`}
            >
              <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3">
                <Clock size={16} />
                Timer
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('sound'); setSelectionMode(null); }}
              className={`flex-1 md:flex-none px-4 md:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'sound' ? styles.tabActive : styles.tabInactive}`}
            >
              <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3">
                <Volume2 size={16} />
                Sound
              </div>
            </button>
          </nav>
        </div>

        {/* Content Area with Sliding Views */}
        <div className="flex-1 relative overflow-hidden flex flex-col">

          {/* Main Settings View */}
          <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out ${selectionMode ? '-translate-x-full' : 'translate-x-0'}`}>
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-medium ${styles.heading}`}>
                  {activeTab === 'timer' ? 'Timer Settings' : 'Sound Settings'}
                </h3>
                <button onClick={onClose} className={styles.secondaryButton}>
                  <X size={20} />
                </button>
              </div>

              {activeTab === 'timer' && (
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex flex-col gap-2">
                      <label className={`text-sm font-medium ${styles.text}`}>Work Duration (minutes)</label>
                      <input
                        type="number"
                        value={work}
                        onChange={(e) => setWork(Number(e.target.value))}
                        className={`px-4 py-2 rounded-lg border outline-none focus:ring-2 transition-all ${styles.input}`}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={`text-sm font-medium ${styles.text}`}>Short Break (minutes)</label>
                      <input
                        type="number"
                        value={short}
                        onChange={(e) => setShort(Number(e.target.value))}
                        className={`px-4 py-2 rounded-lg border outline-none focus:ring-2 transition-all ${styles.input}`}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={`text-sm font-medium ${styles.text}`}>Long Break (minutes)</label>
                      <input
                        type="number"
                        value={long}
                        onChange={(e) => setLong(Number(e.target.value))}
                        className={`px-4 py-2 rounded-lg border outline-none focus:ring-2 transition-all ${styles.input}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sound' && (
                <div className="space-y-8">
                  {/* Alarm Section */}
                  <div className="space-y-4">
                    <h4 className={`text-sm font-semibold uppercase tracking-wider ${styles.text}`}>Alarm</h4>
                    <div className="flex flex-col gap-2">
                      <label className={`text-sm font-medium ${styles.text}`}>Alarm Sound</label>
                      <button
                        onClick={() => openSelection('alarm', 'Alarm Sound', alarms, alarmSound, setAlarmSound)}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border outline-none focus:ring-2 transition-all ${styles.input}`}
                      >
                        <span>{getLabel(alarmSound, alarms)}</span>
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Ambience Section */}
                  <div className="space-y-4">
                    <h4 className={`text-sm font-semibold uppercase tracking-wider ${styles.text}`}>Ambience</h4>

                    <div className="flex flex-col gap-2">
                      <label className={`text-sm font-medium ${styles.text}`}>Work Ambience</label>
                      <button
                        onClick={() => openSelection('work', 'Work Ambience', ambienceOptions, workAmbience, setWorkAmbience)}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border outline-none focus:ring-2 transition-all ${styles.input}`}
                      >
                        <span>{getLabel(workAmbience, ambienceOptions)}</span>
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className={`text-sm font-medium ${styles.text}`}>Short Break Ambience</label>
                      <button
                        onClick={() => openSelection('short', 'Short Break Ambience', ambienceOptions, shortBreakAmbience, setShortBreakAmbience)}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border outline-none focus:ring-2 transition-all ${styles.input}`}
                      >
                        <span>{getLabel(shortBreakAmbience, ambienceOptions)}</span>
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className={`text-sm font-medium ${styles.text}`}>Long Break Ambience</label>
                      <button
                        onClick={() => openSelection('long', 'Long Break Ambience', ambienceOptions, longBreakAmbience, setLongBreakAmbience)}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border outline-none focus:ring-2 transition-all ${styles.input}`}
                      >
                        <span>{getLabel(longBreakAmbience, ambienceOptions)}</span>
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`p-6 border-t flex justify-end gap-3 ${theme === 'e-ink' ? 'border-gray-200' : theme === 'oled' ? 'border-green-900' : 'border-zinc-800'}`}>
              <button onClick={onClose} className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${styles.secondaryButton}`}>
                Cancel
              </button>
              <button onClick={handleSave} className={`cursor-pointer px-6 py-2 rounded-lg text-sm font-medium transition-colors ${styles.button}`}>
                Save Changes
              </button>
            </div>
          </div>

          {/* Selection View (Drill-down) */}
          <div className={`absolute inset-0 flex flex-col bg-inherit transition-transform duration-300 ease-in-out ${selectionMode ? 'translate-x-0' : 'translate-x-full'}`}>
            {selectionMode && (
              <>
                <div className="p-6 border-b border-inherit flex items-center gap-3">
                  <button
                    onClick={() => setSelectionMode(null)}
                    className={`p-1 rounded-full hover:bg-black/10 transition-colors ${styles.text}`}
                  >
                    <ChevronDown size={20} className="rotate-90" />
                  </button>
                  <h3 className={`text-lg font-medium ${styles.heading}`}>{selectionMode.title}</h3>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {selectionMode.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        selectionMode.onSelect(opt.id)
                        playPreview(opt.id, selectionMode.type === 'alarm' ? 'alarm' : 'ambience')
                        setSelectionMode({ ...selectionMode, current: opt.id })
                      }}
                      className={`w-full text-left px-6 py-4 text-sm transition-colors flex items-center justify-between ${styles.listItem} ${selectionMode.current === opt.id ? styles.dropdownItemActive : styles.dropdownItemInactive}`}
                    >
                      <span>{opt.label}</span>
                      {selectionMode.current === opt.id && <div className="w-2 h-2 rounded-full bg-current" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
