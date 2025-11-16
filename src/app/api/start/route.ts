import { NextResponse } from 'next/server'
import { timerStore } from '@/lib/serverStore'

export async function POST() {
  timerStore.start()
  return NextResponse.json({ ok: true, running: true })
}