import { NextResponse } from 'next/server'
// import { timerStore } from '@/lib/serverStore'

import { useTimerStore } from '@/stores/useTimerStore'
const timerStore = useTimerStore.getState()

export async function GET() {
  const s = timerStore
  return NextResponse.json({
    phase: s.phase,
    secondsLeft: s.secondsLeft,
    isRunning: s.isRunning,
    cycle: s.cycle,
  })
}