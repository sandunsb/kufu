import { NextResponse } from 'next/server'
// import { timerStore } from '@/lib/serverStore'

import { useTimerStore } from '@/stores/useTimerStore'
const timerStore = useTimerStore.getState()

export async function POST() {
  timerStore.start()
  return NextResponse.json({ ok: true, running: true })
}