import { useTimerStore } from '@/stores/useTimerStore'

// initialise once and export that instance
export const timerStore = useTimerStore.getState()